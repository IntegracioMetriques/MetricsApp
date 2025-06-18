import React from 'react';
import "../styles/index.css";
import usePersistentStateSession from '../components/usePersistentStateSession';
import HistoricalToggle from '../components/historicalToggle.jsx';
import DateRangeSelector from '../components/dateRangeSelector.jsx';

import IndexStatsSection from '../summarySections/indexStatsSection.jsx';
import IndexGraphicsSection from '../metricsSections/indexGraphicsSection.jsx';
import IndexHistoricalSection from '../historicalSections/indexHistoricalSection.jsx';

import { filterHistoricData } from '../domain/utils';
import {
  getGaugeDataAnonymous,
  transformDataForLineChartCommits,
  transformDataForLineChartModifiedLines
} from '../domain/commits';
import {
  getGaugeDataIssuesAssigned,
  getGaugeDataIssuesHavePR,
  transformIssuesDataForAreaChart,
  getPieDataIssuesStatus
} from '../domain/issues';
import {
  getGaugeChartDataMergedPRs,
  getGaugeChartDataReviewedPRs,
  getGaugeChartDataMergesPRs,
  transformPRDataForAreaChart,
  getPieDataPullRequestStatus
} from '../domain/pullRequests';
import {
  getGaugeDataTasksAssigned,
  getGaugeDataTasksStandardStatus,
  getGaugeDataItemsIssues,
  getGaugeDataItemIssuesWithType,
  getGaugeDataItemIssuesWithIteration,
  transformTaskDataForAreaChart,
  getPieDataTasksStatus
} from '../domain/projects';

function Index({ data, historicData, features }) {
  const [showHistorical, setShowHistorical] = usePersistentStateSession('showHistoricalIndex', false);
  const [dateRange, setDateRange] = usePersistentStateSession('dateRangeIndex', "7");

  const filteredhistoricaData = historicData ? filterHistoricData(historicData, dateRange) : null;

  // Radar Data
  let radarData = {};
  radarData['Non-Anonymous Commits'] = getGaugeDataAnonymous(data);

  if (features.includes('issues')) {
    radarData['Issues Assigned'] = getGaugeDataIssuesAssigned(data);
    radarData['Issues associated PR'] = getGaugeDataIssuesHavePR(data);
  }

  if (features.includes('pull-requests')) {
    radarData['Pull Requests Merged'] = getGaugeChartDataMergedPRs(data);
    radarData['Pull Requests Reviewed'] = getGaugeChartDataReviewedPRs(data);
    radarData['Pull Requests Merges'] = getGaugeChartDataMergesPRs(data);
  }

  if (features.includes('projects')) {
    radarData['Tasks Assigned'] = getGaugeDataTasksAssigned(data, "total");
    radarData['Tasks With Standard Status'] = getGaugeDataTasksStandardStatus(data, "total");
    radarData['Items that are Issues'] = getGaugeDataItemsIssues(data, "total");
    radarData['Projects Issues with type'] = getGaugeDataItemIssuesWithType(data, "total");

    if (data.project.has_iterations) {
      radarData['Items with iteration'] = getGaugeDataItemIssuesWithIteration(data, "total");
    }
  }

  // Pie Chart Data
  const { pieDataPullRequestStatus, pieDataPullRequestStatusColor } = getPieDataPullRequestStatus(data);
  const { pieDataIssuesStatus, pieDataIssuesStatusColor } = getPieDataIssuesStatus(data);
  const { pieDataTasksStatus, pieDataTasksStatusColor } = getPieDataTasksStatus(data);

  // Line/Area Chart Data
  const { xData, yData } = transformDataForLineChartCommits(filteredhistoricaData);
  const { xDataModifedLines, yDataModifedLines } = transformDataForLineChartModifiedLines(filteredhistoricaData);
  const { xDataIssues, closedIssues, openIssues } = transformIssuesDataForAreaChart(filteredhistoricaData);
  const { xDataPRs, areaPRData } = transformPRDataForAreaChart(filteredhistoricaData);
  const { xDataTask, allSeries } = transformTaskDataForAreaChart(filteredhistoricaData);

  const gaugeAnonymousData = getGaugeDataAnonymous(data);

  return (
    <div>
      <h1>General overview</h1>

      <IndexStatsSection data={data} features={features} />

      {(features.includes("issues") || features.includes("pull-requests") || features.includes("projects")) && (
        <HistoricalToggle showHistorical={showHistorical} setShowHistorical={setShowHistorical} />
      )}

      <DateRangeSelector
        showHistorical={showHistorical}
        dateRange={dateRange}
        setDateRange={setDateRange}
      />

      {!showHistorical ? (
        <IndexGraphicsSection
          features={features}
          radarData={radarData}
          pieDataPullRequestStatus={pieDataPullRequestStatus}
          pieDataPullRequestStatusColor={pieDataPullRequestStatusColor}
          pieDataIssuesStatus={pieDataIssuesStatus}
          pieDataIssuesStatusColor={pieDataIssuesStatusColor}
          pieDataTasksStatus={pieDataTasksStatus}
          pieDataTasksStatusColor={pieDataTasksStatusColor}
          historicData={historicData}
          gaugeAnonymousData={gaugeAnonymousData}
          xData={xData}
          yData={yData}
          xDataModifedLines={xDataModifedLines}
          yDataModifedLines={yDataModifedLines}
        />
      ) : (
        <IndexHistoricalSection
          features={features}
          historicData={historicData}
          xData={xData}
          yData={yData}
          xDataModifedLines={xDataModifedLines}
          yDataModifedLines={yDataModifedLines}
          xDataIssues={xDataIssues}
          openIssues={openIssues}
          closedIssues={closedIssues}
          xDataPRs={xDataPRs}
          areaPRData={areaPRData}
          xDataTask={xDataTask}
          allSeries={allSeries}
        />
      )}
    </div>
  );
}

export default Index;
