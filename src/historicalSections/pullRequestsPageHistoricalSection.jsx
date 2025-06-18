import React from 'react';
import LineChartMultiple from '../components/lineChartMultiple.jsx';

function PullRequestsPageHistoricalSection({ historicData, xDataCreated, seriesDataCreated, xDataMerged, seriesDataMerged }) {
  if (!historicData) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          fontSize: "1.8rem",
        }}
      >
        No s'ha trobat historic_metrics.json.<br />
        Si és el primer dia, torna demà un cop s'hagi fet la primera execució del workflow Daily Metrics.
      </div>
    );
  }

  return (
    <div className="section-background">
      <div className="radar-charts-wrapper">
        <div className="radar-chart-container">
          <LineChartMultiple
            xData={xDataCreated}
            seriesData={seriesDataCreated}
            xLabel="Data"
            yLabel="Pull requests"
            title="Created pull requests distribution over time"
          />
        </div>
        <div className="radar-chart-container">
          <LineChartMultiple
            xData={xDataMerged}
            seriesData={seriesDataMerged}
            xLabel="Data"
            yLabel="Pull requests"
            title="Merged pull requests distribution over time"
          />
        </div>
      </div>
    </div>
  );
}

export default PullRequestsPageHistoricalSection;
