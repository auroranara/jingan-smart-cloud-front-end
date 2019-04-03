import React, { PureComponent } from 'react';
import ReactEcharts from 'echarts-for-react';

export default class EquipmentStatistics extends PureComponent {
  getChartOption = brandList => {
    const option = {
      color: ['#00ffff'],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
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
          fontSize: 14,
        },
        data: brandList.map(item => item.optional_desc),
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
          barWidth: '25%',
          barMaxWidth: 20,
          data: brandList.map(item => item.totalNum),
        },
        {
          name: '故障数量',
          type: 'bar',
          color: 'rgb(217, 61, 73)',
          barWidth: '25%',
          barMaxWidth: 20,
          data: brandList.map(item => item.faultNum),
        },
      ],
    };
    return option;
  };

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
    const {
      brandData: { brandList = [] },
    } = this.props;
    return (
      <div style={{ width: '100%', height: '100%' }}>
        <ReactEcharts
          option={this.getChartOption(brandList)}
          style={{ height: '100%', width: '100%' }}
          // className="echarts-for-echarts"
          // onChartReady={this.onChartReady}
        />
      </div>
    );
  }
}
