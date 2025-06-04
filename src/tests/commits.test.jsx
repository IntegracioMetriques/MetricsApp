import {
  filterHistoricData,
  transformCommitsDataForLineChart,
  transformModifiedLinesDataForLineChart,
  prepareRadarData,
  getPieChartData,
  getGaugeChartPercentages,
  getGaugeChartModifiedLines,
} from '../domain/commits';

describe('commitsCalculations utils', () => {
  const mockHistoricData = {
    '2025-06-01': {
      commits: {
        pau: 3,
        lluis: 5,
        total: 8,
        anonymous: 1
      },
      modified_lines: {
        pau: { modified: 100 },
        lluis: { modified: 200 },
        total: { modified: 300 }
      }
    },
    '2025-06-02': {
      commits: {
        pau: 4,
        lluis: 6,
        total: 10,
        anonymous: 2
      },
      modified_lines: {
        pau: { modified: 150 },
        lluis: { modified: 250 },
        total: { modified: 400 }
      }
    }
  };

  test('filterHistoricData returns full data for "lifetime"', () => {
    expect(filterHistoricData(mockHistoricData, 'lifetime')).toEqual(mockHistoricData);
  });

  test('transformCommitsDataForLineChart works as expected', () => {
    const { xDataCommits, seriesDataCommits } = transformCommitsDataForLineChart(mockHistoricData);
    expect(xDataCommits).toEqual(['2025-06-01', '2025-06-02']);
    expect(seriesDataCommits).toEqual([
      { name: 'pau', data: [3, 4] },
      { name: 'lluis', data: [5, 6] }
    ]);
  });

  test('transformModifiedLinesDataForLineChart works as expected', () => {
    const { xDataModified, seriesModified } = transformModifiedLinesDataForLineChart(mockHistoricData);
    expect(xDataModified).toEqual(['2025-06-01', '2025-06-02']);
    expect(seriesModified).toEqual([
      { name: 'pau', data: [100, 150] },
      { name: 'lluis', data: [200, 250] }
    ]);
  });

  test('prepareRadarData returns correct structure', () => {
    const input = {
      pau: { modified: 100 },
      lluis: { modified: 200 }
    };
    expect(prepareRadarData(input)).toEqual({ pau: 100, lluis: 200 });
  });

  test('getPieChartData with key works', () => {
    const input = {
      pau: { modified: 100 },
      lluis: { modified: 200 },
      total: { modified: 300 }
    };
    expect(getPieChartData(input, 'modified')).toEqual([
      ['pau', 100],
      ['lluis', 200]
    ]);
  });

  test('getGaugeChartPercentages works', () => {
    const input = {
      pau: 3,
      lluis: 5,
      total: 8,
      anonymous: 2
    };
    expect(getGaugeChartPercentages(input, 'total', 'anonymous')).toEqual([
      { user: 'pau', percentage: 3 / 6 },
      { user: 'lluis', percentage: 5 / 6 }
    ]);
  });

  test('getGaugeChartModifiedLines works', () => {
    const input = {
      pau: { modified: 100 },
      lluis: { modified: 200 },
      total: { modified: 300 }
    };
    expect(getGaugeChartModifiedLines(input, 'total')).toEqual([
      { user: 'pau', percentage: 100 / 300 },
      { user: 'lluis', percentage: 200 / 300 }
    ]);
  });
});
