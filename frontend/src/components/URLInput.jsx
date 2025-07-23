import React, { useState } from 'react';
import './URLInput.css';

const URLInput = ({ onScan, isLoading }) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }
    
    if (!validateUrl(url)) {
      setError('Please enter a valid URL (include http:// or https://)');
      return;
    }
    
    setError('');
    onScan(url);
  };

  return (
    <div className="url-input-container">
      <h1>Accessibility Analyzer</h1>
      <p className="description">
        Enter a website URL to analyze its accessibility and get detailed recommendations.
      </p>
      
      <form onSubmit={handleSubmit} className="url-form">
        <div className="input-group">
          <input
            type="text"
            value={url}
            name='url'
            id='url'
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter website URL (e.g., https://example.com)"
            className={`url-input ${error ? 'error' : ''}`}
            disabled={isLoading}
          />
          <button 
            type="submit" 
            className="scan-button"
            disabled={isLoading}
          >
            {isLoading ? 'Scanning...' : 'Analyze'}
          </button>
        </div>
        
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default URLInput;