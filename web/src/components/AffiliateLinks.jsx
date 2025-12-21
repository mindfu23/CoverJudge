import { getAffiliateLinks } from '../services/affiliates/affiliateService';
import './AffiliateLinks.css';

const AffiliateLinks = ({ bookInfo }) => {
  if (!bookInfo) return null;

  const affiliateLinks = getAffiliateLinks(bookInfo);

  if (affiliateLinks.length === 0) {
    return (
      <div className="affiliate-links">
        <h2>Purchase Options</h2>
        <p className="no-links-message">
          No affiliate links configured. Please set up your affiliate IDs in the environment variables.
        </p>
      </div>
    );
  }

  return (
    <div className="affiliate-links">
      <h2>Purchase This Book</h2>
      <p className="affiliate-description">
        Support us by purchasing through these links:
      </p>
      
      <div className="links-container">
        {affiliateLinks.map((link) => (
          <a
            key={link.key}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="affiliate-link-button"
          >
            <span className="retailer-icon">🛒</span>
            <span className="retailer-name">{link.retailer}</span>
            <span className="external-icon">↗</span>
          </a>
        ))}
      </div>
      
      <p className="affiliate-disclaimer">
        <small>
          We earn a small commission from purchases made through these links at no additional cost to you.
        </small>
      </p>
    </div>
  );
};

export default AffiliateLinks;
