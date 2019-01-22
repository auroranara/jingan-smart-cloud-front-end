import React, { PureComponent } from 'react';
import ReactEcharts from 'echarts-for-react';

// const LIST = [120, 200, 150, 80, 70, 110, 130, 20, 10, 150];

const LINE_STYLE = { width: 2, color: 'rgb(64, 95, 135)' };

export default class ChartLine extends PureComponent {
  render() {
    // const list = LIST;
    const { data: list, labelRotate = -35 } = this.props;

    // const xData = [...Array(10).keys()].map(i => `无锡新吴机械${i}`);
    // const seriesData = LIST.map((n, i) => ({ value: n, name: `无锡新吴机械${i}` }));
    const xData = list.map(({ name }) => name);
    // const seriesData = list;

    const option = {
      textStyle: { color: '#FFF' },
      lineStyle: { color: '#0FF' },
      grid: { left: 0, right: '12%', top: 40, containLabel: true },
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
      color: ['#ff4848', '#f6b54e', '#9f9f9f'],
      legend: {
        data: ['报警', '故障', '失联'],
        textStyle: {
          color: '#fff',
        },
        orient: 'horizontal',
        bottom: 20,
        left: 'center',
        icon: 'rect',
      },
      xAxis: {
        type: 'category',
        data: xData,
        axisLine: { lineStyle: LINE_STYLE },
        axisLabel: { rotate: labelRotate },
      },
      yAxis: {
        type: 'value',
        axisLine: { lineStyle: LINE_STYLE },
        splitLine: { lineStyle: { color: 'rgb(3, 48, 105)' } },
        // 小数标签不显示
        axisLabel: {
          formatter: function(value, index) {
            if (Number.parseInt(value, 10) !== value) return '';
            return Number.parseInt(value, 10);
          },
        },
      },
      series: [
        {
          name: '报警',
          type: 'line',
          itemStyle: {
            color: '#0FF',
            normal: {
              lineStyle: {
                color: '#ff4848',
              },
            },
          },
          data: [20, 30, 62, 52, 43, 55, 64, 23, 22, 12, 23, 12],
        },
        {
          name: '故障',
          type: 'line',
          itemStyle: {
            color: '#0FF',
            normal: {
              lineStyle: {
                color: '#f6b54e',
              },
            },
          },
          data: [20, 30, 32, 32, 43, 55, 65, 23, 22, 12, 23, 12],
        },
        {
          name: '失联',
          type: 'line',
          itemStyle: {
            color: '#0FF',
            normal: {
              lineStyle: {
                color: '#9f9f9f',
              },
            },
          },
          data: [10, 52, 34, 32, 43, 54, 65, 23, 22, 52, 43, 12],
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
