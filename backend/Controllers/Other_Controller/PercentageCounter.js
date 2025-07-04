const { FillersRemover } = require("./Helping_Functions/FillersRemover");
const {
  Interview_Details_Model,
} = require("../../DatabaseSetup/Mongoose.InterviewDetails.Schema");

const {
  String_Comparison_Function,
} = require("./Helping_Functions/String_Comparison_Function");

const Percentage_Calculator_Function = async (req, res, next) => {
  const { Res_Interview_ID, Res_Answer_Array, Res_Interview_Timing } = req.body;
  console.log("calculate result api");
  console.log("Request body:", req.body);
  
  try {
    //Find the Interview details...
    const Find_Interview = await Interview_Details_Model.findOne({
      Interview_ID: Res_Interview_ID,
    });

    console.log("Find_Interview", Find_Interview);
    if (!Find_Interview) {
      console.log("Interview not found for ID:", Res_Interview_ID);
      return res.status(404).json({
        status: "Error",
        message: "Interview not found",
      });
    }

    if (!Find_Interview.Answer_Arrays || !Array.isArray(Find_Interview.Answer_Arrays)) {
      console.log("Invalid Answer_Arrays in interview:", Find_Interview.Answer_Arrays);
      return res.status(400).json({
        status: "Error",
        message: "Invalid answer arrays in interview data",
      });
    }

    if (!Res_Answer_Array || !Array.isArray(Res_Answer_Array)) {
      console.log("Invalid Res_Answer_Array:", Res_Answer_Array);
      return res.status(400).json({
        status: "Error",
        message: "Invalid answer array in request",
      });
    }

    //Filtered Answers.....
    console.log("Original candidate answers:", Res_Answer_Array);
    console.log("Original interview answers:", Find_Interview.Answer_Arrays);
    
    const FilterCandidateArray = FillersRemover(Res_Answer_Array);
    const FilterOrginalArray = FillersRemover(Find_Interview.Answer_Arrays);
    
    console.log("Filtered candidate answers:", FilterCandidateArray);
    console.log("Filtered interview answers:", FilterOrginalArray);

    // Calculate time percentage (normalized between 0 and 100)
    const timePercentage = Math.min(100, Math.max(0, 
      (Res_Interview_Timing / (Find_Interview.Time_Duration * 60)) * 100
    ));
    console.log("Time percentage calculated:", timePercentage);

    // Get emotion data from AWSResult
    let awsResult = [];
    try {
      awsResult = JSON.parse(req.body.AWSResult || '[]');
      console.log("Parsed AWSResult:", awsResult);
    } catch (parseError) {
      console.log("Error parsing AWSResult:", parseError);
      awsResult = [];
    }
    
    let emotionScore = 0;
    
    if (awsResult && awsResult.length > 0 && awsResult.some(frame => frame !== null)) {
      // Filter out null values
      const validFrames = awsResult.filter(frame => frame && typeof frame === 'object');
      console.log("Valid emotion frames:", validFrames);
      
      if (validFrames.length > 0) {
        // Calculate average emotions
        const emotionSums = validFrames.reduce((acc, frame) => {
          if (frame && typeof frame === 'object') {
            Object.keys(frame).forEach(emotion => {
              acc[emotion] = (acc[emotion] || 0) + frame[emotion];
            });
          }
          return acc;
        }, {});

        console.log("Emotion sums:", emotionSums);

        // Calculate emotion score based on positive emotions
        const positiveEmotions = ['HAPPY', 'CALM'];
        const negativeEmotions = ['ANGRY', 'SAD', 'FEAR', 'DISGUSTED'];
        
        const positiveScore = positiveEmotions.reduce((sum, emotion) => 
          sum + (emotionSums[emotion] || 0), 0) / positiveEmotions.length;
        
        const negativeScore = negativeEmotions.reduce((sum, emotion) => 
          sum + (emotionSums[emotion] || 0), 0) / negativeEmotions.length;

        console.log("Positive score:", positiveScore, "Negative score:", negativeScore);

        // Calculate final emotion score (0-100)
        if (positiveScore + negativeScore > 0) {
          emotionScore = Math.min(100, Math.max(0, 
            (positiveScore / (positiveScore + negativeScore)) * 100
          ));
        } else {
          emotionScore = 50; // Default neutral score if no emotions detected
        }
      } else {
        emotionScore = 50; // Default neutral score if no valid frames
      }
    } else {
      emotionScore = 50; // Default neutral score if no emotion data
    }
    
    console.log("Final emotion score:", emotionScore);

    console.log("About to call String_Comparison_Function");
    console.log("FilterOrginalArray:", FilterOrginalArray);
    console.log("FilterCandidateArray:", FilterCandidateArray);

    // Calculate answer similarity scores
    try {
      const Data = await String_Comparison_Function(FilterOrginalArray, FilterCandidateArray);
      console.log("String_Comparison_Function result:", Data);
      
      const answerScores = Data[0];
      const overallAnswerScore = Data[1];
      const toneScores = Data[2] || [];

      console.log("Answer scores:", answerScores);
      console.log("Overall answer score:", overallAnswerScore);
      console.log("Tone scores:", toneScores);

      // Calculate final scores with weights
      console.log("=== DETAILED CALCULATION DEBUG ===");
      console.log("Raw values:");
      console.log("- overallAnswerScore (raw):", overallAnswerScore, "type:", typeof overallAnswerScore);
      console.log("- timePercentage (raw):", timePercentage, "type:", typeof timePercentage);
      console.log("- emotionScore (raw):", emotionScore, "type:", typeof emotionScore);
      
      const answerScore = parseFloat(overallAnswerScore) || 0;
      const timeScore = parseFloat(timePercentage) || 0;
      const emotionScoreValue = parseFloat(emotionScore) || 0;
      
      console.log("Parsed values:");
      console.log("- answerScore:", answerScore, "type:", typeof answerScore);
      console.log("- timeScore:", timeScore, "type:", typeof timeScore);
      console.log("- emotionScoreValue:", emotionScoreValue, "type:", typeof emotionScoreValue);
      
      console.log("Individual calculations:");
      const answerComponent = answerScore * 0.6; // Reduced from 0.7 to make room for tone
      const timeComponent = timeScore * 0.1;     // Reduced from 0.15
      const emotionComponent = emotionScoreValue * 0.1; // Reduced from 0.15
      const toneComponent = (toneScores.length > 0 ? 
        (toneScores.reduce((sum, score) => sum + score, 0) / toneScores.length) : 50) * 0.2; // 20% weight for tone
      
      console.log("- answerComponent (60%):", answerComponent);
      console.log("- timeComponent (10%):", timeComponent);
      console.log("- emotionComponent (10%):", emotionComponent);
      console.log("- toneComponent (20%):", toneComponent);
      
      const overallScore = Math.round(answerComponent + timeComponent + emotionComponent + toneComponent);
      console.log("- overallScore (rounded):", overallScore);
      console.log("- isNaN(overallScore):", isNaN(overallScore));
      console.log("=== END DEBUG ===");
      
      const finalScores = {
        answerScores: answerScores,
        toneScores: toneScores,
        overallScore: overallScore,
        timeScore: Math.round(timeScore),
        emotionScore: Math.round(emotionScoreValue)
      };

      console.log("Final scores calculated:", finalScores);
      console.log("Individual components:");
      console.log("- overallAnswerScore:", overallAnswerScore, "(parsed as:", answerScore, ")");
      console.log("- timePercentage:", timePercentage, "(parsed as:", timeScore, ")");
      console.log("- emotionScore:", emotionScore, "(parsed as:", emotionScoreValue, ")");
      console.log("- Calculation:", `(${answerScore} * 0.6) + (${timeScore} * 0.1) + (${emotionScoreValue} * 0.1) + (${toneComponent} * 0.2) = ${overallScore}`);

      if (finalScores && !isNaN(finalScores.overallScore)) {
        console.log("Sending successful response with overallScore:", finalScores.overallScore);
        res.status(200).json({
          status: "Success",
          message: "Result found successfully !",
          answerPercentageList: finalScores.answerScores,
          tonePercentageList: finalScores.toneScores,
          overAllPercentage: finalScores.overallScore,
          timeResult: finalScores.timeScore,
          emotionResult: finalScores.emotionScore
        });
      } else {
        console.error("Invalid final scores, returning error", finalScores);
        res.status(500).json({
          status: "Error",
          message: "Unable to calculate percentage !",
          debug: finalScores
        });
      }
    } catch (comparisonError) {
      console.error("Error in String_Comparison_Function:", comparisonError);
      res.status(500).json({
        status: "Error",
        message: "Error calculating string comparison scores",
        error: comparisonError.message || comparisonError
      });
    }
  } catch (Error) {
    console.error("Error in percentage calculator:", Error);
    res.status(500).json({
      status: "Error",
      message: "Error in percentage calculator",
      error: Error.message || Error
    });
  }
};

module.exports = { Percentage_Calculator_Function };
