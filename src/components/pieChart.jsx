import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';

const PieChart = ({ title, data, colors }) => {
  const chartRef = useRef(null);
  const [usePatterns, setUsePatterns] = useState(false);
  const [error, setError] = useState(null);

  const truncateName = (name, maxLength = 21) => {
    return name.length > maxLength ? name.slice(0, maxLength) + '...' : name;
  };

  useEffect(() => {
    try {
      if (!chartRef.current) return;
      const chart = echarts.init(chartRef.current);

      const chartData = data.map((item, index) => {
        const name = truncateName(item[0]);
        const value = item[1];
        const base = { name, value };

        return {
          ...base,
          itemStyle: {
            color: colors && colors[index] ? colors[index] : undefined,
          },
        };
      });

      const option = {
        title: {
          text: title,
          left: 'center',
          top: 'top',
          textStyle: {
            fontSize: 20,
            fontWeight: 'bold',
            color: '#333',
          },
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)',
        },
        legend: {
          orient: 'horizontal',
          left: 'center',
          bottom: 10,
          data: chartData.map((item) => item.name),
          itemWidth: 24,
          itemHeight: 24,
        },
        series: [
          {
            name: title,
            type: 'pie',
            radius: '55%',
            center: ['50%', '50%'],
            data: chartData,
            labelLine: { show: false },
            label: { show: false },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
        aria: {
          enabled: true,
          decal: {
            show: true,
          },
        },
      };

      chart.setOption(option);

      chart.on('legendselectchanged', function (event) {
        chart.setOption({
          legend: {
            selected: chartData.reduce((acc, item) => {
              acc[item.name] = true;
              return acc;
            }, {})
          }
        });
      });
      
      return () => {
        chart.dispose();
      };
    } catch (err) {
      setError('Error al carregar el gràfic: ' + err.message);
    }
  }, [data, colors, title, usePatterns]);

  if (error) return <div>{error}</div>;

  return (
    <div style={{ width: '100%', textAlign: 'center' }}>

      <div ref={chartRef} style={{ width: '100%', height: '350px' }}></div>
    </div>
  );
};

export default PieChart;
