import axios from 'axios';

const GOOGLE_BOOKS_API_URL = 'https://www.googleapis.com/books/v1/volumes';

/**
 * Search for books using Google Books API
 * @param {string} query - Search query (title, author, ISBN, etc.)
 * @returns {Promise<Object>} Book information
 */
export const searchBooks = async (query) => {
  try {
    const apiKey = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY;
    const params = {
      q: query,
      maxResults: 5,
    };
    
    if (apiKey) {
      params.key = apiKey;
    }

    const response = await axios.get(GOOGLE_BOOKS_API_URL, { params });

    if (response.data.items && response.data.items.length > 0) {
      const book = response.data.items[0];
      return formatBookData(book);
    }

    return null;
  } catch (error) {
    console.error('Error fetching from Google Books API:', error);
    throw new Error('Failed to fetch book information from Google Books');
  }
};

/**
 * Get book by ISBN
 * @param {string} isbn - ISBN number
 * @returns {Promise<Object>} Book information
 */
export const getBookByISBN = async (isbn) => {
  return searchBooks(`isbn:${isbn}`);
};

/**
 * Format book data from Google Books API response
 * @param {Object} book - Raw book data from API
 * @returns {Object} Formatted book data
 */
const formatBookData = (book) => {
  const volumeInfo = book.volumeInfo || {};
  
  return {
    id: book.id,
    title: volumeInfo.title || 'Unknown Title',
    authors: volumeInfo.authors || ['Unknown Author'],
    description: volumeInfo.description || 'No description available',
    publishedDate: volumeInfo.publishedDate || 'Unknown',
    publisher: volumeInfo.publisher || 'Unknown',
    pageCount: volumeInfo.pageCount || 0,
    categories: volumeInfo.categories || [],
    imageUrl: volumeInfo.imageLinks?.thumbnail || volumeInfo.imageLinks?.smallThumbnail || null,
    language: volumeInfo.language || 'en',
    isbn: volumeInfo.industryIdentifiers?.find(id => id.type === 'ISBN_13')?.identifier ||
          volumeInfo.industryIdentifiers?.find(id => id.type === 'ISBN_10')?.identifier || null,
    previewLink: volumeInfo.previewLink || null,
    source: 'Google Books'
  };
};

export default {
  searchBooks,
  getBookByISBN
};
