import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const BarChart = ({ xData, yData, xLabel, yLabel, title }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current || !xData || !yData) return;

    const chart = echarts.init(chartRef.current);

    const option = {
      title: {
        text: title,
        left: 'center',
        fontSize: 18,
        fontWeight: 'bold'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
          shadowStyle: {
            color: 'rgba(0, 0, 0, 0.1)'
          }
        }
      },
      xAxis: {
        type: 'category',
        data: xData,
        name: xLabel || 'Eix X',
        axisLabel: {
          rotate: 45,
          fontSize: 12
        },
        axisLine: {
          lineStyle: {
            color: '#333'
          }
        }
      },
      yAxis: {
        type: 'value',
        name: yLabel || 'Eix Y',
        axisLabel: {
          fontSize: 12
        },
        axisLine: {
          lineStyle: {
            color: '#333'
          }
        },
        splitLine: {
          lineStyle: {
            type: 'dashed'
          }
        }
      },
      series: [{
        data: yData,
        type: 'bar',  
        itemStyle: {
          color: '#2f89fc'
        },
        barWidth: '40%', 
        emphasis: {
          itemStyle: {
            color: '#409EFF'
          }
        }
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

export default BarChart;
