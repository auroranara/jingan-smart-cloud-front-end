import React, { PureComponent } from 'react';

import StorageCard from '../components/StorageCard';
import styles from './StorageTankMonitor.less';
import { connect } from 'dva';

import ExSection from './ExSection';
import storageImg from '../imgs/storageImg.png';

const hDivider = 'http://data.jingan-china.cn/v2/big-platform/fire-control/com/split_h.png';
const divider = 'http://data.jingan-china.cn/v2/big-platform/fire-control/com/split.png';

@connect(({ monitor, loading }) => ({
  monitor,
  errorDevicesLoading: loading.effects['monitor/fetchErrorDevices'],
  smokeListLoding: loading.effects['monitor/fetchSmokeList'],
}))
export default class StorageTankMonitor extends PureComponent {
  state = {};

  // 渲染分割线
  renderDivider = src => {
    return (
      <div
        className={styles.divider}
        style={{
          backgroundImage: `url(${src})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center',
          backgroundSize: '100% 100%',
        }}
      />
    );
  };

  render() {
    const {
      handleStorageDrawer,
      tankData: {
        tankNum,
        alarmSensor: { liquidLevel, temperature, pressure },
        lostSensor: { liquidLevel: lostLiquid, temperature: lostTemp, pressure: lostPressure },
      },
    } = this.props;
    return (
      <ExSection title="储罐监测">
        <div className={styles.content}>
          <div className={styles.StorageTotal}>
            <div
              className={styles.totalImg}
              style={{
                backgroundImage: `url(${storageImg})`,
                backgroundRepeat: 'no-repeat',
                groundPosition: 'center center',
                backgroundSize: '100% 100%',
              }}
            />
            <div className={styles.title}>
              <span className={styles.text}>储罐总数</span>
            </div>
            <div className={styles.number}>
              <span className={styles.text} onClick={handleStorageDrawer}>
                {tankNum}
              </span>
            </div>
          </div>
          {this.renderDivider(hDivider)}
          <div className={styles.statusList}>
            <div className={styles.left}>
              <div className={styles.leftTitle} onClick={handleStorageDrawer}>
                <span>报警</span>
                <span className={styles.errorText} style={{ paddingLeft: 15 }}>
                  {liquidLevel + temperature + pressure}
                </span>
              </div>
              <div className={styles.storageCards}>
                <StorageCard num={liquidLevel} title="液位" onClick={handleStorageDrawer} />
                <StorageCard num={temperature} title="压力" onClick={handleStorageDrawer} />
                <StorageCard num={pressure} title="温度" onClick={handleStorageDrawer} />
              </div>
            </div>
            {this.renderDivider(divider)}
            <div className={styles.right}>
              <div className={styles.leftTitle} onClick={handleStorageDrawer}>
                <span>失联</span>
                <span className={styles.errorText} style={{ paddingLeft: 15 }}>
                  {lostLiquid + lostTemp + lostPressure}
                </span>
              </div>

              <div className={styles.storageCards}>
                <StorageCard
                  num={lostLiquid}
                  title="液位"
                  color="rgb(198, 193, 129)"
                  onClick={handleStorageDrawer}
                />
                <StorageCard
                  num={lostTemp}
                  title="压力"
                  color="rgb(198, 193, 129)"
                  onClick={handleStorageDrawer}
                />
                <StorageCard
                  num={lostPressure}
                  title="温度"
                  color="rgb(198, 193, 129)"
                  onClick={handleStorageDrawer}
                />
              </div>
            </div>
          </div>
        </div>
      </ExSection>
    );
  }
}
