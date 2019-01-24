import React, { PureComponent } from 'react';
import ReactEcharts from 'echarts-for-react';
// import moment from 'moment';

// import styles from './index.less';
// const months = Array(6)
//   .fill(true)
//   .map((_, index) => {
//     return (
//       moment()
//         .month(index - 5)
//         .format('M') + '月'
//     );
//   });

export default class AlarmChart extends PureComponent {
  getChartOption() {
    const { data=[], xLabels=[] } = this.props;
    const option = {
      color: ['#00ffff'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'line',
          lineStyle: {
            color: '#405f85',
          },
        },
        backgroundColor: 'rgba(46,78,111,0.5)',
        padding: [5, 15, 5, 15],
      },
      grid: {
        top: '45px',
        left: '40px',
        right: '10px',
        bottom: '35px',
      },
      // toolbox: {
      //   feature: {
      //     dataView: { show: true, readOnly: false },
      //     magicType: { show: true, type: ['line', 'bar'] },
      //     restore: { show: true },
      //     saveAsImage: { show: true },
      //   },
      // },
      legend: {
        data: ['报警次数'],
        textStyle: {
          color: '#fff',
        },
      },
      xAxis: {
        type: 'category',
        axisTick: { show: true, inside: true },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#405f85',
            width: 2,
          },
        },
        axisLabel: {
          color: '#fff',
          fontSize: 14,
        },
        // data: months,
        data: xLabels,
      },
      yAxis: [
        {
          type: 'value',
          axisTick: { show: true, inside: true },
          splitLine: {
            show: false,
            lineStyle: {
              color: '#405f85',
              width: 2,
            },
          },
          axisLine: {
            show: true,
            lineStyle: {
              color: '#405f85',
              width: 2,
            },
          },
          axisLabel: {
            color: '#fff',
            formatter: function(value, index) {
              if (parseInt(value, 10) !== value) return '';
              return parseInt(value, 10);
            },
          },
        },
      ],
      series: [
        {
          name: '报警次数',
          type: 'line',
          symbol: 'circle',
          // data: [26, 18, 12, 34, 17, 24],
          data,
        },
      ],
    };
    return option;
  }

  onChartReady = chart => {
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
      // 显示 tooltip
      chart.dispatchAction({
        type: 'showTip',
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
      <div style={{ width: '100%', height: '100%' }}>
        <ReactEcharts
          option={this.getChartOption()}
          style={{ height: '100%', width: '100%' }}
          // className="echarts-for-echarts"
          onChartReady={this.onChartReady}
        />
      </div>
    );
  }
}
