import React, { PureComponent } from 'react';
import moment from 'moment';
import ReactEcharts from 'echarts-for-react';

import styles from './TrendChart.less';
import { getChartList, legendFormatter, tooltipFormatter } from '../utils';
import waterBg from '@/pages/BigPlatform/Gas/imgs/no-monitor.png';

const noData = {
  title: {
    show: true,
    text: '暂无数据',
    top: '30%',
    left: 'center',
    textStyle: {
      color: '#fff',
      fontWeight: 200,
      fontSize: 18,
    },
  },
};
const defaultOption = {
  color: ['#f7e68a', '#00a181', '#ff4848', '#00a8ff'],
  grid: {
    top: 35,
    right: 30,
    bottom: 60,
    left: 60,
  },
  legend: {
    left: 20,
    bottom: 5,
    icon: 'circle',
    data: [],
    selectedMode: false,
    textStyle: {
      color: '#ccd6e9',
    },
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'line',
      lineStyle: {
        color: '#3e4d67',
        type: 'dashed',
      },
    },
    backgroundColor: 'rgba(32,54,77,0.8)',
    padding: [8, 12],
    extraCssText: 'z-index: 996;',
  },
  xAxis: {
    axisLine: {
      show: true,
      lineStyle: {
        color: '#3e4d67',
        width: 1,
      },
    },
    axisLabel: {
      color: '#fff',
      fontSize: 14,
      formatter: name => {
        return moment(name).format('HH:mm');
      },
    },
    splitLine: {
      show: false,
    },
    splitNumber: 12,
    type: 'time',
  },
  yAxis: {
    scale: true,
    nameTextStyle: {
      color: '#fff',
    },
    axisLabel: {
      color: '#fff',
      fontSize: 14,
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: '#3e4d67',
        width: 1,
      },
    },
    axisLine: {
      show: false,
      lineStyle: {
        color: '#3e4d67',
        width: 1,
      },
    },
  },
  series: [],
};

export default class TrendChart extends PureComponent {
  componentWillUnmount() {
    clearInterval(this.echartAnimate);
  }

  getOptions = () => {
    const {
      data: {
        params: { deviceParamsInfo: { normalLower, normalUpper }, desc, unit },
        history,
      },
    } = this.props;

    let option = {};
    const limits = [normalLower, normalUpper];
    const filteredHistory = history.filter(({ value }) => !Number.isNaN(Number.parseFloat(value))); // 剔除一些非数字的值

    if (!filteredHistory.length) return noData;
    option = {
      ...defaultOption,
      title: {
        text: legendFormatter(limits, unit),
        textStyle: {
          fontSize: 12,
          color: '#fff',
          fontWeight: 200,
        },
        right: 0,
        bottom: 5,
      },
      legend: {
        ...defaultOption.legend,
        data: [desc],
      },
      tooltip: {
        ...defaultOption.tooltip,
        formatter: params => {
          return tooltipFormatter(params);
        },
      },
      yAxis: {
        ...defaultOption.yAxis,
        name: `单位(${unit})`,
      },
      series: [
        {
          type: 'line',
          name: desc,
          smooth: true,
          symbolSize: 5,
          data: getChartList(filteredHistory, limits),
        },
      ],
    };
    // if (history.length === 0) {
    //   option = {
    //     ...option,
    //     ...noData,
    //   };
    // }

    return option;
  };

  onChartReadyCallback = chart => {
    this.currentIndex = -1;
    const chartAnimate = () => {
      if (!chart) return;
      const chartSeries = chart.getOption().series;
      if (chartSeries.length === 0) return;
      let maxIndex = 0;
      let maxLength = 0;
      chartSeries.forEach((series, index) => {
        const { data } = series;
        maxLength = data.length > maxLength ? data.length : maxLength;
        maxIndex = data.length > maxLength ? index : maxIndex;
      });
      this.currentIndex = (this.currentIndex + 1) % maxLength;
      chart.dispatchAction({
        type: 'showTip',
        seriesIndex: maxIndex,
        dataIndex: this.currentIndex,
      });
    };
    chartAnimate();
    this.echartAnimate = setInterval(() => {
      chartAnimate();
    }, 5000);
  };

  render() {
    const { data: { history } } = this.props;
    const child = history.length ? (
      <ReactEcharts
        option={this.getOptions()}
        style={{ flex: 1, width: '100%', minWidth: '50px' }}
        className="echarts-for-echarts"
        notMerge={true}
        onChartReady={this.onChartReadyCallback}
      />
    ) : <div className={styles.noCards} style={{ backgroundImage: `url(${waterBg})` }} />;

    return (
      <div
        className={styles.ElectricityCharts}
        style={{ height: '300px', width: '100%', display: 'flex', flexDirection: 'column' }}
      >
        {child}
      </div>
    );
  }
}
