import React from 'react';
import usePersistentStateSession from '../components/usePersistentStateSession';
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
} from '../domain/pullRequests';
import HistoricalToggle from '../components/historicalToggle';
import DateRangeSelector from '../components/dateRangeSelector.jsx';
import { filterHistoricData } from '../domain/utils';

import PullRequestsPageSummarySection from '../summarySections/pullRequestsPageSummarySection.jsx';
import PullRequestsPageMetricsSection from '../metricsSections/pullRequestsPageMetricsSection.jsx';
import PullRequestsPageHistoricalSection from '../historicalSections/pullRequestsPageHistoricalSection.jsx';

import '../styles/elements.css';

function PullRequestsPage({ data, historicData, features }) {
  const [showHistorical, setShowHistorical] = usePersistentStateSession('showHistoricalPR', false);
  const [dateRange, setDateRange] = usePersistentStateSession('dateRangePR', "7");

  const filteredhistoricaData = historicData ? filterHistoricData(historicData, dateRange) : null;

  const totalPeople = Object.keys(data.avatars).length;

  const { xDataCreated, seriesDataCreated } = transformCreatedPRsDataForLineChart(filteredhistoricaData);
  const { xDataMerged, seriesDataMerged } = transformMergedPRsDataForLineChart(filteredhistoricaData);

  const { radarDataCreated, pieDataCreated } = getRadarAndPieDataForCreatedPRs(data);
  const { radarDataMerged, pieDataMerged } = getRadarAndPieDataForMergedPRs(data);

  const percentageMerged = getGaugeChartDataMergedPRs(data);
  const percentatgeReviewed = getGaugeChartDataReviewedPRs(data);
  const percentageMergesPR = getGaugeChartDataMergesPRs(data);

  const gaugeDataCreatedPRs = getGaugeDataCreatedPRsPerUser(data);
  const gaugeDataMergedPRs = getGaugeDataMergedPRsPerUser(data);

  return (
    <div className="commits-container">
      <h1>Pull requests</h1>

      <div className="chart-toggle-wrapper-index">
        <HistoricalToggle 
          showHistorical={showHistorical} 
          setShowHistorical={setShowHistorical} 
        />
      </div>

      {showHistorical && (
        <DateRangeSelector
          showHistorical={showHistorical}
          dateRange={dateRange}
          setDateRange={setDateRange}
        />
      )}

      {!showHistorical && (
        <>
          <PullRequestsPageSummarySection
            radarDataCreated={radarDataCreated}
            pieDataCreated={pieDataCreated}
            radarDataMerged={radarDataMerged}
            pieDataMerged={pieDataMerged}
            percentageMerged={percentageMerged}
            percentatgeReviewed={percentatgeReviewed}
            percentageMergesPR={percentageMergesPR}
            features={features}
          />
          <PullRequestsPageMetricsSection
            gaugeDataCreatedPRs={gaugeDataCreatedPRs}
            gaugeDataMergedPRs={gaugeDataMergedPRs}
            totalPeople={totalPeople}
          />
        </>
      )}

      {showHistorical && (
        <PullRequestsPageHistoricalSection
          historicData={historicData}
          xDataCreated={xDataCreated}
          seriesDataCreated={seriesDataCreated}
          xDataMerged={xDataMerged}
          seriesDataMerged={seriesDataMerged}
        />
      )}
    </div>
  );
}

export default PullRequestsPage;
