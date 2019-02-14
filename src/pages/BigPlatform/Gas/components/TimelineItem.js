import React from 'react';
import { Col, Row, Timeline } from 'antd';

import styles from './TimelineItem.less';

const { Item } = Timeline;

export default function TimelineItem(props) {
  const { label, day, hour, children, spans, containerStyle, ...restProps } = props;
  const isHandled = !!children;

  return (
    <Item {...restProps}>
      <Row>
        <Col span={spans ? spans[0] : 3}>
          <p className={styles.labelContainer}><span className={isHandled ? styles.label : styles.greyLabel}>{label}</span></p>
          {isHandled && day && <p className={styles.p}>{day}</p>}
          {isHandled && hour && <p className={styles.p}>{hour}</p>}
        </Col>
        <Col span={spans ? spans[1] : 21}>
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
