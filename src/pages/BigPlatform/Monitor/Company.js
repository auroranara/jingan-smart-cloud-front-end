import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Col, Modal, Row, message } from 'antd';
import { WaterWave } from '@/components/Charts';

export default class FireControlBigPlatform extends PureComponent {
  state = {};

  componentDidMount() {}

  componentWillUnmount() {}

  init = () => {};

  render() {
    return (
      <div style={{ textAlign: 'center' }}>
        <WaterWave height={161} title="补贴资金剩余" percent={34} />
      </div>
    );
  }
}
