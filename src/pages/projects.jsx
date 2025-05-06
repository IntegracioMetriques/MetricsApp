import React from 'react';
import GaugeChart from '../components/gaugeChart';
import RadarPieToggle from '../components/RadarPieToggle';
import '../styles/commits.css';

function Projects({ data,features }) {
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
  return (
    <div className="commits-container">
      <h1>Projects</h1>
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
        <div className='chart-item'>
          <RadarPieToggle
              radarData={donePerMember}
              pieData={Object.entries(donePerMember)}
              title={"Done Assigned Tasks distribution"}
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
      In Progress tasks per user
      <span className="custom-tooltip">
          ⓘ
          <span className="tooltip-text">
          This shows whether the user is actively working on at least one task.
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
      Done tasks per user
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
    </div>
  );
}

export default Projects;
