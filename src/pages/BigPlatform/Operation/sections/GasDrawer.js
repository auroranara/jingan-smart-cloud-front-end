import React, { Fragment, PureComponent } from 'react';

import { DrawerContainer, DrawerSwitchHead, GasWorkOrder, GasMonitor, UnitInfo } from '../components/Components';
import styles from './GasDrawer.less';
import { GAS_CODE } from '../utils';

export default class GasDrawer extends PureComponent {
  state = { index: 1 };

  handleChange = i => {
    this.setState({ index: i });
  };

  render() {
    const { visible, monitorData, orderData, handleVideoOpen, fetchGasTotal, ...restProps } = this.props;
    const { index } = this.state;

    const { order, item } = orderData;
    const { companyName, area, location } = Array.isArray(order) && order[0] ? order[0] : {};
    const device = item.deviceDataForAppList && item.deviceDataForAppList.find(({ code }) => code === GAS_CODE);

    const left = (
      <Fragment>
        <UnitInfo
          name={companyName}
          location={`${area || ''}${location || ''}`}
          clickCamera={handleVideoOpen}
        />
        <DrawerSwitchHead index={index} onChange={this.handleChange} />
        <div className={styles.gasContainer}>
          {index ? <GasWorkOrder data={orderData} fetchGasTotal={fetchGasTotal} /> : <GasMonitor data={monitorData} />}
        </div>
      </Fragment>
    );

    const title = (
      <Fragment>
        可燃气体探测器
        {device && +device.status > 0 && (
          <div className={styles.alarm}>
            <span className={styles.alarmIcon} />
            报警
          </div>
        )}
      </Fragment>
    );

    return (
      <DrawerContainer
        destroyOnClose
        title={title}
        width={535}
        left={left}
        visible={visible}
        placement="right"
        {...restProps}
      />
    );
  }
}
