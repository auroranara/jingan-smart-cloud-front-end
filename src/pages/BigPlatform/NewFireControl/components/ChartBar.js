import React, { PureComponent } from 'react';
import ReactEcharts from 'echarts-for-react';

const DEFAULT_COLORS = ['232, 103, 103', '246, 181, 78', '42, 139, 213', '2, 252, 250'];

const LINE_STYLE = { width: 2, color: 'rgb(64, 95, 135)' };

export default class ChartBar extends PureComponent {
  render() {
    const { data: list, xLabels, barWidth=20, labelRotate=-35, yAxisRange=[null, null], sameColor, barColors } = this.props;

    const xData = xLabels || list.map(({ name }) => name);
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


    let chartComponent = <p style={{ textAlign: 'center' }}>暂无数据</p>;
    if (list.length)
      chartComponent = (
        <ReactEcharts
          option={option}
          style={{ height: 400 }}
          onChartReady={chart => { this.chart = chart; }}
        />
      );

    return chartComponent;
  }
}
