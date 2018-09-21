import React, { PureComponent } from 'react';
import { Select } from 'antd';
// import { connect } from 'dva';
import classNames from 'classnames';
import SectionWrapper from '../Components/SectionWrapper';
import ReactEcharts from 'echarts-for-react';

import styles from './ElectricityCharts.less';
import waterBg from '../imgs/waterBg.png';

const { Option } = Select;

const tabList = [
  {
    desc: '漏电电流',
    code: 'v1',
  },
  {
    desc: '温度',
    code: 'temp',
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
// @connect(({ monitorCompany }) => ({
//   monitorCompany,
// }))
class ElectricityCharts extends PureComponent {
  state = {
    activeTab: 0,
  };

  // componentDidMount() {
  //   const { dispatch } = this.props;
  //   // 获取传感器历史
  //   dispatch({
  //     type: 'monitorCompany/fetchGsmsHstData',
  //     payload: {
  //       deviceId: '0DNDTtrpRomhqSCSapzm9A', // need to get device id 1st
  //     },
  //   });
  //   // 获取上下线的区块
  //   dispatch({
  //     type: 'monitorCompany/fetchPieces',
  //     payload: {
  //       deviceId: '0DNDTtrpRomhqSCSapzm9A', // need to get device id 1st
  //       code: 'v1',
  //     },
  //   });
  // }

  componentWillUnmount() {
    clearInterval(this.echartAnimate);
  }

  calcItemColor = (value, pieces) => {
    let item = {
      value,
    };
    if (!pieces || pieces.length <= 0) return item;
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

  tootipFormatter = params => {
    if (Array.isArray(params)) {
      return (
        `${params[0].name}<br/>` +
        params
          .map(item => {
            return `${item.marker}<span style="color: ${
              item.color === '#e01919' ? '#e01919' : '#fff'
            }">${item.seriesName}：${item.value}</span>`;
          })
          .join('<br/>')
      );
    } else {
      return (
        `${params.name}<br/>` +
        `${params.marker}<span style="color: ${params.color === '#e01919' ? '#e01919' : '#fff'}">${
          params.seriesName
        }：${params.value}</span><br/>`
      );
    }
  };

  legendFormatter = (arr, unit) => {
    let val = null;
    arr.forEach(pieces => {
      if (!pieces || pieces.length === 0) return;
      pieces.forEach(p => {
        if (p.condition === '1') val = val < p.limitValue && val ? val : p.limitValue;
      });
    });
    return val ? `报警值：≥${val}${unit}` : null;
  };

  getOptions = () => {
    const {
      data: { gsmsHstData, electricityPieces, chartParams: { list=[] } },
    } = this.props;
    const { activeTab } = this.state;
    const paramsMap = list.reduce((prev, next) => {
      const { code, desc } = next;
      prev[code] = desc;
      return prev;
    }, {});
    console.log(paramsMap.v1);
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
    if (!gsmsHstData.today) return { ...option, ...noData };
    const {
      timeList: xData,
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
    } = gsmsHstData.today;
    const defaultOption = {
      color: ['#5ebeff', '#f7e68a', '#e38b3d', '#9893ff'],
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
        },
        data: xData,
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
        const v1 = v1List.filter(a => a !== '-');
        const v1ListNew = v1List.map(item => {
          return this.calcItemColor(item, v1Pieces);
        });
        option = {
          ...defaultOption,
          title: {
            text: this.legendFormatter([v1Pieces], 'mA'),
            textStyle: {
              fontSize: 12,
              color: '#fff',
              fontWeight: 200,
            },
            right: 25,
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
              data: v1ListNew,
            },
          ],
        };
        if (v1.length === 0) {
          option = {
            ...option,
            ...noData,
          };
        }
        break;
      case 'temp':
        const [t1, t2, t3, t4] = [v2List, v3List, v4List, v5List].map(list => list.filter(a => a !== '-'));

        const [v2Pieces, v3Pieces, v4Pieces, v5Pieces] = ['v2', 'v3', 'v4', 'v5'].map(k => electricityPieces[k]);
        const [v2ListNew, v3ListNew, v4ListNew, v5ListNew] = [[v2List, v2Pieces], [v3List, v3Pieces], [v4List, v4Pieces], [v5List, v5Pieces]]
          .map(([list, pieces]) => list.map(item => this.calcItemColor(item, pieces)));

        // const v2Pieces = electricityPieces['v2'];
        // const v2ListNew = v2List.map(item => {
        //   return this.calcItemColor(item, v2Pieces);
        // });
        // const v3Pieces = electricityPieces['v3'];
        // const v3ListNew = v3List.map(item => {
        //   return this.calcItemColor(item, v3Pieces);
        // });
        // const v4Pieces = electricityPieces['v4'];
        // const v4ListNew = v4List.map(item => {
        //   return this.calcItemColor(item, v4Pieces);
        // });
        // const v5Pieces = electricityPieces['v5'];
        // const v5ListNew = v5List.map(item => {
        //   return this.calcItemColor(item, v5Pieces);
        // });

        option = {
          ...defaultOption,
          legend: {
            ...defaultOption.legend,
            data: [paramsMap.v2 || 'A相温度', paramsMap.v3 || 'B相温度', paramsMap.v4 || 'C相温度', paramsMap.v5 || '零线温度'],
          },
          title: {
            text: this.legendFormatter([v2Pieces, v3Pieces, v4Pieces, v5Pieces], '℃'),
            textStyle: {
              fontSize: 12,
              color: '#fff',
              fontWeight: 200,
            },
            right: 25,
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
              data: v2ListNew,
            },
            {
              type: 'line',
              name: paramsMap.v3 || 'B相温度',
              smooth: true,
              symbolSize: 5,
              data: v3ListNew,
            },
            {
              type: 'line',
              name: paramsMap.v4 || 'C相温度',
              smooth: true,
              symbolSize: 5,
              data: v4ListNew,
            },
            {
              type: 'line',
              name: paramsMap.v5 || '零线温度',
              smooth: true,
              symbolSize: 5,
              data: v5ListNew,
            },
          ],
        };
        if (t1.length === 0 && t2.length === 0 && t3.length === 0 && t4.length === 0) {
          option = {
            ...option,
            ...noData,
          };
        }
        break;
      case 'ampere':
        const [ia, ib, ic] = [iaList, ibList, icList].map(list => list.filter(a => a !== '-'));
        // const ib = ibList.filter(a => a !== '-');
        // const ic = icList.filter(a => a !== '-');

        const [iaPieces, ibPieces, icPieces] = ['ia', 'ib', 'ic'].map(k => electricityPieces[k]);
        const [iaListNew, ibListNew, icListNew] = [[iaList, iaPieces], [ibList, ibPieces], [icList, icPieces]].map(([list, pieces]) => list.map(item => this.calcItemColor(item, pieces)));

        // const iaPieces = electricityPieces['ia'];
        // const iaListNew = iaList.map(item => {
        //   return this.calcItemColor(item, iaPieces);
        // });
        // const ibPieces = electricityPieces['ib'];
        // const ibListNew = ibList.map(item => {
        //   return this.calcItemColor(item, ibPieces);
        // });
        // const icPieces = electricityPieces['ic'];
        // const icListNew = icList.map(item => {
        //   return this.calcItemColor(item, icPieces);
        // });

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
            right: 25,
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
              data: iaListNew,
            },
            {
              type: 'line',
              name: paramsMap.ib || 'B相电流',
              smooth: true,
              symbolSize: 5,
              data: ibListNew,
            },
            {
              type: 'line',
              name: paramsMap.ic || 'C相电流',
              smooth: true,
              symbolSize: 5,
              data: icListNew,
            },
          ],
        };
        if (ia.length === 0 && ib.length === 0 && ic.length === 0) {
          option = {
            ...option,
            ...noData,
          };
        }
        break;
      case 'volte':
        const [ua, ub, uc] = [uaList, ubList, ucList].map(list => list.filter(a => a !== '-'));
        // const ub = ubList.filter(a => a !== '-');
        // const uc = ucList.filter(a => a !== '-');

        const [uaPieces, ubPieces, ucPieces] = ['ua', 'ub', 'uc'].map(k => electricityPieces[k]);
        const [uaListNew, ubListNew, ucListNew] = [[uaList, uaPieces], [ubList, ubPieces], [ucList, ucPieces]].map(([list, pieces]) => list.map(item => this.calcItemColor(item, pieces)));

        // const uaPieces = electricityPieces['ua'];
        // const uaListNew = uaList.map(item => {
        //   return this.calcItemColor(item, uaPieces);
        // });
        // const ubPieces = electricityPieces['ub'];
        // const ubListNew = ubList.map(item => {
        //   return this.calcItemColor(item, ubPieces);
        // });
        // const ucPieces = electricityPieces['uc'];
        // const ucListNew = ucList.map(item => {
        //   return this.calcItemColor(item, ucPieces);
        // });

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
            right: 25,
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
              data: uaListNew,
            },
            {
              type: 'line',
              name: paramsMap.ub || 'B相电压',
              smooth: true,
              symbolSize: 5,
              data: ubListNew,
            },
            {
              type: 'line',
              name: paramsMap.uc || 'C相电压',
              smooth: true,
              symbolSize: 5,
              data: ucListNew,
            },
          ],
        };
        if (ua.length === 0 && ub.length === 0 && uc.length === 0) {
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
      if (!chartSeries[0]) return;
      const dataLen = chartSeries[0].data.length;
      // 取消之前高亮的图形
      chart.dispatchAction({
        type: 'downplay',
        seriesIndex: 0,
        dataIndex: this.currentIndex,
      });
      for (let i = 0; i < dataLen; i++) {
        this.currentIndex = (this.currentIndex + 1) % dataLen;
        if (chartSeries[0].data[this.currentIndex] !== '-') break;
      }
      chartSeries.forEach(series => {
        if (series.data[series.data.length - 1].itemStyle) this.currentIndex = dataLen - 1;
      });
      // 高亮当前图形
      chart.dispatchAction({
        type: 'highlight',
        seriesIndex: 0,
        dataIndex: this.currentIndex,
      });
      // 显示 tooltip
      chart.dispatchAction({
        type: 'showTip',
        seriesIndex: 0,
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
        <SectionWrapper title="用电安全监测">
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
