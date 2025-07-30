import { SyncLine } from '@/types';

/**
 * 가사 텍스트를 SyncLine 배열로 변환
 * @param lyricsText 가사 텍스트 (줄바꿈으로 구분)
 * @param startTime 시작 시간 (초)
 * @param lineDuration 각 라인의 기본 지속 시간 (초)
 * @returns SyncLine 배열
 */
export const parseLyricsToSyncLines = (
  lyricsText: string,
  startTime: number = 0,
  lineDuration: number = 3
): SyncLine[] => {
  const lines = lyricsText.trim().split('\n').filter(line => line.trim());
  
  return lines.map((line, index) => ({
    id: `line-${index}`,
    time: startTime + (index * lineDuration),
    startTime: startTime + (index * lineDuration),
    endTime: startTime + ((index + 1) * lineDuration),
    text: line.trim(),
    confidence: 0.5, // 기본 정확도
  }));
};

/**
 * LRC 형식의 가사 파일을 SyncLine 배열로 변환
 * @param lrcContent LRC 파일 내용
 * @returns SyncLine 배열
 */
export const parseLRCToSyncLines = (lrcContent: string): SyncLine[] => {
  const lines = lrcContent.trim().split('\n');
  const syncLines: SyncLine[] = [];
  
  lines.forEach((line, index) => {
    // LRC 형식: [mm:ss.xx]가사텍스트
    const timeMatch = line.match(/\[(\d{2}):(\d{2})\.(\d{2})\]/);
    if (timeMatch) {
      const minutes = parseInt(timeMatch[1] || '0');
      const seconds = parseInt(timeMatch[2] || '0');
      const centiseconds = parseInt(timeMatch[3] || '0');
      const startTime = minutes * 60 + seconds + centiseconds / 100;
      
      // 가사 텍스트 추출
      const text = line.replace(/\[\d{2}:\d{2}\.\d{2}\]/, '').trim();
      
      if (text) {
        syncLines.push({
          id: `line-${index}`,
          time: startTime,
          startTime,
          endTime: startTime + 3, // 기본 3초 지속
          text,
          confidence: 0.8, // LRC는 정확한 타이밍 정보를 제공
        });
      }
    }
  });
  
  // 시간순으로 정렬
  syncLines.sort((a, b) => (a.startTime || a.time) - (b.startTime || b.time));
  
  // endTime 조정 (다음 라인의 startTime으로 설정)
  for (let i = 0; i < syncLines.length - 1; i++) {
    if (syncLines[i] && syncLines[i + 1]) {
      const currentLine = syncLines[i];
      const nextLine = syncLines[i + 1];
      if (currentLine && nextLine) {
        currentLine.endTime = (nextLine.startTime || nextLine.time || 0);
      }
    }
  }
  
  return syncLines;
};

/**
 * SyncLine 배열을 LRC 형식으로 변환
 * @param syncLines SyncLine 배열
 * @returns LRC 형식 문자열
 */
export const convertSyncLinesToLRC = (syncLines: SyncLine[]): string => {
  return syncLines
    .map(line => {
      const startTime = line.startTime || line.time;
      const minutes = Math.floor(startTime / 60);
      const seconds = Math.floor(startTime % 60);
      const centiseconds = Math.floor((startTime % 1) * 100);
      
      const timeString = `[${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}]`;
      
      return `${timeString}${line.text}`;
    })
    .join('\n');
};

/**
 * 가사 타이밍 조정 (전체 오프셋)
 * @param syncLines SyncLine 배열
 * @param offset 조정할 시간 (초)
 * @returns 조정된 SyncLine 배열
 */
export const adjustLyricsTiming = (
  syncLines: SyncLine[],
  offset: number
): SyncLine[] => {
  return syncLines.map(line => ({
    ...line,
    time: Math.max(0, ((line?.time || line?.startTime) || 0) + offset),
    startTime: Math.max(0, (line.startTime || line.time) + offset),
    endTime: Math.max(0, (line.endTime || 0) + offset),
  }));
};

/**
 * 가사 타이밍 정확도 검증
 * @param syncLines SyncLine 배열
 * @returns 검증 결과
 */
export const validateLyricsTiming = (syncLines: SyncLine[]) => {
  const issues: string[] = [];
  
  if (syncLines.length === 0) {
    issues.push('가사가 없습니다.');
    return { isValid: false, issues };
  }
  
  // 시간 순서 검증
  for (let i = 0; i < syncLines.length - 1; i++) {
    const current = syncLines[i];
    const next = syncLines[i + 1];
    
    if (current && next) {
      const currentStartTime = current.startTime || current.time;
      const nextStartTime = next.startTime || next.time;
      const currentEndTime = current.endTime || 0;
      
      if (currentStartTime >= nextStartTime) {
        issues.push(`라인 ${i + 1}: 시작 시간이 다음 라인보다 늦거나 같습니다.`);
      }
      
      if (currentEndTime > nextStartTime) {
        issues.push(`라인 ${i + 1}: 끝 시간이 다음 라인 시작 시간과 겹칩니다.`);
      }
    }
  }
  
  // 음수 시간 검증
  syncLines.forEach((line, index) => {
    const startTime = line.startTime || line.time;
    const endTime = line.endTime || 0;
    
    if (startTime < 0) {
      issues.push(`라인 ${index + 1}: 시작 시간이 음수입니다.`);
    }
    if (endTime < 0) {
      issues.push(`라인 ${index + 1}: 끝 시간이 음수입니다.`);
    }
  });
  
  return {
    isValid: issues.length === 0,
    issues,
  };
};

/**
 * 가사 텍스트에서 특수 문자 제거 및 정규화
 * @param text 원본 텍스트
 * @returns 정규화된 텍스트
 */
export const normalizeLyricsText = (text: string): string => {
  return text
    .replace(/[^\w\s가-힣]/g, '') // 특수 문자 제거 (한글, 영문, 숫자, 공백만 유지)
    .replace(/\s+/g, ' ') // 연속된 공백을 하나로
    .trim();
};

/**
 * 가사 검색 기능
 * @param syncLines SyncLine 배열
 * @param searchTerm 검색어
 * @returns 검색 결과 (인덱스 배열)
 */
export const searchLyrics = (
  syncLines: SyncLine[],
  searchTerm: string
): number[] => {
  const normalizedSearchTerm = normalizeLyricsText(searchTerm.toLowerCase());
  
  return syncLines
    .map((line, index) => ({
      index,
      normalizedText: normalizeLyricsText(line.text.toLowerCase()),
    }))
    .filter(item => item.normalizedText.includes(normalizedSearchTerm))
    .map(item => item.index);
};

/**
 * 가사 통계 정보 계산
 * @param syncLines SyncLine 배열
 * @returns 통계 정보
 */
export const getLyricsStats = (syncLines: SyncLine[]) => {
  if (syncLines.length === 0) {
    return {
      totalLines: 0,
      totalDuration: 0,
      averageLineDuration: 0,
      totalCharacters: 0,
      averageCharactersPerLine: 0,
    };
  }
  
  const totalLines = syncLines.length;
  const lastLine = syncLines[syncLines.length - 1];
  const firstLine = syncLines[0];
  const totalDuration = (lastLine?.endTime || lastLine?.time || 0) - (firstLine?.startTime || firstLine?.time || 0);
  const averageLineDuration = totalDuration / totalLines;
  const totalCharacters = syncLines.reduce((sum, line) => sum + line.text.length, 0);
  const averageCharactersPerLine = totalCharacters / totalLines;
  
  return {
    totalLines,
    totalDuration,
    averageLineDuration,
    totalCharacters,
    averageCharactersPerLine,
  };
};

/**
 * 가사 데이터를 JSON 형식으로 내보내기
 * @param syncLines SyncLine 배열
 * @param trackInfo 트랙 정보
 * @returns JSON 문자열
 */
export const exportLyricsToJSON = (
  syncLines: SyncLine[],
  trackInfo: { title: string; artist: string }
): string => {
  const exportData = {
    track: trackInfo,
    lyrics: syncLines,
    exportDate: new Date().toISOString(),
    version: '1.0',
  };
  
  return JSON.stringify(exportData, null, 2);
};

/**
 * JSON 형식의 가사 데이터를 SyncLine 배열로 가져오기
 * @param jsonContent JSON 문자열
 * @returns SyncLine 배열
 */
export const importLyricsFromJSON = (jsonContent: string): SyncLine[] => {
  try {
    const data = JSON.parse(jsonContent);
    return data.lyrics || [];
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('JSON 파싱 오류:', error);
    }
    return [];
  }
};