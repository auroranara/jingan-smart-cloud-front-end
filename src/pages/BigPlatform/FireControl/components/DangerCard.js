import React from 'react';
import { Col, Row } from 'antd';

import styles from './DangerCard.less';

export default function DangerCard(props) {
  const { desc, url, report, reform, review, ...restProps } = props;

  return (
    <div className={styles.container} {...restProps}>
      <p className={styles.desc}>{desc}</p>
      <Row>
        <Col span={6}>
          <span className={styles.img} style={{ backgroundImage: `url(${url})` }} />
        </Col>
        <Col span={18}>
          <p>上<span className={styles.space} />报：<span className={styles.info}>{report}</span></p>
          <p>实际整改：<span className={styles.info}>{reform}</span></p>
          <p>复<span className={styles.space} />查：<span className={styles.info}>{review}</span></p>
        </Col>
      </Row>
    </div>
  );
}
