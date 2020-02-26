import React, { PureComponent } from 'react';

import CustomDrawer from '@/jingan-components/CustomDrawer';
import TypeCard from '../components/TypeCard';
import styles from './MHDrawer.less';

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
    const {
      visible,
      handleClose,
      mhList = [{}],
      chemicalDetail: { chineName, casNo },
      handleShowVideo,
    } = this.props;

    return (
      <CustomDrawer
        title="重点监管危化品生产存储场所"
        visible={visible}
        onClose={handleClose}
        zIndex={1322}
        width={535}
        // destroyOnClose={true}
      >
        <div className={styles.head}>
          <p>
            <span className={styles.cyan}>重点监管危险化学品：</span>
            {chineName}
          </p>
          <p>
            <span className={styles.cyan}>CAS号：</span>
            {casNo}
          </p>
        </div>
        <div className={styles.cards}>
          {mhList.map((item, index) => (
            <TypeCard data={item} key={index} handleShowVideo={handleShowVideo} />
          ))}
        </div>
      </CustomDrawer>
    );
  }
}
