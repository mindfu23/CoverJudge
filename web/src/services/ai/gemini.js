import axios from 'axios';

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

/**
 * Generate a book summary using Google Gemini
 * @param {Object} bookInfo - Book information object
 * @returns {Promise<string>} Generated summary
 */
export const generateSummary = async (bookInfo) => {
  try {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error('Google Gemini API key is not configured');
    }

    const prompt = createPrompt(bookInfo);

    const response = await axios.post(
      `${GEMINI_API_URL}?key=${apiKey}`,
      {
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000
        }
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error generating summary with Gemini:', error);
    throw new Error('Failed to generate summary using Google Gemini');
  }
};

/**
 * Create a prompt for the AI based on book information
 * @param {Object} bookInfo - Book information
 * @returns {string} Formatted prompt
 */
const createPrompt = (bookInfo) => {
  return `Please provide a comprehensive summary of the following book:

Title: ${bookInfo.title}
Author(s): ${bookInfo.authors.join(', ')}
Published: ${bookInfo.publishedDate}
${bookInfo.description ? `Description: ${bookInfo.description}` : ''}

Please include:
1. A brief overview of the book
2. Main themes and key points
3. The book's significance or impact (if known)
4. Who would benefit from reading this book

Keep the summary engaging and informative, around 300-400 words.`;
};

export default {
  generateSummary
};
