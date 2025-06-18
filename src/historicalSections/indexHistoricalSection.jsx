import React from 'react';
import LineChart from '../components/lineChart';
import AreaChart from '../components/areaChart';
import AreaChartMultiple from '../components/areaChartMultiple';

function IndexHistoricalSection({ features, historicData, xData, yData, xDataModifedLines, yDataModifedLines, xDataIssues, openIssues, closedIssues, xDataPRs, areaPRData, xDataTask, allSeries }) {
  if (!historicData) {
    return (
      <div style={{ textAlign: "center", fontSize: "1.8rem" }}>
        No s'ha trobat historic_metrics.json.<br />
        Si és el primer dia, torna demà.
      </div>
    );
  }

  return (
    <div className='radar-charts-wrapper'>
      <div className='radar-chart-container'>
        <LineChart xData={xData} yData={yData} xLabel="Date" yLabel="Commits" title="Commits Over Time" />
      </div>
      <div className='radar-chart-container'>
        <LineChart xData={xDataModifedLines} yData={yDataModifedLines} xLabel="Date" yLabel="Modified Lines" title="Modified Lines Over Time" />
      </div>
      {features.includes("issues") && (
        <div className='radar-chart-container'>
          <AreaChart 
            xData={xDataIssues} 
            topData={openIssues} 
            bottomData={closedIssues} topColor="rgb(255, 0, 0)" 
            bottomColor="rgb(0, 255, 0)" toplabel="Open" 
            bottomLabel="Closed" 
            xLabel="Date" 
            yLabel="Issues" 
            title="Issues State Over Time"
           />
        </div>
      )}
      {features.includes("pull-requests") && (
        <div className='radar-chart-container'>
          <AreaChartMultiple 
            xData={xDataPRs} 
            seriesData={areaPRData} 
            xLabel="Date" 
            yLabel="Pull requests" 
            title="Pull Requests State Over Time" 
          />
        </div>
      )}
      {features.includes("projects") && (
        <div className='radar-chart-container'>
          <AreaChartMultiple 
            xData={xDataTask} 
            seriesData={allSeries} 
            xLabel="Date" yLabel="Tasks" 
            title="Tasks State Over Time" />
        </div>
      )}
    </div>
  );
}

export default IndexHistoricalSection;
