import React from 'react';
import { truncateName } from '../domain/utils';

function IndividualStatsSection({
  selectedUser,
  setSelectedUser,
  users,
  avatar,
  commits,
  modifiedLines,
  streak,
  longestStreak,
  issuesAssigned,
  issuesClosed,
  pullRequestsCreated,
  pullRequestsMerged,
  tasksAssigned,
  tasksTodo,
  tasksInProgress,
  tasksClosed,
  tasksStandard,
  features
}) {
  return (<div className="grid-container">
        <div className="grid-item individual-user-card horizontal-layout">
          <div className="user-info">
            <img src={avatar} alt={selectedUser} className="user-avatar" />
            <select className="user-selector" value={selectedUser}  title={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
          {users.map(user => (
            <option key={user} value={user} title={user}>{truncateName(user)}</option>
          ))}
        </select>            
        </div>
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
              <div><strong>Pull Requests Created:</strong> {pullRequestsCreated}</div>)}
              {features.includes("pull-requests") && (
              <div><strong>Pull Requests merged:</strong> {pullRequestsMerged}</div>)}
              {features.includes("projects") && (
              <div><strong>Tasks assigned:</strong> {tasksAssigned}</div>)}
                {features.includes("projects") && (
              <div><strong>Tasks ToDo:</strong> {tasksTodo}</div>)}
              {features.includes("projects") && (
              <div><strong>Tasks In Progress:</strong> {tasksInProgress}</div>)}
              {features.includes("projects") && (
              <div><strong>Tasks Done:</strong> {tasksClosed}</div>)}
              {features.includes("projects") && (
              <div><strong>Tasks with a standard status:</strong> {tasksStandard}</div>)}
            </div>
        </div>
      </div>  
    );
}

export default IndividualStatsSection;
