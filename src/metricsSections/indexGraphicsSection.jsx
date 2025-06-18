import React from 'react';
import RadarChart from '../components/radarChart';
import PieChart from '../components/pieChart';
import GaugeChart from '../components/gaugeChart';
import LineChart from '../components/lineChart';

function IndexGraphicsSection({ features, radarData, pieDataPullRequestStatus, pieDataPullRequestStatusColor, pieDataIssuesStatus, pieDataIssuesStatusColor, pieDataTasksStatus, pieDataTasksStatusColor, historicData, gaugeAnonymousData, xData, yData, xDataModifedLines, yDataModifedLines }) {
  const onlyCommitsFallback = (
    <div className='only-commits-wrapper'>
      <div className='only-commits-container'>
        <GaugeChart user="non-anonymous" percentage={gaugeAnonymousData} totalPeople={1} />
      </div>
      {historicData ? (
        <div className='only-commits-lines'>
          <div className='only-commits-line-container'>
            <LineChart xData={xData} yData={yData} xLabel="Date" yLabel="Commits" title="Commits Over Time" />
          </div>
          <div className='only-commits-line-container'>
            <LineChart xData={xDataModifedLines} yData={yDataModifedLines} xLabel="Date" yLabel="Modified" title="Modified Lines Over Time" />
          </div>
        </div>
      ) : (
        <div style={{ textAlign: "center", fontSize: "1.8rem" }}>
          No s'ha trobat historic_metrics.json.<br />
          Si és el primer dia, torna demà.
        </div>
      )}
    </div>
  );

  if (!(features.includes("issues") || features.includes("pull-requests") || features.includes("projects"))) {
    return onlyCommitsFallback;
  }

  return (
    <div className="grid-container">
      <div className="grid-item">
        <RadarChart data={radarData} title="General Metrics" max={1} />
      </div>
      {features.includes("pull-requests") && (
        <div className="grid-item">
          <PieChart title="Pull requests state summary" data={pieDataPullRequestStatus} colors={pieDataPullRequestStatusColor} />
        </div>
      )}
      {features.includes("issues") && (
        <div className="grid-item">
          <PieChart title="Issues state summary" data={pieDataIssuesStatus} colors={pieDataIssuesStatusColor} />
        </div>
      )}
      {features.includes("projects") && (
        <div className="grid-item">
          <PieChart title="Projects tasks state summary" data={pieDataTasksStatus} colors={pieDataTasksStatusColor} />
        </div>
      )}
    </div>
  );
}

export default IndexGraphicsSection;
