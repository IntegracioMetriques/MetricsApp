import React, { useState } from 'react';
import "../styles/index.css"; 
import PieChart from '../components/pieChart';
import RadarChart from '../components/radarChart';
import LineChart from '../components/lineChart';
import AreaChart from '../components/areaChart';

function Index({data,historicData}) {
  const [showHistorical, setShowHistorical] = useState(false);
  const pullRequests = data.pull_requests;
  const open = pullRequests.total - pullRequests.merged - pullRequests.closed
  const issues = data.issues
  const datapullRequests = [
    ["Merged", pullRequests.merged],
    ["Open", open],
    ["Closed", pullRequests.closed],
  ];
  const dataissues = [
    ["Open",issues.total - issues.total_closed],
    ["Closed",issues.total_closed]
  ]
  const colorsPR = ["green", "red","orange"]; 
  const colorsIssues = ["red","green"];
  const nonAnonymousCommits = data.commits.total - data.commits.anonymous / data.commits.total
  const issuesAssigned = data.issues.total - data.issues.assigned.non_assigned / data.issues.total
  const issueswithPR = data.issues.have_pull_request / data.issues.total_closed
  const pullRequestsMerged = data.pull_requests.merged / data.pull_requests.total - data.pull_requests.closed
  const pullRequestsReviewed = data.pull_requests.not_merged_by_author / data.pull_requests.merged
  const pullRequestsMerges = data.pull_requests.merged / data.commit_merges

  const radarData = {
    'Non-Anonymous Commits': (data.commits.total - data.commits.anonymous) / data.commits.total,
    'Issues Assigned': (data.issues.total - data.issues.assigned.non_assigned) / data.issues.total,
    'Issues associated PR': data.issues.have_pull_request / data.issues.total_closed,
    'Pull Requests Merged': data.pull_requests.merged / (data.pull_requests.total - data.pull_requests.closed),
    'Pull Requests Reviewed': data.pull_requests.not_merged_by_author / data.pull_requests.merged,
    'Pull Requests Merges': data.pull_requests.merged / data.commit_merges,
  };

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
  console.log(xDataPRs)
  return (
    <div>
      <h1>General overview</h1>
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
      
    </div>
  
      {!showHistorical && (
        <>
          <div className="grid-container">
            <div className="grid-item general-stats horizontal-layout">
              <div className='stats-title '>
                <h2>Project Stats</h2>
              </div>
              <div className="general-stats-grid">
                <div><strong>Total Members:</strong> {Object.keys(data.commits).filter(user => user !== 'anonymous' && user !== 'total').length}</div>
                <div><strong>Total Commits:</strong> {data.commits.total}</div>
                <div><strong>Total Issues:</strong> {data.issues.total}</div>
                <div><strong>Total Pull Requests:</strong> {data.pull_requests.total}</div>
                <div><strong>Total Additions:</strong> {data.modified_lines.total.additions}</div>
                <div><strong>Total Deletions:</strong> {data.modified_lines.total.deletions}</div>
                <div><strong>Total Modifications:</strong> {data.modified_lines.total.modified}</div>
                <div><strong>Total Lines of code:</strong> {data.modified_lines.total.additions - data.modified_lines.total.deletions}</div>
              </div>
            </div>
          </div>
          <div className="grid-container">
            <div className="grid-item">
              <RadarChart
                data={radarData}
                title="General Metrics"
                max={1}
              />
            </div>
            <div className="grid-item">
              <PieChart
                title="Pull requests state summary"
                data={datapullRequests}
                colors={colorsPR}
              />
            </div>
            <div className="grid-item">
              <PieChart
                title="Issues state summary"
                data={dataissues}
                colors={colorsIssues}
              />
            </div>
          </div>
        </>
      )}
  
      {showHistorical && (
        <div>
          <h1>Historical Data</h1>
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
              </div>
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
                  yLabel="Issues"
                  title="Open and Merged Pull Requests Over Time"
                />
              </div>
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
