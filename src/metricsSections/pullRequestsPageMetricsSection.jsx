import React from 'react';
import GaugeChart from '../components/gaugeChart.jsx';

function PullRequestsMetricsSection({ gaugeDataCreatedPRs, gaugeDataMergedPRs, totalPeople }) {
  return (
    <div className="section-background">
      <h2>Metrics by User</h2>

      <h2 className="section-title">
        Pull requests created per user
        <span className="custom-tooltip">
          ⓘ
          <span className="tooltip-text">
            Percentage of pull requests created per user relative to the total number of pull requests
          </span>
        </span>
      </h2>
      <div className="gauge-charts-container">
        {gaugeDataCreatedPRs.map(({ user, percentage }) => (
          <GaugeChart
            key={`created-PR-${user}`}
            user={user}
            percentage={percentage}
            totalPeople={totalPeople}
          />
        ))}
      </div>

      <h2 className="section-title">
        Pull requests merged per user
        <span className="custom-tooltip">
          ⓘ
          <span className="tooltip-text">
            Percentage of pull requests merged per user relative to the number of merged pull requests
          </span>
        </span>
      </h2>
      <div className="gauge-charts-container">
        {gaugeDataMergedPRs.map(({ user, percentage }) => (
          <GaugeChart
            key={`merged-PR-${user}`}
            user={user}
            percentage={percentage}
            totalPeople={totalPeople}
          />
        ))}
      </div>
    </div>
  );
}

export default PullRequestsMetricsSection;
