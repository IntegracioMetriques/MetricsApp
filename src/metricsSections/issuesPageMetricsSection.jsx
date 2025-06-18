// components/issuesMetricsByUserSection.jsx
import React from 'react';
import GaugeChart from '../components/gaugeChart.jsx';

function IssuesPageMetricsSection({ gaugeDataAssigned, gaugeDataClosed, totalPeople }) {
  return (
    <div className='section-background'>
      <h2>Metrics by User</h2>

      <h2 className="section-title">
        Issues assigned per user
        <span className="custom-tooltip">
          ⓘ
          <span className="tooltip-text">
            Percentage of issues assigned per user relative to the number of assigned issues
          </span>
        </span>
      </h2>
      <div className="gauge-charts-container">
        {gaugeDataAssigned.map(({ user, percentage }) => (
          <GaugeChart
            key={`assigned-issues-${user}`}
            user={user}
            percentage={percentage}
            totalPeople={totalPeople}
          />
        ))}
      </div>

      <h2 className="section-title">
        Issues closed per user
        <span className="custom-tooltip">
          ⓘ
          <span className="tooltip-text">
            Percentage of issues closed per user relative to the issues assigned to that user
          </span>
        </span>
      </h2>
      <div className="gauge-charts-container">
        {gaugeDataClosed.map(({ user, percentage }) => (
          <GaugeChart
            key={`closed-issues-${user}`}
            user={user}
            percentage={percentage}
            totalPeople={1}
          />
        ))}
      </div>
    </div>
  );
}

export default IssuesPageMetricsSection;
