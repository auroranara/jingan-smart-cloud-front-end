import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';
import { Col, Button } from 'antd';
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
    const { handleRotateMethods } = this.props;
    const { handleClickLookUp, handleClickOffGuard } = handleRotateMethods;

    return (
      <FcSection title="单位查岗" >
        <section className={styles.main}>
          <div className={styles.top}>
            <Col span={8}>
              <div className={styles.left}>
                <div className={styles.ring} />
                <Button
                  className={styles.circlrLookUp}
                  onClick={handleClickLookUp}
                  style={{
                    border: 'none',
                    color: '#FFF',
                    outline: 'none',
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
                  <div className={styles.day}>2018-08-01</div>
                  <div className={styles.time}>14:00</div>
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
                      <span className={styles.onJobIcon} />
                      在岗
                      <span className={styles.personnum}>000</span>
                    </p>
                    <p className={styles.leaveJob} onClick={handleClickOffGuard}>
                      <span className={styles.leavelJobIcon} />
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
                  <div className={styles.timeIcon} />
                </Col>
                <Col span={12}>
                  <div className={styles.timeNum}>
                    <p className={styles.rabbit}>
                      <span className={styles.rabbitIcon} />
                      最快
                      <span className={styles.minutes}>2'30''</span>
                    </p>
                    <p className={styles.snail}>
                      <span className={styles.snailIcon} />
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
