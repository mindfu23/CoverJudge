# Adding a New AI Provider

This guide explains how to add a new AI provider to CoverJudge.

## Overview

CoverJudge uses a modular approach for AI providers. Each provider is implemented as a separate service module that exports a `generateSummary` function.

## Steps to Add a New AI Provider

### 1. Create a New Service File

Create a new file in `web/src/services/ai/` for your provider. For example, to add "NewAI":

```javascript
// web/src/services/ai/newai.js
import axios from 'axios';

const NEW_AI_API_URL = 'https://api.newai.com/v1/completions';

/**
 * Generate a book summary using NewAI
 * @param {Object} bookInfo - Book information object
 * @returns {Promise<string>} Generated summary
 */
export const generateSummary = async (bookInfo) => {
  try {
    const apiKey = import.meta.env.VITE_NEW_AI_API_KEY;
    
    if (!apiKey) {
      throw new Error('NewAI API key is not configured');
    }

    const prompt = createPrompt(bookInfo);

    const response = await axios.post(
      NEW_AI_API_URL,
      {
        // Add the specific parameters for your AI provider
        prompt: prompt,
        max_tokens: 1000,
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Extract the summary from the response
    // This will vary based on the API structure
    return response.data.completion;
  } catch (error) {
    console.error('Error generating summary with NewAI:', error);
    throw new Error('Failed to generate summary using NewAI');
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
```

### 2. Add Environment Variable

Add the API key configuration to `.env.example`:

```bash
# Add to .env.example
VITE_NEW_AI_API_KEY=
```

Don't forget to add your actual key to your local `.env` file and configure it in Netlify.

### 3. Update the AISummary Component

Import and register your new provider in `web/src/components/AISummary.jsx`:

```javascript
// Add import at the top
import * as newai from '../services/ai/newai';

// Add to AI_PROVIDERS object
const AI_PROVIDERS = {
  openai: { name: 'OpenAI ChatGPT', service: openai },
  gemini: { name: 'Google Gemini', service: gemini },
  claude: { name: 'Anthropic Claude', service: claude },
  perplexity: { name: 'Perplexity AI', service: perplexity },
  newai: { name: 'NewAI', service: newai } // Add your provider here
};
```

### 4. Test Your Integration

1. Add your API key to the `.env` file
2. Run the development server: `npm run dev`
3. Select your new AI provider from the dropdown
4. Test generating a summary

## API-Specific Considerations

### Authentication

Different APIs use different authentication methods:
- **Bearer Token**: `Authorization: Bearer ${apiKey}` (OpenAI, Perplexity)
- **API Key Header**: `x-api-key: ${apiKey}` (Anthropic)
- **Query Parameter**: `?key=${apiKey}` (Google Gemini)

### Response Format

Different APIs return responses in different formats. Make sure to extract the text correctly:
- **OpenAI**: `response.data.choices[0].message.content`
- **Gemini**: `response.data.candidates[0].content.parts[0].text`
- **Claude**: `response.data.content[0].text`
- **Perplexity**: `response.data.choices[0].message.content`

### Rate Limits and Error Handling

Consider implementing:
- Rate limit handling
- Retry logic
- Timeout configuration
- Specific error messages

## Best Practices

1. **Keep the interface consistent**: All providers should export a `generateSummary(bookInfo)` function
2. **Use environment variables**: Never hardcode API keys
3. **Add proper error handling**: Provide meaningful error messages
4. **Document API requirements**: Note any specific requirements (model names, parameters, etc.)
5. **Test thoroughly**: Test with various books and edge cases

## Example Providers

See the existing implementations for reference:
- `web/src/services/ai/openai.js` - OpenAI ChatGPT
- `web/src/services/ai/gemini.js` - Google Gemini
- `web/src/services/ai/claude.js` - Anthropic Claude
- `web/src/services/ai/perplexity.js` - Perplexity AI
