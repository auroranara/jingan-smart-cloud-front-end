import React, { Fragment, PureComponent } from 'react';
import { Col, Drawer, Icon, Row } from 'antd';

import styles from './DrawerContainer.less';

const COL_STYLE = { height: '100%' };
const WIDTH = 960;

export default class DrawerContainer extends PureComponent {
  render() {
    const { title, titleIcon, placement, width, isTop, visible, onClose, left=null, right=null, top=null, rowStyle, ...restProps } = this.props;
    const newTitle = (
      <Fragment>
        {titleIcon}
        {title}
      </Fragment>
    );

    // right不存在时，默认全部渲染left
    return (
      <Drawer
        visible={visible}
        placement={placement || 'left'}
        destroyOnClose
        title={newTitle}
        onClose={onClose}
        width={width || WIDTH}
        className={isTop ? styles.drawer1 : styles.drawer}
        // style={{ padding: 0, height: '100%' }}
        // bodyStyle={{ padding: 0, height: '100%' }}
        {...restProps}
      >
        <div className={styles.container}>
          {/* <Icon type="close" style={ICON_STYLE} onClick={e => onClose()} />
          {hasTitle && (
            <h3 className={styles.title}>
              <span className={styles.rect} />
              {title}
            </h3>
          )}
          {top} */}
          {/* <Row style={{ height: hasTitle ? 'calc(100% - 51px)': '100%', ...rowStyle }}> */}
          <Row style={{ height: '100%', ...rowStyle }}>
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
