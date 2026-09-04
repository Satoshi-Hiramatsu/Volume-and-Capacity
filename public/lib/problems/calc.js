// P5〜P8: かさの計算（たし算・ひき算）

export const P5 = {
  id: 'P5',
  name: 'たし算（くりあがり なし）',
  desc: 'おなじ たんいどうしを そのまま たす',
  generate(rng, opts = {}) {
    const l1 = rng.int(1, 4);
    const dl1 = rng.int(1, 4);
    const l2 = rng.int(1, 3);
    const dl2 = rng.int(1, 9 - dl1); // 繰り上がりなし (dl1 + dl2 <= 9)

    const ansL = l1 + l2;
    const ansDL = dl1 + dl2;
    const answer = `${ansL}L ${ansDL}dL`;
    const questionText = `つぎの けいさんを しましょう。\n${l1}L ${dl1}dL ＋ ${l2}L ${dl2}dL ＝`;

    const distractors = [
      `${ansL + 1}L ${ansDL}dL`,
      `${ansL}L ${Math.max(1, ansDL - 1)}dL`,
      `${ansL - 1}L ${ansDL + 1}dL`,
      `${ansL + 1}L ${ansDL - 1}dL`
    ].filter(x => x !== answer);
    const choices = rng.shuffle([answer, ...distractors.slice(0, 3)]);

    return {
      pattern: 'P5',
      questionText,
      answer,
      choices,
      explanation: `Lどうし、dLどうしを それぞれ たします。\nLのけいさん：${l1} ＋ ${l2} ＝ ${ansL}L\ndLのけいさん：${dl1} ＋ ${dl2} ＝ ${ansDL}dL\nあわせて ${ansL}L ${ansDL}dL です。`
    };
  }
};

export const P6 = {
  id: 'P6',
  name: 'たし算（くりあがり あり）',
  desc: '10dL＝1L に くりあがる けいさん',
  generate(rng, opts = {}) {
    const l1 = rng.int(1, 3);
    const dl1 = rng.int(5, 9);
    const l2 = rng.int(1, 3);
    const dl2 = rng.int(10 - dl1, 9); // 繰り上がりあり (dl1 + dl2 >= 10)

    const sumDL = dl1 + dl2;
    const carryL = Math.floor(sumDL / 10);
    const remDL = sumDL % 10;
    const ansL = l1 + l2 + carryL;

    const answer = remDL === 0 ? `${ansL}L` : `${ansL}L ${remDL}dL`;
    const questionText = `つぎの けいさんを しましょう。\n${l1}L ${dl1}dL ＋ ${l2}L ${dl2}dL ＝`;

    const distractors = [
      `${l1 + l2}L ${sumDL}dL`, // 繰り上がり忘れミス（定番）
      `${ansL + 1}L ${remDL}dL`,
      `${ansL}L ${remDL + 1}dL`,
      `${ansL - 1}L ${remDL}dL`
    ].filter(x => x !== answer);
    const choices = rng.shuffle([answer, ...distractors.slice(0, 3)]);

    return {
      pattern: 'P6',
      questionText,
      answer,
      choices,
      explanation: `dLどうしを たすと：${dl1} ＋ ${dl2} ＝ ${sumDL}dL になります。\n10dL は 1L に くりあがります！\nLは ${l1} ＋ ${l2} ＋ 1 ＝ ${ansL}L、のこりの dLは ${remDL}dL なので、こたえは ${answer} です。`
    };
  }
};

export const P7 = {
  id: 'P7',
  name: 'ひき算（くりさがり なし）',
  desc: 'おなじ たんいどうしを そのまま ひく',
  generate(rng, opts = {}) {
    const l1 = rng.int(3, 7);
    const dl1 = rng.int(4, 9);
    const l2 = rng.int(1, l1 - 1);
    const dl2 = rng.int(1, dl1); // 繰り下がりなし

    const ansL = l1 - l2;
    const ansDL = dl1 - dl2;
    const answer = ansDL === 0 ? `${ansL}L` : `${ansL}L ${ansDL}dL`;
    const questionText = `つぎの けいさんを しましょう。\n${l1}L ${dl1}dL － ${l2}L ${dl2}dL ＝`;

    const distractors = [
      `${ansL}L ${ansDL + 1}dL`,
      `${ansL + 1}L ${ansDL}dL`,
      `${Math.max(1, ansL - 1)}L ${ansDL}dL`,
      `${ansL}L ${Math.max(1, ansDL - 1)}dL`
    ].filter(x => x !== answer);
    const choices = rng.shuffle([answer, ...distractors.slice(0, 3)]);

    return {
      pattern: 'P7',
      questionText,
      answer,
      choices,
      explanation: `Lどうし、dLどうしを それぞれ ひきます。\nLのけいさん：${l1} － ${l2} ＝ ${ansL}L\ndLのけいさん：${dl1} － ${dl2} ＝ ${ansDL}dL\nこたえは ${answer} です。`
    };
  }
};

export const P8 = {
  id: 'P8',
  name: 'ひき算（くりさがり あり）',
  desc: '1L＝10dL に くずして ひく けいさん',
  generate(rng, opts = {}) {
    const isPureL = rng.int(0, 1) === 0;

    if (isPureL) {
      // 例: 2L - 6dL = 1L 4dL
      const l1 = rng.int(2, 5);
      const dl2 = rng.int(1, 9);
      const ansL = l1 - 1;
      const ansDL = 10 - dl2;
      const answer = `${ansL}L ${ansDL}dL`;
      const questionText = `つぎの けいさんを しましょう。\n${l1}L － ${dl2}dL ＝`;

      const distractors = [
        `${l1}L ${dl2}dL`,
        `${ansL}L ${ansDL - 1}dL`,
        `${ansL}L ${dl2}dL`,
        `${ansL + 1}L ${ansDL}dL`
      ].filter(x => x !== answer);
      const choices = rng.shuffle([answer, ...distractors.slice(0, 3)]);

      return {
        pattern: 'P8',
        questionText,
        answer,
        choices,
        explanation: `${l1}L から 1L をかりてきて、10dL に くずします。\n10dL － ${dl2}dL ＝ ${ansDL}dL です。\nのこった Lは ${ansL}L なので、こたえは ${answer} です。`
      };
    } else {
      // 例: 3L 2dL - 1L 5dL
      const l1 = rng.int(2, 5);
      const dl1 = rng.int(1, 4);
      const l2 = rng.int(1, l1 - 1);
      const dl2 = rng.int(dl1 + 1, 9); // dl1 < dl2 なので繰り下がり発生

      // l1 から 1L かりてきて (dl1 + 10) - dl2
      const ansDL = dl1 + 10 - dl2;
      const ansL = l1 - 1 - l2;
      const answer = ansL === 0 ? `${ansDL}dL` : `${ansL}L ${ansDL}dL`;
      const questionText = `つぎの けいさんを しましょう。\n${l1}L ${dl1}dL － ${l2}L ${dl2}dL ＝`;

      const distractors = [
        `${l1 - l2}L ${dl2 - dl1}dL`, // ひっくり返して引いたミス（超頻出）
        `${ansL + 1}L ${ansDL}dL`,
        `${ansL}L ${ansDL - 1}dL`,
        `${ansL}L ${ansDL + 1}dL`
      ].filter(x => x !== answer);
      const choices = rng.shuffle([answer, ...distractors.slice(0, 3)]);

      return {
        pattern: 'P8',
        questionText,
        answer,
        choices,
        explanation: `${dl1}dL から ${dl2}dL は ひけません。\nそこで ${l1}L から 1L をかりて 10dL に くずします。\nすると dLは ${dl1 + 10}dL になり、${dl1 + 10} － ${dl2} ＝ ${ansDL}dL です。\nLは 1へって ${l1 - 1}L になり、${l1 - 1} － ${l2} ＝ ${ansL}L です。\nこたえは ${answer} です。`
      };
    }
  }
};
