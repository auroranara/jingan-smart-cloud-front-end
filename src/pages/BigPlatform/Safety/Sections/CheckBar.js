import React, { PureComponent } from 'react';
import ReactEcharts from 'echarts-for-react';
import moment from 'moment';
import styles from '../Government.less';

class CheckBar extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  componentWillUnmount() {}

  getHdPieOption() {
    const { data } = this.props;
    const xData = data.map(item => item.click_month + '月');
    const option = {
      textStyle: {
        color: '#fff',
      },
      color: ['#e86767', '#5ebeff'],
      grid: {
        top: '45px',
        left: '40px',
        right: '10px',
        bottom: '35px',
      },
      tooltip: {
        show: true,
        trigger: 'axis',
        axisPointer: {
          // 坐标轴指示器，坐标轴触发有效
          type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
          shadowStyle: {
            color: 'rgba(46,78,111,0.5)',
            opacity: 0.6,
          },
        },
        backgroundColor: 'rgba(46,78,111,0.5)',
        padding: [5, 15, 5, 15],
      },
      legend: {
        data: ['上报隐患数', '检查单位数'],
        textStyle: {
          color: '#fff',
        },
        orient: 'vertical',
        right: 10,
        itemWidth: 15,
        itemHeight: 10,
        icon: 'rect',
      },
      yAxis: {
        type: 'value',
        axisTick: { show: true, inside: true },
        splitLine: {
          show: false,
          lineStyle: {
            color: '#394456',
            width: 2,
          },
        },
        axisLine: {
          show: true,
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
          name: '上报隐患数',
          type: 'bar',
          barWidth: 15,
          data: data.map(item => item.hiddenDanger),
        },
        {
          name: '检查单位数',
          type: 'bar',
          barWidth: 15,
          data: data.map(item => item.company_num),
        },
      ],
    };
    return option;
  }

  onHdPieReadyCallback = chart => {
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
    return (
      <section
        className={styles.sectionWrapper}
        style={{ height: 'calc(50% - 6px)', marginTop: '12px' }}
      >
        <div className={styles.sectionWrapperIn}>
          <div className={styles.sectionTitle}>
            <span className={styles.titleBlock} />
            安全检查
          </div>
          <div className={styles.sectionMain} style={{ display: 'flex', flexDirection: 'column' }}>
            <div className={styles.hdPie} id="hdPie" style={{ flex: 1 }}>
              <ReactEcharts
                option={this.getHdPieOption()}
                style={{ height: '100%', width: '100%' }}
                className="echarts-for-echarts"
                onChartReady={this.onHdPieReadyCallback}
              />
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default CheckBar;
