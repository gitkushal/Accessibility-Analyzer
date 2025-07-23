import React from 'react';
import IssueCard from './IssueCard';
import './ScanResults.css';

const ScanResults = ({ scan, onNewScan }) => {
  const { results, url, createdAt } = scan;
  
  const getScoreColor = (issueCount) => {
    if (issueCount === 0) return '#28a745'; // Green
    if (issueCount <= 5) return '#ffc107'; // Yellow
    if (issueCount <= 10) return '#fd7e14'; // Orange
    return '#dc3545'; // Red
  };

  const getScoreLabel = (issueCount) => {
    if (issueCount === 0) return 'Excellent';
    if (issueCount <= 5) return 'Good';
    if (issueCount <= 10) return 'Needs Improvement';
    return 'Poor';
  };

  const groupIssuesByImpact = (violations) => {
    const groups = {
      critical: [],
      serious: [],
      moderate: [],
      minor: []
    };
    
    violations.forEach(violation => {
      const impact = violation.impact || 'minor';
      if (groups[impact]) {
        groups[impact].push(violation);
      }
    });
    
    return groups;
  };

  const groupedIssues = groupIssuesByImpact(results.violations);

  return (
    <div className="scan-results">
      <div className="results-header">
        <div className="scan-info">
          <h2>Accessibility Report</h2>
          <p className="scanned-url">
            <strong>URL:</strong> 
            <a href={url} target="_blank" rel="noopener noreferrer">
              {url}
            </a>
          </p>
          <p className="scan-date">
            <strong>Scanned:</strong> {new Date(createdAt).toLocaleString()}
          </p>
        </div>
        
        <button 
          className="new-scan-button"
          onClick={onNewScan}
        >
          New Scan
        </button>
      </div>

      <div className="results-summary">
        <div className="score-card">
          <div className="score-circle" style={{ borderColor: getScoreColor(results.issueCount) }}>
            <div className="score-number">{results.issueCount}</div>
            <div className="score-label">Issues</div>
          </div>
          <div className="score-details">
            <h3 style={{ color: getScoreColor(results.issueCount) }}>
              {getScoreLabel(results.issueCount)}
            </h3>
            <p>{results.passes} checks passed</p>
          </div>
        </div>

        <div className="issue-breakdown">
          <h3>Issue Breakdown</h3>
          <div className="breakdown-grid">
            {Object.entries(groupedIssues).map(([impact, issues]) => (
              <div key={impact} className="breakdown-item">
                <div className="breakdown-count">{issues.length}</div>
                <div className="breakdown-label">
                  {impact.charAt(0).toUpperCase() + impact.slice(1)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {results.issueCount > 0 ? (
        <div className="issues-section">
          <h3>Accessibility Issues</h3>
          <div className="issues-list">
            {Object.entries(groupedIssues).map(([impact, issues]) => 
              issues.map((issue, index) => (
                <IssueCard key={`${impact}-${index}`} issue={issue} />
              ))
            )}
          </div>
        </div>
      ) : (
        <div className="no-issues">
          <div className="success-icon">✅</div>
          <h3>Great Job!</h3>
          <p>No accessibility issues found. Your website follows accessibility best practices.</p>
        </div>
      )}
    </div>
  );
};

export default ScanResults;