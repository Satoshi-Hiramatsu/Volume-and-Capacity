// 問題システム統合エントリーポイント
import { createRng, randomSeed } from '../rng.js';
import { P1, P2 } from './read.js';
import { P3, P4 } from './convert.js';
import { P5, P6, P7, P8 } from './calc.js';
import { P9 } from './compare.js';
import { P10 } from './story.js';

export const PATTERNS = { P1, P2, P3, P4, P5, P6, P7, P8, P9, P10 };
export const PATTERN_KEYS = Object.keys(PATTERNS);

// 難易度プリセット定義 (1:しょきゅう, 2:ちゅうきゅう, 3:じょうきゅう, 4:はってん)
export const PRESETS = {
  1: {
    label: '初級（やさしい）',
    desc: 'ますのめもり、1L＝10dL、かんたんなたし算',
    patterns: ['P1', 'P3', 'P5']
  },
  2: {
    label: '中級（標準）',
    desc: '1dLます・ビーカー、LとdLのへんしん、くりあがりたし算、ひき算',
    patterns: ['P1', 'P2', 'P3', 'P5', 'P6', 'P7']
  },
  3: {
    label: '上級（しっかり）',
    desc: 'mLへのへんしん、くりさがりひき算、くらべっこ、文章題',
    patterns: ['P1', 'P2', 'P3', 'P4', 'P6', 'P7', 'P8', 'P9', 'P10']
  },
  4: {
    label: '発展（マスター）',
    desc: '全パターンから総合出題！',
    patterns: PATTERN_KEYS
  }
};

/**
 * 問題セットを生成（シード乱数によって完全再現可能）
 */
export function generateProblemSet(options = {}) {
  const {
    difficulty = 2,
    patterns = null,
    count = 8,
    seed = randomSeed()
  } = options;

  const rng = createRng(seed);
  const targetPatternKeys = (patterns && patterns.length > 0)
    ? patterns.filter(k => PATTERNS[k])
    : (PRESETS[difficulty] || PRESETS[2]).patterns;

  const problemSet = [];
  for (let i = 0; i < count; i++) {
    // パターンを順繰りまたはランダムにピック
    const pKey = targetPatternKeys[i % targetPatternKeys.length];
    const patternObj = PATTERNS[pKey];
    const problem = patternObj.generate(rng, { difficulty });
    problemSet.push({
      num: i + 1,
      id: `${seed}_${i + 1}`,
      ...problem
    });
  }

  return {
    seed,
    difficulty,
    count,
    problems: problemSet
  };
}
