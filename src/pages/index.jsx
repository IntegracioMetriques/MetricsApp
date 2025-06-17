import React, { useState } from 'react';
import "../styles/index.css"; 
import PieChart from '../components/pieChart';
import RadarChart from '../components/radarChart';
import LineChart from '../components/lineChart';
import AreaChart from '../components/areaChart';
import GaugeChart from '../components/gaugeChart';
import AreaChartMultiple from '../components/areaChartMultiple';
import usePersistentStateSession  from '../components/usePersistentStateSession';
import HistoricalToggle from '../components/historicalToggle.jsx';
import DateRangeSelector from '../components/dateRangeSelector.jsx';
import {filterHistoricData } from '../domain/utils';
import {
  getGaugeDataAnonymous,
  transformDataForLineChartCommits,
  transformDataForLineChartModifiedLines
} from '../domain/commits';
import {
  getGaugeDataIssuesAssigned,
  getGaugeDataIssuesHavePR,
  transformIssuesDataForAreaChart,
  getPieDataIssuesStatus
} from '../domain/issues';
import {
  getGaugeChartDataMergedPRs,
  getGaugeChartDataReviewedPRs,
  getGaugeChartDataMergesPRs,
  transformPRDataForAreaChart,
  getPieDataPullRequestStatus
} from '../domain/pullRequests';
import {
  getGaugeDataTasksAssigned,
  getGaugeDataTasksStandardStatus,
  getGaugeDataItemsIssues,
  getGaugeDataItemIssuesWithType,
  getGaugeDataItemIssuesWithIteration,
  transformTaskDataForAreaChart,
  getPieDataTasksStatus
} from '../domain/projects';


function Index({data,historicData,features}) {
  const [showHistorical, setShowHistorical] = usePersistentStateSession('showHistoricalIndex', false);
  const [dateRange, setDateRange] = usePersistentStateSession('dateRangeIndex', "7");
  const filteredhistoricaData = historicData ? filterHistoricData(historicData, dateRange) : null;

  let radarData = {};

  radarData['Non-Anonymous Commits'] = 
     getGaugeDataAnonymous(data)

  if (features.includes('issues')) {
    radarData['Issues Assigned'] = 
       getGaugeDataIssuesAssigned(data);

    radarData['Issues associated PR'] = 
      getGaugeDataIssuesHavePR(data);
  }

  if (features.includes('pull-requests')) {
    radarData['Pull Requests Merged'] = 
      getGaugeChartDataMergedPRs(data);

    radarData['Pull Requests Reviewed'] = 
      getGaugeChartDataReviewedPRs(data);

    radarData['Pull Requests Merges'] = 
      getGaugeChartDataMergesPRs(data);
  }
  if (features.includes('projects')) {
    radarData['Tasks Assigned'] =
      getGaugeDataTasksAssigned(data,"total")

    radarData['Tasks With Standard Status'] = 
      getGaugeDataTasksStandardStatus(data,"total")
    radarData['Items that are Issues'] = 
       getGaugeDataItemsIssues(data,"total")
    radarData['Projects Issues with type'] = 
      getGaugeDataItemIssuesWithType(data,"total")
    if(data.project.has_iterations) {
      radarData['Items with iteration'] = 
        getGaugeDataItemIssuesWithIteration(data,"total")
    }
  }

  const {pieDataPullRequestStatus,pieDataPullRequestStatusColor} = getPieDataPullRequestStatus(data)
  const {pieDataIssuesStatus,pieDataIssuesStatusColor} = getPieDataIssuesStatus(data)
  const {pieDataTasksStatus,pieDataTasksStatusColor} = getPieDataTasksStatus(data)

  const { xData, yData } = transformDataForLineChartCommits(filteredhistoricaData);

  const { xDataModifedLines, yDataModifedLines } = transformDataForLineChartModifiedLines(filteredhistoricaData);

  const { xDataIssues, closedIssues, openIssues } = transformIssuesDataForAreaChart(filteredhistoricaData);

  const { xDataPRs, areaPRData } = transformPRDataForAreaChart(filteredhistoricaData);
    
  const { xDataTask, allSeries } = transformTaskDataForAreaChart(filteredhistoricaData);
  
  const gaugeAnonymousData = getGaugeDataAnonymous(data)
  return (
    <div>
      <h1>General overview</h1>
          <div className="grid-container">
            <div className="grid-item general-stats horizontal-layout">
              <div className='stats-title '>
                <h2>Project Statistics</h2>
              </div>
              <div className="general-stats-grid">
                <div><strong>Total Members:</strong> {Object.keys(data.avatars).length}</div>
                <div><strong>Total Commits:</strong> {data.commits.total}</div>
                <div><strong>Total Additions:</strong> {data.modified_lines.total.additions}</div>
                <div><strong>Total Deletions:</strong> {data.modified_lines.total.deletions}</div>
                <div><strong>Total Modifications:</strong> {data.modified_lines.total.modified}</div>
                <div><strong>Total Lines of code:</strong> {data.modified_lines.total.additions - data.modified_lines.total.deletions}</div>
                {features.includes("issues") && (
                <div><strong>Total Issues:</strong> {data.issues.total}</div>) }
                {features.includes("pull-requests") && (
                <div><strong>Total Pull Requests:</strong> {data.pull_requests.total}</div>)}
                {features.includes("projects") && (
                <div><strong>Total Tasks:</strong> {data.project.metrics_by_iteration.total.total_tasks}</div>)}
                {features.includes("projects") && (
                <div><strong>Total Features:</strong> {data.project.metrics_by_iteration.total.total_features}</div>)}
              </div>
            </div>
          </div>
          {(features.includes("issues") || features.includes("pull-requests") || features.includes("projects")) && (
            <HistoricalToggle
              showHistorical={showHistorical}
              setShowHistorical={setShowHistorical}
            />)}
            
            <DateRangeSelector
              showHistorical={showHistorical}
              dateRange={dateRange}
              setDateRange={setDateRange}
            />
          
          {!showHistorical && (
      <>
    {(features.includes("issues") || features.includes("pull-requests") || features.includes("projects")) ? (
      <div className="grid-container">
        <div className="grid-item">
          <RadarChart
            data={radarData}
            title="General Metrics"
            max={1}
          />
        </div>
        {features.includes("pull-requests") && (
          <div className="grid-item">
            <PieChart
              title="Pull requests state summary"
              data={pieDataPullRequestStatus}
              colors={pieDataPullRequestStatusColor}
            />
          </div>
        )}
        {features.includes("issues") && (
          <div className="grid-item">
            <PieChart
              title="Issues state summary"
              data={pieDataIssuesStatus}
              colors={pieDataIssuesStatusColor}
            />
          </div>
        )}
        {features.includes("projects") && (
          <div className="grid-item">
            <PieChart
              title="Projects tasks state summary"
              data={pieDataTasksStatus}
              colors={pieDataTasksStatusColor}
            />
          </div>
        )}
      </div>
    ) : (
      <div>
      <div className='only-commits-wrapper'>
        <div className='only-commits-container'>
            <GaugeChart
            user = "non-anonymous" 
            percentage={gaugeAnonymousData }
            totalPeople={1}
          />
        </div>
        { historicData ?
        
        (<div className='only-commits-lines'> 
          <div className='only-commits-line-container'>
          <LineChart
              xData={xData}
              yData={yData}
              xLabel="Date"
              yLabel="Commits"
              title="Commits Over Time"
            />
            </div>
            <div className='only-commits-line-container'>
              <LineChart
              xData={xDataModifedLines}
              yData={yDataModifedLines}
              xLabel="Date"
              yLabel="Modified"
              title="Modified Lines Over Time"
            />
            </div>
        </div>) : <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            fontSize: "1.8rem",
            }}>
            No s'ha trobat historic_metrics.json.<br />
            Si és el primer dia, torna demà un cop<br />
            s'hagi fet la primera execució del<br />
            workflow Daily Metrics.
            </div>}
      </div>
      </div>
    )}
  </>
)}

  
      {showHistorical && (
        <div>
          {historicData ? (
            <div className='radar-charts-wrapper'>
              <div className='radar-chart-container'>
                <LineChart
                  xData={xData}
                  yData={yData}
                  xLabel="Date"
                  yLabel="Commits"
                  title="Commits Over Time"
                />
              </div>
              <div className='radar-chart-container'>
                <LineChart
                xData={xDataModifedLines}
                yData={yDataModifedLines}
                xLabel="Date"
                yLabel="Modified Lines"
                title="Modified Lines Over Time"
              />
              </div>
              {features.includes("issues") && (
              <div className='radar-chart-container'>
                <AreaChart
                  xData={xDataIssues}
                  topData={openIssues}
                  bottomData={closedIssues}
                  topColor="rgb(255, 0, 0)"
                  bottomColor="rgb(0, 255, 0)"
                  toplabel="Open"
                  bottomLabel="Closed"
                  xLabel="Date"
                  yLabel="Issues"
                  title="Issues State Over Time"
                />
              </div>)}
              {features.includes("pull-requests") && (
              <div className='radar-chart-container'>
                <AreaChartMultiple
                xData={xDataPRs}
                seriesData={areaPRData}
                xLabel="Date"
                yLabel="Pull requests"
                title="Pull Requests State Over Time"
              />      
            </div>)}
              {features.includes("projects") && (
              <div className='radar-chart-container'>
                <AreaChartMultiple
                xData={xDataTask}
                seriesData={allSeries}
                xLabel="Date"
                yLabel="Tasks"
                title="Tasks State Over Time"
              />      
            </div>)}
            </div>
          ) : (
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
          )}
        </div>
      )}
    </div>
  );  
}

export default Index;
