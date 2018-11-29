import React, { PureComponent } from 'react';
import { Col, Drawer, Row } from 'antd';

import styles from './DrawerContainer.less';

const COL_STYLE = { height: '100%' };
const WIDTH = 960;

export default class DrawerContainer extends PureComponent {
  render() {
    const { title, visible, onClose, left=null, right=null } = this.props;

    return (
      <Drawer
        visible={visible}
        placement="left"
        onClose={onClose}
        width={WIDTH}
        className={styles.drawer}
        style={{ padding: 0, height: '100%' }}
        // style={{ padding: '108px 0 0 1px' }}
      >
        <div className={styles.container}>
          <h3 className={styles.title}>
            <span className={styles.rect} />
            {title}
          </h3>
          <Row style={{ height: 'calc(100% - 66px)' }}>
            <Col span={12} style={COL_STYLE}>
              {left}
            </Col>
            <Col span={12} style={COL_STYLE}>
              {right}
            </Col>
          </Row>
        </div>
      </Drawer>
    );
  }
}
