import React, { Component } from 'react';
import { Row, Timeline, Carousel } from 'antd';
import FcSection from './FcSection';
import styles from './AlarmHandle.less';

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
                style={{ marginLeft: 60, marginTop: 10 }}
              >
                <Timeline.Item>
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
                    <p className={styles.contact} style={{ color: '#4f6793' }}>
                      <span>安全员：张三</span>
                      <span className={styles.phone}>17777777777</span>
                    </p>
                  </div>
                </Timeline.Item>
                <Timeline.Item>
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
                    <p className={styles.contact} style={{ color: '#4f6793' }}>
                      <span>安全员：张三</span>
                      <span className={styles.phone}>17777777777</span>
                    </p>
                  </div>
                </Timeline.Item>
              </Timeline>
            </div>
          </Row>
          <div className={styles.bottom}>
            <div className={styles.arrowRight} />
            <div className={styles.picMain} />
            <div className={styles.arrowLeft} />
          </div>
        </section>
      </FcSection>
    );
  }
}
