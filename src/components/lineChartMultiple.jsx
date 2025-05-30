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
      },
      grid: {
        bottom: 90,
        left: 60
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
          fontSize: 12,
          formatter: (value) => {
            const v = Number(value);
            if (value >= 1e12) return (value / 1e12)+ 'T';
            if (value >= 1e9) return (value / 1e9) + 'B';
            if (value >= 1e6) return (value / 1e6) + 'M';
            return value;
          }
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
    
    chart.on('legendselectchanged', function (params) {
      const selectedName = params.name;
      const allNames = seriesData.map(s => s.name);
      const selected = params.selected;
       console.log( selected)
      const selectedCount = Object.values(selected).filter(v => v).length;

      let newSelection = {};
          console.log(selectedCount)

      if (selectedCount === 0) {
        allNames.forEach(name => {
          newSelection[name] = true;
        });
      } else {
        allNames.forEach(name => {
          console.log(name)
          newSelection[name] = name === selectedName;
        });
      }

      chart.setOption({
        legend: {
          selected: newSelection
        }
      });
    });

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
