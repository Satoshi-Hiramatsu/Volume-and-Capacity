// シード値付き乱数生成エンジン (Mulberry32)
// A4プリントのURL共有・再印刷時の完全再現性を担保する

export function createRng(seed = 1) {
  let s = Math.floor(Math.abs(seed)) || 1;
  return {
    next() {
      s |= 0;
      s = (s + 0x6d2b79f5) | 0;
      let t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    },
    int(min, max) {
      return Math.floor(this.next() * (max - min + 1)) + min;
    },
    pick(array) {
      if (!array || array.length === 0) return null;
      return array[this.int(0, array.length - 1)];
    },
    shuffle(array) {
      const copy = [...array];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = this.int(0, i);
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    }
  };
}

export function randomSeed() {
  return Math.floor(Math.random() * 900000) + 100000;
}
