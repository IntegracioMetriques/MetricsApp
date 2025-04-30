import React from 'react';
import "../styles/index.css"; 
import PieChart from '../components/pieChart';
import RadarChart from '../components/radarChart';

function Index({data}) {

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
            data = {radarData}
            title = "General Metrics"
            max = {1}
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
    </div>
  );
}

export default Index;
