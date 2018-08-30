import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';
import { Col, Button } from 'antd';
import styles from './LookingUp.less';
import Counter from 'components/flip-timer';

import btnBg from '../img/btnBg.png';
import circle from '../img/circle.png';
import bubble from '../img/bubble.png';
import leavelJobIcon from '../img/leavelJobIcon.png';
import onJobIcon from '../img/onJobIcon.png';
import rabbit from '../img/rabbit.png';
import snail from '../img/snail.png';
import time from '../img/time.png';

export default class LookingUp extends Component {
  state = {
    start: false,
  };
  getOption = () => {
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
              value: 90.0,
              itemStyle: {
                shadowColor: 'rgba(0, 0, 0, 0.8)',
                shadowBlur: 10,
              },
            },
            {
              value: 100.0 - 90.0,
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
    const { showed, handleRotateBack, startLookUp } = this.props;

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
                <Counter
                  onStop={() => {
                    handleRotateBack();
                  }}
                  stop={10 * 60 * 1000}
                  start={startLookUp}
                />
              </div>
            </div>
          </Col>
        </div>

        <div className={styles.bottom}>
          <Col span={24}>
            <div className={styles.jobRate}>
              <Col span={4}>
                <div className={styles.jobRateWrite}>在岗率</div>
              </Col>
              <Col span={8}>
                <ReactEcharts
                  style={{ width: '100%', height: '100px' }}
                  option={this.getOption()}
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
                    <span className={styles.personnum}>000</span>
                  </p>
                  <p className={styles.leaveJob}>
                    <span
                      className={styles.leavelJobIcon}
                      style={{ backgroundImage: `url(${leavelJobIcon})` }}
                    />
                    脱岗
                    <span className={styles.personnum}>000</span>
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
                <div className={styles.timeIcon} style={{ backgroundImage: `url(${time})` }} />
              </Col>
              <Col span={12}>
                <div className={styles.timeNum}>
                  <p className={styles.rabbit}>
                    <span
                      className={styles.rabbitIcon}
                      style={{ backgroundImage: `url(${rabbit})` }}
                    />
                    最快
                    <span className={styles.minutes}>2'30''</span>
                  </p>
                  <p className={styles.snail}>
                    <span
                      className={styles.snailIcon}
                      style={{ backgroundImage: `url(${snail})` }}
                    />
                    最慢
                    <span className={styles.minutes}>7'30''</span>
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
