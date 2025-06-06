import React from 'react';
import GaugeChart from '../components/gaugeChart.jsx';
import RadarPieToggle from '../components/radarPieToggle.jsx';
import LineChartMultiple from '../components/lineChartMultiple.jsx';
import usePersistentStateSession from '../components/usePersistentStateSession.jsx';
import '../styles/commits.css';

import {
  transformCommitsDataForLineChart,
  transformModifiedLinesDataForLineChart,
  getPieChartDataCommits,
  getPieChartDataModifiedLines,
  getGaugeChartDataCommits,
  getGaugeChartDataModifiedLines,
  GetRadarDataCommits,
  GetRadarDataModifiedLines,
} from '../domain/commits.jsx';

import { filterHistoricData } from '../domain/utils.jsx';

function CommitsPage({ data, historicData, features }) {
  const [showHistorical, setShowHistorical] = usePersistentStateSession('showHistoricalCommits', false);
  const [dateRange, setDateRange] = usePersistentStateSession('dateRangeCommits', "7");

  const filteredHistoricData = historicData ? filterHistoricData(historicData, dateRange) : null;

  const { xData: xDataCommits, seriesData: seriesDataCommits } = transformCommitsDataForLineChart(filteredHistoricData || {});
  const { xData: xDataModified, seriesData: seriesDataModified } = transformModifiedLinesDataForLineChart(filteredHistoricData || {});

  const dataPieChartCommits = getPieChartDataCommits(data);
  const dataPieChartModifiedLines = getPieChartDataModifiedLines(data);
  const commitsGaugeData = getGaugeChartDataCommits(data);
  const modifiedLinesGaugeData = getGaugeChartDataModifiedLines(data);
  const radarChartCommits = GetRadarDataCommits(data);
  const radarChartModifiedLines = GetRadarDataModifiedLines(data);

  const totalCommits = data.commits?.total || 0;
  const totalPeople = Object.keys(data.avatars || {}).length || 1;

  return (
    <div className="commits-container">
      <h1>Commits</h1>
      <div className="chart-toggle-wrapper-index">
        <div className="chart-toggle-buttons">
          <button onClick={() => setShowHistorical(false)} className={!showHistorical ? 'selected' : ''}>Current</button>
          <button onClick={() => setShowHistorical(true)} className={showHistorical ? 'selected' : ''}>Historical</button>
        </div>
      </div>

      {showHistorical && (
        <div className="day-selector-wrapper-comm">
          <select
            className="day-selector-comm"
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
              <div className="chart-item">
                <RadarPieToggle RadarPieID="RadarPieCommits" radarData={radarChartCommits} pieData={dataPieChartCommits} title="Commits Distribution" />
              </div>
              <div className="chart-item">
                <RadarPieToggle RadarPieID="RadarPieModifiedLines" radarData={radarChartModifiedLines} pieData={dataPieChartModifiedLines} title="Modified Lines Distribution" />
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
                  percentage={totalCommits > 0 ? (totalCommits - (data.commits?.anonymous || 0)) / totalCommits : 0}
                  totalPeople={1}
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
              {commitsGaugeData.map(({ user, percentage }) => (
                <GaugeChart key={user} user={user} percentage={percentage} totalPeople={totalPeople} />
              ))}
            </div>

            <h2 className="section-title">
              Modified lines per user
              <span className="custom-tooltip">
                ⓘ
                <span className="tooltip-text">Percentage of modified lines per user relative to the total number of modified lines</span>
              </span>
            </h2>
            <div className="gauge-charts-container">
              {modifiedLinesGaugeData.map(({ user, percentage }) => (
                <GaugeChart key={user} user={user} percentage={percentage} totalPeople={totalPeople} />
              ))}
            </div>
          </div>
        </>
      )}

      {showHistorical && (
        <>
          {historicData ? (
            <div className="section-background">
              <div className="radar-charts-wrapper">
                <div className="radar-chart-container">
                  <LineChartMultiple xData={xDataCommits} seriesData={seriesDataCommits} xLabel="Date" yLabel="Commits" title="Commits distribution over time" />
                </div>
                <div className="radar-chart-container">
                  <LineChartMultiple xData={xDataModified} seriesData={seriesDataModified} xLabel="Date" yLabel="Modified Lines" title="Modified lines distribution over time" />
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", textAlign: "center", fontSize: "1.8rem" }}>
              No s'ha trobat <code>historic_metrics.json</code>.<br />
              Si és el primer dia, torna demà un cop s'hagi fet la primera execució del bot.
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default CommitsPage;
