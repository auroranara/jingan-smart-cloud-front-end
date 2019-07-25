import React, { PureComponent } from 'react';
import { Tooltip, Icon } from 'antd';

import Section from '../Section';
import SignalAnime from '../../Monitor/Components/SignalAnime';
import fireHost from '../imgs/fire-host.png';
import line from '../imgs/line.png';
import styles from './FireMonitoring.less';

export default class FireMonitoring extends PureComponent {
  handleShowResetSection = () => {
    // this.props.handleParentChange({ resetHostsDrawerVisible: true });
    this.props.handleShowResetSection();
  };

  render() {
    const {
      // 火警
      fire = 0,
      // 故障
      fault = 0,
      // 屏蔽
      shield = 0,
      // 联动
      linkage = 0,
      // 监管
      supervise = 0,
      // 反馈
      feedback = 0,
      handleShowAlarmFlows,
      handleShowFireMonitor,
      // handleShowFault,
      hosts,
    } = this.props;

    const extra = (
      <span
        className={styles.extra}
        onClick={() => {
          handleShowFireMonitor(1);
        }}
      >
        历史>>
      </span>
    );

    return (
      <Section title="虚拟消控主机" extra={extra} style={{ WebkitBackfaceVisibility: 'hidden' }}>
        <div className={styles.contaniner}>
          {hosts &&
            hosts.length > 0 && (
              <div className={styles.resetButton} onClick={this.handleShowResetSection}>
                <Tooltip
                  overlayClassName={styles.tooltip}
                  title="一键复位功能只对平台数据进行复位，并不能控制主机复位。"
                >
                  <Icon type="reload" style={{ marginRight: 8 }} />
                  一键复位
                </Tooltip>
              </div>
            )}

          <div className={styles.top}>
            <div
              className={styles.fireHostImg}
              style={{
                background: `url(${fireHost}) center center / auto 80% no-repeat`,
              }}
            >
              <div className={styles.anime}>
                <SignalAnime />
              </div>
            </div>
            <div className={styles.twoTotal}>
              <p
                className={styles.fireTitle}
                onClick={
                  fire
                    ? () => {
                        handleShowAlarmFlows(0);
                      }
                    : null
                }
              >
                <Tooltip
                  placement="bottomLeft"
                  overlayClassName={styles.tooltip}
                  title="有探测器等报警设备报警检测到火警信号。"
                >
                  <span className={styles.fireHover}> 火警</span>
                </Tooltip>
                <span className={styles.fireCount}>{fire || 0}</span>
              </p>

              <p
                className={styles.errorTitle}
                onClick={
                  fault
                    ? () => {
                        handleShowAlarmFlows(1);
                      }
                    : null
                }
              >
                <Tooltip
                  placement="bottomLeft"
                  overlayClassName={styles.tooltip}
                  title="表示控制器检测到外部探测器或模块有故障，提示用户立即对控制器进行修复。"
                >
                  <span className={styles.errorHover}>故障 </span>
                </Tooltip>
                <span className={styles.errorCount}>{fault || 0}</span>
              </p>
              <div className={styles.divider} style={{ left: '50%' }} />
            </div>
          </div>
          <div className={styles.bottom}>
            <div className={styles.linkage}>
              <Tooltip
                placement="bottomLeft"
                overlayClassName={styles.tooltip}
                title="当报警设备探知火灾信号后传递给主机，主机按照设定程序，依次联动灭火设施的过程称之为联动。"
              >
                <p className={styles.linkageCount}>{linkage || 0}</p>
                <p className={styles.linkageTitle}>联动</p>
              </Tooltip>
            </div>
            <div className={styles.regulation}>
              <Tooltip
                placement="bottomLeft"
                overlayClassName={styles.tooltip}
                title="当控制器检测到了外部设备信号，比如信号蝶阀，平时常开，一旦关闭后会产生一个信号提示，系统处于监管状态。"
              >
                <p className={styles.regulationCount}>{supervise || 0}</p>
                <p className={styles.regulationTitle}>监管</p>
              </Tooltip>
            </div>
            <div className={styles.shield}>
              <Tooltip
                placement="bottomLeft"
                overlayClassName={styles.tooltip}
                title="当探测器或模块发生故障后，短时间无法修复时，可将它屏蔽掉，待修理或更换后，再取消屏蔽将设备恢复。"
              >
                <p className={styles.shieldCount}>{shield || 0}</p>
                <p className={styles.shieldTitle}>屏蔽</p>
              </Tooltip>
            </div>
            <div className={styles.feedback}>
              <Tooltip
                placement="bottomLeft"
                overlayClassName={styles.tooltip}
                title="消防控制器接收到外接设备的反馈信息，也就是模块输入功能，比如水流指示器动作后，反馈信号给消控主机。"
              >
                <p className={styles.feedbackCount}>{feedback || 0}</p>
                <p className={styles.feedbackTitle}>反馈</p>
              </Tooltip>
            </div>
            <div className={styles.divider} style={{ left: '25%' }} />
            <div className={styles.divider} style={{ left: '50%' }} />
            <div className={styles.divider} style={{ left: '75%' }} />
          </div>
        </div>
      </Section>
    );
  }
}
