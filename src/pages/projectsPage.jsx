import React, { useState } from 'react';
import GaugeChart from '../components/gaugeChart';
import RadarPieToggle from '../components/radarPieToggle';
import PieChart from '../components/pieChart';
import LineChartMultiple  from '../components/lineChartMultiple';
import AreaChartMultiple  from '../components/areaChartMultiple';
import usePersistentStateSession  from '../components/usePersistentStateSession';
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
} from '../domain/projects'
import { filterHistoricData } from '../domain/utils';
import '../styles/commits.css';

function ProjectsPage({ data,historicData,features }) {
  const [showHistorical, setShowHistorical] = usePersistentStateSession('showHistoricalProject', false);
  const [dateRange, setDateRange] = usePersistentStateSession('dateRangeProject', "7");

  const [selectedIteration, setSelectedIteration] = usePersistentStateSession("activeIteration",getActiveIteration(data));
  
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
      : filterHistoricDataByIteration(data,historicData, selectedIteration)) 
  : null;
  const {radarDataAssigned,pieDataAssigned} = getRadarPieDataAssignedTasks(data,selectedIteration)
  const { xDataAssigned, seriesDataAssigned } = transformAssignedTasksDataForLineChart(
    data,
    filteredhistoricaData,
    selectedIteration,
    data.project.iterations
  );

  const { xDataFeature,allSeries } = transformFeatureDataForAreaChart(filteredhistoricaData);
  
  const {typePieChartData,typeColorsPieChart} = getIssueTypeDataForChart(data, selectedIteration);

  const {featurePieChartData,featureColorsPieChart} = getFeatureDataForChart(data, selectedIteration);


  const percentageTasksAssigned =  getGaugeDataTasksAssigned(data,selectedIteration)
  const percentageStandardStatus = getGaugeDataTasksStandardStatus(data,selectedIteration)
  const percentageItemsIssues = getGaugeDataItemsIssues(data,selectedIteration)
  const percentageItemIssuesWithType = getGaugeDataItemIssuesWithType(data,selectedIteration)
  const percentageIteration = getGaugeDataItemIssuesWithIteration(data)
  const gaugeDataAssignedTasks = getGaugeDataAssignedTasksPerUser(data,selectedIteration);
  const gaugeDataInProgressTasks = getGaugeDataInProgressTasksPerUser(data,selectedIteration);
  const gaugeDataDoneTasks = getGaugeDataDoneTasksPerUser(data,selectedIteration);
  const gaugeDataStandardTasks = getGaugeDataStandardStatusTasksPerUser(data,selectedIteration)
  return (
    
    <div className="commits-container">
      <h1>Projects</h1>
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
            <>
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
      </div>
      {selectedIteration === "total" && (
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
      </>
      )}



      {!showHistorical && (
      <>
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
          <div className='date-range'>
          {getDateRangeForIteration(data,selectedIteration)}
        </div> 
      </div>
      <div className='section-background'>
      <h2>Summary</h2>
      <div className="summary-charts-container">
        <div className='chart-item'>
          <RadarPieToggle
              RadarPieID = "RadarPieAssignedTasks"
              radarData={radarDataAssigned}
              pieData={pieDataAssigned}
              title={"Assigned Tasks distribution"}
            />
        </div>
        <div className='chart-item'>
          <PieChart
            title="Issue types"
            data={typePieChartData}
            colors = {typeColorsPieChart}
          />
        </div>
        <div className='chart-item'>
          <PieChart
            title="Features state"
            data={featurePieChartData}
            colors = {featureColorsPieChart}
          />
        </div>
        <div>
          <h2 className="section-title">
            Tasks assigned
              <span className="custom-tooltip">
                ⓘ
                <span className="tooltip-text">Percentage of tasks that are assigned to a user relative to the total number of Tasks</span>
              </span>
            </h2>
              <GaugeChart
                key="AssignedTasks"
                user="assigned"
                percentage={percentageTasksAssigned}
                totalPeople= {1}
              />
        </div>
          <div>
          <h2 className="section-title">
            Tasks with Standard Status
              <span className="custom-tooltip">
                ⓘ
                <span className="tooltip-text">Percentage of tasks that have a standard status (ToDo, In Progress, Done) to the total of tasks</span>
              </span>
            </h2>
              <GaugeChart
                key="Standard"
                user="Tasks"
                percentage={percentageStandardStatus}
                totalPeople= {1}
              />
        </div>
        <div>
          <h2 className="section-title">
            Issues
              <span className="custom-tooltip">
                ⓘ
                <span className="tooltip-text">Percentage of Items that are Issues</span>
              </span>
            </h2>
              <GaugeChart
                key="ItemIssues"
                user="Issues"
                percentage={percentageItemsIssues}
                totalPeople= {1}
              />
        </div>
        <div>
          <h2 className="section-title">
            Issues with type
              <span className="custom-tooltip">
                ⓘ
                <span className="tooltip-text">Percentage of Issues that have a type assigned</span>
              </span>
            </h2>
              <GaugeChart
                key={"Issue with types"}
                user="Issues"
                percentage={percentageItemIssuesWithType}
                totalPeople= {1}
              />
        </div>
        {data.project.has_iterations && (
          <div>
          <h2 className="section-title">
            Items with iteration
              <span className="custom-tooltip">
                ⓘ
                <span className="tooltip-text">Percentage of Items that are assigned to an iteration</span>
              </span>
            </h2>
              <GaugeChart
                user="Issues"
                percentage={percentageIteration}
                totalPeople= {1}
              />
        </div>)}
      </div>
      </div>
      <div className='section-background'>
      <h2>Metrics by User</h2>
      <h2 className="section-title">
        Tasks assigned per user
          <span className="custom-tooltip">
            ⓘ
            <span className="tooltip-text">Percentage of tasks assigned per user relative to the number of assigned tasks</span>
          </span>
        </h2>
      <div className="gauge-charts-container">
          {gaugeDataAssignedTasks.map(({ user, percentage }) => (
            <GaugeChart
              key={`assigned-tasks-${user}`}
              user={user}
              percentage={percentage}
              totalPeople={totalPeople}
            />
          ))}
      </div>
      <h2 className="section-title">
      Tasks In Progress per user
      <span className="custom-tooltip">
          ⓘ
          <span className="tooltip-text">
          Shows if the user is actively working on at least one task.
            If the gauge is at 100%, the user has at least one task in progress.
            If it's at 0%, the user currently has no tasks in progress.          
            </span>
        </span>
      </h2>
      <div className="gauge-charts-container">
          {gaugeDataInProgressTasks.map(({ user, percentage }) => (
            <GaugeChart
              key={`inProgress-tasks-${user}`}
              user={user}
              percentage={percentage}
              totalPeople={1}
            />
          ))}
      </div>
      <h2 className="section-title">
      Tasks Done per user
      <span className="custom-tooltip">
          ⓘ
          <span className="tooltip-text">
          Percentage of tasks done per user relative to the tasks assigned to that user
          </span>
        </span>
      </h2>
      <div className="gauge-charts-container">
          {gaugeDataDoneTasks.map(({ user, percentage }) => (
            <GaugeChart
              key={`done-tasks-${user}`}
              user={user}
              percentage={percentage}
              totalPeople={1}
            />
          ))}
      </div>

      <h2 className="section-title">
        Tasks with Standard Status per user
        <span className="custom-tooltip">
          ⓘ
          <span className="tooltip-text">
            Percentage of tasks with standard status (ToDo, In Progress, Done) per user relative to their assigned tasks
          </span>
        </span>
      </h2>
      <div className="gauge-charts-container">
          {gaugeDataStandardTasks.map(({ user, percentage }) => (
            <GaugeChart
              key={`standard-tasks-${user}`}
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
            yLabel="Tasks"
            title="Assigned tasks distribution over time"
          />
          </div>
          <div className='radar-chart-container'>
          <AreaChartMultiple
            xData={xDataFeature}
            seriesData={allSeries}
            xLabel="Date"
            yLabel="Features"
            title="Features Over Time"
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

export default ProjectsPage;
