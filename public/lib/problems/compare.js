// P9: かさの大小比較問題
export const P9 = {
  id: 'P9',
  name: 'かさの くらべっこ',
  desc: 'たんいを そろえて どちらが大きいか くらべる',
  generate(rng, opts = {}) {
    const isLdL = rng.int(0, 1) === 0;

    if (isLdL) {
      // L・dL と dL の比較
      const l = rng.int(1, 4);
      const dl = rng.int(1, 9);
      const valA_dl = l * 10 + dl;

      const delta = rng.pick([-2, -1, 0, 1, 2]);
      const valB_dl = valA_dl + delta;

      const strA = `${l}L ${dl}dL`;
      const strB = `${valB_dl}dL`;

      let answer = '';
      if (valA_dl > valB_dl) answer = '＞';
      else if (valA_dl < valB_dl) answer = '＜';
      else answer = '＝';

      const questionText = `□ に あてはまる きごう（ ＞, ＜, ＝ ）を えらびましょう。\n${strA} □ ${strB}`;
      const choices = ['＞', '＜', '＝'];

      return {
        pattern: 'P9',
        questionText,
        answer,
        choices,
        explanation: `${strA} を dL になおすと ${valA_dl}dL です。\n${valA_dl}dL と ${valB_dl}dL をくらべると、${valA_dl === valB_dl ? 'おなじなので「＝」' : valA_dl > valB_dl ? `${valA_dl}dL のほうが大きいので「＞」` : `${valB_dl}dL のほうが大きいので「＜」`} です。`
      };
    } else {
      // L・mL と mL の比較
      const l = rng.int(1, 3);
      const ml = rng.pick([200, 400, 500, 700]);
      const valA_ml = l * 1000 + ml;

      const delta = rng.pick([-100, 0, 100]);
      const valB_ml = valA_ml + delta;

      const strA = `${l}L ${ml}mL`;
      const strB = `${valB_ml}mL`;

      let answer = '';
      if (valA_ml > valB_ml) answer = '＞';
      else if (valA_ml < valB_ml) answer = '＜';
      else answer = '＝';

      const questionText = `□ に あてはまる きごう（ ＞, ＜, ＝ ）を えらびましょう。\n${strA} □ ${strB}`;
      const choices = ['＞', '＜', '＝'];

      return {
        pattern: 'P9',
        questionText,
        answer,
        choices,
        explanation: `${strA} を mL になおすと ${valA_ml}mL です。\n${valA_ml}mL と ${valB_ml}mL をくらべると、${valA_ml === valB_ml ? 'おなじなので「＝」' : valA_ml > valB_ml ? '「＞」' : '「＜」'} になります。`
      };
    }
  }
};
