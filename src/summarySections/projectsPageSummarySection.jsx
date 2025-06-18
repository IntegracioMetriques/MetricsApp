import React from 'react';
import RadarPieToggle from '../components/radarPieToggle';
import PieChart from '../components/pieChart';
import GaugeChart from '../components/gaugeChart';

function ProjectsPageSummarySection({
  radarDataAssigned,
  pieDataAssigned,
  typePieChartData,
  typeColorsPieChart,
  featurePieChartData,
  featureColorsPieChart,
  percentageTasksAssigned,
  percentageStandardStatus,
  percentageItemsIssues,
  percentageItemIssuesWithType,
  percentageIteration,
  data,
}) {
  return (
    <div className='section-background'>
      <h2>Summary</h2>
      <div className="summary-charts-container">
        <div className='chart-item'>
          <RadarPieToggle
            RadarPieID="RadarPieAssignedTasks"
            radarData={radarDataAssigned}
            pieData={pieDataAssigned}
            title={"Assigned Tasks distribution"}
          />
        </div>
        <div className='chart-item'>
          <PieChart
            title="Issue types"
            data={typePieChartData}
            colors={typeColorsPieChart}
          />
        </div>
        <div className='chart-item'>
          <PieChart
            title="Features state"
            data={featurePieChartData}
            colors={featureColorsPieChart}
          />
        </div>
        <div>
          <h2 className="section-title">
            Tasks assigned
            <span className="custom-tooltip">
              ⓘ
              <span className="tooltip-text">
                Percentage of tasks that are assigned to a user relative to the total number of Tasks
              </span>
            </span>
          </h2>
          <GaugeChart
            key="AssignedTasks"
            user="assigned"
            percentage={percentageTasksAssigned}
            totalPeople={1}
          />
        </div>
        <div>
          <h2 className="section-title">
            Tasks with standard status
            <span className="custom-tooltip">
              ⓘ
              <span className="tooltip-text">
                Percentage of tasks that have a standard status (ToDo, In Progress, Done) to the total of tasks
              </span>
            </span>
          </h2>
          <GaugeChart
            key="Standard"
            user="Tasks"
            percentage={percentageStandardStatus}
            totalPeople={1}
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
            totalPeople={1}
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
            totalPeople={1}
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
              totalPeople={1}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectsPageSummarySection;