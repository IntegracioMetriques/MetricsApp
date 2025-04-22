import React from 'react';
import GaugeChart from '../components/gaugeChart';
import RadarChart from '../components/radarChart';
import PieChart from '../components/pieChart'
import '../styles/commits.css';

function Commits({ data }) {
  const commitsData = data.commits;
  const totalCommits = commitsData.total;
  const totalPeople = Object.keys(commitsData).length - 2;
  const dataPieChart = Object.entries(commitsData)
  .filter(([user]) => user !== 'total' && user !== 'anonymous')
  .map(([user, count]) => [user, count]);
  return (
    <div className="commits-container">
      <h1>Commits</h1>
      <h2 className="section-title">
        User commits
        <span className="custom-tooltip">
          ⓘ
          <span className="tooltip-text">Percentage of commits per user relative to the total number of commits</span>
        </span>
      </h2>
      <div className="gauge-charts-container">
        {Object.keys(commitsData).map((user) => {
          if (user !== 'total' && user !== 'anonymous') {
            const userCommits = commitsData[user];
            const percentage = userCommits / totalCommits;
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
      <div className="radar-charts-wrapper">
        <div className="radar-chart-container">
          <RadarChart
            data={commitsData}
            title="Commits distribution"
          />
        </div>
        <div className="radar-chart-container">
          <PieChart
            title= "Commits distribution"
            data={dataPieChart}
            colors = {null}
          />
        </div>
      </div>
      <h2 className="section-title">
        Non-anonymous commits
        <span className="custom-tooltip">
          ⓘ
          <span className="tooltip-text">Percentage of commits that have a member of the project as its author</span>
        </span>
        </h2>
        <div className="gauge-charts-container">
        <GaugeChart
                key="non-anonymous"
                user="non-anonymous"
                percentage= {(totalCommits-commitsData.anonymous) / totalCommits}
                totalPeople= {1}
              />
      </div>
    </div>
  );
}

export default Commits;
