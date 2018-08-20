import React from 'react';
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

export default function GridDangerSection(props) {
  // const { trendData: { list = [] } } = props;
  // const source = handleSource(list);
  const source = genSource();

  const option = {
    legend: {
      top: 0,
      right: 10,
      data: ['巡查次数', '隐患数量'],
      textStyle: { color: '#FFF' },
    },
    tooltip: {},
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
        lineStyle: { color: 'rgb(0,168,255)' },
        areaStyle: { color: 'rgb(0,168,255)', opacity: 0.2 },
      },
      {
        type: 'line',
        smooth: true,
        symbol: 'circle',
        showSymbol: false,
        lineStyle: { color: 'rgb(244,192,83)' },
        areaStyle: { color: 'rgb(244,192,83)', opacity: 0.2 },
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
