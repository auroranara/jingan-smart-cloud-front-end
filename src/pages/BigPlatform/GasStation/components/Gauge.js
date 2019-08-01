import React, { PureComponent } from 'react';

import ReactEcharts from "echarts-for-react";
import styles from './Gauge.less';
import { MAX_MPa as MAX } from '../utils';

export default class Gauge extends PureComponent {
  getOption = data => {
    const {
      value,
      status,
      unit,
      deviceParamsInfo: {
        minValue,
        maxValue,
        normalLower,
        normalUpper,
      },
    } = data;

    const min = minValue || 0;
    const max = maxValue || MAX;
    const normalMin = Number.parseFloat(normalLower);
    const normalMax = Number.parseFloat(normalUpper);

    const color = status > 0 ? '#f83329' : '#fff';
    return {
      series: [
        {
          // name,
          type: 'gauge',
          radius: '90%',
          min,
          max,
          axisLine: {
            lineStyle: {
              color: status < 0 ? [[1, '#ccc']] : [
                !isNaN(normalMin) && [(normalMin - min) / (max - min), '#ff1e00'],
                !isNaN(normalMax) ? [(normalMax - min) / (max - min), '#1e90ff'] : [1, '#1e90ff'],
                !isNaN(normalMax) && [1, '#ff1e00'],
              ].filter(v => v),
              width: 15,
            },
          },
          splitLine: {
            length: 15,
          },
          axisLabel: {
            color: '#c2c2c2',
          },
          title : {
            color: '#c2c2c2',
          },
          pointer: {
            width: 4,
          },
          detail: {
            formatter: `{a|${status < 0 || isNaN(value) ? '--' : value}}\n{b|${name}}`,
            offsetCenter: [0, '65%'],
            rich: {
              a: {
                lineHeight: 48,
                fontSize: 24,
                color,
              },
              b: {
                lineHeight: 14,
                fontSize: 14,
                color,
              },
            },
          },
          data: [
            { value, name: unit },
          ],
        },
      ],
    };
  }

  render() {
    const { data, gaugeStyle, ...restProps } = this.props;
    return (
      <div className={styles.container} {...restProps}>
        <ReactEcharts
          style={{ width: 200, height: 200, ...gaugeStyle }}
          option={this.getOption(data)}
        />
      </div>
    )
  }
}