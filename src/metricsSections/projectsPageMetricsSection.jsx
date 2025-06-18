import React from 'react';
import GaugeChart from '../components/gaugeChart';

function ProjectsPageMetricsSection({
  gaugeDataAssignedTasks,
  gaugeDataInProgressTasks,
  gaugeDataDoneTasks,
  gaugeDataStandardTasks,
  totalPeople,
}) {
  return (
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
        Tasks with standard status per user
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
  );
}

export default ProjectsPageMetricsSection;