import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const AreaChartMultiple = ({ xData, seriesData, xLabel, yLabel, title }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!xData || !seriesData || xData.length === 0 || seriesData.length === 0) {
        return <div>No hi ha dades</div>;
      }
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
        data: seriesData.map(s => s.label),
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
      series: seriesData.map(s => ({
        name: s.label,
        type: 'line',
        stack: 'Total',
        smooth: false,
        symbol: 'circle',
        symbolSize: 6,
        areaStyle: { color: s.color },
        lineStyle: { color: s.color, width: 2 },
        color: typeof s.color === 'string' ? s.color.replace('0.4', '1') : undefined,
        data: s.data,
      })),
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
}, [xData, seriesData, xLabel, yLabel, title]);

  return (
    <div style={{ textAlign: 'center', marginTop: '30px' }}>
      <div
        ref={chartRef}
        style={{ width: '100%', height: '300px' }}
      />
    </div>
  );
};

export default AreaChartMultiple;
