import React, { PureComponent } from 'react';
import { Row, Col, Select } from 'antd';

import SignalAnime from '../../Monitor/Components/SignalAnime';
import fireHost from '../imgs/fire-host.png';
import styles from './FireMonitoring.less';

export default class FireMonitoring extends PureComponent {
  render() {
    return (
      <div className={styles.sectionArea}>
        <div className={styles.topArea}>
          {/* <div className={styles.title}>消防主机监测</div>
          <div className={styles.history}>历史 >></div> */}
        </div>
        <div className={styles.bottomMain}>
          <div className={styles.top}>
            <div
              className={styles.fireHostImg}
              style={{
                backgroundImage: `url(${fireHost})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: '32% 60%',
              }}
            />
            <div className={styles.anime}>
              <SignalAnime />
            </div>
            <div className={styles.twoTotal}>
              <p className={styles.fireTitle}>
                火警 <span className={styles.fireCount}>0</span>
              </p>
              <p className={styles.errorTitle}>
                故障 <span className={styles.errorCount}>0</span>
              </p>
            </div>
          </div>
          <div className={styles.bottom} />
        </div>
      </div>
    );
  }
}
