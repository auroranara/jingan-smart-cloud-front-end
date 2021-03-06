import React, { PureComponent } from 'react';
import ReactEcharts from 'echarts-for-react';

const colors = ['#ff4905', '#1e90ff', '#ff4905'];
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
      status,
      isNotIn,
      isMending,
      unit,
    } = this.props;
    let axisLine = [];
    if (normalMin === null || normalMin < min) {
      if (normalMax === null || normalMax > max) {
        axisLine.push([1, colors[1]]);
      } else {
        axisLine.push([(normalMax - min) / max, colors[1]]);
        axisLine.push([1, colors[2]]);
      }
    } else {
      if (normalMax === null || normalMax > max) {
        axisLine.push([(normalMin - min) / max, colors[0]]);
        axisLine.push([1, colors[1]]);
      } else {
        axisLine.push([(normalMin - min) / max, colors[0]]);
        axisLine.push([(normalMax - min) / max, colors[1]]);
        axisLine.push([1, colors[2]]);
      }
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
              color: !!isLost || isNotIn || isMending ? [[1, '#bbbbbc']] : axisLine,
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
            show: !!showValue,
            fontSize: 15,
            color: isMending ? colors[0] : status === 0 ? '#fff' : 'auto',
            formatter: value => {
              // return !!isLost ? '---' : value + unit || '';
              if (isNotIn) return '未接入';
              else if (isMending) return '检修中';
              else if (status < 0) return '---';
              else return value + unit || '';
            },
            offsetCenter: [0, '50%'],
          },
          data: [{ value: isLost || isMending || isNotIn ? 0 : value, name }],
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
