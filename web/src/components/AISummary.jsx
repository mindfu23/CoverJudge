import { useState } from 'react';
import * as openai from '../services/ai/openai';
import * as gemini from '../services/ai/gemini';
import * as claude from '../services/ai/claude';
import * as perplexity from '../services/ai/perplexity';
import './AISummary.css';

const AI_PROVIDERS = {
  openai: { name: 'OpenAI ChatGPT', service: openai },
  gemini: { name: 'Google Gemini', service: gemini },
  claude: { name: 'Anthropic Claude', service: claude },
  perplexity: { name: 'Perplexity AI', service: perplexity }
};

const AISummary = ({ bookInfo }) => {
  const [selectedProvider, setSelectedProvider] = useState('openai');
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGenerateSummary = async () => {
    setIsLoading(true);
    setError(null);
    setSummary(null);

    try {
      const provider = AI_PROVIDERS[selectedProvider];
      const generatedSummary = await provider.service.generateSummary(bookInfo);
      setSummary(generatedSummary);
    } catch (err) {
      console.error('Error generating summary:', err);
      setError(err.message || 'Failed to generate summary');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="ai-summary">
      <h2>AI-Powered Summary</h2>
      
      <div className="provider-section">
        <label htmlFor="ai-provider">Choose AI Provider:</label>
        <select
          id="ai-provider"
          value={selectedProvider}
          onChange={(e) => setSelectedProvider(e.target.value)}
          disabled={isLoading}
        >
          {Object.entries(AI_PROVIDERS).map(([key, provider]) => (
            <option key={key} value={key}>
              {provider.name}
            </option>
          ))}
        </select>
      </div>

      <button
        className="generate-button"
        onClick={handleGenerateSummary}
        disabled={isLoading}
      >
        {isLoading ? '⏳ Generating Summary...' : '✨ Generate Summary'}
      </button>

      {error && (
        <div className="error-message">
          ⚠️ {error}
        </div>
      )}

      {summary && (
        <div className="summary-content">
          <div className="summary-header">
            <h3>Summary</h3>
            <span className="provider-badge">
              {AI_PROVIDERS[selectedProvider].name}
            </span>
          </div>
          <div className="summary-text">
            {summary.split('\n').map((paragraph, index) => (
              paragraph.trim() && <p key={index}>{paragraph}</p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AISummary;
