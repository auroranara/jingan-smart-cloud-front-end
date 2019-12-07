import React, { PureComponent, Fragment } from 'react';
import { Row, Col } from 'antd';
// import { Section2 as CustomSection } from '@/jingan-components/CustomSection';
import Section from '@/pages/BigPlatform/Safety/Company3/components/Section';
// 引入样式文件
import styles from './Remind.less';

const data = [
  { value: 2, name: '特种作业操作证', url: 'operation-safety/special-operation-permit/list' },
  { value: 1, name: '工业产品安全许可证', url: 'unit-license/industrial-product-licence/list' },
  { value: 1, name: '注册安全工程师', url: 'base-info/registered-engineer-management/list' },
  { value: 3, name: '危化品企业安全许可证', url: 'unit-license/danger-chemicals-permit/list' },
];

export default class Remind extends PureComponent {
  state = {};

  handleClick = url => {
    if (!url) return;
    window.open(`${window.publicPath}#/${url}`, `_blank`);
  };

  render() {
    return (
      <Section title="到期提醒">
        <Row gutter={10} style={{ height: '100%' }}>
          {data.map((item, index) => (
            <Col span={12} key={index} className={styles.item}>
              <div className={styles.number} onClick={() => this.handleClick(item.url)}>
                {item.value}
              </div>
              <span className={styles.name} onClick={() => this.handleClick(item.url)}>
                {item.name}
              </span>
            </Col>
          ))}
        </Row>
      </Section>
    );
  }
}
