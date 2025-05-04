import React, { useState } from 'react';
import "../styles/individual.css";
import PieChart from '../components/pieChart';
import GaugeChart from '../components/gaugeChart';

function Individual({ data }) {
  const [selectedUser, setSelectedUser] = useState(Object.keys(data.commits).filter(user => user !== 'anonymous' && user !== 'total')[0]);

  const users = Object.keys(data.commits).filter(user => user !== 'anonymous' && user !== 'total');
  const avatar = data.avatars[selectedUser] || "";
  const commits = data.commits[selectedUser] || 0;
  const modifiedLines = data.modified_lines[selectedUser] || { additions: 0, deletions: 0, modified: 0 };
  const streak = data.commit_streak[selectedUser] || 0;
  const longestStreak = data.longest_commit_streak_per_user[selectedUser] || 0;
  const issuesAssigned = data.issues.assigned[selectedUser] || 0;
  const issuesClosed = data.issues.closed[selectedUser] || 0;
  const totalCommits = data.commits['total']
  const totalPeople = Object.keys(data.commits).length - 2;
  const truncateName = (name, maxLength = 18) => {
    return name.length > maxLength ? name.slice(0, maxLength) + '...' : name;
  };
  const userCommits = data.commits[selectedUser];
  const percentageCommits = totalCommits > 0 ? userCommits / totalCommits: 0;
  const totalAssignedIssues = data.issues.total - data.issues.assigned["non_assigned"]
  const percentageAssigned = totalAssignedIssues > 0 ? issuesAssigned / totalAssignedIssues: 0
  const percentageIssuesClosed = issuesAssigned > 0 ? issuesClosed/issuesAssigned: 0
  const percentageCreated = data.pull_requests.total > 0 ? data.pull_requests.created[selectedUser] / data.pull_requests.total: 0
  const percentageMerged = data.pull_requests.merged > 0 ? data.pull_requests.merged_per_member[selectedUser] / data.pull_requests.merged: 0
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
              <div><strong>Issues Assigned:</strong> {issuesAssigned}</div>
              <div><strong>Issues Closed:</strong> {issuesClosed}</div>
            </div>
        </div>
      </div>
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
        </div>
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
        </div>
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
        </div>
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
        </div>
      </div>
    </div>
  );
}

export default Individual;
