import React, { Component, Fragment } from 'react';
import CustomDrawer from '@/jingan-components/CustomDrawer';
import ReactEcharts from "echarts-for-react";
import { connect } from 'dva';
import moment from 'moment';
import videoCameraIcon from '@/assets/videoCamera.png';
import alarmIcon from '@/assets/icon-alarm2.png';
import lossIcon from '@/assets/icon-loss.png';
import noTrend from '@/pages/BigPlatform/Gas/imgs/no-monitor.png';
import styles from './index.less';

// 温湿度监测点详情抽屉
@connect(({ unitSafety, loading }) => ({
  unitSafety,
  loading: loading.effects['unitSafety/fetchHumiturePointDetail'],
}))
export default class HumiturePointDetailDrawer extends Component {
  componentDidUpdate({ visible: prevVisible }) {
    const { visible } = this.props;
    if (!prevVisible && visible) {
      this.getHumiturePointDetail();
    } else if (prevVisible && !visible) {
      clearTimeout(this.myTimer);
    }
  }

  getHumiturePointDetail = () => {
    const { dispatch, value } = this.props;
    dispatch({
      type: 'unitSafety/fetchHumiturePointDetail',
      payload: {
        deviceId: value,
      },
      callback: ({ tDeviceId, tCode, hDeviceId, hCode }) => {
        this.getHumiturePointTrend({ temperatureId: tDeviceId, temperatureCode: tCode, humidityId: hDeviceId, humidityCode: hCode });
        this.setTimer();
      },
    });
    this.scroll && this.scroll.scrollTop();
  }

  getHumiturePointTrend = (payload) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'unitSafety/fetchHumiturePointTrend',
      payload: {
        ...payload,
        queryDate: moment().startOf('day').format('YYYY/MM/DD HH:mm:ss'),
        historyDataType: 1,
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
            formatter: `{a|${status < 0 || isNaN(value) ? '--' : value.toFixed(2)}}\n{b|${name}}`,
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

  getLineOption = (name, list) => {
    return {
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
        name,
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
      series: {
        name,
        type: 'line',
        data: list,
        smooth: true,
      },
    };
  }

  setScrollReference = scroll => {
    this.scroll = scroll && scroll.dom;
  }

  setTimer = () => {
    this.myTimer = setTimeout(() => {
      const {
        unitSafety: {
          humiturePointDetail: {
            tDeviceId,
            tCode,
            hDeviceId,
            hCode,
          },
        },
      } = this.props;
      this.getHumiturePointTrend({ temperatureId: tDeviceId, temperatureCode: tCode, humidityId: hDeviceId, humidityCode: hCode });
      this.setTimer();
    }, 5 * 60 * 1000);
  }

  handleVideoClick = () => {
    const {
      unitSafety: {
        humiturePointDetail: {
          cameraMessage,
        },
      },
      onVideoClick,
    } = this.props;
    const [{ key_id }] = cameraMessage;
    onVideoClick && onVideoClick(key_id, cameraMessage);
  }

  /* 实时监测数据 */
  renderRealTimeMonitoringData() {
    const {
      unitSafety: {
        humiturePointDetail: {
          tDeviceId,
          temperature,
          tMin,
          tMax,
          tLower,
          tUpper,
          tstatus,
          hDeviceId,
          humidity,
          hMin,
          hMax,
          hLower,
          hUpper,
          hstatus,
        },
      },
    } = this.props;
    const params = [
      tDeviceId && { name: '温度', value: Number.parseFloat(temperature), unit: '℃', min: tMin !== null ? tMin : -60, max: tMax !== null ? tMax : 140, normalMin: Number.parseFloat(tLower), normalMax: Number.parseFloat(tUpper), status: tstatus },
      hDeviceId && { name: '湿度', value: Number.parseFloat(humidity), unit: '%', min: hMin !== null ? hMin : 0, max: hMax !== null ? hMax : 100 , normalMin: Number.parseFloat(hLower), normalMax: Number.parseFloat(hUpper), status: hstatus },
    ].filter(v => v);

    return (
      <Fragment>
        <div className={styles.subTitle}><span>>></span>实时监测数据</div>
        <div className={styles.realTimeContainer}>
          {params && params.map(param => (
            <div className={styles.realTimeWrapper} key={param.name}>
              <ReactEcharts
                className={styles.echarts}
                option={this.getGaugeOption(param)}
              />
            </div>
          ))}
        </div>
      </Fragment>
    );
  }

  /* 当天监测数据趋势 */
  renderTodayMonitoringDataTrend() {
    const {
      unitSafety: {
        humiturePointTrend: {
          temperature=[],
          humidity=[],
        },
      },
    } = this.props;
    const list1 = (temperature || []).map(({ timeFlag, value }) => ({ name: timeFlag, value: [+moment(timeFlag, 'HH:mm'), parseFloat(value)] }));
    const list2 = (humidity || []).map(({ timeFlag, value }) => ({ name: timeFlag, value: [+moment(timeFlag, 'HH:mm'), parseFloat(value)] }));
    const option1 = this.getLineOption('温度', list1);
    const option2 = this.getLineOption('湿度', list2);

    return (
      <Fragment>
        <div className={styles.subTitle}><span>>></span>当天监测数据趋势</div>
        {list1.length > 0 || list2.length > 0 ? (
          <Fragment>
            {list1.length > 0 && (
              <ReactEcharts
                className={styles.lineChart}
                option={option1}
              />
            )}
            {list2.length > 0 && (
              <ReactEcharts
                className={styles.lineChart}
                option={option2}
              />
            )}
          </Fragment>
        ) : (
          <div className={styles.emptyTrend} style={{ backgroundImage: `url(${noTrend})` }} />
        )}
      </Fragment>
    );
  }

  renderStatus = () => {
    const {
      unitSafety: {
        humiturePointDetail: {
          status,
        },
      },
    } = this.props;
    if (+status === 2) {
      return <span className={styles.alarmIcon} style={{ backgroundImage: `url(${alarmIcon})` }}>报警</span>
    } else if (+status === -1) {
      return <span className={styles.lossIcon} style={{ backgroundImage: `url(${lossIcon})` }}>失联</span>
    }
  }

  render() {
    const {
      unitSafety: {
        humiturePointDetail: {
          deviceName,
          cameraMessage,
          area,
          location,
        },
      },
      visible,
      onClose,
      loading,
    } = this.props;

    return (
      <CustomDrawer
        title="监测点详情"
        visible={visible}
        onClose={onClose}
        sectionProps={{
          scrollProps: {
            ref: this.setScrollReference,
          },
          spinProps: {
            loading: !!loading,
          },
        }}
      >
        <div className={styles.container}>
          <div className={styles.info}>
            <div className={styles.name}>
              {deviceName}
              {/* {this.renderStatus()} */}
              {Array.isArray(cameraMessage) && cameraMessage.length > 0 && <div className={styles.video} style={{ backgroundImage: `url(${videoCameraIcon})` }} onClick={this.handleVideoClick} />}
            </div>
            <div className={styles.field}>
              <div className={styles.fieldLabel}>所在区域：</div>
              <div className={styles.fieldValue}>{area}</div>
            </div>
            <div className={styles.field}>
              <div className={styles.fieldLabel}>所在位置：</div>
              <div className={styles.fieldValue}>{location}</div>
            </div>
          </div>
          <div className={styles.splitLine} />
          {this.renderRealTimeMonitoringData()}
          {this.renderTodayMonitoringDataTrend()}
        </div>
      </CustomDrawer>
    );
  }
}
