import React, { PureComponent } from 'react';
import ReactEcharts from 'echarts-for-react';

export default class DepartPie extends PureComponent {
  render() {
    const { data = [], partPassRate } = this.props;
    const isNumber = data[0] === 0 && data[1] === 0;

    const option = {
      title: {
        text: partPassRate,
        subtext: '目标达成率',
        left: 'center',
        top: '42%',
        textStyle: {
          color: '#1a91ff',
          fontSize: 32,
          fontWeight: 400,
        },
        subtextStyle: {
          color: '#949494',
          fontSize: 12,
        },
      },
      color: [!isNumber ? 'rgb(28, 145, 253)' : 'rgb(242, 242, 242)', 'rgb(242, 242, 242)'],
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
          data: [
            { value: !isNumber && data[0], name: '达成目标的部门' },
            { value: !isNumber && data[1], name: '未达成目标的部门' },
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
