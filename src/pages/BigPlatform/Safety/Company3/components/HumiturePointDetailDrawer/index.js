import React, { Component, Fragment } from 'react';
import CustomDrawer from '@/jingan-components/CustomDrawer';
import ReactEcharts from "echarts-for-react";
import { connect } from 'dva';
import moment from 'moment';
import videoCameraIcon from '@/assets/videoCamera.png';
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
      // this.getHumiturePointDetail();
    }
  }

  getHumiturePointDetail = () => {
    const { dispatch, value } = this.props;
    dispatch({
      type: 'unitSafety/fetchHumiturePointDetail',
      payload: {
        id: value,
      },
    });
    this.scroll && this.scroll.scrollTop();
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

  handleVideoClick = () => {
    const {
      unitSafety: {
        humiturePointDetail: {
          videoList,
        },
      },
      onVideoClick,
    } = this.props;
    const [{ keyId }] = videoList;
    onVideoClick && onVideoClick(keyId, videoList);
  }

  /* 实时监测数据 */
  renderRealTimeMonitoringData() {
    const {
      unitSafety: {
        humiturePointDetail: {
          params=[],
        },
      },
    } = this.props;

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
        humiturePointDetail: {
          temperatureTrend=[],
          humidityTrend=[],
        },
      },
    } = this.props;
    const list1 = temperatureTrend.map(({ timeFlag, value }) => ({ name: timeFlag, value: [+moment(timeFlag, 'HH:mm'), parseFloat(value)] }));
    const list2 = humidityTrend.map(({ timeFlag, value }) => ({ name: timeFlag, value: [+moment(timeFlag, 'HH:mm'), parseFloat(value)] }));
    const option1 = this.getLineOption('温度', list1);
    const option2 = this.getLineOption('湿度', list2);

    return (
      <Fragment>
        <div className={styles.subTitle}><span>>></span>当天监测数据趋势</div>
        {(temperatureTrend && temperatureTrend.length > 0) || (humidityTrend && humidityTrend.length > 0) ? (
          <Fragment>
            <ReactEcharts
              className={styles.lineChart}
              option={option1}
            />
            <ReactEcharts
              className={styles.lineChart}
              option={option2}
            />
          </Fragment>
        ) : (
          <div className={styles.emptyTrend} style={{ backgroundImage: `url(${noTrend})` }} />
        )}
      </Fragment>
    );
  }

  render() {
    const {
      // unitSafety: {
      //   humiturePointDetail: {
      //    name,
      //    videoList,
      //    area,
      //    location,
      //   },
      // },
      visible,
      onClose,
      loading,
    } = this.props;

    const name = "name";
    const videoList = [];
    const area = "area";
    const location = "location";

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
              {name}
              {Array.isArray(videoList) && videoList.length > 0 && <div className={styles.video} style={{ backgroundImage: `url(${videoCameraIcon})` }} onClick={this.handleVideoClick} />}
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
