import React, { PureComponent } from 'react';
import ReactEcharts from 'echarts-for-react';

const LIST = [120, 200, 150, 80, 70, 110, 130, 20, 10, 150];

const LINE_STYLE =  { width: 2, color: 'rgb(64, 95, 135)' };

export default class ChartLine extends PureComponent {
  render() {
    // const list = LIST;
    const { data: list, labelRotate=-35 } = this.props;

    // const xData = [...Array(10).keys()].map(i => `无锡新吴机械${i}`);
    // const seriesData = LIST.map((n, i) => ({ value: n, name: `无锡新吴机械${i}` }));
    const xData = list.map(({ name }) => name);
    const seriesData = list;

    const option = {
      textStyle: { color: '#FFF' },
      lineStyle: { color: '#0FF' },
      grid: { left: 0, right: '12%', top: 40, containLabel: true },
      tooltip: { show: true },
      xAxis: {
          type: 'category',
          data: xData,
          axisLine: { lineStyle: LINE_STYLE },
          axisLabel: { rotate: labelRotate },
      },
      yAxis: {
        type: 'value',
        axisLine: { lineStyle: LINE_STYLE },
        splitLine: { lineStyle: { color: 'rgb(64, 95, 135)' } },
        // 小数标签不显示
        axisLabel: {
          formatter: function (value, index) {
            if (Number.parseInt(value, 10) !== value)
              return "";
            return Number.parseInt(value, 10);
          },
        },
      },
      series: [{
          type: 'line',
          itemStyle: { color: '#0FF' },
          data: seriesData,
      }],
    };


    let chartComponent = null;
    if (list.length)
      chartComponent = (
        <ReactEcharts
          option={option}
          style={{ height: 400 }}
          // style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', zIndex: -1 }}
          onChartReady={chart => { this.chart = chart; }}
        />
      );

    return chartComponent;
  }
}
