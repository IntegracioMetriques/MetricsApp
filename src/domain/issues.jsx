
export const filterHistoricData = (data, days) => {
  if (days === "lifetime") return data;

  const today = new Date();
  const cutoff = new Date(today);
  cutoff.setDate(today.getDate() - parseInt(days));
  const cutoffDateString = cutoff.toISOString().split("T")[0];

  const filtered = {};
  for (const date in data) {
    if (date >= cutoffDateString) {
      filtered[date] = data[date];
    }
  }

  return filtered;
};

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

export const getRadarAndPieDataAssigned = (data) => {
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

export const getGaugeDataAssigned = (data) => {
  const total = data.issues.total || 0;
  const nonAssigned = data.issues.assigned['non_assigned'] || 0;
  const assigned = total - nonAssigned;
  return total > 0 ? assigned / total : 0;
};

export const getGaugeDataAssignedPerUser = (data) => {
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

export const getGaugeDataClosedPerUser = (data) => {
  return Object.entries(data.issues.closed).map(([user, closed]) => {
    const assigned = data.issues.assigned[user] || 0;
    return {
      user,
      percentage: assigned > 0 ? closed / assigned : 0,
    };
  });
};

export const getGaugeDataHavePR = (data) => {
  const totalClosed = data.issues.total_closed || 0;
  const havePullRequest = data.issues.have_pull_request || 0;
  return totalClosed > 0 ? havePullRequest / totalClosed : 0;
};
