import {
  filterHistoricData,
  transformAssignedIssuesDataForLineChart,
  getRadarAndPieDataAssigned,
  getGaugeDataAssigned,
  getGaugeDataAssignedPerUser,
  getGaugeDataClosedPerUser,
  getGaugeDataHavePR,
} from '../domain/issues'; 

describe('issues utils', () => {
  const mockHistoricData = {
    '2025-06-01': {
      issues: {
        assigned: { pau: 3, lluis: 5, non_assigned: 1 },
      },
    },
    '2025-06-02': {
      issues: {
        assigned: { pau: 4, lluis: 6, non_assigned: 2 },
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

  test('filterHistoricData returns full data for "lifetime"', () => {
    expect(filterHistoricData(mockHistoricData, 'lifetime')).toEqual(mockHistoricData);
  });

  test('filterHistoricData filters correctly by days', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2025-06-03'));

    const filtered = filterHistoricData(mockHistoricData, '1');
    expect(Object.keys(filtered)).toEqual(['2025-06-02']);

    vi.useRealTimers();
  });

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
    expect(getRadarAndPieDataAssigned(mockData)).toEqual({
      radarData: { pau: 5, lluis: 5 },
      pieData: [['pau', 5], ['lluis', 5]],
    });
  });

  test('getGaugeDataAssigned returns correct overall assigned percentage', () => {
    expect(getGaugeDataAssigned(mockData)).toEqual((20 - 10) / 20);
  });

  test('getGaugeDataAssignedPerUser returns array with user and percentage', () => {
    expect(getGaugeDataAssignedPerUser(mockData)).toEqual([
      { user: 'pau', percentage: 5 / 10 },
      { user: 'lluis', percentage: 5 / 10 },
    ]);
  });

  test('getGaugeDataClosedPerUser returns array with user and percentage', () => {
    expect(getGaugeDataClosedPerUser(mockData)).toEqual([
      { user: 'pau', percentage: 3 / 5 },
      { user: 'lluis', percentage: 2 / 5 },
    ]);
  });

  test('getGaugeDataHavePR returns correct percentage of PRs', () => {
    expect(getGaugeDataHavePR(mockData)).toEqual(7 / 10);
  });
});
