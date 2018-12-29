import React, { PureComponent } from 'react';

import { connect } from 'dva';

import styles from './StorageTankDrawer.less';
import DrawerContainer from '../components/DrawerContainer';
import StorageLableCards from '../components/StorageLableCards';
import waterBg from '../imgs/waterBg.png';

@connect(({ monitor, loading }) => ({
  monitor,
  errorDevicesLoading: loading.effects['monitor/fetchErrorDevices'],
  smokeListLoding: loading.effects['monitor/fetchSmokeList'],
}))
export default class StorageTankDrawer extends PureComponent {
  renderTankList = list => {
    return list.map(item => {
      const { tankId, locationCode, tankName, deviceDataForAppList } = item;
      const liquid = deviceDataForAppList.filter(data => data.desc === '液位')[0] || {};
      const pressure = deviceDataForAppList.filter(data => data.desc === '液压')[0] || {};
      const temp = deviceDataForAppList.filter(data => data.desc === '温度')[0] || {};
      const dataList = [liquid, pressure, temp];
      return (
        <StorageLableCards key={tankId} num={locationCode} title={tankName} dataList={dataList} />
      );
    });
  };

  render() {
    const {
      visible,
      tankDataList: { list },
    } = this.props;
    const left = (
      <div className={styles.content}>
        <div className={styles.cardContainer}>
          <div> {this.renderTankList(list)} </div>
        </div>
      </div>
    );

    const noListLeft = (
      <div
        className={styles.noCards}
        style={{
          background: `url(${waterBg})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center',
          backgroundSize: '40% 25%',
        }}
      />
    );
    return (
      <DrawerContainer
        style={{ overflow: 'hidden' }}
        destroyOnClose={true}
        title="储罐监测"
        width={485}
        visible={visible}
        left={list && list.length > 0 ? left : noListLeft}
        placement="left"
        onClose={() => {
          this.props.onClose();
          this.setState({
            visible: false,
          });
        }}
      />
    );
  }
}
