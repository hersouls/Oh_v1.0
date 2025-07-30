// 로컬 스토리지 키 상수
export const STORAGE_KEYS = {
  PLAYER_STATE: 'moonwave_player_state',
  USER_SETTINGS: 'moonwave_user_settings',
  THEME: 'moonwave_theme',
  LANGUAGE: 'moonwave_language',
  FIRST_VISIT: 'moonwave_first_visit',
} as const;

// 로컬 스토리지에 데이터 저장
export const setStorageItem = <T>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error(`Failed to save to localStorage: ${key}`, error);
    }
  }
};

// 로컬 스토리지에서 데이터 가져오기
export const getStorageItem = <T>(key: string, defaultValue?: T): T | null => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue || null;
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error(`Failed to read from localStorage: ${key}`, error);
    }
    return defaultValue || null;
  }
};

// 로컬 스토리지에서 데이터 삭제
export const removeStorageItem = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error(`Failed to remove from localStorage: ${key}`, error);
    }
  }
};

// 로컬 스토리지 전체 삭제
export const clearStorage = (): void => {
  try {
    localStorage.clear();
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Failed to clear localStorage', error);
    }
  }
};

// 플레이어 상태 저장
export const savePlayerState = (state: Record<string, unknown>): void => {
  setStorageItem(STORAGE_KEYS.PLAYER_STATE, state);
};

// 플레이어 상태 불러오기
export const loadPlayerState = (): Record<string, unknown> | null => {
  return getStorageItem(STORAGE_KEYS.PLAYER_STATE, null);
};

// 사용자 설정 저장
export const saveUserSettings = (settings: Record<string, unknown>): void => {
  setStorageItem(STORAGE_KEYS.USER_SETTINGS, settings);
};

// 사용자 설정 불러오기
export const loadUserSettings = (): Record<string, unknown> => {
  const settings = getStorageItem(STORAGE_KEYS.USER_SETTINGS, {
    autoPlay: false,
    crossfade: false,
    highQuality: true,
    downloadEnabled: true,
    notifications: true,
  });
  return settings || {
    autoPlay: false,
    crossfade: false,
    highQuality: true,
    downloadEnabled: true,
    notifications: true,
  };
};

// 테마 저장
export const saveTheme = (theme: string): void => {
  setStorageItem(STORAGE_KEYS.THEME, theme);
};

// 테마 불러오기
export const loadTheme = (): string => {
  const theme = getStorageItem(STORAGE_KEYS.THEME, 'auto');
  return theme || 'auto';
};

// 언어 설정 저장
export const saveLanguage = (language: string): void => {
  setStorageItem(STORAGE_KEYS.LANGUAGE, language);
};

// 언어 설정 불러오기
export const loadLanguage = (): string => {
  const language = getStorageItem(STORAGE_KEYS.LANGUAGE, 'ko');
  return language || 'ko';
};

// 첫 방문 여부 확인
export const isFirstVisit = (): boolean => {
  const firstVisit = getStorageItem(STORAGE_KEYS.FIRST_VISIT, true);
  if (firstVisit) {
    setStorageItem(STORAGE_KEYS.FIRST_VISIT, false);
  }
  return firstVisit || false;
};