# CoverJudge

A cross-platform application (website, iOS, and Android) that allows users to scan book covers or provide URLs to get book information and AI-generated summaries, with affiliate links for purchasing.

## 🚀 Features

- **📸 Multiple Input Methods**: Upload book cover photos or paste book URLs (Amazon, Goodreads, etc.)
- **📚 Book Information**: Automatic book identification using OCR and URL parsing, with data from Google Books API and Open Library
- **🤖 AI-Powered Summaries**: Generate comprehensive book summaries using your choice of AI provider:
  - OpenAI ChatGPT
  - Google Gemini
  - Anthropic Claude
  - Perplexity AI
- **🛒 Affiliate Links**: Direct purchase links with affiliate tracking for:
  - Amazon Associates
  - Barnes & Noble
  - Easily extensible to add more retailers
- **🎨 Modern UI**: Responsive design that works across all devices
- **🔒 Secure**: All API keys stored as environment variables

## 📋 Prerequisites

- Node.js 16+ and npm
- API keys for the services you want to use (see Environment Variables section)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mindfu23/CoverJudge.git
   cd CoverJudge
   ```

2. **Install dependencies**
   ```bash
   cd web
   npm install
   ```

3. **Set up environment variables**
   
   Copy the example environment file:
   ```bash
   cp ../.env.example .env
   ```
   
   Edit `.env` and add your API keys (see Environment Variables section below)

4. **Run the development server**
   ```bash
   npm run dev
   ```
   
   The application will be available at `http://localhost:5173`

## 🔑 Environment Variables

Create a `.env` file in the `web/` directory with the following variables:

### AI Provider API Keys (at least one required)
```bash
VITE_OPENAI_API_KEY=your_openai_api_key
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_ANTHROPIC_API_KEY=your_anthropic_api_key
VITE_PERPLEXITY_API_KEY=your_perplexity_api_key
```

### Book Information APIs
```bash
VITE_GOOGLE_BOOKS_API_KEY=your_google_books_api_key  # Optional, improves rate limits
VITE_GOOGLE_VISION_API_KEY=your_google_vision_api_key  # Required for OCR functionality
```

### Affiliate Program IDs (optional)
```bash
VITE_AMAZON_ASSOCIATE_ID=your_amazon_associate_id
VITE_BARNES_NOBLE_AFFILIATE_ID=your_barnes_noble_affiliate_id
```

### Where to Get API Keys

- **OpenAI**: [platform.openai.com](https://platform.openai.com)
- **Google Gemini**: [ai.google.dev](https://ai.google.dev)
- **Anthropic Claude**: [console.anthropic.com](https://console.anthropic.com)
- **Perplexity AI**: [docs.perplexity.ai](https://docs.perplexity.ai)
- **Google Books**: [console.cloud.google.com](https://console.cloud.google.com) (Enable Books API)
- **Google Vision**: [console.cloud.google.com](https://console.cloud.google.com) (Enable Vision API)
- **Amazon Associates**: [affiliate-program.amazon.com](https://affiliate-program.amazon.com)
- **Barnes & Noble**: [Barnes & Noble Affiliate Program](https://www.barnesandnoble.com/h/affiliate-program)

## 📦 Building for Production

```bash
cd web
npm run build
```

The built files will be in the `web/dist` directory.

## 🚀 Deployment

### Netlify

1. **Connect your repository** to Netlify

2. **Configure build settings**:
   - Build command: `cd web && npm install && npm run build`
   - Publish directory: `web/dist`

3. **Set environment variables** in Netlify dashboard:
   - Go to Site Settings > Environment Variables
   - Add all the environment variables from your `.env` file

4. **Deploy**: Netlify will automatically deploy when you push to your repository

## 📱 Mobile Apps (Coming Soon)

React Native mobile applications for iOS and Android are planned for future releases.

## 🏗️ Project Structure

```
CoverJudge/
├── web/                          # Web application
│   ├── src/
│   │   ├── components/           # React components
│   │   │   ├── BookScanner.jsx   # Photo upload and URL input
│   │   │   ├── BookInfo.jsx      # Display book information
│   │   │   ├── AISummary.jsx     # AI summary generation
│   │   │   └── AffiliateLinks.jsx # Purchase links
│   │   ├── services/             # API services
│   │   │   ├── ai/               # AI provider integrations
│   │   │   │   ├── gemini.js
│   │   │   │   ├── openai.js
│   │   │   │   ├── claude.js
│   │   │   │   └── perplexity.js
│   │   │   ├── books/            # Book information services
│   │   │   │   ├── googleBooks.js
│   │   │   │   ├── openLibrary.js
│   │   │   │   └── ocr.js
│   │   │   └── affiliates/       # Affiliate link generators
│   │   │       └── affiliateService.js
│   │   ├── App.jsx               # Main app component
│   │   └── main.jsx              # Entry point
│   └── package.json
├── mobile/                       # React Native (future)
├── docs/                         # Documentation
│   ├── adding-ai-provider.md     # Guide to add new AI providers
│   └── adding-retailer.md        # Guide to add new retailers
├── .env.example                  # Environment variables template
└── README.md
```

## 🔧 Extending CoverJudge

### Adding a New AI Provider

See [docs/adding-ai-provider.md](docs/adding-ai-provider.md) for a detailed guide.

**Quick steps:**
1. Create a new service file in `web/src/services/ai/`
2. Implement the `generateSummary(bookInfo)` function
3. Add the API key to `.env.example` and `.env`
4. Register the provider in `web/src/components/AISummary.jsx`

### Adding a New Retailer

See [docs/adding-retailer.md](docs/adding-retailer.md) for a detailed guide.

**Quick steps:**
1. Get your affiliate ID from the retailer's affiliate program
2. Add retailer configuration to `web/src/services/affiliates/affiliateService.js`
3. Add the affiliate ID to `.env.example` and `.env`
4. Test the generated links

## 🧪 Testing

The application should be tested with:
- Various book covers (different conditions, lighting)
- URLs from different sources (Amazon, Goodreads, etc.)
- All configured AI providers
- Different screen sizes and devices

## 🐛 Troubleshooting

**OCR not working?**
- Ensure `VITE_GOOGLE_VISION_API_KEY` is set correctly
- Check that the Google Vision API is enabled in your Google Cloud project
- Try using a clearer image of the book cover

**AI summaries failing?**
- Verify your AI provider API key is correct
- Check that you have sufficient API credits
- Try a different AI provider

**Affiliate links not appearing?**
- Ensure affiliate IDs are set in your `.env` file
- Check that the retailer configuration is enabled in `affiliateService.js`

**Book not found?**
- Try using the ISBN directly if available
- The book may not be in Google Books or Open Library databases
- Try a different search query

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

If you have questions or need help, please open an issue on GitHub.

---

Built with ❤️ for book lovers | Powered by AI and Open APIs
