import axios from 'axios';

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';

/**
 * Generate a book summary using Anthropic Claude
 * @param {Object} bookInfo - Book information object
 * @returns {Promise<string>} Generated summary
 */
export const generateSummary = async (bookInfo) => {
  try {
    const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY;
    
    if (!apiKey) {
      throw new Error('Anthropic Claude API key is not configured');
    }

    const prompt = createPrompt(bookInfo);

    const response = await axios.post(
      CLAUDE_API_URL,
      {
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 1000,
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7
      },
      {
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.content[0].text;
  } catch (error) {
    console.error('Error generating summary with Claude:', error);
    throw new Error('Failed to generate summary using Anthropic Claude');
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
