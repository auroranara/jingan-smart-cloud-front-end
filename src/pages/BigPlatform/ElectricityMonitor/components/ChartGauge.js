import React, { PureComponent } from 'react';
import ReactEcharts from 'echarts-for-react';

export default class ChartGauge extends PureComponent {
  render() {
    const { value, max, axisLineColor } = this.props;
    const val = value || 0;

    const option = {
      series: [
        {
          name: '业务指标',
          type: 'gauge',
          radius: '80%',
          min: 0,
          max,
          splitNumber: 5,
          axisLabel: {
            distance: 0,
            color: '#FFF',
            fontSize: max > 99 ? 8 : 10,
          },
          axisLine: {
            lineStyle: {
              width: 4,
              color: axisLineColor,
            },
          },
          splitLine: {
            length: 12,
            lineStyle: { color: 'auto' },
          },
          axisTick: {
            // show: false,
            lineStyle: { color: 'auto' },
          },
          pointer: { width: 4 },
          itemStyle: {
            // color: '#0FF',
            color: 'auto',
          },
          detail: { show: false },
          data: [{ value: val, name: '' }],
        },
      ],
  };

    return (
      <ReactEcharts
        option={option}
        style={{ height: 120 }}
        // style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', zIndex: -1 }}
        onChartReady={chart => { this.chart = chart; }}
      />
    );
  }
}
