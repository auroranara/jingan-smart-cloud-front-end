import React, { PureComponent } from 'react';
import ReactEcharts from 'echarts-for-react';
import moment from 'moment';
import styles from './AbnormalChart.less';

class AbnormalChart extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  componentWillUnmount() {}

  getOption() {
    const { data } = this.props;
    const xData = data.map(item => moment(item.month).format('M') + '月');
    const option = {
      textStyle: {
        color: '#fff',
      },
      color: ['#f83329', '#ffb400'],
      grid: {
        top: '25px',
        left: '20px',
        right: '10px',
        bottom: '55px',
      },
      tooltip: {
        show: true,
        trigger: 'axis',
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
          shadowStyle: {
            color: 'rgba(46,78,111,0.5)',
            opacity: 0.8,
          },
        },
        backgroundColor: '#121b27',
        padding: [5, 15, 5, 15],
        extraCssText: 'box-shadow: -3px 3px 3px rgba(0, 0, 0, 0.3);border-radius: 10px;',
      },
      legend: {
        data: ['火警次数', '故障次数'],
        textStyle: {
          color: '#fff',
        },
        left: 40,
        bottom: 0,
        itemWidth: 15,
        itemHeight: 10,
        icon: 'circle',
      },
      yAxis: {
        type: 'value',
        axisTick: { show: true, inside: true },
        splitLine: {
          show: true,
          lineStyle: {
            color: 'rgba(46,78,111,0.5)',
            width: 2,
          },
        },
        axisLine: {
          show: false,
          lineStyle: {
            color: '#394456',
            width: 2,
          },
        },
        axisLabel: {
          formatter: function(value, index) {
            if (parseInt(value, 10) !== value) return '';
            return parseInt(value, 10);
          },
        },
      },
      xAxis: {
        type: 'category',
        axisTick: { show: false },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#394456',
            width: 2,
          },
        },
        axisLabel: {
          color: '#fff',
          fontSize: 14,
        },
        data: xData,
      },
      series: [
        {
          name: '火警次数',
          type: 'bar',
          barWidth: 15,
          data: data.map(item => item.unnormal),
        },
        {
          name: '故障次数',
          type: 'bar',
          barWidth: 15,
          data: data.map(item => item.faultNum),
        },
      ],
    };
    return option;
  }

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

    chart.on('click', params => {
      const { dataIndex } = params;
      const { handleParentChange, fetchCheckMsgs, closeAllDrawers } = this.props;
      const monthNum = moment().month() - (5 - dataIndex);
      const month = moment()
        .month(monthNum)
        .format('YYYY-MM');
      closeAllDrawers();
      handleParentChange({
        checkDrawer: true,
        checksMonth: month,
      });
      fetchCheckMsgs(month);
    });
  };

  render() {
    const { data = [] } = this.props;
    return (
      <div className={styles.abnormalChart}>
        {data.length ? (
          <ReactEcharts
            option={this.getOption()}
            style={{ flex: 1, width: '100%' }}
            className="echarts-for-echarts"
            notMerge={true}
            // onChartReady={this.onChartReadyCallback}
          />
        ) : (
          <div
            className={styles.noCards}
            style={{
              width: '100%',
              height: '135px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: '#4f678d',
            }}
          >
            暂无相关异常数据
          </div>
        )}
      </div>
    );
  }
}

export default AbnormalChart;
