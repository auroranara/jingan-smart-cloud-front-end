import React, { Component } from 'react';
import { Col, Row, Button } from 'antd';
import FcSection from './FcSection';
import styles from './OffGuardWarning.less';

function UnitCard() {
  // const { unit, btnWarning } = props;

  return (
    <Row style={{ borderTop: '1px rgb(54, 129, 199) solid' }}>
      <Col span={4}>
        <p className={styles.number}>1</p>
      </Col>
      <Col span={14}>
        <p className={styles.unitCard}>无锡晶安智慧科技有限公司</p>
      </Col>
      <Col span={6} style={{ padding: '10px 0' }}>
        <Button
          className={styles.btnWarning}
          // onClick={this.warningOnClick()}
          style={{
            borderRadius: '50px',
            backgroundColor: '#053d84',
            color: '#fff',
            borderColor: '#053d84',
          }}
        >
          警告
        </Button>
      </Col>
    </Row>
  );
}

const offGuardUint = [...Array(5).keys()].map(i => ({
  unit: '无锡晶安智慧科技有限公司',
}));

export default class OffGuardWarning extends Component {
  render() {
    return (
      <FcSection title="脱岗警告">
        <Row span={24}>
          <Col span={12}>
            <div className={styles.left}>
              <Button type="primary">一键警告</Button>
            </div>
          </Col>
          <Col span={12}>
            <div className={styles.right}>
              <p>
                脱岗单位:
                <span style={{ paddingLeft: '5px' }}>5</span>
              </p>
            </div>
          </Col>
        </Row>
        <div className={styles.table}>
          {offGuardUint.map((item, index) => (
            <UnitCard {...item} key={index} />
          ))}
        </div>
      </FcSection>
    );
  }
}
