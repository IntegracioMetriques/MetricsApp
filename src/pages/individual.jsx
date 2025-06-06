import React, { useState } from 'react';
import "../styles/individual.css";
import LineChart from '../components/lineChart';
import GaugeChart from '../components/gaugeChart';
import usePersistentStateSession  from '../components/usePersistentStateSession';
import usePersistentState  from '../components/usePersistentState';
import {
  transformCommitsDataForUser,
  getGaugeChartDataCommits,
  getGaugeChartDataModifiedLines,
  transformModifiedLinesDataForUser
} from '../domain/commits'
import {
  getGaugeDataAssignedIssuesPerUser,
  getGaugeDataClosedIssuesPerUser,
  transformAssignedIssuesDataForUser,
  transformClosedIssuesDataForUser
} from '../domain/issues'
import {
  getGaugeDataCreatedPRsPerUser,
  getGaugeDataMergedPRsPerUser,
  transformCreatedPRsDataForUser,
  transformMergedPRsDataForUser
} from '../domain/pullRequests'
import {
  getGaugeDataAssignedTasksPerUser,
  getGaugeDataInProgressTasksPerUser,
  getGaugeDataDoneTasksPerUser,
  getGaugeDataStandardStatusTasksPerUser,
  transformTasksAssignedDataForUser,
  transformTasksToDoDataForUser,
  transformTasksInProgressDataForUser,
  transformTasksDoneDataForUser,
  transformTasksStandardDataForUser,
} from '../domain/projects'
import { 
  filterHistoricData, 
  truncateName } 
from '../domain/utils';
function Individual({ data, historicData, features }) {
  const [selectedUser, setSelectedUser] = usePersistentState("selectedUser",Object.keys(data.avatars)[0]);
  const [showHistorical, setShowHistorical] = usePersistentStateSession('showHistoricalIndividual', false);
  const [dateRange, setDateRange] = usePersistentStateSession('dateRangeIndividual', "7");

  //Statistics
  const filteredhistoricaData = historicData ? filterHistoricData(historicData, dateRange) : null;
  const users = Object.keys(data.avatars);
  const avatar = data.avatars[selectedUser] || "";
  const commits = data.commits[selectedUser] || 0;
  const modifiedLines = data.modified_lines[selectedUser] || { additions: 0, deletions: 0, modified: 0 };
  const streak = data.commit_streak[selectedUser] || 0;
  const longestStreak = data.longest_commit_streak_per_user[selectedUser] || 0;
  const issuesAssigned = data.issues.assigned[selectedUser] || 0;
  const issuesClosed = data.issues.closed[selectedUser] || 0;
  const pullRequestsCreated = data.pull_requests.created[selectedUser]
  const pullRequestsMerged = data.pull_requests.merged_per_member[selectedUser]
  const totalPeople = Object.keys(data.avatars).length;
  const tasksAssigned = data.project.metrics_by_iteration.total.assigned_per_member[selectedUser] || 0
  const tasksClosed = data.project.metrics_by_iteration.total.done_per_member[selectedUser] || 0
  const tasksInProgress = data.project.metrics_by_iteration.total.in_progress_per_member[selectedUser] || 0
  const tasksTodo = data.project.metrics_by_iteration.total.todo_per_member[selectedUser] || 0
  const tasksStandard = tasksClosed + tasksInProgress + tasksTodo

  //Gauges
  const usersCommits = getGaugeChartDataCommits(data)
  const percentageCommits = usersCommits.find(userObj => userObj.user === selectedUser).percentage;
  const usersModifiedLines = getGaugeChartDataModifiedLines(data)
  const percentageModifiedlLines = usersModifiedLines.find(userObj => userObj.user === selectedUser).percentage;

  const usersAssignedIssues = getGaugeDataAssignedIssuesPerUser(data)
  const percentageAssigned = usersAssignedIssues.find(userObj => userObj.user === selectedUser).percentage;
  const usersClosedIssues = getGaugeDataClosedIssuesPerUser(data)
  const percentageIssuesClosed = usersClosedIssues.find(userObj => userObj.user === selectedUser).percentage;

  const usersCreatedPRs = getGaugeDataCreatedPRsPerUser(data)
  const percentageCreated = usersCreatedPRs.find(userObj => userObj.user === selectedUser).percentage;
  const usersMergedPRs = getGaugeDataMergedPRsPerUser(data)
  const percentageMerged = usersMergedPRs.find(userObj => userObj.user === selectedUser).percentage;
  
  const usersTasksAssigned = getGaugeDataAssignedTasksPerUser(data,"total");
  const percentageTasksAssigned = usersTasksAssigned.find(userObj => userObj.user === selectedUser).percentage;
  const usersTasksInProgress = getGaugeDataInProgressTasksPerUser(data,"total");
  const percentageTasksInProgress = usersTasksInProgress.find(userObj => userObj.user === selectedUser).percentage;
  const usersTasksDone = getGaugeDataDoneTasksPerUser(data,"total");
  const percentageTasksDone = usersTasksDone.find(userObj => userObj.user === selectedUser).percentage;
  const usersTasksStandard = getGaugeDataStandardStatusTasksPerUser(data,"total");
  const percentageTasksStandard = usersTasksStandard.find(userObj => userObj.user === selectedUser).percentage;

  //Historic
  const { xDataCommits, yDataCommits } = transformCommitsDataForUser(filteredhistoricaData, selectedUser)

  const { xDataModifiedLines, yDataModifiedLines } = transformModifiedLinesDataForUser(filteredhistoricaData, selectedUser)

  const { xDataAssignedIssues, yDataAssignedIssues } = transformAssignedIssuesDataForUser(filteredhistoricaData, selectedUser);

  const { xDataClosedIssues, yDataClosedIssues } = transformClosedIssuesDataForUser(filteredhistoricaData, selectedUser);

  const { xDataCreatedPRs, yDataCreatedPRs } = transformCreatedPRsDataForUser(filteredhistoricaData, selectedUser);

  const { xDataMergedPRs, yDataMergedPRs } = transformMergedPRsDataForUser(filteredhistoricaData, selectedUser);

  const { xDataTasksAssigned, yDataTasksAssigned } = transformTasksAssignedDataForUser(filteredhistoricaData, selectedUser);
  
  const { xDataTasksToDo, yDataTasksToDo } = transformTasksToDoDataForUser(filteredhistoricaData, selectedUser);
  
  const { xDataTasksInProgress, yDataTasksInProgress } = transformTasksInProgressDataForUser(filteredhistoricaData, selectedUser);

  const { xDataTasksDone, yDataTasksDone } = transformTasksDoneDataForUser(filteredhistoricaData, selectedUser);
  
  const { xDataTasksStandard, yDataTasksStandard } = transformTasksStandardDataForUser(filteredhistoricaData, selectedUser);

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
              {features.includes("projects") && (
              <div><strong>Tasks assigned:</strong> {tasksAssigned}</div>)}
                {features.includes("projects") && (
              <div><strong>Tasks todo:</strong> {tasksTodo}</div>)}
              {features.includes("projects") && (
              <div><strong>Tasks in progress:</strong> {tasksInProgress}</div>)}
              {features.includes("projects") && (
              <div><strong>Tasks done:</strong> {tasksClosed}</div>)}
              {features.includes("projects") && (
              <div><strong>Tasks with Standard Status:</strong> {tasksStandard}</div>)}
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
        {features.includes("projects") && (
        <div>
          <h2 className="section-title">
            Tasks assigned
            <span className="custom-tooltip">
              ⓘ
              <span className="tooltip-text">Percentage of tasks assigned to the user relative to the number of assigned tasks</span>
            </span>
          </h2>
          <GaugeChart
                    user={selectedUser}
                    percentage= {percentageTasksAssigned}
                    totalPeople= {totalPeople}
                  /> 
        </div>)}
        {features.includes("projects") && (
        <div>
          <h2 className="section-title">
            Tasks In Progress
            <span className="custom-tooltip">
              ⓘ
              <span className="tooltip-text">
                Shows if the user is actively working on at least one task.
                If the gauge is at 100%, the user has at least one task in progress.
                If it's at 0%, the user currently has no tasks in progress.          
              </span>
            </span>
          </h2>
          <GaugeChart
                    user={selectedUser}
                    percentage= {percentageTasksInProgress}
                    totalPeople= {1}
                  /> 
        </div>)}
        {features.includes("projects") && (
        <div>
          <h2 className="section-title">
            Tasks Done
            <span className="custom-tooltip">
              ⓘ
              <span className="tooltip-text">Percentage of tasks done by the user relative to the tasks assigned to the user</span>
            </span>
          </h2>
          <GaugeChart
                    user={selectedUser}
                    percentage= {percentageTasksDone}
                    totalPeople= {1}
                  /> 
        </div>)}
        {features.includes("projects") && (
        <div>
          <h2 className="section-title">
          Tasks with Standard Status
            <span className="custom-tooltip">
              ⓘ
              <span className="tooltip-text">Percentage of tasks with standard status (ToDo, In Progress, Done) of the user relative to the user assigned tasks</span>
            </span>
          </h2>
          <GaugeChart
                    user={selectedUser}
                    percentage= {percentageTasksStandard}
                    totalPeople= {1}
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
