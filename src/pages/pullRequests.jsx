import React, { useState } from 'react';
import GaugeChart from '../components/gaugeChart';
import '../styles/commits.css';
import RadarPieToggle from '../components/radarPieToggle';
import LineChartMultiple from '../components/lineChartMultiple';
import usePersistentState  from '../components/usePersistentState';

function PullRequests({ data,historicData,features }) {
  const [showHistorical, setShowHistorical] = usePersistentState('showHistoricalPR', false);
  const [dateRange, setDateRange] = usePersistentState('dateRangePR', "7");
    const filterHistoricData = (data, days) => {
      if (days === "lifetime") return data;
  
      const today = new Date();
      const cutoff = new Date(today);
      cutoff.setDate(today.getDate() - parseInt(days));
      const cutoffDateString = cutoff.toISOString().split("T")[0];
      console.log(cutoffDateString)
      const filtered = {};
      for (const date in data) {
        if (date >= cutoffDateString) {
          filtered[date] = data[date];
        }
      }
  
      return filtered;
    };
  const filteredhistoricaData = historicData ? filterHistoricData(historicData, dateRange) : null;

  const pullRequests = data.pull_requests
  const createdby = pullRequests.created
  const mergedby = pullRequests.merged_per_member
  const totalMerged = pullRequests.merged 
  const totalMergedNotByAuthor = pullRequests.not_merged_by_author
  const totalClosed = pullRequests.closed 
  const total = pullRequests.total
  const totalPeople = Object.keys(createdby).length;
  const merges = data.commit_merges

  const transformCreatedPRsDataForLineChart = (data) => {
    const xDataCreated = [];
    const userSeries = {};
  
    for (const date in data) {
      xDataCreated.push(date);
      const created = data[date].pull_requests.created;
  
      for (const user in created) {
        if (!userSeries[user]) {
          userSeries[user] = [];
        }
        userSeries[user].push(created[user]);
      }
    }
    const seriesDataCreated = Object.keys(userSeries).map(user => ({
      name: user,
      data: userSeries[user]
    }));
  
    return { xDataCreated, seriesDataCreated };
  };

  const { xDataCreated, seriesDataCreated } = transformCreatedPRsDataForLineChart(filteredhistoricaData);

  const transformMergedPRsDataForLineChart = (data) => {
    const xDataMerged = [];
    const userSeries = {};
  
    for (const date in data) {
      xDataMerged.push(date);
      const merged = data[date].pull_requests.merged_per_member;
  
      for (const user in merged) {
        if (!userSeries[user]) {
          userSeries[user] = [];
        }
        userSeries[user].push(merged[user]);
      }
    }
    const seriesDataMerged = Object.keys(userSeries).map(user => ({
      name: user,
      data: userSeries[user]
    }));
  
    return { xDataMerged, seriesDataMerged };
  };

  const { xDataMerged, seriesDataMerged } = transformMergedPRsDataForLineChart(filteredhistoricaData);

  return (
    <div className="commits-container">
      <h1>Pull requests</h1>
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

        {showHistorical && (
        <div className = "day-selector-wrapper-comm">
        <select className='day-selector-comm'
          onChange={(e) => setDateRange(e.target.value)} 
          value={dateRange}
          style={{ marginLeft: '1rem' }}
        >
          <option value="7">Last 7 days</option>
          <option value="15">Last 15 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 3 months</option>
          <option value="lifetime">Lifetime</option>
        </select>
        </div>
      )}

    {!showHistorical && (
      <>
      <div className="section-background">
      <h2>Summary</h2>
      <div className="summary-charts-container">
        <div className='chart-item'>
        <RadarPieToggle
          radarData={createdby}
          pieData={Object.entries(createdby)}
          title={"Created Pull Requests distribution"}
        />
        </div>
        <div className='chart-item'>
        <RadarPieToggle
          radarData={mergedby}
          pieData={Object.entries(mergedby)}
          title={"Merged Pull Requests distribution"}
        />
        </div>
        </div>
        <div className="gauge-charts-container">
        <div>
        <h2 className="section-title">
        Pull requests merged
        <span className="custom-tooltip">
          ⓘ
          <span className="tooltip-text">Percentage of pull requests that are merged relative to the total number of pull requests that are not closed</span>
        </span>
      </h2>
        <GaugeChart
                user="Merged"
                percentage={(total - totalClosed) > 0 ? totalMerged / (total - totalClosed) : 0}
                totalPeople= {1}
              />
      </div> 
      <div> 
      <h2 className="section-title">
        Pull requests reviewed
        <span className="custom-tooltip">
          ⓘ
          <span className="tooltip-text">
           Percentage of pull requests merged by another user that is not the author relative to the total number of merged pull requests
          </span>
        </span>
      </h2>
            <GaugeChart
              user="Pull requests reviewed"
              percentage={totalMerged > 0 ? totalMergedNotByAuthor / totalMerged : 0}
              totalPeople={1}
            />
    </div>
    <div> 
      <h2 className="section-title">
        Merges from pull requests
        <span className="custom-tooltip">
          ⓘ
          <span className="tooltip-text">
          Percentage of merges that are from pull requests
          </span>
        </span>
      </h2>
            <GaugeChart
              user="Pull requests merges"
              percentage={merges > 0 ? totalMerged / merges : 0}
              totalPeople={1}
            />
    </div>
    </div> 
    </div>
    <div className='section-background'>
    <h2>Metrics by User</h2>
      <h2 className="section-title">
       Pull requests created per user
        <span className="custom-tooltip">
          ⓘ
          <span className="tooltip-text">Percentage of pull requests created per user relative to the total number of pull requets</span>
        </span>
      </h2>
      <div className="gauge-charts-container">
        {Object.keys(createdby).map((user) => {
          const userPRs = createdby[user];
          const percentage = total > 0 ? userPRs / total : 0;
          return (
          <GaugeChart
            key={`created-${user}`}
            user={user}
            percentage={percentage}
            totalPeople={totalPeople}
          />
          );
        })}
        </div>
        <h2 className="section-title">
       Pull requests merged per user
        <span className="custom-tooltip">
          ⓘ
          <span className="tooltip-text">Percentage of pull requests merged per user relative to the number of merged pull requets</span>
        </span>
      </h2>
      <div className="gauge-charts-container">
        {Object.keys(mergedby).map((user) => {
          const userMergedPRs = mergedby[user];
          const percentage = totalMerged > 0 ? userMergedPRs / totalMerged : 0;
          return (
            <GaugeChart
              key={`merged-${user}`}
              user={user}
              percentage={percentage}
              totalPeople={totalPeople}
            />
          );
        })}
        </div>
        </div>
        </>
      )}
      {showHistorical && (
        <>
        {historicData ? (
        <>
        <div className="section-background">
        <div className='radar-charts-wrapper'>
        <div className='radar-chart-container'>
        <LineChartMultiple
            xData={xDataCreated}
            seriesData={seriesDataCreated}
            xLabel="Data"
            yLabel="Pull requests"
            title="Created pull requests distribution over time"
          />
          </div>
          <div className='radar-chart-container'>
        <LineChartMultiple
            xData={xDataMerged}
            seriesData={seriesDataMerged}
            xLabel="Data"
            yLabel="Pull requests"
            title="Merged pull requests distribution over time"
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

export default PullRequests;
