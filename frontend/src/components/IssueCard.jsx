import React from 'react';
import './IssueCard.css';

const IssueCard = ({ issue }) => {
  const getImpactColor = (impact) => {
    switch (impact) {
      case 'critical': return '#dc3545';
      case 'serious': return '#fd7e14';
      case 'moderate': return '#ffc107';
      case 'minor': return '#28a745';
      default: return '#6c757d';
    }
  };

  const getImpactLabel = (impact) => {
    return impact ? impact.charAt(0).toUpperCase() + impact.slice(1) : 'Unknown';
  };

  return (
    <div className="issue-card">
      <div className="issue-header">
        <span 
          className="impact-badge"
          style={{ backgroundColor: getImpactColor(issue.impact) }}
        >
          {getImpactLabel(issue.impact)}
        </span>
        <h3 className="issue-title">{issue.help}</h3>
      </div>
      
      <p className="issue-description">{issue.description}</p>
      
      {issue.nodes && issue.nodes.length > 0 && (
        <div className="affected-elements">
          <h4>Affected Elements ({issue.nodes.length})</h4>
          <div className="elements-list">
            {issue.nodes.slice(0, 3).map((node, index) => (
              <div key={index} className="element-item">
                <code className="element-code">{node.target?.join(', ')}</code>
                {node.html && (
                  <div className="element-html">
                    <code>{node.html.substring(0, 100)}...</code>
                  </div>
                )}
              </div>
            ))}
            {issue.nodes.length > 3 && (
              <p className="more-elements">
                + {issue.nodes.length - 3} more elements
              </p>
            )}
          </div>
        </div>
      )}
      
      {issue.helpUrl && (
        <div className="issue-actions">
          <a 
            href={issue.helpUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="help-link"
          >
            Learn More →
          </a>
        </div>
      )}
    </div>
  );
};

export default IssueCard;