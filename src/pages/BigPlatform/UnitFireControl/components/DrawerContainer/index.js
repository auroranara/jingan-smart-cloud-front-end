import React, { PureComponent } from 'react';
import { Col, Drawer, Row, Icon } from 'antd';

import styles from './index.less';

const COL_STYLE = { height: '100%' };
const WIDTH = 960;

export default class DrawerContainer extends PureComponent {
  render() {
    const { title, width, visible, onClose, left = null, right = null, id, style, closable, ...restProps } = this.props;

    // right不存在时，默认全部渲染left
    return (
      <Drawer
        visible={visible}
        width={width || WIDTH}
        className={styles.drawer}
        style={{ padding: 0, height: '100%', ...style }}
        title={null}
        // style={{ padding: '108px 0 0 1px' }}
        {...restProps}
      >
        <div className={styles.container} id={id}>
          <h3 className={styles.title}>
            <span className={styles.rect} />
            {title}
          </h3>
          <div style={{ height: 'calc(100% - 51px)' }} className={styles.content}>
            <Col span={right ? 12 : 24} style={COL_STYLE}>
              {left}
            </Col>
            {right && (
              <Col span={12} style={COL_STYLE}>
                {right}
              </Col>
            )}
          </div>
          {closable && (
            <div className={styles.closeTag}>
              <Icon onClick={onClose} type="close" />
            </div>
          )}
        </div>
      </Drawer>
    );
  }
}
