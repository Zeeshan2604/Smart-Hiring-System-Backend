const FillersRemover = (Res_Answer_Array) => {
  if (!Array.isArray(Res_Answer_Array)) {
    console.error("Input is not an array:", Res_Answer_Array);
    return [];
  }

  const FilterArray = [];
  const Word_Fillers = [
    "um", "uh", "like", "you know", "sort of", "kind of", "basically",
    "actually", "literally", "honestly", "just", "really", "very",
    "so", "well", "right", "okay", "ok", "anyway", "anyways"
  ];

  function removeFillerWords(text) {
    if (!text || typeof text !== 'string') {
      return '';
    }
    const words = text.split(' ');
    const filteredWords = words.filter(word => !Word_Fillers.includes(word.toLowerCase()));
    return filteredWords.join(' ');
  }

  Res_Answer_Array.forEach((Ind_Answer) => {
    const textWithoutFillerWords = removeFillerWords(Ind_Answer);
    FilterArray.push(textWithoutFillerWords);
  });

  return FilterArray;
};

module.exports = {
  FillersRemover
};