import React, { PureComponent } from 'react';
import { CloseOutlined, SearchOutlined } from '@ant-design/icons';
import { Col, Drawer, Row } from 'antd';

import styles from './DrawerContainer.less';

const COL_STYLE = { height: '100%' };
const ICON_STYLE_CLOSE = {
  position: 'absolute',
  right: 16,
  top: 22,
  fontSize: 20,
  color: '#FFF',
  cursor: 'pointer',
};
const ICON_STYLE_SERACH = {
  position: 'absolute',
  right: 65,
  top: 22,
  fontSize: 20,
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
      onClose,
      left = null,
      right = null,
      id,
      style,
      leftParStyle = {},
      rowStyle,
      icon,
      onSearchClick,
      ...restProps
    } = this.props;
    const hasTitle = !!title;
    // right不存在时，默认全部渲染left
    return (
      <Drawer
        visible={visible}
        onClose={onClose}
        width={width || WIDTH}
        className={styles.drawer}
        style={{ padding: 0, height: '100%', ...style }}
        {...restProps}
      >
        <div className={styles.container} id={id}>
          {onSearchClick && <SearchOutlined style={ICON_STYLE_SERACH} onClick={onSearchClick} />}
          <CloseOutlined style={ICON_STYLE_CLOSE} onClick={e => onClose()} />
          {title && (
            <h3 className={styles.title}>
              {icon ? (
                <span
                  className={styles.icon}
                  style={{ background: `url(${icon}) center center / 100% 100% no-repeat` }}
                />
              ) : (
                <span className={styles.rect} />
              )}
              {title}
            </h3>
          )}
          <Row style={{ height: hasTitle ? 'calc(100% - 51px)' : '100%', ...rowStyle }}>
            <Col span={right ? 12 : 24} style={{ ...COL_STYLE, ...leftParStyle }}>
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
