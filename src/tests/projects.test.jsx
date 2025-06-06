import {
  getActiveIteration,
  filterHistoricDataByIteration,
  transformAssignedTasksDataForLineChart,
  transformFeatureDataForAreaChart,
  getRadarPieDataAssignedTasks,
  getDateRangeForIteration,
  getIssueTypeDataForChart,
  getFeatureDataForChart,
  getGaugeDataTasksAssigned,
  getGaugeDataTasksStandardStatus,
  getGaugeDataItemsIssues,
  getGaugeDataItemIssuesWithType,
  getGaugeDataItemIssuesWithIteration,
  getGaugeDataAssignedTasksPerUser,
  getGaugeDataInProgressTasksPerUser,
  getGaugeDataDoneTasksPerUser,
  getGaugeDataStandardStatusTasksPerUser,
  transformTasksAssignedDataForUser,
  transformTasksToDoDataForUser,
  transformTasksInProgressDataForUser,
  transformTasksDoneDataForUser,
  transformTasksStandardDataForUser,
} from '../domain/projects';

describe('projects', () => {
  const mockData = {
    project: {
      has_iterations: true,
      iterations: {
        it1: {
          startDate: '2025-06-01',
          endDate: '2025-06-03',
        },
      },
      metrics_by_iteration: {
        it1: {
          assigned_per_member: {
            pau: 3,
            lluis: 2,
            non_assigned: 6,
          },
          in_progress_per_member: {
            pau: 1,
            lluis: 0,
          },
          done_per_member: {
            pau: 2,
            lluis: 1,
          },
          todo_per_member: {
            pau: 0,
            lluis: 1,
          },
        new_state_per_member: {
            pau: 0,
            lluis: 1,
          },
          in_progress: 3,
          done: 4,
          todo: 3,
          new_state: 1,
          total_tasks: 11,
          total_issues: 4,
          total_issues_with_type: 3,
          total: 12,
          total_features_todo: 1,
          total_features_in_progress: 2,
          total_features_done: 3,
          total_features_new_state: 5,
          total_bugs: 2,
          total_features: 3
        },
        no_iteration: {
            total: 1
        },
        total: {
          assigned_per_member: {
            pau: 3,
            lluis: 2,
            non_assigned: 6,
          },
          in_progress_per_member: {
            pau: 1,
            lluis: 0,
          },
          done_per_member: {
            pau: 2,
            lluis: 1,
          },
          todo_per_member: {
            pau: 0,
            lluis: 1,
          },
        new_state_per_member: {
            pau: 0,
            lluis: 1,
          },
          in_progress: 3,
          done: 4,
          todo: 3,
          new_state: 1,
          total_tasks: 12,
          total_issues: 4,
          total_issues_with_type: 3,
          total: 13,
          total_features_todo: 1,
          total_features_in_progress: 2,
          total_features_done: 3,
          total_features_new_state: 5,
          total_bugs: 2,
          total_features: 3        }
      }
    }
  };

  const mockHistoricData = {
    '2025-06-01': mockData,
    '2025-06-02': mockData,
  };

test('getActiveIteration returns correct iteration with mocked date', () => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2025-06-02'));

  const result = getActiveIteration(mockData);
  expect(result).toBe('it1');

  vi.useRealTimers();
});

  test('filterHistoricDataByIteration filters data correctly', () => {
    const result = filterHistoricDataByIteration(mockData, mockHistoricData, 'it1');
    expect(Object.keys(result)).toEqual(['2025-06-01', '2025-06-02']);
  });

  test('getRadarPieDataAssignedTasks returns radar and pie data', () => {
    const result = getRadarPieDataAssignedTasks(mockData, 'it1');
    expect(result).toEqual({
      radarDataAssigned: { pau: 3, lluis: 2 },
      pieDataAssigned: [['pau', 3], ['lluis', 2]],
    });
  });

  test('getGaugeDataTasksAssigned returns correct percentage', () => {
    expect(getGaugeDataTasksAssigned(mockData, 'it1')).toBe((5 / 11));
  });

  test('getGaugeDataTasksStandardStatus returns correct percentage', () => {
    expect(getGaugeDataTasksStandardStatus(mockData, 'it1')).toBe((10 / 11));
  });

  test('getGaugeDataItemsIssues returns correct percentage', () => {
    expect(getGaugeDataItemsIssues(mockData, 'it1')).toBe(4 / 12);
  });

  test('getGaugeDataItemIssuesWithType returns correct percentage', () => {
    expect(getGaugeDataItemIssuesWithType(mockData, 'it1')).toBe(3 / 4);
  });

  test('getGaugeDataItemIssuesWithIteration returns correct percentage', () => {
    expect(getGaugeDataItemIssuesWithIteration(mockData)).toBe((13 - 1) / 13);
  });

  test('getGaugeDataAssignedTasksPerUser returns per-user assignment percentages', () => {
    expect(getGaugeDataAssignedTasksPerUser(mockData, 'it1')).toEqual([
      { user: 'pau', percentage: 3 / 5 },
      { user: 'lluis', percentage: 2 / 5 },
    ]);
  });

  test('getGaugeDataInProgressTasksPerUser returns 1 if in progress > 0', () => {
    expect(getGaugeDataInProgressTasksPerUser(mockData, 'it1')).toEqual([
      { user: 'pau', percentage: 1 },
      { user: 'lluis', percentage: 0 },
    ]);
  });

  test('getGaugeDataDoneTasksPerUser returns done / assigned per user', () => {
    expect(getGaugeDataDoneTasksPerUser(mockData, 'it1')).toEqual([
      { user: 'pau', percentage: 2 / 3 },
      { user: 'lluis', percentage: 1 / 2 },
    ]);
  });

  test('getGaugeDataStandardStatusTasksPerUser returns correct per user', () => {
    expect(getGaugeDataStandardStatusTasksPerUser(mockData, 'it1')).toEqual([
      { user: 'pau', percentage: 1 },
      { user: 'lluis', percentage: 1 },
    ]);
  });

  test('getDateRangeForIteration returns formatted date range', () => {
    expect(getDateRangeForIteration(mockData, 'it1')).toBe('01/06/2025 - 03/06/2025');
  });

  test('getIssueTypeDataForChart returns pie data and colors', () => {
    const { typePieChartData, typeColorsPieChart } = getIssueTypeDataForChart(mockData, 'it1');
    expect(typePieChartData).toEqual([
      ['Tasks', 11],
      ['Features', 3],
      ['Bugs', 2],
    ]);
    expect(typeColorsPieChart).toEqual(['orange', '#0f58ff', 'red']);
  });

  test('getFeatureDataForChart returns correct pie data and colors', () => {
    const { featurePieChartData, featureColorsPieChart } = getFeatureDataForChart(mockData, 'it1');
    expect(featurePieChartData).toEqual([
      ['To Do', 1],
      ['In Progress', 2],
      ['Done', 3],
      ['New State', 5],
    ]);
    expect(featureColorsPieChart).toEqual(['green', 'orange', 'red']);
  });

  test('transformFeatureDataForAreaChart transforms correctly', () => {
    const result = transformFeatureDataForAreaChart(mockHistoricData);
    expect(result.xDataFeature).toEqual(['2025-06-01', '2025-06-02']);
    expect(result.allSeries.some(s => s.label === 'Done')).toBe(true);
  });

  test('transformTasksAssignedDataForUser returns correct assigned tasks data for pau', () => {
    const { xDataTasksAssigned, yDataTasksAssigned } = transformTasksAssignedDataForUser(mockHistoricData, 'pau');
    expect(xDataTasksAssigned).toEqual(['2025-06-01', '2025-06-02']);
    expect(yDataTasksAssigned).toEqual([3, 3]); 
  });

  test('transformTasksToDoDataForUser returns correct todo tasks data for lluis', () => {
    const { xDataTasksToDo, yDataTasksToDo } = transformTasksToDoDataForUser(mockHistoricData, 'lluis');
    expect(xDataTasksToDo).toEqual(['2025-06-01', '2025-06-02']);
    expect(yDataTasksToDo).toEqual([1, 1]); 
  });

  test('transformTasksInProgressDataForUser returns correct in-progress tasks data for pau', () => {
    const { xDataTasksInProgress, yDataTasksInProgress } = transformTasksInProgressDataForUser(mockHistoricData, 'pau');
    expect(xDataTasksInProgress).toEqual(['2025-06-01', '2025-06-02']);
    expect(yDataTasksInProgress).toEqual([1, 1]); 
  });

  test('transformTasksDoneDataForUser returns correct done tasks data for lluis', () => {
    const { xDataTasksDone, yDataTasksDone } = transformTasksDoneDataForUser(mockHistoricData, 'lluis');
    expect(xDataTasksDone).toEqual(['2025-06-01', '2025-06-02']);
    expect(yDataTasksDone).toEqual([1, 1]); 
  });

  test('transformTasksStandardDataForUser returns sum todo + in_progress + done for pau', () => {
    const { xDataTasksStandard, yDataTasksStandard } = transformTasksStandardDataForUser(mockHistoricData, 'pau');
    expect(xDataTasksStandard).toEqual(['2025-06-01', '2025-06-02']);
    expect(yDataTasksStandard).toEqual([
      0 + 1 + 2,
      0 + 1 + 2, 
    ]);
  });
});
