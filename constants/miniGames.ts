export interface WordPair {
  id: string;
  word: string;   // foreign language word
  meaning: string; // English meaning
}

export const WORD_PAIRS: Record<string, WordPair[]> = {
  srivijaya: [
    { id: "s1", word: "buku", meaning: "book" },
    { id: "s2", word: "ilmu", meaning: "knowledge" },
    { id: "s3", word: "menulis", meaning: "write" },
    { id: "s4", word: "membaca", meaning: "read" },
    { id: "s5", word: "cahaya", meaning: "light" },
    { id: "s6", word: "kata", meaning: "word" },
  ],
  japan: [
    { id: "j1", word: "本 (hon)", meaning: "book" },
    { id: "j2", word: "知恵 (chie)", meaning: "wisdom" },
    { id: "j3", word: "書く (kaku)", meaning: "write" },
    { id: "j4", word: "読む (yomu)", meaning: "read" },
    { id: "j5", word: "光 (hikari)", meaning: "light" },
    { id: "j6", word: "言葉 (kotoba)", meaning: "word" },
  ],
  korea: [
    { id: "k1", word: "책 (chaek)", meaning: "book" },
    { id: "k2", word: "지식 (jisik)", meaning: "knowledge" },
    { id: "k3", word: "쓰기 (sseugi)", meaning: "write" },
    { id: "k4", word: "읽기 (ilgi)", meaning: "read" },
    { id: "k5", word: "빛 (bit)", meaning: "light" },
    { id: "k6", word: "단어 (daneo)", meaning: "word" },
  ],
  china: [
    { id: "c1", word: "书 (shū)", meaning: "book" },
    { id: "c2", word: "知识 (zhīshi)", meaning: "knowledge" },
    { id: "c3", word: "写 (xiě)", meaning: "write" },
    { id: "c4", word: "读 (dú)", meaning: "read" },
    { id: "c5", word: "光 (guāng)", meaning: "light" },
    { id: "c6", word: "字 (zì)", meaning: "word" },
  ],
  tibet: [
    { id: "t1", word: "དཔེ་ཆ (dpe-cha)", meaning: "book" },
    { id: "t2", word: "ཤེས་རབ (shes-rab)", meaning: "wisdom" },
    { id: "t3", word: "བྲིས་པ (bris-pa)", meaning: "write" },
    { id: "t4", word: "ཀློག་པ (klog-pa)", meaning: "read" },
    { id: "t5", word: "འོད (od)", meaning: "light" },
    { id: "t6", word: "ཚིག (tshig)", meaning: "word" },
  ],
};

// Number of pairs based on verdict difficulty
export const PAIRS_BY_VERDICT: Record<string, number> = {
  WORTHY: 4,
  NEUTRAL: 5,
  UNWORTHY: 6,
};
