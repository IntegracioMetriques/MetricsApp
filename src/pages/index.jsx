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
  const colorsPR = ["#7f00ff", "#00FF00","#FF0000"]; 
  const colorsIssues = ["#00FF00","#FF0000"];

  return (
    <div>
      <h1>General overview</h1>
      <div className="grid-container">
        <div className="grid-item">
          <PieChart 
            id = "PR state"
            title="Pull requests state summary" 
            data={datapullRequests} 
            colors={colorsPR} 
          />
        </div>
        <div className="grid-item">
          <PieChart 
            id = "issue state"
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
