import React, { useState } from 'react';
import "../styles/individual.css";
import LineChart from '../components/lineChart';
import GaugeChart from '../components/gaugeChart';
import usePersistentState  from '../components/usePersistentState';

function Individual({ data, historicData, features }) {
  const [selectedUser, setSelectedUser] = usePersistentState("selectedUser",Object.keys(data.commits).filter(user => user !== 'anonymous' && user !== 'total')[0]);
  const [showHistorical, setShowHistorical] = usePersistentState('showHistoricalIndividual', false);
  const [dateRange, setDateRange] = usePersistentState('dateRangeIndividual', "7");
  const filterHistoricData = (data, days) => {
    if (days === "lifetime") return data;

    const today = new Date();
    const cutoff = new Date(today);
    cutoff.setDate(today.getDate() - parseInt(days));
    const cutoffDateString = cutoff.toISOString().split("T")[0];
    console.log(cutoffDateString)
    const filtered = {};
    for (const date in data) {
      if (date >= cutoffDateString) {
        filtered[date] = data[date];
      }
    }

    return filtered;
  };
  const filteredhistoricaData = historicData ? filterHistoricData(historicData, dateRange) : null;
  const users = Object.keys(data.commits).filter(user => user !== 'anonymous' && user !== 'total');
  const avatar = data.avatars[selectedUser] || "";
  const commits = data.commits[selectedUser] || 0;
  const modifiedLines = data.modified_lines[selectedUser] || { additions: 0, deletions: 0, modified: 0 };
  const streak = data.commit_streak[selectedUser] || 0;
  const longestStreak = data.longest_commit_streak_per_user[selectedUser] || 0;
  const issuesAssigned = data.issues.assigned[selectedUser] || 0;
  const issuesClosed = data.issues.closed[selectedUser] || 0;
  const totalCommits = data.commits['total']
  const totalModifiedLines = data.modified_lines['total'].modified
  const totalPeople = Object.keys(data.commits).length - 2;

  const truncateName = (name, maxLength = 18) => {
    return name.length > maxLength ? name.slice(0, maxLength) + '...' : name;
  };
  const userCommits = data.commits[selectedUser];
  const percentageCommits = totalCommits > 0 ? userCommits / totalCommits: 0;
  const userModifiedLines = data.modified_lines[selectedUser].modified
  const percentageModifiedlLines = totalModifiedLines > 0 ? userModifiedLines / totalModifiedLines : 0
  const totalAssignedIssues = data.issues.total - data.issues.assigned["non_assigned"]
  const pullRequestsCreated = data.pull_requests.created[selectedUser]
  const pullRequestsMerged = data.pull_requests.merged_per_member[selectedUser]
  const percentageAssigned = totalAssignedIssues > 0 ? issuesAssigned / totalAssignedIssues: 0
  const percentageIssuesClosed = issuesAssigned > 0 ? issuesClosed/issuesAssigned: 0
  const percentageCreated = data.pull_requests.total > 0 ? data.pull_requests.created[selectedUser] / data.pull_requests.total: 0
  const percentageMerged = data.pull_requests.merged > 0 ? data.pull_requests.merged_per_member[selectedUser] / data.pull_requests.merged: 0
  
  const transformCommitsDataForUser = (data, username) => {
    const xDataCommits = [];
    const yDataCommits = [];
  
    for (const date in data) {
      xDataCommits.push(date);
      yDataCommits.push(data[date].commits[username] || 0);
    }
  
    return { xDataCommits, yDataCommits };
  };

  const { xDataCommits, yDataCommits } = transformCommitsDataForUser(filteredhistoricaData, selectedUser)
  
  const transformModifiedLinesDataForUser = (data, username) => {
    const xDataModifiedLines = [];
    const yDataModifiedLines = [];
  
    for (const date in data) {
      const userData = data[date].modified_lines[username].modified;
      xDataModifiedLines.push(date);
      yDataModifiedLines.push(userData);
    }
  
    return { xDataModifiedLines, yDataModifiedLines };
  };
  const { xDataModifiedLines, yDataModifiedLines } = transformModifiedLinesDataForUser(filteredhistoricaData, selectedUser)

  const transformAssignedIssuesDataForUser = (data, username) => {
    const xDataAssignedIssues = [];
    const yDataAssignedIssues = [];
  
    for (const date in data) {
      xDataAssignedIssues.push(date);
      yDataAssignedIssues.push(data[date].issues?.assigned?.[username] || 0);
    }
  
    return { xDataAssignedIssues, yDataAssignedIssues };
  };
  const { xDataAssignedIssues, yDataAssignedIssues } = transformAssignedIssuesDataForUser(filteredhistoricaData, selectedUser);

  const transformClosedIssuesDataForUser = (data, username) => {
    const xDataClosedIssues = [];
    const yDataClosedIssues = [];
  
    for (const date in data) {
      xDataClosedIssues.push(date);
      yDataClosedIssues.push(data[date].issues?.closed?.[username] || 0);
    }
  
    return { xDataClosedIssues, yDataClosedIssues };
  };

  const { xDataClosedIssues, yDataClosedIssues } = transformClosedIssuesDataForUser(filteredhistoricaData, selectedUser);


  const transformCreatedPRsDataForUser = (data, username) => {
    const xDataCreatedPRs = [];
    const yDataCreatedPRs = [];
  
    for (const date in data) {
      xDataCreatedPRs.push(date);
      yDataCreatedPRs.push(data[date].pull_requests?.created?.[username] || 0);
    }
  
    return { xDataCreatedPRs, yDataCreatedPRs };
  };
  const { xDataCreatedPRs, yDataCreatedPRs } = transformCreatedPRsDataForUser(filteredhistoricaData, selectedUser);

  const transformMergedPRsDataForUser = (data, username) => {
    const xDataMergedPRs = [];
    const yDataMergedPRs = [];
  
    for (const date in data) {
      xDataMergedPRs.push(date);
      yDataMergedPRs.push(data[date].pull_requests?.merged_per_member?.[username] || 0);
    }
  
    return { xDataMergedPRs, yDataMergedPRs };
  };
  const { xDataMergedPRs, yDataMergedPRs } = transformMergedPRsDataForUser(filteredhistoricaData, selectedUser);

  return (
    <div>
      <h1>Individual overview</h1>
      <div className="grid-container">
        <div className="grid-item individual-user-card horizontal-layout">
          <div className="user-info">
            <img src={avatar} alt={selectedUser} className="user-avatar" />
            <select className="user-selector" value={selectedUser}  title={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
          {users.map(user => (
            <option key={user} value={user} title={user}>{truncateName(user)}</option>
          ))}
        </select>            </div>
            <div className="stats-grid">
              <div><strong>Commits:</strong> {commits}</div>
              <div><strong>Additions:</strong> {modifiedLines.additions}</div>
              <div><strong>Deletions:</strong> {modifiedLines.deletions}</div>
              <div><strong>Modifications:</strong> {modifiedLines.modified}</div>
              <div><strong>Commit Streak:</strong> {streak}</div>
              <div><strong>Longest Streak:</strong> {longestStreak}</div>
              {features.includes("issues") && (
              <div><strong>Issues Assigned:</strong> {issuesAssigned}</div>)}
              {features.includes("issues") && (
              <div><strong>Issues Closed:</strong> {issuesClosed}</div>)}
              {features.includes("pull-requests") && (
              <div><strong>Pull requests Created:</strong> {pullRequestsCreated}</div>)}
              {features.includes("pull-requests") && (
              <div><strong>Pull requests merged:</strong> {pullRequestsMerged}</div>)}
            </div>
        </div>
      </div>

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

    {showHistorical && (
            <div className = "day-selector-wrapper-indv">
            <select className='day-selector-indv'
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
      <div className="grid-container">
        <div>
          <h2 className="section-title">
          Commits
          <span className="custom-tooltip">
            ⓘ
            <span className="tooltip-text">Percentage of commits made by the user relative to the total number of commits</span>
          </span>
          </h2>
          <GaugeChart
            user={selectedUser}
            percentage= {percentageCommits}
            totalPeople= {totalPeople}
          /> 
        </div>
        <div>
          <h2 className="section-title">
          Modified Lines
          <span className="custom-tooltip">
            ⓘ
            <span className="tooltip-text">Percentage of commits made by the user relative to the total number of commits</span>
          </span>
          </h2>
          <GaugeChart
            user={selectedUser}
            percentage= {percentageModifiedlLines}
            totalPeople= {totalPeople}
          /> 
        </div>
        {features.includes("issues") && (
        <div>
          <h2 className="section-title">
          Issues assigned
            <span className="custom-tooltip">
              ⓘ
              <span className="tooltip-text">Percentage of issues assigned to the user relative to the number of assigned issues</span>
            </span>
          </h2>
          <GaugeChart
                    user={selectedUser}
                    percentage= {percentageAssigned}
                    totalPeople= {totalPeople}
                  /> 
        </div>)}
        {features.includes("issues") && (
        <div>
          <h2 className="section-title">
            Issues closed
            <span className="custom-tooltip">
              ⓘ
              <span className="tooltip-text"> Percentage of issues closed by the user relative to the issues assigned to the user</span>
            </span>
          </h2>
          <GaugeChart
                    user={selectedUser}
                    percentage= {percentageIssuesClosed}
                    totalPeople= {1}
                  /> 
        </div>)}
        {features.includes("pull-requests") && (
        <div>
          <h2 className="section-title">
            Pull Requests created
            <span className="custom-tooltip">
              ⓘ
              <span className="tooltip-text">Percentage of pull requests created by the user relative to the total number of pull requests</span>
            </span>
          </h2>
          <GaugeChart
                    user={selectedUser}
                    percentage= {percentageCreated}
                    totalPeople= {totalPeople}
                  /> 
        </div>)}
        {features.includes("pull-requests") && (
        <div>
          <h2 className="section-title">
            Pull Requests merged
            <span className="custom-tooltip">
              ⓘ
              <span className="tooltip-text">Percentage of pull requests merged by the user relative to the total number of pull requests merged</span>
            </span>
          </h2>
          <GaugeChart
                    user={selectedUser}
                    percentage= {percentageMerged}
                    totalPeople= {totalPeople}
                  /> 
        </div>)}
      </div>
      </>)}
      {showHistorical && (
      <>
      {historicData ? (
        <>
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
          </div>
      </>) : (
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
            </div>)}
         </>
        )}
    </div>
  );
}

export default Individual;
