import React from 'react';
import GaugeChart from '../components/gaugeChart';
import '../styles/commits.css';
import RadarPieToggle from '../components/RadarPieToggle';

function Commits({ data }) {
  const commitsData = data.commits;
  const totalCommits = commitsData.total;
  const modifiedLinesData = data.modified_lines
  const radarChartModifiedLines = {};

  for (const [user, {modified}] of Object.entries(modifiedLinesData)) {
    radarChartModifiedLines[user] = modified;
  }
  const totalModifiedLines = modifiedLinesData.total.modified
  const totalPeople = Object.keys(commitsData).length - 2;
  const dataPieChartCommits = Object.entries(commitsData)
  .filter(([user]) => user !== 'total' && user !== 'anonymous')
  .map(([user, count]) => [user, count]);
  const dataPieChartModifiedLines = Object.entries(modifiedLinesData)
  .filter(([user]) => user !== 'total')
  .map(([user, { modified }]) => [user, modified]);
  return (
    <div className="commits-container">
      <h1>Commits</h1>
      <div className="section-background">
        <h2>Summary</h2>
        <div className="summary-charts-container">
          <div className='chart-item'>
            <RadarPieToggle
              radarData={commitsData}
              pieData={dataPieChartCommits}
              title={"Commits Distribution"}
            />
            </div>
            <div className='chart-item'>
            <RadarPieToggle
              radarData={radarChartModifiedLines}
              pieData={dataPieChartModifiedLines}
              title={"Modified lines distribution"}
            />
            </div>
          <div>
          <h2 className="section-title">
            Non-anonymous commits
            <span className="custom-tooltip">
              ⓘ
              <span className="tooltip-text">Percentage of commits that have a member of the project as its author</span>
            </span>
            </h2>
            <GaugeChart
                    key="non-anonymous"
                    user="non-anonymous"
                    percentage= {totalCommits > 0 ? (totalCommits - commitsData.anonymous) / totalCommits : 0}
                    totalPeople= {1}
                  />
            </div>
        </div>
      </div>
      <div className="section-background">
        <h2>Metrics by User</h2>
        <h2 className="section-title">
          Commits per user
          <span className="custom-tooltip">
            ⓘ
            <span className="tooltip-text">Percentage of commits per user relative to the total number of commits</span>
          </span>
        </h2>
        <div className="gauge-charts-container">
          {Object.keys(commitsData).map((user) => {
            if (user !== 'total' && user !== 'anonymous') {
              const userCommits = commitsData[user];
              const percentage = (totalCommits - commitsData.anonymous) > 0 ? userCommits / (totalCommits - commitsData.anonymous) : 0;
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
          Modified lines per user
          <span className="custom-tooltip">
            ⓘ
            <span className="tooltip-text">Percentage of modified lines per user relative to the total number of modified lines</span>
          </span>
        </h2>
        <div className="gauge-charts-container">
          {Object.keys(modifiedLinesData).map((user) => {
            if (user !== 'total') {
              const userModified = modifiedLinesData[user].modified;
              const percentage = totalModifiedLines > 0 ? userModified / totalModifiedLines : 0;
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
      </div>
    </div>
  );
}

export default Commits;
