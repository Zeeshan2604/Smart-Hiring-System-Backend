const Tone_Function = async (AnswerD) => {
  // ---------------------------
  try {
    async function toneAnalyzer(data) {
      const apiKey = process.env.huggingface;
      if (!apiKey || apiKey === 'YOUR_HUGGINGFACE_KEY' || apiKey.length < 10) {
        console.error("[Tone_Function] HuggingFace API key is missing or invalid. Please set 'huggingface' in your .env file.");
        throw new Error("Missing or invalid HuggingFace API key");
      }
      const response = await fetch(
        "https://api-inference.huggingface.co/models/bhadresh-savani/bert-base-uncased-emotion",
        {
          headers: {
            Authorization: apiKey,
          },
          method: "POST",
          body: JSON.stringify(data),
        }
      );
      
      if (!response.ok) {
        if (response.status === 401) {
          console.error("[Tone_Function] HuggingFace API returned 401 Unauthorized. Check your API key.");
        } else {
          console.error(`[Tone_Function] HuggingFace API error: HTTP ${response.status}`);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    }

    const candidateAnswerD = AnswerD; //pass candidate answer not array
    console.log("Analyzing tone for answer:", candidateAnswerD);

    const response = await toneAnalyzer({ inputs: candidateAnswerD });
    console.log("Tone analysis response:", response);

    if (response && Array.isArray(response) && response.length > 0) {
      return response[0]; // Return the emotion analysis results
    } else {
      console.log("No valid tone analysis response");
      return null;
    }

  } catch (Error) {
    console.log("Error in Tone_Function:", Error.message || Error);
    return null;
  }
};

module.exports = {
  Tone_Function,
};
