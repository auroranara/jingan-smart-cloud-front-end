import React, { Component } from 'react';
import { Col, Row, Timeline, Button } from 'antd';
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
              <Timeline pending="" reverse={this.state.reverse}>
                <Timeline.Item>
                  <span />
                  <span />
                  <p />
                </Timeline.Item>
              </Timeline>
            </div>
          </Row>
          <div className={styles.bottom} />
        </section>
      </FcSection>
    );
  }
}
