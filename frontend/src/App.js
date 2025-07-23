import React, { useState } from 'react';
import URLInput from './components/URLInput';
import ScanResults from './components/ScanResults';
import LoadingSpinner from './components/LoadingSpinner';
import { scanAPI } from './services/api';
import './App.css';

function App() {
  const [currentScan, setCurrentScan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleScan = async (url) => {
    setIsLoading(true);
    setError('');
    setCurrentScan(null);

    try {
      // Start scan
      const response = await scanAPI.createScan(url);
      const scanId = response.scanId;
      
      // Poll for results
      const pollInterval = setInterval(async () => {
        try {
          const scanResponse = await scanAPI.getScan(scanId);
          const scan = scanResponse.scan;
          
          if (scan.status === 'completed') {
            setCurrentScan(scan);
            setIsLoading(false);
            clearInterval(pollInterval);
          } else if (scan.status === 'failed') {
            setError('Scan failed. Please try again with a different URL.');
            setIsLoading(false);
            clearInterval(pollInterval);
          }
        } catch (err) {
          setError('Error fetching scan results: ' + err.message);
          setIsLoading(false);
          clearInterval(pollInterval);
        }
      }, 2000); // Check every 2 seconds

      // Clean up interval after 5 minutes
      setTimeout(() => {
        clearInterval(pollInterval);
        if (isLoading) {
          setError('Scan timed out. Please try again.');
          setIsLoading(false);
        }
      }, 300000); // 5 minutes

    } catch (err) {
      setError('Error starting scan: ' + err.message);
      setIsLoading(false);
    }
  };

  const handleNewScan = () => {
    setCurrentScan(null);
    setError('');
  };

  return (
    <div className="App">
      <main className="app-main">
        {!currentScan && !isLoading && (
          <URLInput onScan={handleScan} isLoading={isLoading} />
        )}
        
        {isLoading && (
          <LoadingSpinner message="Analyzing website accessibility..." />
        )}
        
        {currentScan && !isLoading && (
          <ScanResults scan={currentScan} onNewScan={handleNewScan} />
        )}
        
        {error && (
          <div className="error-container">
            <div className="error-message">
              <h3>Error</h3>
              <p>{error}</p>
              <button onClick={handleNewScan} className="retry-button">
                Try Again
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;