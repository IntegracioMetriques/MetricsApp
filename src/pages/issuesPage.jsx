import React, { useState } from 'react';
import GaugeChart from '../components/gaugeChart';
import RadarPieToggle from '../components/radarPieToggle';
import LineChartMultiple from '../components/lineChartMultiple';
import usePersistentStateSession  from '../components/usePersistentStateSession';
import HistoricalToggle from '../components/historicalToggle.jsx';
import DateRangeSelector from '../components/dateRangeSelector.jsx';
import {
  transformAssignedIssuesDataForLineChart,
  getRadarAndPieDataIssuesAssigned,
  getGaugeDataIssuesAssigned,
  getGaugeDataAssignedIssuesPerUser,
  getGaugeDataClosedIssuesPerUser,
  getGaugeDataIssuesHavePR
} from '../domain/issues';
import { filterHistoricData } from '../domain/utils.jsx';

import '../styles/commits.css';

function IssuesPage({ data,historicData,features }) {
  const [showHistorical, setShowHistorical] = usePersistentStateSession('showHistoricalIssues', false);
  const [dateRange, setDateRange] = usePersistentStateSession('dateRangeIssues', "7");
  
  const filteredhistoricaData = historicData ? filterHistoricData(historicData, dateRange) : null;
  const totalPeople = Object.keys(data.avatars).length;
  const { xDataAssigned, seriesDataAssigned } = transformAssignedIssuesDataForLineChart(filteredhistoricaData);
  const percentageAssigned = getGaugeDataIssuesAssigned(data);
  const gaugeDataHavePR = getGaugeDataIssuesHavePR(data);
  const gaugeDataAssigned = getGaugeDataAssignedIssuesPerUser(data);
  const gaugeDataClosed = getGaugeDataClosedIssuesPerUser(data);
  const {radarData,pieData} = getRadarAndPieDataIssuesAssigned(data)
  return (
    <div className="commits-container">
      <h1>Issues</h1>
      <HistoricalToggle
        showHistorical={showHistorical}
        setShowHistorical={setShowHistorical}
      />

      <DateRangeSelector
        showHistorical={showHistorical}
        dateRange={dateRange}
        setDateRange={setDateRange}
      />

        {!showHistorical && (
      <>
      <div className='section-background'>
      <h2>Summary</h2>
      <div className="summary-charts-container">
        <div className='chart-item'>
          <RadarPieToggle
              RadarPieID="RadarPieIssues"
              radarData={radarData}
              pieData={pieData}
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
                percentage={percentageAssigned}
                totalPeople= {1}
              />
        </div>
        {features.includes("pull-requests") && (
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
            percentage={gaugeDataHavePR}
            totalPeople= {1}
            />    
        </div>)}
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
            {gaugeDataAssigned.map(({ user, percentage }) => (
              <GaugeChart
              key={`assigned-issues-${user}`}
                user={user}
                percentage={percentage}
                totalPeople={totalPeople}
              />
            ))}
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
          {gaugeDataClosed.map(({ user, percentage }) => (
            <GaugeChart
              key={`closed-issues-${user}`}
              user={user}
              percentage={percentage}
              totalPeople={1}
            />
          ))}
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
            xData={xDataAssigned}
            seriesData={seriesDataAssigned}
            xLabel="Data"
            yLabel="Issues"
            title="Assigned issues distribution over time"
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

export default IssuesPage;
