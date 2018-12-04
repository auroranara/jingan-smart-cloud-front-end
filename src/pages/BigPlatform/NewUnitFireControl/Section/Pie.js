import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';

export default class Pie extends Component {
  getOption = (r, frontColor) => {
    const rate = Number.parseInt(r, 10);

    const option = {
      color: [frontColor, '#032c64'],
      tooltip: {
        show: false,
      },
      series: [
        {
          name: '',
          type: 'pie',
          radius: ['65%', '75%'],
          center: ['45%', '45%'],
          avoidLabelOverlap: false,
          hoverAnimation: false,
          label: {
            normal: {
              show: true,
              position: 'center',
              textStyle: {
                fontSize: '20',
                color: '#fff',
              },
              formatter: '{d}%',
            },
          },
          labelLine: {
            normal: {
              show: false,
            },
          },
          data: [
            {
              value: rate,
              itemStyle: {
                shadowColor: 'rgba(0, 0, 0, 0.8)',
                shadowBlur: 10,
              },
            },
            {
              value: 100.0 - rate,
              itemStyle: { opacity: 0.6 },
              label: { show: false },
            },
          ],
        },
      ],
    };
    return option;
  };

  render() {
    const { rate } = this.props;
    const frontColors = ['#05d2da', '#ffb650', '#ff4848'];
    let frontColor;
    if (+rate === 90) {
      frontColor = frontColors[0];
    } else if (+rate === 70) {
      frontColor = frontColors[1];
    } else {
      frontColor = frontColors[2];
    }
    return (
      <ReactEcharts
        style={{ width: '100px', height: '100px' }}
        option={this.getOption(rate, frontColor)}
        notMerge={true}
        lazyUpdate={true}
      />
    );
  }
}
