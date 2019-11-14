import React, { PureComponent, Fragment } from 'react';
import { Row, Col } from 'antd';
import { Section2 as CustomSection } from '@/jingan-components/CustomSection';
// 引入样式文件
import styles from './Remind.less';

const data = [
  { value: 1, name: '企业许可证' },
  { value: 3, name: '危化品企业安全许可证' },
  { value: 1, name: '工业产品安全许可证' },
  { value: 4, name: '员工证书' },
];

export default class Remind extends PureComponent {
  state = {};

  render() {
    return (
      <CustomSection className={styles.container} title="到期提醒">
        <Row gutter={10} style={{ height: '100%' }}>
          {data.map((item, index) => (
            <Col span={12} key={index} className={styles.item}>
              <div className={styles.number}>{item.value}</div>
              {item.name}
            </Col>
          ))}
        </Row>
      </CustomSection>
    );
  }
}
