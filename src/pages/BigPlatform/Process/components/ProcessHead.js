import React, { PureComponent } from 'react';
import { Col, Row } from 'antd';

import styles from './ProcessHead.less';

const SPAN = 6;

export default class ProcessHead extends PureComponent {
  render() {
    const {
      title,
      data: { processName, processType, material, intermediate, product },
      ...restProps
    } = this.props;

    return (
      <div className={styles.container} {...restProps}>
        <h3 className={styles.title}>{title}</h3>
        <Row className={styles.row}>
          <Col span={SPAN}>
            <span className={styles.label}>生产工艺名称:</span>
            {processName}
          </Col>
          <Col span={SPAN}>
            <span className={styles.label}>反应类型:</span>
            {processType}
            <span className={styles.camera} />
          </Col>
        </Row>
        <Row>
          <Col span={SPAN}>
            <span className={styles.label}>生产原料:</span>
            {material}
          </Col>
          <Col span={SPAN}>
            <span className={styles.label}>中间产品:</span>
            {intermediate}
          </Col>
          <Col span={SPAN}>
            <span className={styles.label}>最终产品:</span>
            {product}
            <span className={styles.more}>更多信息</span>
          </Col>
        </Row>
        <span className={styles.rect} />
      </div>
    );
  }
}
