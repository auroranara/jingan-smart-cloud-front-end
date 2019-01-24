import React, { PureComponent } from 'react';
import ReactEcharts from 'echarts-for-react';

const DEFAULT_COLORS = ['232, 103, 103', '246, 181, 78', '42, 139, 213', '2, 252, 250'];
// const LIST = [120, 200, 150, 80, 70, 110, 130, 20, 10, 150];

const LINE_STYLE = { width: 2, color: 'rgb(64, 95, 135)' };

export default class ChartBar extends PureComponent {
  render() {
    // const list = LIST;
    const {
      data: list,
      barWidth = 20,
      labelRotate = -35,
      yAxisRange = [null, null],
      sameColor,
      barColors,
    } = this.props;

    // const xData = [...Array(10).keys()].map(i => ({ value: `无锡新吴机械${i}` }));
    // const seriesData = LIST.map((n, i) => ({ value: n, name: `无锡新吴机械${i}`, itemStyle: { color: `rgb(${COLORS[i > 3 ? 3 : i]})` } }));
    const xData = list.map(({ name }) => name);
    const colors = barColors || DEFAULT_COLORS;
    const lastColorIndex = colors.length - 1;
    const seriesData = list.map((item, i) => ({
      ...item,
      itemStyle: { color: `rgb(${colors[!sameColor && i < lastColorIndex ? i : lastColorIndex]})` },
    }));

    const option = {
      textStyle: { color: '#FFF' },
      grid: { left: 0, right: '12%', top: 40, containLabel: true },
      tooltip: { show: true },
      xAxis: {
        type: 'category',
        data: xData,
        axisLine: { lineStyle: LINE_STYLE },
        axisLabel: {
          rotate: labelRotate,
        },
      },
      yAxis: {
        type: 'value',
        min: yAxisRange[0],
        max: yAxisRange[1],
        axisLine: { lineStyle: LINE_STYLE },
        splitLine: { lineStyle: { color: 'rgb(64, 95, 135)' } },
        // 小数标签不显示
        axisLabel: {
          formatter: function(value, index) {
            if (Number.parseInt(value, 10) !== value) return '';
            return Number.parseInt(value, 10);
          },
        },
      },
      series: [
        {
          type: 'bar',
          barWidth,
          data: seriesData,
        },
      ],
    };

    let chartComponent = null;
    if (list.length)
      chartComponent = (
        <ReactEcharts
          option={option}
          style={{ height: 400 }}
          // style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', zIndex: -1 }}
          onChartReady={chart => {
            this.chart = chart;
          }}
        />
      );

    return chartComponent;
  }
}
