import React from 'react';
import { Col, Row, Timeline } from 'antd';

import styles from './TimelineItem.less';

const { Item } = Timeline;

export default function TimelineItem(props) {
  const { label, children, containerStyle, ...restProps } = props;
  const isHandled = !!children;

  return (
    <Item {...restProps}>
      <Row>
        <Col span={3}>
          <span className={isHandled ? styles.label : styles.greyLabel}>{label}</span>
        </Col>
        <Col span={21}>
          {isHandled && (
            <div className={styles.outer}>
              <div className={styles.container} style={containerStyle}>
                {children}
              </div>
            </div>
          )}
        </Col>
      </Row>
    </Item>
  );
}
