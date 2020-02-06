import React, { PureComponent } from 'react';
import ReactEcharts from 'echarts-for-react';

export default class IndexChartsLine extends PureComponent {
  render() {
    const { data = [] } = this.props;

    const option = {
      textStyle: {
        color: '#666666',
      },
      color: ['#af7a94'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'line',
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top:'9%',
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
          data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月','8月','9月','10月','11月','12月'],
        },
      ],
      yAxis: [
        {
          type: 'value',
          min: 0,
          max: 80,
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
          type: 'line',
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
