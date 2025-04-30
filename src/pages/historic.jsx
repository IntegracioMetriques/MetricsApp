import React from 'react';
import "../styles/index.css"; 
import LineChart from '../components/lineChart';
import AreaChart from '../components/areaChart';


function Historic({ data }) {
    if (!data) {
        return (
            <div style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "80vh",
              textAlign: "center",
              fontSize: "1.8rem",
            }}>
              No s'ha trobat historic_metrics.json.<br />
              Si és el primer dia, torna demà un cop 
              s'hagi fet la primera execució del 
              workflow Daily Metrics.
            </div>
          );    }


    const transformDataForLineChart = (data) => {
        const xData = []; 
        const yData = []; 
          
        for (const date in data) {
              xData.push(date);
              yData.push(data[date].commits.total); 
            }
          
        return { xData, yData };
        };
    const { xData, yData } = transformDataForLineChart(data);
    const transformIssuesDataForAreaChart = (data) => {
      const xDataIssues = [];
      const closedIssues = [];
      const openIssues = [];
      
      for (const date in data) {
        const total = data[date].issues.total || 0;
        const closed = data[date].issues.total_closed || 0;
        const open = total - closed;
        xDataIssues.push(date);
        closedIssues.push(closed);
        openIssues.push(open);
        }
        return { xDataIssues, closedIssues, openIssues };
      };
    const { xDataIssues, closedIssues, openIssues } = transformIssuesDataForAreaChart(data);
    const transformPRDataForAreaChart = (data) => {
      const xDataPRs = [];
      const mergedPRs = [];
      const openPRs = [];
      
      for (const date in data) {
        const total = data[date].pull_requests.total || 0;
        const merged = data[date].pull_requests.merged || 0;
        const closed = data[date].pull_requests.closed || 0;
        const open = total - merged - closed;
        xDataPRs.push(date);
        mergedPRs.push(merged);
        openPRs.push(open);
        }
        return { xDataPRs, mergedPRs, openPRs };
      };
    const { xDataPRs, mergedPRs, openPRs } = transformPRDataForAreaChart(data);
    return (
      <div>
        <h1>Historical Data</h1>
        <div className='radar-charts-wrapper'>
            <div className='radar-chart-container'>
            <LineChart 
                xData={xData}  
                yData={yData}  
                xLabel="Date"   
                yLabel="Commits"
                title="Commits Over Time"                 
            />
            </div>
            <div className='radar-chart-container'>
            <AreaChart 
                xData={xDataIssues}
                topData={openIssues}
                bottomData={closedIssues}
                topColor="rgb(255, 0, 0)"
                bottomColor="rgb(0, 255, 0)"
                toplabel="Open"
                bottomLabel="Closed"
                xLabel="Date"
                yLabel="Issues"
                title="Open and Closed Issues Over Time"
            />           
            </div>
            <div className='radar-chart-container'>
            <AreaChart 
                xData={xDataPRs}
                topData={openPRs}
                bottomData={mergedPRs}
                topColor="rgb(255, 0, 0)"
                bottomColor="rgb(0, 255, 0)"
                toplabel="Open"
                bottomLabel="Merged"
                xLabel="Date"
                yLabel="Issues"
                title="Open and Merged Pull Requests Over Time"
            />           
            </div>
            </div>
      </div>
    );
  }
  
  export default Historic;
  
