import React, { PureComponent } from 'react';
import ReactEcharts from 'echarts-for-react';

import styles from './PolarBar.less';

const BAR_WIDTH = 10;
const CATEGORIES = ['水池/水箱', '喷淋系统', '消火栓系统'];

export default class PolarBar extends PureComponent {
  getOption() {
    return {
      angleAxis: {
        min: 0,
        max: 100,
        interval: 5,
        axisLine: { lineStyle: { color: 'rgb(112,136,158)' } },
        axisLabel: { color: 'rgb(112,136,158)' },
        splitLine: { lineStyle: { color: 'rgb(34,67,110)' } },
      },
      radiusAxis: {
        type: 'category',
        data: CATEGORIES,
        z: 10,
        axisLine: { lineStyle: { color: 'rgb(112,136,158)' } },
        axisLabel: { interval: 0 },
      },
      textStyle: { color: '#FFF' },
      polar: {},
      series: [{
          type: 'bar',
          barWidth: BAR_WIDTH,
          data: [20, 10, 30],
          coordinateSystem: 'polar',
          name: '报警',
          stack: 'a',
          itemStyle: { color: 'rgb(248,51,41)' },
      }, {
          type: 'bar',
          barWidth: BAR_WIDTH,
          data: [35, 10, 40],
          coordinateSystem: 'polar',
          name: '失联',
          stack: 'a',
          itemStyle: { color: 'rgb(159,159,159)' },
      }, {
          type: 'bar',
          barWidth: BAR_WIDTH,
          data: [20, 55, 5],
          coordinateSystem: 'polar',
          name: '正常',
          stack: 'a',
          itemStyle: { color: 'rgb(0,255,255)' },
      }],
      legend: {
          show: true,
          bottom: 0,
          data: ['报警', '失联', '正常'],
          selectedMode: false,
          textStyle: { color: '#FFF' },
      },
      tooltip: {
        show: true,
        formatter: function (params) {
          const index = params.dataIndex;
          return `
            ${CATEGORIES[index]}<br/>
            <span class=${styles.redDot}></span>报警<span class=${styles.num}>10</span>
            <span class=${styles.greyDot}></span>失联<span class=${styles.num}>3</span>
            <span class=${styles.cyanDot}></span>正常<span class=${styles.num}>25</span>`;
        },
      },
    };
  }

  render() {
    return (
      <ReactEcharts
        style={{ width: '200px', height: '220px' }}
        option={this.getOption()}
      />
    );
  }
}
