// ホーム画面 (home.js)
import { renderCharacterSVG } from '../lib/character-svg.js';
import { render1LBox, render1dLCup, renderLifeVessel } from '../lib/vessels-svg.js';
import { generateProblemSet } from '../lib/problems/index.js';
import { playSound } from '../lib/sound.js';

export function renderHome(root, { settings }) {
  // 今日のミニクイズ（1問ランダム生成）
  const dailySet = generateProblemSet({ difficulty: 1, count: 1 });
  const dailyProb = dailySet.problems[0];

  root.innerHTML = `
    <section class="home-view">
      <!-- ヒーローバナー -->
      <div class="home-hero">
        <div class="hero-content">
          <h1>算数 かさ・容量<br><small style="font-size: 0.6em; color: var(--c-unit-l);">L（リットル）・dL（デシリットル）・mL（ミリリットル）</small></h1>
          <p class="hero-desc">
            水のかさを 見て、さわって、たのしくマスター！<br>
            画面でじっけんしたり、A4プリントをつくって 印刷できるよ。
          </p>
          <div style="display: flex; gap: 12px; flex-wrap: wrap;">
            <a href="#learn" class="btn btn-primary">🧪 画面で まなぶ</a>
            <a href="#practice" class="btn btn-accent">✏️ れんしゅう 問題</a>
            <a href="#print" class="btn btn-outline">🖨️ A4プリント 作成</a>
          </div>
        </div>
        <div class="hero-mascot" style="text-align: center;">
          ${renderCharacterSVG('cheer', 120)}
          <div style="font-weight: bold; font-size: 13px; color: #0369a1; margin-top: 4px;">カサの妖精 ドロップくん</div>
        </div>
      </div>

      <!-- モード選択カード一覧 -->
      <h2 style="font-size: var(--text-lg); margin-bottom: 14px; color: var(--c-ink);">あそびかた・べんきょうメニュー</h2>
      <div class="home-modes-grid">
        <!-- まなぶカード -->
        <a href="#learn" class="mode-card">
          <div class="mode-card-icon" style="background: #e0f2fe;">
            ${render1LBox(6, { width: 50, height: 50 })}
          </div>
          <h3 class="mode-card-title">🧪 画面で まなぶ</h3>
          <p class="mode-card-desc">
            1Lますに 水をそそいで 単位のへんしんを じっけん！ 10dLが 1Lに くりあがる ようすが よくわかるよ。
          </p>
          <div style="margin-top: auto; font-weight: bold; color: var(--c-unit-l); font-size: var(--text-sm);">
            へんしんラボ / かずづくり / けいさん →
          </div>
        </a>

        <!-- れんしゅうカード -->
        <a href="#practice" class="mode-card">
          <div class="mode-card-icon" style="background: #ffedd5;">
            ${render1dLCup(50, { width: 50, height: 50 })}
          </div>
          <h3 class="mode-card-title">✏️ れんしゅう 問題</h3>
          <p class="mode-card-desc">
            めもりの よみとり、単位へんかん、たし算・ひき算の 10問クイズに ちょうせん！ くわしい図解つき。
          </p>
          <div style="margin-top: auto; font-weight: bold; color: var(--c-unit-dl); font-size: var(--text-sm);">
            ☆1〜☆4の難易度でテスト →
          </div>
        </a>

        <!-- プリントカード -->
        <a href="#print" class="mode-card">
          <div class="mode-card-icon" style="background: #dcfce7; font-size: 32px;">
            🖨️
          </div>
          <h3 class="mode-card-title">📄 A4プリント 作成</h3>
          <p class="mode-card-desc">
            おうちや 教室で 使える A4テストを かんたん作成！ 解答つきで、何回でも ちがう問題が 作れるよ。
          </p>
          <div style="margin-top: auto; font-weight: bold; color: var(--c-correct); font-size: var(--text-sm);">
            印刷・PDF保存はこちら →
          </div>
        </a>

        <!-- ずかんカード -->
        <a href="#learn?tab=zukan" class="mode-card">
          <div class="mode-card-icon" style="background: #f1f5f9;">
            ${renderLifeVessel('milk1L', 45, 55)}
          </div>
          <h3 class="mode-card-title">🥛 みぢかなかさ 図鑑</h3>
          <p class="mode-card-desc">
            ぎゅうにゅうパック、ペットボトル、お風呂、スプーン… 身の回りの 水のかさを くらべてみよう！
          </p>
          <div style="margin-top: auto; font-weight: bold; color: var(--c-ink-2); font-size: var(--text-sm);">
            かさの感覚を 身につける →
          </div>
        </a>
      </div>

      <!-- 今日のデイリークイズ -->
      <div class="card" style="margin-bottom: var(--space-xl); border: 2px solid #38bdf8; background: #f0f9ff;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
          <h3 style="font-size: var(--text-md); color: #0369a1; display: flex; align-items: center; gap: 8px;">
            🌟 今日の かさクイズ
          </h3>
          <span style="font-size: var(--text-xs); background: #bae6fd; color: #0369a1; padding: 2px 8px; border-radius: 99px; font-weight: bold;">1問スピード腕試し</span>
        </div>
        <p style="font-size: var(--text-base); font-weight: bold; margin-bottom: 12px; white-space: pre-line;">
          ${dailyProb.questionText}
        </p>
        ${dailyProb.renderSvg ? `<div style="text-align: center; margin-bottom: 12px;">${dailyProb.renderSvg(false)}</div>` : ''}
        <div class="daily-quiz-choices" style="display: flex; gap: 10px; flex-wrap: wrap;">
          ${dailyProb.choices.map(c => `
            <button class="btn btn-outline daily-choice-btn" data-choice="${c}" style="min-height: 44px; flex: 1 1 calc(50% - 10px);">
              ${c}
            </button>
          `).join('')}
        </div>
        <div id="dailyFeedback" style="display: none; margin-top: 12px; font-weight: bold;"></div>
      </div>

      <!-- かさの基本早見表 -->
      <div class="card">
        <h3 style="font-size: var(--text-md); margin-bottom: 12px; color: var(--c-ink);">💡 かさの 単位まとめ（おぼえておこう！）</h3>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px;">
          <div style="background: #eff6ff; border: 2px solid #bfdbfe; border-radius: var(--radius-md); padding: 14px; text-align: center;">
            <div style="font-size: var(--text-lg); font-weight: 900; color: var(--c-unit-l);">1L ＝ 10dL</div>
            <div style="font-size: var(--text-xs); color: #1e40af; margin-top: 4px;">1Lますの中に 1dLコップが 10杯入るよ！</div>
          </div>
          <div style="background: #fff7ed; border: 2px solid #fed7aa; border-radius: var(--radius-md); padding: 14px; text-align: center;">
            <div style="font-size: var(--text-lg); font-weight: 900; color: var(--c-unit-dl);">1dL ＝ 100mL</div>
            <div style="font-size: var(--text-xs); color: #9a3412; margin-top: 4px;">1dLコップは 100ミリリットル！</div>
          </div>
          <div style="background: #ecfeff; border: 2px solid #a5f3fc; border-radius: var(--radius-md); padding: 14px; text-align: center;">
            <div style="font-size: var(--text-lg); font-weight: 900; color: var(--c-unit-ml);">1L ＝ 1000mL</div>
            <div style="font-size: var(--text-xs); color: #155e75; margin-top: 4px;">1Lは ミリリットルだと 1000mL！</div>
          </div>
        </div>
      </div>
    </section>
  `;

  // デイリークイズのイベント登録
  const feedbackEl = root.querySelector('#dailyFeedback');
  root.querySelectorAll('.daily-choice-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const chosen = btn.dataset.choice;
      const isCorrect = chosen === dailyProb.answer;
      playSound(isCorrect ? 'correct' : 'wrong', settings.sound);

      root.querySelectorAll('.daily-choice-btn').forEach(b => {
        b.disabled = true;
        if (b.dataset.choice === dailyProb.answer) {
          b.style.borderColor = 'var(--c-correct)';
          b.style.background = 'var(--c-correct-soft)';
        } else if (b === btn) {
          b.style.borderColor = 'var(--c-danger)';
          b.style.background = '#fee2e2';
        }
      });

      feedbackEl.style.display = 'block';
      feedbackEl.style.color = isCorrect ? 'var(--c-correct)' : 'var(--c-danger)';
      feedbackEl.innerHTML = isCorrect
        ? `🎉 大正解！ ${dailyProb.explanation}`
        : `惜しい！ せいかいは <strong>${dailyProb.answer}</strong> だよ。<br>${dailyProb.explanation}`;
    });
  });

  return () => {};
}
