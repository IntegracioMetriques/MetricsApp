import React, { useState } from 'react';
import "../styles/individual.css";
import PieChart from '../components/pieChart';
import GaugeChart from '../components/gaugeChart';

function Individual({ data }) {
  const [selectedUser, setSelectedUser] = useState(Object.keys(data.commits).filter(user => user !== 'anonymous' && user !== 'total')[0]);

  const pullRequests = data.pull_requests;
  const open = pullRequests.total - pullRequests.merged - pullRequests.closed;

  const datapullRequests = [
    ["Merged", pullRequests.merged],
    ["Open", open],
    ["Closed", pullRequests.closed],
  ];
  const dataissues = [
    ["Open", data.issues.total - data.issues.total_closed],
    ["Closed", data.issues.total_closed]
  ];
  const colorsPR = ["green", "red", "orange"];
  const colorsIssues = ["red", "green"];

  const users = Object.keys(data.commits).filter(user => user !== 'anonymous' && user !== 'total');
  const avatar = data.avatars[selectedUser] || "";
  const commits = data.commits[selectedUser] || 0;
  const modifiedLines = data.modified_lines[selectedUser] || { additions: 0, deletions: 0, modified: 0 };
  const streak = data.commit_streak[selectedUser] || 0;
  const longestStreak = data.longest_commit_streak_per_user[selectedUser] || 0;
  const issuesAssigned = data.issues.assigned[selectedUser] || 0;
  const issuesClosed = data.issues.closed[selectedUser] || 0;
  const truncateName = (name, maxLength = 15) => {
    return name.length > maxLength ? name.slice(0, maxLength) + '...' : name;
  };
  return (
    <div>
      <h1>Individual overview</h1>
      <div className="individual-header">
        <select className="user-selector" value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
          {users.map(user => (
            <option key={user} value={user} title={user}>{truncateName(user)}</option>
          ))}
        </select>
      </div>

      <div className="grid-container">
        <div className="grid-item individual-user-card horizontal-layout">
          <div className="user-info">
            <img src={avatar} alt={selectedUser} className="user-avatar" />
            <h2 className="user-name" title={selectedUser}>{truncateName(selectedUser)}</h2>
            </div>
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
    </div>
  );
}

export default Individual;
