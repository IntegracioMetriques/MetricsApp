import React, { useState } from 'react';
import GaugeChart from '../components/gaugeChart';
import RadarPieToggle from '../components/radarPieToggle';
import LineChartMultiple  from '../components/lineChartMultiple';
import '../styles/commits.css';

function Projects({ data,historicData,features }) {
  const [showHistorical, setShowHistorical] = useState(false);
  const [dateRange, setDateRange] = useState("7");
  const filterHistoricData = (data, days) => {
    if (days === "lifetime") return data;
  
    const today = new Date();
    const cutoff = new Date(today);
    cutoff.setDate(today.getDate() - parseInt(days));
    const cutoffDateString = cutoff.toISOString().split("T")[0];
    console.log(cutoffDateString)
    const filtered = {};
    for (const date in data) {
      if (date >= cutoffDateString) {
        filtered[date] = data[date];
      }
    }
  
      return filtered;
    };
  const filteredhistoricaData = historicData ? filterHistoricData(historicData, dateRange) : null;

  const taskData = data.project;
  const totalTasks = taskData.total;
  const totalInProgress = taskData.in_progress
  const totalDone = taskData.done
  const totalToDo = totalTasks - totalDone - totalInProgress

  const { non_assigned, ...assignedPerMember } = taskData.assigned_per_member;
  const totalAssigned = Object.values(assignedPerMember).reduce((sum, current) => sum + current, 0);
  const inProgresPerMember = taskData.in_progress_per_member;
  const donePerMember = taskData.done_per_member;
  const totalPeople = Object.keys(assignedPerMember).length;

  const transformAssignedPRsDataForLineChart = (data) => {
  const xDataAssigned = [];
  const userSeries = {};
  
  for (const date in data) {
    xDataAssigned.push(date);
    const tasks = data[date].project.assigned_per_member;
      
    for (const user in tasks) {
      if(user === 'non_assigned') continue;
        if (!userSeries[user]) {
          userSeries[user] = [];
        }
        userSeries[user].push(tasks[user]);
      }
    }
    const seriesDataAssigned = Object.keys(userSeries).map(user => ({
      name: user,
      data: userSeries[user]
    }));
  
    return { xDataAssigned, seriesDataAssigned};
  };

    const { xDataAssigned, seriesDataAssigned } = transformAssignedPRsDataForLineChart(filteredhistoricaData);

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
        <div className = "day-selector-wrapper-comm">
        <select className='day-selector-comm'
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
                key="assigned"
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
                key={user}
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
