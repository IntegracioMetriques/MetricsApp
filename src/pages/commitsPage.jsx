import React from 'react';
import GaugeChart from '../components/gaugeChart.jsx';
import RadarPieToggle from '../components/radarPieToggle.jsx';
import LineChartMultiple from '../components/lineChartMultiple.jsx';
import usePersistentStateSession from '../components/usePersistentStateSession.jsx';
import HistoricalToggle from '../components/historicalToggle.jsx';
import DateRangeSelector from '../components/dateRangeSelector.jsx';
import '../styles/commits.css';

import {
  getGaugeDataAnonymous,
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

  const totalCommits = data.commits?.total || 0;
  const gaugeDataAnonymous = getGaugeDataAnonymous(data)
 
  const dataPieChartCommits = getPieChartDataCommits(data);
  const dataPieChartModifiedLines = getPieChartDataModifiedLines(data);
  const commitsGaugeData = getGaugeChartDataCommits(data);
  const modifiedLinesGaugeData = getGaugeChartDataModifiedLines(data);
  const radarChartCommits = GetRadarDataCommits(data);
  const radarChartModifiedLines = GetRadarDataModifiedLines(data);

  const totalPeople = Object.keys(data.avatars || {}).length || 1;

  return (
    <div className="commits-container">
      <h1>Commits</h1>

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
                  percentage={gaugeDataAnonymous}
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
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default CommitsPage;
