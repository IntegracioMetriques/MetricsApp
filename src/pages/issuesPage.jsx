// pages/IssuesPage.jsx
import React from 'react';
import usePersistentStateSession from '../components/usePersistentStateSession';
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

import IssuesSummarySection from '../summarySections/issuesPageSummarySection.jsx';
import IssuesMetricsByUserSection from '../metricsSections/issuesPageMetricsSection.jsx';
import IssuesHistoricalSection from '../historicalSections/issuesPageHistoricalSection.jsx';

import '../styles/elements.css';

function IssuesPage({ data, historicData, features }) {
  const [showHistorical, setShowHistorical] = usePersistentStateSession('showHistoricalIssues', false);
  const [dateRange, setDateRange] = usePersistentStateSession('dateRangeIssues', "7");

  const filteredHistoricalData = historicData ? filterHistoricData(historicData, dateRange) : null;
  const totalPeople = Object.keys(data.avatars).length;

  const { xDataAssigned, seriesDataAssigned } = transformAssignedIssuesDataForLineChart(filteredHistoricalData);
  const percentageAssigned = getGaugeDataIssuesAssigned(data);
  const gaugeDataHavePR = getGaugeDataIssuesHavePR(data);
  const gaugeDataAssigned = getGaugeDataAssignedIssuesPerUser(data);
  const gaugeDataClosed = getGaugeDataClosedIssuesPerUser(data);
  const { radarData, pieData } = getRadarAndPieDataIssuesAssigned(data);

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
          <IssuesSummarySection
            radarData={radarData}
            pieData={pieData}
            percentageAssigned={percentageAssigned}
            gaugeDataHavePR={gaugeDataHavePR}
            features={features}
          />
          <IssuesMetricsByUserSection
            gaugeDataAssigned={gaugeDataAssigned}
            gaugeDataClosed={gaugeDataClosed}
            totalPeople={totalPeople}
          />
        </>
      )}

      {showHistorical && (
        <IssuesHistoricalSection
          historicData={historicData}
          xDataAssigned={xDataAssigned}
          seriesDataAssigned={seriesDataAssigned}
        />
      )}
    </div>
  );
}

export default IssuesPage;
