import React from 'react';
import GaugeChart from '../components/gauge';
import '../styles/commits.css';

function Commits({ data }) {
  const issuesData = data.issues;
  const totalIssues = issuesData.total;
  const totalPeople = Object.keys(issuesData.assigned).length - 1;
  const totalAssigned = totalIssues - issuesData.assigned['non_assigned']
  return (
    <div className="commits-container">
      <h1>Issues</h1>
      <div className="gauge-charts-container">
        {Object.keys(issuesData.assigned).map((user) => {
          if (user !== 'non_assigned') {
            const userCommits = issuesData.assigned[user];
            const percentage = userCommits / totalAssigned;
            return (
              <GaugeChart
                key={user}
                user={user}
                percentage={percentage}
                totalPeople={totalPeople}
              />
            );
          }
          return null;
        })}
        <GaugeChart
                key="assigned"
                user="assigned"
                percentage= {(totalAssigned) / totalIssues}
                totalPeople= {1}
              />
      </div>
    </div>
  );
}

export default Commits;
