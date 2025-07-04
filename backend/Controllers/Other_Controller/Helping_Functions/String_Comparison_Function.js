const {TFIDF_Calculator_Function}= require("./TFIDF_Calculator");
const {Tone_Function} = require("../Helping_Functions/Tone_Analyzer");
const {Custome_Match_Function} = require("./Custome_Match");
const String_Comparison_Function = async (
  Original_Array, Candidate_Array
) => {
  try {
    console.log("String_Comparison_Function called with:");
    console.log("Original_Array:", Original_Array);
    console.log("Candidate_Array:", Candidate_Array);

    if (!Array.isArray(Original_Array) || !Array.isArray(Candidate_Array)) {
      console.error("Invalid input: arrays required");
      return [[], 0, []];
    }

    // Use the original array length (actual number of questions) instead of padding
    const actualQuestionCount = Original_Array.length;
    console.log("Actual question count:", actualQuestionCount);
    
    // Only process the actual questions, ignore extra candidate answers
    const candidateAnswersForQuestions = Candidate_Array.slice(0, actualQuestionCount);
    console.log("Candidate answers for questions:", candidateAnswersForQuestions);

    let Answer_Result_Array = []
    let Tone_Result_Array = []
    let FinalPercentage = 0
    let AddingD = 0
    
    for(let i = 0; i < actualQuestionCount; i++){
      console.log(`Processing question ${i + 1}:`);
      console.log(`Original: "${Original_Array[i]}"`);
      console.log(`Candidate: "${candidateAnswersForQuestions[i]}"`);
      
      try {
        // Content similarity
        let customCalculate = 0;
        try {
          customCalculate = Custome_Match_Function(Original_Array[i], candidateAnswersForQuestions[i]);
        } catch (contentError) {
          console.error(`Error in content similarity for question ${i + 1}:`, contentError);
          customCalculate = 0;
        }
        if(customCalculate === null || isNaN(customCalculate)){
          console.log(`Invalid result for question ${i + 1}, setting to 0`);
          Answer_Result_Array.push(0);
        } else {
          Answer_Result_Array.push(customCalculate);
        }

        // Tone analysis
        try {
          const toneResult = await Tone_Function(candidateAnswersForQuestions[i]);
          console.log(`Tone analysis result for question ${i + 1}:`, toneResult);
          
          if (toneResult && Array.isArray(toneResult)) {
            // Calculate weighted tone score based on positive emotions
            const positiveEmotions = ['joy', 'love', 'surprise'];
            const negativeEmotions = ['anger', 'sadness', 'fear'];
            
            let positiveScore = 0;
            let negativeScore = 0;
            
            toneResult.forEach(({ label, score }) => {
              if (positiveEmotions.includes(label.toLowerCase())) {
                positiveScore += score;
              } else if (negativeEmotions.includes(label.toLowerCase())) {
                negativeScore += score;
              }
            });
            
            // Calculate tone score (0-100)
            const totalScore = positiveScore + negativeScore;
            const toneScore = totalScore > 0 ? (positiveScore / totalScore) * 100 : 50;
            Tone_Result_Array.push(Math.round(toneScore));
          } else {
            Tone_Result_Array.push(50); // Default neutral score
          }
        } catch (toneError) {
          console.error(`Tone analysis error for question ${i + 1}:`, toneError);
          Tone_Result_Array.push(50); // Default neutral score
        }
        
      } catch (questionError) {
        console.error(`Error processing question ${i + 1}:`, questionError);
        Answer_Result_Array.push(0);
        Tone_Result_Array.push(50);
      }
    }
    
    console.log("Final Answer_Result_Array:", Answer_Result_Array);
    console.log("Final Tone_Result_Array:", Tone_Result_Array);
    console.log("Summ------======-", AddingD);
    
    function sumArray(Array) {
      return Array.reduce((sum, value) => sum + (value || 0), 0);
    }
    
    let sumOfPercent = sumArray(Answer_Result_Array);
    let sumOfTone = sumArray(Tone_Result_Array);
    console.log("Sum of content percentages:", sumOfPercent);
    console.log("Sum of tone percentages:", sumOfTone);
    console.log("Array length:", Answer_Result_Array.length);
    
    // Calculate final percentage with content (80%) and tone (20%) weights
    const contentPercentage = (sumOfPercent / ((Answer_Result_Array.length) * 100)) * 100;
    const tonePercentage = (sumOfTone / ((Tone_Result_Array.length) * 100)) * 100;
    
    FinalPercentage = (contentPercentage * 0.8) + (tonePercentage * 0.2);
    console.log("Content percentage:", contentPercentage);
    console.log("Tone percentage:", tonePercentage);
    console.log("Calculated FinalPercentage:", FinalPercentage);

    // Ensure the final percentage is a valid number
    if (isNaN(FinalPercentage)) {
      console.warn("FinalPercentage is NaN, setting to 0");
      FinalPercentage = 0;
    }

    console.log("Returning:", [Answer_Result_Array, FinalPercentage, Tone_Result_Array]);
    return [Answer_Result_Array, FinalPercentage, Tone_Result_Array];
  } catch (error) {
    console.error("Fatal error in String_Comparison_Function:", error);
    return [[], 0, []];
  }
};

module.exports = {
  String_Comparison_Function,
};
