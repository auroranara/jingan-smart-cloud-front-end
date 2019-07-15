import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import classNames from 'classnames';
import ReactEcharts from "echarts-for-react";
import CustomDrawer from '@/jingan-components/CustomDrawer';
import styles from './index.less';

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
    value: '最近一季',
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

  componentDidUpdate({ visible: prevVisible }) {
    const { visible } = this.props;
    if (!prevVisible && visible) {
      this.getDistributionBoxTodayData();
      this.getDistributionBoxAlarmCount(STATE.activeType);
      this.setState({
        ...STATE,
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
    const color = status > 0 ? '#f83329' : '#fff';
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
                normalMin === min && status === 0 ? undefined : [(normalMin - min) / (max - min), '#ff1e00'],
                [(normalMax - min) / (max - min), '#1e90ff'],
                normalMax === max && status === 0 ? undefined : [1, '#ff1e00'],
              ].filter(v => v),
              width: 15,
            },
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
            formatter: `{a|${status < 0 ? '--' : value}}\n{b|${name}}`,
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

  handleSelectChange(activeType) {
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

  renderTodayMonitoringDataTrend() {
    const {
      gasStation: {
        distributionBoxTodayData=[],
      }={},
      value,
    } = this.props;
    const { activeKey } = this.state;
    const { params=[] } = value || {};
    const { unit, normalMax, max } = params
    .filter(({ name }) => name === activeKey || name.includes(activeKey) && name !== '漏电电流')
    .reduce((a, b) => a.normalMax < b.normalMax ? a : b, {});
    const { xAxis, series } = distributionBoxTodayData.reduce((result, { timeFlag, ia, ib, ic, id, ua, ub, uc, v1, v2, v3, v4, v5 }) => {
      const { xAxis, series } = result;
      xAxis.push(timeFlag);
      if (activeKey === '漏电电流') {
        if (series[0]) {
          series[0].data.push(+v1);
        } else {
          series[0] = {
            name: '漏电电流',
            type: 'line',
            data: [+v1],
            smooth: true,
          };
        }
      } else if (activeKey === '温度') {
        if (series[0]) {
          series[0].data.push(+v2);
        } else {
          series[0] = {
            name: 'A相温度',
            type: 'line',
            data: [+v2],
            smooth: true,
          };
        }
        if (series[1]) {
          series[1].data.push(+v3);
        } else {
          series[1] = {
            name: 'B相温度',
            type: 'line',
            data: [+v3],
            smooth: true,
          };
        }
        if (series[2]) {
          series[2].data.push(+v4);
        } else {
          series[2] = {
            name: 'C相温度',
            type: 'line',
            data: [+v4],
            smooth: true,
          };
        }
        if (series[3]) {
          series[3].data.push(+v5);
        } else {
          series[3] = {
            name: '零线温度',
            type: 'line',
            data: [+v5],
            smooth: true,
          };
        }
      } else if (activeKey === '电流') {
        if (series[0]) {
          series[0].data.push(+ia);
        } else {
          series[0] = {
            name: 'A相电流',
            type: 'line',
            data: [+ia],
            smooth: true,
          };
        }
        if (series[1]) {
          series[1].data.push(+ib);
        } else {
          series[1] = {
            name: 'B相电流',
            type: 'line',
            data: [+ib],
            smooth: true,
          };
        }
        if (series[2]) {
          series[2].data.push(+ic);
        } else {
          series[2] = {
            name: 'C相电流',
            type: 'line',
            data: [+ic],
            smooth: true,
          };
        }
      } else if (activeKey === '电压') {
        if (series[0]) {
          series[0].data.push(+ua);
        } else {
          series[0] = {
            name: 'A相电压',
            type: 'line',
            data: [+ua],
            smooth: true,
          };
        }
        if (series[1]) {
          series[1].data.push(+ub);
        } else {
          series[1] = {
            name: 'B相电压',
            type: 'line',
            data: [+ub],
            smooth: true,
          };
        }
        if (series[2]) {
          series[2].data.push(+uc);
        } else {
          series[2] = {
            name: 'C相电压',
            type: 'line',
            data: [+uc],
            smooth: true,
          };
        }

      }
      return result;
    }, { xAxis: [], series: [] });
    const option = {
      color: ['#f7e68a', '#00a181', '#ff4848', '#00a8ff'],
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(0,0,0,0.75)',
      },
      title: {
        text: normalMax !== max ? `报警阈值：≥${normalMax}${unit}` : '',
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
        top: 20,
        left: 10,
        right: 20,
        bottom: 30,
        containLabel: true,
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: xAxis,
        axisLine: {
          lineStyle: {
            color: '#1f477a',
          },
        },
        axisLabel: {
          color: '#fff',
        },
      },
      yAxis: {
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
        <ReactEcharts
          className={styles.lineChart}
          option={option}
        />
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
        <div className={styles.realTimeContainer}>
          {list.length > 0 ? list.map(param => (
            <div className={styles.realTimeWrapper} key={param.name}>
              <ReactEcharts
                className={styles.echarts}
                option={this.getGaugeOption(param)}
              />
            </div>
          )) : (
            <div style={{ textAlign: 'center' }}>暂无数据</div>
          )}
        </div>
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
      visible,
      onClose,
      // loading,
      value,
    } = this.props;
    const { name, location, params=[] } = value || {};

    return (
      <CustomDrawer
        title={
          <Fragment>
            <div className={styles.titleIcon} />
            <div className={styles.title}>
              <span className={styles.name}>{name || '--'}</span>
              <span>{location ? `(${location})` : ''}</span>
            </div>
          </Fragment>
        }
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
          <div className={styles.alarmParamsTitleWrapper}>
            <div className={styles.alarmParamsTitle}>报警参数</div>
            {params && params.map(({ name, status }) => status > 0 ? (
              <div className={styles.alarmParam} key={name}><span className={styles.alarmParamName}>{name}</span></div>
            ) : null)}
          </div>
          {this.renderTabs()}
          {this.renderRealTimeMonitoringData()}
          {this.renderTodayMonitoringDataTrend()}
        </div>
      </CustomDrawer>
    );
  }
}
