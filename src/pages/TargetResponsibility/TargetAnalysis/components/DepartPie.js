import React, { PureComponent } from 'react';
import ReactEcharts from 'echarts-for-react';

export default class DepartPie extends PureComponent {
    render() {
      const { data = [] } = this.props;
  
      const option = {
        title: {
          text: 8,
          left: 'center',
          top: '42%',
          textStyle: {
            color: '#5b5b5b',
            fontSize: 32,
            fontWeight: 400,
          },
          subtextStyle: {
            color: '#949494',
            fontSize: 12,
          },
        },
        color: ['#2db7f5', '#f4f4f4'],
        series: [
          {
            type: 'pie',
            radius: ['53%', '65%'],
            center: ['50%', '50%'],
            hoverOffset: 5,
            avoidLabelOverlap: false,
            legendHoverLink: false,
            label: {
              normal: {
                show: false,
                position: 'center',
              },
            },
            data: [{ value: data[0], name: '' }, { value: data[1], name: '' }],
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
  