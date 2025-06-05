import React, { useState } from 'react';
import GaugeChart from '../components/gaugeChart';
import '../styles/commits.css';
import RadarPieToggle from '../components/radarPieToggle';
import LineChartMultiple from '../components/lineChartMultiple';
import usePersistentStateSession  from '../components/usePersistentStateSession';
import {
  transformCreatedPRsDataForLineChart,
  transformMergedPRsDataForLineChart,
  getRadarAndPieDataForCreatedPRs,
  getRadarAndPieDataForMergedPRs,
  getGaugeChartDataMergedPRs,
  getGaugeChartDataReviewedPRs,
  getGaugeChartDataMergesPRs,
  getGaugeDataCreatedPRsPerUser,
  getGaugeDataMergedPRsPerUser
} from '../domain/pullRequests'
import { filterHistoricData } from '../domain/utils';

function PullRequests({ data,historicData,features }) {
  const [showHistorical, setShowHistorical] = usePersistentStateSession('showHistoricalPR', false);
  const [dateRange, setDateRange] = usePersistentStateSession('dateRangePR', "7");
  const filteredhistoricaData = historicData ? filterHistoricData(historicData, dateRange) : null;

  const pullRequests = data.pull_requests
  const createdby = pullRequests.created
  const mergedby = pullRequests.merged_per_member
  const totalPeople = Object.keys(data.avatars).length;
  const total = data.pull_requests.total
  const totalMerged =  data.pull_requests.merged 

  const { xDataCreated, seriesDataCreated } = transformCreatedPRsDataForLineChart(filteredhistoricaData);

  const { xDataMerged, seriesDataMerged } = transformMergedPRsDataForLineChart(filteredhistoricaData);

  const {radarDataCreated,pieDataCreated} = getRadarAndPieDataForCreatedPRs(data);

  const {radarDataMerged,pieDataMerged} = getRadarAndPieDataForMergedPRs(data);

  const percentageMerged = getGaugeChartDataMergedPRs(data);
  const percentatgeReviewed = getGaugeChartDataReviewedPRs(data);
  const percentageMergesPR = getGaugeChartDataMergesPRs(data);

  const gaugeDataCreatedPRs = getGaugeDataCreatedPRsPerUser(data)
  const gaugeDataMergedPRs = getGaugeDataMergedPRsPerUser(data)
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
          radarData={radarDataCreated}
          pieData={pieDataCreated}
          title={"Created Pull Requests distribution"}
        />
        </div>
        <div className='chart-item'>
        <RadarPieToggle
          radarData={radarDataMerged}
          pieData={pieDataMerged}
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
                percentage={percentageMerged}
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
              percentage={percentatgeReviewed}
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
              percentage={percentageMergesPR}
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
          {gaugeDataCreatedPRs.map(({ user, percentage }) => (
            <GaugeChart
              key={`created-PR-${user}`}
              user={user}
              percentage={percentage}
              totalPeople={totalPeople}
            />
          ))}
        </div>
        <h2 className="section-title">
       Pull requests merged per user
        <span className="custom-tooltip">
          ⓘ
          <span className="tooltip-text">Percentage of pull requests merged per user relative to the number of merged pull requets</span>
        </span>
      </h2>
      <div className="gauge-charts-container">
          {gaugeDataMergedPRs.map(({ user, percentage }) => (
            <GaugeChart
              key={`merged-PR-${user}`}
              user={user}
              percentage={percentage}
              totalPeople={totalPeople}
            />
          ))}
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
