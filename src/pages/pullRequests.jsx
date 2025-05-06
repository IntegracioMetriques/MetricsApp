import React from 'react';
import GaugeChart from '../components/gaugeChart';
import '../styles/commits.css';
import RadarPieToggle
 from '../components/RadarPieToggle';
function PullRequests({ data,historicData,features }) {
  const pullRequests = data.pull_requests
  const createdby = pullRequests.created
  const mergedby = pullRequests.merged_per_member
  const totalMerged = pullRequests.merged 
  const totalMergedNotByAuthor = pullRequests.not_merged_by_author
  const totalClosed = pullRequests.closed 
  const total = pullRequests.total
  const totalPeople = Object.keys(createdby).length;
  const merges = data.commit_merges
  return (
    <div className="commits-container">
      <h1>Pull requests</h1>
      <div className="section-background">
      <h2>Summary</h2>
      <div className="summary-charts-container">
        <div className='chart-item'>
        <RadarPieToggle
          radarData={createdby}
          pieData={Object.entries(createdby)}
          title={"Created Pull Requests distribution"}
        />
        </div>
        <div className='chart-item'>
        <RadarPieToggle
          radarData={createdby}
          pieData={Object.entries(createdby)}
          title={"Created Pull Requests distribution"}
        />
        </div>
        <div className='chart-item'>
        <RadarPieToggle
          radarData={mergedby}
          pieData={Object.entries(mergedby)}
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
          <span className="tooltip-text">Percentage of pull requests that are merged relative to the total number of pull requests that are not closed</span>
        </span>
      </h2>
        <GaugeChart
                user="Merged"
                percentage={(total - totalClosed) > 0 ? totalMerged / (total - totalClosed) : 0}
                totalPeople= {1}
              />
      </div> 
      <div> 
      <h2 className="section-title">
        Pull requests not merged by author
        <span className="custom-tooltip">
          ⓘ
          <span className="tooltip-text">
           Percentage of pull requests merged by another user that is not the author relative to the total number of merged pull requests
          </span>
        </span>
      </h2>
            <GaugeChart
              user="Non-author merges"
              percentage={totalMerged > 0 ? totalMergedNotByAuthor / totalMerged : 0}
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
              percentage={merges > 0 ? totalMerged / merges : 0}
              totalPeople={1}
            />
    </div>
    </div> 
    </div>
    <div className='section-background'>
    <h2>Metrics by User</h2>
      <h2 className="section-title">
       Pull requests created per user
        <span className="custom-tooltip">
          ⓘ
          <span className="tooltip-text">Percentage of pull requests created per user relative to the total number of pull requets</span>
        </span>
      </h2>
      <div className="gauge-charts-container">
        {Object.keys(createdby).map((user) => {
          const userPRs = createdby[user];
          const percentage = total > 0 ? userPRs / total : 0;
          return (
          <GaugeChart
            user={user}
            percentage={percentage}
            totalPeople={totalPeople}
          />
          );
        })}
        </div>
        <h2 className="section-title">
       Pull requests merged per user
        <span className="custom-tooltip">
          ⓘ
          <span className="tooltip-text">Percentage of pull requests merged per user relative to the number of merged pull requets</span>
        </span>
      </h2>
      <div className="gauge-charts-container">
        {Object.keys(mergedby).map((user) => {
          const userMergedPRs = mergedby[user];
          const percentage = totalMerged > 0 ? userMergedPRs / totalMerged : 0;
          return (
            <GaugeChart
              user={user}
              percentage={percentage}
              totalPeople={totalPeople}
            />
          );
        })}
        </div>
        </div>
    </div>
  );
}

export default PullRequests;
