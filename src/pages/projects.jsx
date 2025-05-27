import React, { useState } from 'react';
import GaugeChart from '../components/gaugeChart';
import RadarPieToggle from '../components/radarPieToggle';
import LineChartMultiple  from '../components/lineChartMultiple';
import usePersistentStateSession  from '../components/usePersistentStateSession';

import '../styles/commits.css';

function Projects({ data,historicData,features }) {
  const [showHistorical, setShowHistorical] = usePersistentStateSession('showHistoricalProject', false);
  const [dateRange, setDateRange] = usePersistentStateSession('dateRangeProject', "7");
  const today = new Date();

const getActiveIteration = () => {
  const has_iterations = data.project.has_iterations;
  if (!has_iterations) return "total";
  const iterations = data.project.iterations
  for (const key in iterations) {
    const { startDate, endDate } = iterations[key];
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (today >= start && today <= end) {
      return key;
    }
  }
  return "total";
  };

  const [selectedIteration, setSelectedIteration] = usePersistentStateSession("activeIteration",getActiveIteration());

  const filterHistoricData = (data, days) => {
    if (days === "lifetime") return data;
  
    const today = new Date();
    const cutoff = new Date(today);
    cutoff.setDate(today.getDate() - parseInt(days));
    const cutoffDateString = cutoff.toISOString().split("T")[0];
    const filtered = {};
    for (const date in data) {
      if (date >= cutoffDateString) {
        filtered[date] = data[date];
      }
    }
  
      return filtered;
    };
  const filterHistoricDataByIteration = (dataHist, iterationName) => {
  if (!data) return null;
  if (iterationName === "total") return dataHist;

  const iteration = data.project.iterations[iterationName] || null;
  if (!iteration) return dataHist;

  const startDate = new Date(iteration.startDate);
  const endDate = new Date(iteration.endDate);

  const filtered = {};
  for (const dateStr in dataHist) {
    const date = new Date(dateStr);
    if (date >= startDate && date <= endDate) {
      filtered[dateStr] = dataHist[dateStr];
    }
  }
  return filtered;
  };
  
  const iterationsOrdered = Object.keys(data.project.iterations);
  const iterations = Object.keys(data.project.metrics_by_iteration);

  const sortedIterationNames = [
    ...iterationsOrdered,
    ...iterations.filter(name => name === "total"),
  ];

  const filteredhistoricaData = historicData
  ? (selectedIteration === "total"
      ? filterHistoricData(historicData, dateRange) 
      : filterHistoricDataByIteration(historicData, selectedIteration)) 
  : null;
  const taskData = data.project.metrics_by_iteration[selectedIteration];
  const totalTasks = taskData.total;
  const totalInProgress = taskData.in_progress
  const totalDone = taskData.done
  const totalToDo = totalTasks - totalDone - totalInProgress

  const { non_assigned, ...assignedPerMember } = taskData.assigned_per_member;
  const totalAssigned = Object.values(assignedPerMember).reduce((sum, current) => sum + current, 0);
  const inProgresPerMember = taskData.in_progress_per_member;
  const donePerMember = taskData.done_per_member;
  const totalPeople = Object.keys(assignedPerMember).length;

  const transformAssignedPRsDataForLineChart = (dataHistoric, selectedIteration, iterations) => {
  let allDates = [];
  if (!dataHistoric) return { xDataAssigned: [], seriesDataAssigned: [] }

  if (selectedIteration === "total") {
    allDates = Object.keys(dataHistoric).sort((a,b) => new Date(a) - new Date(b));
  } else {
    const iteration = iterations[selectedIteration];
    if (!iteration) return { xDataAssigned: [], seriesDataAssigned: [] };

    const startDate = new Date(iteration.startDate);
    const endDate = new Date(iteration.endDate);

    const dates = [];
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      dates.push(dateStr);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    allDates = dates;
  }

  const userSeries = {};
  const allUsers = new Set();

const assignedPerMember = data.project.metrics_by_iteration["total"]?.assigned_per_member || {};

Object.keys(assignedPerMember)
  .filter(u => u !== "non_assigned")
  .forEach(u => allUsers.add(u));

  allUsers.forEach(u => {
    userSeries[u] = [];
  });

  for (const date of allDates) {
    const dayData = dataHistoric[date];
    const iterationData = dayData?.project?.metrics_by_iteration?.[selectedIteration];
    const assignedPerMember = iterationData?.assigned_per_member || {};
    allUsers.forEach(u => {
      userSeries[u].push(assignedPerMember[u] || null);
    });
  }

  const seriesDataAssigned = Array.from(allUsers).map(u => ({
    name: u,
    data: userSeries[u],
  }));

  return { xDataAssigned: allDates, seriesDataAssigned };
};

  const { xDataAssigned, seriesDataAssigned } = transformAssignedPRsDataForLineChart(
    filteredhistoricaData,
    selectedIteration,
    data.project.iterations
  );  
  function formatDate(dateStr) {
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  }
  function getDateRangeForIteration(iterationName) {
    console.log(iterationName)
  const iteration = data.project.iterations[iterationName];
      console.log(iteration)

  if (!iteration) return '';
  return `${formatDate(iteration.startDate)} - ${formatDate(iteration.endDate)}`;
}
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
      </div>
        <div style={{ marginTop: '0.5rem', marginLeft: '1rem', marginBottom: '1rem',fontSize: '1.15rem', color: '#555' }}>
          {getDateRangeForIteration(selectedIteration)}
        </div>
      <div className='section-background'>
      <h2>Summary</h2>
      <div className="summary-charts-container">
        <div className='chart-item'>
          <RadarPieToggle
              radarData={assignedPerMember}
              pieData={Object.entries(assignedPerMember)}
              title={"Assigned Tasks distribution"}
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
                user="assigned"
                percentage={totalTasks > 0 ? totalAssigned / totalTasks : 0}
                totalPeople= {1}
              />
        </div>
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
        {Object.keys(assignedPerMember).map((user) => {
          if (user !== 'non_assigned') {
            const userTasks = assignedPerMember[user];
            const percentage = totalAssigned > 0 ? userTasks / totalAssigned : 0;
            return (
              <GaugeChart
                user={user}
                percentage={percentage}
                totalPeople={totalPeople}
              />
            );
          }
          return null;
        })}
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
        {Object.keys(inProgresPerMember).map((user) => {
          const inProgress = inProgresPerMember[user]          
          const percentage = inProgress > 0 ? 1 : 0;
          return (
            <GaugeChart
              user={user}
              percentage={percentage}
              totalPeople={1}
            />
          );
        })}
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
        {Object.keys(donePerMember).map((user) => {
          const doneCount = donePerMember[user];
          const assigned = assignedPerMember[user];
          const percentage = assigned > 0 ? doneCount / assigned : 0;
          return (
            <GaugeChart
              user={user}
              percentage={percentage}
              totalPeople={1}
            />
          );
        })}
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

export default Projects;
