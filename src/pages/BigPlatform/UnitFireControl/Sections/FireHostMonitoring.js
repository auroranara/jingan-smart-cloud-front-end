import React, { PureComponent } from 'react';
import { Tooltip } from 'antd';
import Section from '../components/Section/Section.js';
import SignalAnime from '../../Monitor/Components/SignalAnime';
import logoFireHost from '../images/fire-host.png';
import dashedArrow from '../images/dashed-arrow.png';
import styles from './FireHostMonitoring.less';

export default class FireHostMonitoring extends PureComponent {
  render() {
    const {
      fixedContent,
      onClick,
      data: {
        fire_state = 0, // 火警
        fault_state = 0, // 故障
        start_state = 0, //  联动
        supervise_state = 0, // 监管
        shield_state = 0, // 屏蔽
        feedback_state = 0, // 反馈
      },
    } = this.props;
    return (
      <Section title="消防主机监测" fixedContent={fixedContent}>
        <div className={styles.fireHostMonitoring}>
          <div className={styles.logoContainer}>
            <div
              className={styles.hostLogo}
              style={{
                backgroundImage: `url(${logoFireHost})`,
                backgroundRepeat: 'no-repeat',
                groundPosition: 'center center',
                backgroundSize: '100% 100%',
              }}
            />
            <div className={styles.animate}>
              <SignalAnime />
            </div>
          </div>
          <div className={styles.mainContainer}>
            <div
              className={styles.innerContent}
              style={{
                backgroundImage: `url(${dashedArrow})`,
                backgroundRepeat: 'no-repeat',
                groundPosition: 'center center',
                backgroundSize: '100% 100%',
              }}
            >
              <div
                className={styles.middleItem}
                style={{ left: 'calc(20% - 15px)', top: '40%' }}
                onClick={() => onClick('火警')}
              >
                <span style={{ color: '#F64747' }}>{fire_state}</span>
                <div>
                  <Tooltip
                    placement="right"
                    overlayClassName={styles.tooltip}
                    title="有探测器等报警设备报警检测到火警信号。"
                  >
                    <span className={styles.fireState}>火警</span>
                  </Tooltip>
                </div>
              </div>
              <div
                className={styles.middleItem}
                style={{ left: 'calc(80% - 15px)', top: '40%' }}
                onClick={() => onClick('故障')}
              >
                <span style={{ color: '#01A8FF' }}>{fault_state}</span>
                <div>
                  <Tooltip
                    placement="right"
                    overlayClassName={styles.tooltip}
                    title="表示控制器检测到外部探测器或模块有故障，提示用户立即对控制器进行修复。"
                  >
                    <span className={styles.faultState}>故障</span>
                  </Tooltip>
                </div>
              </div>
              <div
                className={styles.bottomItem}
                style={{ left: 'calc(2% - 13px)', top: '100%' }}
                onClick={() => onClick('联动')}
              >
                <span style={{ color: '#00AAC5' }}>{start_state}</span>
                <div>
                  <Tooltip
                    placement="right"
                    overlayClassName={styles.tooltip}
                    title="当报警设备探知火灾信号后传递给主机，主机按照设定程序，依次联动灭火设施的过程称之为联动。"
                  >
                    <span className={styles.startState}>联动</span>
                  </Tooltip>
                </div>
              </div>
              <div
                className={styles.bottomItem}
                style={{ left: 'calc(34% - 13px)', top: '100%' }}
                onClick={() => onClick('监管')}
              >
                <span style={{ color: '#F6B547' }}>{supervise_state}</span>
                <div>
                  <Tooltip
                    placement="right"
                    overlayClassName={styles.tooltip}
                    title="当控制器检测到了外部设备信号，比如信号蝶阀，平时常开，一旦关闭后会产生一个信号提示，系统处于监管状态。"
                  >
                    <span className={styles.superviseState}>监管</span>
                  </Tooltip>
                </div>
              </div>
              <div
                className={styles.bottomItem}
                style={{ left: 'calc(66% - 13px)', top: '100%' }}
                onClick={() => onClick('屏蔽')}
              >
                <span style={{ color: '#837CE5' }}>{shield_state}</span>
                <div>
                  <Tooltip
                    placement="right"
                    overlayClassName={styles.tooltip}
                    title="当探测器或模块发生故障后，短时间无法修复时，可将它屏蔽掉，待修理或更换后，再取消屏蔽将设备恢复。"
                  >
                    <span className={styles.shieldState}>屏蔽</span>
                  </Tooltip>
                </div>
              </div>
              <div
                className={styles.bottomItem}
                style={{ left: 'calc(98% - 13px)', top: '100%' }}
                onClick={() => onClick('反馈')}
              >
                <span style={{ color: '#BCBCBB' }}>{feedback_state}</span>
                <div>
                  <Tooltip
                    placement="right"
                    overlayClassName={styles.tooltip}
                    title="消防控制器接收到外接设备的反馈信息，也就是模块输入功能，比如水流指示器动作后，反馈信号给消控主机。"
                  >
                    <span className={styles.feedbackState}>反馈</span>
                  </Tooltip>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>
    );
  }
}
