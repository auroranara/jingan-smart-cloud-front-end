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
import FcSection from './FcSection';
import styles from './UnitLookUp.less';

export default class UnitLookUp extends Component {
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
              value: 90,
              itemStyle: {
                shadowColor: 'rgba(0, 0, 0, 0.8)',
                shadowBlur: 10,
              },
            },
            {
              value: 100 - 90,
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
    return (
      <FcSection title="单位查岗">
        <section className={styles.sectionMain}>
          <div className={styles.sectionTop}>
            <Col span={24}>
              <div className={styles.circle} style={{ background: `url(${Circle})` }}>
                <Button
                  className={styles.circlrLookUp}
                  style={{ border: 'none', color: '#FFF', background: `url(${BtnBg})` }}
                >
                  查岗
                </Button>
              </div>
              <div className={styles.lookUpTime}>
                <div className={styles.lastlookUpTime}>上次查岗时间</div>
                <div className={styles.DayTime}>
                  <div className={styles.day}>2018-08-01</div>
                  <div className={styles.time}>14:00</div>
                </div>
              </div>
              {/* <div className={styles.btnLookingUp} style={{ background: `url(${BtnBg})` }}>
                <span>正在查岗</span>
              </div>
              <div className={styles.countDown}>

              </div> */}
            </Col>
          </div>

          <div className={styles.sectionBottom}>
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
      </FcSection>
    );
  }
}
