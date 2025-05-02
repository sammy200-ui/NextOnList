const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export const getChatbotResponse = async (prompt) => {
  try {
    console.log(" Sending request with prompt:", prompt);
    console.log(" Using API key:", import.meta.env.VITE_GEMINI_API_KEY);

    const response = await fetch(`${GEMINI_API_URL}?key=${import.meta.env.VITE_GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.8,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 500,
          stopSequences: []
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      }),
    });

    console.log("📬 Response Status:", response.status);

    if (!response.ok) {
      const errorText = await response.text(); // get raw error
      console.error(" API error response:", errorText);
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    console.log(" API response data:", data);

    const suggestion = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!suggestion) {
      throw new Error('Empty or invalid response received from API');
    }

    return suggestion;
  } catch (error) {
    console.error(' Chatbot error:', error);
    throw new Error('Sorry, I am unable to process your request at the moment. Please try again later.');
  }
};