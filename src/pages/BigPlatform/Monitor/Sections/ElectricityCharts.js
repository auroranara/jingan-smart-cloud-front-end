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
    desc: '剩余电流',
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

  getOptions = () => {
    const {
      data: { gsmsHstData, electricityPieces },
    } = this.props;
    const { activeTab } = this.state;
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
        bottom: 40,
        left: 20,
        containLabel: true,
      },
      legend: {
        left: 'center',
        bottom: 5,
        icon: 'circle',
        data: [],
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
          legend: {
            ...defaultOption.legend,
            data: ['剩余电流'],
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
              name: '剩余电流',
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
        const t1 = v2List.filter(a => a !== '-');
        const t2 = v3List.filter(a => a !== '-');
        const t3 = v4List.filter(a => a !== '-');
        const t4 = v5List.filter(a => a !== '-');

        const v2Pieces = electricityPieces['v2'];
        const v2ListNew = v2List.map(item => {
          return this.calcItemColor(item, v2Pieces);
        });
        const v3Pieces = electricityPieces['v3'];
        const v3ListNew = v3List.map(item => {
          return this.calcItemColor(item, v3Pieces);
        });
        const v4Pieces = electricityPieces['v4'];
        const v4ListNew = v4List.map(item => {
          return this.calcItemColor(item, v4Pieces);
        });
        const v5Pieces = electricityPieces['v5'];
        const v5ListNew = v5List.map(item => {
          return this.calcItemColor(item, v5Pieces);
        });
        option = {
          ...defaultOption,
          legend: {
            ...defaultOption.legend,
            data: ['A相温度', 'B相温度', 'C相温度', '环境温度'],
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
              name: 'A相温度',
              smooth: true,
              symbolSize: 5,
              data: v2ListNew,
            },
            {
              type: 'line',
              name: 'B相温度',
              smooth: true,
              symbolSize: 5,
              data: v3ListNew,
            },
            {
              type: 'line',
              name: 'C相温度',
              smooth: true,
              symbolSize: 5,
              data: v4ListNew,
            },
            {
              type: 'line',
              name: '环境温度',
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
        const ia = iaList.filter(a => a !== '-');
        const ib = ibList.filter(a => a !== '-');
        const ic = icList.filter(a => a !== '-');

        const iaPieces = electricityPieces['ia'];
        const iaListNew = iaList.map(item => {
          return this.calcItemColor(item, iaPieces);
        });
        const ibPieces = electricityPieces['ib'];
        const ibListNew = ibList.map(item => {
          return this.calcItemColor(item, ibPieces);
        });
        const icPieces = electricityPieces['ic'];
        const icListNew = icList.map(item => {
          return this.calcItemColor(item, icPieces);
        });
        option = {
          ...defaultOption,
          legend: {
            ...defaultOption.legend,
            data: ['A相电流', 'B相电流', 'C相电流'],
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
              name: 'A相电流',
              smooth: true,
              symbolSize: 5,
              data: iaListNew,
            },
            {
              type: 'line',
              name: 'B相电流',
              smooth: true,
              symbolSize: 5,
              data: ibListNew,
            },
            {
              type: 'line',
              name: 'C相电流',
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
        const ua = uaList.filter(a => a !== '-');
        const ub = ubList.filter(a => a !== '-');
        const uc = ucList.filter(a => a !== '-');

        const uaPieces = electricityPieces['ua'];
        const uaListNew = uaList.map(item => {
          return this.calcItemColor(item, uaPieces);
        });
        const ubPieces = electricityPieces['ub'];
        const ubListNew = ubList.map(item => {
          return this.calcItemColor(item, ubPieces);
        });
        const ucPieces = electricityPieces['uc'];
        const ucListNew = ucList.map(item => {
          return this.calcItemColor(item, ucPieces);
        });
        option = {
          ...defaultOption,
          legend: {
            ...defaultOption.legend,
            data: ['A相电压', 'B相电压', 'C相电压'],
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
              name: 'A相电压',
              smooth: true,
              symbolSize: 5,
              data: uaListNew,
            },
            {
              type: 'line',
              name: 'B相电压',
              smooth: true,
              symbolSize: 5,
              data: ubListNew,
            },
            {
              type: 'line',
              name: 'C相电压',
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
