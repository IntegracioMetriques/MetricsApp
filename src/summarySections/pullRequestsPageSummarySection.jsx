import React from 'react';
import GaugeChart from '../components/gaugeChart.jsx';
import RadarPieToggle from '../components/radarPieToggle.jsx';

function PullRequestsPageSummarySection({
  radarDataCreated,
  pieDataCreated,
  radarDataMerged,
  pieDataMerged,
  percentageMerged,
  percentatgeReviewed,
  percentageMergesPR,
  features
}) {
  return (
    <div className="section-background">
      <h2>Summary</h2>
      <div className="summary-charts-container">
        <div className="chart-item">
          <RadarPieToggle
            RadarPieID="RadarPieCreatedPRs"
            radarData={radarDataCreated}
            pieData={pieDataCreated}
            title={"Created Pull Requests distribution"}
          />
        </div>
        <div className="chart-item">
          <RadarPieToggle
            RadarPieID="RadarPieMergedPRs"
            radarData={radarDataMerged}
            pieData={pieDataMerged}
            title={"Merged Pull Requests distribution"}
          />
        </div>
      </div>
      <div className="gauge-charts-container">
        <div>
          <h2 className="section-title">
            Pull requests merged
            <span className="custom-tooltip">
              ⓘ
              <span className="tooltip-text">
                Percentage of pull requests that are merged relative to the total number of pull requests that are not closed
              </span>
            </span>
          </h2>
          <GaugeChart
            user="Merged"
            percentage={percentageMerged}
            totalPeople={1}
          />
        </div>
        <div>
          <h2 className="section-title">
            Pull requests reviewed
            <span className="custom-tooltip">
              ⓘ
              <span className="tooltip-text">
                Percentage of pull requests merged by another user that is not the author relative to the total number of merged pull requests
              </span>
            </span>
          </h2>
          <GaugeChart
            user="Pull requests reviewed"
            percentage={percentatgeReviewed}
            totalPeople={1}
          />
        </div>
        <div>
          <h2 className="section-title">
            Merges from pull requests
            <span className="custom-tooltip">
              ⓘ
              <span className="tooltip-text">
                Percentage of merges that are from pull requests
              </span>
            </span>
          </h2>
          <GaugeChart
            user="Pull requests merges"
            percentage={percentageMergesPR}
            totalPeople={1}
          />
        </div>
      </div>
    </div>
  );
}

export default PullRequestsPageSummarySection;
