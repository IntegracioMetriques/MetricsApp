import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const BarLineChart = ({ xData, yDataBar, yDataLine, xLabel, yLabel, title }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current || !xData || !yDataBar || !yDataLine) return;

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
          type: 'cross',
          crossStyle: {
            color: '#999'
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
      series: [
        {
          data: yDataBar,
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
        },
        {
          data: yDataLine,
          type: 'line',
          itemStyle: {
            color: '#ff0000'  
          },
          lineStyle: {
            width: 2,
            type: 'solid'
          },
          symbol: 'circle',
          symbolSize: 6,
          smooth: true, 
        }
      ]
    };

    chart.setOption(option);

    return () => {
      chart.dispose();
    };
  }, [xData, yDataBar, yDataLine, title, xLabel, yLabel]);
  return (
    <div style={{ textAlign: 'center', marginTop: '30px' }}>
      <div
        ref={chartRef}
        style={{ width: '100%', height: '300px' }}
      />
    </div>
  );
};

export default BarLineChart;
