import React, { useState } from 'react';
import "../styles/index.css"; 
import PieChart from '../components/pieChart';
import RadarChart from '../components/radarChart';
import LineChart from '../components/lineChart';
import BarChart from '../components/barChart';
import BarLineChart from '../components/barLineChart';
import AreaChart from '../components/areaChart';
import GaugeChart from '../components/gaugeChart';
import AreaChartMultiple from '../components/areaChartMultiple';

function Index({data,historicData,features}) {
  const [showHistorical, setShowHistorical] = useState(false);
  const pullRequests = data.pull_requests;
  const open = pullRequests.total - pullRequests.merged - pullRequests.closed
  const issues = data.issues
  const datapullRequests = [
    ["Open", open],
    ["Closed", pullRequests.closed],
    ["Merged", pullRequests.merged],
  ];
  const dataissues = [
    ["Open",issues.total - issues.total_closed],
    ["Closed",issues.total_closed]
  ]

  const taskData = data.project;
  const totalTasks = taskData.total;
  const totalInProgress = taskData.in_progress
  const totalDone = taskData.done
  const totalToDo = totalTasks - totalDone - totalInProgress
  const dataTasks = [
    ["Todo",totalToDo],
    ["In Progress",totalInProgress],
    ["Done", totalDone]
  ]
  const colorsPR = ["red", "orange","green"];  
  const colorsIssues = ["red","green"];
  const colorsProject = ["red", "orange","green"]; 
  const nonAnonymousCommits = data.commits.total - data.commits.anonymous / data.commits.total
  const issuesAssigned = data.issues.total - data.issues.assigned.non_assigned / data.issues.total
  const issueswithPR = data.issues.have_pull_request / data.issues.total_closed
  const pullRequestsMerged = data.pull_requests.merged / data.pull_requests.total - data.pull_requests.closed
  const pullRequestsReviewed = data.pull_requests.not_merged_by_author / data.pull_requests.merged
  const pullRequestsMerges = data.pull_requests.merged / data.commit_merges
  let radarData;
  if (features.includes('issues') && features.includes('pull-requests')) {
    radarData = {
      'Non-Anonymous Commits': (data.commits.total - data.commits.anonymous) / data.commits.total,
      'Issues Assigned': (data.issues.total - data.issues.assigned.non_assigned) / data.issues.total,
      'Issues associated PR': data.issues.have_pull_request / data.issues.total_closed,
      'Pull Requests Merged': data.pull_requests.merged / (data.pull_requests.total - data.pull_requests.closed),
      'Pull Requests Reviewed': data.pull_requests.not_merged_by_author / data.pull_requests.merged,
      'Pull Requests Merges': data.pull_requests.merged / data.commit_merges,
    };
  }
  else if (!(features.includes('issues')) && features.includes('pull-requests')) {
    radarData = {
      'Non-Anonymous Commits': (data.commits.total - data.commits.anonymous) / data.commits.total,
      'Pull Requests Merged': data.pull_requests.merged / (data.pull_requests.total - data.pull_requests.closed),
      'Pull Requests Reviewed': data.pull_requests.not_merged_by_author / data.pull_requests.merged,
      'Pull Requests Merges': data.pull_requests.merged / data.commit_merges,
    };
  }
  else if (features.includes('issues') && !(features.includes('pull-requests'))) {
    radarData = {
      'Non-Anonymous Commits': (data.commits.total - data.commits.anonymous) / data.commits.total,
      'Issues Assigned': (data.issues.total - data.issues.assigned.non_assigned) / data.issues.total,
      'Issues associated PR': data.issues.have_pull_request / data.issues.total_closed,
    };
  } else {
    radarData = {
      'Non-Anonymous Commits': (data.commits.total - data.commits.anonymous) / data.commits.total,
    };
  }
  const transformDataForLineChart = (data) => {
    const xData = []; 
    const yData = []; 
    for (const date in data) {
          xData.push(date);
          yData.push(data[date].commits.total); 
        }
      
    return { xData, yData };
    };
const { xData, yData } = transformDataForLineChart(historicData);
const transformIssuesDataForAreaChart = (data) => {
  const xDataIssues = [];
  const closedIssues = [];
  const openIssues = [];
  
  for (const date in data) {
    const total = data[date].issues.total || 0;
    const closed = data[date].issues.total_closed || 0;
    const open = total - closed;
    xDataIssues.push(date);
    closedIssues.push(closed);
    openIssues.push(open);
    }
    return { xDataIssues, closedIssues, openIssues };
  };
const { xDataIssues, closedIssues, openIssues } = transformIssuesDataForAreaChart(historicData);
const transformPRDataForAreaChart = (data) => {
  const xDataPRs = [];
  const mergedPRs = [];
  const openPRs = [];
  
  for (const date in data) {
    const total = data[date].pull_requests.total || 0;
    const merged = data[date].pull_requests.merged || 0;
    const closed = data[date].pull_requests.closed || 0;
    const open = total - merged - closed;
    xDataPRs.push(date);
    mergedPRs.push(merged);
    openPRs.push(open);
    }
    return { xDataPRs, mergedPRs, openPRs };
  };
  const { xDataPRs, mergedPRs, openPRs } = transformPRDataForAreaChart(historicData);
  
  const transformTaskDataForAreaChart = (data) => {
    const xDataTask = [];
    const doneTask = [];
    const inProgressTask = [];
    const toDoTask = []
    
    for (const date in data) {
      const total = data[date].project.total || 0;
      const done = data[date].project.done || 0;
      const inProgress = data[date].project.in_progress || 0;
      const todo = total - done - inProgress
      xDataTask.push(date);
      doneTask.push(done);
      inProgressTask.push(inProgress);
      toDoTask.push(todo)
      }
      return { xDataTask, doneTask, inProgressTask,toDoTask };
    };
  const { xDataTask, doneTask, inProgressTask,toDoTask } = transformTaskDataForAreaChart(historicData);
  return (
    <div>
      <h1>General overview</h1>
          <div className="grid-container">
            <div className="grid-item general-stats horizontal-layout">
              <div className='stats-title '>
                <h2>Project Stats</h2>
              </div>
              <div className="general-stats-grid">
                <div><strong>Total Members:</strong> {Object.keys(data.commits).filter(user => user !== 'anonymous' && user !== 'total').length}</div>
                <div><strong>Total Commits:</strong> {data.commits.total}</div>
                {features.includes("issues") && (
                <div><strong>Total Issues:</strong> {data.issues.total}</div>) }
                {features.includes("pull-requests") && (
                <div><strong>Total Pull Requests:</strong> {data.pull_requests.total}</div>)}
                <div><strong>Total Additions:</strong> {data.modified_lines.total.additions}</div>
                <div><strong>Total Deletions:</strong> {data.modified_lines.total.deletions}</div>
                <div><strong>Total Modifications:</strong> {data.modified_lines.total.modified}</div>
                <div><strong>Total Lines of code:</strong> {data.modified_lines.total.additions - data.modified_lines.total.deletions}</div>
              </div>
            </div>
          </div>
          {(features.includes("issues") || features.includes("pull-requests")) && (
          <div className="chart-toggle-wrapper-index">
            <div className="chart-toggle-buttons">
              <button 
                onClick={() => setShowHistorical(false)}
                className={!showHistorical ? 'selected' : ''}
              >
                Current
              </button>
              <button 
                onClick={() => setShowHistorical(true)}
                className={showHistorical ? 'selected' : ''}
              >
                Historical
              </button>
            </div>
          </div>)}
          {!showHistorical && (
  <>
    {(features.includes("issues") || features.includes("pull-requests")) ? (
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
              data={datapullRequests}
              colors={colorsPR}
            />
          </div>
        )}
        {features.includes("issues") && (
          <div className="grid-item">
            <PieChart
              title="Issues state summary"
              data={dataissues}
              colors={colorsIssues}
            />
          </div>
        )}
        {features.includes("projects") && (
          <div className="grid-item">
            <PieChart
              title="Project tasks state summary"
              data={dataTasks}
              colors={colorsProject}
            />
          </div>
        )}
      </div>
    ) : (
      <div>
      <div className='radar-charts-wrapper'>
          <div className='radar-chart-container'>
            <GaugeChart
            user = "non-anonymous" 
            percentage={data.commits.total > 0 ? (data.commits.total - data.commits.anonymous) / data.commits.total : 0 }
            totalPeople={1}
          />
        </div>
        <div className='radar-chart-container'>
        <LineChart
            xData={xData}
            yData={yData}
            xLabel="Date"
            yLabel="Commits"
            title="Commits Over Time"
          />
        </div>
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
                <BarChart
                  xData={xData}
                  yData={yData}
                  xLabel="Date"
                  yLabel="Commits"
                  title="Commits Over Time"
                />
              </div>
              <div className='radar-chart-container'>
                <BarLineChart
                  xData={xData}
                  yDataBar={yData}
                  yDataLine={yData}
                  xLabel="Date"
                  yLabel="Commits"
                  title="Commits Over Time"
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
                  title="Open and Closed Issues Over Time"
                />
              </div>)}
              {features.includes("pull-requests") && (
              <div className='radar-chart-container'>
                <AreaChart
                  xData={xDataPRs}
                  topData={openPRs}
                  bottomData={mergedPRs}
                  topColor="rgb(255, 0, 0)"
                  bottomColor="rgb(0, 255, 0)"
                  toplabel="Open"
                  bottomLabel="Merged"
                  xLabel="Date"
                  yLabel="Pull Requests"
                  title="Open and Merged Pull Requests Over Time"
                />
              </div>)}
              {features.includes("projects") && (
              <div className='radar-chart-container'>
                <AreaChartMultiple
                xData={xDataTask}
                seriesData={[
                  { label: 'To Do', data: toDoTask, color: "rgb(255, 0, 0)" },
                  { label: 'In Progress', data: inProgressTask, color: 'orange' },
                  { label: 'Done', data: doneTask, color: "rgb(0, 255, 0)" }
                ]}
                xLabel="Date"
                yLabel="Tasks"
                title="Tasks Over Time"
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
