// 設定の保存と読み込み (LocalStorage)
const STORAGE_KEY = 'kasa_app_settings';

const DEFAULT_SETTINGS = {
  kanjiLevel: 'kana', // 'kana' (小学2年ひらがな中心), 'grade3' (小学3年漢字), 'adult' (一般)
  ruby: true,         // ふりがな表示
  sound: true,        // 効果音
  animSpeed: 'normal',// 'normal', 'slow', 'fast'
  lastDifficulty: 2,  // 1:やさしい, 2:ふつう, 3:むずかしい, 4:はってん
};

export function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (e) {
    console.warn('Failed to load settings:', e);
    return { ...DEFAULT_SETTINGS };
  }
}

export function saveSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.warn('Failed to save settings:', e);
  }
}
