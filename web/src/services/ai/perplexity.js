import axios from 'axios';

const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';

/**
 * Generate a book summary using Perplexity AI
 * @param {Object} bookInfo - Book information object
 * @returns {Promise<string>} Generated summary
 */
export const generateSummary = async (bookInfo) => {
  try {
    const apiKey = import.meta.env.VITE_PERPLEXITY_API_KEY;
    
    if (!apiKey) {
      throw new Error('Perplexity AI API key is not configured');
    }

    const prompt = createPrompt(bookInfo);

    const response = await axios.post(
      PERPLEXITY_API_URL,
      {
        model: 'sonar',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful assistant that creates comprehensive and engaging book summaries. Provide insightful summaries that capture the essence, key themes, and main points of books.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error generating summary with Perplexity:', error);
    throw new Error('Failed to generate summary using Perplexity AI');
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
