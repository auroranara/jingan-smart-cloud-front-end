import React, { Fragment, PureComponent } from 'react';
import { Col, Drawer, Row } from 'antd';
import { Rect } from '@/pages/BigPlatform/Safety/Company2/components/Components';

import styles from './DrawerContainer.less';

const COL_STYLE = { height: '100%' };
const WIDTH = 960;

export default class DrawerContainer extends PureComponent {
  render() {
    const { title, titleIcon, placement, width, visible, onClose, left=null, right=null, rowStyle, ...restProps } = this.props;
    const newTitle = (
      <Fragment>
        {titleIcon || <Rect color='#0967d3' />}
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
        className={styles.drawer}
        {...restProps}
      >
        <div className={styles.container}>
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
