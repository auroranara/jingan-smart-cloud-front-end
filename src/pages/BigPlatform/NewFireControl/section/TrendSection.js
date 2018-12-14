import React, { PureComponent } from 'react';
import ReactEcharts from 'echarts-for-react'

import { myParseInt } from '../utils';
import FcSection from './FcSection';
import EmptyChart from '../components/EmptyChart';

// import emptyIcon from '../img/noAlarmTrend.png';

const emptyIcon = 'http://data.jingan-china.cn/v2/big-platform/fire-control/gov/noAlarmTrend.png';
const DELAY = 2000;

function rand(n) {
  return Math.floor(Math.random() * n);
}

// const data = [...Array(12).keys()].map(i => {
//   let m = i + 9;
//   // let y = 17;
//   // if (m > 12)
//   //     y = 18;
//   m = m % 12;
//   const dateTime = `${m + 1}月`;

//   // const dateTime = `${y}-${m}`;
//   const warnTrueCount = rand(100);
//   const warnFalseCount = rand(100);
//   const percent = (warnTrueCount / ( warnTrueCount + warnFalseCount ));
//   return { dateTime, warnTrueCount, warnFalseCount, percent };
// });

function handleSource(list) {
  list.reverse();
  const source = [['时间', '真实火警', '误报火警', '误报率']];
  list.forEach(({ dateTime, warnTrueCount, warnFalseCount, percent }) => source.push([dateTime, warnTrueCount, warnFalseCount, Number.parseInt(percent, 10)]));
  return source;
}

export default class TrendSection extends PureComponent {
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

  // handleChartReady = (chart) => {
  //   if (!this.chart)
  //     this.chart = chart;
  // }

  // handleMouseenter = () => {
  //   console.log('enter');
  //   clearInterval(this.timer);
  // };

  // handleMouseleave = () => {
  //   console.log('leave');
  //   this.timer = setInterval(this.tipMove, DELAY);
  // };

  render() {
    const { data: { list = [] }, title, isBack=false } = this.props;
    const source = handleSource(list);
    // const source = handleSource(data);

    this.length = list.length;
    const option = {
      legend: {
        top: 18,
        right: 10,
        data: ['真实火警', '误报火警', '误报率'],
        textStyle: { color: '#FFF' },
      },
      grid: {
        top: 70,
        bottom: 40,
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter(params) {
          return params.reduce(function (prev, next, index) {
            const { data, marker, seriesName } = next;
            switch(index) {
              case 0:
                return `${prev}${data[0]}<br/>${marker}${seriesName}: ${data[index + 1]}`;
              case data.length - 2:
                return `${prev}<br/>${marker}${seriesName}: ${data[index + 1]}%`;
              default:
                return `${prev}<br/>${marker}${seriesName}: ${data[index + 1]}`;
            }
          }, '');
        },
      },
      dataset: { source },
      xAxis: {
        type: 'category',
        axisLine: { lineStyle: { width: 2, color: 'rgb(62,71,89)' },
        },
      },
      yAxis: [{
        type: 'value',
        axisLine: { lineStyle: { width: 2, color: 'rgb(62,71,89)' } },
        splitLine: { show: false },
        // 小数标签不显示
        axisLabel: {
          formatter: function (value, index) {
              if (myParseInt(value) !== value)
                return "";
              return myParseInt(value);
          },
        },
      }, {
        type: 'value',
        min: 0,
        max: 100,
        axisLine: { lineStyle: { width: 2, color: 'rgb(62,71,89)' } },
        splitLine: { show: false },
      }],
      series: [
          {
            type: 'bar',
            // itemStyle: { color: 'rgb(225,103,98)' },
          },
          {
            type: 'bar',
            // itemStyle: { color: 'rgb(149,167,188)' },
          },
          {
            type: 'line',
            yAxisIndex: 1,
            symbol: 'circle',
            smooth: true,
            itemStyle: { color: 'rgb(0,168,255)' },
            lineStyle: { color: 'rgb(0,168,255)' },
          },
      ],
      textStyle: {
        color: '#FFF',
      },
  };

  let chartComponent = <EmptyChart url={emptyIcon} title="暂无火警趋势" />;
  if (list.length)
    chartComponent = (
      <ReactEcharts
        option={option}
        style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%' }}
        onChartReady={chart => { this.chart = chart; }}
        // onChartReady={this.handleChartReady}
      />
    );

    return (
      <FcSection title={title} style={{ position: 'relative' }} isBack={isBack}>
        {chartComponent}
      </FcSection>
    )
  }
}
