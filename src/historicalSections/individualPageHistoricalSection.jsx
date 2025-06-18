// HistoricalCharts.jsx
import React from 'react';
import LineChart from '../components/lineChart.jsx';

function IndividualHistoricSection({
  historicData,
  features,
  xDataCommits,
  yDataCommits,
  xDataModifiedLines,
  yDataModifiedLines,
  xDataAssignedIssues,
  yDataAssignedIssues,
  xDataClosedIssues,
  yDataClosedIssues,
  xDataCreatedPRs,
  yDataCreatedPRs,
  xDataMergedPRs,
  yDataMergedPRs,
  xDataTasksAssigned,
  yDataTasksAssigned,
  xDataTasksToDo,
  yDataTasksToDo,
  xDataTasksInProgress,
  yDataTasksInProgress,
  xDataTasksDone,
  yDataTasksDone,
  xDataTasksStandard,
  yDataTasksStandard
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
          <div className='radar-charts-wrapper'>
            <div className='radar-chart-container'>
              <LineChart
                  xData={xDataCommits}
                  yData={yDataCommits}
                  xLabel="Date"
                  yLabel="Commits"
                  title="Commits Over Time"
                  />
              </div>
              <div className='radar-chart-container'>
                <LineChart
                    xData={xDataModifiedLines}
                    yData={yDataModifiedLines}
                    xLabel="Date"
                    yLabel="Modified Lines"
                    title="Modified Lines Over Time"
                    />
                  </div>
            {features.includes("issues") && (

              <div className='radar-chart-container'>
                <LineChart
                    xData={xDataAssignedIssues}
                    yData={yDataAssignedIssues}
                    xLabel="Date"
                    yLabel="Issues"
                    title="Assigned Issues Over Time"
                    />
              </div>)}
            {features.includes("issues") && (
              <div className='radar-chart-container'>
                <LineChart
                    xData={xDataClosedIssues}
                    yData={yDataClosedIssues}
                    xLabel="Date"
                    yLabel="Issues"
                    title="Clossed Issues Over Time"
                    />
              </div>)}
            {features.includes("pull-requests") && (
              <div className='radar-chart-container'>
                <LineChart
                    xData={xDataCreatedPRs}
                    yData={yDataCreatedPRs}
                    xLabel="Date"
                    yLabel="Pull Requests"
                    title="Pull Requests Created Over Time"
                />
              </div>)}
              {features.includes("pull-requests") && (
              <div className='radar-chart-container'>
                <LineChart
                    xData={xDataMergedPRs}
                    yData={yDataMergedPRs}
                    xLabel="Date"
                    yLabel="Pull Requests"
                    title="Pull Requests Merged Over Time"
                  />
              </div>)}
              {features.includes("projects") && (
              <div className='radar-chart-container'>
                <LineChart
                  xData={xDataTasksAssigned}
                  yData={yDataTasksAssigned}
                  xLabel="Date"
                  yLabel="Tasks Assigned"
                  title="Tasks Assigned Over Time"
                />
              </div>
              )}
            {features.includes("projects") && (
              <div className='radar-chart-container'>
                <LineChart
                  xData={xDataTasksToDo}
                  yData={yDataTasksToDo}
                  xLabel="Date"
                  yLabel="Tasks ToDo"
                  title="Tasks ToDo Over Time"
                />
              </div>
            )}
            {features.includes("projects") && (
              <div className='radar-chart-container'>
                <LineChart
                  xData={xDataTasksInProgress}
                  yData={yDataTasksInProgress}
                  xLabel="Date"
                  yLabel="Tasks In Progress"
                  title="Tasks In Progress Over Time"
                />
              </div>
            )}
            {features.includes("projects") && (
              <div className='radar-chart-container'>
                <LineChart
                  xData={xDataTasksDone}
                  yData={yDataTasksDone}
                  xLabel="Date"
                  yLabel="Tasks Done"
                  title="Tasks Done Over Time"
                />
              </div>
            )}
            {features.includes("projects") && (
              <div className='radar-chart-container'>
                <LineChart
                  xData={xDataTasksStandard}
                  yData={yDataTasksStandard}
                  xLabel="Date"
                  yLabel="Standard Tasks"
                  title="Standard Tasks Over Time"
                />
              </div>
            )}
          </div>
  );
}

export default IndividualHistoricSection;
