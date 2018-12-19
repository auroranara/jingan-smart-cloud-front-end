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

  render() {
    const { visible } = this.props;
    const left = (
      <div className={styles.content}>
        <Row gutter={6} style={{ marginBottom: 20 }}>
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
        </Row>
        <div className={styles.cardContainer}>
          <StorageLableCards num="22" title="二氧化碳" />
          <StorageLableCards num="22" title="二氧化碳" />
          <StorageLableCards num="22" title="二氧化碳" />
          <StorageLableCards num="22" title="二氧化碳" />
          <StorageLableCards num="22" title="二氧化碳" />
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
