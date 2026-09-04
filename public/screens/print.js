// A4プリント作成画面 (print.js) - 高品質テスト用紙・解答シート・シード完全再現
import { generateProblemSet, PATTERNS, PRESETS } from '../lib/problems/index.js';
import { randomSeed } from '../lib/rng.js';
import { playSound } from '../lib/sound.js';

const COUNTS = [6, 8, 10];
const A4_WIDTH_PX = 794; // A4縦 210mm ≒ 794px (96dpi)

// 画面幅にプレビューが収まる初期倍率を選ぶ（狭い画面では自動で縮小）
function initialZoom() {
  const width = typeof window === 'undefined' ? 1440 : window.innerWidth;
  if (width >= 1100) return 0.65;
  const fitted = (width - 56) / A4_WIDTH_PX;
  return Math.max(0.35, Math.min(0.65, Math.floor(fitted * 20) / 20));
}

const OUTPUTS = {
  both: '問題 ＋ 解答',
  q: '問題のみ',
  a: '解答のみ'
};

export function renderPrint(root, { settings, params }) {
  const d = Number(params.get('d')) || settings.lastDifficulty || 2;
  const rawSeed = Number(params.get('seed')) || randomSeed();
  const count = COUNTS.includes(Number(params.get('n'))) ? Number(params.get('n')) : 8;
  const out = OUTPUTS[params.get('out')] ? params.get('out') : 'both';

  let state = {
    difficulty: d,
    patterns: (params.get('p') || '').split(',').filter(k => PATTERNS[k]),
    count,
    out,
    seed: rawSeed,
    zoom: initialZoom() // プレビュー表示倍率（狭い画面では画面幅に合わせる）
  };

  if (state.patterns.length === 0) {
    state.patterns = (PRESETS[state.difficulty] || PRESETS[2]).patterns;
  }

  function updateHash() {
    const pStr = state.patterns.join(',');
    location.hash = `#print?d=${state.difficulty}&p=${pStr}&n=${state.count}&out=${state.out}&seed=${state.seed}`;
  }

  function render() {
    // 問題セット生成
    const set = generateProblemSet({
      difficulty: state.difficulty,
      patterns: state.patterns,
      count: state.count,
      seed: state.seed
    });

    root.innerHTML = `
      <section class="print-view">
        <!-- 左側: 設定フォーム -->
        <form class="print-form" onsubmit="return false;">
          <h2>🖨️ A4プリント設定</h2>

          <!-- 難易度 -->
          <div class="form-group">
            <label class="group-title">むずかしさ（難易度）</label>
            <div class="radio-pills">
              ${[1, 2, 3, 4].map(level => `
                <label class="pill-label">
                  <input type="radio" name="difficulty" value="${level}" ${state.difficulty === level ? 'checked' : ''}>
                  <span>⭐ レベル ${level}</span>
                </label>
              `).join('')}
            </div>
          </div>

          <!-- 問題パターン -->
          <div class="form-group">
            <label class="group-title">問題の種類（チェックで選択）</label>
            <div class="check-grid">
              ${Object.values(PATTERNS).map(pt => `
                <label class="pill-label" style="font-size: 12px;">
                  <input type="checkbox" name="pattern" value="${pt.id}" ${state.patterns.includes(pt.id) ? 'checked' : ''}>
                  <span>${pt.name}</span>
                </label>
              `).join('')}
            </div>
          </div>

          <!-- 問題数 & 出力内容 -->
          <div class="form-group">
            <div class="select-row">
              <label class="group-title">問題数：</label>
              <select id="selectCount">
                ${COUNTS.map(n => `<option value="${n}" ${state.count === n ? 'selected' : ''}>${n} 問</option>`).join('')}
              </select>
            </div>
          </div>

          <div class="form-group">
            <div class="select-row">
              <label class="group-title">印刷内容：</label>
              <select id="selectOut">
                ${Object.entries(OUTPUTS).map(([k, v]) => `
                  <option value="${k}" ${state.out === k ? 'selected' : ''}>${v}</option>
                `).join('')}
              </select>
            </div>
          </div>

          <!-- アクションボタン -->
          <div class="print-actions">
            <button type="button" id="btnGenerateNew" class="btn-print-action btn-print-action--generate">
              <span class="action-label-long">🔄 べつの問題を作る（再生成）</span>
              <span class="action-label-short">🔄 べつの問題</span>
            </button>
            <button type="button" id="btnPrintNow" class="btn-print-action btn-print-action--print">
              <span class="action-label-long">🖨️ 印刷する / PDF保存</span>
              <span class="action-label-short">🖨️ 印刷 / PDF</span>
            </button>
          </div>

          <div style="font-size: 11px; color: var(--c-ink-3); margin-top: 6px;">
            シード値: <code>${state.seed}</code><br>
            ※このURLを保存すれば、いつでも全く同じプリントを再印刷できます。
          </div>
        </form>

        <!-- 右側: プレビューエリア -->
        <div class="print-preview-area">
          <div class="print-zoom-controls">
            <span>プレビュー表示倍率:</span>
            <button type="button" class="btn btn-outline" id="btnZoomOut" style="min-height: 28px; padding: 0 8px; font-size: 13px;">縮小 (−)</button>
            <span id="zoomLabel">${Math.round(state.zoom * 100)}%</span>
            <button type="button" class="btn btn-outline" id="btnZoomIn" style="min-height: 28px; padding: 0 8px; font-size: 13px;">拡大 (＋)</button>
          </div>

          <div class="sheets-container" id="sheetsContainer" style="zoom: ${state.zoom};">
            ${(state.out === 'both' || state.out === 'q') ? renderSheetHtml(set, false) : ''}
            ${(state.out === 'both' || state.out === 'a') ? renderSheetHtml(set, true) : ''}
          </div>
        </div>
      </section>
    `;

    bindEvents();
  }

  function renderSheetHtml(set, isAnswer) {
    const badgeText = isAnswer ? '【 解 答 ・ か い せ つ 】' : '【 算 数 テ ス ト 】';
    const title = '水のかさ・容量（L・dL・mL）';

    return `
      <div class="a4-sheet ${isAnswer ? 'is-answer-sheet' : ''}">
        <!-- ヘッダー -->
        <div class="sheet-header">
          <div class="sheet-title-box">
            <div class="sheet-badge">${badgeText}</div>
            <h1 class="sheet-title">${title}</h1>
          </div>
          <div class="sheet-meta-box">
            <div class="sheet-student-info">
              <div>年　組</div>
              <div>なまえ: <span class="name-line"></span></div>
            </div>
            <div class="score-box">
              <span>てんすう</span>
              <span class="score-num">${isAnswer ? '100' : '　 / 100'}</span>
            </div>
          </div>
        </div>

        <!-- 問題グリッド -->
        <div class="sheet-problems-grid grid-cols-2">
          ${set.problems.map(prob => `
            <div class="sheet-problem-item">
              <div class="sheet-problem-header">
                <span class="sheet-prob-num">${prob.num}</span>
                <span>${prob.questionText}</span>
              </div>

              ${prob.renderSvg ? `
                <div class="sheet-problem-body">
                  <div class="sheet-problem-svg">
                    ${prob.renderSvg(isAnswer, true)}
                  </div>
                </div>
              ` : ''}

              <div class="sheet-problem-ans-line">
                <span>こたえ:</span>
                <span class="ans-write-space">${isAnswer ? prob.answer : ''}</span>
              </div>

              ${isAnswer ? `
                <div style="font-size: 8pt; color: #475569; background: #f8fafc; border-left: 2px solid #0284c7; padding: 2px 6px; margin-top: 4px; line-height: 1.3;">
                  💡 ${prob.explanation.replace(/\n/g, ' ')}
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>

        <!-- フッター -->
        <div class="sheet-footer">
          <span>小学2・3年 算数「かさ・容量」</span>
          <span>シート番号: ${set.seed} (${isAnswer ? '解答' : '問題'})</span>
          <span>1L＝10dL＝1000mL / 1dL＝100mL</span>
        </div>
      </div>
    `;
  }

  function bindEvents() {
    // 難易度変更
    root.querySelectorAll('input[name="difficulty"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        state.difficulty = Number(e.target.value);
        state.patterns = (PRESETS[state.difficulty] || PRESETS[2]).patterns;
        state.seed = randomSeed();
        playSound('click', settings.sound);
        updateHash();
      });
    });

    // パターンチェック変更
    root.querySelectorAll('input[name="pattern"]').forEach(chk => {
      chk.addEventListener('change', () => {
        const checked = Array.from(root.querySelectorAll('input[name="pattern"]:checked')).map(c => c.value);
        state.patterns = checked.length > 0 ? checked : ['P1'];
        state.seed = randomSeed();
        playSound('click', settings.sound);
        updateHash();
      });
    });

    // 問題数
    const countSelect = root.querySelector('#selectCount');
    if (countSelect) {
      countSelect.addEventListener('change', (e) => {
        state.count = Number(e.target.value);
        state.seed = randomSeed();
        playSound('click', settings.sound);
        updateHash();
      });
    }

    // 出力内容
    const outSelect = root.querySelector('#selectOut');
    if (outSelect) {
      outSelect.addEventListener('change', (e) => {
        state.out = e.target.value;
        playSound('click', settings.sound);
        updateHash();
      });
    }

    // 再生成ボタン
    const genBtn = root.querySelector('#btnGenerateNew');
    if (genBtn) {
      genBtn.addEventListener('click', () => {
        state.seed = randomSeed();
        playSound('transform', settings.sound);
        updateHash();
      });
    }

    // 印刷ボタン
    const printBtn = root.querySelector('#btnPrintNow');
    if (printBtn) {
      printBtn.addEventListener('click', () => {
        window.print();
      });
    }

    // ズームイン・アウト
    const container = root.querySelector('#sheetsContainer');
    const zoomLabel = root.querySelector('#zoomLabel');
    const zoomIn = root.querySelector('#btnZoomIn');
    const zoomOut = root.querySelector('#btnZoomOut');

    if (zoomIn && zoomOut) {
      zoomIn.addEventListener('click', () => {
        state.zoom = Math.min(1.0, state.zoom + 0.1);
        if (container) container.style.zoom = state.zoom;
        if (zoomLabel) zoomLabel.textContent = `${Math.round(state.zoom * 100)}%`;
      });
      zoomOut.addEventListener('click', () => {
        state.zoom = Math.max(0.35, state.zoom - 0.1);
        if (container) container.style.zoom = state.zoom;
        if (zoomLabel) zoomLabel.textContent = `${Math.round(state.zoom * 100)}%`;
      });
    }
  }

  render();

  return () => {};
}
