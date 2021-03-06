import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';
import { Col, Button } from 'antd';

import { fillZero, myParseInt } from '../utils';
import styles from './LookingUp.less';
import Counter from 'components/flip-timer';

import btnBg from '../img/btnBg.png';
import circle from '../img/circle.png';
import bubble from '../img/bubble.png';
import leavelJobIcon from '../img/leavelJobIcon.png';
import onJobIcon from '../img/onJobIcon.png';
import rabbit from '../img/rabbit.png';
import snail from '../img/snail.png';
import timeIcon from '../img/time.png';

function formatTime(t) {
  const time = t || '0,0';
  const [m, s] = time.split(',');
  return `${fillZero(m)}'${fillZero(s)}"`;
}

// const DELAY = 3000;
const COUNT_DOWN_MIN = 10;
const COUNT_DOWN = COUNT_DOWN_MIN * 60000;

export default class LookingUp extends Component {
  state = {
    start: false,
  };

  getOption = n => {
    const p = myParseInt(n);

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
              value: p,
              itemStyle: {
                shadowColor: 'rgba(0, 0, 0, 0.8)',
                shadowBlur: 10,
              },
            },
            {
              value: 100.0 - p,
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
    const { showed, startLookUp, createTime, data, handleCounterStop } = this.props;
    const { fast = '0,0', slow = '0,0', rate = 0, onGuardNum = 0, offGuardNum = 0 } = data;

    const countTime = createTime ? COUNT_DOWN - (Date.now() - createTime) : COUNT_DOWN;
    // console.log('countTime', countTime, createTime);

    return (
      <section className={styles.main} style={{ display: showed ? 'block' : 'none' }}>
        <div className={styles.top}>
          <Col span={8}>
            <div className={styles.left}>
              <Button
                className={styles.circlrLookUp}
                style={{ border: 'none', color: '#FFF', backgroundImage: `url(${btnBg})` }}
              >
                正在
                <br />
                查岗
              </Button>
              <div className={styles.ring} style={{ backgroundImage: `url(${circle})` }} />
              <div className={styles.bubble} style={{ backgroundImage: `url(${bubble})` }} />
            </div>
          </Col>
          <Col span={16} style={{ height: '100%' }}>
            <div className={styles.right}>
              <div className={styles.countDown}>倒计时</div>
              <div className={styles.flask} style={{ fontSize: '12px' }}>
                <Counter onStop={handleCounterStop} stop={countTime} start={startLookUp} />
              </div>
            </div>
          </Col>
        </div>

        <div className={styles.bottom}>
          <Col span={24}>
            <div className={styles.jobRate}>
              <Col span={4}>
                <div className={styles.jobRateWrite} style={{ width: '100px' }}>
                  在岗率
                </div>
              </Col>
              <Col span={8}>
                <ReactEcharts
                  style={{ width: '100%', height: '100px' }}
                  option={this.getOption(rate)}
                  notMerge={true}
                  lazyUpdate={true}
                />
              </Col>
              <Col span={12}>
                <div className={styles.jobNum}>
                  <p className={styles.onJob}>
                    <span
                      className={styles.onJobIcon}
                      style={{ backgroundImage: `url(${onJobIcon})` }}
                    />
                    在岗
                    <span className={styles.personnum}>{fillZero(onGuardNum, 3)}</span>
                  </p>
                  <p className={styles.leaveJob}>
                    <span
                      className={styles.leavelJobIcon}
                      style={{ backgroundImage: `url(${leavelJobIcon})` }}
                    />
                    脱岗
                    <span className={styles.personnum}>{fillZero(offGuardNum, 3)}</span>
                  </p>
                </div>
              </Col>
            </div>
          </Col>

          <Col span={24}>
            <div className={styles.responsetime}>
              <Col span={6}>
                <div className={styles.timeWrite}>应答时间</div>
              </Col>
              <Col span={6}>
                <div className={styles.timeIcon} style={{ backgroundImage: `url(${timeIcon})` }} />
              </Col>
              <Col span={12}>
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
            </div>
          </Col>
        </div>
      </section>
    );
  }
}
