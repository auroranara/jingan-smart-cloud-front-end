import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';
import { Col, Button } from 'antd';
import TimeIcon from './images/time.png';
import OnJobIcon from './images/onJobIcon.png';
import LeavelJobIcon from './images/leavelJobIcon.png';
import RabbitIcon from './images/rabbit.png';
import SnailIcon from './images/snail.png';
import BtnBg from './images/btn_bg.png';
import Circle from './images/circle.png';
import bubble from './images/bubble.png';
import styles from './LookingUp.less';
import Counter from 'components/flip-timer';

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
    const { showed, isLookUpRotated, handleRotateBack } = this.props;

    return (
      <section className={styles.main} style={{ display: showed ? 'block' : 'none' }}>
        <div className={styles.top}>
          <Col span={8}>
            <div className={styles.left}>
              <Button
                className={styles.circlrLookUp}
                style={{ border: 'none', color: '#FFF', background: `url(${BtnBg})` }}
              >
                正在
                <br />
                查岗
              </Button>
              <div
                style={{ background: `url(${Circle})` }}
                className={styles.ring}
                onTransitionEnd
              />
              <div
                style={{ background: `url(${bubble})`, backgroundSize: 'cover' }}
                className={styles.bubble}
                onTransitionEnd
              />
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
                  stop={10 * 1000}
                  start={isLookUpRotated}
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
                      style={{ background: `url(${OnJobIcon})` }}
                    />
                    在岗
                    <span className={styles.personnum}>000</span>
                  </p>
                  <p className={styles.leaveJob}>
                    <span
                      className={styles.leavelJobIcon}
                      style={{ background: `url(${LeavelJobIcon})` }}
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
                <div className={styles.timeIcon} style={{ background: `url(${TimeIcon})` }} />
              </Col>
              <Col span={12}>
                <div className={styles.timeNum}>
                  <p className={styles.rabbit}>
                    <span
                      className={styles.rabbitIcon}
                      style={{ background: `url(${RabbitIcon})` }}
                    />
                    最快
                    <span className={styles.minutes}>2'30''</span>
                  </p>
                  <p className={styles.snail}>
                    <span
                      className={styles.snailIcon}
                      style={{ background: `url(${SnailIcon})` }}
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
