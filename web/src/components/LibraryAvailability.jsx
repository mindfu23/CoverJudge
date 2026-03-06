import { useState, useEffect } from 'react';
import { getLibraryLinks } from '../services/books/libraryAvailability';
import './LibraryAvailability.css';

const LibraryAvailability = ({ bookInfo }) => {
  const [libraryData, setLibraryData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!bookInfo) return;

    const fetchAvailability = async () => {
      setIsLoading(true);
      try {
        const data = await getLibraryLinks(bookInfo);
        setLibraryData(data);
      } catch (err) {
        console.error('Error fetching library availability:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAvailability();
  }, [bookInfo]);

  if (!bookInfo) return null;

  if (isLoading) {
    return (
      <div className="library-availability">
        <h2>Find at Your Library</h2>
        <p className="library-loading">Checking library availability...</p>
      </div>
    );
  }

  if (!libraryData || (!libraryData.worldcat && !libraryData.openLibrary)) {
    return null;
  }

  return (
    <div className="library-availability">
      <h2>Find at Your Library</h2>
      <p className="library-description">
        Check if this book is available at a library near you:
      </p>

      <div className="library-links-container">
        {libraryData.worldcat && (
          <a
            href={libraryData.worldcat.url}
            target="_blank"
            rel="noopener noreferrer"
            className="library-link-button worldcat"
          >
            <span className="library-icon">🏛️</span>
            <div className="library-link-text">
              <span className="library-name">{libraryData.worldcat.label}</span>
              <span className="library-detail">{libraryData.worldcat.description}</span>
            </div>
            <span className="external-icon">↗</span>
          </a>
        )}

        {libraryData.openLibrary && (
          <a
            href={libraryData.openLibrary.borrowUrl || libraryData.openLibrary.url}
            target="_blank"
            rel="noopener noreferrer"
            className="library-link-button openlibrary"
          >
            <span className="library-icon">📖</span>
            <div className="library-link-text">
              <span className="library-name">{libraryData.openLibrary.label}</span>
              <span className="library-detail">{libraryData.openLibrary.description}</span>
            </div>
            <span className="external-icon">↗</span>
          </a>
        )}
      </div>

      <p className="library-note">
        <small>
          WorldCat uses your location to find nearby libraries. Open Library offers free digital lending.
        </small>
      </p>
    </div>
  );
};

export default LibraryAvailability;
