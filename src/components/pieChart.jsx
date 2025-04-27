import React, { useEffect, useRef ,useState } from 'react';
import * as echarts from 'echarts';

const PieChart = ({title, data, colors }) => {
  const chartRef = useRef(null);
  const [error, setError] = useState(null);
  const truncateName = (name, maxLength = 21) => {
    return name.length > maxLength ? name.slice(0, maxLength) + '...' : name;
  };
  useEffect(() => {
    try {
      if (!chartRef.current) return;
      const chart = echarts.init(chartRef.current);
      const chartData = data.map((item, index) => ({
        name: truncateName(item[0]),
        value: item[1],
        ...(Array.isArray(colors) ? { itemStyle: { color: colors[index] } } : {})
      }));
      const option = {
        title: {
          text: title,
          left: 'center',
          top: 'top',
          textStyle: {
            fontSize: 20,
            fontWeight: 'bold',
            color: '#333',
          }
        },
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)'
        },
        legend: {
          orient: 'vertical',
          left: 'right',
          bottom: 10,        
          data: chartData.map(item => item.name),
          selectedMode: true,
          itemWidth: 14,  
          itemHeight: 14, 
        },
        series: [
          {
            name: title,
            type: 'pie',
            radius: '55%',
            center: ['50%', '60%'],
            data: chartData,
            labelLine: {
              show: false 
            },
            label: {
              show: false,
            },
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };

      chart.setOption(option);

      return () => {
        chart.dispose();
      };
    } catch (err) {
      setError("Error al carregar el grafic: " + err.message);
    }
  }, [data, colors, title]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div ref={chartRef} style={{ width: '100%', height: '350px' }}></div>
  );
};

export default PieChart;
