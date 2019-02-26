import React, { PureComponent } from 'react';
import { Carousel } from 'antd';
import debounce from 'lodash/debounce';
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
const getValue = (data) => {
  return data ? (data.warningNum > 0 ? <span><span className={styles.warning}>{data.warningNum}</span>/{data.totalNum}</span> : `0/${data.totalNum}`) : '--';
};

/**
 * 动态监测
 */
export default class DynamicMonitor extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      zoom: 1,
    };
    this.debouncedResize = debounce(this.resize, 300);
    this.carouselTimer = null;
  }


  componentDidMount() {
    this.setCarouselTimer();
    window.addEventListener('resize', this.debouncedResize);
    this.resize();
  }

  componentWillUnmount() {
    clearTimeout(this.carouselTimer);
    window.removeEventListener('resize', this.debouncedResize);
  }

  refCarousel = (carousel) => {
    this.carousel = carousel;
  }

  setCarouselTimer = () => {
    this.carouselTimer = setTimeout(() => {
      this.carousel && this.carousel.next();
      this.setCarouselTimer();
    }, 10 * 1000);
  }

  resize = () => {
    this.setState({ zoom: window.innerWidth / 1920 });
  }

  render() {
    const {
      // 点击驾驶舱按钮
      onClick,
      // 源数据
      data: {
        fireEngine,
        electricalFire,
        smokeAlarm,
        storageTank,
        toxicGas,
        effluent,
        exhaustGas,
        videoMonitor,
      }={},
    } = this.props;
    const { zoom } = this.state;

    const list = [
      [
        {
          key: '消防主机报警',
          value: fireEngine ? (fireEngine.warningNum > 0 ? <span className={styles.warning}>{fireEngine.warningNum}</span> : 0) : '--',
          icon: fireEngineIcon,
        },
        {
          key: '电气火灾报警',
          value: getValue(electricalFire),
          icon: electricalFireIcon,
        },
        {
          key: '独立烟感报警',
          value: getValue(smokeAlarm),
          icon: smokeAlarmIcon,
        },
        {
          key: '储罐监测报警',
          value: getValue(storageTank),
          icon: storageTankIcon,
        },
      ],
      [
        {
          key: '可燃有毒气体报警',
          value: getValue(toxicGas),
          icon: toxicGasIcon,
        },
        {
          key: '废水监测报警',
          value: getValue(effluent),
          icon: effluentIcon,
        },
        {
          key: '废气监测报警',
          value: getValue(exhaustGas),
          icon: exhaustGasIcon,
        },
        {
          key: '视频监控报警',
          value: videoMonitor ? videoMonitor.totalNum : '--',
          icon: videoMonitorIcon,
        },
      ],
    ];

    return (
      <Section
        title="动态监测"
        action={<span className={styles.jumpButton} onClick={onClick}>驾驶舱<span className={styles.jumpButtonIcon} /></span>}
      >
        <div className={styles.container}>
          <Carousel className={styles.carousel} ref={this.refCarousel}>
            {list.map((list2, index) => {
              return (
                <div key={index} className={styles.listWrapper}>
                  <div className={styles.list} style={{ zoom }}>
                    {list2.map(({ key, value, icon }) => {
                      return (
                        <div className={styles.item} style={{ backgroundImage: `url(${icon})` }} key={key}>
                          <div className={styles.itemLabel}>{key}</div>
                          <div className={styles.itemValue}>{value}</div>
                        </div>
                      );
                    })}
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
