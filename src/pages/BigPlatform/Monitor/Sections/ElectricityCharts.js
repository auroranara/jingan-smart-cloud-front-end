import React, { PureComponent } from 'react';
import { Select } from 'antd';
import classNames from 'classnames';
import moment from 'moment';
import SectionWrapper from '../Components/SectionWrapper';
import ReactEcharts from 'echarts-for-react';

import styles from './ElectricityCharts.less';
import waterBg from '../imgs/waterBg.png';

const { Option } = Select;

const tabList = [
  {
    desc: '温度',
    code: 'temp',
  },
  {
    desc: '漏电电流',
    code: 'v1',
  },
  {
    desc: '电流',
    code: 'ampere',
  },
  {
    desc: '电压',
    code: 'volte',
  },
];

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

class ElectricityCharts extends PureComponent {
  state = {
    activeTab: 0,
  };

  componentWillUnmount() {
    clearInterval(this.echartAnimate);
  }

  tootipFormatter = params => {
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

  legendFormatter = (arr, unit) => {
    let val = null;
    let lvl = null;
    arr.forEach(pieces => {
      if (!pieces || pieces.length === 0) return;
      pieces.forEach(p => {
        if (p.condition === '1') {
          val = val < p.limitValue && val ? val : p.limitValue;
          lvl = val < p.limitValue && val ? lvl : p.level;
        }
      });
    });
    return val ? `报警值：≥${val}${unit}（${+lvl === 1 ? '预警' : '告警'}）` : null;
  };

  getOptions = () => {
    const {
      data: {
        electricityPieces,
        chartParams: { list = [] },
        deviceDataHistory = [],
      },
    } = this.props;
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

    const { activeTab } = this.state;
    const paramsMap = list.reduce((prev, next) => {
      const { code, desc } = next;
      prev[code] = desc;
      return prev;
    }, {});
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
    let option = {};
    if (!deviceDataHistory.length) return { ...option, ...noData };
    const defaultOption = {
      color: ['#f7e68a', '#00a181', '#ff4848', '#00a8ff'],
      grid: {
        top: 35,
        right: 30,
        bottom: 60,
        left: 60,
        // containLabel: true,
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
    switch (tabList[activeTab].code) {
      case 'v1':
        const v1Pieces = electricityPieces['v1'];
        option = {
          ...defaultOption,
          title: {
            text: this.legendFormatter([v1Pieces], 'mA'),
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
            data: [paramsMap.v1 || '漏电电流'],
          },
          tooltip: {
            ...defaultOption.tooltip,
            formatter: params => {
              return this.tootipFormatter(params);
            },
          },
          yAxis: {
            ...defaultOption.yAxis,
            name: '单位(mA)',
          },
          series: [
            {
              type: 'line',
              name: paramsMap.v1 || '漏电电流',
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
        break;
      case 'temp':
        const [v2Pieces, v3Pieces, v4Pieces, v5Pieces] = ['v2', 'v3', 'v4', 'v5'].map(
          k => electricityPieces[k]
        );

        option = {
          ...defaultOption,
          legend: {
            ...defaultOption.legend,
            data: [
              paramsMap.v2 || 'A相温度',
              paramsMap.v3 || 'B相温度',
              paramsMap.v4 || 'C相温度',
              paramsMap.v5 || '零线温度',
            ],
          },
          title: {
            text: this.legendFormatter([v2Pieces, v3Pieces, v4Pieces, v5Pieces], '℃'),
            textStyle: {
              fontSize: 12,
              color: '#fff',
              fontWeight: 200,
            },
            right: 0,
            bottom: 5,
          },
          tooltip: {
            ...defaultOption.tooltip,
            formatter: params => {
              return this.tootipFormatter(params);
            },
          },
          yAxis: {
            ...defaultOption.yAxis,
            name: '单位(℃)',
          },
          series: [
            {
              type: 'line',
              name: paramsMap.v2 || 'A相温度',
              smooth: true,
              symbolSize: 5,
              data: v2Last,
            },
            {
              type: 'line',
              name: paramsMap.v3 || 'B相温度',
              smooth: true,
              symbolSize: 5,
              data: v3Last,
            },
            {
              type: 'line',
              name: paramsMap.v4 || 'C相温度',
              smooth: true,
              symbolSize: 5,
              data: v4Last,
            },
            {
              type: 'line',
              name: paramsMap.v5 || '零线温度',
              smooth: true,
              symbolSize: 5,
              data: v5Last,
            },
          ],
        };
        if (
          v2Last.length === 0 &&
          v3Last.length === 0 &&
          v4Last.length === 0 &&
          v5Last.length === 0
        ) {
          option = {
            ...option,
            ...noData,
          };
        }
        break;
      case 'ampere':
        const [iaPieces, ibPieces, icPieces] = ['ia', 'ib', 'ic'].map(k => electricityPieces[k]);
        option = {
          ...defaultOption,
          legend: {
            ...defaultOption.legend,
            data: [paramsMap.ia || 'A相电流', paramsMap.ib || 'B相电流', paramsMap.ic || 'C相电流'],
          },
          title: {
            text: this.legendFormatter([iaPieces, ibPieces, icPieces], 'A'),
            textStyle: {
              fontSize: 12,
              color: '#fff',
              fontWeight: 200,
            },
            right: 0,
            bottom: 5,
          },
          tooltip: {
            ...defaultOption.tooltip,
            formatter: params => {
              return this.tootipFormatter(params);
            },
          },
          yAxis: {
            ...defaultOption.yAxis,
            name: '单位(A)',
          },
          series: [
            {
              type: 'line',
              name: paramsMap.ia || 'A相电流',
              smooth: true,
              symbolSize: 5,
              data: iaLast,
            },
            {
              type: 'line',
              name: paramsMap.ib || 'B相电流',
              smooth: true,
              symbolSize: 5,
              data: ibLast,
            },
            {
              type: 'line',
              name: paramsMap.ic || 'C相电流',
              smooth: true,
              symbolSize: 5,
              data: icLast,
            },
          ],
        };
        if (iaLast.length === 0 && ibLast.length === 0 && icLast.length === 0) {
          option = {
            ...option,
            ...noData,
          };
        }
        break;
      case 'volte':
        const [uaPieces, ubPieces, ucPieces] = ['ua', 'ub', 'uc'].map(k => electricityPieces[k]);
        option = {
          ...defaultOption,
          legend: {
            ...defaultOption.legend,
            data: [paramsMap.ua || 'A相电压', paramsMap.ub || 'B相电压', paramsMap.uc || 'C相电压'],
          },
          title: {
            text: this.legendFormatter([uaPieces, ubPieces, ucPieces], 'V'),
            textStyle: {
              fontSize: 12,
              color: '#fff',
              fontWeight: 200,
            },
            right: 0,
            bottom: 5,
          },
          tooltip: {
            ...defaultOption.tooltip,
            formatter: params => {
              return this.tootipFormatter(params);
            },
          },
          yAxis: {
            ...defaultOption.yAxis,
            name: '单位(V)',
          },
          series: [
            {
              type: 'line',
              name: paramsMap.ua || 'A相电压',
              smooth: true,
              symbolSize: 5,
              data: uaLast,
            },
            {
              type: 'line',
              name: paramsMap.ub || 'B相电压',
              smooth: true,
              symbolSize: 5,
              data: ubLast,
            },
            {
              type: 'line',
              name: paramsMap.uc || 'C相电压',
              smooth: true,
              symbolSize: 5,
              data: ucLast,
            },
          ],
        };
        if (uaLast.length === 0 && ubLast.length === 0 && ucLast.length === 0) {
          option = {
            ...option,
            ...noData,
          };
        }
        break;
      default:
        option = {
          ...defaultOption,
        };
        break;
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
      // 取消之前高亮的图形
      // chart.dispatchAction({
      //   type: 'downplay',
      //   seriesIndex: maxIndex,
      //   dataIndex: this.currentIndex,
      // });
      // for (let i = 0; i < dataLen; i++) {
      //   this.currentIndex = (this.currentIndex + 1) % dataLen;
      //   if (chartSeries[0].data[this.currentIndex] !== '-') break;
      // }
      // chartSeries.forEach((series, index) => {
      //   if (series.data[series.data.length - 1]) this.currentIndex = dataLen - 1;
      // });
      this.currentIndex = (this.currentIndex + 1) % maxLength;
      // 高亮当前图形
      // chart.dispatchAction({
      //   type: 'highlight',
      //   seriesIndex: maxIndex,
      //   dataIndex: this.currentIndex,
      // });
      // 显示 tooltip
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

  handleTabChange = index => {
    this.setState({ activeTab: index });
    this.currentIndex = -1;
  };

  renderTabs = () => {
    const { activeTab } = this.state;
    return (
      <div className={styles.tabsWrapper}>
        {tabList.map((item, index) => {
          const tabItemStyles = classNames(styles.tabItem, {
            [styles.active]: activeTab === index,
          });
          return (
            <span
              className={tabItemStyles}
              key={item.code}
              onClick={() => {
                this.handleTabChange(index);
              }}
            >
              {item.desc}
            </span>
          );
        })}
      </div>
    );
  };

  render() {
    const {
      title,
      selectVal,
      handleSelect,
      data: {
        chartDeviceList: { list = [] },
      },
    } = this.props;

    return (
      <div className={styles.ElectricityCharts} style={{ height: '100%', width: '100%' }}>
        {list && list.length ? (
          <div className={styles.selectIcon}>
            <Select
              value={selectVal}
              onSelect={handleSelect}
              dropdownClassName={styles.selectDropDown}
            >
              {list.map(({ deviceId, area, location }) => (
                <Option key={deviceId}>{`${area}：${location}`}</Option>
              ))}
            </Select>
          </div>
        ) : null}
        <SectionWrapper title={title}>
          {this.renderTabs()}
          {list && list.length ? (
            <ReactEcharts
              option={this.getOptions()}
              style={{ flex: 1, width: '100%' }}
              className="echarts-for-echarts"
              notMerge={true}
              onChartReady={this.onChartReadyCallback}
            />
          ) : (
            <div
              className={styles.noCards}
              style={{
                background: `url(${waterBg})`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center center',
                backgroundSize: 'auto 55%',
              }}
            />
          )}
        </SectionWrapper>
      </div>
    );
  }
}

export default ElectricityCharts;
