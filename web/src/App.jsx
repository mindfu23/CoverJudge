import { useState } from 'react';
import BookScanner from './components/BookScanner';
import BookInfo from './components/BookInfo';
import AISummary from './components/AISummary';
import AffiliateLinks from './components/AffiliateLinks';
import LibraryAvailability from './components/LibraryAvailability';
import { searchBooks, getBookByISBN } from './services/books/googleBooks';
import * as openLibrary from './services/books/openLibrary';
import './App.css';

function App() {
  const [bookInfo, setBookInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleBookIdentified = async (identifiedInfo) => {
    setIsLoading(true);
    setError(null);
    setBookInfo(null);

    try {
      let book = null;

      // Try to get book info from ISBN first
      if (identifiedInfo.isbn) {
        try {
          book = await getBookByISBN(identifiedInfo.isbn);
        } catch {
          console.log('Google Books failed, trying Open Library...');
          book = await openLibrary.getBookByISBN(identifiedInfo.isbn);
        }
      }

      // If no ISBN or ISBN lookup failed, try title search
      if (!book && identifiedInfo.title) {
        const searchQuery = identifiedInfo.author 
          ? `${identifiedInfo.title} ${identifiedInfo.author}`
          : identifiedInfo.title;
        
        try {
          book = await searchBooks(searchQuery);
        } catch {
          console.log('Google Books failed, trying Open Library...');
          book = await openLibrary.searchBooks(searchQuery);
        }
      }

      if (book) {
        setBookInfo(book);
      } else {
        setError('Could not find book information. Please try a different search.');
      }
    } catch (err) {
      console.error('Error fetching book information:', err);
      setError(err.message || 'Failed to retrieve book information');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setBookInfo(null);
    setError(null);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>📚 CoverJudge</h1>
        <p className="app-subtitle">
          Scan a cover, get the story, find it at your library
        </p>
      </header>

      <main className="app-main">
        {!bookInfo && !isLoading && (
          <BookScanner onBookIdentified={handleBookIdentified} />
        )}

        {isLoading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Searching for book information...</p>
          </div>
        )}

        {error && (
          <div className="error-container">
            <p className="error-message">⚠️ {error}</p>
            <button onClick={handleReset} className="reset-button">
              Try Again
            </button>
          </div>
        )}

        {bookInfo && (
          <>
            <div className="action-bar">
              <button onClick={handleReset} className="new-search-button">
                🔍 Search Another Book
              </button>
            </div>
            
            <BookInfo bookInfo={bookInfo} />
            <AISummary bookInfo={bookInfo} />
            <LibraryAvailability bookInfo={bookInfo} />
            <AffiliateLinks bookInfo={bookInfo} />
          </>
        )}
      </main>

      <footer className="app-footer">
        <p>
          Built with ❤️ for book lovers | 
          Powered by AI and Open APIs
        </p>
      </footer>
    </div>
  );
}

export default App;
