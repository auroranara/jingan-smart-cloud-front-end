import React, { PureComponent } from 'react';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import { Col, Drawer, Row } from 'antd';

import styles from './index.less';

const COL_STYLE = { height: '100%' };
const ICON_STYLE = {
  position: 'absolute',
  right: 10,
  top: 10,
  fontSize: 18,
  color: '#FFF',
  cursor: 'pointer',
};
const WIDTH = 960;

export default class DrawerContainer extends PureComponent {
  render() {
    const {
      title,
      width,
      visible,
      isTop,
      onClose,
      left = null,
      right = null,
      top = null,
      rowStyle,
      ...restProps
    } = this.props;
    const hasTitle = !!title;

    const zIndex = isTop ? 1001 : 1000;
    // right不存在时，默认全部渲染left
    return (
      <Drawer
        visible={visible}
        placement="left"
        destroyOnClose
        onClose={onClose}
        width={width || WIDTH}
        // className={isTop ? styles.drawer1 : styles.drawer}
        className={styles.drawer}
        // style={{ padding: 0, height: '100%' }}
        // bodyStyle={{ padding: 0, height: '100%' }}
        zIndex={zIndex}
        {...restProps}
      >
        <div className={styles.container}>
          <LegacyIcon type="close" style={ICON_STYLE} onClick={e => onClose()} />
          {hasTitle && (
            <h3 className={styles.title}>
              <span className={styles.rect} />
              {title}
            </h3>
          )}
          {top}
          <Row style={{ height: hasTitle ? 'calc(100% - 51px)' : '100%', ...rowStyle }}>
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
