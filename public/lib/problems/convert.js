// P3, P4: 単位のへんしん（換算問題）
export const P3 = {
  id: 'P3',
  name: 'L と dL の へんしん',
  desc: '1L＝10dL をつかった たんいへんかん',
  generate(rng, opts = {}) {
    const type = rng.pick(['L_to_dL', 'dL_to_L', 'compound_to_dL', 'dL_to_compound']);

    if (type === 'L_to_dL') {
      const l = rng.int(2, 9);
      const answer = `${l * 10}dL`;
      const questionText = `${l}L は なんdL ですか。`;
      const distractors = [`${l}dL`, `${l * 100}dL`, `${l * 1000}dL`, `${(l + 1) * 10}dL`].filter(x => x !== answer);
      const choices = rng.shuffle([answer, ...distractors.slice(0, 3)]);
      return {
        pattern: 'P3',
        questionText,
        answer,
        choices,
        explanation: `1L ＝ 10dL です。${l}L は 10dL が ${l}こ なので、${l} × 10 ＝ ${l * 10}dL になります。`
      };
    } else if (type === 'dL_to_L') {
      const l = rng.int(2, 8);
      const dl = l * 10;
      const answer = `${l}L`;
      const questionText = `${dl}dL は なんL ですか。`;
      const distractors = [`${dl}L`, `${l * 10}L`, `${Math.max(1, l - 1)}L`, `${l + 1}L`].filter(x => x !== answer);
      const choices = rng.shuffle([answer, ...distractors.slice(0, 3)]);
      return {
        pattern: 'P3',
        questionText,
        answer,
        choices,
        explanation: `10dL あつまると 1L になります。${dl}dL のなかに 10dL は ${l}こ あるので、${l}L です。`
      };
    } else if (type === 'compound_to_dL') {
      const l = rng.int(1, 5);
      const dl = rng.int(1, 9);
      const totalDL = l * 10 + dl;
      const answer = `${totalDL}dL`;
      const questionText = `${l}L ${dl}dL は なんdL ですか。`;
      const distractors = [`${l * 10}dL`, `${l + dl}dL`, `${totalDL + 10}dL`, `${totalDL - 10}dL`].filter(x => x !== answer);
      const choices = rng.shuffle([answer, ...distractors.slice(0, 3)]);
      return {
        pattern: 'P3',
        questionText,
        answer,
        choices,
        explanation: `${l}L は ${l * 10}dL です。のこりの ${dl}dL をあわせると、${l * 10} ＋ ${dl} ＝ ${totalDL}dL になります。`
      };
    } else {
      // dL_to_compound
      const l = rng.int(1, 5);
      const dl = rng.int(1, 9);
      const totalDL = l * 10 + dl;
      const answer = `${l}L ${dl}dL`;
      const questionText = `${totalDL}dL は なんL なんdL ですか。`;
      const distractors = [
        `${l}L ${Math.max(1, dl - 1)}dL`,
        `${l + 1}L ${dl}dL`,
        `${dl}L ${l}dL`,
        `${totalDL}L`
      ].filter(x => x !== answer);
      const choices = rng.shuffle([answer, ...distractors.slice(0, 3)]);
      return {
        pattern: 'P3',
        questionText,
        answer,
        choices,
        explanation: `${totalDL}dL のうち、${l * 10}dL は ${l}L になります。のこりは ${dl}dL なので、${l}L ${dl}dL です。`
      };
    }
  }
};

export const P4 = {
  id: 'P4',
  name: 'dL・L と mL の へんしん',
  desc: '1dL＝100mL, 1L＝1000mL の たんいへんかん',
  generate(rng, opts = {}) {
    const type = rng.pick(['dL_to_mL', 'mL_to_dL', 'L_to_mL', 'compound_to_mL']);

    if (type === 'dL_to_mL') {
      const dl = rng.int(2, 8);
      const answer = `${dl * 100}mL`;
      const questionText = `${dl}dL は なんmL ですか。`;
      const distractors = [`${dl * 10}mL`, `${dl}mL`, `${dl * 1000}mL`, `${(dl + 1) * 100}mL`].filter(x => x !== answer);
      const choices = rng.shuffle([answer, ...distractors.slice(0, 3)]);
      return {
        pattern: 'P4',
        questionText,
        answer,
        choices,
        explanation: `1dL ＝ 100mL です。${dl}dL は 100mL が ${dl}こ なので、${dl * 100}mL です。`
      };
    } else if (type === 'mL_to_dL') {
      const dl = rng.int(2, 9);
      const ml = dl * 100;
      const answer = `${dl}dL`;
      const questionText = `${ml}mL は なんdL ですか。`;
      const distractors = [`${dl * 10}dL`, `${dl / 10}dL`, `${Math.max(1, dl - 1)}dL`, `${dl + 1}dL`].filter(x => x !== answer);
      const choices = rng.shuffle([answer, ...distractors.slice(0, 3)]);
      return {
        pattern: 'P4',
        questionText,
        answer,
        choices,
        explanation: `100mL ＝ 1dL です。${ml}mL のなかに 100mL は ${dl}こ あるので、${dl}dL です。`
      };
    } else if (type === 'L_to_mL') {
      const l = rng.int(1, 4);
      const answer = `${l * 1000}mL`;
      const questionText = `${l}L は なんmL ですか。`;
      const distractors = [`${l * 100}mL`, `${l * 10}mL`, `${(l + 1) * 1000}mL`, `${l}00mL`].filter(x => x !== answer);
      const choices = rng.shuffle([answer, ...distractors.slice(0, 3)]);
      return {
        pattern: 'P4',
        questionText,
        answer,
        choices,
        explanation: `1L ＝ 1000mL です。1Lますには 1000mL の水が入ります。${l}L は ${l * 1000}mL です。`
      };
    } else {
      // compound_to_mL (例: 1L 300mL は なんmL?)
      const l = rng.int(1, 3);
      const ml = rng.pick([200, 350, 500, 600, 800]);
      const total = l * 1000 + ml;
      const answer = `${total}mL`;
      const questionText = `${l}L ${ml}mL は なんmL ですか。`;
      const distractors = [`${l * 100 + ml}mL`, `${total - 100}mL`, `${total + 100}mL`, `${l}${ml}0mL`].filter(x => x !== answer);
      const choices = rng.shuffle([answer, ...distractors.slice(0, 3)]);
      return {
        pattern: 'P4',
        questionText,
        answer,
        choices,
        explanation: `${l}L は ${l * 1000}mL です。そこに ${ml}mL をあわせると、${l * 1000} ＋ ${ml} ＝ ${total}mL になります。`
      };
    }
  }
};
