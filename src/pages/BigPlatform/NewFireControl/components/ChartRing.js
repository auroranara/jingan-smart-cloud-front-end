import React, { PureComponent } from 'react';
import ReactEcharts from 'echarts-for-react';

const LIST = [
  { value: 0, name: '已超期', itemStyle: { color: 'rgb(232, 103, 103)' } },
  { value: 0, name: '待整改', itemStyle: { color: 'rgb(246, 181, 78)' } },
  { value: 0, name: '待复查', itemStyle: { color: 'rgb(42, 139, 213)' } },
];

const LABELS = ['已超期', '待整改', '待复查'];

export default class ChartRing extends PureComponent {
  render() {
    const { data } = this.props;

    const list = LIST.map((item, i) => ({ ...item, value: data[i] }));

    const option = {
      // tooltip: {
      //     trigger: 'item',
      //     formatter: "{a} <br/>{b}: {c} ({d}%)",
      // },
      legend: {
          data:[{name: '已超期', icon: 'circle'},{name: '待整改', icon: 'circle'} ,{name: '待复查', icon: 'circle'}],
          bottom: 10,
          textStyle: { color: '#FFF' },
          formatter: name => `${name} ${data[LABELS.indexOf(name)]}`,
      },
      series: [
          {
              name:'隐患状态统计',
              type:'pie',
              radius: ['35%', '65%'],
              avoidLabelOverlap: false,
              data: list,
              label: {
                normal: {
                  show: false,
                  position: 'outside',
                  formatter: '{b}\n{number|{c}}',
                  rich: {
                    number: {
                      fontSize: 20,
                      color: '#fff',
                      align: 'center',
                    },
                  },
                },
                emphasis: {
                  show: true,
                  textStyle: {
                    fontSize: 13,
                    fontWeight: 'bold',
                  },
                },
              },
              labelLine: {
                normal: {
                  show: false,
                },
                emphasis: {
                  show: true,
                },
              },
          },
      ],
  };


    let chartComponent = null;
    if (list.length)
      chartComponent = (
        <ReactEcharts
          option={option}
          // style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', zIndex: -1 }}
          onChartReady={chart => { this.chart = chart; }}
        />
      );

    return chartComponent;
  }
}
