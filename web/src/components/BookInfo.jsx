import './BookInfo.css';

const BookInfo = ({ bookInfo }) => {
  if (!bookInfo) return null;

  return (
    <div className="book-info">
      <h2>Book Information</h2>
      
      <div className="book-content">
        {bookInfo.imageUrl && (
          <div className="book-image">
            <img src={bookInfo.imageUrl} alt={bookInfo.title} />
          </div>
        )}
        
        <div className="book-details">
          <h3 className="book-title">{bookInfo.title}</h3>
          
          <div className="book-meta">
            <p>
              <strong>Author(s):</strong> {bookInfo.authors.join(', ')}
            </p>
            
            {bookInfo.publishedDate && (
              <p>
                <strong>Published:</strong> {bookInfo.publishedDate}
              </p>
            )}
            
            {bookInfo.publisher && bookInfo.publisher !== 'Unknown' && (
              <p>
                <strong>Publisher:</strong> {bookInfo.publisher}
              </p>
            )}
            
            {bookInfo.pageCount > 0 && (
              <p>
                <strong>Pages:</strong> {bookInfo.pageCount}
              </p>
            )}
            
            {bookInfo.isbn && (
              <p>
                <strong>ISBN:</strong> {bookInfo.isbn}
              </p>
            )}
            
            {bookInfo.categories && bookInfo.categories.length > 0 && (
              <p>
                <strong>Categories:</strong> {bookInfo.categories.slice(0, 3).join(', ')}
              </p>
            )}
            
            {bookInfo.language && (
              <p>
                <strong>Language:</strong> {bookInfo.language.toUpperCase()}
              </p>
            )}
          </div>
          
          {bookInfo.description && bookInfo.description !== 'No description available' && (
            <div className="book-description">
              <h4>Description</h4>
              <p>{bookInfo.description}</p>
            </div>
          )}
          
          <div className="book-source">
            <small>Source: {bookInfo.source}</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookInfo;
