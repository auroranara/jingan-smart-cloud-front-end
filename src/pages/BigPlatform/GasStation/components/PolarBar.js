import React, { PureComponent } from 'react';
import ReactEcharts from 'echarts-for-react';

import styles from './PolarBar.less';
import { getStatusCount } from '../utils';

const BAR_WIDTH = 12;

export default class PolarBar extends PureComponent {
  chart = null;

  chartCallback = chart => {
    chart.on('click', params => {
      const { handleClick, lists } = this.props;
      const { dataIndex, seriesIndex } = params;
      const { index } = lists[dataIndex];
      handleClick(index, seriesIndex);
    });
  }

  getOption() {
    const { lists } = this.props;

    const statusLists = lists.map(getStatusCount);
    const categories = lists.map(({ name }) => name);
    const [alarmList, lossList, normalList] = ['alarm', 'loss', 'normal'].map(prop => statusLists.map(sts => sts[prop]));
    const max = Math.max(...statusLists.map(sts => sts.total)) / 3 * 4;

    return {
      angleAxis: {
        min: 0,
        max,
        interval: 5,
        axisLine: { show: false, lineStyle: { color: 'rgb(112,136,158)' } },
        axisLabel: { show: false, color: 'rgb(112,136,158)' },
        axisTick: { show: false },
        splitLine: { show: false, lineStyle: { color: 'rgb(34,67,110)' } },
      },
      radiusAxis: {
        type: 'category',
        data: categories,
        z: 10,
        axisLine: { show: false, lineStyle: { color: 'rgb(112,136,158)' } },
        axisLabel: { interval: 0 },
        axisTick: { show: false },
      },
      textStyle: { color: '#FFF' },
      polar: {
        center: ['50%', '47%'],
      },
      series: [{
          type: 'bar',
          barWidth: BAR_WIDTH,
          data: alarmList,
          coordinateSystem: 'polar',
          name: '报警',
          stack: 'a',
          itemStyle: { color: 'rgb(248,51,41)' },
      }, {
          type: 'bar',
          barWidth: BAR_WIDTH,
          data: lossList,
          coordinateSystem: 'polar',
          name: '失联',
          stack: 'a',
          itemStyle: { color: 'rgb(159,159,159)' },
      }, {
          type: 'bar',
          barWidth: BAR_WIDTH,
          data: normalList,
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
          const { name, alarm, loss, normal } = statusLists[index];
          return `
            ${name}<br/>
            <span class=${styles.redDot}></span>报警<span class=${styles.num}>${alarm}</span>
            <span class=${styles.greyDot}></span>失联<span class=${styles.num}>${loss}</span>
            <span class=${styles.cyanDot}></span>正常<span class=${styles.num}>${normal}</span>`;
        },
      },
    };
  }

  render() {
    return (
      <ReactEcharts
        style={{ width: '100%', height: '100%' }}
        option={this.getOption()}
        onChartReady={this.chartCallback}
      />
    );
  }
}
