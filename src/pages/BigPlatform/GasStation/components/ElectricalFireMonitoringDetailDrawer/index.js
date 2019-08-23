import React, { PureComponent, Fragment } from 'react';
import { Spin } from 'antd';
import { connect } from 'dva';
import classNames from 'classnames';
import moment from 'moment';
import ReactEcharts from "echarts-for-react";

import CustomDrawer from '@/jingan-components/CustomDrawer';
import CustomSelect from '@/jingan-components/CustomSelect';
import noTrend from '@/pages/BigPlatform/Gas/imgs/no-monitor.png';
import styles from './index.less';
import { UnitInfo } from '../Components';

const STATE = {
  activeKey: '漏电电流',
  activeType: '1',
  countLoading: false,
};
const TYPES = [
  {
    key: '1',
    value: '最近一周',
  },
  {
    key: '2',
    value: '最近一月',
  },
  {
    key: '3',
    value: '最近三月',
  },
  {
    key: '4',
    value: '最近半年',
  },
  {
    key: '5',
    value: '最近一年',
  },
];

/* 电气火灾监测详情抽屉 */
@connect(({ gasStation, loading }) => ({
  gasStation,
  loading: loading.effects['gasStation/fetchDistributionBoxTodayData'],
}))
export default class ElectricalFireMonitoringDetailDrawer extends PureComponent {
  state = {
    ...STATE,
  }

  componentDidUpdate({ visible: prevVisible, activeKey: prevActiveKey }) {
    const { visible, activeKey } = this.props;
    if (!prevVisible && visible) {
      this.getDistributionBoxTodayData();
      this.getDistributionBoxAlarmCount(STATE.activeType);
      this.setState({
        ...STATE,
        activeKey,
      });
      this.scrollTop();
    }
  }

  setScrollReference = (scroll) => {
    this.scroll = scroll && scroll.dom;
  }

  scrollTop = () => {
    this.scroll && this.scroll.scrollTop();
  }

  getDistributionBoxAlarmCount(type, callback) {
    const { dispatch, value: { id } } = this.props;
    dispatch({
      type: 'gasStation/fetchDistributionBoxAlarmCount',
      payload: {
        deviceId: id,
        type,
      },
      callback,
    });
  }

  getDistributionBoxTodayData() {
    const { dispatch, value: { id } } = this.props;
    dispatch({
      type: 'gasStation/fetchDistributionBoxTodayData',
      payload: {
        deviceId: id,
      },
    });
  }

  getGaugeOption = ({ name, value, unit, min, max, normalMin, normalMax, status }) => {
    let color, itemColor;
    if (status > 0) {
      color = '#f83329';
      itemColor = '#ff1e00';
    } else if (status < 0) {
      color = '#ccc';
      itemColor = '#ccc';
    } else {
      color = '#fff';
      itemColor = '#1e90ff';
    }
    return {
      series: [
        {
          name,
          type: 'gauge',
          radius: '90%',
          min,
          max,
          axisLine: {
            lineStyle: {
              color: status < 0 ? [[1, '#ccc']] : [
                !isNaN(normalMin) && [(normalMin - min) / (max - min), '#ff1e00'],
                !isNaN(normalMax) ? [(normalMax - min) / (max - min), '#1e90ff'] : [1, '#1e90ff'],
                !isNaN(normalMax) && [1, '#ff1e00'],
              ].filter(v => v),
              width: 15,
            },
          },
          itemStyle: {
            color: itemColor,
          },
          splitLine: {
            length: 15,
          },
          axisLabel: {
            color: '#c2c2c2',
          },
          title : {
            color: '#c2c2c2',
          },
          pointer: {
            width: 4,
          },
          detail: {
            formatter: `{a|${status < 0 || isNaN(value) ? '--' : value}}\n{b|${name}}`,
            offsetCenter: [0, '65%'],
            rich: {
              a: {
                lineHeight: 48,
                fontSize: 24,
                color,
              },
              b: {
                lineHeight: 14,
                fontSize: 14,
                color,
              },
            },
          },
          data: [
            { value, name: unit },
          ],
        },
      ],
    };
  }

  handleTabClick = (e) => {
    const activeKey = e.currentTarget.getAttribute('data-key');
    this.setState({
      activeKey,
    });
  }

  handleSelectChange = (activeType) => {
    this.setState({
      activeType,
      countLoading: true,
    });
    this.getDistributionBoxAlarmCount(activeType, () => {
      this.setState({
        countLoading: false,
      });
    });
  }

  /* 历史报警统计 */
  renderHistoricalAlarmCount() {
    const {
      gasStation: {
        distributionBoxAlarmCount=[],
      }={},
    } = this.props;
    const { activeType, countLoading } = this.state;
    const colors = ['#ef6877', '#00baff', '#f6b54e', '#20c0ce', '#448ad0', '#B6A876', '#CA68EF', '#5DAD72', '#847be6', '#bcbcbd', '#D06244'];
    const { seriesData, color, text } = distributionBoxAlarmCount.reduce((result, { desc, value }, index) => {
      if (value > 0) {
        result.seriesData.push({
          name: desc,
          value,
        });
        result.color.push(colors[index]);
        result.text += value;
      }
      return result;
    }, { seriesData: [], color: [], text: 0 });
    const option = {
      color,
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        formatter: "{b}: {c} ({d}%)",
      },
      title: {
        text,
        textStyle: {
          color: '#fff',
          fontSize: 30,
          fontWeight: 'normal',
          lineHeight: 30,
        },
        left: 'center',
        top: '35%',
      },
      legend: {
        left: 'center',
        icon: 'circle',
        bottom: 0,
        textStyle: {
          color: '#fff',
          fontSize: 14,
          lineHeight: 14,
        },
      },
      series: [
        {
          type: 'pie',
          center: ['50%', '40%'],
          radius: ['50%', '70%'],
          avoidLabelOverlap: false,
          label: {
            show: false,
          },
          data: seriesData,
        },
      ],
    };

    return (
      <Fragment>
        <div className={styles.alarmCountTitleWrapper}>
          <div className={styles.alarmCountTitle}>历史报警统计</div>
          <CustomSelect
            className={styles.select}
            data={TYPES}
            value={activeType}
            onChange={this.handleSelectChange}
          />
        </div>
        <Spin spinning={countLoading}>
          {seriesData.length > 0 ? (
            <div className={styles.pieChartWrapper}>
              <ReactEcharts
                className={styles.pieChart}
                option={option}
                key={activeType}
              />
            </div>
          ) : <div className={styles.emptyCountWrapper}><div className={styles.emptyCount}>0</div></div>}
        </Spin>
      </Fragment>
    );
  }

  renderTooltip(params, data) {
    return `${params[0].name}<br/>${
      params.map(({ marker, seriesName, seriesIndex, value: [_, value] }) => {
        const { normalMax, normalMin } = data[seriesIndex];
        return `${marker}<span style="color: ${
          value >= normalMax || value <= normalMin ? '#ff4848' : '#fff'
        }">${seriesName}：&nbsp;${isNaN(value) ? '--' : value}</span>`;
      })
      .join('<br/>')
    }`;
  }

  /* 当天监测数据趋势 */
  renderTodayMonitoringDataTrend() {
    const {
      gasStation: {
        distributionBoxTodayData=[],
      }={},
      value,
    } = this.props;
    const { activeKey } = this.state;
    const { params=[] } = value || {};
    const filteredParams = params.filter(({ name }) => name === activeKey || name.includes(activeKey) && name !== '漏电电流');
    const { unit, normalMax } = filteredParams.reduce((a, b) => a.normalMax > b.normalMax || isNaN(a.normalMax) ? b : a, {});
    const series = distributionBoxTodayData.reduce((result, { timeFlag, ia, ib, ic, ua, ub, uc, v1, v2, v3, v4, v5 }) => {
      const timestamp = +moment(timeFlag, 'HH:mm');
      let list = [];
      if (activeKey === '漏电电流') {
        list = [{
          name: '漏电电流',
          value: v1,
        }];
      } else if (activeKey === '温度') {
        list = [{
          name: 'A相温度',
          value: v2,
        }, {
          name: 'B相温度',
          value: v3,
        }, {
          name: 'C相温度',
          value: v4,
        }, {
          name: '零线温度',
          value: v5,
        }];
      } else if (activeKey === '电流') {
        list = [{
          name: 'A相电流',
          value: ia,
        }, {
          name: 'B相电流',
          value: ib,
        }, {
          name: 'C相电流',
          value: ic,
        }];
      } else if (activeKey === '电压') {
        list = [{
          name: 'A相电压',
          value: ua,
        }, {
          name: 'B相电压',
          value: ub,
        }, {
          name: 'C相电压',
          value: uc,
        }];
      }
      list.forEach(({ name, value }, index) => {
        if (result[index]) {
          result[index].data.push({
            name: timeFlag,
            value: [
              timestamp,
              parseFloat(value),
            ],
          });
        } else {
          result[index] = {
            name,
            type: 'line',
            data: [{
              name: timeFlag,
              value: [
                timestamp,
                parseFloat(value),
              ],
            }],
            smooth: true,
          };
        }
      });
      return result;
    }, []);
    const option = {
      color: ['#f7e68a', '#00a181', '#ff4848', '#00a8ff'],
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(0,0,0,0.75)',
        axisPointer: {
          lineStyle: {
            color: '#556476',
            type: 'dashed',
          },
        },
        formatter: (params) => this.renderTooltip(params, filteredParams),
      },
      title: {
        text: !isNaN(normalMax) ? `报警阈值：≥${normalMax}${unit}` : '',
        textStyle: {
          color: '#fff',
          fontSize: 14,
          fontWeight: 'normal',
          lineHeight: 14,
        },
        right: 0,
        bottom: 0,
      },
      legend: {
        icon: 'circle',
        left: 20,
        bottom: 0,
        textStyle: {
          color: '#fff',
          fontSize: 14,
          lineHeight: 14,
        },
      },
      grid: {
        top: 40,
        left: 30,
        right: 20,
        bottom: 30,
        containLabel: true,
      },
      xAxis: {
        type: 'time',
        boundaryGap: false,
        splitNumber: 12,
        axisLine: {
          lineStyle: {
            color: '#1f477a',
          },
        },
        splitLine:{
          show: false,
        },
        axisLabel: {
          color: '#fff',
          formatter: name => {
            return moment(name).format('HH:mm');
          },
        },
      },
      yAxis: {
        name: unit && `单位(${unit})`,
        nameTextStyle: {
          color: '#fff',
        },
        type: 'value',
        scale: true,
        axisLine: {
          lineStyle: {
            color: '#1f477a',
          },
        },
        splitLine:{
          lineStyle: {
            color: '#1f477a',
          },
        },
        axisLabel: {
          color: '#fff',
        },
      },
      series,
    };

    return (
      <Fragment>
        <div className={styles.subTitle}><span>>></span>当天监测数据趋势</div>
        {distributionBoxTodayData.length > 0 ? (
          <ReactEcharts
            className={styles.lineChart}
            option={option}
            key={activeKey}
          />
        ) : (
          <div className={styles.emptyTrend} style={{ backgroundImage: `url(${noTrend})` }} />
        )}
      </Fragment>
    );
  }

  /* 实时监测数据 */
  renderRealTimeMonitoringData() {
    const {
      value,
    } = this.props;
    const { activeKey } = this.state;
    const { params=[] } = value || {};
    const list = params.filter(({ name }) => name === activeKey || name.includes(activeKey) && name !== '漏电电流');

    return (
      <Fragment>
        <div className={styles.subTitle}><span>>></span>实时监测数据</div>
        {list.length > 0 ? (
          <div className={styles.realTimeContainer} style={{ justifyContent: list.length === 1 ? 'center' : 'flex-start' }}>
            {list.map(param => (
              <div className={styles.realTimeWrapper} key={param.name}>
                <ReactEcharts
                  className={styles.echarts}
                  option={this.getGaugeOption(param)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyData}>暂无数据</div>
        )}
      </Fragment>
    );
  }

  renderTabs() {
    const { activeKey } = this.state;
    const tabs = ['漏电电流', '温度', '电流', '电压'];
    return (
      <div className={styles.tabs}>
        {tabs.map((tab) => (
          <div
            className={classNames(styles.tab, activeKey === tab ? styles.selectedTab : undefined)}
            key={tab}
            data-key={tab}
            onClick={activeKey === tab ? undefined : this.handleTabClick}
          >
            {tab}
          </div>
        ))}
        <div className={styles.divider} />
      </div>
    );
  }

  render() {
    const {
      showCompany,
      visible,
      onClose,
      handleCameraOpen,
      value,
    } = this.props;
    const { name, location, companyName, params=[] } = value || {};
    const alarmParams = (params || []).filter(({ status }) => status > 0);

    return (
      <CustomDrawer
        title={
          <Fragment>
            <div className={styles.titleIcon} />
            <div className={styles.title}>
              {location}
            </div>
          </Fragment>
        }
        zIndex={1001}
        width={700}
        visible={visible}
        onClose={onClose}
        sectionProps={{
          hideIcon: true,
          scrollProps: {
            ref: this.setScrollReference,
          },
          // spinProps: {
          //   loading: !!loading,
          // },
        }}
      >
        <div className={styles.container}>
          {showCompany && (
            <UnitInfo
              style={{ marginBottom: 15 }}
              name={companyName}
              location={location}
              clickCamera={handleCameraOpen}
            />
          )}
          <div className={styles.alarmParamsTitleWrapper}>
            <div className={styles.alarmParamsTitle}>{alarmParams.length > 0 ? '报警参数' : '数据监测'}</div>
            {alarmParams.map(({ name }) => (
              <div className={styles.alarmParam} key={name}><span className={styles.alarmParamName}>{name}</span></div>
            ))}
          </div>
          {this.renderTabs()}
          {this.renderRealTimeMonitoringData()}
          {this.renderTodayMonitoringDataTrend()}
          <div className={styles.splitLine} />
          {this.renderHistoricalAlarmCount()}
        </div>
      </CustomDrawer>
    );
  }
}
