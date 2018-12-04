import React, { PureComponent } from 'react';
import { Drawer } from 'antd';
import moment from 'moment';
import ReactEcharts from 'echarts-for-react';
import Section from '../Section';

/**
 * description: 点位巡查统计
 * author: sunkai
 * date: 2018年12月03日
 */
export default class App extends PureComponent {
  // 图表
  chart = null;
  // 显示tip定时器
  showTipTimer = null;
  // 当前显示的tip索引
  currentIndex = -1;

  state = {
    visible: false,
  }


  componentDidMount() {
    // 添加曲线图显示文字定时器
    // this.showTipTimer = setInterval(this.showChartTip, 2000);
  }

  /**
   * 获取时间轴
   */
  getTimeAxis = () => {
    const timeAxis = [];
    for (let i = 0; i < 30; i++) {
      const time = moment()
        .subtract(i, 'days')
        .format('MM/DD');
      timeAxis.push(time);
    }
    return timeAxis.reverse();
  }

  /**
   * 显示曲线图的文字
   */
  showChartTip = () => {
    if (!this.chart) {
      return;
    }
    var length = this.chart.getOption().series[0].data.length;
    this.currentIndex = (this.currentIndex + 1) % length;
    // 显示 tooltip
    this.chart.dispatchAction({
      type: 'showTip',
      seriesIndex: 0,
      dataIndex: this.currentIndex,
    });
  };

  /**
   * 图标加载完毕
   */
  handleChartReady = (chart) => {
    if (document.querySelector('.pointInspectionCountChart').getAttribute('_echarts_instance_') === chart.id) {
      this.chart = chart;
      chart.on('mouseover', (e) => {
        clearInterval(this.showTipTimer);
      });
      chart.on('mouseout', (e) => {
        clearInterval(this.showTipTimer);
        this.currentIndex = e.dataIndex;
        this.showTipTimer = setInterval(this.showChartTip, 2000);
      });
      chart.on('click', (e) => {
        this.setState({ visible: true });
      });
    }
  }

  /**
   * 关闭抽屉
   */
  handleClose = () => {
    this.setState({ visible: false });
  }

  render() {
    const {
      model,
    } = this.props;
    const { visible } = this.state;

    const timeAxis = this.getTimeAxis();

    const option = {
      // 时间轴
      dataZoom: [{
        type: 'slider',
        textStyle: { color: '#fff' },
        startValue: 23,
        endValue: 29,
      }],
      // 图例
      legend: {
        pageIconColor: '#ddd',
        pageIconInactiveColor: '#999',
        pageTextStyle: { color: '#fff' },
        type: 'scroll',
        textStyle: { color: '#fff' },
      },
      xAxis: {
        type: 'category',
        // boundaryGap: false,
        data: timeAxis,
        axisLabel: {
          // interval: 0,
          color: '#fff',
        },
        axisTick: {
          alignWithLabel: true,
        },
        splitLine: { show: false },
        axisLine: { lineStyle: { color: '#ddd' } },
      },
      yAxis: [{
        type: 'value',
        minInterval: 1,
        axisLabel: {
          color: '#fff',
        },
        splitLine: { show: false },
        axisLine: { lineStyle: { color: '#ddd' } },
      }, {
        type: 'value',
        min: 0,
        max: 100,
        axisLine: { lineStyle: { color: '#ddd' } },
        splitLine: { show: false },
      }],
      grid: {
        top: 30,
        left: 20,
        right: 20,
        bottom: 40,
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
          name: '已检查',
          type: 'bar',
          symbol: 'rect',
          data: [...Array(30).keys()],
          itemStyle: { color: '#05D2DA' },
        },
        {
          name: '未检查',
          type: 'bar',
          data: [...Array(30).keys()],
          itemStyle: { color: '#8C8C8C' },
        },
        {
          name: '异常点位',
          type: 'bar',
          data: [...Array(30).keys()],
          itemStyle: { color: '#FF4848' },
        },
        {
          name: '覆盖率',
          data: [...Array(30).keys()],
          type: 'line',
          yAxisIndex: 1,
          itemStyle: {
            color: '#05D2DA',
            borderColor: '#05D2DA',
          },
          lineStyle: {
            color: '#05D2DA',
          },
          symbol: 'circle',
        },
        {
          name: '异常率',
          data: [...Array(30).keys()],
          type: 'line',
          yAxisIndex: 1,
          itemStyle: {
            color: '#FF4848',
            borderColor: '#FF4848',
          },
          lineStyle: {
            color: '#FF4848',
          },
          symbol: 'circle',
        },
      ],
      textStyle: {
        color: '#FFF',
      },
    };

    return (
      <Section title="点位巡查统计">
        <ReactEcharts
          option={option}
          style={{ width: '100%', height: '100%' }}
          onChartReady={this.handleChartReady}
          className="pointInspectionCountChart"
        />
        <Drawer visible={visible} closable={false} onClose={this.handleClose}>
          123
        </Drawer>
      </Section>
    );
  }
}
