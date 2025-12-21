# Adding a New Retailer

This guide explains how to add a new book retailer with affiliate links to BookLearner.

## Overview

BookLearner uses a template-based affiliate link system that makes it easy to add new retailers. All retailer configurations are centralized in `web/src/services/affiliates/affiliateService.js`.

## Steps to Add a New Retailer

### 1. Get Your Affiliate ID

First, sign up for the retailer's affiliate program and obtain your affiliate ID or tracking code. Common programs include:
- Amazon Associates
- Barnes & Noble Affiliate Program
- Book Depository Affiliate Programme
- Bookshop.org Affiliate Program
- IndieBound

### 2. Add Retailer Configuration

Open `web/src/services/affiliates/affiliateService.js` and add your retailer to the `RETAILERS` object:

```javascript
const RETAILERS = {
  // ... existing retailers ...
  
  bookshop: {
    name: 'Bookshop.org',
    enabled: true,
    generateLink: (bookInfo) => {
      const affiliateId = import.meta.env.VITE_BOOKSHOP_AFFILIATE_ID;
      if (!affiliateId) return null;
      
      const isbn = bookInfo.isbn;
      const searchQuery = `${bookInfo.title} ${bookInfo.authors[0]}`.replace(/\s+/g, '+');
      
      if (isbn) {
        return `https://bookshop.org/books/${isbn}?affiliate=${affiliateId}`;
      }
      
      return `https://bookshop.org/search?keywords=${searchQuery}&affiliate=${affiliateId}`;
    }
  }
};
```

### 3. Add Environment Variable

Add the affiliate ID configuration to `.env.example`:

```bash
# Add to .env.example
VITE_BOOKSHOP_AFFILIATE_ID=
```

Don't forget to:
1. Add your actual affiliate ID to your local `.env` file
2. Configure it in your Netlify environment variables

### 4. Test Your Integration

1. Add your affiliate ID to the `.env` file
2. Run the development server: `npm run dev`
3. Search for a book
4. Verify that your retailer appears in the "Purchase This Book" section
5. Click the link to ensure it's properly formatted

## Configuration Options

### Retailer Object Structure

```javascript
{
  name: 'Display Name',        // Name shown to users
  enabled: true,                // Enable/disable the retailer
  generateLink: (bookInfo) => { // Function to generate affiliate link
    // Return the affiliate link or null if not configured
  }
}
```

### Available Book Information

The `bookInfo` object passed to `generateLink` contains:

```javascript
{
  id: string,              // Unique book ID
  title: string,           // Book title
  authors: string[],       // Array of author names
  description: string,     // Book description
  publishedDate: string,   // Publication date
  publisher: string,       // Publisher name
  pageCount: number,       // Number of pages
  categories: string[],    // Book categories/genres
  imageUrl: string,        // Cover image URL
  language: string,        // Language code (e.g., 'en')
  isbn: string,            // ISBN-13 or ISBN-10
  previewLink: string,     // Preview link
  source: string           // Data source (e.g., 'Google Books')
}
```

## Link Generation Strategies

### Strategy 1: Direct ISBN Link

If the retailer supports direct ISBN lookups:

```javascript
generateLink: (bookInfo) => {
  const affiliateId = import.meta.env.VITE_RETAILER_AFFILIATE_ID;
  if (!affiliateId) return null;
  
  const isbn = bookInfo.isbn;
  if (!isbn) return null;
  
  return `https://retailer.com/book/${isbn}?aff=${affiliateId}`;
}
```

### Strategy 2: Search Query

If the retailer requires a search query:

```javascript
generateLink: (bookInfo) => {
  const affiliateId = import.meta.env.VITE_RETAILER_AFFILIATE_ID;
  if (!affiliateId) return null;
  
  const query = `${bookInfo.title} ${bookInfo.authors[0]}`.replace(/\s+/g, '+');
  return `https://retailer.com/search?q=${query}&affiliate=${affiliateId}`;
}
```

### Strategy 3: ISBN with Fallback

Prefer ISBN but fall back to search if not available:

```javascript
generateLink: (bookInfo) => {
  const affiliateId = import.meta.env.VITE_RETAILER_AFFILIATE_ID;
  if (!affiliateId) return null;
  
  const isbn = bookInfo.isbn;
  
  if (isbn) {
    return `https://retailer.com/book/${isbn}?aff=${affiliateId}`;
  }
  
  // Fallback to search
  const query = `${bookInfo.title} ${bookInfo.authors[0]}`.replace(/\s+/g, '+');
  return `https://retailer.com/search?q=${query}&affiliate=${affiliateId}`;
}
```

## Examples of Existing Retailers

### Amazon Associates

```javascript
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
}
```

### Barnes & Noble

```javascript
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
}
```

## Temporarily Disabling a Retailer

To temporarily disable a retailer without removing the code:

```javascript
retailerName: {
  name: 'Retailer Name',
  enabled: false,  // Set to false to disable
  generateLink: (bookInfo) => {
    // ... link generation code ...
  }
}
```

## Best Practices

1. **Check for affiliate ID**: Always return `null` if the affiliate ID is not configured
2. **Handle missing ISBN**: Not all books have ISBNs; provide a fallback
3. **URL encoding**: Use proper URL encoding for search queries
4. **Test links**: Always test the generated links to ensure they work
5. **Follow retailer guidelines**: Comply with each retailer's affiliate program terms
6. **Error handling**: Wrap link generation in try-catch if needed
7. **Documentation**: Document any special requirements or parameters

## Regional Variations

For retailers with regional variations (e.g., Amazon.com, Amazon.co.uk):

```javascript
amazonUK: {
  name: 'Amazon UK',
  enabled: true,
  generateLink: (bookInfo) => {
    const associateId = import.meta.env.VITE_AMAZON_UK_ASSOCIATE_ID;
    if (!associateId) return null;
    
    const isbn = bookInfo.isbn;
    if (isbn) {
      return `https://www.amazon.co.uk/dp/${isbn}?tag=${associateId}`;
    }
    return null;
  }
}
```

## Troubleshooting

**Links not appearing?**
- Verify the affiliate ID is set in your `.env` file
- Check that `enabled` is set to `true`
- Ensure the `generateLink` function returns a valid URL string

**Links not working correctly?**
- Test the URL format with a known book
- Check the retailer's documentation for the correct URL structure
- Verify the affiliate parameter name and format

**Book not found on retailer site?**
- Consider using ISBN-based links when available
- Improve search query formatting
- Some books may not be available at all retailers
