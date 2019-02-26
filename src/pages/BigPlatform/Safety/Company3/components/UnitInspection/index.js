import React, { PureComponent } from 'react';
import ReactEcharts from 'echarts-for-react';
import moment from 'moment';
import Section from '../Section';
// 引入样式文件
import styles from './index.less';

/**
 * 单位巡查
 */
export default class UnitInspection extends PureComponent {
  // 图表实例
  lineChart = null;
  // 当前显示的tip索引
  currentLineIndex = -1;
  // 定时器
  showTipTimer = null;

  componentDidMount() {
    // 添加曲线图显示文字定时器
    this.showTipTimer = setInterval(this.showLineChartTip, 2000);
  }

  componentWillUnmount() {
    clearInterval(this.showTipTimer);
  }

  // 获取时间轴
  getTimeAxis = () => {
    const timeAxis = [];
    for (let i = 29; i >= 0; i--) {
      const time = moment()
        .subtract(i, 'days')
        .format('MM-DD');
      timeAxis.push(time);
    }
    return timeAxis;
  }

  /**
   * 显示曲线图的文字
   */
  showLineChartTip = () => {
    if (!this.lineChart || this.props.inspectionIndex !== 0) {
      return;
    }
    var length = this.lineChart.getOption().series[0].data.length;
    this.currentLineIndex = (this.currentLineIndex + 1) % length;
    // 显示 tooltip
    this.lineChart.dispatchAction({
      type: 'showTip',
      seriesIndex: 0,
      dataIndex: this.currentLineIndex,
    });
  }

  /**
   * 曲线图加载完毕
   */
  handleLineChartReady = chart => {
    if (document.querySelector('.domLineChart').getAttribute('_echarts_instance_') === chart.id) {
      this.lineChart = chart;
    }
  };

  render() {
    const {
      data: { check_map = [], hidden_danger_map = [] },
      // 点击事件
      onClick,
    } = this.props;
    // 获取时间轴
    const timeAxis = this.getTimeAxis();
    const checkList = Array(30).fill(0);
    const dangerList = Array(30).fill(0);
    check_map.forEach(({ month, day, self_check_point }) => {
      const time = moment(`${month}-${day}`, 'M-D').format('MM-DD');
      const index = timeAxis.indexOf(time);
      if (index !== -1) {
        checkList[index] = self_check_point;
      }
    });
    hidden_danger_map.forEach(({ month, day, created_danger }) => {
      const time = moment(`${month}-${day}`, 'M-D').format('MM-DD');
      const index = timeAxis.indexOf(time);
      if (index !== -1) {
        dangerList[index] = created_danger;
      }
    });

    // 图表配置
    const option = {
      // dataZoom: [{
      //   type: 'slider',
      //   textStyle: {
      //     color: '#fff',
      //   },
      //   top: '90%',
      //   bottom: 0,
      //   left: 45,
      //   right: 45,
      // }],
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: timeAxis,
        axisLabel: {
          interval: 1,
          color: '#fff',
        },
        splitLine: {
          lineStyle: {
            // color: ['rgb(2,28,66)'],
            color: ['#274d7e'],
          },
        },
        axisLine: {
          lineStyle: {
            // color: ['rgb(2,28,66)'],
            color: ['#274d7e'],
          },
        },
      },
      yAxis: {
        type: 'value',
        minInterval: 1,
        axisLabel: {
          color: '#fff',
        },
        splitLine: {
          lineStyle: {
            // color: ['rgb(2,28,66)'],
            color: ['#274d7e'],
          },
        },
        axisLine: {
          lineStyle: {
            // color: ['rgb(2,28,66)'],
            color: ['#274d7e'],
          },
        },
      },
      grid: {
        top: 30,
        left: 20,
        right: 20,
        // bottom: '15%',
        bottom: 10,
        containLabel: true,
      },
      tooltip: {
        position: function(point, params, dom, rect, size) {
          if (point[0] < size.viewSize[0] / 2) {
            return [point[0] + 10, '10%'];
          } else {
            return [point[0] - 10 - size.contentSize[0], '10%'];
          }
        },
        trigger: 'axis',
      },
      series: [
        {
          name: '巡查次数',
          data: checkList,
          type: 'line',
          itemStyle: {
            color: '#5EBEFF',
            borderColor: '#5EBEFF',
          },
          lineStyle: {
            color: '#5EBEFF',
          },
          areaStyle: {
            color: '#5EBEFF',
            opacity: 0.2,
          },
          smooth: true,
        },
        {
          name: '隐患数量',
          data: dangerList,
          type: 'line',
          itemStyle: {
            color: '#F7E68A',
            borderColor: '#F7E68A',
          },
          lineStyle: {
            color: '#F7E68A',
          },
          areaStyle: {
            color: '#F7E68A',
            opacity: 0.2,
          },
          smooth: true,
        },
      ],
    };

    return (
      <Section
        title="单位巡查"
        action={<span className={styles.jumpButton} onClick={onClick}>巡查记录>></span>}
      >
        <div className={styles.container}>
          <ReactEcharts
            option={option}
            style={{ height: '100%' }}
            onChartReady={this.handleLineChartReady}
            className="domLineChart"
          />
          <div className={styles.legendList}>
            <div className={styles.legendItem}>
              <span
                className={styles.legendItemIcon}
                style={{ backgroundColor: '#5EBEFF' }}
              />
              <span className={styles.legendItemName}>巡查</span>
            </div>
            <div className={styles.legendItem}>
              <span
                className={styles.legendItemIcon}
                style={{ backgroundColor: '#F7E68A' }}
              />
              <span className={styles.legendItemName}>隐患</span>
            </div>
          </div>
        </div>
      </Section>
    );
  }
}
