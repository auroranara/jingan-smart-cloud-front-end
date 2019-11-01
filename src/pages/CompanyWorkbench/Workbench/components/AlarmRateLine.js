import React, { PureComponent } from 'react';
import ReactEcharts from 'echarts-for-react';

export default class AlarmRateLine extends PureComponent {
  render() {
    const option = {
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          axisLabel: {
            formatter: function() {
              return '';
            },
          },
          boundaryGap: false,
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
        },
      ],
      yAxis: [
        {
          type: 'value',
          splitLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          axisLabel: {
            formatter: function() {
              return '';
            },
          },
        },
      ],
      series: [
        {
          name: '邮件营销',
          type: 'line',
          stack: '总量',
          areaStyle: {},
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: '#d5f0fd', // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: '#d5f0fd', // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
          },
          lineStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 1,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: '#43bef5', // 0% 处的颜色
                },
                {
                  offset: 0.5,
                  color: '#43bef5', // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: '#43bef5', // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
          },
          data: [120, 132, 101, 134, 90, 230, 210],
        },
      ],
    };

    return (
      <ReactEcharts
        option={option}
        style={{ height: '100%' }}
        // style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', zIndex: -1 }}
        onChartReady={chart => {
          this.chart = chart;
        }}
      />
    );
  }
}
