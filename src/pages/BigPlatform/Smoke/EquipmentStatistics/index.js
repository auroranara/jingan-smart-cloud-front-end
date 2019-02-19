import React, { PureComponent } from 'react';
import ReactEcharts from 'echarts-for-react';

export default class EquipmentStatistics extends PureComponent {
  getChartOption() {
    // const { data = [], xLabels = [] } = this.props;
    const option = {
      color: ['#00ffff'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
          shadowStyle: {
            color: 'rgba(46,78,111,0.5)',
            opacity: 0.6,
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
      legend: {
        data: ['设备数量', '故障数量'],
        textStyle: {
          color: '#fff',
        },
        orient: 'horizontal',
        left: 'right',
        icon: 'rect',
      },
      xAxis: {
        type: 'category',
        axisTick: { show: true },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#405f85',
            width: 2,
          },
        },
        axisLabel: {
          color: '#fff',
          fontSize: 12,
        },
        data: [
          '1月',
          '2月',
          '3月',
          '4月',
          '5月',
          '6月',
          '7月',
          '8月',
          '9月',
          '10月',
          '11月',
          '12月',
        ],
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
          name: '设备数量',
          color: 'rgb(4, 253, 255)',
          type: 'bar',
          barWidth: 5,
          data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 14, 13, 48.7, 18.8, 6.0, 2.3],
        },
        {
          name: '故障数量',
          type: 'bar',
          color: 'rgb(217, 61, 73)',
          barWidth: 5,
          data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 11, 12, 48.7, 18.8, 6.0, 2.3],
        },
      ],
    };
    return option;
  }

  onChartReady = chart => {
    // if (!chart) return;
    // let currentIndex = -1;
    // const chartAnimate = () => {
    //   const dataLen = chart.getOption().series[0].data.length;
    //   // 取消之前高亮的图形
    //   chart.dispatchAction({
    //     type: 'downplay',
    //     seriesIndex: 0,
    //     dataIndex: currentIndex,
    //   });
    //   currentIndex = (currentIndex + 1) % dataLen;
    //   // 高亮当前图形
    //   chart.dispatchAction({
    //     type: 'highlight',
    //     seriesIndex: 0,
    //     dataIndex: currentIndex,
    //   });
    //   // 显示 tooltip
    //   chart.dispatchAction({
    //     type: 'showTip',
    //     seriesIndex: 0,
    //     dataIndex: currentIndex,
    //   });
    // };
    // // chartAnimate();
    // setInterval(() => {
    //   chartAnimate();
    // }, 5000);
  };

  render() {
    return (
      <div style={{ width: '100%', height: '100%' }}>
        <ReactEcharts
          option={this.getChartOption()}
          style={{ height: '100%', width: '100%' }}
          // className="echarts-for-echarts"
          // onChartReady={this.onChartReady}
        />
      </div>
    );
  }
}
