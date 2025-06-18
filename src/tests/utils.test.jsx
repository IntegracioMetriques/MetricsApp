import { filterHistoricData,truncateName } from '../domain/utils';

describe('utils', () => {
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

  
  test('truncateName works correctly with long strings', () => {

    const string = truncateName("thisShouldBeTruncated");
    expect(string).toEqual("thisShouldBeTrunca...");

  });
  
  test('truncateName works correctly with short strings', () => {

    const string = truncateName("Pau");
    expect(string).toEqual("Pau");

  });
});


