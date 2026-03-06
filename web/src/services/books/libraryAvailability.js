import axios from 'axios';

const WORLDCAT_ISBN_URL = 'https://www.worldcat.org/isbn';
const WORLDCAT_SEARCH_URL = 'https://www.worldcat.org/search';
const OPEN_LIBRARY_BOOKS_URL = 'https://openlibrary.org/api/books';

/**
 * Get library availability links for a book
 * @param {Object} bookInfo - Book information object with isbn, title, authors
 * @returns {Promise<Object>} Library availability data with worldcat and openLibrary links
 */
export const getLibraryLinks = async (bookInfo) => {
  const result = {
    worldcat: null,
    openLibrary: null,
  };

  // WorldCat link (always works if we have ISBN or title)
  if (bookInfo.isbn) {
    result.worldcat = {
      url: `${WORLDCAT_ISBN_URL}/${bookInfo.isbn}`,
      label: 'Find in a Library (WorldCat)',
      description: 'Search nearby libraries for print copies',
    };
  } else if (bookInfo.title) {
    const query = encodeURIComponent(bookInfo.title);
    result.worldcat = {
      url: `${WORLDCAT_SEARCH_URL}?q=${query}`,
      label: 'Find in a Library (WorldCat)',
      description: 'Search nearby libraries for print copies',
    };
  }

  // Open Library lending status (only if we have ISBN)
  if (bookInfo.isbn) {
    try {
      const response = await axios.get(OPEN_LIBRARY_BOOKS_URL, {
        params: {
          bibkeys: `ISBN:${bookInfo.isbn}`,
          format: 'json',
          jscmd: 'data',
        },
      });

      const key = `ISBN:${bookInfo.isbn}`;
      const bookData = response.data[key];

      if (bookData) {
        const hasEbook = bookData.ebooks && bookData.ebooks.length > 0;
        const ebookInfo = hasEbook ? bookData.ebooks[0] : null;

        result.openLibrary = {
          url: bookData.url || `https://openlibrary.org/isbn/${bookInfo.isbn}`,
          hasEbook,
          borrowUrl: ebookInfo?.borrow_url || null,
          readUrl: ebookInfo?.read_url || null,
          availability: ebookInfo?.availability || 'unknown',
          label: hasEbook ? 'Borrow eBook (Open Library)' : 'View on Open Library',
          description: hasEbook
            ? `eBook available — ${ebookInfo.availability}`
            : 'Check Open Library for digital availability',
        };
      }
    } catch (error) {
      console.error('Error checking Open Library availability:', error);
      // Non-fatal — we still have WorldCat
    }
  }

  return result;
};

export default { getLibraryLinks };
