/**
 * Affiliate Service
 * Generates affiliate links for book retailers
 * Easily extensible template system for adding new retailers
 */

/**
 * Retailer configuration template
 * Add new retailers by adding entries to this object
 */
const RETAILERS = {
  amazon: {
    name: 'Amazon',
    enabled: true,
    generateLink: (bookInfo) => {
      const associateId = import.meta.env.VITE_AMAZON_ASSOCIATE_ID;
      if (!associateId) return null;
      
      const isbn = bookInfo.isbn;
      const searchQuery = `${bookInfo.title} ${bookInfo.authors[0]}`.replace(/\s+/g, '+');
      
      if (isbn) {
        return `https://www.amazon.com/dp/${isbn}?tag=${associateId}`;
      }
      
      return `https://www.amazon.com/s?k=${searchQuery}&tag=${associateId}`;
    }
  },
  
  barnesNoble: {
    name: 'Barnes & Noble',
    enabled: true,
    generateLink: (bookInfo) => {
      const affiliateId = import.meta.env.VITE_BARNES_NOBLE_AFFILIATE_ID;
      if (!affiliateId) return null;
      
      const isbn = bookInfo.isbn;
      const searchQuery = `${bookInfo.title} ${bookInfo.authors[0]}`.replace(/\s+/g, '+');
      
      if (isbn) {
        return `https://www.barnesandnoble.com/w/?ean=${isbn}&aff_id=${affiliateId}`;
      }
      
      return `https://www.barnesandnoble.com/s/${searchQuery}?aff_id=${affiliateId}`;
    }
  },
  
  // Template for adding new retailers
  // newRetailer: {
  //   name: 'Retailer Display Name',
  //   enabled: true,
  //   generateLink: (bookInfo) => {
  //     const affiliateId = import.meta.env.VITE_NEW_RETAILER_AFFILIATE_ID;
  //     if (!affiliateId) return null;
  //     
  //     // Generate the affiliate link using bookInfo
  //     // Available fields: title, authors, isbn, etc.
  //     return 'https://retailer.com/book?id=xxx&affiliate=yyy';
  //   }
  // }
};

/**
 * Get all available affiliate links for a book
 * @param {Object} bookInfo - Book information object
 * @returns {Array} Array of affiliate link objects
 */
export const getAffiliateLinks = (bookInfo) => {
  const links = [];
  
  for (const [key, retailer] of Object.entries(RETAILERS)) {
    if (retailer.enabled) {
      try {
        const link = retailer.generateLink(bookInfo);
        if (link) {
          links.push({
            retailer: retailer.name,
            url: link,
            key: key
          });
        }
      } catch (error) {
        console.error(`Error generating ${retailer.name} link:`, error);
      }
    }
  }
  
  return links;
};

/**
 * Get affiliate link for a specific retailer
 * @param {string} retailerKey - Key of the retailer
 * @param {Object} bookInfo - Book information object
 * @returns {string|null} Affiliate link or null
 */
export const getRetailerLink = (retailerKey, bookInfo) => {
  const retailer = RETAILERS[retailerKey];
  if (!retailer || !retailer.enabled) {
    return null;
  }
  
  try {
    return retailer.generateLink(bookInfo);
  } catch (error) {
    console.error(`Error generating ${retailer.name} link:`, error);
    return null;
  }
};

/**
 * Get list of enabled retailers
 * @returns {Array} Array of retailer names
 */
export const getEnabledRetailers = () => {
  return Object.entries(RETAILERS)
    .filter(([, retailer]) => retailer.enabled)
    .map(([key, retailer]) => ({
      key,
      name: retailer.name
    }));
};

export default {
  getAffiliateLinks,
  getRetailerLink,
  getEnabledRetailers
};
