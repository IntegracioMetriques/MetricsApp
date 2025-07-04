export const getGaugeDataAnonymous = (data) => {
  return data.commits?.total > 0 ? ((data.commits?.total || 0) - (data.commits?.anonymous || 0)) / data.commits?.total : 0
}

export const transformCommitsDataForLineChart = (data) => {
  const xData = [];
  const userSeries = {};

  for (const date in data) {
    xData.push(date);
    const commits = data[date].commits || {};

    for (const user in commits) {
      if (user === 'total' || user === 'anonymous') continue;
      if (!userSeries[user]) userSeries[user] = [];
      userSeries[user].push(commits[user]);
    }
  }

  const seriesData = Object.keys(userSeries).map(user => ({
    name: user,
    data: userSeries[user]
  }));

  return { xData, seriesData };
};

export const transformModifiedLinesDataForLineChart = (data) => {
  const xData = [];
  const userSeries = {};

  for (const date in data) {
    xData.push(date);
    const modifiedLines = data[date].modified_lines || {};

    for (const user in modifiedLines) {
      if (user === 'total') continue;
      if (!userSeries[user]) userSeries[user] = [];
      userSeries[user].push(modifiedLines[user]?.modified || 0);
    }
  }

  const seriesData = Object.keys(userSeries).map(user => ({
    name: user,
    data: userSeries[user]
  }));

  return { xData, seriesData };
};

export const GetRadarDataCommits = (data) => {
  const radarData = {};
  for (const [user, val] of Object.entries(data.commits || {})) {
    if (user !== 'total' && user !== 'anonymous') {
      radarData[user] = val;
    }
  }
  return radarData;
};

export const GetRadarDataModifiedLines = (data) => {
  const radarData = {};
  for (const [user, val] of Object.entries(data.modified_lines || {})) {
    if (user !== 'total' && val.modified !== undefined) {
      radarData[user] = val.modified;
    }
  }
  return radarData;
};

export const getPieChartDataCommits = (data) => {
  return Object.entries(data.commits || {})
    .filter(([user]) => user !== 'total' && user !== 'anonymous')
    .map(([user, val]) => [user, val]);
};

export const getPieChartDataModifiedLines = (data) => {
  return Object.entries(data.modified_lines || {})
    .filter(([user]) => user !== 'total')
    .map(([user, val]) => [user, val.modified]);
};

export const getGaugeChartDataCommits = (data) => {
  const total = data.commits?.total || 0;
  const anonymous = data.commits?.anonymous || 0;
  const denominator = total - anonymous;

  return Object.entries(data.commits || {})
    .filter(([user]) => user !== 'total' && user !== 'anonymous')
    .map(([user, val]) => ({
      user,
      percentage: denominator > 0 ? val / denominator : 0,
    }));
};

export const getGaugeChartDataModifiedLines = (data) => {
  const totalModified = data.modified_lines?.total?.modified || 0;

  return Object.entries(data.modified_lines || {})
    .filter(([user]) => user !== 'total')
    .map(([user, val]) => ({
      user,
      percentage: totalModified > 0 ? val.modified / totalModified : 0,
    }));
};

export const transformCommitsDataForUser = (data, username) => {
    const xDataCommits = [];
    const yDataCommits = [];
  
    for (const date in data) {
      xDataCommits.push(date);
      yDataCommits.push(data[date].commits[username] || 0);
    }
  
    return { xDataCommits, yDataCommits };
  };
  
export const transformModifiedLinesDataForUser = (data, username) => {
    const xDataModifiedLines = [];
    const yDataModifiedLines = [];
  
    for (const date in data) {
      const userData = data[date].modified_lines[username].modified;
      xDataModifiedLines.push(date);
      yDataModifiedLines.push(userData);
    }
  
    return { xDataModifiedLines, yDataModifiedLines };
  };

  export const transformDataForLineChartCommits = (data) => {
    const xData = []; 
    const yData = []; 
    for (const date in data) {
          xData.push(date);
          yData.push(data[date].commits.total); 
        }
      
    return { xData, yData };
    };

  export const transformDataForLineChartModifiedLines = (data) => {
    const xDataModifedLines = []; 
    const yDataModifedLines = []; 
    for (const date in data) {
          xDataModifedLines.push(date);
          yDataModifedLines.push(data[date].modified_lines.total.modified); 
        }
      
    return { xDataModifedLines, yDataModifedLines };
  };
