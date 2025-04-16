import React from 'react';
import "../styles/index.css"; 
import PieChart from '../components/pieChart';

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

  return (
    <div>
      <h1>General overview</h1>
      <div className="grid-container">
        <div className="grid-item general-stats">
            <h2>Project Stats</h2>
            <ul>
            <li><strong>Total Members:</strong> {Object.keys(data.commits).filter(user => user !== 'anonymous' && user !== 'total').length}</li>
            <li><strong>Total Commits:</strong> {data.commits.total}</li>
            <li><strong>Total Issues:</strong> {data.issues.total}</li>
            <li><strong>Total Pull Requests:</strong> {data.pull_requests.total}</li>
            <li><strong>Total Additions:</strong> {data.modified_lines.total.additions}</li>
            <li><strong>Total Deletions:</strong> {data.modified_lines.total.deletions}</li>
            <li><strong>Total Modifications:</strong> {data.modified_lines.total.modified}</li>
            <li><strong>Total Lines of code:</strong> {data.modified_lines.total.additions - data.modified_lines.total.deletions}</li>
            </ul>
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
