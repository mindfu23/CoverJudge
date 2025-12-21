import axios from 'axios';

const OPEN_LIBRARY_SEARCH_URL = 'https://openlibrary.org/search.json';
const OPEN_LIBRARY_ISBN_URL = 'https://openlibrary.org/isbn';

/**
 * Search for books using Open Library API
 * @param {string} query - Search query
 * @returns {Promise<Object>} Book information
 */
export const searchBooks = async (query) => {
  try {
    const response = await axios.get(OPEN_LIBRARY_SEARCH_URL, {
      params: {
        q: query,
        limit: 5
      }
    });

    if (response.data.docs && response.data.docs.length > 0) {
      const book = response.data.docs[0];
      return formatBookData(book);
    }

    return null;
  } catch (error) {
    console.error('Error fetching from Open Library API:', error);
    throw new Error('Failed to fetch book information from Open Library');
  }
};

/**
 * Get book by ISBN from Open Library
 * @param {string} isbn - ISBN number
 * @returns {Promise<Object>} Book information
 */
export const getBookByISBN = async (isbn) => {
  try {
    const response = await axios.get(`${OPEN_LIBRARY_ISBN_URL}/${isbn}.json`);
    return formatISBNBookData(response.data, isbn);
  } catch (error) {
    console.error('Error fetching book by ISBN from Open Library:', error);
    // Fallback to search
    return searchBooks(isbn);
  }
};

/**
 * Format book data from Open Library search response
 * @param {Object} book - Raw book data from API
 * @returns {Object} Formatted book data
 */
const formatBookData = (book) => {
  return {
    id: book.key,
    title: book.title || 'Unknown Title',
    authors: book.author_name || ['Unknown Author'],
    description: book.first_sentence?.[0] || 'No description available',
    publishedDate: book.first_publish_year?.toString() || 'Unknown',
    publisher: book.publisher?.[0] || 'Unknown',
    pageCount: book.number_of_pages_median || 0,
    categories: book.subject?.slice(0, 5) || [],
    imageUrl: book.cover_i ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg` : null,
    language: book.language?.[0] || 'en',
    isbn: book.isbn?.[0] || null,
    previewLink: `https://openlibrary.org${book.key}`,
    source: 'Open Library'
  };
};

/**
 * Format book data from Open Library ISBN response
 * @param {Object} book - Raw book data from API
 * @param {string} isbn - ISBN used for lookup
 * @returns {Object} Formatted book data
 */
const formatISBNBookData = (book, isbn) => {
  return {
    id: book.key,
    title: book.title || 'Unknown Title',
    authors: book.authors?.map(a => a.name || 'Unknown Author') || ['Unknown Author'],
    description: book.description?.value || book.description || 'No description available',
    publishedDate: book.publish_date || 'Unknown',
    publisher: book.publishers?.[0] || 'Unknown',
    pageCount: book.number_of_pages || 0,
    categories: book.subjects || [],
    imageUrl: book.covers?.[0] ? `https://covers.openlibrary.org/b/id/${book.covers[0]}-M.jpg` : null,
    language: book.languages?.[0]?.key?.split('/').pop() || 'en',
    isbn: isbn,
    previewLink: `https://openlibrary.org${book.key}`,
    source: 'Open Library'
  };
};

export default {
  searchBooks,
  getBookByISBN
};
