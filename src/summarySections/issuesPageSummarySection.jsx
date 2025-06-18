// components/issuesSummarySection.jsx
import React from 'react';
import GaugeChart from '../components/gaugeChart.jsx';
import RadarPieToggle from '../components/radarPieToggle.jsx';

function IssuesPageSummarySection({ radarData, pieData, percentageAssigned, gaugeDataHavePR, features }) {
  return (
    <div className='section-background'>
      <h2>Summary</h2>
      <div className="summary-charts-container">
        <div className='chart-item'>
          <RadarPieToggle
            RadarPieID="RadarPieIssues"
            radarData={radarData}
            pieData={pieData}
            title={"Assigned Issues distribution"}
          />
        </div>

        <div>
          <h2 className="section-title">
            Issues assigned
            <span className="custom-tooltip">
              ⓘ
              <span className="tooltip-text">
                Percentage of Issues that are assigned to a user relative to the total number of Issues
              </span>
            </span>
          </h2>
          <GaugeChart
            key="assigned"
            user="assigned"
            percentage={percentageAssigned}
            totalPeople={1}
          />
        </div>

        {features.includes("pull-requests") && (
          <div>
            <h2 className="section-title">
              Issues closed with Pull Request
              <span className="custom-tooltip">
                ⓘ
                <span className="tooltip-text">
                  Percentage of closed Issues that have a Pull Request associated
                </span>
              </span>
            </h2>
            <GaugeChart
              key="HavePr"
              user="Have Pull Request"
              percentage={gaugeDataHavePR}
              totalPeople={1}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default IssuesPageSummarySection;
