import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';

const RadarChart = ({ data, title,max = null }) => {
  const chartRef = useRef(null);
  const [error, setError] = useState(null);
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
          indicator: users.map(([user, ]) => ({ name: user, max: max !== null ? max : total , offset: [0, 40] })),
          shape: 'polygon',
          radius: '50%',
          axisNameGap: 30,
          axisName: { 
            formatter: (name) => {
              const maxLineLength = 10; 
              const maxWordLength = 15;
            
              if (!name.includes(' ')) {
                return name.length > maxWordLength ? name.slice(0, maxWordLength) + '...' : name;
              }
            
              const words = name.split(' ');
              let currentLine = '';
              let formattedName = '';
            
              for (let word of words) {
                if ((currentLine + word).length > maxLineLength) {
                  formattedName += currentLine.trim() + '\n';
                  currentLine = '';
                }
                currentLine += word + ' ';
              }
              formattedName += currentLine.trim();
            
              return formattedName;
            },
            textStyle: {
              align: 'center', 
            },
          },
        },
        series: [
          {
            name: title,
            type: 'radar',
            data: [
              {
                value: users.map(([, value]) => value.toFixed(4)),
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
      <div ref={chartRef} style={{ textAlign: 'center', width: '100%', height: '350px' }} />
  );
};

export default RadarChart;
