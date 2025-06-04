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

export const transformCommitsDataForLineChart = (data) => {
  const xDataCommits = [];
  const userSeries = {};

  for (const date in data) {
    xDataCommits.push(date);
    const commits = data[date].commits;

    for (const user in commits) {
      if (user === 'total' || user === 'anonymous') continue;
      if (!userSeries[user]) userSeries[user] = [];
      userSeries[user].push(commits[user]);
    }
  }

  const seriesDataCommits = Object.keys(userSeries).map(user => ({
    name: user,
    data: userSeries[user]
  }));

  return { xDataCommits, seriesDataCommits };
};

export const transformModifiedLinesDataForLineChart = (data) => {
  const xDataModified = [];
  const userSeries = {};

  for (const date in data) {
    xDataModified.push(date);
    const modifiedLines = data[date].modified_lines;

    for (const user in modifiedLines) {
      if (user === 'total') continue;
      if (!userSeries[user]) userSeries[user] = [];
      userSeries[user].push(modifiedLines[user].modified);
    }
  }

  const seriesModified = Object.keys(userSeries).map(user => ({
    name: user,
    data: userSeries[user]
  }));

  return { xDataModified, seriesModified };
};

export const prepareRadarData = (modifiedLinesData) => {
  const radarChartModifiedLines = {};
  for (const [user, { modified }] of Object.entries(modifiedLinesData)) {
    radarChartModifiedLines[user] = modified;
  }
  return radarChartModifiedLines;
};

export const getPieChartData = (dataObj, key = null) => {
  return Object.entries(dataObj)
    .filter(([user]) => user !== 'total' && user !== 'anonymous')
    .map(([user, val]) => [user, key ? val[key] : val]);
};

export const getGaugeChartPercentages = (dataObj, totalKey, anonymousKey = null) => {
  const total = dataObj[totalKey];
  const anonymous = anonymousKey ? dataObj[anonymousKey] : 0;
  return Object.entries(dataObj)
    .filter(([user]) => user !== totalKey && user !== anonymousKey)
    .map(([user, val]) => ({
      user,
      percentage: (total - anonymous) > 0 ? val / (total - anonymous) : 0
    }));
};

export const getGaugeChartModifiedLines = (dataObj, totalKey) => {
  const total = dataObj[totalKey].modified;
  return Object.entries(dataObj)
    .filter(([user]) => user !== totalKey)
    .map(([user, val]) => ({
      user,
      percentage: total > 0 ? val.modified / total : 0
    }));
};
