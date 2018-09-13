import React, { PureComponent } from 'react';
import { Select } from 'antd';
import { connect } from 'dva';
import classNames from 'classnames';
import SectionWrapper from '../Components/SectionWrapper';
import ReactEcharts from 'echarts-for-react';

import styles from './ElectricityCharts.less';

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

  getOptions = () => {
    const {
      data: { gsmsHstData, electricityPieces },
    } = this.props;
    const { activeTab } = this.state;
    let option = {};
    if (!gsmsHstData.today) return option;
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
        const pieces = electricityPieces['v1'];
        option = {
          ...defaultOption,
          legend: {
            ...defaultOption.legend,
            data: ['剩余电流'],
          },
          series: [
            {
              type: 'line',
              name: '剩余电流',
              smooth: true,
              data: v1List,
            },
          ],
        };
        if (pieces && pieces.length > 0) {
          const markLine = pieces.filter(d => d.lte).map(item => {
            return {
              yAxis: item.lte,
            };
          });
          option = {
            ...option,
            visualMap: {
              show: false,
              pieces: pieces,
            },
            series: [
              {
                ...option.series[0],
                markLine: {
                  silent: true,
                  data: markLine,
                },
              },
            ],
          };
        }
        break;
      case 'temp':
        option = {
          ...defaultOption,
          legend: {
            ...defaultOption.legend,
            data: ['温度1', '温度2', '温度3', '环境温度'],
          },
          series: [
            {
              type: 'line',
              name: '温度1',
              smooth: true,
              data: v2List,
            },
            {
              type: 'line',
              name: '温度2',
              smooth: true,
              data: v3List,
            },
            {
              type: 'line',
              name: '温度3',
              smooth: true,
              data: v4List,
            },
            {
              type: 'line',
              name: '环境温度',
              smooth: true,
              data: v5List,
            },
          ],
        };
        break;
      case 'ampere':
        option = {
          ...defaultOption,
          legend: {
            ...defaultOption.legend,
            data: ['A相电流', 'B相电流', 'C相电流'],
          },
          series: [
            {
              type: 'line',
              name: 'A相电流',
              smooth: true,
              data: iaList,
            },
            {
              type: 'line',
              name: 'B相电流',
              smooth: true,
              data: ibList,
            },
            {
              type: 'line',
              name: 'C相电流',
              smooth: true,
              data: icList,
            },
          ],
        };
        break;
      case 'volte':
        option = {
          ...defaultOption,
          legend: {
            ...defaultOption.legend,
            data: ['A相电压', 'B相电压', 'C相电压'],
          },
          series: [
            {
              type: 'line',
              name: 'A相电压',
              smooth: true,
              data: uaList,
            },
            {
              type: 'line',
              name: 'B相电压',
              smooth: true,
              data: ubList,
            },
            {
              type: 'line',
              name: 'C相电压',
              smooth: true,
              data: ucList,
            },
          ],
        };
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
      if (!chart.getOption().series[0]) return;
      const dataLen = chart.getOption().series[0].data.length;
      // 取消之前高亮的图形
      chart.dispatchAction({
        type: 'downplay',
        seriesIndex: 0,
        dataIndex: this.currentIndex,
      });
      for (let i = 0; i < dataLen; i++) {
        this.currentIndex = (this.currentIndex + 1) % dataLen;
        if (chart.getOption().series[0].data[this.currentIndex] !== '-') break;
      }
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
    // chartAnimate();
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
        <div className={styles.selectIcon}>
          <Select style={{ width: 140 }} value={selectVal} onSelect={handleSelect}>
            {list.map(({ deviceId, area, location }) => (
              <Option key={deviceId}>{`${area}：${location}`}</Option>
            ))}
          </Select>
        </div>
        <SectionWrapper title="用电安全监测">
          {this.renderTabs()}
          <ReactEcharts
            option={this.getOptions()}
            style={{ flex: 1, width: '100%' }}
            className="echarts-for-echarts"
            notMerge={true}
            onChartReady={this.onChartReadyCallback}
          />
        </SectionWrapper>
      </div>
    );
  }
}

export default ElectricityCharts;
