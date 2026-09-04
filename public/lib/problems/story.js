// P10: 実生活の文章題
export const P10 = {
  id: 'P10',
  name: 'せいかつの ぶんしょうだい',
  desc: '水とうや お茶、バケツの 水のかさの もんだい',
  generate(rng, opts = {}) {
    const stories = [
      () => {
        const bottleDL = rng.int(6, 9);
        const drinkDL = rng.int(2, bottleDL - 2);
        const remDL = bottleDL - drinkDL;
        const questionText = `すいとうに 水が ${bottleDL}dL はいっていました。${drinkDL}dL のみました。のこりは なんdL ですか。`;
        const answer = `${remDL}dL`;
        const distractors = [`${bottleDL + drinkDL}dL`, `${remDL + 1}dL`, `${Math.max(1, remDL - 1)}dL`].filter(x => x !== answer);
        return {
          questionText,
          answer,
          choices: rng.shuffle([answer, ...distractors]),
          explanation: `はじめにあった量から のんだ量を ひきます。\nしき：${bottleDL} － ${drinkDL} ＝ ${remDL}dL です。`
        };
      },
      () => {
        const potL = rng.int(1, 3);
        const potDL = rng.int(2, 5);
        const addDL = rng.int(2, 4);
        const totalDL = potDL + addDL;
        const questionText = `やかんの中に むぎ茶が ${potL}L ${potDL}dL あります。そこに ${addDL}dL つぎたしました。ぜんぶで なんL なんdL になりましたか。`;
        const answer = `${potL}L ${totalDL}dL`;
        const distractors = [`${potL + 1}L ${totalDL}dL`, `${potL}L ${totalDL + 1}dL`, `${potL}L ${totalDL - 1}dL`].filter(x => x !== answer);
        return {
          questionText,
          answer,
          choices: rng.shuffle([answer, ...distractors]),
          explanation: `dLどうしを たします。${potDL} ＋ ${addDL} ＝ ${totalDL}dL。\nあわせると ${potL}L ${totalDL}dL です。`
        };
      },
      () => {
        const numCartons = rng.int(2, 4);
        const questionText = `1Lの ぎゅうにゅうパックが ${numCartons}本 あります。ぜんぶで なんdL ですか。`;
        const answer = `${numCartons * 10}dL`;
        const distractors = [`${numCartons}dL`, `${numCartons * 100}dL`, `${(numCartons + 1) * 10}dL`].filter(x => x !== answer);
        return {
          questionText,
          answer,
          choices: rng.shuffle([answer, ...distractors]),
          explanation: `1L は 10dL です。${numCartons}本 あるので、10dL × ${numCartons} ＝ ${numCartons * 10}dL です。`
        };
      }
    ];

    const pickFn = rng.pick(stories);
    const prob = pickFn();
    return {
      pattern: 'P10',
      ...prob
    };
  }
};
