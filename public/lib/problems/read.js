// P1, P2: 目盛りの読み取り問題
import { render1LBox, render1dLCup, renderCylinder } from '../vessels-svg.js';

export const P1 = {
  id: 'P1',
  name: '1Lますの めもり',
  desc: '1Lますの 水のかさを よみとる',
  generate(rng, opts = {}) {
    // 1〜10dLのランダム値
    const dl = rng.int(1, 10);
    const questionText = 'したの 1Lますに はいっている 水のかさは いくらですか。';
    const answer = dl === 10 ? '1L' : `${dl}dL`;
    const answerVal = dl;
    const answerUnit = dl === 10 ? 'L' : 'dL';

    // 誤答の選択肢（よくあるミス：1目盛りズレ、LとdLの混同など）
    const distractors = new Set();
    if (dl === 10) {
      distractors.add('10dL'); // 同値だが通常1Lと書く
      distractors.add('9dL');
      distractors.add('1dL');
      distractors.add('10L');
    } else {
      if (dl > 1) distractors.add(`${dl - 1}dL`);
      if (dl < 9) distractors.add(`${dl + 1}dL`);
      distractors.add(`${dl * 10}mL`); // 単位混同
      distractors.add(`${dl}L`);       // 単位混同
      distractors.add(`${10 - dl}dL`); // 空のほうを読んだ
    }
    distractors.delete(answer);
    const choices = rng.shuffle([answer, ...Array.from(distractors).slice(0, 3)]);

    const renderSvg = (ans = false, print = false) =>
      render1LBox(dl, { width: 140, height: 150, highlightAnswer: ans, printMode: print });

    return {
      pattern: 'P1',
      questionText,
      answer,
      answerUnit,
      answerVal,
      choices,
      explanation: dl === 10
        ? '1Lます いっぱいで 1L（10dL）です！'
        : `1Lますの 1めもりは 1dL です。下から数えて ${dl}めもり なので、こたえは ${dl}dL です。`,
      renderSvg
    };
  }
};

export const P2 = {
  id: 'P2',
  name: '1dLます・ビーカーの めもり',
  desc: '1dLますやシリンダーの mLを よみとる',
  generate(rng, opts = {}) {
    const isCup = rng.int(0, 1) === 0;
    if (isCup) {
      // 1dLます (10〜100mL, 10刻み)
      const ml = rng.pick([20, 30, 40, 50, 60, 70, 80, 90, 100]);
      const answer = ml === 100 ? '1dL' : `${ml}mL`;
      const questionText = 'したの 1dLますに はいっている 水のかさは いくらですか。';

      const distractors = new Set([
        `${ml + 10}mL`,
        `${Math.max(10, ml - 10)}mL`,
        `${ml / 10}dL`,
        `${ml}dL`
      ]);
      distractors.delete(answer);
      const choices = rng.shuffle([answer, ...Array.from(distractors).slice(0, 3)]);

      return {
        pattern: 'P2',
        questionText,
        answer,
        choices,
        explanation: `1dLますの 小さい1めもりは 10mL です。水面は ${ml}mL をさしています。${ml === 100 ? '（100mL は 1dL ともおなじです）' : ''}`,
        renderSvg: (ans = false, print = false) =>
          render1dLCup(ml, { width: 130, height: 145, highlightAnswer: ans, printMode: print })
      };
    } else {
      // シリンダー (50〜500mL, 50刻み)
      const ml = rng.pick([100, 150, 200, 250, 300, 350, 400, 450, 500]);
      const answer = `${ml}mL`;
      const questionText = 'したの メスシリンダーの 水のかさは いくらですか。';

      const distractors = new Set([
        `${ml + 50}mL`,
        `${Math.max(50, ml - 50)}mL`,
        `${ml / 100}dL`,
        `${ml / 10}dL`
      ]);
      distractors.delete(answer);
      const choices = rng.shuffle([answer, ...Array.from(distractors).slice(0, 3)]);

      return {
        pattern: 'P2',
        questionText,
        answer,
        choices,
        explanation: `めもりを よむと ${ml}mL の位置に 水面があります。`,
        renderSvg: (ans = false, print = false) =>
          renderCylinder(ml, 500, { width: 120, height: 160, highlightAnswer: ans, printMode: print })
      };
    }
  }
};
