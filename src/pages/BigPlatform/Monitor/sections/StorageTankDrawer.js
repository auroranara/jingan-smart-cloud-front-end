import React, { PureComponent } from 'react';
import { Col, Row, Button, Select } from 'antd';

import { connect } from 'dva';

import styles from './StorageTankDrawer.less';
import DrawerContainer from '../components/DrawerContainer';
import StorageLableCards from '../components/StorageLableCards';

@connect(({ monitor, loading }) => ({
  monitor,
  errorDevicesLoading: loading.effects['monitor/fetchErrorDevices'],
  smokeListLoding: loading.effects['monitor/fetchSmokeList'],
}))
export default class StorageTankDrawer extends PureComponent {
  state = {};

  renderTankList = list => {
    return list.map((item, i) => (
      <StorageLableCards key={item.tankId} num={item.locationCode} title={item.tankName} />
    ));
  };

  render() {
    const {
      visible,
      tankDataList: { list },
    } = this.props;
    const left = (
      <div className={styles.content}>
        {/* <Row gutter={6}>
          <Col span={9}>
            <Select
              placeholder="全部状态"
              style={{
                width: '165px',
              }}
            />
          </Col>
          <Col span={9}>
            <Select
              placeholder="全部监测参数"
              style={{
                width: '165px',
              }}
            />
            />
          </Col>
          <Col span={6}>
            <Button
              // onClick={this.handleSearch}
              style={{
                background: 'rgba(9,103,211,0.5)',
                border: 'none',
                color: '#FFF',
                width: '100%',
              }}
            >
              查询
            </Button>
          </Col>
        </Row> */}
        <div className={styles.cardContainer}>
          {list && list.length > 0 && <div> {this.renderTankList(list)} </div>}
        </div>
      </div>
    );
    return (
      <DrawerContainer
        style={{ overflow: 'hidden' }}
        destroyOnClose={true}
        title="储罐监测"
        width={485}
        visible={visible}
        left={left}
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
