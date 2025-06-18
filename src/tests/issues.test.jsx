import {
  transformAssignedIssuesDataForLineChart,
  getRadarAndPieDataIssuesAssigned,
  getGaugeDataIssuesAssigned,
  getGaugeDataAssignedIssuesPerUser,
  getGaugeDataClosedIssuesPerUser,
  getGaugeDataIssuesHavePR,
  transformAssignedIssuesDataForUser,
  transformClosedIssuesDataForUser,
  transformIssuesDataForAreaChart,
  getPieDataIssuesStatus
} from '../domain/issues'; 

describe('issues', () => {
  const mockHistoricData = {
    '2025-06-01': {
      issues: {
        assigned: { pau: 3, lluis: 5, non_assigned: 1 },
        closed: { pau: 2, lluis: 3, non_assigned: 1 },
        total_closed: 5,
        total: 9
      },
    },
    '2025-06-02': {
      issues: {
        assigned: { pau: 4, lluis: 6, non_assigned: 2 },
        closed: { pau: 2, lluis: 3},
        total_closed: 5,
        total: 12

      },
    },
  };

  const mockData = {
    issues: {
      total: 20,
      total_closed: 10,
      have_pull_request: 7,
      assigned: {
        pau: 5,
        lluis: 5,
        non_assigned: 10,
      },
      closed: {
        pau: 3,
        lluis: 2,
      },
    },
  };

  test('transformAssignedIssuesDataForLineChart returns expected structure', () => {
    expect(transformAssignedIssuesDataForLineChart(mockHistoricData)).toEqual({
      xDataAssigned: ['2025-06-01', '2025-06-02'],
      seriesDataAssigned: [
        { name: 'pau', data: [3, 4] },
        { name: 'lluis', data: [5, 6] },
      ],
    });
  });

  test('getRadarAndPieDataAssigned returns radarData and pieData excluding non_assigned and total', () => {
    expect(getRadarAndPieDataIssuesAssigned(mockData)).toEqual({
      radarData: { pau: 5, lluis: 5 },
      pieData: [['pau', 5], ['lluis', 5]],
    });
  });

  test('getGaugeDataAssigned returns correct overall assigned percentage', () => {
    expect(getGaugeDataIssuesAssigned(mockData)).toEqual((20 - 10) / 20);
  });

  test('getGaugeDataAssignedPerUser returns array with user and percentage', () => {
    expect(getGaugeDataAssignedIssuesPerUser(mockData)).toEqual([
      { user: 'pau', percentage: 5 / 10 },
      { user: 'lluis', percentage: 5 / 10 },
    ]);
  });

  test('getGaugeDataClosedPerUser returns array with user and percentage', () => {
    expect(getGaugeDataClosedIssuesPerUser(mockData)).toEqual([
      { user: 'pau', percentage: 3 / 5 },
      { user: 'lluis', percentage: 2 / 5 },
    ]);
  });

  test('getGaugeDataIssuesHavePR returns correct percentage of PRs', () => {
    expect(getGaugeDataIssuesHavePR(mockData)).toEqual(7 / 10);
  });
  test('transformAssignedIssuesDataForUser returns correct data for given user', () => {
    const { xDataAssignedIssues, yDataAssignedIssues } = transformAssignedIssuesDataForUser(mockHistoricData, 'pau');
    expect(xDataAssignedIssues).toEqual(['2025-06-01', '2025-06-02']);
    expect(yDataAssignedIssues).toEqual([3, 4]);
  });

  test('transformClosedIssuesDataForUser returns correct data for given user', () => {
    const { xDataClosedIssues, yDataClosedIssues } = transformClosedIssuesDataForUser(mockHistoricData, 'pau');
    expect(xDataClosedIssues).toEqual(['2025-06-01', '2025-06-02']);
    expect(yDataClosedIssues).toEqual([2, 2]);
  });

  test('transformIssuesDataForAreaChart transforms correctly', () => {
    const result = transformIssuesDataForAreaChart(mockHistoricData);
    expect(result.xDataIssues).toEqual(['2025-06-01', '2025-06-02']);
    expect(result.closedIssues).toEqual([5,5]);
    expect(result.openIssues).toEqual([4,7]);

  });
  test('getPieDataIssuesStatus returns correct open and closed issues data and colors', () => {
  expect(getPieDataIssuesStatus(mockData)).toEqual({
    pieDataIssuesStatus: [
      ['Open', 10], 
      ['Closed', 10],
    ],
    pieDataIssuesStatusColor: ['red', 'green'],
  });
});
});
