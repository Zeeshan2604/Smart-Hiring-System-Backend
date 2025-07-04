const axios = require("axios");
require('dotenv').config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Rate limiting and retry configuration
let geminiRequestCount = 0;
let lastGeminiRequest = 0;
const GEMINI_RATE_LIMIT = 10; // requests per minute
const GEMINI_RATE_WINDOW = 60000; // 1 minute in milliseconds

const ChatbotController = async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message || typeof message !== 'string') {
      return res.status(400).json({
        status: "Error",
        message: "Please provide a valid message"
      });
    }

    console.log("Chatbot request received:", message);

    // 1. Try Gemini (Google PaLM/Gemini API) with rate limiting
    if (GEMINI_API_KEY) {
      const now = Date.now();
      
      // Reset counter if window has passed
      if (now - lastGeminiRequest > GEMINI_RATE_WINDOW) {
        geminiRequestCount = 0;
      }
      
      // Check rate limit
      if (geminiRequestCount < GEMINI_RATE_LIMIT) {
        try {
          geminiRequestCount++;
          lastGeminiRequest = now;
          
          console.log("Attempting Gemini API call with key:", GEMINI_API_KEY.substring(0, 10) + "...");
          console.log("Gemini requests this minute:", geminiRequestCount);
          
          const geminiRes = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
            {
              contents: [{ parts: [{ text: message }] }]
            },
            {
              headers: { 'Content-Type': 'application/json' },
              timeout: 15000
            }
          );
          
          console.log("Gemini API response status:", geminiRes.status);
          
          if (geminiRes.data && geminiRes.data.candidates && geminiRes.data.candidates[0]?.content?.parts[0]?.text) {
            const geminiText = geminiRes.data.candidates[0].content.parts[0].text;
            console.log("Gemini response:", geminiText.substring(0, 100) + "...");
            
            // Filter and format the response to make it more readable
            const formattedResponse = formatChatbotResponse(geminiText, message);
            
            return res.status(200).json({
              status: "Success",
              message: "Gemini response generated successfully",
              response: formattedResponse
            });
          } else {
            console.log("Gemini response structure invalid:", geminiRes.data);
          }
        } catch (geminiErr) {
          console.log("Gemini API error:", geminiErr.message);
          if (geminiErr.response?.data) {
            console.log("Gemini API error response:", JSON.stringify(geminiErr.response.data, null, 2));
          }
          
          // If it's a rate limit or quota error, reduce the counter to allow retries
          if (geminiErr.response?.status === 400 || geminiErr.response?.status === 429) {
            geminiRequestCount = Math.max(0, geminiRequestCount - 1);
            console.log("Rate limit/quota hit, reducing counter to:", geminiRequestCount);
          }
          // Continue to next fallback
        }
      } else {
        console.log("Gemini rate limit reached, skipping to fallback");
      }
    } else {
      console.log("No Gemini API key found, skipping Gemini API call");
    }

    // 2. Try Free AI Service (no API key required)
    try {
      console.log("Attempting free AI service...");
      const response = await axios.post(
        "https://api.freeai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are a helpful career and interview assistant. Provide concise, practical advice for job seekers, programmers, and students."
            },
            {
              role: "user",
              content: message
            }
          ],
          max_tokens: 300,
          temperature: 0.7
        },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000
        }
      );
      
      if (response.data && response.data.choices && response.data.choices[0]?.message?.content) {
        const aiText = response.data.choices[0].message.content;
        console.log("Free AI response:", aiText.substring(0, 100) + "...");
        return res.status(200).json({
          status: "Success",
          message: "Free AI response generated successfully",
          response: aiText
        });
      }
    } catch (freeAiError) {
      console.log("Free AI service error:", freeAiError.message);
      // Continue to next fallback
    }

    // 3. Try HuggingFace (DialoGPT) with better error handling
    try {
      console.log("Attempting HuggingFace API call...");
      const response = await axios.post(
        "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium",
        {
          inputs: message,
          parameters: {
            max_length: 150,
            temperature: 0.7,
            top_p: 0.9,
            do_sample: true
          }
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.huggingface || 'hf_demo'}`,
            "Content-Type": "application/json"
          },
          timeout: 10000 // 10 second timeout
        }
      );
      if (response.data && response.data[0] && response.data[0].generated_text) {
        console.log("HuggingFace response:", response.data[0].generated_text);
        return res.status(200).json({
          status: "Success",
          message: "HuggingFace response generated successfully",
          response: response.data[0].generated_text
        });
      }
    } catch (apiError) {
      console.log("HuggingFace API error:", apiError.message);
      // Continue to fallback response
    }

    // 4. Enhanced fallback to intelligent responses based on message content
    const fallbackResponse = getEnhancedFallbackResponse(message);
    
    console.log("Using enhanced fallback response");
    
    return res.status(200).json({
      status: "Success",
      message: "Enhanced fallback response generated",
      response: fallbackResponse
    });

  } catch (error) {
    console.error("Chatbot controller error:", error);
    return res.status(500).json({
      status: "Error",
      message: "Internal server error",
      response: "I apologize, but I'm having trouble processing your request right now. Please try again in a moment!"
    });
  }
};

const getEnhancedFallbackResponse = (userMessage) => {
  const message = userMessage.toLowerCase();
  
  // JavaScript specific responses
  if (message.includes('javascript') || message.includes('js')) {
    return `JavaScript is a high-level, interpreted programming language that's essential for web development. Here's what you should know:

**Key Features:**
• Dynamic typing - variables can change types
• Prototype-based inheritance
• Event-driven programming
• Runs in browsers and on servers (Node.js)

**Common Uses:**
• Frontend web development (React, Vue, Angular)
• Backend development (Node.js, Express)
• Mobile apps (React Native)
• Desktop apps (Electron)

**Learning Path:**
1. Start with basic syntax and DOM manipulation
2. Learn ES6+ features (arrow functions, destructuring)
3. Understand asynchronous programming (Promises, async/await)
4. Explore frameworks like React or Vue
5. Practice with real projects

Would you like specific JavaScript concepts explained?`;
  }
  
  // Interview related responses
  if (message.includes('interview') || message.includes('interview tips')) {
    return "Here are some key interview tips:\n\n1. Research the company thoroughly\n2. Practice common questions\n3. Dress professionally\n4. Arrive early\n5. Show enthusiasm and confidence\n6. Ask thoughtful questions\n7. Follow up with a thank you email\n\nWould you like specific tips for any particular type of interview?";
  }
  
  if (message.includes('resume') || message.includes('cv')) {
    return "For a great resume:\n\n1. Keep it concise (1-2 pages)\n2. Use action verbs\n3. Quantify achievements\n4. Tailor it to the job\n5. Include relevant keywords\n6. Proofread carefully\n7. Use a clean, professional format\n\nNeed help with a specific section?";
  }
  
  if (message.includes('programming') || message.includes('code') || message.includes('developer')) {
    return "Programming career advice:\n\n1. Build a strong portfolio\n2. Contribute to open source\n3. Learn version control (Git)\n4. Practice coding daily\n5. Network with other developers\n6. Stay updated with trends\n7. Focus on problem-solving skills\n\nWhat programming language or technology are you interested in?";
  }
  
  if (message.includes('study') || message.includes('learning')) {
    return "Effective study strategies:\n\n1. Use active learning techniques\n2. Break down complex topics\n3. Practice regularly\n4. Teach others what you learn\n5. Use spaced repetition\n6. Take breaks and stay hydrated\n7. Find your optimal study environment\n\nWhat subject are you studying?";
  }
  
  if (message.includes('career') || message.includes('job search')) {
    return "Career development tips:\n\n1. Set clear career goals\n2. Build your professional network\n3. Develop in-demand skills\n4. Seek mentorship\n5. Stay adaptable to change\n6. Build your personal brand\n7. Continuously learn and grow\n\nWhat career field interests you?";
  }
  
  if (message.includes('salary') || message.includes('negotiation')) {
    return "Salary negotiation tips:\n\n1. Research market rates\n2. Know your worth\n3. Practice your pitch\n4. Consider total compensation\n5. Be confident but respectful\n6. Have alternatives ready\n7. Don't accept the first offer\n\nNeed help preparing for a specific negotiation?";
  }

  if (message.includes('java') || message.includes('python') || message.includes('react')) {
    return "Great choice! Here are some tips for learning programming:\n\n1. Start with fundamentals\n2. Practice coding daily\n3. Build small projects\n4. Read documentation\n5. Join coding communities\n6. Use version control\n7. Learn debugging skills\n\nWhat specific aspect would you like to focus on?";
  }

  if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
    return "Hello! I'm your Smart Hire Assistant. I can help you with:\n\n• Interview preparation and tips\n• Resume and CV writing\n• Programming and technical questions\n• Study strategies and learning\n• Career advice and job search\n• Salary negotiation\n\nWhat would you like to know more about?";
  }

  if (message.includes('thank')) {
    return "You're welcome! I'm here to help you succeed in your career journey. Feel free to ask me anything about interviews, programming, study tips, or career advice. Good luck with your goals! 🚀";
  }
  
  // Default response
  return "I'm here to help with your career and professional development! I can assist with:\n\n• Interview preparation and tips\n• Resume and CV writing\n• Programming and technical questions\n• Study strategies and learning\n• Career advice and job search\n• Salary negotiation\n\nWhat would you like to know more about?";
};

const getFallbackResponse = (userMessage) => {
  const message = userMessage.toLowerCase();
  
  // Interview related responses
  if (message.includes('interview') || message.includes('interview tips')) {
    return "Here are some key interview tips:\n\n1. Research the company thoroughly\n2. Practice common questions\n3. Dress professionally\n4. Arrive early\n5. Show enthusiasm and confidence\n6. Ask thoughtful questions\n7. Follow up with a thank you email\n\nWould you like specific tips for any particular type of interview?";
  }
  
  if (message.includes('resume') || message.includes('cv')) {
    return "For a great resume:\n\n1. Keep it concise (1-2 pages)\n2. Use action verbs\n3. Quantify achievements\n4. Tailor it to the job\n5. Include relevant keywords\n6. Proofread carefully\n7. Use a clean, professional format\n\nNeed help with a specific section?";
  }
  
  if (message.includes('programming') || message.includes('code') || message.includes('developer')) {
    return "Programming career advice:\n\n1. Build a strong portfolio\n2. Contribute to open source\n3. Learn version control (Git)\n4. Practice coding daily\n5. Network with other developers\n6. Stay updated with trends\n7. Focus on problem-solving skills\n\nWhat programming language or technology are you interested in?";
  }
  
  if (message.includes('study') || message.includes('learning')) {
    return "Effective study strategies:\n\n1. Use active learning techniques\n2. Break down complex topics\n3. Practice regularly\n4. Teach others what you learn\n5. Use spaced repetition\n6. Take breaks and stay hydrated\n7. Find your optimal study environment\n\nWhat subject are you studying?";
  }
  
  if (message.includes('career') || message.includes('job search')) {
    return "Career development tips:\n\n1. Set clear career goals\n2. Build your professional network\n3. Develop in-demand skills\n4. Seek mentorship\n5. Stay adaptable to change\n6. Build your personal brand\n7. Continuously learn and grow\n\nWhat career field interests you?";
  }
  
  if (message.includes('salary') || message.includes('negotiation')) {
    return "Salary negotiation tips:\n\n1. Research market rates\n2. Know your worth\n3. Practice your pitch\n4. Consider total compensation\n5. Be confident but respectful\n6. Have alternatives ready\n7. Don't accept the first offer\n\nNeed help preparing for a specific negotiation?";
  }

  if (message.includes('java') || message.includes('javascript') || message.includes('python')) {
    return "Great choice! Here are some tips for learning programming:\n\n1. Start with fundamentals\n2. Practice coding daily\n3. Build small projects\n4. Read documentation\n5. Join coding communities\n6. Use version control\n7. Learn debugging skills\n\nWhat specific aspect would you like to focus on?";
  }

  if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
    return "Hello! I'm your Smart Hire Assistant. I can help you with:\n\n• Interview preparation and tips\n• Resume and CV writing\n• Programming and technical questions\n• Study strategies and learning\n• Career advice and job search\n• Salary negotiation\n\nWhat would you like to know more about?";
  }

  if (message.includes('thank')) {
    return "You're welcome! I'm here to help you succeed in your career journey. Feel free to ask me anything about interviews, programming, study tips, or career advice. Good luck with your goals! 🚀";
  }
  
  // Default response
  return "I'm here to help with your career and professional development! I can assist with:\n\n• Interview preparation and tips\n• Resume and CV writing\n• Programming and technical questions\n• Study strategies and learning\n• Career advice and job search\n• Salary negotiation\n\nWhat would you like to know more about?";
};

// Function to format and filter chatbot responses for better readability
const formatChatbotResponse = (response, userMessage) => {
  const message = userMessage.toLowerCase();
  
  // For interview questions, provide a concise list
  if (message.includes('interview') && (message.includes('question') || message.includes('java') || message.includes('javascript') || message.includes('python'))) {
    return getConciseInterviewQuestions(message);
  }
  
  // For general programming questions, limit to 2-3 paragraphs
  if (message.includes('what is') || message.includes('explain') || message.includes('how to')) {
    return limitResponseLength(response, 300);
  }
  
  // For career advice, keep it concise
  if (message.includes('career') || message.includes('job') || message.includes('resume')) {
    return limitResponseLength(response, 200);
  }
  
  // Default: limit to reasonable length
  return limitResponseLength(response, 250);
};

// Function to limit response length and improve formatting
const limitResponseLength = (text, maxLength) => {
  // Remove excessive formatting
  let cleaned = text
    .replace(/\*\*\*/g, '') // Remove bold formatting
    .replace(/\*\*/g, '')   // Remove bold formatting
    .replace(/\*/g, '')     // Remove italic formatting
    .replace(/#{1,6}\s/g, '') // Remove headers
    .replace(/\n{3,}/g, '\n\n') // Limit multiple newlines
    .trim();
  
  // If response is too long, truncate and add ellipsis
  if (cleaned.length > maxLength) {
    const truncated = cleaned.substring(0, maxLength);
    const lastPeriod = truncated.lastIndexOf('.');
    if (lastPeriod > maxLength * 0.7) {
      return truncated.substring(0, lastPeriod + 1) + '..';
    }
    return truncated + '...';
  }
  
  return cleaned;
};

// Function to provide concise interview questions
const getConciseInterviewQuestions = (message) => {
  if (message.includes('java')) {
    return `Here are key Java interview questions:

**Basic Level:**
• What are primitive data types in Java?
• Difference between == and .equals()?
• Explain OOP concepts (Encapsulation, Inheritance, Polymorphism)
• What is method overriding vs overloading?

**Intermediate Level:**
• Explain collections framework (ArrayList vs LinkedList)
• What are generics and their benefits?
• Explain exception handling (try-catch-finally)
• What is multithreading and synchronization?

**Advanced Level:**
• Explain garbage collection in Java
• What are design patterns? (Singleton, Factory)
• Java 8+ features (Lambdas, Streams)
• Explain JVM architecture

Focus on understanding concepts rather than memorizing answers!`;
  }
  
  if (message.includes('javascript')) {
    return `Here are key JavaScript interview questions:

**Basic Level:**
• What are data types in JavaScript?
• Difference between var, let, and const?
• Explain hoisting and closures
• What is event bubbling and capturing?

**Intermediate Level:**
• Explain promises and async/await
• What is the event loop?
• Difference between == and ===?
• Explain prototype and inheritance

**Advanced Level:**
• Explain call, apply, and bind methods
• What are design patterns in JS?
• Explain module systems (ES6 modules)
• Performance optimization techniques

Practice coding these concepts!`;
  }
  
  return `Here are common interview questions:

**Technical Questions:**
• Explain your favorite programming language
• Data structures and algorithms
• System design concepts
• Database design and queries

**Behavioral Questions:**
• Tell me about yourself
• Describe a challenging project
• How do you handle conflicts?
• Where do you see yourself in 5 years?

**Problem Solving:**
• Practice coding problems
• Explain your thought process
• Ask clarifying questions
• Consider edge cases

Focus on clear communication and practical examples!`;
};

module.exports = {
  ChatbotController,
}; 