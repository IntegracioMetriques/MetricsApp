import React, { useState } from 'react';
import "../styles/individual.css";
import LineChart from '../components/lineChart.jsx';
import GaugeChart from '../components/gaugeChart.jsx';
import usePersistentStateSession  from '../components/usePersistentStateSession.jsx';
import usePersistentState  from '../components/usePersistentState.jsx';
import HistoricalToggle from '../components/historicalToggle.jsx';
import DateRangeSelector from '../components/dateRangeSelector.jsx';
import IndividualStatsSection from '../summarySections/individualStatisticsSection.jsx';
import IndividualMetricsSection from '../metricsSections/individualMetricsSection.jsx';
import IndividualHistoricSection from '../historicalSections/individualHistoricalSection.jsx';

import {
  transformCommitsDataForUser,
  getGaugeChartDataCommits,
  getGaugeChartDataModifiedLines,
  transformModifiedLinesDataForUser
} from '../domain/commits.jsx'
import {
  getGaugeDataAssignedIssuesPerUser,
  getGaugeDataClosedIssuesPerUser,
  transformAssignedIssuesDataForUser,
  transformClosedIssuesDataForUser
} from '../domain/issues.jsx'
import {
  getGaugeDataCreatedPRsPerUser,
  getGaugeDataMergedPRsPerUser,
  transformCreatedPRsDataForUser,
  transformMergedPRsDataForUser
} from '../domain/pullRequests.jsx'
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
} from '../domain/projects.jsx'
import { 
  filterHistoricData, 
  truncateName } 
from '../domain/utils.jsx';
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
        <IndividualStatsSection
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          users={users}
          avatar={avatar}
          commits={commits}
          modifiedLines={modifiedLines}
          streak={streak}
          longestStreak={longestStreak}
          issuesAssigned={issuesAssigned}
          issuesClosed={issuesClosed}
          pullRequestsCreated={pullRequestsCreated}
          pullRequestsMerged={pullRequestsMerged}
          tasksAssigned={tasksAssigned}
          tasksTodo={tasksTodo}
          tasksInProgress={tasksInProgress}
          tasksClosed={tasksClosed}
          tasksStandard={tasksStandard}
          features={features}
        />

      <HistoricalToggle
        showHistorical={showHistorical}
        setShowHistorical={setShowHistorical}
      />

      <DateRangeSelector
        showHistorical={showHistorical}
        dateRange={dateRange}
        setDateRange={setDateRange}
      />

    {!showHistorical && (
        <IndividualMetricsSection
          selectedUser={selectedUser}
          totalPeople={totalPeople}
          percentageCommits={percentageCommits}
          percentageModifiedlLines={percentageModifiedlLines}
          percentageAssigned={percentageAssigned}
          percentageIssuesClosed={percentageIssuesClosed}
          percentageCreated={percentageCreated}
          percentageMerged={percentageMerged}
          percentageTasksAssigned={percentageTasksAssigned}
          percentageTasksInProgress={percentageTasksInProgress}
          percentageTasksDone={percentageTasksDone}
          percentageTasksStandard={percentageTasksStandard}
          features={features}
        />
      )}
      {showHistorical && (
        <IndividualHistoricSection
          historicData={historicData}
          features={features}
          xDataCommits={xDataCommits}
          yDataCommits={yDataCommits}
          xDataModifiedLines={xDataModifiedLines}
          yDataModifiedLines={yDataModifiedLines}
          xDataAssignedIssues={xDataAssignedIssues}
          yDataAssignedIssues={yDataAssignedIssues}
          xDataClosedIssues={xDataClosedIssues}
          yDataClosedIssues={yDataClosedIssues}
          xDataCreatedPRs={xDataCreatedPRs}
          yDataCreatedPRs={yDataCreatedPRs}
          xDataMergedPRs={xDataMergedPRs}
          yDataMergedPRs={yDataMergedPRs}
          xDataTasksAssigned={xDataTasksAssigned}
          yDataTasksAssigned={yDataTasksAssigned}
          xDataTasksToDo={xDataTasksToDo}
          yDataTasksToDo={yDataTasksToDo}
          xDataTasksInProgress={xDataTasksInProgress}
          yDataTasksInProgress={yDataTasksInProgress}
          xDataTasksDone={xDataTasksDone}
          yDataTasksDone={yDataTasksDone}
          xDataTasksStandard={xDataTasksStandard}
          yDataTasksStandard={yDataTasksStandard}
        />
      )}
    </div>
  );
}

export default Individual;
