import React, { PureComponent } from 'react';
import ReactEcharts from 'echarts-for-react';

// const LIST = [120, 200, 150, 80, 70, 110, 130, 20, 10, 150];

const LINE_STYLE = { width: 2, color: 'rgb(64, 95, 135)' };

export default class BussinessChartBar extends PureComponent {
  render() {
    // const list = LIST;
    const { data: list, labelRotate = -35 } = this.props;

    // const xData = [...Array(10).keys()].map(i => `无锡新吴机械${i}`);
    // const seriesData = LIST.map((n, i) => ({ value: n, name: `无锡新吴机械${i}` }));
    const xData = list.map(({ name }) => name);
    // const seriesData = list;

    const option = {
      textStyle: {
        color: '#fff',
      },
      grid: { left: 0, right: '12%', top: 40, containLabel: true },
      color: ['#f6b54e', '#9f9f9f'],
      tooltip: {
        show: true,
        trigger: 'axis',
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
          shadowStyle: {
            color: 'rgba(46,78,111,0.5)',
            opacity: 0.6,
          },
        },
        backgroundColor: 'rgba(46,78,111,0.5)',
        padding: [5, 15, 5, 15],
      },
      legend: {
        data: ['未处理故障', '已处理故障'],
        textStyle: {
          color: '#fff',
        },
        orient: 'horizontal',
        bottom: 20,
        left: 'center',
        icon: 'rect',
      },
      yAxis: {
        type: 'value',
        axisTick: { show: true, inside: true },
        splitLine: {
          show: false,
          lineStyle: {
            color: '#394456',
            width: 2,
          },
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#394456',
            width: 2,
          },
        },
        axisLabel: {
          formatter: function(value, index) {
            if (parseInt(value, 10) !== value) return '';
            return parseInt(value, 10);
          },
        },
      },
      xAxis: {
        type: 'category',
        axisTick: { show: false },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#394456',
            width: 2,
          },
        },
        axisLabel: {
          color: '#fff',
          fontSize: 14,
        },
        data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      },
      series: [
        {
          name: '未处理故障',
          color: '#f6b54e',
          type: 'bar',
          barWidth: 5,
          data: [20, 12, 12, 34, 55, 66, 34, 44, 22, 11, 22, 34],
        },
        {
          name: '已处理故障',
          type: 'bar',
          color: '#9f9f9f',
          barWidth: 5,
          data: [20, 13, 12, 36, 52, 66, 34, 44, 22, 11, 22, 34],
        },
      ],
    };

    let chartComponent = null;
    if (list.length)
      chartComponent = (
        <ReactEcharts
          option={option}
          style={{ height: 400 }}
          // style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', zIndex: -1 }}
          onChartReady={chart => {
            this.chart = chart;
          }}
        />
      );

    return chartComponent;
  }
}
