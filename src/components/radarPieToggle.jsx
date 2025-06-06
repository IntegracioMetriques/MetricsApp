import React, { useState } from 'react';
import usePersistentState from './usePersistentState'
import RadarChart from './radarChart';
import PieChart from './pieChart';
import '../styles/radarPieToggle.css';


const RadarPieToggle = ({ RadarPieID, radarData, pieData, title }) => {
  const [selectedChart, setSelectedChart] = usePersistentState(RadarPieID,'radar');

  const selectRadar = () => setSelectedChart('radar');
  const selectPie = () => setSelectedChart('pie');

  return (
    <div className="chart-toggle-wrapper">
      <div className="chart-toggle-buttons">
        <button 
          onClick={selectRadar}
          className={selectedChart === 'radar' ? 'selected' : ''}
        >
          Radar
        </button>
        <button 
          onClick={selectPie}
          className={selectedChart === 'pie' ? 'selected' : ''}
        >
          Pie
        </button>
      </div>
      <div className="chart-container">
        {selectedChart === 'radar' ? (
          <RadarChart data={radarData} title={title} />
        ) : (
          <PieChart data={pieData} title={title} />
        )}
      </div>
    </div>
  );
};

export default RadarPieToggle;
