import React, { PureComponent } from 'react';
import { Carousel, Tooltip } from 'antd';
import { connect } from 'dva';
import Section from '../Section';
// 消防主机
import fireEngineIcon from '../../imgs/dynamic-monitor/fire_engine.png';
// 电气火灾
import electricalFireIcon from '../../imgs/dynamic-monitor/electrical_fire.png';
// 独立烟感
import smokeAlarmIcon from '../../imgs/dynamic-monitor/smoke_alarm.png';
// 储罐
import storageTankIcon from '../../imgs/dynamic-monitor/storage_tank.png';
// 有毒气体
import toxicGasIcon from '../../imgs/dynamic-monitor/toxic_gas.png';
// 废水
import effluentIcon from '../../imgs/dynamic-monitor/effluent.png';
// 废气
import exhaustGasIcon from '../../imgs/dynamic-monitor/exhaust_gas.png';
// 视频监控
import videoMonitorIcon from '../../imgs/dynamic-monitor/video_monitor.png';
// 引入样式文件
import styles from './index.less';

// 获取转换之后的数据
const getValue = data => {
  // return data ? (
  // data.warningNum > 0 ? (
  return data && <span className={styles.warning}>{data.warningNum}</span>;
  //   ) : (
  //     `0`
  //   )
  // ) : (
  //   '--'
  // );
};

/**
 * 动态监测
 */
@connect(({ unitSafety }) => ({
  unitSafety,
}))
export default class DynamicMonitor extends PureComponent {
  carouselTimer = null;

  componentDidMount() {
    this.setCarouselTimer();
  }

  componentWillUnmount() {
    clearTimeout(this.carouselTimer);
  }

  refCarousel = carousel => {
    this.carousel = carousel;
  };

  setCarouselTimer = () => {
    this.carouselTimer = setTimeout(() => {
      this.carousel && this.carousel.next();
      this.setCarouselTimer();
    }, 10 * 1000);
  };

  renderTooltip = (showAlarm, showTotal = true) => {
    return (
      <div>
        {!!showAlarm && (
          <div>
            <div className={styles.circle} style={{ backgroundColor: '#ff4848' }} />
            报警设备
          </div>
        )}
        {!!showTotal && (
          <div>
            <div className={styles.circle} style={{ backgroundColor: '#00ffff' }} />
            设备总数
          </div>
        )}
      </div>
    );
  };

  render() {
    const {
      // 点击驾驶舱按钮
      onClick,
      // 点击项
      onShow,
      // 源数据
      unitSafety: {
        dynamicMonitorData: {
          fireEngine,
          electricalFire,
          smokeAlarm,
          storageTank,
          toxicGas,
          effluent,
          exhaustGas,
          videoMonitor,
        }={},
      },
      handleClickVideo,
      // handleClickGas,
    } = this.props;

    const list = [
      {
        key: '消防主机',
        value: getValue(fireEngine),
        icon: fireEngineIcon,
        originalValue: fireEngine,
        onClick: () => {
          onShow('7');
        },
      },
      {
        key: '电气火灾',
        value: getValue(electricalFire),
        icon: electricalFireIcon,
        originalValue: electricalFire,
        onClick: () => {
          onShow('1');
        },
      },
      {
        key: '独立烟感',
        value: getValue(smokeAlarm),
        icon: smokeAlarmIcon,
        originalValue: smokeAlarm,
        onClick: () => {
          onShow('6');
        },
      },
      {
        key: '储罐',
        value: getValue(storageTank),
        icon: storageTankIcon,
        originalValue: storageTank,
        onClick: () => {
          onShow('5');
        },
      },
      {
        key: '可燃有毒气体',
        value: getValue(toxicGas),
        icon: toxicGasIcon,
        originalValue: toxicGas,
        onClick: () => {
          // handleClickGas();
          onShow('2');
        },
      },
      {
        key: '废水',
        value: getValue(effluent),
        icon: effluentIcon,
        originalValue: effluent,
        onClick: () => {
          onShow('3');
        },
      },
      {
        key: '废气',
        value: getValue(exhaustGas),
        icon: exhaustGasIcon,
        originalValue: exhaustGas,
        onClick: () => {
          onShow('4');
        },
      },
      {
        key: '视频监控设备',
        value: videoMonitor ? videoMonitor.totalNum : '--',
        icon: videoMonitorIcon,
        originalValue: videoMonitor,
        onClick: () => {
          handleClickVideo();
        },
      },
    ].filter(({ originalValue: { totalNum } = {} }) => totalNum);
    const newList = [];
    for (let index = 0; index < list.length / 4; index++) {
      let item = list.slice(4 * index, 4 * (index + 1));
      newList.push(item);
    }
    return (
      <Section
        title="动态监测"
        action={
          <span className={styles.jumpButton} onClick={onClick}>
            驾驶舱
            <span className={styles.jumpButtonIcon} />
          </span>
        }
      >
        <div className={styles.container}>
          <Carousel className={styles.carousel} ref={this.refCarousel}>
            {newList.map((lists, index) => {
              return (
                <div className={styles.listWrapper} key={index}>
                  <div
                    className={styles.list}
                  >
                    {lists.map(
                      ({ key, value, icon, onClick, originalValue: { totalNum, warningNum } }, i) => {
                        return (
                            <div
                              className={styles.item}
                              style={{
                                backgroundImage: `url(${icon})`,
                                cursor: onClick ? 'pointer' : 'default',
                              }}
                              key={key}
                              onClick={onClick || undefined}
                            >
                              <div className={styles.itemLabel}>{key}</div>

                              <div className={styles.itemValue}>
                                <Tooltip
                                  placement="right"
                                  title={this.renderTooltip(
                                    warningNum !== undefined,
                                    key !== '消防主机'
                                  )}
                                >
                                  {value}
                                  {warningNum !== undefined && key !== '消防主机' && `/${totalNum}`}
                                </Tooltip>
                              </div>
                            </div>
                        );
                      }
                    )}
                  </div>
                </div>
              );
            })}
          </Carousel>
        </div>
      </Section>
    );
  }
}
