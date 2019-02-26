import React, { PureComponent } from 'react';

import { connect } from 'dva';
import { Icon, Row, Col } from 'antd';
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
      const pressure = deviceDataForAppList.filter(data => data.desc === '压力')[0] || {};
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
      storageStatus,
      handleFilter,
      statistics: {  // 储罐统计
        tankNum = 0,
        countMap: { normal = 0, outContact = 0, unnormal = 0 } = {},
      },
    } = this.props;
    const ICON_STYLE = {
      position: 'absolute',
      right: 10,
      top: -46,
      fontSize: 18,
      color: '#FFF',
      cursor: 'pointer',
    };

    const filterList = [
      { value: 'all', label: '全部', color: 'rgb(0, 168, 255)', number: tankNum },
      { value: 0, label: '正常', color: 'rgb(0, 161, 129)', number: normal },
      { value: 2, label: '报警', color: 'rgb(232, 103, 103)', number: unnormal },
      { value: -1, label: '失联', color: 'rgb(198, 193, 129)', number: outContact },
    ]

    const left = (
      <div className={styles.content}>
        <Icon type="close" style={ICON_STYLE} onClick={e => this.props.onClose()} />
        <Row className={styles.sectionFilter}>
          {filterList.map((item, i) => (
            <Col span={6} className={styles.filter} key={i}>
              <div className={storageStatus === item.value ? styles.activeFilter : styles.inActiveFilter}
                onClick={() => handleFilter(item.value)}>
                {item.label}（<span style={{ color: item.color }}>{item.number}</span>）
              </div>
            </Col>
          ))}
        </Row>
        <div className={styles.cardContainer}>
          <div>{this.renderTankList(list)}</div>
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
        className={styles.drawer}
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
