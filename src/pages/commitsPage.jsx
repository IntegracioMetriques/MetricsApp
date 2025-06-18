import React from 'react';
import usePersistentStateSession from '../components/usePersistentStateSession.jsx';
import HistoricalToggle from '../components/historicalToggle.jsx';
import DateRangeSelector from '../components/dateRangeSelector.jsx';
import CommitsPageSummarySection from '../summarySections/commitsPageSummarySection.jsx';
import CommitsPageMetricsSection from '../metricsSections/commitsPageMetricsSection.jsx';
import CommitsPageHistoricalSection from '../historicalSections/commitsPageHistoricalSection.jsx';
import '../styles/elements.css';

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

  const totalCommits = data.commits?.total || 0;
  const gaugeDataAnonymous = totalCommits > 0 ? ((totalCommits - (data.commits?.anonymous || 0)) / totalCommits) : 0;

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

      <HistoricalToggle showHistorical={showHistorical} setShowHistorical={setShowHistorical} />
      <DateRangeSelector showHistorical={showHistorical} dateRange={dateRange} setDateRange={setDateRange} />

      {!showHistorical && (
        <>
          <CommitsPageSummarySection
            radarChartCommits={radarChartCommits}
            radarChartModifiedLines={radarChartModifiedLines}
            dataPieChartCommits={dataPieChartCommits}
            dataPieChartModifiedLines={dataPieChartModifiedLines}
            gaugeDataAnonymous={gaugeDataAnonymous}
          />
          <CommitsPageMetricsSection
            commitsGaugeData={commitsGaugeData}
            modifiedLinesGaugeData={modifiedLinesGaugeData}
            totalPeople={totalPeople}
          />
        </>
      )}

      {showHistorical && (
        <CommitsPageHistoricalSection
          xDataCommits={xDataCommits}
          seriesDataCommits={seriesDataCommits}
          xDataModified={xDataModified}
          seriesDataModified={seriesDataModified}
          hasHistoric={!!historicData}
        />
      )}
    </div>
  );
}

export default CommitsPage;
