import React, { PureComponent } from 'react';
import ReactEcharts from 'echarts-for-react';

export default class RiskPointPie extends PureComponent {
  render() {
    const { data = [], num = [] } = this.props;

    const legendPer = { 待检查未超期: data[0], 待检查已超期: data[1], 已检查: data[2] };
    const legendNum = { 待检查未超期: num[0], 待检查已超期: num[1], 已检查: num[2] };

    const option = {
      title: {
        text: 45,
        left: 'center',
        top: '30%',
        textStyle: {
          color: '#5b5b5b',
          fontSize: 28,
          fontWeight: 400,
        },
        subtext: '个',
        subtextStyle: {
          color: '#949494',
          fontSize: 12,
        },
      },
      color: ['#2db7f5', '#7dc856', '#f9bf00'],
      legend: {
        show: true,
        orient: 'vertical',
        x: 'center',
        y: 'bottom',
        icon: 'circle',
        data: ['待检查未超期', '待检查已超期', '已检查'],
        formatter: name => {
          return `{a|${name}}{b|${legendPer[name]}%}{c|${legendNum[name]}个}`;
        },
        textStyle: {
          color: '#949494',
          fontSize: 12,
          rich: {
            a: {
              width: 70,
              fontSize: 12,
            },
            b: {
              width: 50,
              align: 'right',
              fontSize: 12,
            },
            c: {
              width: 20,
              align: 'left',
            },
          },
        },
        // itemGap: 12,
      },
      series: [
        {
          type: 'pie',
          radius: ['50%', '60%'],
          center: ['50%', '40%'],
          hoverOffset: 5,
          avoidLabelOverlap: false,
          legendHoverLink: false,
          label: {
            normal: {
              show: false,
              position: 'center',
            },
          },
          data: [
            { value: data[0], name: '待检查未超期' },
            { value: data[1], name: '待检查已超期' },
            { value: data[2], name: '已检查' },
          ],
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
