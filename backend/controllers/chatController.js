const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

// Initialize the Gemini API with API version
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY, {
  apiVersion: 'v1'
});

const chat = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Log API key status (without exposing the actual key)
    console.log('GEMINI_API_KEY status:', process.env.GEMINI_API_KEY ? 'Present' : 'Missing');

    // Get the generative model - using the latest model name
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-preview-04-17" });

    console.log('Sending message to Gemini:', message);
    
    // Generate content
    const result = await model.generateContent(message);
    const response = await result.response;
    const text = response.text();

    console.log('Received response from Gemini:', text);

    res.json({ response: text });
  } catch (error) {
    console.error('Detailed error in chat controller:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    res.status(500).json({ error: 'An error occurred while processing your request' });
  }
};

module.exports = {
  chat
}; 