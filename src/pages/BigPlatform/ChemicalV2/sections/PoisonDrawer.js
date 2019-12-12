import React, { PureComponent } from 'react';

import CustomDrawer from '@/jingan-components/CustomDrawer';
import styles from './GasDrawer.less';

export default class PoisonDrawer extends PureComponent {
  handleWorkOrderIconClick = () => {
    const { xxx: { id = 1 } = {} } = this.props;
    window.open(`${window.publicPath}#/company-iot/alarm-work-order/detail/${id}`);
  };

  handleMonitorTrendIconClick = () => {
    const { xxx: { id = 1 } = {} } = this.props;
    window.open(`${window.publicPath}#/company-iot/alarm-work-order/monitor-trend/${id}`);
  };

  render() {
    const { visible, handleClose } = this.props;

    return (
      <CustomDrawer
        title="可燃气体监测"
        visible={visible}
        onClose={handleClose}
        // sectionProps={{
        //   scrollProps: { ref: (scroll) => this.scroll = scroll && scroll.dom },
        //   spinProps: { loading },
        // }}
      >
        <div className={styles.up}>
          <div className={styles.section}>
            <span className={styles.label}>监测区域名称：</span>6号罐附近
            <span className={styles.camera} />
            <div className={styles.icons}>
              <span className={styles.sheet} onClick={this.handleWorkOrderIconClick} />
              <span className={styles.trend} onClick={this.handleMonitorTrendIconClick} />
            </div>
          </div>
          <div>
            <span className={styles.label}>编号：</span>4
          </div>
        </div>
        <div className={styles.down}>
          <div className={styles.device1}>
            <p className={styles.lel}>LEL</p>
            <p className={styles.value}>6.2%</p>
          </div>
          <div className={styles.info}>
            <p className={styles.time}>
              <span className={styles.label}>更新时间：</span>
              2019-12-12 12:00:00
            </p>
            <p className={styles.detail}>
              <span className={styles.label}>浓度(%LEL)：</span>6.2
              <span className={styles.status}>状态：</span><span className={styles.alarm}>报警(≥6)</span>
            </p>
          </div>
        </div>
      </CustomDrawer>
    );
  }
}
