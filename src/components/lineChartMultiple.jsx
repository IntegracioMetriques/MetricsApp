import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const LineChartMultiple = ({ xData, seriesData, xLabel, yLabel, title }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current || !xData || !seriesData) return;

    const chart = echarts.init(chartRef.current);

    const option = {
      title: {
        text: title,
        left: 'center',
        fontSize: 18,
        fontWeight: 'bold'
      },
      grid: {
        bottom: 90,
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
      legend: {
        bottom: 0,                         
        type: 'scroll',                
        data: seriesData.map(s => s.name), 
      },
      xAxis: {
        type: 'category',
        data: xData,  
        name: xLabel || 'Eix X',
        axisLabel: {
          rotate: 45, 
          fontSize: 12
        },
        legend: {
          top: "10%",
          data: seriesData.map(s => s.name),
          },
      },
      yAxis: {
        type: 'value',
        name: yLabel || 'Eix Y',
        axisLabel: {
          fontSize: 12
        }
      },
      series: seriesData.map((serie) => ({
        name: serie.name,
        data: serie.data,
        type: 'line',
        smooth: true,
        itemStyle: {
          color: serie.color || undefined
        },
        lineStyle: {
          width: 2
        },
        symbol: 'circle',
        symbolSize: 6
      }))
    };

    chart.setOption(option);

    return () => {
      chart.dispose(); 
    };
  }, [xData, seriesData, title, xLabel, yLabel]);

  return (
    <div style={{ textAlign: 'center', marginTop: '30px' }}>
      <div
        ref={chartRef}
        style={{ width: '100%', height: '300px' }}
      />
    </div>
  );
};

export default LineChartMultiple;
