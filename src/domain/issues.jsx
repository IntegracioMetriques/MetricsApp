
export const transformAssignedIssuesDataForLineChart = (data) => {
  const xDataAssigned = [];
  const userSeries = {};

  for (const date in data) {
    xDataAssigned.push(date);
    const issues = data[date].issues.assigned;

    for (const user in issues) {
      if (user === 'non_assigned') continue;
      if (!userSeries[user]) {
        userSeries[user] = [];
      }
      userSeries[user].push(issues[user]);
    }
  }

  const seriesDataAssigned = Object.keys(userSeries).map(user => ({
    name: user,
    data: userSeries[user]
  }));

  return { xDataAssigned, seriesDataAssigned };
};

export const getRadarAndPieDataIssuesAssigned = (data) => {
  const radarData = {};
  const assigned = data.issues.assigned || {};
  for (const [user, val] of Object.entries(assigned)) {
    if (user !== 'non_assigned' && user !== 'total') {
      radarData[user] = val;
    }
  }
  const pieData =  Object.entries(radarData)
    return { radarData, pieData };
};

export const getGaugeDataIssuesAssigned = (data) => {
  const total = data.issues.total || 0;
  const nonAssigned = data.issues.assigned['non_assigned'] || 0;
  const assigned = total - nonAssigned;
  return total > 0 ? assigned / total : 0;
};

export const getGaugeDataAssignedIssuesPerUser = (data) => {
  const total = data.issues.total || 0;
  const nonAssigned = data.issues.assigned['non_assigned'] || 0;
  const totalAssigned = total - nonAssigned;

  return Object.entries(data.issues.assigned)
    .filter(([user]) => user !== 'non_assigned')
    .map(([user, assigned]) => ({
      user,
      percentage: totalAssigned > 0 ? assigned / totalAssigned : 0,
    }));
};

export const getGaugeDataClosedIssuesPerUser = (data) => {
  return Object.entries(data.issues.closed).map(([user, closed]) => {
    const assigned = data.issues.assigned[user] || 0;
    return {
      user,
      percentage: assigned > 0 ? closed / assigned : 0,
    };
  });
};

export const getGaugeDataIssuesHavePR = (data) => {
  const totalClosed = data.issues.total_closed || 0;
  const havePullRequest = data.issues.have_pull_request || 0;
  return totalClosed > 0 ? havePullRequest / totalClosed : 0;
};

export const transformAssignedIssuesDataForUser = (data, username) => {
    const xDataAssignedIssues = [];
    const yDataAssignedIssues = [];
  
    for (const date in data) {
      xDataAssignedIssues.push(date);
      yDataAssignedIssues.push(data[date].issues?.assigned?.[username] || 0);
    }
  
    return { xDataAssignedIssues, yDataAssignedIssues };
  }; 

export const transformClosedIssuesDataForUser = (data, username) => {
    const xDataClosedIssues = [];
    const yDataClosedIssues = [];
  
    for (const date in data) {
      xDataClosedIssues.push(date);
      yDataClosedIssues.push(data[date].issues?.closed?.[username] || 0);
    }
  
    return { xDataClosedIssues, yDataClosedIssues };
  };