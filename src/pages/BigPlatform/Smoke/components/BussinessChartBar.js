import React, { PureComponent } from 'react';
import ReactEcharts from 'echarts-for-react';
import moment from 'moment';
// const LIST = [120, 200, 150, 80, 70, 110, 130, 20, 10, 150];

export default class BussinessChartBar extends PureComponent {
  render() {
    // const list = LIST;
    const { data: list } = this.props;

    const xData = list.map(item => {
      const newMonth = item.date;
      return moment(newMonth).format('MM');
    });

    const option = {
      textStyle: {
        color: '#fff',
      },
      grid: { left: 0, right: '12%', top: 40, containLabel: true },
      color: ['#ff4848', '#9f9f9f'],
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
        data: ['未处理报警', '已处理报警'],
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
        data: xData,
      },
      series: [
        {
          name: '未处理报警',
          color: '#ff4848',
          type: 'bar',
          barWidth: 5,
          data: list.map(item => item.untreatedGas),
        },
        {
          name: '已处理报警',
          type: 'bar',
          color: '#9f9f9f',
          barWidth: 5,
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
