import React, { PureComponent } from 'react';

import Section from '../Section';
import SignalAnime from '../../Monitor/Components/SignalAnime';
import fireHost from '../imgs/fire-host.png';
import line from '../imgs/line.png';
import styles from './FireMonitoring.less';

export default class FireMonitoring extends PureComponent {
  render() {
    const {
      // 火警
      fire = 0,
      // 故障
      fault = 0,
      // 屏蔽
      shield = 0,
      // 联动
      linkage = 0,
      // 监管
      supervise = 0,
      // 反馈
      feedback = 0,
    } = this.props;
    console.log('FireMonitoring', this.props);
    return (
      <Section title="消防主机监测">
        <div className={styles.contaniner}>
          <div className={styles.top}>
            <div
              className={styles.fireHostImg}
              style={{
                backgroundImage: `url(${fireHost})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: '25% 52%',
              }}
            />
            <div className={styles.anime}>
              <SignalAnime />
            </div>
            <div className={styles.twoTotal}>
              <p className={styles.fireTitle}>
                火警 <span className={styles.fireCount}>{fire || 0}</span>
              </p>
              <p className={styles.errorTitle}>
                故障 <span className={styles.errorCount}>{fault || 0}</span>
              </p>
            </div>
          </div>
          <div className={styles.bottom}>
            <div
              className={styles.linkage}
              style={{
                backgroundImage: `url(${line})`,
                backgroundRepeat: 'no-repeat',
              }}
            >
              <p className={styles.linkageCount}>{linkage || 0}</p>
              <p className={styles.linkageTitle}>联动</p>
            </div>
            <div
              className={styles.regulation}
              style={{
                backgroundImage: `url(${line})`,
                backgroundRepeat: 'no-repeat',
              }}
            >
              <p className={styles.regulationCount}>{supervise || 0}</p>
              <p className={styles.regulationTitle}>监管</p>
            </div>
            <div
              className={styles.shield}
              style={{
                backgroundImage: `url(${line})`,
                backgroundRepeat: 'no-repeat',
              }}
            >
              <p className={styles.shieldCount}>{shield || 0}</p>
              <p className={styles.shieldTitle}>屏蔽</p>
            </div>
            <div className={styles.feedback}>
              <p className={styles.feedbackCount}>{feedback || 0}</p>
              <p className={styles.feedbackTitle}>反馈</p>
            </div>
          </div>
        </div>
      </Section>
    );
  }
}
