import React, { Fragment, PureComponent } from 'react';

import { DrawerContainer, DrawerSwitchHead, GasWorkOrder, GasMonitor, UnitInfo } from '../components/Components';
import styles from './GasDrawer.less';

export default class GasDrawer extends PureComponent {
  state = { index: 1 };

  handleChange = i => {
    this.setState({ index: i });
  };

  render() {
    const { visible, monitorData, orderData, ...restProps } = this.props;
    const { index } = this.state;

    const left = (
      <Fragment>
        <UnitInfo />
        <DrawerSwitchHead index={index} onChange={this.handleChange} />
        <div className={styles.gasContainer}>
          {index ? <GasWorkOrder data={orderData} /> : <GasMonitor data={monitorData} />}
        </div>
      </Fragment>
    );

    return (
      <DrawerContainer
        destroyOnClose
        title="可燃气体探测器"
        width={535}
        left={left}
        visible={visible}
        placement="right"
        {...restProps}
      />
    );
  }
}
