import React, { Component } from 'react';
import { Row, Timeline, Col } from 'antd';
import FcSection from './FcSection';
import styles from './AlarmHandle.less';

import arrowLeft from '../img/arrowLeft.png';
import arrowRight from '../img/arrowRight.png';
import imgBg from '../img/imgBg.png';
export default class AlarmHandle extends Component {
  state = {
    // 用于控制节点为正序排列
    reverse: false,
  };

  render() {
    const { isBack } = this.props;

    return (
      <FcSection title="警情处理" isBack={isBack}>
        <section>
          <Row>
            <div className={styles.top}>
              <Timeline
                pending=""
                reverse={this.state.reverse}
                style={{ marginLeft: 65, marginTop: 10 }}
              >
                <Timeline.Item style={{ paddingBottom: 22 }}>
                  <span className={styles.time} style={{ color: '#fff' }}>
                    10:00:00
                  </span>
                  <div>
                    <span className={styles.status} style={{ color: '#fff' }}>
                      报警
                    </span>
                  </div>
                  <div>
                    <p className={styles.content} style={{ color: '#fff' }}>
                      上报该火警为真实火警
                    </p>
                  </div>
                </Timeline.Item>
                <Timeline.Item style={{ paddingBottom: 10 }}>
                  <span className={styles.time} style={{ color: '#fff' }}>
                    10:00:00
                  </span>
                  <div>
                    <span className={styles.status} style={{ color: '#fff' }}>
                      上报
                    </span>
                  </div>
                  <div>
                    <p className={styles.content} style={{ color: '#fff' }}>
                      上报该火警为真实火警
                    </p>
                    <p className={styles.contact} style={{ color: '#4f6793' }}>
                      <span>安全员：张三</span>
                      <span className={styles.phone}>17777777777</span>
                    </p>
                  </div>
                </Timeline.Item>
                <Timeline.Item style={{ paddingBottom: 10 }}>
                  <span className={styles.time} style={{ color: '#fff' }}>
                    10:00:00
                  </span>
                  <div>
                    <span className={styles.bestatus} style={{ color: '#fff' }}>
                      处理
                    </span>
                  </div>
                  <div>
                    <p className={styles.content} style={{ color: '#4f6793' }}>
                      暂未处理完毕
                    </p>
                  </div>
                </Timeline.Item>
                {/* <Timeline.Item style={{ paddingBottom: 10 }}>
                  <span className={styles.time} style={{ color: '#fff' }}>
                    10:00:00
                  </span>
                  <div>
                    <span className={styles.status} style={{ color: '#fff' }}>
                      处理
                    </span>
                  </div>
                  <div>
                    <p className={styles.content} style={{ color: '#fff' }}>
                      上报该火警为真实火警
                    </p>
                    <p className={styles.contact} style={{ color: '#4f6793' }}>
                      <span>安全员：张三</span>
                      <span className={styles.phone}>17777777777</span>
                    </p>
                  </div>
                </Timeline.Item> */}
              </Timeline>
            </div>
          </Row>
          <Row>
            <div className={styles.bottom}>
              <Col span={2}>
                <div
                  className={styles.arrowLeft}
                  style={{ backgroundImage: `url(${arrowLeft})` }}
                />
              </Col>
              <Col span={20}>
                <div className={styles.picMain}>
                  <div className={styles.fireimg} style={{ backgroundImage: `url(${imgBg})` }} />

                  <div className={styles.fireimg2} style={{ backgroundImage: `url(${imgBg})` }} />

                  <div className={styles.fireimg3} style={{ backgroundImage: `url(${imgBg})` }} />
                </div>
              </Col>
              <Col span={2}>
                <div
                  className={styles.arrowRight}
                  style={{ backgroundImage: `url(${arrowRight})` }}
                />
              </Col>
            </div>
          </Row>
        </section>
      </FcSection>
    );
  }
}
