import React from 'react';

function IndexStatsSection({ data, features }) {
  return (
    <div className="grid-container">
      <div className="grid-item general-stats horizontal-layout">
        <div className='stats-title '>
          <h2>Project Statistics</h2>
        </div>
        <div className="general-stats-grid">
          <div><strong>Total Members:</strong> {Object.keys(data.avatars).length}</div>
          <div><strong>Total Commits:</strong> {data.commits.total}</div>
          <div><strong>Total Additions:</strong> {data.modified_lines.total.additions}</div>
          <div><strong>Total Deletions:</strong> {data.modified_lines.total.deletions}</div>
          <div><strong>Total Modifications:</strong> {data.modified_lines.total.modified}</div>
          <div><strong>Total Lines of code:</strong> {data.modified_lines.total.additions - data.modified_lines.total.deletions}</div>
          {features.includes("issues") && (
            <div><strong>Total Issues:</strong> {data.issues.total}</div>
          )}
          {features.includes("pull-requests") && (
            <div><strong>Total Pull Requests:</strong> {data.pull_requests.total}</div>
          )}
          {features.includes("projects") && (
            <>
              <div><strong>Total Tasks:</strong> {data.project.metrics_by_iteration.total.total_tasks}</div>
              <div><strong>Total Features:</strong> {data.project.metrics_by_iteration.total.total_features}</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default IndexStatsSection;
