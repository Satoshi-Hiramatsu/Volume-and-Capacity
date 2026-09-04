// 算数かさ・容量 高精細SVG容器レンダラー
// 1Lます、1dLます、メスシリンダー、生活容器（牛乳パック・ペットボトル等）を
// 正確な目盛り・透明感・水面のメニスカス・光沢ハイライト付きで描画する

const SVG_NS = 'http://www.w3.org/2000/svg';

/**
 * 1Lます (正方形・立方体アクリル容器) のSVGを生成
 * @param {number} dl - 水量 (0〜10dL, 小数可)
 * @param {object} options - 表示オプション
 *   width: 表示幅 (px)
 *   height: 表示高さ (px)
 *   showBlocks: 1dLブロック（10分割グリッド）を可視化するか
 *   highlightAnswer: 解答表示用（水面の目盛りに赤い矢印とラインを付与）
 *   printMode: A4印刷用モノクロ・高コントラストモード
 *   interactive: 目盛りをドラッグ/クリック可能にするか
 */
export function render1LBox(dl = 0, options = {}) {
  const {
    width = 240,
    height = 260,
    showBlocks = false,
    highlightAnswer = false,
    printMode = false,
    id = `box1l_${Math.random().toString(36).slice(2, 7)}`
  } = options;

  const clampedDL = Math.max(0, Math.min(10, dl));
  // 水位の計算 (底面 y=220 から 天面 y=30 までの 190px が 10dL)
  const boxTop = 35;
  const boxBottom = 225;
  const boxHeight = boxBottom - boxTop; // 190
  const boxLeft = 45;
  const boxWidth = 160;
  const boxRight = boxLeft + boxWidth; // 205

  const waterHeight = (clampedDL / 10) * boxHeight;
  const waterTop = boxBottom - waterHeight;

  // 目盛り線の生成 (0〜10dL)
  let ticksHtml = '';
  for (let i = 1; i <= 10; i++) {
    const y = boxBottom - (i / 10) * boxHeight;
    const isTop = i === 10;
    const isMid = i === 5;
    const tickLen = isTop ? 24 : isMid ? 18 : 12;
    const strokeColor = printMode ? '#111827' : isTop ? '#ef4444' : isMid ? '#d97706' : '#64748b';
    const strokeWidth = isTop ? 3.5 : isMid ? 2.5 : 1.5;

    // 左側の目盛り線
    ticksHtml += `
      <line x1="${boxLeft}" y1="${y}" x2="${boxLeft + tickLen}" y2="${y}" stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-linecap="round"/>
      <line x1="${boxRight}" y1="${y}" x2="${boxRight - tickLen}" y2="${y}" stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-linecap="round"/>
    `;

    // 数字ラベル (1L, 5dL, 他)
    let label = '';
    if (isTop) {
      label = `<text x="${boxLeft - 6}" y="${y + 5}" fill="${strokeColor}" font-size="14" font-weight="900" text-anchor="end" font-family="'BIZ UDPGothic', sans-serif">1L<tspan font-size="10" font-weight="normal">(10dL)</tspan></text>`;
    } else if (isMid) {
      label = `<text x="${boxLeft - 6}" y="${y + 5}" fill="${strokeColor}" font-size="13" font-weight="bold" text-anchor="end" font-family="'BIZ UDPGothic', sans-serif">5dL</text>`;
    } else if (i % 2 === 0) {
      label = `<text x="${boxLeft - 6}" y="${y + 4}" fill="${strokeColor}" font-size="11" font-weight="bold" text-anchor="end" font-family="'BIZ UDPGothic', sans-serif">${i}dL</text>`;
    }
    ticksHtml += label;
  }

  // 1dLブロック（10分割）の破線グリッド
  let blocksHtml = '';
  if (showBlocks) {
    for (let i = 1; i < 10; i++) {
      const y = boxBottom - (i / 10) * boxHeight;
      blocksHtml += `<line x1="${boxLeft}" y1="${y}" x2="${boxRight}" y2="${y}" stroke="#0284c7" stroke-width="1" stroke-dasharray="3,3" opacity="0.4"/>`;
    }
  }

  // 解答ハイライト用（赤い矢印とライン）
  let answerHtml = '';
  if (highlightAnswer && clampedDL > 0) {
    answerHtml = `
      <g class="ans-indicator">
        <line x1="${boxLeft - 2}" y1="${waterTop}" x2="${boxRight + 2}" y2="${waterTop}" stroke="#dc2626" stroke-width="2.5" stroke-dasharray="4,2"/>
        <path d="M ${boxRight + 5} ${waterTop} L ${boxRight + 16} ${waterTop - 5} L ${boxRight + 16} ${waterTop + 5} Z" fill="#dc2626"/>
        <text x="${boxRight + 20}" y="${waterTop + 5}" fill="#dc2626" font-size="14" font-weight="900" font-family="'BIZ UDPGothic', sans-serif">${clampedDL}dL</text>
      </g>
    `;
  }

  return `
    <svg viewBox="0 0 250 255" width="${width}" height="${height}" class="vessel-1l-svg" id="${id}">
      <defs>
        <!-- ガラス枠線グラデーション -->
        <linearGradient id="${id}_glassEdge" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.8"/>
          <stop offset="50%" stop-color="#bae6fd" stop-opacity="0.4"/>
          <stop offset="100%" stop-color="#0284c7" stop-opacity="0.8"/>
        </linearGradient>

        <!-- 水のグラデーション -->
        <linearGradient id="${id}_waterGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="${printMode ? '#cbd5e1' : '#38bdf8'}"/>
          <stop offset="50%" stop-color="${printMode ? '#94a3b8' : '#0ea5e9'}"/>
          <stop offset="100%" stop-color="${printMode ? '#64748b' : '#0284c7'}"/>
        </linearGradient>

        <!-- 水面ハイライトグラデーション -->
        <linearGradient id="${id}_surfaceGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#bae6fd" stop-opacity="0.8"/>
          <stop offset="50%" stop-color="#ffffff" stop-opacity="0.95"/>
          <stop offset="100%" stop-color="#7dd3fc" stop-opacity="0.8"/>
        </linearGradient>

        <!-- ガラス光沢 -->
        <linearGradient id="${id}_shine" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#ffffff" stop-opacity="0.4"/>
          <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
        </linearGradient>
      </defs>

      <!-- ますの影 -->
      <rect x="${boxLeft - 2}" y="${boxBottom + 4}" width="${boxWidth + 4}" height="10" rx="5" fill="#0f172a" opacity="0.08"/>

      <!-- 容器の奥側背景 -->
      <rect x="${boxLeft}" y="${boxTop}" width="${boxWidth}" height="${boxHeight}" fill="${printMode ? '#ffffff' : '#f8fafc'}" stroke="none"/>

      <!-- 水 (水量が0dLより大きい場合) -->
      ${clampedDL > 0 ? `
        <!-- 水本体 -->
        <rect x="${boxLeft + 2}" y="${waterTop}" width="${boxWidth - 4}" height="${waterHeight}" fill="url(#${id}_waterGrad)" opacity="${printMode ? '0.7' : '0.85'}"/>

        <!-- 水面のメニスカス（表面張力による湾曲） -->
        <ellipse cx="${boxLeft + boxWidth / 2}" cy="${waterTop}" rx="${(boxWidth - 4) / 2}" ry="6" fill="url(#${id}_surfaceGrad)"/>

        <!-- 水中気泡エフェクト (印刷モード以外) -->
        ${!printMode && waterHeight > 30 ? `
          <circle cx="${boxLeft + 35}" cy="${boxBottom - 18}" r="4" fill="#ffffff" opacity="0.5"/>
          <circle cx="${boxLeft + 45}" cy="${boxBottom - 45}" r="2.5" fill="#ffffff" opacity="0.6"/>
          <circle cx="${boxRight - 40}" cy="${boxBottom - 25}" r="5" fill="#ffffff" opacity="0.45"/>
          <circle cx="${boxRight - 55}" cy="${boxBottom - 55}" r="3" fill="#ffffff" opacity="0.55"/>
        ` : ''}
      ` : ''}

      <!-- 1dLブロック可視化グリッド -->
      ${blocksHtml}

      <!-- 目盛り線と数値 -->
      ${ticksHtml}

      <!-- 容器の手前ガラス外枠 -->
      <rect x="${boxLeft}" y="${boxTop}" width="${boxWidth}" height="${boxHeight}" rx="4" fill="none" stroke="url(#${id}_glassEdge)" stroke-width="4"/>
      <!-- 厚底ベース -->
      <path d="M ${boxLeft} ${boxBottom} L ${boxLeft} ${boxBottom + 8} L ${boxRight} ${boxBottom + 8} L ${boxRight} ${boxBottom}" fill="none" stroke="url(#${id}_glassEdge)" stroke-width="3"/>

      <!-- 縦の反射光ハイライト (ガラスの高級感) -->
      ${!printMode ? `
        <rect x="${boxLeft + 6}" y="${boxTop + 4}" width="16" height="${boxHeight - 8}" fill="url(#${id}_shine)"/>
        <line x1="${boxRight - 6}" y1="${boxTop + 6}" x2="${boxRight - 6}" y2="${boxBottom - 6}" stroke="#ffffff" stroke-width="2" opacity="0.5" stroke-linecap="round"/>
      ` : ''}

      <!-- 解答インジケータ -->
      ${answerHtml}
    </svg>
  `;
}

/**
 * 1dLます (学校のスクエアカップ) のSVGを生成
 * @param {number} ml - 水量 (0〜100mL, 1目盛り=10mL)
 * @param {object} options
 */
export function render1dLCup(ml = 0, options = {}) {
  const {
    width = 160,
    height = 190,
    highlightAnswer = false,
    printMode = false,
    id = `cup1dl_${Math.random().toString(36).slice(2, 7)}`
  } = options;

  const clampedML = Math.max(0, Math.min(100, ml));
  const cupTop = 25;
  const cupBottom = 160;
  const cupHeight = cupBottom - cupTop; // 135
  const cupLeft = 35;
  const cupWidth = 90;
  const cupRight = cupLeft + cupWidth; // 125

  const waterHeight = (clampedML / 100) * cupHeight;
  const waterTop = cupBottom - waterHeight;

  // 目盛り (10mL刻み, 0〜100mL = 1dL)
  let ticksHtml = '';
  for (let i = 1; i <= 10; i++) {
    const y = cupBottom - (i / 10) * cupHeight;
    const isTop = i === 10;
    const isMid = i === 5;
    const tickLen = isTop ? 18 : isMid ? 14 : 9;
    const strokeColor = printMode ? '#111827' : isTop ? '#ea580c' : isMid ? '#d97706' : '#64748b';
    const strokeWidth = isTop ? 3 : isMid ? 2 : 1.2;

    ticksHtml += `
      <line x1="${cupLeft}" y1="${y}" x2="${cupLeft + tickLen}" y2="${y}" stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-linecap="round"/>
    `;

    if (isTop) {
      ticksHtml += `<text x="${cupLeft - 4}" y="${y + 4}" fill="${strokeColor}" font-size="11" font-weight="bold" text-anchor="end" font-family="'BIZ UDPGothic', sans-serif">1dL</text>`;
    } else if (isMid) {
      ticksHtml += `<text x="${cupLeft - 4}" y="${y + 4}" fill="${strokeColor}" font-size="10" font-weight="bold" text-anchor="end" font-family="'BIZ UDPGothic', sans-serif">50mL</text>`;
    } else if (i % 2 === 0) {
      ticksHtml += `<text x="${cupLeft - 4}" y="${y + 3}" fill="${strokeColor}" font-size="9" text-anchor="end" font-family="'BIZ UDPGothic', sans-serif">${i * 10}</text>`;
    }
  }

  // 解答ハイライト
  let answerHtml = '';
  if (highlightAnswer && clampedML > 0) {
    answerHtml = `
      <g class="ans-indicator">
        <line x1="${cupLeft - 2}" y1="${waterTop}" x2="${cupRight + 2}" y2="${waterTop}" stroke="#dc2626" stroke-width="2" stroke-dasharray="3,2"/>
        <text x="${cupRight + 8}" y="${waterTop + 4}" fill="#dc2626" font-size="12" font-weight="bold" font-family="'BIZ UDPGothic', sans-serif">${clampedML}mL</text>
      </g>
    `;
  }

  return `
    <svg viewBox="0 0 170 180" width="${width}" height="${height}" class="vessel-1dl-svg" id="${id}">
      <defs>
        <!-- 1dLカップの水 (オレンジ〜アンバー、またはシアン) -->
        <linearGradient id="${id}_cupWater" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="${printMode ? '#cbd5e1' : '#fdba74'}"/>
          <stop offset="100%" stop-color="${printMode ? '#64748b' : '#f97316'}"/>
        </linearGradient>
      </defs>

      <!-- コップの持ち手 (右側) -->
      <path d="M ${cupRight} 55 C ${cupRight + 24} 55, ${cupRight + 24} 125, ${cupRight} 125" fill="none" stroke="${printMode ? '#64748b' : '#fdba74'}" stroke-width="6" stroke-linecap="round"/>

      <!-- コップ背景 -->
      <rect x="${cupLeft}" y="${cupTop}" width="${cupWidth}" height="${cupHeight}" fill="${printMode ? '#fff' : '#fff7ed'}" rx="3"/>

      <!-- 水 -->
      ${clampedML > 0 ? `
        <rect x="${cupLeft + 2}" y="${waterTop}" width="${cupWidth - 4}" height="${waterHeight}" fill="url(#${id}_cupWater)" opacity="${printMode ? '0.7' : '0.85'}"/>
        <ellipse cx="${cupLeft + cupWidth / 2}" cy="${waterTop}" rx="${(cupWidth - 4) / 2}" ry="4" fill="#ffedd5" opacity="0.9"/>
      ` : ''}

      <!-- 目盛り -->
      ${ticksHtml}

      <!-- コップ枠線 -->
      <rect x="${cupLeft}" y="${cupTop}" width="${cupWidth}" height="${cupHeight}" rx="3" fill="none" stroke="${printMode ? '#334155' : '#f97316'}" stroke-width="3"/>
      <!-- 注ぎ口 -->
      <path d="M ${cupLeft} 25 L ${cupLeft - 6} 20 L ${cupLeft + 4} 25" stroke="${printMode ? '#334155' : '#f97316'}" stroke-width="2.5" fill="none"/>

      ${answerHtml}
    </svg>
  `;
}

/**
 * メスシリンダー / 計量ビーカー のSVGを生成
 * @param {number} ml - 水量 (0〜maxML)
 * @param {number} maxML - 最大容量 (例: 500mL, 1000mL)
 * @param {object} options
 */
export function renderCylinder(ml = 0, maxML = 500, options = {}) {
  const {
    width = 150,
    height = 240,
    highlightAnswer = false,
    printMode = false,
    id = `cyl_${Math.random().toString(36).slice(2, 7)}`
  } = options;

  const clampedML = Math.max(0, Math.min(maxML, ml));
  const top = 30;
  const bottom = 205;
  const h = bottom - top; // 175
  const left = 45;
  const w = 55;
  const right = left + w; // 100

  const waterHeight = (clampedML / maxML) * h;
  const waterTop = bottom - waterHeight;

  // 目盛り (10分割)
  let ticksHtml = '';
  const step = maxML / 10;
  for (let i = 1; i <= 10; i++) {
    const val = i * step;
    const y = bottom - (i / 10) * h;
    const isMajor = i % 2 === 0 || i === 5 || i === 10;
    const tickLen = isMajor ? 14 : 7;
    const color = printMode ? '#1e293b' : isMajor ? '#0891b2' : '#64748b';

    ticksHtml += `<line x1="${left}" y1="${y}" x2="${left + tickLen}" y2="${y}" stroke="${color}" stroke-width="${isMajor ? 2 : 1}"/>`;
    if (isMajor) {
      ticksHtml += `<text x="${left - 4}" y="${y + 4}" fill="${color}" font-size="9" font-weight="bold" text-anchor="end" font-family="'BIZ UDPGothic', sans-serif">${val}</text>`;
    }
  }

  let answerHtml = '';
  if (highlightAnswer && clampedML > 0) {
    answerHtml = `
      <line x1="${left - 2}" y1="${waterTop}" x2="${right + 2}" y2="${waterTop}" stroke="#dc2626" stroke-width="2" stroke-dasharray="3,2"/>
      <text x="${right + 6}" y="${waterTop + 4}" fill="#dc2626" font-size="11" font-weight="bold" font-family="'BIZ UDPGothic', sans-serif">${clampedML}mL</text>
    `;
  }

  return `
    <svg viewBox="0 0 150 230" width="${width}" height="${height}" class="vessel-cylinder-svg" id="${id}">
      <defs>
        <linearGradient id="${id}_cylWater" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="${printMode ? '#cbd5e1' : '#67e8f9'}"/>
          <stop offset="100%" stop-color="${printMode ? '#64748b' : '#0891b2'}"/>
        </linearGradient>
      </defs>

      <!-- 円形台座 -->
      <ellipse cx="${left + w / 2}" cy="${bottom + 12}" rx="38" ry="8" fill="${printMode ? '#e2e8f0' : '#cffafe'}" stroke="${printMode ? '#64748b' : '#0891b2'}" stroke-width="2"/>

      <!-- シリンダー背景 -->
      <rect x="${left}" y="${top}" width="${w}" height="${h}" fill="${printMode ? '#fff' : '#f0fdfa'}"/>

      <!-- 水 -->
      ${clampedML > 0 ? `
        <rect x="${left + 1}" y="${waterTop}" width="${w - 2}" height="${waterHeight}" fill="url(#${id}_cylWater)" opacity="0.8"/>
        <ellipse cx="${left + w / 2}" cy="${waterTop}" rx="${(w - 2) / 2}" ry="4" fill="#a5f3fc"/>
      ` : ''}

      <!-- 目盛り -->
      ${ticksHtml}

      <!-- ガラス管外枠 -->
      <rect x="${left}" y="${top}" width="${w}" height="${h}" fill="none" stroke="${printMode ? '#334155' : '#0e7490'}" stroke-width="2.5"/>
      <!-- 上部リムと注ぎ口 -->
      <path d="M ${left - 8} ${top} L ${left} ${top + 4} L ${right} ${top} L ${right + 2} ${top - 2} L ${left - 8} ${top}" fill="${printMode ? '#e2e8f0' : '#cffafe'}" stroke="${printMode ? '#334155' : '#0e7490'}" stroke-width="1.5"/>

      ${answerHtml}
    </svg>
  `;
}

/**
 * 身の回りの容器（牛乳パック、ペットボトル等）を描画
 */
export function renderLifeVessel(type = 'milk1L', width = 120, height = 150) {
  switch (type) {
    case 'milk1L':
      return `
        <svg viewBox="0 0 100 140" width="${width}" height="${height}" class="life-vessel milk">
          <!-- 1L紙パック -->
          <!-- 屋根部分 -->
          <polygon points="20,40 50,15 80,40 20,40" fill="#bae6fd" stroke="#0284c7" stroke-width="2"/>
          <line x1="50" y1="15" x2="50" y2="40" stroke="#0284c7" stroke-width="2"/>
          <!-- 胴体 -->
          <rect x="20" y="40" width="60" height="90" rx="3" fill="#ffffff" stroke="#0284c7" stroke-width="2.5"/>
          <!-- 青いラインと帯 -->
          <rect x="20" y="55" width="60" height="30" fill="#0284c7"/>
          <text x="50" y="76" fill="#ffffff" font-size="14" font-weight="bold" text-anchor="middle" font-family="'BIZ UDPGothic', sans-serif">ぎゅうにゅう</text>
          <!-- 1Lバッジ -->
          <circle cx="50" cy="105" r="14" fill="#fbbf24"/>
          <text x="50" y="110" fill="#78350f" font-size="11" font-weight="900" text-anchor="middle">1L</text>
        </svg>
      `;

    case 'pet500mL':
      return `
        <svg viewBox="0 0 100 140" width="${width}" height="${height}" class="life-vessel pet">
          <!-- キャップ -->
          <rect x="42" y="10" width="16" height="12" rx="2" fill="#ef4444"/>
          <!-- 首 -->
          <path d="M 40 22 L 30 45 L 70 45 L 60 22 Z" fill="#e0f2fe" stroke="#38bdf8" stroke-width="2"/>
          <!-- 胴体 -->
          <rect x="30" y="45" width="40" height="85" rx="6" fill="#e0f2fe" stroke="#38bdf8" stroke-width="2"/>
          <!-- 水 -->
          <rect x="32" y="55" width="36" height="73" rx="4" fill="#38bdf8" opacity="0.6"/>
          <!-- ラベル -->
          <rect x="30" y="70" width="40" height="30" fill="#22c55e"/>
          <text x="50" y="86" fill="#ffffff" font-size="9" font-weight="bold" text-anchor="middle">お茶</text>
          <text x="50" y="96" fill="#ffffff" font-size="7.5" text-anchor="middle">500mL</text>
        </svg>
      `;

    case 'cup200mL':
      return `
        <svg viewBox="0 0 100 120" width="${width}" height="${height}" class="life-vessel cup">
          <!-- マグカップ -->
          <!-- 持ち手 -->
          <path d="M 70 40 C 90 40, 90 80, 70 80" fill="none" stroke="#f97316" stroke-width="6" stroke-linecap="round"/>
          <!-- 胴体 -->
          <rect x="25" y="30" width="50" height="65" rx="6" fill="#ffedd5" stroke="#f97316" stroke-width="3"/>
          <rect x="28" y="45" width="44" height="48" rx="4" fill="#fdba74" opacity="0.5"/>
          <text x="50" y="75" fill="#c2410c" font-size="10" font-weight="bold" text-anchor="middle">200mL</text>
          <text x="50" y="88" fill="#c2410c" font-size="8" text-anchor="middle">(2dL)</text>
        </svg>
      `;

    case 'spoon15mL':
      return `
        <svg viewBox="0 0 120 80" width="${width}" height="${height}" class="life-vessel spoon">
          <!-- 大さじスプーン (15mL) -->
          <!-- 柄 -->
          <line x1="15" y1="40" x2="70" y2="40" stroke="#94a3b8" stroke-width="6" stroke-linecap="round"/>
          <!-- さじ部 -->
          <ellipse cx="85" cy="40" rx="22" ry="18" fill="#e2e8f0" stroke="#64748b" stroke-width="2.5"/>
          <ellipse cx="85" cy="40" rx="16" ry="12" fill="#38bdf8" opacity="0.6"/>
          <text x="85" y="43" fill="#1e293b" font-size="9" font-weight="bold" text-anchor="middle">15mL</text>
          <text x="40" y="32" fill="#64748b" font-size="8">大さじ</text>
        </svg>
      `;

    default:
      return '';
  }
}
