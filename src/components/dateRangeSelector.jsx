const DateRangeSelector = ({ showHistorical, dateRange, setDateRange }) => {
  if (!showHistorical) return null;

  return (
    <div className="day-selector-wrapper-comm">
      <select
        className="day-selector-comm"
        onChange={(e) => setDateRange(e.target.value)}
        value={dateRange}
        style={{ marginLeft: '1rem' }}
      >
        <option value="7">Last 7 days</option>
        <option value="15">Last 15 days</option>
        <option value="30">Last 30 days</option>
        <option value="90">Last 3 months</option>
        <option value="lifetime">Lifetime</option>
      </select>
    </div>
  );
};

export default DateRangeSelector;