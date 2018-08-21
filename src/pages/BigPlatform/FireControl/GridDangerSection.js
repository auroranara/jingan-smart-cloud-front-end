import React, { PureComponent } from 'react';
import ReactEcharts from 'echarts-for-react'

import FcSection from './FcSection';

function rand(n) {
  return Math.floor(Math.random() * n);
}

function genSource() {
  const source = [['时间', '巡查次数', '隐患数量']];
  for (let n = 0; n < 31; n++)
      source.push([`7/${n + 1}`, rand(20), rand(20)]);
  return source;
}

function handleSource(list) {
  const source = [['时间', '巡查次数', '隐患数量']];
  list.forEach(({ time, inspect, danger }) => source.push([time, inspect, danger]));
  return source;
}

const DELAY = 2000;

export default class GridDangerSection extends PureComponent {
  componentDidMount() {
    this.timer = setInterval(this.tipMove, DELAY);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  timer = null;
  count = 0;
  length = 0;
  chart = null;

  tipMove = () => {
    const count = this.count;
    if (!this.chart || !length)
      return;

    this.chart.dispatchAction({
      type: 'showTip',
      seriesIndex: 0,
      dataIndex: count,
    });

    this.count = (count + 1) % this.length;
  };

  // handleMouseenter = () => {
  //   console.log('enter');
  //   clearInterval(this.timer);
  // };

  // handleMouseleave = () => {
  //   console.log('leave');
  //   this.timer = setInterval(this.tipMove, DELAY);
  // };

  render() {
    const { dangerData: { list = [] } } = this.props;
    const source = handleSource(list);
    // const source = genSource();

    this.length = list.length;
    const option = {
      legend: {
        top: 0,
        right: 10,
        data: ['巡查次数', '隐患数量'],
        textStyle: { color: '#FFF' },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
      },
      dataset: { source },
      xAxis: {
        type: 'category',
        axisLine: { lineStyle: { width: 2, color: 'rgb(62,71,89)' } },
      },
      yAxis: {
        type: 'value',
        axisLine: {
          show: false,
          lineStyle: { width: 2, color: 'rgb(62,71,89)' },
        },
        splitLine: {
          // show: false,
          lineStyle: { color: 'rgb(37,54,83)' },
        },
      },
      series: [
        {
          type: 'line',
          smooth: true,
          symbol: 'circle',
          showSymbol: false,
          itemStyle: { color: 'rgb(0,168,255)' },
          lineStyle: { color: 'rgb(0,168,255)' },
          areaStyle: { color: 'rgb(0,168,255)', opacity: 0.2 },
        },
        {
          type: 'line',
          smooth: true,
          symbol: 'circle',
          showSymbol: false,
          itemStyle: { color: 'rgb(244,192,83)' },
          lineStyle: { color: 'rgb(244,192,83)' },
          areaStyle: { color: 'rgb(244,192,83)', opacity: 0.2 },
        },
      ],
      textStyle: {
        color: '#FFF',
      },
  };

    return (
      <FcSection
        title="网格隐患巡查"
        style={{ position: 'relative' }}
        // onMouseover={this.handleMouseenter}
        // onClick={() => console.log(1)}
        // onMouseleave={this.handleMouseleave}
      >
          <ReactEcharts
            option={option}
            style={{ position: 'absolute', left: 0, top: 15, width: '100%', height: '100%' }}
            onChartReady={chart => { this.chart = chart; }}
          />
      </FcSection>
    );
  }
}
