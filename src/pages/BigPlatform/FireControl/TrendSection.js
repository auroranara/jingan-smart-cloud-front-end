import React from 'react';
import ReactEcharts from 'echarts-for-react'

import FcSection from './FcSection';

function rand(n) {
  return Math.floor(Math.random() * n);
}

const data = [...Array(12).keys()].map(i => {
  let m = i + 9;
  // let y = 17;
  // if (m > 12)
  //     y = 18;
  m = m % 12;
  const dateTime = `${m + 1}月`;

  // const dateTime = `${y}-${m}`;
  const warnTrueCount = rand(100);
  const warnFalseCount = rand(100);
  const percent = (warnTrueCount / ( warnTrueCount + warnFalseCount ));
  return { dateTime, warnTrueCount, warnFalseCount, percent };
});

function handleSource(list) {
  list.reverse();
  const source = [['时间', '真实火警', '误报火警', '误报率']];
  list.forEach(({ dateTime, warnTrueCount, warnFalseCount, percent }) => source.push([dateTime, warnTrueCount, warnFalseCount, percent]));
  return source;
}

export default function TrendSection(props) {
  const { trendData: { list = [] } } = props;
  // const source = handleSource(list);
  const source = handleSource(data);

  const option = {
    legend: {
      top: 0,
      right: 10,
      data: ['真实火警', '误报火警', '误报率'],
      textStyle: { color: '#FFF' },
    },
    tooltip: {},
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
    }, {
      type: 'value',
      min: 0,
      max: 1,
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
          // itemStyle: { color: 'rgb(0,168,255)' },
          lineStyle: { color: 'rgb(0,168,255)' },
        },
    ],
    textStyle: {
      color: '#FFF',
    },
};

  return (
    <FcSection title="火警趋势" style={{ position: 'relative' }}>
      <ReactEcharts option={option} style={{ position: 'absolute', left: 0, top: 15, width: '100%', height: '100%' }} />
    </FcSection>
  )
}
