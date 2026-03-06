# Deployment Guide

This guide covers deployment options for CoverJudge.

## Netlify Deployment (Recommended)

### Prerequisites
- GitHub account with the CoverJudge repository
- Netlify account (free tier is sufficient)

### Step-by-Step Deployment

#### 1. Connect Repository to Netlify

1. Log in to [Netlify](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Choose "GitHub" as your Git provider
4. Select the `CoverJudge` repository
5. Configure build settings (or use netlify.toml):
   - **Base directory**: `web`
   - **Build command**: `npm install && npm run build`
   - **Publish directory**: `web/dist`

#### 2. Configure Environment Variables

In the Netlify dashboard:
1. Go to **Site settings** → **Environment variables**
2. Add the following variables (click "Add a variable" for each):

**AI Provider Keys** (add at least one):
```
VITE_OPENAI_API_KEY = your_actual_openai_key
VITE_GEMINI_API_KEY = your_actual_gemini_key
VITE_ANTHROPIC_API_KEY = your_actual_anthropic_key
VITE_PERPLEXITY_API_KEY = your_actual_perplexity_key
```

**Book Information APIs**:
```
VITE_GOOGLE_BOOKS_API_KEY = your_google_books_key (optional)
VITE_GOOGLE_VISION_API_KEY = your_google_vision_key (for OCR)
```

**Affiliate IDs** (optional):
```
VITE_AMAZON_ASSOCIATE_ID = your_amazon_associate_id
VITE_BARNES_NOBLE_AFFILIATE_ID = your_bn_affiliate_id
```

#### 3. Deploy

1. Click "Deploy site"
2. Netlify will automatically build and deploy your site
3. Once deployed, you'll receive a URL like `https://your-site-name.netlify.app`

#### 4. Custom Domain (Optional)

1. Go to **Site settings** → **Domain management**
2. Click "Add custom domain"
3. Follow the instructions to configure your DNS

### Automatic Deployments

Netlify automatically deploys:
- When you push to the main branch
- When pull requests are created (preview deployments)

### Build Status

Check build status:
1. Go to **Deploys** tab in Netlify dashboard
2. View build logs if there are any issues

## Alternative Deployment Options

### Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. From the project root: `vercel`
3. Follow the prompts
4. Set environment variables in Vercel dashboard

### GitHub Pages

Not recommended due to lack of environment variable support for API keys.

### Traditional Hosting

1. Build the project locally:
   ```bash
   cd web
   npm install
   npm run build
   ```

2. Upload the `web/dist` folder to your hosting provider

3. Configure environment variables at build time or use a proxy server

## Environment-Specific Configuration

### Development
- Use `.env` file in the `web` directory
- Never commit `.env` to Git

### Production
- Set environment variables in your hosting platform
- For Netlify: Site Settings → Environment Variables
- For Vercel: Project Settings → Environment Variables

## Troubleshooting

### Build Fails

**Error: "Cannot find module"**
- Solution: Ensure `package.json` includes all dependencies
- Run `npm install` locally to verify

**Error: "Environment variable not set"**
- Solution: Add the variable in Netlify/Vercel dashboard
- Remember the `VITE_` prefix for Vite environment variables

### Site Loads but Features Don't Work

**Book search not working:**
- Verify `VITE_GOOGLE_BOOKS_API_KEY` or fallback to Open Library
- Check browser console for API errors

**AI summaries not working:**
- Ensure at least one AI provider key is set
- Check API key validity and account credits

**OCR not working:**
- Verify `VITE_GOOGLE_VISION_API_KEY` is set correctly
- Enable Google Vision API in Google Cloud Console

**Affiliate links not showing:**
- Add affiliate IDs to environment variables
- Check that affiliate IDs are properly formatted

### Performance Issues

**Slow initial load:**
- Enable CDN in hosting provider
- Consider code splitting (future enhancement)

**API rate limits:**
- Implement caching (future enhancement)
- Use API keys to increase rate limits

## Security Considerations

1. **Never commit API keys** to the repository
2. **Use environment variables** for all sensitive data
3. **Rotate keys regularly** for production
4. **Monitor API usage** to detect unauthorized access
5. **Use HTTPS** for all production deployments

## Monitoring

### Netlify Analytics (Optional)

Enable in Netlify dashboard to track:
- Page views
- Unique visitors
- Top pages

### Error Tracking (Recommended)

Consider integrating:
- Sentry for error tracking
- LogRocket for session replay
- Google Analytics for user behavior

## Continuous Deployment

The repository is configured for CI/CD:
1. Push changes to GitHub
2. Netlify automatically rebuilds
3. Site updates within minutes

### Testing Before Deployment

Always test locally before pushing:
```bash
cd web
npm run build
npm run preview
```

## Rollback

If a deployment has issues:
1. Go to Netlify **Deploys** tab
2. Find the previous working deployment
3. Click "..." → "Publish deploy"

## Support

For deployment issues:
- Check [Netlify documentation](https://docs.netlify.com)
- Review build logs in Netlify dashboard
- Open an issue on GitHub
