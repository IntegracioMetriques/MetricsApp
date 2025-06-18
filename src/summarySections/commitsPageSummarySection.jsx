// components/summarySection.jsx
import React from 'react';
import RadarPieToggle from '../components/radarPieToggle.jsx';
import GaugeChart from '../components/gaugeChart.jsx';

function CommitsPageSummarySection({ radarChartCommits, radarChartModifiedLines, dataPieChartCommits, dataPieChartModifiedLines, gaugeDataAnonymous }) {
  return (
    <div className="section-background">
      <h2>Summary</h2>
      <div className="summary-charts-container">
        <div className="chart-item">
          <RadarPieToggle
            RadarPieID="RadarPieCommits"
            radarData={radarChartCommits}
            pieData={dataPieChartCommits}
            title="Commits Distribution"
          />
        </div>
        <div className="chart-item">
          <RadarPieToggle
            RadarPieID="RadarPieModifiedLines"
            radarData={radarChartModifiedLines}
            pieData={dataPieChartModifiedLines}
            title="Modified Lines Distribution"
          />
        </div>
        <div>
          <h2 className="section-title">
            Non-anonymous commits
            <span className="custom-tooltip">
              ⓘ
              <span className="tooltip-text">
                Percentage of commits that have a member of the project as its author
              </span>
            </span>
          </h2>
          <GaugeChart
            key="non-anonymous"
            user="non-anonymous"
            percentage={gaugeDataAnonymous}
            totalPeople={1}
          />
        </div>
      </div>
    </div>
  );
}

export default CommitsPageSummarySection;
