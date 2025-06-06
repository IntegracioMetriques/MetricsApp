export const transformCreatedPRsDataForLineChart = (data) => {
    const xDataCreated = [];
    const userSeries = {};

    for (const date in data) {
    xDataCreated.push(date);
    const created = data[date].pull_requests.created;

    for (const user in created) {
        if (!userSeries[user]) {
        userSeries[user] = [];
        }
        userSeries[user].push(created[user]);
    }
    }
    const seriesDataCreated = Object.keys(userSeries).map(user => ({
    name: user,
    data: userSeries[user]
    }));

    return { xDataCreated, seriesDataCreated };
};

export const transformMergedPRsDataForLineChart = (data) => {
    const xDataMerged = [];
    const userSeries = {};

    for (const date in data) {
    xDataMerged.push(date);
    const merged = data[date].pull_requests.merged_per_member;

    for (const user in merged) {
        if (!userSeries[user]) {
        userSeries[user] = [];
        }
        userSeries[user].push(merged[user]);
    }
    }
    const seriesDataMerged = Object.keys(userSeries).map(user => ({
    name: user,
    data: userSeries[user]
    }));

    return { xDataMerged, seriesDataMerged };
};

export const getRadarAndPieDataForCreatedPRs = (data) => {
    const radarDataCreated = data.pull_requests.created
    const pieDataCreated = Object.entries(radarDataCreated)
    return {radarDataCreated,pieDataCreated}
}

export const getRadarAndPieDataForMergedPRs = (data) => {
    const radarDataMerged = data.pull_requests.merged_per_member

    const pieDataMerged = Object.entries(radarDataMerged)
    return {radarDataMerged,pieDataMerged}
}

export const getGaugeChartDataMergedPRs = (data) => {
    const total = data.pull_requests.total
    const totalMerged =  data.pull_requests.merged 
    const totalClosed =  data.pull_requests.closed 

    const percentageMerged = (total - totalClosed) > 0 ? totalMerged / (total - totalClosed) : 0

    return percentageMerged
}

export const getGaugeChartDataReviewedPRs = (data) => {
    const totalMerged =  data.pull_requests.merged 
    const totalMergedNotByAuthor = data.pull_requests.not_merged_by_author

    const percentatgeReviewed = totalMerged > 0 ? totalMergedNotByAuthor / totalMerged : 0

    return percentatgeReviewed
}

export const getGaugeChartDataMergesPRs = (data) => {
  const totalMerged =  data.pull_requests.merged 
  const merges = data.commit_merges

  const percentageMergesPR = merges > 0 ? totalMerged / merges : 0

  return percentageMergesPR
}

export const getGaugeDataCreatedPRsPerUser = (data) => {
  const total = data.pull_requests.total  
  return Object.entries(data.pull_requests.created).map(([user, created]) => {
    return {
      user,
      percentage: total > 0 ? created / total : 0,
    };
  });
};


export const getGaugeDataMergedPRsPerUser = (data) => {
  const totalMerged =  data.pull_requests.merged 
  return Object.entries(data.pull_requests.merged_per_member).map(([user, merged]) => {
    return {
      user,
      percentage: totalMerged > 0 ? merged / totalMerged : 0,
    };
  });
};

export const transformCreatedPRsDataForUser = (data, username) => {
    const xDataCreatedPRs = [];
    const yDataCreatedPRs = [];
  
    for (const date in data) {
      xDataCreatedPRs.push(date);
      yDataCreatedPRs.push(data[date].pull_requests?.created?.[username] || 0);
    }
  
    return { xDataCreatedPRs, yDataCreatedPRs };
  };

export const transformMergedPRsDataForUser = (data, username) => {
    const xDataMergedPRs = [];
    const yDataMergedPRs = [];
  
    for (const date in data) {
      xDataMergedPRs.push(date);
      yDataMergedPRs.push(data[date].pull_requests?.merged_per_member?.[username] || 0);
    }
  
    return { xDataMergedPRs, yDataMergedPRs };
  };