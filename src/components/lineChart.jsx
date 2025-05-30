import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const LineChart = ({ xData, yData, xLabel, yLabel, title }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current || !xData || !yData) return;

    const chart = echarts.init(chartRef.current);

    const option = {
      title: {
        text: title,
        left: 'center',
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'line',
          lineStyle: {
            color: '#999'
          }
        }
      },
      grid: {
        left:60
      },
      xAxis: {
        type: 'category',
        data: xData,  
        name: xLabel || 'Eix X',
        axisLabel: {
          rotate: 45, 
          fontSize: 12
        }
      },
      yAxis: {
        type: 'value',
        name: yLabel || 'Eix Y',
        axisLabel: {
          fontSize: 12,
          formatter: (value) => {
            const v = Number(value);
            if (value >= 1e12) return (value / 1e12) + 'T';
            if (value >= 1e9) return (value / 1e9) + 'B';
            if (value >= 1e6) return (value / 1e6) + 'M';
            return value;
          }
        }
      },
      series: [{
        data: yData, 
        type: 'line',
        smooth: true, 
        itemStyle: {
          color: '#2f89fc'
        },
        lineStyle: {
          width: 2
        },
        symbol: 'circle',
        symbolSize: 6
      }]
    };

    chart.setOption(option);

    return () => {
      chart.dispose(); 
    };
  }, [xData, yData, title, xLabel, yLabel]);

  return (
    <div style={{ textAlign: 'center', marginTop: '30px' }}>
      <div
        ref={chartRef}
        style={{ width: '100%', height: '300px' }}
      />
    </div>
  );
};

export default LineChart;
