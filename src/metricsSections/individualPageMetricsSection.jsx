// UserGaugeSection.jsx
import React from 'react';
import GaugeChart from '../components/gaugeChart.jsx';

function IndividualMetricsSection({
  selectedUser,
  totalPeople,
  percentageCommits,
  percentageModifiedlLines,
  percentageAssigned,
  percentageIssuesClosed,
  percentageCreated,
  percentageMerged,
  percentageTasksAssigned,
  percentageTasksInProgress,
  percentageTasksDone,
  percentageTasksStandard,
  features
}) {
  return (<div className="grid-container">
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
          Tasks with standard status
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
  );
}

export default IndividualMetricsSection;