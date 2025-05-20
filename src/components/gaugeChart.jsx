import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';

const GaugeChart = ({ user, percentage, totalPeople }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current || totalPeople === 0) return;

    let gaugeColor;
    let labels;
    if (totalPeople === 1) {
      gaugeColor = [
        [0.8, 'red'],
        [0.9, 'orange'],
        [1, 'green']
      ]
      labels = { 0: "0",0.9: "0.9", 1: "1" };
    }
    else if (totalPeople === 2) {
      gaugeColor = [
        [0.3, 'red'],
        [0.4, 'orange'],
        [0.6, 'green'],
        [0.7, 'orange'],
        [1, 'red']
      ];
      labels = { 0: "0", 0.4: "0.4", 0.6: "0.6", 1: "1" };
    } else if (totalPeople === 3) {
      gaugeColor = [
        [0.1,'red'],
        [0.2, 'orange'],
        [0.4, 'green'],
        [0.5, 'orange'],
        [1, 'red']
      ];
      labels = { 0: "0", 0.2: "0.2", 0.4: "0.4", 1: "1" };
    } else if (totalPeople === 4) {
      gaugeColor = [
        [0.05, 'red'],
        [0.1, 'orange'],
        [0.3, 'green'],
        [0.35, 'orange'],
        [1, 'red']
      ];
      labels = { 0: "0", 0.1: "0.1", 0.3: "0.3", 1: "1" };
    } else if (totalPeople === 5) {
      gaugeColor = [
        [0.05, 'red'],
        [0.1, 'orange'],
        [0.3, 'green'],
        [0.35, 'orange'],
        [1, 'red']
      ];
      labels = { 0: "0", 0.1: "0.1", 0.3: "0.3", 1: "1" };
    } else if (totalPeople === 6) {
      gaugeColor = [
        [0.05, 'red'],
        [0.1, 'orange'],
        [0.3, 'green'],
        [0.35, 'orange'],
        [1, 'red']
      ];
      labels = { 0: "0", 0.1: "0.1", 0.3: "0.3", 1: "1" };
    } else if (totalPeople === 7) {
      gaugeColor = [
        [0.05, 'red'],
        [0.1, 'orange'],
        [0.3, 'green'],
        [0.35, 'orange'],
        [1, 'red']
      ];
      labels = { 0: "0", 0.1: "0.1", 0.3: "0.3", 1: "1" };
    } else if (totalPeople === 8) {
      gaugeColor = [
        [0.05, 'red'],
        [0.1, 'orange'],
        [0.3, 'green'],
        [0.35, 'orange'],
        [1, 'red']
      ];
      labels = { 0: "0", 0.1: "0.1", 0.3: "0.3", 1: "1" };
    }
    else {
      gaugeColor = [
        [0, 'red'],
        [1, 'red']
      ];
      labels = { 0: "0", 1: "1" };
    }
    const truncateName = (name, maxLength = 18) => {
      return name.length > maxLength ? name.slice(0, maxLength) + '...' : name;
    };
    const chart = echarts.init(chartRef.current);

    const option = {
      series: [{
        type: 'gauge',
        startAngle: 180,
        endAngle: 0,
        min: 0,
        max: 1,
        axisLine: {
          lineStyle: {
            width: 15,
            color: gaugeColor
          }
        },
        pointer: {
          width: 2,
          length: '70%',
          itemStyle: { color: 'black' }
        },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: {
          show: true,
          distance: -40,
          fontSize: 14,
          color: '#000',
          fontWeight: 'bold',
          formatter: function (value) {
            return labels[value] || '';
          }
        },
        detail: {
          formatter: function () {
            return `${truncateName(user)} (${(percentage * 100).toFixed(2)}%)`;
          },
          fontSize: 16,
          fontWeight: 'bold',
          color: '#000'
        },
        data: [{ value: percentage }]
      }]
    };

    chart.setOption(option);

    return () => {
      chart.dispose();
    };
  }, [user, percentage, totalPeople]);

  return (
    <div className="gauge-item" title={user} style={{ textAlign: 'center' }}>
      <div
        ref={chartRef}
        style={{ width: '312px', height: '200px' }}
      />
    </div>
  );
};

export default GaugeChart;
