import React, { PureComponent } from 'react';
import ReactEcharts from 'echarts-for-react';

export default class Pie extends PureComponent {
  render() {
    const { data = [], color } = this.props;
    const option = {
      textStyle: {
        color: '#fff',
      },
      color: [color, '#e9e9e9'],
      series: [
        {
          type: 'pie',
          radius: ['50%', '70%'],
          hoverOffset: 5,
          avoidLabelOverlap: false,
          legendHoverLink: false,
          label: {
            normal: {
              show: false,
              position: 'center',
            },
          },
          data: [{ value: data[0] }, { value: data[1] }],
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
