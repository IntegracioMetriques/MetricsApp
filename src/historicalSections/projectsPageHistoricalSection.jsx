import React from 'react';
import LineChartMultiple from '../components/lineChartMultiple';
import AreaChartMultiple from '../components/areaChartMultiple';

function ProjectsPageHistoricalSection({
  historicData,
  xDataAssigned,
  seriesDataAssigned,
  xDataFeature,
  allSeries,
}) {
  if (!historicData) {
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
      <div className='radar-charts-wrapper'>
        <div className='radar-chart-container'>
          <LineChartMultiple
            xData={xDataAssigned}
            seriesData={seriesDataAssigned}
            xLabel="Data"
            yLabel="Tasks"
            title="Assigned tasks distribution over time"
          />
        </div>
        <div className='radar-chart-container'>
          <AreaChartMultiple
            xData={xDataFeature}
            seriesData={allSeries}
            xLabel="Date"
            yLabel="Features"
            title="Features Over Time"
          />
        </div>
      </div>
    </div>
  );
}

export default ProjectsPageHistoricalSection;