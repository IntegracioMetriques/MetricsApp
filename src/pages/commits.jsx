import React, { useState } from 'react';
import GaugeChart from '../components/gaugeChart';
import '../styles/commits.css';
import RadarPieToggle from '../components/RadarPieToggle';
import LineChartMultiple from '../components/lineChartMultiple';

function Commits({ data, historicData, features}) {
  const commitsData = data.commits;
  const totalCommits = commitsData.total;
  const modifiedLinesData = data.modified_lines
  const radarChartModifiedLines = {};
  const [showHistorical, setShowHistorical] = useState(false);

  const transformCommitsDataForLineChart = (data) => {
    const xDataCommits = [];
    const userSeries = {};
  
    for (const date in data) {
      xDataCommits.push(date);
      const commits = data[date].commits;
  
      for (const user in commits) {
        if (user === 'total') continue;
        if(user === 'anonymous') continue;
        if (!userSeries[user]) {
          userSeries[user] = [];
        }
        userSeries[user].push(commits[user]);
      }
    }
    const seriesDataCommits = Object.keys(userSeries).map(user => ({
      name: user,
      data: userSeries[user]
    }));
  
    return { xDataCommits, seriesDataCommits };
  };

  const { xDataCommits, seriesDataCommits } = transformCommitsDataForLineChart(historicData);

  const transformModifiedLinesDataForLineChart = (data) => {
    const xDataModified = [];
    const userSeries = {};
  
    for (const date in data) {
      xDataModified.push(date);
      const modifiedLines = data[date].modified_lines;
  
      for (const user in modifiedLines) {
        if (user === 'total') continue;
        if (!userSeries[user]) {
          userSeries[user] = [];
        }
        userSeries[user].push(modifiedLines[user].modified);
      }
    }
    const seriesModified = Object.keys(userSeries).map(user => ({
      name: user,
      data: userSeries[user]
    }));
  
    return { xDataModified, seriesModified };
  };

  const { xDataModified, seriesModified } = transformModifiedLinesDataForLineChart(historicData);

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
      <div className="chart-toggle-wrapper-index">
      <div className="chart-toggle-buttons">
        <button 
          onClick={() => setShowHistorical(false)}
          className={!showHistorical ? 'selected' : ''}
        >
          Current
        </button>
        <button 
          onClick={() => setShowHistorical(true)}
          className={showHistorical ? 'selected' : ''}
        >
          Historical
        </button>
      </div>
    </div>

    {!showHistorical && (
      <>
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
      </>)}
      {showHistorical && (
        <>
        {historicData ? (
        <>
        <div className="section-background">
        <div className='radar-charts-wrapper'>
        <div className='radar-chart-container'>
        <LineChartMultiple
            xData={xDataCommits}
            seriesData={seriesDataCommits}
            xLabel="Data"
            yLabel="Commits"
            title="Commits distribution over time"
          />
          </div>
          <div className='radar-chart-container'>
        <LineChartMultiple
            xData={xDataModified}
            seriesData={seriesModified}
            xLabel="Data"
            yLabel="Modified Lines"
            title="Modified lines distribution over time"
          />
          </div>
          </div>
          </div>

        </>)  : (
            <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            fontSize: "1.8rem",
            }}>
            No s'ha trobat historic_metrics.json.<br />
            Si és el primer dia, torna demà un cop
            s'hagi fet la primera execució del
            workflow Daily Metrics.
            </div>)}
         </>
        )}




    </div>
  );
}

export default Commits;
