import React, { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';

const PieChart = ({ title, data, colors }) => {
  const chartRef = useRef(null);
  const [usePatterns, setUsePatterns] = useState(false);
  const [error, setError] = useState(null);

  const truncateName = (name, maxLength = 21) => {
    return name.length > maxLength ? name.slice(0, maxLength) + '...' : name;
  };

  const patterns = [
    { symbol: 'line', color: '#000', symbolSize: 4 },
    { symbol: 'circle', color: '#000', symbolSize: 1,},
    { symbol: 'diamond', color: '#000', symbolSize: 2 },
    { symbol: 'square', color: '#000', symbolSize: 1 },
    { symbol: 'triangle', color: '#000', symbolSize: 1 },
    { symbol: 'cross', color: '#000', symbolSize: 1 },
    { symbol: 'rect', color: '#000', symbolSize: 1 },
    { symbol: 'star', color: '#000', symbolSize: 1 },
  ];

  useEffect(() => {
    try {
      if (!chartRef.current) return;
      const chart = echarts.init(chartRef.current);

      const chartData = data.map((item, index) => {
        const name = truncateName(item[0]);
        const value = item[1];
        const base = { name, value };

        if (usePatterns) {
          const pattern = patterns[index % patterns.length];
          return {
            ...base,
            itemStyle: {
              decal: {
                symbol: pattern.symbol,
                color: pattern.color,
                symbolSize: pattern.symbolSize,
              },
            },
          };
        } else {
          return {
            ...base,
            itemStyle: {
              color: colors && colors[index] ? colors[index] : undefined,
            },
          };
        }
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
          orient: 'vertical',
          left: 'right',
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
            center: ['50%', '60%'],
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
      };

      chart.setOption(option);

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
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>Trames</span>
          <div
            onClick={() => setUsePatterns((prev) => !prev)}
            style={{
              position: 'relative',
              width: '42px',
              height: '24px',
              borderRadius: '999px',
              background: usePatterns ? '#4CAF50' : '#ccc',
              cursor: 'pointer',
              transition: 'background 0.3s',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '2px',
                left: usePatterns ? '20px' : '2px',
                width: '20px',
                height: '20px',
                background: 'white',
                borderRadius: '50%',
                transition: 'left 0.3s',
              }}
            />
          </div>
        </label>
      </div>

      <div ref={chartRef} style={{ width: '100%', height: '350px' }}></div>
    </div>  );
};

export default PieChart;
