// カサの妖精「ドロップくん」SVGレンダラー
// 小学生が親しみやすく、感情が伝わるリッチで愛らしいベクターアート

export function renderCharacterSVG(mood = 'happy', size = 80) {
  const isCheer = mood === 'cheer';
  const isSparkle = mood === 'sparkle';
  const isThink = mood === 'think';
  const isWink = mood === 'wink';

  return `
    <svg viewBox="0 0 100 100" width="${size}" height="${size}" class="character-svg mood-${mood}" role="img" aria-label="ドロップくん">
      <defs>
        <!-- 体のグラデーション -->
        <linearGradient id="dropBodyGrad_${mood}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#38bdf8"/>
          <stop offset="60%" stop-color="#0ea5e9"/>
          <stop offset="100%" stop-color="#0284c7"/>
        </linearGradient>
        <!-- ほっぺ -->
        <radialGradient id="cheekGrad">
          <stop offset="0%" stop-color="#fb7185" stop-opacity="0.9"/>
          <stop offset="100%" stop-color="#fb7185" stop-opacity="0"/>
        </radialGradient>
      </defs>

      <!-- 影 -->
      <ellipse cx="50" cy="94" rx="28" ry="5" fill="#0f172a" opacity="0.15"/>

      <!-- 手 (ポーズ別) -->
      ${isCheer ? `
        <!-- 両手バンザイ -->
        <path d="M 24 64 Q 10 40, 16 32" stroke="#38bdf8" stroke-width="6" stroke-linecap="round" fill="none"/>
        <circle cx="16" cy="32" r="5" fill="#38bdf8"/>
        <path d="M 76 64 Q 90 40, 84 32" stroke="#38bdf8" stroke-width="6" stroke-linecap="round" fill="none"/>
        <circle cx="84" cy="32" r="5" fill="#38bdf8"/>
      ` : isThink ? `
        <!-- 考え中 (片手をあごに) -->
        <path d="M 28 68 Q 20 75, 18 82" stroke="#38bdf8" stroke-width="5" stroke-linecap="round" fill="none"/>
        <circle cx="18" cy="82" r="4.5" fill="#38bdf8"/>
        <path d="M 72 68 Q 62 68, 56 74" stroke="#38bdf8" stroke-width="5" stroke-linecap="round" fill="none"/>
        <circle cx="56" cy="74" r="4.5" fill="#38bdf8"/>
      ` : `
        <!-- 通常・手を振る -->
        <path d="M 26 68 Q 18 74, 16 80" stroke="#38bdf8" stroke-width="5" stroke-linecap="round" fill="none"/>
        <circle cx="16" cy="80" r="4.5" fill="#38bdf8"/>
        <path d="M 74 68 Q 86 58, 88 50" stroke="#38bdf8" stroke-width="5" stroke-linecap="round" fill="none"/>
        <circle cx="88" cy="50" r="4.5" fill="#38bdf8"/>
      `}

      <!-- 水滴の体 -->
      <path d="M 50 10 C 32 40, 18 56, 18 72 A 32 32 0 0 0 82 72 C 82 56, 68 40, 50 10 Z" fill="url(#dropBodyGrad_${mood})" stroke="#0284c7" stroke-width="2.5" stroke-linejoin="round"/>
      
      <!-- 光沢ハイライト -->
      <path d="M 50 18 C 38 42, 28 54, 26 68 A 24 24 0 0 0 54 88 C 44 88, 30 76, 32 64 C 34 50, 42 36, 50 18 Z" fill="#ffffff" opacity="0.45"/>
      <circle cx="36" cy="46" r="4" fill="#ffffff" opacity="0.75"/>

      <!-- ほっぺ -->
      <ellipse cx="32" cy="72" rx="6" ry="4" fill="url(#cheekGrad)"/>
      <ellipse cx="68" cy="72" rx="6" ry="4" fill="url(#cheekGrad)"/>

      <!-- 目 -->
      ${isSparkle ? `
        <!-- 星目（ひらめき） -->
        <path d="M 38 58 L 40 64 L 46 64 L 41 68 L 43 74 L 38 70 L 33 74 L 35 68 L 30 64 L 36 64 Z" fill="#fbbf24"/>
        <path d="M 62 58 L 64 64 L 70 64 L 65 68 L 67 74 L 62 70 L 57 74 L 59 68 L 54 64 L 60 64 Z" fill="#fbbf24"/>
      ` : isWink ? `
        <!-- ウィンク -->
        <path d="M 32 64 Q 38 58, 44 64" stroke="#0f172a" stroke-width="3" stroke-linecap="round" fill="none"/>
        <circle cx="62" cy="63" r="5" fill="#0f172a"/>
        <circle cx="60" cy="61" r="2" fill="#ffffff"/>
      ` : isThink ? `
        <!-- 考え中 (上を見る) -->
        <ellipse cx="38" cy="60" rx="4.5" ry="5.5" fill="#0f172a"/>
        <circle cx="37" cy="58" r="2" fill="#ffffff"/>
        <ellipse cx="62" cy="60" rx="4.5" ry="5.5" fill="#0f172a"/>
        <circle cx="61" cy="58" r="2" fill="#ffffff"/>
      ` : `
        <!-- 通常のキラキラ笑顔の目 -->
        <circle cx="38" cy="63" r="5" fill="#0f172a"/>
        <circle cx="36" cy="61" r="2" fill="#ffffff"/>
        <circle cx="62" cy="63" r="5" fill="#0f172a"/>
        <circle cx="60" cy="61" r="2" fill="#ffffff"/>
      `}

      <!-- 口 -->
      ${isCheer || isSparkle ? `
        <!-- 大きく開けた喜びの口 -->
        <path d="M 44 72 Q 50 82, 56 72 Z" fill="#ef4444" stroke="#0f172a" stroke-width="2"/>
      ` : isThink ? `
        <!-- むむっとした小さな口 -->
        <ellipse cx="50" cy="74" rx="3" ry="3" fill="#0f172a"/>
      ` : `
        <!-- にっこり口 -->
        <path d="M 44 71 Q 50 78, 56 71" stroke="#0f172a" stroke-width="3" stroke-linecap="round" fill="none"/>
      `}
    </svg>
  `;
}
