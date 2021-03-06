import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';
import { Button, Col, Row } from 'antd';

import { fillZero } from '../utils';
import FcSection from './FcSection';
import styles from './UnitLookUp.less';

import btnBg from '../img/btnBg.png';
import hilightBtn from '../img/btnHover.png';
import circle from '../img/circle.png';
import leavelJobIcon from '../img/leavelJobIcon.png';
import onJobIcon from '../img/onJobIcon.png';
import rabbit from '../img/rabbit.png';
import snail from '../img/snail.png';
import timeIcon from '../img/time.png';
// import cameraIcon from '../img/videoCamera.png';
import cameraIcon from '../img/camera_new.png';
import dotIcon from '../img/smallDot.png';

const ROW_STYLE = { borderTop: '2px solid rgb(1, 152, 180)', height: '50%', overflow: 'hidden' };
const COL_STYLE = { paddingTop: 15 };

function formatTime(t) {
  const time = t || '0,0';
  const [m, s] = time.split(',');
  return `${fillZero(m)}'${fillZero(s)}"`;
}

// const dot = <span className={styles.dot} style={{ backgroundImage: `url(${dotIcon})` }} />;

export default class UnitLookUp extends Component {
  state = { hover: false };

  handleHover = () => {
    this.setState(({ hover }) => ({ hover: !hover }));
  };

  getOption = r => {
    const rate = Number.parseInt(r, 10);

    const option = {
      color: ['#00a8ff', '#032c64'],
      tooltip: {
        show: false,
      },
      series: [
        {
          name: '',
          type: 'pie',
          radius: ['65%', '75%'],
          center: ['45%', '45%'],
          avoidLabelOverlap: false,
          hoverAnimation: false,
          label: {
            normal: {
              show: true,
              position: 'center',
              textStyle: {
                fontSize: '20',
                color: '#fff',
              },
              formatter: '{d}%',
            },
          },
          labelLine: {
            normal: {
              show: false,
            },
          },
          data: [
            {
              value: rate,
              itemStyle: {
                shadowColor: 'rgba(0, 0, 0, 0.8)',
                shadowBlur: 10,
              },
            },
            {
              value: 100.0 - rate,
              itemStyle: { opacity: 0.6 },
              label: { show: false },
            },
          ],
        },
      ],
    };
    return option;
  };

  render() {
    const { data, handleClickLookUp, handleClickOffGuard, handleClickVideoLookUp } = this.props;
    const { hover } = this.state;
    const {
      lastTime = '暂无信息',
      fast = '0,0',
      slow = '0,0',
      rate = 0,
      onGuardNum = 0,
      offGuardNum = 0,
    } = data;
    const [day, time] = lastTime.split(' ');

    return (
      // <FcSection title="单位查岗" id="unitLookUp" style={{ position: 'relative' }}>
      <FcSection title="单位查岗" style={{ position: 'relative' }}>
        <section className={styles.main}>
          <div className={styles.top}>
            <Col span={8}>
              <div className={styles.left}>
                <div className={styles.ring} style={{ backgroundImage: `url(${circle})` }} />
                <Button
                  className={styles.circlrLookUp}
                  onClick={e => handleClickLookUp()}
                  onMouseEnter={this.handleHover}
                  onMouseLeave={this.handleHover}
                  style={{
                    border: 'none',
                    color: '#FFF',
                    outline: 'none',
                    backgroundImage: `url(${hover ? hilightBtn : btnBg})`,
                  }}
                >
                  查岗
                </Button>
              </div>
            </Col>
            <Col span={16}>
              <div className={styles.right}>
                <div className={styles.lastlookUpTime}>上次查岗时间</div>
                <div className={styles.DayTime}>
                  <div className={styles.day}>{day}</div>
                  <div className={styles.time}>{time}</div>
                </div>
              </div>
            </Col>
          </div>

          <div className={styles.bottom}>
            <Row style={ROW_STYLE}>
              {/* <div className={styles.jobRate}> */}
                <Col span={6}>
                  <div className={styles.jobRateWrite}>
                    <span className={styles.dot} style={{ backgroundImage: `url(${dotIcon})` }} />
                    在岗率
                  </div>
                </Col>
                <Col span={6} className={styles.colTop}>
                  <ReactEcharts
                    style={{ width: '100%', height: '100px' }}
                    className={styles.echarts}
                    option={this.getOption(rate)}
                    notMerge={true}
                    lazyUpdate={true}
                  />
                </Col>
                <Col span={12} className={styles.colTop}>
                  <div className={styles.jobNum}>
                    <p className={styles.onJob}>
                      <span
                        className={styles.onJobIcon}
                        style={{ backgroundImage: `url(${onJobIcon})` }}
                      />
                      在岗
                      <span className={styles.personnum}>{fillZero(onGuardNum, 3)}</span>
                    </p>
                    <p className={styles.leaveJob} onClick={handleClickOffGuard}>
                      <span
                        className={styles.leavelJobIcon}
                        style={{ backgroundImage: `url(${leavelJobIcon})` }}
                      />
                      脱岗
                      <span className={styles.personnum}>{fillZero(offGuardNum, 3)}</span>
                    </p>
                  </div>
                </Col>
              {/* </div> */}
            </Row>

            <Row style={ROW_STYLE}>
              {/* <div className={styles.responsetime}> */}
                <Col span={6}>
                  <div className={styles.timeWrite}>
                    <span className={styles.dot} style={{ backgroundImage: `url(${dotIcon})` }} />
                    应答时间
                  </div>
                </Col>
                <Col span={6} style={COL_STYLE}>
                  <div
                    className={styles.timeIcon}
                    style={{ backgroundImage: `url(${timeIcon})` }}
                  />
                </Col>
                <Col span={12} className={styles.colTop}>
                  <div className={styles.timeNum}>
                    <p className={styles.rabbit}>
                      <span
                        className={styles.rabbitIcon}
                        style={{ backgroundImage: `url(${rabbit})` }}
                      />
                      最快
                      <span className={styles.minutes}>{formatTime(fast)}</span>
                    </p>
                    <p className={styles.snail}>
                      <span
                        className={styles.snailIcon}
                        style={{ backgroundImage: `url(${snail})` }}
                      />
                      最慢
                      <span className={styles.minutes}>{formatTime(slow)}</span>
                    </p>
                  </div>
                </Col>
              {/* </div> */}
            </Row>
          </div>
        </section>
        <div className={styles.video} onClick={handleClickVideoLookUp}>
          <span className={styles.camera} style={{ backgroundImage: `url(${cameraIcon})` }} />
          视频查岗
        </div>
        <div className={styles.note} style={{ display: hover ? 'block' : 'none' }}>
          查岗后，管辖单位消控室中【用户传输装置】将接收语音查岗指令，10分钟内应答则为【在岗】，否则为【脱岗】。
        </div>
      </FcSection>
    );
  }
}
