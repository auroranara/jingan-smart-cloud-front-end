import React, { PureComponent } from 'react';
import ReactEcharts from 'echarts-for-react';

export default class DangerWorkLine extends PureComponent {
  render() {
    const { data = [], xData = [], otherType } = this.props;

    const option = {
      textStyle: {
        color: '#666666',
      },
      color: otherType ? ['#2db7f5'] : ['#7dc856'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          axisLine: {
            lineStyle: {
              color: '#d3d3d3', //更改坐标轴颜色
            },
          },
          data: xData.map(item => item),
        },
      ],
      yAxis: [
        {
          type: 'value',
          min: 0,
          max: otherType ? 200 : 60,
          splitLine: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: '#d3d3d3',
              width: 1,
            },
          },
        },
      ],
      series: [
        {
          name: '',
          type: 'bar',
          barWidth: '20%',
          data: data.map(item => item),
        },
      ],
    };

    return (
      <ReactEcharts
        option={option}
        style={{ height: '100%' }}
        // style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', zIndex: -1 }}
        onChartReady={chart => {
          this.chart = chart;
        }}
      />
    );
  }
}
