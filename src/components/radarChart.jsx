import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';

const RadarChart = ({ data, title }) => {
  const chartRef = useRef(null);
  const [error, setError] = useState(null);
  const truncateName = (name, maxLength = 15) => {
    return name.length > maxLength ? name.slice(0, maxLength) + '...' : name;
  };
  try {
  useEffect(() => {
      if (!chartRef.current) return;
      const users = Object.entries(data)
        .filter(([user]) => 
         user.toLowerCase() !== "total" &&
         user.toLowerCase() !== 'non-assigned' &&
         user.toLowerCase() !== 'anonymous');
      const total = users.reduce((sum, [, value]) => sum + value, 0);

      if (users.length === 2) {
        users.push(['', 0]);
      }

      const radarChart = echarts.init(chartRef.current);

      const radarOption = {
        title: {
          text: title,
          left: 'center',
        },
        tooltip:{},
        radar: {
          indicator: users.map(([user, value]) => ({ name: truncateName(user), max: total })),
          shape: 'polygon',
          radius: '60%',
        },
        series: [
          {
            name: title,
            type: 'radar',
            data: [
              {
                value: users.map(([, value]) => value),
                name: title,
                areaStyle: { color: 'rgba(0, 128, 255, 0.3)' },
              },
            ],
          },
        ],
      };

      radarChart.setOption(radarOption);

      return () => {
        radarChart.dispose();
      };

  }, [data, title]);
} catch (err) {
    return <div> Error al carregar el RadarChart</div>;
  }
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div style={{ textAlign: 'center', width: '100%', height: '400px' }}>
      <div ref={chartRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default RadarChart;
