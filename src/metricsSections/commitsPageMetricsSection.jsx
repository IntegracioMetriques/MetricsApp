// components/metricsByUserSection.jsx
import React from 'react';
import GaugeChart from '../components/gaugeChart.jsx';

function CommitsPageMetricsSection({ commitsGaugeData, modifiedLinesGaugeData, totalPeople }) {
  return (
    <div className="section-background">
      <h2>Metrics by User</h2>

      <h2 className="section-title">
        Commits per user
        <span className="custom-tooltip">
          ⓘ
          <span className="tooltip-text">
            Percentage of commits per user relative to the total number of commits
          </span>
        </span>
      </h2>
      <div className="gauge-charts-container">
        {commitsGaugeData.map(({ user, percentage }) => (
          <GaugeChart key={user} user={user} percentage={percentage} totalPeople={totalPeople} />
        ))}
      </div>

      <h2 className="section-title">
        Modified lines per user
        <span className="custom-tooltip">
          ⓘ
          <span className="tooltip-text">
            Percentage of modified lines per user relative to the total number of modified lines
          </span>
        </span>
      </h2>
      <div className="gauge-charts-container">
        {modifiedLinesGaugeData.map(({ user, percentage }) => (
          <GaugeChart key={user} user={user} percentage={percentage} totalPeople={totalPeople} />
        ))}
      </div>
    </div>
  );
}

export default CommitsPageMetricsSection;
