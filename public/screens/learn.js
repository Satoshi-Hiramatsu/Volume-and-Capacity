// まなぶ画面 (learn.js) - 体験型インタラクティブシミュレータ
import { renderCharacterSVG } from '../lib/character-svg.js';
import { render1LBox, render1dLCup, renderCylinder, renderLifeVessel } from '../lib/vessels-svg.js';
import { playSound } from '../lib/sound.js';

export function renderLearn(root, { settings, params }) {
  const initialTab = params.get('tab') || 'lab';

  // 内部ステート
  let state = {
    currentTab: initialTab,
    // へんしんラボ
    labDL: 4, // 0〜10dL
    showBlocks: false,
    activeVessel: '1L', // '1L' or '1dL'
    labML: 50, // 0〜100mL (1dLます用)

    // かずをつくる
    buildL: 1,
    buildDL: 3,
    buildML: 0,

    // たしざん・ひきざん
    calcMode: 'add', // 'add' or 'sub'
    calcA: { l: 1, dl: 4 },
    calcB: { l: 0, dl: 8 },
    calcResult: null,
    calcAnimated: false
  };

  function update() {
    renderView();
  }

  function renderView() {
    root.innerHTML = `
      <section class="learn-view">
        <!-- ドロップくんのガイド -->
        <div class="mascot-guide">
          <div class="mascot-avatar">
            ${renderCharacterSVG(state.currentTab === 'calc' ? 'sparkle' : 'happy', 68)}
          </div>
          <div class="mascot-speech">
            ${getMascotSpeech(state.currentTab)}
          </div>
        </div>

        <!-- サブタブバー -->
        <div class="sub-tabs">
          <button class="sub-tab-btn ${state.currentTab === 'lab' ? 'active' : ''}" data-tab="lab">
            🔁 ① へんしんラボ
          </button>
          <button class="sub-tab-btn ${state.currentTab === 'build' ? 'active' : ''}" data-tab="build">
            🧪 ② かずをつくる
          </button>
          <button class="sub-tab-btn ${state.currentTab === 'calc' ? 'active' : ''}" data-tab="calc">
            ➕➖ ③ けいさん（くりあがり）
          </button>
          <button class="sub-tab-btn ${state.currentTab === 'zukan' ? 'active' : ''}" data-tab="zukan">
            🥛 ④ みぢかなかさ図鑑
          </button>
        </div>

        <!-- 各タブコンテンツ -->
        <div class="tab-content">
          ${state.currentTab === 'lab' ? renderLabTab() : ''}
          ${state.currentTab === 'build' ? renderBuildTab() : ''}
          ${state.currentTab === 'calc' ? renderCalcTab() : ''}
          ${state.currentTab === 'zukan' ? renderZukanTab() : ''}
        </div>
      </section>
    `;

    bindEvents();
  }

  function getMascotSpeech(tab) {
    switch (tab) {
      case 'lab':
        return '水を注いだり 抜いたりして、L・dL・mL の目盛りが どう変わるか 見てみよう！<br>「1dLブロック」を押すと、1Lの中に 1dLが 10こ 入っているのが 見えるよ。';
      case 'build':
        return 'ボタンを押して すきなカサを つくってみよう！<br>1Lます や 1dLます が どんどん ならんで、ぜんぶで いくらになるか わかるよ。';
      case 'calc':
        return 'カサの たし算・ひき算を じっけん！<br>10dL あつまると 1Lに「シュッ！」と へんしんするよ。';
      case 'zukan':
        return '身の回りの ものの かさを くらべてみよう！<br>ぎゅうにゅうパックは 1L、ペットボトルは 500mL だね。';
      default:
        return '';
    }
  }

  // ===== タブ①: へんしんラボ =====
  function renderLabTab() {
    const is1L = state.activeVessel === '1L';
    const totalML = is1L ? state.labDL * 100 : state.labML;
    const lPart = is1L ? Math.floor(state.labDL / 10) : 0;
    const dlPart = is1L ? state.labDL % 10 : Math.floor(state.labML / 10);
    const mlRem = is1L ? 0 : state.labML % 100;

    let mainDisplayStr = '';
    if (is1L) {
      if (state.labDL === 10) mainDisplayStr = '1 L';
      else mainDisplayStr = `${state.labDL} dL`;
    } else {
      if (state.labML === 100) mainDisplayStr = '1 dL (100mL)';
      else mainDisplayStr = `${state.labML} mL`;
    }

    return `
      <div class="lab-container">
        <!-- 左側: 容器ビジュアル -->
        <div class="lab-panel">
          <div class="lab-panel-title">
            <span>水のかさ を 見る</span>
            <div style="margin-left: auto; display: flex; gap: 6px;">
              <button class="btn btn-outline toggle-vessel-btn" data-vessel="1L" style="min-height: 36px; padding: 0 10px; font-size: 13px; ${is1L ? 'background: var(--c-unit-l); color: #fff; border-color: var(--c-unit-l);' : ''}">
                1Lます
              </button>
              <button class="btn btn-outline toggle-vessel-btn" data-vessel="1dL" style="min-height: 36px; padding: 0 10px; font-size: 13px; ${!is1L ? 'background: var(--c-unit-dl); color: #fff; border-color: var(--c-unit-dl);' : ''}">
                1dLます
              </button>
            </div>
          </div>

          <div class="vessel-stage">
            ${is1L
              ? render1LBox(state.labDL, { width: 230, height: 250, showBlocks: state.showBlocks })
              : render1dLCup(state.labML, { width: 180, height: 210 })
            }
          </div>

          ${is1L ? `
            <div style="display: flex; justify-content: center;">
              <label class="pill-label" style="cursor: pointer;">
                <input type="checkbox" id="checkShowBlocks" ${state.showBlocks ? 'checked' : ''}>
                <span>🟦 1dLブロック（10分割）を可視化</span>
              </label>
            </div>
          ` : ''}
        </div>

        <!-- 右側: コントロール & 目盛りディスプレイ -->
        <div class="lab-panel">
          <div class="lab-panel-title">
            <span>へんしん ディスプレイ</span>
          </div>

          <div class="amount-display-board">
            <div style="font-size: 13px; color: #94a3b8; text-align: center;">いまの水のかさ</div>
            <div class="amount-main-val">${mainDisplayStr}</div>
            <div class="amount-sub-conversions">
              <span>Lだと: <strong>${(totalML / 1000).toFixed(1)} L</strong></span>
              <span>dLだと: <strong>${(totalML / 100).toFixed(0)} dL</strong></span>
              <span>mLだと: <strong>${totalML} mL</strong></span>
            </div>
          </div>

          <!-- 注ぐ・抜く コントロール -->
          <div class="water-controls">
            <div style="font-size: 14px; font-weight: bold; color: var(--c-ink-2);">
              ${is1L ? '1Lますの 水をかえる' : '1dLますの 水をかえる'}
            </div>

            <!-- クイックボタン -->
            <div class="quick-amount-buttons">
              ${is1L ? [0, 2, 4, 5, 8, 10].map(v => `
                <button class="quick-btn ${state.labDL === v ? 'active' : ''}" data-val="${v}">
                  ${v === 10 ? '1L (いっぱい)' : v === 0 ? '0 (からっぽ)' : `${v}dL`}
                </button>
              `).join('') : [0, 20, 50, 80, 100].map(v => `
                <button class="quick-btn ${state.labML === v ? 'active' : ''}" data-val="${v}">
                  ${v === 100 ? '1dL (いっぱい)' : v === 0 ? '0' : `${v}mL`}
                </button>
              `).join('')}
            </div>

            <!-- スライダー & 微調整 -->
            <div style="display: flex; align-items: center; gap: 12px; margin-top: 8px;">
              <button class="btn btn-outline btn-step-down" style="min-height: 48px; width: 48px; padding: 0; font-size: 22px;">−</button>
              <input type="range" class="water-range" min="0" max="${is1L ? 10 : 100}" step="${is1L ? 1 : 10}" value="${is1L ? state.labDL : state.labML}" style="flex-grow: 1; height: 10px; cursor: pointer;">
              <button class="btn btn-outline btn-step-up" style="min-height: 48px; width: 48px; padding: 0; font-size: 22px;">＋</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // ===== タブ②: かずをつくる =====
  function renderBuildTab() {
    const totalDL = state.buildL * 10 + state.buildDL;
    const totalML = totalDL * 100 + state.buildML;

    return `
      <div style="display: flex; flex-direction: column; gap: 20px;">
        <!-- 合計バナー -->
        <div class="amount-display-board">
          <div style="font-size: 13px; color: #94a3b8; text-align: center;">つくった カサの合計</div>
          <div class="amount-main-val" style="color: #fbbf24;">
            ${state.buildL > 0 ? `${state.buildL}<span style="font-size: 0.6em;">L</span> ` : ''}
            ${state.buildDL > 0 ? `${state.buildDL}<span style="font-size: 0.6em;">dL</span> ` : ''}
            ${state.buildML > 0 ? `${state.buildML}<span style="font-size: 0.6em;">mL</span>` : ''}
            ${totalML === 0 ? '0 mL' : ''}
          </div>
          <div class="amount-sub-conversions">
            <span>ぜんぶ dL で言うと: <strong>${totalDL} dL</strong></span>
            <span>ぜんぶ mL で言うと: <strong>${totalML} mL</strong></span>
          </div>
        </div>

        <!-- 増減ステッパー列 -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 14px;">
          <!-- 1L ステッパー -->
          <div class="card" style="text-align: center; border-color: var(--c-unit-l);">
            <div style="font-weight: 900; color: var(--c-unit-l); font-size: var(--text-lg); margin-bottom: 8px;">1L ます</div>
            <div style="font-size: var(--text-2xl); font-weight: bold; margin-bottom: 12px;">${state.buildL} <small style="font-size: 14px;">こ</small></div>
            <div style="display: flex; justify-content: center; gap: 10px;">
              <button class="btn btn-outline build-stepper-btn" data-unit="L" data-delta="-1" style="min-height: 44px; width: 44px; font-size: 20px;">−</button>
              <button class="btn btn-primary build-stepper-btn" data-unit="L" data-delta="1" style="min-height: 44px; width: 44px; font-size: 20px;">＋</button>
            </div>
          </div>

          <!-- 1dL ステッパー -->
          <div class="card" style="text-align: center; border-color: var(--c-unit-dl);">
            <div style="font-weight: 900; color: var(--c-unit-dl); font-size: var(--text-lg); margin-bottom: 8px;">1dL ます</div>
            <div style="font-size: var(--text-2xl); font-weight: bold; margin-bottom: 12px;">${state.buildDL} <small style="font-size: 14px;">こ</small></div>
            <div style="display: flex; justify-content: center; gap: 10px;">
              <button class="btn btn-outline build-stepper-btn" data-unit="dL" data-delta="-1" style="min-height: 44px; width: 44px; font-size: 20px;">−</button>
              <button class="btn btn-accent build-stepper-btn" data-unit="dL" data-delta="1" style="min-height: 44px; width: 44px; font-size: 20px;">＋</button>
            </div>
          </div>

          <!-- 10mL ステッパー -->
          <div class="card" style="text-align: center; border-color: var(--c-unit-ml);">
            <div style="font-weight: 900; color: var(--c-unit-ml); font-size: var(--text-lg); margin-bottom: 8px;">10mL</div>
            <div style="font-size: var(--text-2xl); font-weight: bold; margin-bottom: 12px;">${state.buildML} <small style="font-size: 14px;">mL</small></div>
            <div style="display: flex; justify-content: center; gap: 10px;">
              <button class="btn btn-outline build-stepper-btn" data-unit="mL" data-delta="-10" style="min-height: 44px; width: 44px; font-size: 20px;">−</button>
              <button class="btn btn-primary build-stepper-btn" data-unit="mL" data-delta="10" style="min-height: 44px; width: 44px; font-size: 20px; background: var(--c-unit-ml);">＋</button>
            </div>
          </div>
        </div>

        <!-- 容器がずらりと並ぶステージ -->
        <div class="card" style="background: #f8fafc; border: 2px dashed #93c5fd;">
          <h4 style="font-size: var(--text-base); color: #0369a1; margin-bottom: 12px;">ならんでいる 容器たち</h4>
          <div style="display: flex; flex-wrap: wrap; gap: 14px; align-items: flex-end; justify-content: center; min-height: 160px;">
            ${Array.from({ length: state.buildL }, () => render1LBox(10, { width: 75, height: 85 })).join('')}
            ${Array.from({ length: state.buildDL }, () => render1dLCup(100, { width: 60, height: 75 })).join('')}
            ${state.buildML > 0 ? renderCylinder(state.buildML, 100, { width: 60, height: 100 }) : ''}
            ${totalML === 0 ? '<div style="color: #94a3b8; font-weight: bold; padding: 30px;">上の＋ボタンを押して、カサをふやしてみてね！</div>' : ''}
          </div>
        </div>
      </div>
    `;
  }

  // ===== タブ③: けいさん（くりあがり実験） =====
  function renderCalcTab() {
    const isAdd = state.calcMode === 'add';
    const totalDL = isAdd
      ? (state.calcA.l * 10 + state.calcA.dl) + (state.calcB.l * 10 + state.calcB.dl)
      : (state.calcA.l * 10 + state.calcA.dl) - (state.calcB.l * 10 + state.calcB.dl);

    const isError = !isAdd && totalDL < 0;
    const resL = Math.floor(Math.max(0, totalDL) / 10);
    const resDL = Math.max(0, totalDL) % 10;
    const hasCarry = isAdd && (state.calcA.dl + state.calcB.dl >= 10);
    const hasBorrow = !isAdd && (state.calcB.dl > state.calcA.dl);

    return `
      <div style="display: flex; flex-direction: column; gap: 20px;">
        <!-- モード切り替え（たし算 / ひき算） -->
        <div style="display: flex; justify-content: center; gap: 12px;">
          <button class="btn ${isAdd ? 'btn-primary' : 'btn-outline'} toggle-calc-mode-btn" data-mode="add" style="min-height: 46px; font-size: var(--text-md);">
            ➕ たし算（くりあがり実験）
          </button>
          <button class="btn ${!isAdd ? 'btn-accent' : 'btn-outline'} toggle-calc-mode-btn" data-mode="sub" style="min-height: 46px; font-size: var(--text-md);">
            ➖ ひき算（くりさがり実験）
          </button>
        </div>

        <!-- 式とオペランド -->
        <div style="display: grid; grid-template-columns: 1fr auto 1fr; gap: 14px; align-items: center;">
          <!-- A -->
          <div class="card" style="text-align: center; border: 3px solid #38bdf8;">
            <div style="font-weight: bold; color: #0284c7; margin-bottom: 6px;">あ のカサ</div>
            <div style="font-size: var(--text-xl); font-weight: 900; margin-bottom: 8px;">${state.calcA.l}L ${state.calcA.dl}dL</div>
            <div style="display: flex; justify-content: center; gap: 8px;">
              <button class="btn btn-outline calc-operand-btn" data-target="A" data-unit="dl" data-delta="-1" style="min-height: 38px; width: 38px; padding:0;">−</button>
              <button class="btn btn-outline calc-operand-btn" data-target="A" data-unit="dl" data-delta="1" style="min-height: 38px; width: 38px; padding:0;">＋</button>
            </div>
          </div>

          <div style="font-size: 38px; font-weight: 900; color: var(--c-unit-l); text-align: center;">
            ${isAdd ? '＋' : '－'}
          </div>

          <!-- B -->
          <div class="card" style="text-align: center; border: 3px solid #f97316;">
            <div style="font-weight: bold; color: #ea580c; margin-bottom: 6px;">い のカサ</div>
            <div style="font-size: var(--text-xl); font-weight: 900; margin-bottom: 8px;">${state.calcB.l}L ${state.calcB.dl}dL</div>
            <div style="display: flex; justify-content: center; gap: 8px;">
              <button class="btn btn-outline calc-operand-btn" data-target="B" data-unit="dl" data-delta="-1" style="min-height: 38px; width: 38px; padding:0;">−</button>
              <button class="btn btn-outline calc-operand-btn" data-target="B" data-unit="dl" data-delta="1" style="min-height: 38px; width: 38px; padding:0;">＋</button>
            </div>
          </div>
        </div>

        <!-- 計算結果バナー -->
        ${isError ? `
          <div class="card" style="background: #fee2e2; border-color: #f87171; text-align: center; color: #991b1b; font-weight: bold; font-size: var(--text-md);">
            ⚠️ あれれ？ ひく数「い」のほうが 大きくなっているよ。「い」を小さくしてね。
          </div>
        ` : `
          <div class="amount-display-board" style="animation: fadeIn 0.3s ease;">
            <div style="font-size: 14px; color: #94a3b8; text-align: center;">計算のこたえ</div>
            <div class="amount-main-val" style="color: #4ade80;">
              ${state.calcA.l}L ${state.calcA.dl}dL ${isAdd ? '＋' : '－'} ${state.calcB.l}L ${state.calcB.dl}dL ＝ 
              <strong style="color: #fbbf24; font-size: 1.15em;">${resL > 0 ? `${resL}L ` : ''}${resDL}dL</strong>
            </div>
            ${hasCarry ? `
              <div style="color: #facc15; font-weight: bold; text-align: center; font-size: 15px; margin-top: 6px;">
                ✨ dLをたすと ${state.calcA.dl + state.calcB.dl}dL！ 10dLあつまったので 1Lに くりあがったよ！
              </div>
            ` : hasBorrow ? `
              <div style="color: #67e8f9; font-weight: bold; text-align: center; font-size: 15px; margin-top: 6px;">
                ✨ dLがたりないので、1Lを 10dLに くずして けいさんしたよ！
              </div>
            ` : ''}
          </div>
        `}
      </div>
    `;
  }

  // ===== タブ④: みぢかなかさ図鑑 =====
  function renderZukanTab() {
    return `
      <div style="display: flex; flex-direction: column; gap: 20px;">
        <h3 style="font-size: var(--text-lg); color: var(--c-ink);">身の回りの もののかさを くらべてみよう！</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px;">
          <!-- ぎゅうにゅうパック -->
          <div class="card" style="display: flex; flex-direction: column; align-items: center; text-align: center; gap: 10px;">
            ${renderLifeVessel('milk1L', 80, 110)}
            <div style="font-size: var(--text-lg); font-weight: 900; color: var(--c-unit-l);">1 L （リットル）</div>
            <p style="font-size: var(--text-sm); color: var(--c-ink-2);">
              給食や スーパーで 見る 大きいぎゅうにゅうパックは、ちょうど 1L（10dL / 1000mL）だよ！
            </p>
          </div>

          <!-- ペットボトル -->
          <div class="card" style="display: flex; flex-direction: column; align-items: center; text-align: center; gap: 10px;">
            ${renderLifeVessel('pet500mL', 80, 110)}
            <div style="font-size: var(--text-lg); font-weight: 900; color: var(--c-unit-ml);">500 mL （5dL）</div>
            <p style="font-size: var(--text-sm); color: var(--c-ink-2);">
              自動販売機のお茶のペットボトルは 500mL。1Lの ちょうど 半分のカサだね！
            </p>
          </div>

          <!-- コップ -->
          <div class="card" style="display: flex; flex-direction: column; align-items: center; text-align: center; gap: 10px;">
            ${renderLifeVessel('cup200mL', 80, 100)}
            <div style="font-size: var(--text-lg); font-weight: 900; color: var(--c-unit-dl);">200 mL （2dL）</div>
            <p style="font-size: var(--text-sm); color: var(--c-ink-2);">
              おうちで つかう コップ 1ぱいは、だいたい 200mL（2dL）くらいだよ。
            </p>
          </div>

          <!-- 大さじスプーン -->
          <div class="card" style="display: flex; flex-direction: column; align-items: center; text-align: center; gap: 10px;">
            ${renderLifeVessel('spoon15mL', 110, 70)}
            <div style="font-size: var(--text-lg); font-weight: 900; color: var(--c-ink);">15 mL （小さじは5mL）</div>
            <p style="font-size: var(--text-sm); color: var(--c-ink-2);">
              りょうりに つかう「大さじ」は 15mL、「小さじ」は 5mL だよ。
            </p>
          </div>
        </div>
      </div>
    `;
  }

  // イベントバインディング
  function bindEvents() {
    // サブタブ切り替え
    root.querySelectorAll('.sub-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        state.currentTab = btn.dataset.tab;
        playSound('click', settings.sound);
        update();
      });
    });

    // へんしんラボ: 容器切り替え
    root.querySelectorAll('.toggle-vessel-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        state.activeVessel = btn.dataset.vessel;
        playSound('click', settings.sound);
        update();
      });
    });

    // へんしんラボ: ブロック表示チェック
    const checkBlocks = root.querySelector('#checkShowBlocks');
    if (checkBlocks) {
      checkBlocks.addEventListener('change', (e) => {
        state.showBlocks = e.target.checked;
        playSound('click', settings.sound);
        update();
      });
    }

    // へんしんラボ: クイックボタン
    root.querySelectorAll('.quick-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const val = Number(btn.dataset.val);
        if (state.activeVessel === '1L') {
          state.labDL = val;
        } else {
          state.labML = val;
        }
        playSound('pour', settings.sound);
        update();
      });
    });

    // へんしんラボ: スライダー
    const rangeEl = root.querySelector('.water-range');
    if (rangeEl) {
      rangeEl.addEventListener('input', (e) => {
        const val = Number(e.target.value);
        if (state.activeVessel === '1L') state.labDL = val;
        else state.labML = val;
        playSound('pour', settings.sound);
        update();
      });
    }

    const stepDown = root.querySelector('.btn-step-down');
    if (stepDown) {
      stepDown.addEventListener('click', () => {
        if (state.activeVessel === '1L') state.labDL = Math.max(0, state.labDL - 1);
        else state.labML = Math.max(0, state.labML - 10);
        playSound('pour', settings.sound);
        update();
      });
    }

    const stepUp = root.querySelector('.btn-step-up');
    if (stepUp) {
      stepUp.addEventListener('click', () => {
        if (state.activeVessel === '1L') state.labDL = Math.min(10, state.labDL + 1);
        else state.labML = Math.min(100, state.labML + 10);
        playSound('pour', settings.sound);
        update();
      });
    }

    // かずをつくる: ステッパー
    root.querySelectorAll('.build-stepper-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const unit = btn.dataset.unit;
        const delta = Number(btn.dataset.delta);
        if (unit === 'L') state.buildL = Math.max(0, Math.min(5, state.buildL + delta));
        if (unit === 'dL') state.buildDL = Math.max(0, Math.min(10, state.buildDL + delta));
        if (unit === 'mL') state.buildML = Math.max(0, Math.min(100, state.buildML + delta));
        playSound('pour', settings.sound);
        update();
      });
    });

    // けいさん: モード切り替え
    root.querySelectorAll('.toggle-calc-mode-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        state.calcMode = btn.dataset.mode;
        playSound('click', settings.sound);
        update();
      });
    });

    // けいさん: オペランド増減
    root.querySelectorAll('.calc-operand-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.target; // 'A' or 'B'
        const delta = Number(btn.dataset.delta);
        const obj = target === 'A' ? state.calcA : state.calcB;
        obj.dl += delta;
        if (obj.dl > 9) {
          obj.dl = 0;
          obj.l = Math.min(5, obj.l + 1);
        } else if (obj.dl < 0) {
          if (obj.l > 0) {
            obj.l -= 1;
            obj.dl = 9;
          } else {
            obj.dl = 0;
          }
        }
        playSound('pour', settings.sound);
        update();
      });
    });
  }

  renderView();

  return () => {};
}
