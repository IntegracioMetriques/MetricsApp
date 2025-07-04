import {
  transformCreatedPRsDataForLineChart,
  transformMergedPRsDataForLineChart,
  getRadarAndPieDataForCreatedPRs,
  getRadarAndPieDataForMergedPRs,
  getGaugeChartDataMergedPRs,
  getGaugeChartDataReviewedPRs,
  getGaugeChartDataMergesPRs,
  getGaugeDataCreatedPRsPerUser,
  getGaugeDataMergedPRsPerUser,
  transformCreatedPRsDataForUser,
  transformMergedPRsDataForUser,
  transformPRDataForAreaChart,
  getPieDataPullRequestStatus
} from '../domain/pullRequests';

describe('pullRequests', () => {
  const mockPRsData = {
    '2025-06-01': {
      pull_requests: {
        created: {
          pau: 2,
          lluis: 3,
        },
        merged_per_member: {
          pau: 1,
          lluis: 2,
        },
        total: 5,
        merged: 3,
        closed: 1,
      },
    },
    '2025-06-02': {
      pull_requests: {
        created: {
          pau: 3,
          lluis: 4,
        },
        merged_per_member: {
          pau: 2,
          lluis: 3,
        },
        total: 7,
        merged: 5,
        closed: 1,
      },
    },
  };

  test('transformCreatedPRsDataForLineChart works as expected', () => {
    const { xDataCreated, seriesDataCreated } = transformCreatedPRsDataForLineChart(mockPRsData);
    expect(xDataCreated).toEqual(['2025-06-01', '2025-06-02']);
    expect(seriesDataCreated).toEqual([
      { name: 'pau', data: [2, 3] },
      { name: 'lluis', data: [3, 4] },
    ]);
  });

  test('transformMergedPRsDataForLineChart works as expected', () => {
    const { xDataMerged, seriesDataMerged } = transformMergedPRsDataForLineChart(mockPRsData);
    expect(xDataMerged).toEqual(['2025-06-01', '2025-06-02']);
    expect(seriesDataMerged).toEqual([
      { name: 'pau', data: [1, 2] },
      { name: 'lluis', data: [2, 3] },
    ]);
  });

  const aggregatedData = {
    pull_requests: {
      created: {
        pau: 3,
        lluis: 5,
      },
      merged_per_member: {
        pau: 2,
        lluis: 3,
      },
      total: 10,
      merged: 5,
      closed: 2,
      not_merged_by_author: 3,
    },
    commit_merges: 6,
  };

  test('getRadarAndPieDataForCreatedPRs returns correct radar and pie data', () => {
    const { radarDataCreated, pieDataCreated } = getRadarAndPieDataForCreatedPRs(aggregatedData);
    expect(radarDataCreated).toEqual({ pau: 3, lluis: 5 });
    expect(pieDataCreated).toEqual([['pau', 3], ['lluis', 5]]);
  });

  test('getRadarAndPieDataForMergedPRs returns correct radar and pie data', () => {
    const { radarDataMerged, pieDataMerged } = getRadarAndPieDataForMergedPRs(aggregatedData);
    expect(radarDataMerged).toEqual({ pau: 2, lluis: 3 });
    expect(pieDataMerged).toEqual([['pau', 2], ['lluis', 3]]);
  });

  test('getGaugeChartDataMergedPRs returns correct percentage', () => {
    const result = getGaugeChartDataMergedPRs(aggregatedData);
    expect(result).toBe(5 / (10 - 2));
  });

  test('getGaugeChartDataReviewedPRs returns correct percentage', () => {
    const result = getGaugeChartDataReviewedPRs(aggregatedData);
    expect(result).toBe(3 / 5);
  });

  test('getGaugeChartDataMergesPRs returns correct percentage', () => {
    const result = getGaugeChartDataMergesPRs(aggregatedData);
    expect(result).toBe(5 / 6);
  });

  test('getGaugeDataCreatedPRsPerUser returns correct user percentages', () => {
    const result = getGaugeDataCreatedPRsPerUser(aggregatedData);
    expect(result).toEqual([
      { user: 'pau', percentage: 3 / 10 },
      { user: 'lluis', percentage: 5 / 10 },
    ]);
  });

  test('getGaugeDataMergedPRsPerUser returns correct user percentages', () => {
    const result = getGaugeDataMergedPRsPerUser(aggregatedData);
    expect(result).toEqual([
      { user: 'pau', percentage: 2 / 5 },
      { user: 'lluis', percentage: 3 / 5 },
    ]);
  });
  test('transformCreatedPRsDataForUser returns correct created PRs data for pau', () => {
    const { xDataCreatedPRs, yDataCreatedPRs } = transformCreatedPRsDataForUser(mockPRsData, 'pau');
    expect(xDataCreatedPRs).toEqual(['2025-06-01', '2025-06-02']);
    expect(yDataCreatedPRs).toEqual([2, 3]);
  });

  test('transformMergedPRsDataForUser returns correct merged PRs data for lluis', () => {
    const { xDataMergedPRs, yDataMergedPRs } = transformMergedPRsDataForUser(mockPRsData, 'lluis');
    expect(xDataMergedPRs).toEqual(['2025-06-01', '2025-06-02']);
    expect(yDataMergedPRs).toEqual([2, 3]);
  });

  test('transformPRDataForAreaChart works as expected', () => {
  const { xDataPRs, areaPRData } = transformPRDataForAreaChart(mockPRsData);

  expect(xDataPRs).toEqual(['2025-06-01', '2025-06-02']);
  expect(areaPRData).toEqual([
    { label: 'Merged', data: [3, 5], color: 'rgb(0, 255, 0)' },
    { label: 'Closed', data: [1, 1], color: 'orange' },
    { label: 'Open', data: [1, 1], color: 'rgb(255, 0, 0)' },
  ]); 
});

test('getPieDataPullRequestStatus returns correct pie data and colors', () => {
  const { pieDataPullRequestStatus, pieDataPullRequestStatusColor } = getPieDataPullRequestStatus(aggregatedData);

  expect(pieDataPullRequestStatus).toEqual([
    ['Open', aggregatedData.pull_requests.total - aggregatedData.pull_requests.merged - aggregatedData.pull_requests.closed],
    ['Closed', aggregatedData.pull_requests.closed],
    ['Merged', aggregatedData.pull_requests.merged],
  ]);
  expect(pieDataPullRequestStatusColor).toEqual(['red', 'orange', 'green']);
});
});
