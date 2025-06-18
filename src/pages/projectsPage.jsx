import React, { useState } from 'react';
import usePersistentStateSession from '../components/usePersistentStateSession';
import HistoricalToggle from '../components/historicalToggle.jsx';
import DateRangeSelector from '../components/dateRangeSelector.jsx';

import ProjectsPageSummarySection from '../summarySections/projectsPageSummarySection.jsx';
import ProjectsPageMetricsSection from '../metricsSections/projectsPageMetricsSection.jsx';
import ProjectsPageHistoricalSection from '../historicalSections/projectsPageHistoricalSection.jsx';

import {
  getActiveIteration,
  filterHistoricDataByIteration,
  getRadarPieDataAssignedTasks,
  transformAssignedTasksDataForLineChart,
  transformFeatureDataForAreaChart,
  getDateRangeForIteration,
  getIssueTypeDataForChart,
  getFeatureDataForChart,
  getGaugeDataTasksAssigned,
  getGaugeDataTasksStandardStatus,
  getGaugeDataItemsIssues,
  getGaugeDataItemIssuesWithType,
  getGaugeDataItemIssuesWithIteration,
  getGaugeDataAssignedTasksPerUser,
  getGaugeDataInProgressTasksPerUser,
  getGaugeDataDoneTasksPerUser,
  getGaugeDataStandardStatusTasksPerUser
} from '../domain/projects';
import { filterHistoricData } from '../domain/utils';

function ProjectsPage({ data, historicData, features }) {
  const [showHistorical, setShowHistorical] = usePersistentStateSession('showHistoricalProject', false);
  const [dateRange, setDateRange] = usePersistentStateSession('dateRangeProject', "7");

  const [selectedIteration, setSelectedIteration] = usePersistentStateSession("activeIteration", getActiveIteration(data));

  const iterationsOrdered = Object.keys(data.project.iterations);
  const iterations = Object.keys(data.project.metrics_by_iteration);

  const sortedIterationNames = [
    ...iterationsOrdered,
    ...iterations.filter(name => name === "total"),
  ];
  const totalPeople = Object.keys(data.avatars).length;

  const filteredhistoricaData = historicData
    ? (selectedIteration === "total"
      ? filterHistoricData(historicData, dateRange)
      : filterHistoricDataByIteration(data, historicData, selectedIteration))
    : null;

  const { radarDataAssigned, pieDataAssigned } = getRadarPieDataAssignedTasks(data, selectedIteration);

  const { xDataAssigned, seriesDataAssigned } = transformAssignedTasksDataForLineChart(
    data,
    filteredhistoricaData,
    selectedIteration,
    data.project.iterations
  );

  const { xDataFeature, allSeries } = transformFeatureDataForAreaChart(filteredhistoricaData, selectedIteration, data.project.iterations);

  const { typePieChartData, typeColorsPieChart } = getIssueTypeDataForChart(data, selectedIteration);

  const { featurePieChartData, featureColorsPieChart } = getFeatureDataForChart(data, selectedIteration);

  const percentageTasksAssigned = getGaugeDataTasksAssigned(data, selectedIteration);
  const percentageStandardStatus = getGaugeDataTasksStandardStatus(data, selectedIteration);
  const percentageItemsIssues = getGaugeDataItemsIssues(data, selectedIteration);
  const percentageItemIssuesWithType = getGaugeDataItemIssuesWithType(data, selectedIteration);
  const percentageIteration = getGaugeDataItemIssuesWithIteration(data);
  const gaugeDataAssignedTasks = getGaugeDataAssignedTasksPerUser(data, selectedIteration);
  const gaugeDataInProgressTasks = getGaugeDataInProgressTasksPerUser(data, selectedIteration);
  const gaugeDataDoneTasks = getGaugeDataDoneTasksPerUser(data, selectedIteration);
  const gaugeDataStandardTasks = getGaugeDataStandardStatusTasksPerUser(data, selectedIteration);

  return (
    <div className="commits-container">
      <h1>Projects</h1>
      <HistoricalToggle
        showHistorical={showHistorical}
        setShowHistorical={setShowHistorical}
      />
      <div className="day-selector-wrapper-comm">
        <select
          className="day-selector-comm"
          onChange={(e) => setSelectedIteration(e.target.value)}
          value={selectedIteration}
          style={{ marginLeft: '1rem' }}
        >
          {sortedIterationNames.map((iterationName) => (
            <option key={iterationName} value={iterationName}>
              {iterationName}
            </option>
          ))}
        </select>
        {!showHistorical && (
          <div className='date-range'>
            {getDateRangeForIteration(data, selectedIteration)}
          </div>
        )}
      </div>
      {selectedIteration === "total" && (
        <DateRangeSelector
          showHistorical={showHistorical}
          dateRange={dateRange}
          setDateRange={setDateRange}
        />
      )}

      {!showHistorical ? (
        <>
          <ProjectsPageSummarySection
            radarDataAssigned={radarDataAssigned}
            pieDataAssigned={pieDataAssigned}
            typePieChartData={typePieChartData}
            typeColorsPieChart={typeColorsPieChart}
            featurePieChartData={featurePieChartData}
            featureColorsPieChart={featureColorsPieChart}
            percentageTasksAssigned={percentageTasksAssigned}
            percentageStandardStatus={percentageStandardStatus}
            percentageItemsIssues={percentageItemsIssues}
            percentageItemIssuesWithType={percentageItemIssuesWithType}
            percentageIteration={percentageIteration}
            data={data}
          />
          <ProjectsPageMetricsSection
            gaugeDataAssignedTasks={gaugeDataAssignedTasks}
            gaugeDataInProgressTasks={gaugeDataInProgressTasks}
            gaugeDataDoneTasks={gaugeDataDoneTasks}
            gaugeDataStandardTasks={gaugeDataStandardTasks}
            totalPeople={totalPeople}
          />
        </>
      ) : (
        <ProjectsPageHistoricalSection
          historicData={historicData}
          xDataAssigned={xDataAssigned}
          seriesDataAssigned={seriesDataAssigned}
          xDataFeature={xDataFeature}
          allSeries={allSeries}
        />
      )}
    </div>
  );
}

export default ProjectsPage;
