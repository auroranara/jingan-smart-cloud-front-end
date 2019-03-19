import React, { PureComponent } from 'react';
import ReactEcharts from 'echarts-for-react';

export default class ChartGauge extends PureComponent {
  gaugeOption = () => {
    const {
      value,
      showName,
      showValue,
      name,
      isLost,
      range: [min, max] = [0, 2],
      normalRange: [normalMin, normalMax] = [0.4, 1.2],
    } = this.props;
    let axisLine;
    if (!normalMin && normalMin !== 0 && !normalMax && normalMax !== 0) {
      axisLine = [[1, '#1e90ff']];
    } else if ((normalMin || normalMin === 0) && (!normalMax && normalMax !== 0)) {
      axisLine = [[(normalMin - min) / max, '#ff4905'], [1, '#1e90ff']];
    } else if ((normalMax || normalMax === 0) && (!normalMin && normalMin !== 0)) {
      axisLine = [[(normalMax - min) / max, '#1e90ff'], [1, '#ff4905']];
    } else {
      axisLine = [
        [(normalMin - min) / max, '#ff4905'],
        [(normalMax - min) / max, '#1e90ff'],
        [1, '#ff4905'],
      ];
    }
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
          radius: '80%',
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
              length: 10,
              color: !!isLost ? [[1, '#bbbbbc']] : axisLine,
            },
          },
          splitLine: {
            length: 8,
            lineStyle: { color: '#fff' },
          },
          axisTick: {
            length: 5,
            lineStyle: { color: 'auto' },
          },
          pointer: { width: 4 },
          itemStyle: {
            color: 'auto',
          },
          detail: {
            show: !!isLost || !!showValue,
            fontSize: 15,
            formatter: value => {
              return !!isLost ? '---' : value;
            },
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
        style={{ height: 150, width: '100%', ...this.props.style }}
        onChartReady={chart => {
          this.chart = chart;
        }}
      />
    );
  }
}
