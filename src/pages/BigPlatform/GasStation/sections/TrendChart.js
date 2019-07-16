import React, { PureComponent } from 'react';
import moment from 'moment';
import ReactEcharts from 'echarts-for-react';

import styles from './TrendChart.less';
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

const calcItemColor = (item, pieces) => {
  const value = item.value[1];
  if (!pieces || pieces.length <= 0 || value === undefined) return item;
  pieces.forEach(p => {
    if (
      (p.condition === '1' && value >= p.limitValue) ||
      (p.condition === '2' && value <= p.limitValue)
    ) {
      item = {
        ...item,
        itemStyle: {
          color: '#e01919',
        },
      };
    }
  });
  return item;
};

function tooltipFormatter(params) {
  if (Array.isArray(params)) {
    return (
      `${moment(params[0].name).format('HH:mm')}<br/>` +
      params
        .map(item => {
          return `${item.marker}<span style="color: ${
            item.color === '#e01919' ? '#e01919' : '#fff'
          }">${item.seriesName}：${item.value[1]}</span>`;
        })
        .join('<br/>')
    );
  } else {
    return (
      `${moment(params.name).format('HH:mm')}<br/>` +
      `${params.marker}<span style="color: ${params.color === '#e01919' ? '#e01919' : '#fff'}">${
        params.seriesName
      }：${params.value[1]}</span><br/>`
    );
  }
};

function legendFormatter(arr, unit) {
  let val = null;
  arr.forEach(pieces => {
    if (!pieces || pieces.length === 0) return;
    pieces.forEach(p => {
      if (p.condition === '1') {
        val = val && val < p.limitValue ? val : p.limitValue;
      }
    });
  });
  return val ? `报警值：≥${val}${unit}（'报警'）` : null;
};

export default class TrendChart extends PureComponent {
  componentWillUnmount() {
    clearInterval(this.echartAnimate);
  }

  getOptions = () => {
    const {
      data: {
        deviceConfig,
        deviceHistoryData: deviceDataHistory = [],
      },
    } = this.props;

    const electricityPieces = deviceConfig.reduce((prev, next) => {
      const { code } = next;
      prev[code] = prev[code] && prev[code].length ? [...prev[code], next] : [next];
      return prev;
    }, {});

    let iaList = [],
      ibList = [],
      icList = [],
      uaList = [],
      ubList = [],
      ucList = [],
      v1List = [],
      v2List = [],
      v3List = [],
      v4List = [],
      v5List = [];
    const dataList = [
      iaList,
      ibList,
      icList,
      uaList,
      ubList,
      ucList,
      v1List,
      v2List,
      v3List,
      v4List,
      v5List,
    ];
    deviceDataHistory.forEach(item => {
      const { createTime, ia, ib, ic, ua, ub, uc, v1, v2, v3, v4, v5 } = item;
      const data = [ia, ib, ic, ua, ub, uc, v1, v2, v3, v4, v5];
      const strList = ['ia', 'ib', 'ic', 'ua', 'ub', 'uc', 'v1', 'v2', 'v3', 'v4', 'v5'];
      dataList.forEach((d, i) => {
        d.push(
          calcItemColor(
            { name: createTime, value: [createTime, +data[i]] },
            electricityPieces[strList[i]]
          )
        );
      });
    });
    const [
      iaLast,
      ibLast,
      icLast,
      uaLast,
      ubLast,
      ucLast,
      v1Last,
      v2Last,
      v3Last,
      v4Last,
      v5Last,
    ] = dataList.map(list =>
      list.filter(item => item.value[1] !== undefined && !isNaN(item.value[1]))
    );


    let option = {};
    if (!deviceDataHistory.length) return noData;
    const v1Pieces = electricityPieces['v1'];
    option = {
      ...defaultOption,
      title: {
        text: legendFormatter([v1Pieces], 'm'),
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
        data: ['水位'],
      },
      tooltip: {
        ...defaultOption.tooltip,
        formatter: params => {
          return tooltipFormatter(params);
        },
      },
      yAxis: {
        ...defaultOption.yAxis,
        name: '单位(m)',
      },
      series: [
        {
          type: 'line',
          name: '水位',
          smooth: true,
          symbolSize: 5,
          data: v1Last,
        },
      ],
    };
    if (v1Last.length === 0) {
      option = {
        ...option,
        ...noData,
      };
    }

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
    const { noData } = this.props;
    return (
      <div
        className={styles.ElectricityCharts}
        style={{ height: '300px', width: '100%', display: 'flex', flexDirection: 'column' }}
      >
        <ReactEcharts
          option={this.getOptions()}
          style={{ flex: 1, width: '100%', minWidth: '50px', display: noData ? 'block' : 'none' }}
          className="echarts-for-echarts"
          notMerge={true}
          onChartReady={this.onChartReadyCallback}
        />
        <div
          className={styles.noCards}
          style={{
            background: `url(${waterBg})`,
            display: noData ? 'none' : 'block',
          }}
        />
      </div>
    );
  }
}
