import React, { PureComponent } from 'react';
import ReactEcharts from 'echarts-for-react';

export default class DepartLine extends PureComponent {
  render() {
    const { dataGoal = [], dataReal = [], xData = [], otherType } = this.props;

    const option = {
      textStyle: {
        color: '#666666',
      },
      color: ['#2db7f5', '#7dc856'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '6%',
        containLabel: true,
      },
      legend: {
        show: true,
        orient: 'vertical',
        icon: 'rect',
        itemWidth: 12,
        itemHeight: 12,
        x: 'right',
      },
      xAxis: [
        {
          type: 'category',
          axisLine: {
            lineStyle: {
              color: '#d3d3d3', //更改坐标轴颜色
            },
          },
          data: xData.map(item => item),
        },
      ],
      yAxis: [
        {
          type: 'value',
          splitLine: {
            show: false,
          },
          axisLine: {
            lineStyle: {
              color: '#d3d3d3',
              width: 1,
            },
          },
        },
      ],
      series: [
        {
          name: '目标值',
          type: 'bar',
          barWidth: '10%',
          data: dataGoal.map(item => item),
        },
        {
          name: '实际值',
          type: 'bar',
          barWidth: '10%',
          data: dataReal.map(item => item),
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
