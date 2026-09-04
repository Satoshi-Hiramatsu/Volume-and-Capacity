// れんしゅう画面 (practice.js) - 10問テスト・即時判定・図解解説
import { renderCharacterSVG } from '../lib/character-svg.js';
import { generateProblemSet, PRESETS } from '../lib/problems/index.js';
import { playSound } from '../lib/sound.js';
import { randomSeed } from '../lib/rng.js';

export function renderPractice(root, { settings, params }) {
  let difficulty = Number(params.get('d')) || settings.lastDifficulty || 2;
  if (!PRESETS[difficulty]) difficulty = 2;

  let state = {
    step: 'setup', // 'setup' | 'playing' | 'result'
    difficulty,
    problems: [],
    currentIndex: 0,
    score: 0,
    selectedChoice: null,
    answered: false,
    history: []
  };

  function startQuiz(diff) {
    state.difficulty = diff;
    const seed = randomSeed();
    const set = generateProblemSet({ difficulty: diff, count: 10, seed });
    state.problems = set.problems;
    state.currentIndex = 0;
    state.score = 0;
    state.selectedChoice = null;
    state.answered = false;
    state.history = [];
    state.step = 'playing';
    playSound('transform', settings.sound);
    render();
  }

  function render() {
    if (state.step === 'setup') {
      renderSetup();
    } else if (state.step === 'playing') {
      renderQuestion();
    } else if (state.step === 'result') {
      renderResult();
    }
  }

  function renderSetup() {
    root.innerHTML = `
      <section class="practice-container">
        <div class="mascot-guide">
          <div class="mascot-avatar">${renderCharacterSVG('cheer', 68)}</div>
          <div class="mascot-speech">
            10問の れんしゅう問題に ちょうせん！<br>
            むずかしさを えらんで「スタート」をおしてね。
          </div>
        </div>

        <div class="card" style="display: flex; flex-direction: column; gap: 20px;">
          <h2 style="font-size: var(--text-lg); color: var(--c-ink);">難易度（むずかしさ）を えらぼう</h2>
          
          <div style="display: flex; flex-direction: column; gap: 12px;">
            ${[1, 2, 3, 4].map(d => {
              const p = PRESETS[d];
              return `
                <label class="pill-label" style="display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; cursor: pointer; ${state.difficulty === d ? 'border-color: var(--c-unit-l); background: var(--c-unit-l-light);' : ''}">
                  <div style="display: flex; align-items: center; gap: 12px;">
                    <input type="radio" name="difficulty" value="${d}" ${state.difficulty === d ? 'checked' : ''} style="transform: scale(1.3);">
                    <div>
                      <div style="font-size: var(--text-md); font-weight: 900; color: var(--c-ink);">
                        ⭐ レベル ${d}：${p.label}
                      </div>
                      <div style="font-size: var(--text-sm); color: var(--c-ink-3); margin-top: 2px;">
                        ${p.desc}
                      </div>
                    </div>
                  </div>
                </label>
              `;
            }).join('')}
          </div>

          <div style="display: flex; justify-content: center; margin-top: 8px;">
            <button id="btnStartQuiz" class="btn btn-accent" style="min-height: 56px; padding: 0 40px; font-size: var(--text-lg);">
              🚀 れんしゅうを はじめる！
            </button>
          </div>
        </div>
      </section>
    `;

    root.querySelectorAll('input[name="difficulty"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        state.difficulty = Number(e.target.value);
        playSound('click', settings.sound);
        renderSetup();
      });
    });

    root.querySelector('#btnStartQuiz').addEventListener('click', () => {
      startQuiz(state.difficulty);
    });
  }

  function renderQuestion() {
    const prob = state.problems[state.currentIndex];
    const total = state.problems.length;
    const progressPercent = ((state.currentIndex) / total) * 100;

    root.innerHTML = `
      <section class="practice-container">
        <!-- プログレスバー -->
        <div class="practice-progress-bar">
          <span style="color: var(--c-unit-l); font-size: var(--text-md);">
            もんだい ${state.currentIndex + 1} / ${total}
          </span>
          <div style="width: 140px; height: 10px; background: #e2e8f0; border-radius: 99px; overflow: hidden;">
            <div style="width: ${progressPercent}%; height: 100%; background: var(--c-unit-l); transition: width 0.3s ease;"></div>
          </div>
          <span style="color: var(--c-correct); font-size: var(--text-sm);">
            せいかい: ${state.score} 問
          </span>
        </div>

        <!-- クイズカード -->
        <div class="quiz-card">
          <div class="quiz-question-text">
            Q${state.currentIndex + 1}. ${prob.questionText}
          </div>

          ${prob.renderSvg ? `
            <div class="quiz-illustration-box">
              ${prob.renderSvg(state.answered)}
            </div>
          ` : ''}

          <!-- 4択ボタン -->
          <div class="quiz-options-grid">
            ${prob.choices.map(c => {
              let statusClass = '';
              if (state.answered) {
                if (c === prob.answer) statusClass = 'correct';
                else if (c === state.selectedChoice) statusClass = 'wrong';
              }
              return `
                <button class="quiz-opt-btn ${statusClass}" data-choice="${c}" ${state.answered ? 'disabled' : ''}>
                  ${c}
                </button>
              `;
            }).join('')}
          </div>

          <!-- 解説 & 次へボタン (回答後表示) -->
          ${state.answered ? `
            <div class="quiz-explanation-box">
              <h4>💡 かいせつ</h4>
              <p style="line-height: 1.6; white-space: pre-line;">${prob.explanation}</p>
              <div style="display: flex; justify-content: flex-end; margin-top: 14px;">
                <button id="btnNextProb" class="btn btn-primary" style="min-height: 50px; font-size: var(--text-md);">
                  ${state.currentIndex + 1 < total ? 'つぎの もんだいへ ➔' : '結果を みる！ 🏆'}
                </button>
              </div>
            </div>
          ` : ''}
        </div>
      </section>
    `;

    // 選択肢タップ
    root.querySelectorAll('.quiz-opt-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (state.answered) return;
        const choice = btn.dataset.choice;
        state.selectedChoice = choice;
        state.answered = true;
        const isCorrect = choice === prob.answer;
        if (isCorrect) state.score += 1;
        state.history.push({ prob, choice, isCorrect });

        playSound(isCorrect ? 'correct' : 'wrong', settings.sound);
        renderQuestion();
      });
    });

    const nextBtn = root.querySelector('#btnNextProb');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (state.currentIndex + 1 < total) {
          state.currentIndex += 1;
          state.selectedChoice = null;
          state.answered = false;
          playSound('click', settings.sound);
          renderQuestion();
        } else {
          state.step = 'result';
          playSound('fanfare', settings.sound);
          render();
        }
      });
    }
  }

  function renderResult() {
    const total = state.problems.length;
    const isPerfect = state.score === total;
    const isGreat = state.score >= 8;

    root.innerHTML = `
      <section class="practice-container">
        <div class="card" style="text-align: center; padding: 36px 20px; animation: celebratePop 0.4s ease-out;">
          <div style="margin-bottom: 12px;">
            ${renderCharacterSVG(isPerfect ? 'sparkle' : isGreat ? 'cheer' : 'happy', 110)}
          </div>

          <h2 style="font-size: var(--text-2xl); color: ${isPerfect ? '#ea580c' : '#0369a1'}; margin-bottom: 6px;">
            ${isPerfect ? '💮 はなまる満点！ かんぺき！' : isGreat ? '🎉 よくがんばったね！ すばらしい！' : '👍 つぎは もっと できるよ！'}
          </h2>

          <div style="font-size: 52px; font-weight: 900; color: #dc2626; margin: 16px 0; font-feature-settings: 'tnum';">
            ${state.score * 10} <span style="font-size: 24px; color: var(--c-ink);">点</span>
          </div>
          <div style="font-size: var(--text-base); color: var(--c-ink-2); margin-bottom: 24px;">
            10問中 ${state.score}問 せいかい（正答率 ${Math.round((state.score / total) * 100)}%）
          </div>

          <div style="display: flex; justify-content: center; gap: 14px; flex-wrap: wrap;">
            <button id="btnRetry" class="btn btn-primary" style="min-height: 52px;">
              🔄 もういちど ちょうせん
            </button>
            <a href="#print?d=${state.difficulty}" class="btn btn-accent" style="min-height: 52px;">
              🖨️ このレベルの A4プリントをつくる
            </a>
            <button id="btnBackHome" class="btn btn-outline" style="min-height: 52px;">
              🏠 ホームへ もどる
            </button>
          </div>
        </div>
      </section>
    `;

    root.querySelector('#btnRetry').addEventListener('click', () => {
      startQuiz(state.difficulty);
    });

    root.querySelector('#btnBackHome').addEventListener('click', () => {
      location.hash = '#home';
    });
  }

  render();

  return () => {};
}
