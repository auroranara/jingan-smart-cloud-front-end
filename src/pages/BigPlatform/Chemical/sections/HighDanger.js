import React, { PureComponent, Fragment } from 'react';
import ReactEcharts from 'echarts-for-react';
import { Section2 as CustomSection } from '@/jingan-components/CustomSection';
// 引入样式文件
import styles from './HighDanger.less';

const chartData = [
  { value: 10, name: '库区' },
  { value: 5, name: '库房' },
  { value: 15, name: '储罐区' },
  { value: 25, name: '库区1' },
  { value: 20, name: '库房1' },
  { value: 35, name: '储罐区1' },
];

export default class HighDanger extends PureComponent {
  state = {};

  getOption = () => {
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{b} : {c} ({d}%)',
      },
      color: ['#ce5291', '#03c9e1', '#bcbcbd', '#847be6', '#f6b54e', '#0f89f5'],
      legend: {
        top: 'middle',
        right: 10,
        orient: 'vertical',
        icon: 'circle',
        textStyle: {
          color: '#fff',
        },
        data: chartData.map(item => item.name),
      },
      calculable: true,
      series: [
        {
          type: 'pie',
          radius: [55, 80],
          center: ['40%', '50%'],
          label: {
            normal: {
              show: false,
              formatter: '{b} :\n{c}（{d}%）',
              textStyle: {
                color: 'rgba(255,255,255,0.5)',
              },
            },
            emphasis: {
              show: true,
            },
          },
          lableLine: {
            normal: {
              show: false,
            },
            emphasis: {
              show: true,
            },
          },
          data: chartData,
        },
      ],
    };
    return option;
  };

  onChartReadyCallback = chart => {
    if (!chart) return;
    let currentIndex = -1;
    const chartAnimate = () => {
      const dataLen = chart.getOption().series[0].data.length;
      // 取消之前高亮的图形
      chart.dispatchAction({
        type: 'downplay',
        seriesIndex: 0,
        dataIndex: currentIndex,
      });
      currentIndex = (currentIndex + 1) % dataLen;
      // 高亮当前图形
      chart.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        dataIndex: currentIndex,
      });
    };
    // chartAnimate();
    setInterval(() => {
      chartAnimate();
    }, 5000);
  };

  render() {
    return (
      <CustomSection className={styles.container} title="重大危险源">
        <ReactEcharts
          option={this.getOption()}
          style={{ height: '100%', width: '100%' }}
          onChartReady={this.onChartReadyCallback}
          notMerge={true}
          ref={e => {
            this.echarts = e;
          }}
        />
      </CustomSection>
    );
  }
}
