const natural = require("natural");
const tokenizer = new natural.WordTokenizer();

const TFIDF_Calculator_Function = (candidateAnswer, predefinedAnswer) => {
  if (!candidateAnswer || !predefinedAnswer || 
      typeof candidateAnswer !== 'string' || 
      typeof predefinedAnswer !== 'string') {
    console.error("Invalid input for TFIDF calculation");
    return 0;
  }

  function cosineSimilarity(a, p) {
    const vecA = tokenizer.tokenize(a.toLowerCase());
    const vecP = tokenizer.tokenize(p.toLowerCase());

    if (!vecA || !vecP || vecA.length === 0 || vecP.length === 0) {
      console.error("Empty vectors after tokenization");
      return 0;
    }

    const tfidf = new natural.TfIdf();
    tfidf.addDocument(vecA);
    tfidf.addDocument(vecP);

    const vec1 = vecA.map(term => tfidf.tfidf(term, 0));
    const vec2 = vecP.map(term => tfidf.tfidf(term, 1));

    const dotProduct = calculateDotProduct(vec1, vec2);
    const norm1 = calculateVectorMagnitude(vec1);
    const norm2 = calculateVectorMagnitude(vec2);

    if (norm1 === 0 || norm2 === 0) {
      return 0;
    }

    return dotProduct / (norm1 * norm2);
  }

  function calculateDotProduct(vec1, vec2) {
    return vec1.reduce((sum, val, i) => sum + (val * (vec2[i] || 0)), 0);
  }

  function calculateVectorMagnitude(vector) {
    return Math.sqrt(vector.reduce((sum, val) => sum + (val * val), 0));
  }

  const similarity = cosineSimilarity(candidateAnswer, predefinedAnswer);
  const result_Percentage = Math.min(100, Math.max(0, similarity * 100));
  
  return result_Percentage;
};

module.exports = {
  TFIDF_Calculator_Function
};
