export const getActiveIteration = (data) => {
  const has_iterations = data.project.has_iterations;
  const today = new Date();
  if (!has_iterations) return "total";
  const iterations = data.project.iterations
  for (const key in iterations) {
    const { startDate, endDate } = iterations[key];
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (today >= start && today <= end) {
      return key;
    }
  }
  return "total";
  };

export const filterHistoricDataByIteration = (data,dataHist, iterationName) => {
  if (!data) return null;
  if (iterationName === "total") return dataHist;

  const iteration = data.project.iterations[iterationName] || null;
  if (!iteration) return dataHist;

  const startDate = new Date(iteration.startDate);
  const endDate = new Date(iteration.endDate);

  const filtered = {};
  for (const dateStr in dataHist) {
    const date = new Date(dateStr);
    if (date >= startDate && date <= endDate) {
      filtered[dateStr] = dataHist[dateStr];
    }
  }
  return filtered;
  };

export const transformAssignedTasksDataForLineChart = (data,dataHistoric, selectedIteration, iterations) => {
  let allDates = [];
  if (!dataHistoric) return { xDataAssigned: [], seriesDataAssigned: [] }

  if (selectedIteration === "total") {
    allDates = Object.keys(dataHistoric).sort((a,b) => new Date(a) - new Date(b));
  } else {
    const iteration = iterations[selectedIteration];
    if (!iteration) return { xDataAssigned: [], seriesDataAssigned: [] };

    const startDate = new Date(iteration.startDate);
    const endDate = new Date(iteration.endDate);

    const dates = [];
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      dates.push(dateStr);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    allDates = dates;
  }

  const userSeries = {};
  const allUsers = new Set();

  const assignedPerMember = data.project.metrics_by_iteration["total"]?.assigned_per_member || {};

  Object.keys(assignedPerMember)
  .filter(u => u !== "non_assigned")
  .forEach(u => allUsers.add(u));

  allUsers.forEach(u => {
    userSeries[u] = [];
  });

  for (const date of allDates) {
    const dayData = dataHistoric[date];
    const iterationData = dayData?.project?.metrics_by_iteration?.[selectedIteration];
    const assignedPerMember = iterationData?.assigned_per_member || {};
    allUsers.forEach(u => {
      userSeries[u].push(assignedPerMember[u] || null);
    });
  }

  const seriesDataAssigned = Array.from(allUsers).map(u => ({
    name: u,
    data: userSeries[u],
  }));

  return { xDataAssigned: allDates, seriesDataAssigned };
};

export const transformFeatureDataForAreaChart = (data) => {
    const xDataFeature = [];
    const knownKeys = {
      total_features_done: 'Done',
      total_features_in_progress: 'In Progress',
      total_features_todo: 'To Do',
    };

    const baseFeatureData = {
      'Done': [],
      'In Progress': [],
      'To Do': [],
    };

    const otherKeysData = {};
    const allOtherKeys = new Set();

    for (const date in data) {
      const metrics = data[date]?.project?.metrics_by_iteration?.total;
      if (!metrics) continue;

      for (const [key, value] of Object.entries(metrics)) {
        if (
          !Object.keys(knownKeys).includes(key) &&
          typeof value === 'number' &&
          key.startsWith('total_features_') &&
          Number.isInteger(value)
        ) {
          allOtherKeys.add(key);
        }
      }
    }

    for (const key of allOtherKeys) {
      otherKeysData[key] = [];
    }

    for (const date in data) {
      const metrics = data[date]?.project?.metrics_by_iteration?.total || {};

      xDataFeature.push(date);

      for (const [key, label] of Object.entries(knownKeys)) {
        baseFeatureData[label].push(metrics[key] || 0);
      }

      for (const key of allOtherKeys) {
        const value = metrics[key];
        otherKeysData[key].push(Number.isInteger(value) ? value : 0);
      }
    }
    const baseSeries = [
      { label: 'Done', data: baseFeatureData['Done'], color: 'rgb(0, 255, 0)' },
      { label: 'In Progress', data: baseFeatureData['In Progress'], color: 'orange' },
      { label: 'To Do', data: baseFeatureData['To Do'], color: 'rgb(255, 0, 0)' }
    ];

    const otherSeries = Object.entries(otherKeysData).map(([key, data]) => ({
      label: key
        .replace('total_features_', '')
        .replace(/_/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase()),
      data
    }));

    const allSeries = [...baseSeries, ...otherSeries];
    return {xDataFeature, allSeries };
  };

const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
}

export const getRadarPieDataAssignedTasks = (data,iteration) => {
  const { non_assigned, ...assignedPerMember } = data.project.metrics_by_iteration[iteration].assigned_per_member;
  const radarDataAssigned = assignedPerMember;
  const pieDataAssigned = Object.entries(radarDataAssigned)
  return {radarDataAssigned,pieDataAssigned}
} 
export const getDateRangeForIteration = (data,iterationName) => {
    const iteration = data.project.iterations[iterationName];

    if (!iteration) return '';
    return `${formatDate(iteration.startDate)} - ${formatDate(iteration.endDate)}`;
  }
  
export const getIssueTypeDataForChart = (projectData,selectedIteration) => {
    
    const iterationData = projectData?.project?.metrics_by_iteration?.[selectedIteration];

    if (!iterationData) return [];

    const {
      total_tasks = 0,
      total_bugs = 0,
      total_features = 0,
    } = iterationData;
    const typeColorsPieChart = ["orange", "#0f58ff","red"];  
    const typePieChartData = [
      ['Tasks', total_tasks],
      ['Features', total_features],
      ['Bugs', total_bugs],
    ]
    return { typePieChartData, typeColorsPieChart}
  };

export const getFeatureDataForChart = (projectData, selectedIteration) => {
  const iterationData = projectData?.project?.metrics_by_iteration?.[selectedIteration];
  if (!iterationData) return { baseData: [], otherData: [] };

  const baseData = [];
  const otherData = [];

  const knownKeys = {
    total_features_todo: 'To Do',
    total_features_in_progress: 'In Progress',
    total_features_done: 'Done',
  };

  for (const [key, label] of Object.entries(knownKeys)) {
    const value = iterationData[key] || 0;
    baseData.push({ label, value });
  }

  for (const [key, value] of Object.entries(iterationData)) {
    if (
      key.startsWith('total_features_') &&
      !knownKeys.hasOwnProperty(key)
    ) {
      const label = key
        .replace('total_features_', '')
        .replace(/_/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase());
      otherData.push({ label, value });
    }
  }
  const featurePieChartData = [
    ...baseData.map(item => [item.label, item.value]),
    ...otherData.map(item => [item.label, item.value])
  ];  const featureColorsPieChart = ["green", "orange","red"];  
  return {featurePieChartData,featureColorsPieChart};
}

export const getGaugeDataTasksAssigned = (data,iteration) => {
  const { non_assigned, ...assignedPerMember } = data.project.metrics_by_iteration[iteration].assigned_per_member;
  const totalTasks = data.project.metrics_by_iteration[iteration].total_tasks;
  const totalAssigned = Object.values(assignedPerMember).reduce((sum, current) => sum + current, 0);
  const percentageTasksAssigned = totalTasks > 0 ? totalAssigned / totalTasks : 0;
  return percentageTasksAssigned;
}

export const getGaugeDataTasksStandardStatus = (data,iteration) => {
  const totalTasks = data.project.metrics_by_iteration[iteration].total_tasks;
  const totalInProgress = data.project.metrics_by_iteration[iteration].in_progress || 0
  const totalDone = data.project.metrics_by_iteration[iteration].done || 0
  const totalToDo = data.project.metrics_by_iteration[iteration].todo || 0

  const totalStandardStatuses = totalInProgress + totalDone + totalToDo
  const percentageStandardStatus = totalTasks > 0 ? totalStandardStatuses / totalTasks : 0;
  return percentageStandardStatus;
}

export const getGaugeDataItemsIssues = (data,iteration) => {
  const totalIssues = data.project.metrics_by_iteration[iteration].total_issues;
  const totalItems =  data.project.metrics_by_iteration[iteration].total
  const percentageItemsIssues = totalItems > 0 ? totalIssues / totalItems : 0;
  return percentageItemsIssues;
}

export const getGaugeDataItemIssuesWithType= (data,iteration) => {
  const totalIssues = data.project.metrics_by_iteration[iteration].total_issues;
  const totalIssuesWithType = data.project.metrics_by_iteration[iteration].total_issues_with_type
  const percentageItemIssuesWithType = totalIssues > 0 ? totalIssuesWithType / totalIssues : 0

  return percentageItemIssuesWithType;
}

export const getGaugeDataItemIssuesWithIteration= (data) => {
  const taskDataNoIteration = data.project.metrics_by_iteration['no_iteration']
  const taskDataTotal = data.project.metrics_by_iteration['total']
  const itemsTotal = taskDataTotal.total
  const itemsNoIteration = taskDataNoIteration.total
  const percentageIteration = itemsTotal > 0 ? (itemsTotal - itemsNoIteration) / itemsTotal : 0

  return percentageIteration;
}

export const getGaugeDataAssignedTasksPerUser = (data,iteration) => {
  const { non_assigned, ...assignedPerMember } = data.project.metrics_by_iteration[iteration].assigned_per_member;
  const totalAssigned = Object.values(assignedPerMember).reduce((sum, current) => sum + current, 0);
  return Object.entries(assignedPerMember).map(([user, userTasks]) => {
    return {
      user,
      percentage: totalAssigned > 0 ? userTasks / totalAssigned : 0,
    };
  });
};

export const getGaugeDataInProgressTasksPerUser = (data,iteration) => {
  const inProgresPerMember = data.project.metrics_by_iteration[iteration].in_progress_per_member || 0;
  return Object.entries(inProgresPerMember).map(([user, inProgress]) => {
    return {
      user,
      percentage: inProgress > 0 ? 1 : 0,
    };
  });
};

export const getGaugeDataDoneTasksPerUser = (data,iteration) => {
  const { non_assigned, ...assignedPerMember } = data.project.metrics_by_iteration[iteration].assigned_per_member;
  const donePerMember = data.project.metrics_by_iteration[iteration].done_per_member || 0;
  return Object.entries(donePerMember).map(([user, done]) => {
    const assigned = assignedPerMember[user]
    return {
      user,
      percentage: assigned > 0 ? done / assigned : 0,
    };
  });
};

export const getGaugeDataStandardStatusTasksPerUser = (data,iteration) => {
  const { non_assigned, ...assignedPerMember } = data.project.metrics_by_iteration[iteration].assigned_per_member;
  const donePerMember = data.project.metrics_by_iteration[iteration].done_per_member || 0;
  const inProgressPerMember = data.project.metrics_by_iteration[iteration].in_progress_per_member || 0;
  const toDoPerMember = data.project.metrics_by_iteration[iteration].todo_per_member || 0;
  return Object.entries(assignedPerMember).map(([user, assigned]) => {
    const done = donePerMember[user]
    const inProgress = inProgressPerMember[user]
    const toDo = toDoPerMember[user]
    const standardStatus = done + inProgress + toDo
    return {
      user,
      percentage: assigned > 0 ? standardStatus / assigned : 0,
    };
  });
};