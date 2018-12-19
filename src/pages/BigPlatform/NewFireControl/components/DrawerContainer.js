import React, { PureComponent } from 'react';
import { Col, Drawer, Row } from 'antd';

import styles from './DrawerContainer.less';

const COL_STYLE = { height: '100%' };
const WIDTH = 960;

export default class DrawerContainer extends PureComponent {
  render() {
    const { title, width, visible, onClose, left=null, right=null, top=null, rowStyle, ...restProps } = this.props;
    const hasTitle = !!title;

    // right不存在时，默认全部渲染left
    return (
      <Drawer
        visible={visible}
        placement="left"
        onClose={onClose}
        width={width || WIDTH}
        className={styles.drawer}
        style={{ padding: 0, height: '100%' }}
        // style={{ padding: '108px 0 0 1px' }}
        {...restProps}
      >
        <div className={styles.container}>
          {hasTitle && (
            <h3 className={styles.title}>
              <span className={styles.rect} />
              {title}
            </h3>
          )}
          {top}
          <Row style={{ height: hasTitle ? 'calc(100% - 51px)': '100%', ...rowStyle }}>
            <Col span={right ? 12 : 24} style={COL_STYLE}>
              {left}
            </Col>
            {right && (
              <Col span={12} style={COL_STYLE}>
                {right}
              </Col>
            )}
          </Row>
        </div>
      </Drawer>
    );
  }
}
