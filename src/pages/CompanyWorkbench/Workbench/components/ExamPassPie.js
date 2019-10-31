import React, { PureComponent } from 'react';
import ReactEcharts from 'echarts-for-react';

export default class ExamPassPie extends PureComponent {
  render() {
    const { data = [] } = this.props;
    const option = {
      title: {
        text: '80%',
        left: 'center',
        top: '40%',
        textStyle: {
          color: '#5b5b5b',
          fontSize: 28,
          fontWeight: 400,
        },
        subtext: '考试通过率',
        subtextStyle: {
          color: '#949494',
          fontSize: 12,
        },
      },
      textStyle: {
        color: '#fff',
      },
      color: ['#e9e9e9', '#2db7f5'],
      series: [
        {
          type: 'pie',
          radius: ['50%', '60%'],
          hoverOffset: 5,
          avoidLabelOverlap: false,
          legendHoverLink: false,
          label: {
            normal: {
              show: false,
              position: 'center',
            },
          },
          data: data.map(item => item),
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
