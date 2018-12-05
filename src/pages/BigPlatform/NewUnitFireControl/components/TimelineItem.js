import React from 'react';
import { Col, Row, Timeline } from 'antd';

import styles from './TimelineItem.less';

const { Item } = Timeline;

export default function TimelineItem(props) {
  const { label, children, containerStyle, ...restProps } = props;

  return (
    <Item {...restProps}>
      <Row>
        <Col span={3}>
          <span className={styles.label}>{label}</span>
        </Col>
        <Col span={21}>
          <div className={styles.outer}>
            <div className={styles.container} style={containerStyle}>
              {children}
            </div>
          </div>
        </Col>
      </Row>
    </Item>
  );
}
