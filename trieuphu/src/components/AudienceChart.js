import React from 'react';
import { LETTERS } from '../data';

const AudienceChart = ({ percentages = [0, 0, 0, 0] }) => {
  return (
    <div className="audience-chart-container">
      <div className="audience-chart-title">📊 Ý kiến khán giả trường quay</div>
      <div className="audience-bars">
        {percentages.map((percent, idx) => (
          <div key={idx} className="audience-bar-row">
            <span className="audience-bar-label">{LETTERS[idx]}</span>
            <div className="audience-bar-track">
              <div
                className="audience-bar-fill"
                style={{ width: `${percent}%` }}
              >
                {LETTERS[idx]}: {percent}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AudienceChart;
