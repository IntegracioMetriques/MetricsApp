const HistoricalToggle = ({ showHistorical, setShowHistorical }) => {
  return (
    <div className="chart-toggle-wrapper-index">
      <div className="chart-toggle-buttons">
        <button
          onClick={() => setShowHistorical(false)}
          className={!showHistorical ? 'selected' : ''}
        >
          Current
        </button>
        <button
          onClick={() => setShowHistorical(true)}
          className={showHistorical ? 'selected' : ''}
        >
          Historical
        </button>
      </div>
    </div>
  );
};

export default HistoricalToggle;