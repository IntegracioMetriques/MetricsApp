// components/historicalSection.jsx
import React from 'react';
import LineChartMultiple from '../components/lineChartMultiple.jsx';

function CommitsPageHistoricalSection({ xDataCommits, seriesDataCommits, xDataModified, seriesDataModified, hasHistoric }) {
  if (!hasHistoric) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        fontSize: "1.8rem",
      }}>
        No s'ha trobat historic_metrics.json.<br />
        Si és el primer dia, torna demà un cop
        s'hagi fet la primera execució del
        workflow Daily Metrics.
      </div>
    );
  }

  return (
    <div className="section-background">
      <div className="radar-charts-wrapper">
        <div className="radar-chart-container">
          <LineChartMultiple xData={xDataCommits} seriesData={seriesDataCommits} xLabel="Date" yLabel="Commits" title="Commits distribution over time" />
        </div>
        <div className="radar-chart-container">
          <LineChartMultiple xData={xDataModified} seriesData={seriesDataModified} xLabel="Date" yLabel="Modified Lines" title="Modified lines distribution over time" />
        </div>
      </div>
    </div>
  );
}

export default CommitsPageHistoricalSection;
