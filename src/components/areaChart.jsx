import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const AreaChart = ({ xData, topData, bottomData, topColor, bottomColor, toplabel, bottomLabel, xLabel, yLabel, title }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current || !xData || !topData || !bottomData) return;

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
          label: { show: false },
          shadowStyle: {
            color: 'rgba(0, 0, 0, 0.05)'
          }
        }
      },
      legend: {
        data: [bottomLabel, toplabel],
        top: '20px'
      },
      xAxis: {
        type: 'category',
        data: xData,
        name: xLabel,
        axisLabel: { rotate: 45, fontSize: 12 }
      },
      yAxis: {
        type: 'value',
        name: yLabel,
        axisLabel: { fontSize: 12 }
      },
      series: [
        {
          name: bottomLabel,
          type: 'line',
          stack: 'Total',
          smooth: false,
          symbol: 'circle',
          symbolSize: 6,
          areaStyle: { color: bottomColor },
          lineStyle: { color: bottomColor, width: 2 },
          color: bottomColor.replace('0.4', '1'), 
          data: bottomData,
        },
        {
          name: toplabel,
          type: 'line',
          stack: 'Total',
          smooth: false,
          symbol: 'circle',
          symbolSize: 6,
          areaStyle: { color: topColor },
          lineStyle: { color: topColor, width: 2 },
          color: topColor.replace('0.4', '1'), 
          data: topData,
        }
      ],
      aria: {
        enabled: true,
        decal: {
          show: true,
        },
      },
    };

    chart.setOption(option);

    return () => {
      chart.dispose();
    };
  }, [xData, topData, bottomData, topColor, bottomColor, xLabel, yLabel, title]);

  return (
    <div style={{ textAlign: 'center', marginTop: '30px' }}>
      <div
        ref={chartRef}
        style={{ width: '100%', height: '300px' }}
      />
    </div>
  );
};

export default AreaChart;
