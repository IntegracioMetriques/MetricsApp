import React, { useState } from 'react';
import "../styles/index.css"; 
import PieChart from '../components/pieChart';
import RadarChart from '../components/radarChart';
import LineChart from '../components/lineChart';
import AreaChart from '../components/areaChart';
import GaugeChart from '../components/gaugeChart';
import AreaChartMultiple from '../components/areaChartMultiple';
import usePersistentStateSession  from '../components/usePersistentStateSession';

function Index({data,historicData,features}) {
  const [showHistorical, setShowHistorical] = usePersistentStateSession('showHistoricalIndex', false);
  const [dateRange, setDateRange] = usePersistentStateSession('dateRangeIndex', "7");
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
  const filterHistoricData = (data, days) => {
    if (days === "lifetime") return data;

    const today = new Date();
    const cutoff = new Date(today);
    cutoff.setDate(today.getDate() - parseInt(days));
    const cutoffDateString = cutoff.toISOString().split("T")[0];
    const filtered = {};
    for (const date in data) {
      if (date >= cutoffDateString) {
        filtered[date] = data[date];
      }
    }

    return filtered;
  };
  const filteredhistoricaData = historicData ? filterHistoricData(historicData, dateRange) : null;

  const taskData = data.project.metrics_by_iteration.total;
  const totalTasks = taskData.total;
  const totalInProgress = taskData.in_progress;
  const totalDone = taskData.done;
  const totalToDo = taskData.todo;
  const dataTasks = [
    ["Todo",totalToDo],
    ["In Progress",totalInProgress],
    ["Done", totalDone]
  ]

  for (const [key, value] of Object.entries(taskData)) {
    if (
      !["todo", "in_progress", "done", "total"].includes(key) &&
      !key.startsWith("total_") &&
      !key.startsWith("total") &&
      typeof value === "number" &&
      Number.isInteger(value)
    ) {
      const label = key.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
      dataTasks.push([label, value]);
    }
  }
  const colorsPR = ["red", "orange","green"];  
  const colorsIssues = ["red","green"];
  const colorsProject = ["red", "orange","green"]; 
  let radarData = {};

  radarData['Non-Anonymous Commits'] = 
     data.commits.total > 0 ? (data.commits.total - data.commits.anonymous) / data.commits.total : 0;

  if (features.includes('issues')) {
    radarData['Issues Assigned'] = 
       data.issues.total > 0 ? (data.issues.total - data.issues.assigned.non_assigned) / data.issues.total : 0;

    radarData['Issues associated PR'] = 
      data.issues.total_closed > 0 ?  data.issues.have_pull_request / data.issues.total_closed : 0;
  }

  if (features.includes('pull-requests')) {
    radarData['Pull Requests Merged'] = 
      (data.pull_requests.total - data.pull_requests.closed) > 0 ? data.pull_requests.merged / (data.pull_requests.total - data.pull_requests.closed) : 0;

    radarData['Pull Requests Reviewed'] = 
      data.pull_requests.merged > 0 ? data.pull_requests.not_merged_by_author / data.pull_requests.merged : 0;

    radarData['Pull Requests Merges'] = 
      data.commit_merges > 0 ? data.pull_requests.merged / data.commit_merges : 0;
  }
  if (features.includes('projects')) {
    const taskData = data.project.metrics_by_iteration.total;
    const { non_assigned, ...assignedPerMember } = taskData.assigned_per_member;
    const totalAssigned = Object.values(assignedPerMember).reduce((sum, current) => sum + current, 0);
    const totalTasks = taskData.total_tasks;
    radarData['Tasks Assigned'] =
      totalTasks > 0 ? totalAssigned / totalTasks : 0

    const todo = taskData.todo
    const inProgress = taskData.in_progress
    const done = taskData.done 
    const standard = todo + inProgress + done;
    radarData['Tasks With Standard Status'] = 
      totalTasks > 0 ? standard / totalTasks : 0

    const totalDraftIssues = taskData.total 
    const totalIssues = taskData.total_issues
    radarData['DrafIssues that are Issues'] = 
      totalDraftIssues > 0 ? totalIssues / totalDraftIssues : 0
    const IssuesWithType = taskData.total_issues_with_type
    radarData['Projects Issues with type'] = 
      totalIssues > 0 ? IssuesWithType / totalIssues : 0
    if(data.project.has_iterations) {
      const noIterationDraftIssues = data.project.metrics_by_iteration.no_iteration.total
      const iterationDraftIssues = totalDraftIssues - noIterationDraftIssues
      radarData['DraftIssues with iteration'] = 
        totalDraftIssues > 0 ? iterationDraftIssues / totalDraftIssues : 0
    }
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
  const { xData, yData } = transformDataForLineChart(filteredhistoricaData);

  const transformDataForLineChartModifiedLines = (data) => {
    const xDataModifedLines = []; 
    const yDataModifedLines = []; 
    for (const date in data) {
          xDataModifedLines.push(date);
          yDataModifedLines.push(data[date].modified_lines.total.modified); 
        }
      
    return { xDataModifedLines, yDataModifedLines };
  };
  const { xDataModifedLines, yDataModifedLines } = transformDataForLineChartModifiedLines(filteredhistoricaData);

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
  const { xDataIssues, closedIssues, openIssues } = transformIssuesDataForAreaChart(filteredhistoricaData);
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
  const { xDataPRs, mergedPRs, openPRs } = transformPRDataForAreaChart(filteredhistoricaData);
    
  const transformTaskDataForAreaChart = (data) => {
    const xDataTask = [];
    const doneTask = [];
    const inProgressTask = [];
    const toDoTask = []
    const otherKeysData = {}
    const allOtherKeys = new Set();

    for (const date in data) {
      const metrics = data[date].project.metrics_by_iteration.total;
      for (const [key, value] of Object.entries(metrics)) {
        if (
          !['done', 'in_progress', 'todo', 'total'].includes(key) &&
          !key.startsWith('total_') &&
          !key.startsWith('total') &&
          typeof value === 'number' &&
          Number.isInteger(value)
        ) {
          allOtherKeys.add(key);
        }
      }
    }

    for (const key of allOtherKeys) {
      otherKeysData[key] = [];
    }
    for (const date in data) {
      const metrics = data[date].project.metrics_by_iteration.total;
      const done = metrics.done || 0;
      const todo = metrics.todo || 0;
      const inProgress = metrics.in_progress || 0;

      xDataTask.push(date);
      doneTask.push(done);
      inProgressTask.push(inProgress);
      toDoTask.push(todo)
      for (const key of allOtherKeys) {
        const value = metrics[key];
          otherKeysData[key].push(Number.isInteger(value) ? value : 0);
      }
      }      
      return { xDataTask, doneTask, inProgressTask,toDoTask,otherKeysData };
    };
  const { xDataTask, doneTask, inProgressTask,toDoTask,otherKeysData } = transformTaskDataForAreaChart(filteredhistoricaData);
  
  const baseSeries = [
    { label: 'Done', data: doneTask, color: "rgb(0, 255, 0)" },
    { label: 'In Progress', data: inProgressTask, color: 'orange' },
    { label: 'To Do', data: toDoTask, color: "rgb(255, 0, 0)" }
  ];

  const otherSeries = Object.entries(otherKeysData).map(([key, data]) => ({
    label: key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
    data,
  }));

  const allSeries = [...baseSeries, ...otherSeries];

  
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
                {features.includes("projects") && (
                <div><strong>Total Tasks:</strong> {data.project.metrics_by_iteration.total.total_tasks}</div>)}
                {features.includes("projects") && (
                <div><strong>Total Features:</strong> {data.project.metrics_by_iteration.total.total_features}</div>)}
              </div>
            </div>
          </div>
          {(features.includes("issues") || features.includes("pull-requests") || features.includes("projects")) && (
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
            
          {showHistorical && (
            <div className = "day-selector-wrapper">
            <select className='day-selector'
              onChange={(e) => setDateRange(e.target.value)} 
              value={dateRange}
              style={{ marginLeft: '1rem' }}
            >
              <option value="7">Last 7 days</option>
              <option value="15">Last 15 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 3 months</option>
              <option value="lifetime">Lifetime</option>
            </select>
            </div>
          )}
          
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
      <div className='only-commits-wrapper'>
        <div className='only-commits-container'>
            <GaugeChart
            user = "non-anonymous" 
            percentage={data.commits.total > 0 ? (data.commits.total - data.commits.anonymous) / data.commits.total : 0 }
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
                seriesData={allSeries}
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
