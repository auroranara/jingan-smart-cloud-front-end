import React, { PureComponent } from 'react';
import ReactEcharts from 'echarts-for-react';

export default class ChartGauge extends PureComponent {
  gaugeOption = () => {
    const {
      value,
      showName,
      showValue,
      name,
      range: [min, max] = [0, 2],
      normalRange: [normalMin, normalMax] = [0.4, 1.2],
    } = this.props;
    return {
      grid: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
      series: [
        {
          name: '水系统监测',
          type: 'gauge',
          radius: '75%',
          title: {
            show: !!showName,
            offsetCenter: [0, '95%'],
            textStyle: {
              fontSize: 14,
              color: '#fff',
            },
          },
          min,
          max,
          splitNumber: 11,
          axisLabel: {
            show: false,
            distance: 0,
            color: '#FFF',
            fontSize: 8,
          },
          axisLine: {
            lineStyle: {
              width: 2,
              color: [
                [(normalMin - min) / max, '#ff4000'],
                [(normalMax - min) / max, '#1e90ff'],
                [1, '#ff4000'],
              ],
            },
          },
          splitLine: {
            length: 8,
            lineStyle: { width: 1, color: '#fff' },
          },
          axisTick: {
            length: 3,
            lineStyle: {
              color: 'auto',
            },
          },
          pointer: { width: 4, length: '70%' },
          itemStyle: {
            color: 'auto',
          },
          detail: {
            show: !!showValue,
            fontSize: 12,
          },
          data: [{ value, name }],
        },
      ],
    };
  };

  render() {
    return (
      <ReactEcharts
        option={this.gaugeOption()}
        style={{ height: '100%', width: '100%', ...this.props.style }}
        onChartReady={chart => {
          this.chart = chart;
        }}
      />
    );
  }
}
