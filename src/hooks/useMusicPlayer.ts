import { useState, useRef, useEffect, useCallback } from "react";
import { Howl } from "howler";
import { Track, MusicState, PlayMode } from "../types";
import { tracks } from "../data/tracks";

export const useMusicPlayer = () => {
  const [musicState, setMusicState] = useState<MusicState>({
    currentTrack: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    playlist: tracks,
    currentIndex: -1,
    playMode: 'sequential', // 초기 모드를 전체재생(sequential)으로 설정
    shuffledPlaylist: [],
  });

  const soundRef = useRef<Howl | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 음악 파일 접근 가능성 확인
  const checkAudioFileAccess = async (url: string) => {
    try {
      const response = await fetch(url, { method: 'HEAD' });
      console.log('🎵 파일 접근 확인:', url, response.status);
      return response.ok;
    } catch (error) {
      console.error('🎵 파일 접근 오류:', url, error);
      return false;
    }
  };

  // 브라우저 자동 재생 정책 우회를 위한 사용자 상호작용 감지
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  useEffect(() => {
    const handleUserInteraction = () => {
      if (!hasUserInteracted) {
        console.log('🎵 사용자 상호작용 감지됨');
        setHasUserInteracted(true);
      }
    };

    document.addEventListener('click', handleUserInteraction);
    document.addEventListener('keydown', handleUserInteraction);
    document.addEventListener('touchstart', handleUserInteraction);
    document.addEventListener('mousedown', handleUserInteraction);

    return () => {
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('keydown', handleUserInteraction);
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('mousedown', handleUserInteraction);
    };
  }, [hasUserInteracted]);

  // 현재 플레이리스트에서 다음 트랙 가져오기
  const getNextTrack = useCallback(() => {
    // 현재 트랙이 없으면 null 반환
    if (!musicState.currentTrack) {
      console.log('🎵 현재 트랙이 없음');
      return null;
    }
    
    console.log(`🎵 getNextTrack - 현재 재생 모드: ${musicState.playMode}`);
    
    if (musicState.playMode === 'repeat-one') {
      console.log('🎵 repeat-one 모드: 현재 트랙 반복');
      return musicState.currentTrack;
    }
    
    if (musicState.playMode === 'shuffle') {
      // 셔플 모드: 현재 곡 이후 랜덤으로 재생
      const currentPlaylist = musicState.shuffledPlaylist.length > 0 
        ? musicState.shuffledPlaylist 
        : tracks;
      
      // 현재 트랙의 인덱스를 셔플된 플레이리스트에서 찾기
      const currentIndex = currentPlaylist.findIndex(t => t.id === musicState.currentTrack?.id);
      if (currentIndex === -1) {
        console.log('🎵 현재 트랙이 셔플 플레이리스트에 없음');
        return currentPlaylist[0] || null;
      }
      
      // 현재 트랙 이후의 랜덤 트랙 선택
      const remainingTracks = currentPlaylist.slice(currentIndex + 1);
      if (remainingTracks.length > 0) {
        const randomIndex = Math.floor(Math.random() * remainingTracks.length);
        const nextTrack = remainingTracks[randomIndex];
        console.log(`🎵 셔플 모드 - 랜덤 다음 트랙: ${nextTrack.title}`);
        return nextTrack;
      } else {
        // 남은 트랙이 없으면 처음부터 랜덤 선택
        const randomIndex = Math.floor(Math.random() * currentPlaylist.length);
        const nextTrack = currentPlaylist[randomIndex];
        console.log(`🎵 셔플 모드 - 처음부터 랜덤 선택: ${nextTrack.title}`);
        return nextTrack;
      }
    }
    
    // sequential 모드: 현재 곡 이후 다음 순서 곡 자동재생
    const currentIndex = tracks.findIndex(t => t.id === musicState.currentTrack?.id);
    if (currentIndex === -1) {
      console.log('🎵 현재 트랙이 플레이리스트에 없음');
      return tracks[0] || null;
    }
    
    const nextIndex = (currentIndex + 1) % tracks.length;
    const nextTrack = tracks[nextIndex];
    console.log(`🎵 sequential 모드 - 다음 순서 트랙: ${nextTrack?.title} (인덱스: ${nextIndex})`);
    return nextTrack;
  }, [musicState.currentTrack, musicState.playMode, musicState.shuffledPlaylist]);

  // 트랙 변경 시 Howler 인스턴스 생성 및 재생
  useEffect(() => {
    if (musicState.currentTrack) {
      console.log('🎵 트랙 변경됨:', musicState.currentTrack.title);
      console.log('🎵 트랙 URL:', musicState.currentTrack.url);
      
      // 기존 Howler 인스턴스 정리
      if (soundRef.current) {
        soundRef.current.stop();
        soundRef.current.unload();
      }
      
      // 파일 접근 확인
      checkAudioFileAccess(musicState.currentTrack.url).then((isAccessible) => {
        if (!isAccessible) {
          console.error('🎵 파일에 접근할 수 없음:', musicState.currentTrack.url);
          return;
        }
        
        console.log('🎵 파일 접근 가능, Howler 인스턴스 생성');
        
        // 새로운 Howler 인스턴스 생성
        soundRef.current = new Howl({
          src: [musicState.currentTrack.url],
          html5: true,
          preload: true,
          format: ['mp3'],
          volume: musicState.volume,
          onload: () => {
            console.log('🎵 음악 로드 완료:', musicState.currentTrack?.title);
            setMusicState(prev => ({ ...prev, duration: soundRef.current?.duration() || 0 }));
          },
          onloaderror: (id, error) => {
            console.error('🎵 음악 로드 오류:', musicState.currentTrack?.title, error);
            console.error('🎵 오류 상세:', error);
          },
          onplay: () => {
            console.log('🎵 음악 재생 시작:', musicState.currentTrack?.title);
          },
          onpause: () => {
            console.log('🎵 음악 일시정지:', musicState.currentTrack?.title);
          },
          onstop: () => {
            console.log('🎵 음악 정지:', musicState.currentTrack?.title);
          },
          onend: () => {
            console.log('🎵 음악 재생 완료:', musicState.currentTrack?.title);
            // 자동으로 다음 트랙 재생
            const nextTrack = getNextTrack();
            if (nextTrack) {
              playTrack(nextTrack);
            }
          },
          onplayerror: (id, error) => {
            console.error('🎵 음악 재생 오류:', musicState.currentTrack?.title, error);
            console.error('🎵 재생 오류 상세:', error);
            // 재생 오류 시 다시 시도
            if (soundRef.current) {
              soundRef.current.once('unlock', () => {
                console.log('🎵 unlock 이벤트 발생, 재생 재시도');
                soundRef.current?.play();
              });
            }
          }
        });
      });
    }

    return () => {
      if (soundRef.current) {
        soundRef.current.stop();
        soundRef.current.unload();
      }
    };
  }, [musicState.currentTrack?.id, getNextTrack, musicState]);

  // 재생 상태 변경 시 실제 재생/일시정지
  useEffect(() => {
    if (soundRef.current) {
      if (musicState.isPlaying) {
        console.log('🎵 재생 시도:', musicState.currentTrack?.title);
        console.log('🎵 사용자 상호작용 상태:', hasUserInteracted);
        
        // 브라우저 자동 재생 정책을 우회하기 위한 여러 방법 시도
        const playAudio = () => {
          try {
            const result = soundRef.current?.play();
            console.log('🎵 재생 시도 결과:', result);
            
            // Promise를 반환하는 경우 처리
            if (result && typeof result.then === 'function') {
              result.then(() => {
                console.log('🎵 재생 성공 (Promise)');
              }).catch((error) => {
                console.error('🎵 재생 실패 (Promise):', error);
                // unlock 이벤트 대기
                soundRef.current?.once('unlock', () => {
                  console.log('🎵 unlock 이벤트 발생, 재생 재시도');
                  soundRef.current?.play();
                });
              });
            } else {
              console.log('🎵 재생 성공 (동기)');
            }
          } catch (error) {
            console.error('🎵 재생 실패 (동기):', error);
            // unlock 이벤트 대기
            soundRef.current?.once('unlock', () => {
              console.log('🎵 unlock 이벤트 발생, 재생 재시도');
              soundRef.current?.play();
            });
          }
        };
        
        // 사용자 상호작용이 있었거나 강제 재생 시도
        if (hasUserInteracted) {
          playAudio();
        } else {
          console.log('🎵 사용자 상호작용 대기 중...');
          // unlock 이벤트 대기
          soundRef.current.once('unlock', () => {
            console.log('🎵 unlock 이벤트 발생, 재생 시작');
            playAudio();
          });
        }
      } else {
        console.log('🎵 일시정지:', musicState.currentTrack?.title);
        soundRef.current.pause();
      }
    } else {
      console.log('🎵 soundRef가 null임');
    }
  }, [musicState.isPlaying, hasUserInteracted]);

  // 볼륨 변경 시 적용
  useEffect(() => {
    if (soundRef.current) {
      soundRef.current.volume(musicState.volume);
    }
  }, [musicState.volume]);

  // 현재 시간 업데이트
  useEffect(() => {
    if (musicState.isPlaying && soundRef.current) {
      intervalRef.current = setInterval(() => {
        if (soundRef.current) {
          const currentTime = soundRef.current.seek();
          setMusicState(prev => ({ ...prev, currentTime }));
        }
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [musicState.isPlaying]);

  const setCurrentTrack = (track: Track) => {
    const index = tracks.findIndex(t => t.id === track.id);
    setMusicState(prev => ({
      ...prev,
      currentTrack: track,
      currentIndex: index,
      currentTime: 0,
      // isPlaying은 변경하지 않음 (기존 재생 상태 유지)
    }));
  };

  const togglePlay = () => {
    if (musicState.currentTrack) {
      console.log('🎵 togglePlay 호출됨');
      console.log('🎵 현재 재생 상태:', musicState.isPlaying);
      console.log('🎵 현재 트랙:', musicState.currentTrack.title);
      setMusicState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
    } else {
      console.log('🎵 togglePlay: 현재 트랙이 없음');
    }
  };

  const playTrack = (track: Track) => {
    console.log('🎵 playTrack 함수 호출:', track.title);
    console.log('🎵 트랙 URL:', track.url);
    
    // 현재 재생 중인 트랙 중지
    if (soundRef.current) {
      soundRef.current.stop();
    }
    
    setCurrentTrack(track);
    
    // 브라우저 자동 재생 정책을 우회하기 위해 사용자 상호작용 후 재생
    const startPlayback = () => {
      console.log('🎵 재생 상태를 true로 설정');
      setMusicState(prev => ({ ...prev, isPlaying: true }));
    };
    
    // 즉시 재생 시도
    startPlayback();
  };

  const nextTrack = () => {
    console.log('🎵 nextTrack 함수 호출됨');
    
    // 현재 트랙이 없으면 첫 번째 트랙 재생
    if (!musicState.currentTrack) {
      console.log('🎵 현재 트랙이 없어서 첫 번째 트랙 재생');
      const firstTrack = tracks[0];
      if (firstTrack) {
        playTrack(firstTrack);
      }
      return;
    }
    
    const nextTrack = getNextTrack();
    console.log('🎵 다음 트랙:', nextTrack?.title);
    if (nextTrack) {
      // 현재 재생 중인 트랙 중지
      if (soundRef.current) {
        soundRef.current.stop();
      }
      
      // 재생 모드에 따라 인덱스 계산
      let nextIndex = -1;
      if (musicState.playMode === 'shuffle') {
        const currentPlaylist = musicState.shuffledPlaylist.length > 0 
          ? musicState.shuffledPlaylist 
          : tracks;
        nextIndex = currentPlaylist.findIndex(t => t.id === nextTrack.id);
      } else {
        nextIndex = tracks.findIndex(t => t.id === nextTrack.id);
      }
      
      console.log(`🎵 다음 트랙으로 이동: ${nextTrack.title} (${nextIndex + 1}/${musicState.playMode === 'shuffle' ? (musicState.shuffledPlaylist.length || tracks.length) : tracks.length}) - 모드: ${musicState.playMode}`);
      
      // 상태 업데이트 후 강제로 재생 상태 설정
      setMusicState(prev => ({
        ...prev,
        currentTrack: nextTrack,
        currentIndex: nextIndex,
        currentTime: 0,
        isPlaying: true, // 자동재생 활성화
      }));
      
      // 추가로 Howl 인스턴스가 준비되면 재생 시작
      setTimeout(() => {
        if (soundRef.current) {
          soundRef.current.play();
        }
      }, 100);
    } else {
      console.log('🎵 다음 트랙을 찾을 수 없음');
    }
  };

  const previousTrack = () => {
    console.log('🎵 previousTrack 함수 호출됨');
    
    // 현재 트랙이 없으면 마지막 트랙 재생
    if (!musicState.currentTrack) {
      console.log('🎵 현재 트랙이 없어서 마지막 트랙 재생');
      const lastTrack = tracks[tracks.length - 1];
      if (lastTrack) {
        playTrack(lastTrack);
      }
      return;
    }
    
    const prevTrack = getPreviousTrack();
    console.log('🎵 이전 트랙:', prevTrack?.title);
    if (prevTrack) {
      // 현재 재생 중인 트랙 중지
      if (soundRef.current) {
        soundRef.current.stop();
      }
      
      // 재생 모드에 따라 인덱스 계산
      let prevIndex = -1;
      if (musicState.playMode === 'shuffle') {
        const currentPlaylist = musicState.shuffledPlaylist.length > 0 
          ? musicState.shuffledPlaylist 
          : tracks;
        prevIndex = currentPlaylist.findIndex(t => t.id === prevTrack.id);
      } else {
        prevIndex = tracks.findIndex(t => t.id === prevTrack.id);
      }
      
      console.log(`🎵 이전 트랙으로 이동: ${prevTrack.title} (${prevIndex + 1}/${musicState.playMode === 'shuffle' ? (musicState.shuffledPlaylist.length || tracks.length) : tracks.length}) - 모드: ${musicState.playMode}`);
      
      // 상태 업데이트 후 강제로 재생 상태 설정
      setMusicState(prev => ({
        ...prev,
        currentTrack: prevTrack,
        currentIndex: prevIndex,
        currentTime: 0,
        isPlaying: true, // 자동재생 활성화
      }));
      
      // 추가로 Howl 인스턴스가 준비되면 재생 시작
      setTimeout(() => {
        if (soundRef.current) {
          soundRef.current.play();
        }
      }, 100);
    } else {
      console.log('🎵 이전 트랙을 찾을 수 없음');
    }
  };

  const setVolume = (volume: number) => {
    setMusicState(prev => ({ ...prev, volume }));
  };

  const setCurrentTime = (time: number) => {
    if (soundRef.current) {
      soundRef.current.seek(time);
      setMusicState(prev => ({ ...prev, currentTime: time }));
    }
  };

  const setDuration = (duration: number) => {
    setMusicState(prev => ({ ...prev, duration }));
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // 재생 모드 변경 (전체재생 → 반복재생 → 랜덤재생 순환)
  const togglePlayMode = () => {
    console.log('🎵 togglePlayMode 함수 호출됨');
    console.log('🎵 현재 재생 모드:', musicState.playMode);
    
    setMusicState(prev => {
      // 재생 모드 순환: sequential → repeat-one → shuffle
      const playModes: PlayMode[] = ['sequential', 'repeat-one', 'shuffle'];
      const currentIndex = playModes.indexOf(prev.playMode);
      const nextIndex = (currentIndex + 1) % playModes.length;
      const newMode = playModes[nextIndex];
      
      console.log(`🎵 재생 모드 변경: ${prev.playMode} → ${newMode}`);
      console.log(`🎵 인덱스: ${currentIndex} → ${nextIndex}`);
      
      // 셔플 모드로 변경 시 셔플된 플레이리스트 생성
      let shuffledPlaylist = prev.shuffledPlaylist;
      if (newMode === 'shuffle' && prev.shuffledPlaylist.length === 0) {
        shuffledPlaylist = [...tracks].sort(() => Math.random() - 0.5);
        console.log('🎵 셔플 플레이리스트 생성됨');
      }
      
      // 새로운 플레이리스트에서 현재 트랙 찾기
      let newCurrentTrack = prev.currentTrack;
      let newCurrentIndex = prev.currentIndex;
      
      if (newMode === 'shuffle') {
        // 셔플 모드로 변경 시 현재 트랙이 셔플된 플레이리스트에 있는지 확인
        const currentTrackInShuffled = shuffledPlaylist.find(t => t.id === prev.currentTrack?.id);
        if (!currentTrackInShuffled && prev.currentTrack) {
          newCurrentTrack = shuffledPlaylist[0];
          newCurrentIndex = 0;
          console.log(`🎵 현재 트랙이 셔플 플레이리스트에 없어서 ${newCurrentTrack?.title}로 변경`);
        }
      } else {
        // sequential 또는 repeat-one 모드로 변경 시 원본 플레이리스트에서 현재 트랙 찾기
        const currentTrackInOriginal = tracks.find(t => t.id === prev.currentTrack?.id);
        if (!currentTrackInOriginal && prev.currentTrack) {
          newCurrentTrack = tracks[0];
          newCurrentIndex = 0;
          console.log(`🎵 현재 트랙이 원본 플레이리스트에 없어서 ${newCurrentTrack?.title}로 변경`);
        }
      }
      
      return {
        ...prev,
        playMode: newMode,
        shuffledPlaylist,
        currentTrack: newCurrentTrack,
        currentIndex: newCurrentIndex,
      };
    });
  };

  // 각 모드별 설정 함수
  const setSequentialMode = () => {
    setMusicState(prev => ({
      ...prev,
      playMode: 'sequential',
    }));
  };

  const setRepeatOneMode = () => {
    setMusicState(prev => ({
      ...prev,
      playMode: 'repeat-one',
    }));
  };

  const setShuffleMode = () => {
    setMusicState(prev => {
      // 셔플된 플레이리스트 생성
      const shuffledPlaylist = [...tracks].sort(() => Math.random() - 0.5);
      return {
        ...prev,
        playMode: 'shuffle',
        shuffledPlaylist,
      };
    });
  };

  // 현재 플레이리스트에서 이전 트랙 가져오기
  const getPreviousTrack = () => {
    // 현재 트랙이 없으면 null 반환
    if (!musicState.currentTrack) {
      console.log('🎵 현재 트랙이 없음');
      return null;
    }
    
    console.log(`🎵 getPreviousTrack - 현재 재생 모드: ${musicState.playMode}`);
    
    if (musicState.playMode === 'repeat-one') {
      console.log('🎵 repeat-one 모드: 현재 트랙 반복');
      return musicState.currentTrack;
    }
    
    if (musicState.playMode === 'shuffle') {
      // 셔플 모드: 현재 곡 이전의 랜덤 트랙 선택
      const currentPlaylist = musicState.shuffledPlaylist.length > 0 
        ? musicState.shuffledPlaylist 
        : tracks;
      
      // 현재 트랙의 인덱스를 셔플된 플레이리스트에서 찾기
      const currentIndex = currentPlaylist.findIndex(t => t.id === musicState.currentTrack?.id);
      if (currentIndex === -1) {
        console.log('🎵 현재 트랙이 셔플 플레이리스트에 없음');
        return currentPlaylist[currentPlaylist.length - 1] || null;
      }
      
      // 현재 트랙 이전의 랜덤 트랙 선택
      const previousTracks = currentPlaylist.slice(0, currentIndex);
      if (previousTracks.length > 0) {
        const randomIndex = Math.floor(Math.random() * previousTracks.length);
        const prevTrack = previousTracks[randomIndex];
        console.log(`🎵 셔플 모드 - 랜덤 이전 트랙: ${prevTrack.title}`);
        return prevTrack;
      } else {
        // 이전 트랙이 없으면 전체에서 랜덤 선택
        const randomIndex = Math.floor(Math.random() * currentPlaylist.length);
        const prevTrack = currentPlaylist[randomIndex];
        console.log(`🎵 셔플 모드 - 전체에서 랜덤 선택: ${prevTrack.title}`);
        return prevTrack;
      }
    }
    
    // sequential 모드: 현재 곡 이전 순서 곡
    const currentIndex = tracks.findIndex(t => t.id === musicState.currentTrack?.id);
    if (currentIndex === -1) {
      console.log('🎵 현재 트랙이 플레이리스트에 없음');
      return tracks[tracks.length - 1] || null;
    }
    
    const prevIndex = currentIndex === 0 
      ? tracks.length - 1 
      : currentIndex - 1;
    const prevTrack = tracks[prevIndex];
    console.log(`🎵 sequential 모드 - 이전 순서 트랙: ${prevTrack?.title} (인덱스: ${prevIndex})`);
    return prevTrack;
  };

  return {
    ...musicState,
    setCurrentTrack,
    togglePlay,
    playTrack,
    nextTrack,
    previousTrack,
    setVolume,
    setCurrentTime,
    setDuration,
    formatTime,
    togglePlayMode,
    setSequentialMode,
    setRepeatOneMode,
    setShuffleMode,
  };
};