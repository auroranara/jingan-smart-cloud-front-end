import React, { Component } from 'react';
import { Col, Icon } from 'antd';
import { Pie } from 'components/Charts';
import styles from './UnitLookUp.less';

class UnitLookUp extends Component {
  render() {
    return (
      <section className={styles.sectionMain}>
        <div className={styles.sectionTop}>
          <Col span={24}>
            <div className={styles.circlrLookUp}>
              <span>查岗</span>
            </div>
            <div className={styles.lookUpTime}>
              <div className={styles.lastlookUpTime}>上次查岗时间</div>
              <div className={styles.DayTime}>
                <div className={styles.day}>2018-08-01</div>
                <div className={styles.time}>14:00</div>
              </div>
            </div>
          </Col>
        </div>

        <div className={styles.sectionBottom}>
          <Col span={24}>
            <div className={styles.jobRate}>
              <Col span={6}>
                <div className={styles.jobRateWrite}>在岗率</div>
              </Col>
              <Col span={6}>
                <Pie percent={90} total="90%" height={100} className={styles.pie} />
              </Col>
              <Col span={12}>
                <div className={styles.jobNum}>
                  <p>
                    <Icon type="user-delete" />
                    在岗{' '}
                  </p>
                  <p>
                    <Icon type="user-delete" />
                    脱岗{' '}
                  </p>
                </div>
              </Col>
            </div>
          </Col>

          <Col span={24}>
            <div className={styles.time}>
              <Col span={6}>
                <div className={styles.timeWrite}>应答时间</div>
              </Col>
              <Col span={6}>
                <div className={styles.timePic} />
              </Col>
              <Col span={12}>
                <div className={styles.timeNum}>
                  <p>
                    <Icon type="user-delete" />
                    最快{' '}
                  </p>
                  <p>
                    <Icon type="user-delete" />
                    最慢{' '}
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

export default UnitLookUp;
