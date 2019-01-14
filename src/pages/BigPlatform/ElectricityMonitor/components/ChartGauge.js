import React, { PureComponent } from 'react';
import ReactEcharts from 'echarts-for-react';

export default class ChartGauge extends PureComponent {
  render() {
    const { value, axisLineColor } = this.props;

    const option = {
      // tooltip : {
      //   formatter: "{a} <br/>{b} : {c}%",
      // },
      toolbox: {
        feature: {
          restore: {},
          saveAsImage: {},
        },
      },
      series: [
        {
          name: '业务指标',
          type: 'gauge',
          radius: '80%',
          axisLabel: { show: false },
          axisLine: {
            lineStyle: {
              width: 6,
              color: axisLineColor,
            },
          },
          splitLine: { show: false },
          axisTick: { show: false },
          pointer: { width: 4 },
          itemStyle: {
            color: '#0FF',
          },
          detail: { show: false },
          data: [{ value, name: '' }],
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
