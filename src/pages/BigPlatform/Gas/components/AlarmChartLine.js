import React, { PureComponent } from 'react';
import ReactEcharts from 'echarts-for-react';
import moment from 'moment';

const LINE_STYLE = { width: 2, color: 'rgb(64, 95, 135)' };

export default class BussinessChartLine extends PureComponent {
  render() {
    const { data: list, labelRotate = -35 } = this.props;

    const xData = list.map(item => {
      const newMonth = item.date;
      return moment(newMonth).format('MM');
    });

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
      color: ['#f6b54e', '#9f9f9f'],
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
          name: '未处理故障',
          type: 'line',
          itemStyle: {
            color: '#0FF',
            normal: {
              lineStyle: {
                color: '#f6b54e',
              },
            },
          },
          data: list.map(item => item.untreatedGas),
        },
        {
          name: '已处理故障',
          type: 'line',
          itemStyle: {
            color: '#0FF',
            normal: {
              lineStyle: {
                color: '#9f9f9f',
              },
            },
          },
          data: list.map(item => item.finishGas),
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
