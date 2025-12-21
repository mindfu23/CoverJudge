import { useState, useRef } from 'react';
import { extractTextFromImage, processImageFile, parseBookInfo } from '../services/books/ocr';
import './BookScanner.css';

const BookScanner = ({ onBookIdentified }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [inputMethod, setInputMethod] = useState('upload'); // 'upload' or 'url'
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsLoading(true);
    setError(null);

    try {
      // Process the image file
      const base64Image = await processImageFile(file);
      
      // Extract text using OCR
      const extractedText = await extractTextFromImage(base64Image);
      
      if (!extractedText) {
        throw new Error('Could not extract text from image');
      }

      // Parse book information from extracted text
      const bookInfo = parseBookInfo(extractedText);
      
      // Pass the book info to parent component
      onBookIdentified(bookInfo);
    } catch (err) {
      console.error('Error processing image:', err);
      setError(err.message || 'Failed to process image');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUrlSubmit = (e) => {
    e.preventDefault();
    
    if (!urlInput.trim()) {
      setError('Please enter a URL');
      return;
    }

    setError(null);
    
    // Parse URL to extract book information
    const bookInfo = parseUrlForBook(urlInput);
    
    if (bookInfo) {
      onBookIdentified(bookInfo);
    } else {
      setError('Could not extract book information from URL');
    }
  };

  const parseUrlForBook = (url) => {
    try {
      // Amazon URL pattern
      if (url.includes('amazon.com')) {
        const isbnMatch = url.match(/\/dp\/([A-Z0-9]{10})/i) || url.match(/\/gp\/product\/([A-Z0-9]{10})/i);
        if (isbnMatch) {
          return { isbn: isbnMatch[1] };
        }
      }
      
      // Goodreads URL pattern
      if (url.includes('goodreads.com')) {
        const titleMatch = url.match(/\/book\/show\/[^/]+\/([^?]+)/);
        if (titleMatch) {
          const title = titleMatch[1].replace(/_/g, ' ');
          return { title };
        }
      }
      
      // Generic fallback - try to extract any ISBN
      const isbnMatch = url.match(/([0-9]{13}|[0-9]{10})/);
      if (isbnMatch) {
        return { isbn: isbnMatch[1] };
      }
      
      return null;
    } catch (err) {
      console.error('Error parsing URL:', err);
      return null;
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="book-scanner">
      <h2>Find Your Book</h2>
      
      <div className="input-method-selector">
        <button 
          className={inputMethod === 'upload' ? 'active' : ''}
          onClick={() => setInputMethod('upload')}
        >
          📸 Upload Photo
        </button>
        <button 
          className={inputMethod === 'url' ? 'active' : ''}
          onClick={() => setInputMethod('url')}
        >
          🔗 Enter URL
        </button>
      </div>

      {inputMethod === 'upload' ? (
        <div className="upload-section">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
          <button 
            className="upload-button"
            onClick={handleButtonClick}
            disabled={isLoading}
          >
            {isLoading ? '⏳ Processing...' : '📤 Choose Book Cover Image'}
          </button>
          <p className="help-text">
            Take a photo of a book cover or upload an existing image
          </p>
        </div>
      ) : (
        <div className="url-section">
          <form onSubmit={handleUrlSubmit}>
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Paste Amazon or Goodreads URL..."
              className="url-input"
            />
            <button type="submit" className="submit-button">
              🔍 Search
            </button>
          </form>
          <p className="help-text">
            Supports Amazon, Goodreads, and other book URLs
          </p>
        </div>
      )}

      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}
    </div>
  );
};

export default BookScanner;
