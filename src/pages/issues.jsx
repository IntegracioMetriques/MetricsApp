import React from 'react';
import GaugeChart from '../components/gaugeChart';
import RadarPieToggle from '../components/RadarPieToggle';
import '../styles/commits.css';

function Issues({ data }) {
  const issuesData = data.issues;
  const totalIssues = issuesData.total;
  const totalClosed = issuesData.total_closed
  const havePullRequest = issuesData.have_pull_request
  const { non_assigned, ...filteredData } = issuesData.assigned;
  const totalPeople = Object.keys(issuesData.assigned).length - 1;
  const totalAssigned = totalIssues - issuesData.assigned['non_assigned']
  const closedBy = issuesData.closed
  console.log(issuesData.assigned);
  return (
    <div className="commits-container">
      <h1>Issues</h1>
      <div className='section-background'>
      <h2>Summary</h2>
      <div className="summary-charts-container">
        <div className='chart-item'>
          <RadarPieToggle
              radarData={filteredData}
              pieData={Object.entries(filteredData)}
              title={"Assigned Issues distribution"}
            />
        </div>
        <div>
          <h2 className="section-title">
            Issues assigned
              <span className="custom-tooltip">
                ⓘ
                <span className="tooltip-text">Percentage of Issues that are assigned to a user relative to the total number of Issues</span>
              </span>
            </h2>
              <GaugeChart
                key="assigned"
                user="assigned"
                percentage={totalIssues > 0 ? totalAssigned / totalIssues : 0}
                totalPeople= {1}
              />
        </div>
        <div>
          <h2 className="section-title">
              Issues closed with Pull Request
              <span className="custom-tooltip">
                ⓘ
                <span className="tooltip-text">
                Percentage of closed Issues that have a Pull Request associated
                </span>
              </span>
            </h2>
          <GaugeChart
            key="HavePr"
            user="Have Pull Request"
            percentage={totalClosed > 0 ? havePullRequest / totalClosed : 0}
            totalPeople= {1}
            />    
        </div>
      </div>
      </div>
      <div className='section-background'>
      <h2>Metrics by User</h2>
      <h2 className="section-title">
        Issues assigned per user
          <span className="custom-tooltip">
            ⓘ
            <span className="tooltip-text">Percentage of issues assigned per user relative to the number of assigned issues</span>
          </span>
        </h2>
      <div className="gauge-charts-container">
        {Object.keys(issuesData.assigned).map((user) => {
          if (user !== 'non_assigned') {
            const userIssues = issuesData.assigned[user];
            const percentage = totalAssigned > 0 ? userIssues / totalAssigned : 0;
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
      </div>
      <h2 className="section-title">
        Issues closed per user
        <span className="custom-tooltip">
          ⓘ
          <span className="tooltip-text">
          Percentage of issues closed per user relative to the issues assigned to that user
          </span>
        </span>
      </h2>
      <div className="gauge-charts-container">
        {Object.keys(closedBy).map((user) => {
          const closedCount = closedBy[user];
          const assigned = issuesData.assigned[user];
          const percentage = assigned > 0 ? closedCount / assigned : 0;
          return (
            <GaugeChart
              key={`closed-${user}`}
              user={user}
              percentage={percentage}
              totalPeople={1}
            />
          );
        })}
      </div>
    </div>
    </div>
  );
}

export default Issues;
