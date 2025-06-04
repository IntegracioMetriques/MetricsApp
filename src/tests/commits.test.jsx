import {
  filterHistoricData,
  transformCommitsDataForLineChart,
  transformModifiedLinesDataForLineChart,
  GetRadarDataCommits,
  GetRadarDataModifiedLines,
  getPieChartDataCommits,
  getPieChartDataModifiedLines,
  getGaugeChartDataCommits,
  getGaugeChartDataModifiedLines,
} from '../domain/commits';

describe('commits utils', () => {
  const mockHistoricData = {
    '2025-06-01': {
      commits: {
        pau: 3,
        lluis: 5,
        total: 8,
        anonymous: 1,
      },
      modified_lines: {
        pau: { modified: 100 },
        lluis: { modified: 200 },
        total: { modified: 300 },
      },
    },
    '2025-06-02': {
      commits: {
        pau: 4,
        lluis: 6,
        total: 10,
        anonymous: 2,
      },
      modified_lines: {
        pau: { modified: 150 },
        lluis: { modified: 250 },
        total: { modified: 400 },
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

  test('transformCommitsDataForLineChart works as expected', () => {
    const { xData, seriesData } = transformCommitsDataForLineChart(mockHistoricData);
    expect(xData).toEqual(['2025-06-01', '2025-06-02']);
    expect(seriesData).toEqual([
      { name: 'pau', data: [3, 4] },
      { name: 'lluis', data: [5, 6] },
    ]);
  });

  test('transformModifiedLinesDataForLineChart works as expected', () => {
    const { xData, seriesData } = transformModifiedLinesDataForLineChart(mockHistoricData);
    expect(xData).toEqual(['2025-06-01', '2025-06-02']);
    expect(seriesData).toEqual([
      { name: 'pau', data: [100, 150] },
      { name: 'lluis', data: [200, 250] },
    ]);
  });

  test('GetRadarDataCommits returns correct radar data excluding total and anonymous', () => {
    const input = {
      commits: {
        pau: 7,
        lluis: 8,
        total: 15,
        anonymous: 3,
      },
    };
    expect(GetRadarDataCommits(input)).toEqual({ pau: 7, lluis: 8 });
  });

  test('GetRadarDataModifiedLines returns correct radar data excluding total', () => {
    const input = {
      modified_lines: {
        pau: { modified: 100 },
        lluis: { modified: 200 },
        total: { modified: 300 },
      },
    };
    expect(GetRadarDataModifiedLines(input)).toEqual({ pau: 100, lluis: 200 });
  });

  test('getPieChartDataCommits returns filtered array excluding total and anonymous', () => {
    const input = {
      commits: {
        pau: 5,
        lluis: 10,
        total: 15,
        anonymous: 2,
      },
    };
    expect(getPieChartDataCommits(input)).toEqual([
      ['pau', 5],
      ['lluis', 10],
    ]);
  });

  test('getPieChartDataModifiedLines returns filtered array excluding total', () => {
    const input = {
      modified_lines: {
        pau: { modified: 100 },
        lluis: { modified: 200 },
        total: { modified: 300 },
      },
    };
    expect(getPieChartDataModifiedLines(input)).toEqual([
      ['pau', 100],
      ['lluis', 200],
    ]);
  });

  test('getGaugeChartDataCommits returns correct percentages excluding total and anonymous', () => {
    const input = {
      commits: {
        pau: 4,
        lluis: 6,
        total: 10,
        anonymous: 1,
      },
    };
    const result = getGaugeChartDataCommits(input);
    expect(result).toEqual([
      { user: 'pau', percentage: 4 / 9 },
      { user: 'lluis', percentage: 6 / 9 },
    ]);
  });

  test('getGaugeChartDataModifiedLines returns correct percentages excluding total', () => {
    const input = {
      modified_lines: {
        pau: { modified: 100 },
        lluis: { modified: 300 },
        total: { modified: 400 },
      },
    };
    const result = getGaugeChartDataModifiedLines(input);
    expect(result).toEqual([
      { user: 'pau', percentage: 100 / 400 },
      { user: 'lluis', percentage: 300 / 400 },
    ]);
  });
});
