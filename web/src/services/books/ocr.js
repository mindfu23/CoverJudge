import axios from 'axios';

const GOOGLE_VISION_API_URL = 'https://vision.googleapis.com/v1/images:annotate';

/**
 * Extract text from an image using Google Vision API OCR
 * @param {string} imageBase64 - Base64 encoded image
 * @returns {Promise<string>} Extracted text
 */
export const extractTextFromImage = async (imageBase64) => {
  try {
    const apiKey = import.meta.env.VITE_GOOGLE_VISION_API_KEY;
    
    if (!apiKey) {
      throw new Error('Google Vision API key is not configured');
    }

    const response = await axios.post(
      `${GOOGLE_VISION_API_URL}?key=${apiKey}`,
      {
        requests: [
          {
            image: {
              content: imageBase64
            },
            features: [
              {
                type: 'TEXT_DETECTION',
                maxResults: 1
              }
            ]
          }
        ]
      }
    );

    if (response.data.responses && response.data.responses[0].textAnnotations) {
      return response.data.responses[0].textAnnotations[0].description;
    }

    return '';
  } catch (error) {
    console.error('Error performing OCR:', error);
    throw new Error('Failed to extract text from image');
  }
};

/**
 * Process image file and convert to base64
 * @param {File} file - Image file
 * @returns {Promise<string>} Base64 encoded image (without data URL prefix)
 */
export const processImageFile = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64 = e.target.result.split(',')[1];
      resolve(base64);
    };
    
    reader.onerror = (error) => {
      reject(error);
    };
    
    reader.readAsDataURL(file);
  });
};

/**
 * Extract book title and author from OCR text
 * This is a simple heuristic-based approach
 * @param {string} text - OCR extracted text
 * @returns {Object} Extracted title and author
 */
export const parseBookInfo = (text) => {
  const lines = text.split('\n').filter(line => line.trim().length > 0);
  
  // Simple heuristic: first few lines are usually title, then author
  const title = lines[0] || '';
  const author = lines.find(line => 
    line.toLowerCase().includes('by ') || 
    line.match(/^[A-Z][a-z]+ [A-Z][a-z]+/)
  ) || lines[1] || '';

  return {
    title: title.replace(/^by\s+/i, '').trim(),
    author: author.replace(/^by\s+/i, '').trim()
  };
};

export default {
  extractTextFromImage,
  processImageFile,
  parseBookInfo
};
