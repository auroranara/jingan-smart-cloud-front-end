import React, { Component } from 'react';
import { Col, Row, Button } from 'antd';
import styles from './OffGuardWarning.less';

function UnitCard(props) {
  const { index, companyName, alerted } = props;

  let style = alerted ? { color: '#4092fa', border: '1px solid #4092fa' } : { backgroundColor: '#053d84', color: '#fff' };

  return (
    <Row style={{ borderBottom: '1px rgb(54, 129, 199) solid' }}>
      <Col span={4}>
        <p className={styles.number}>{index}</p>
      </Col>
      <Col span={14}>
        <p className={styles.unitCard}>{companyName}</p>
      </Col>
      <Col span={6} style={{ padding: '10px 0' }}>
        <Button
          className={styles.btnWarning}
          // onClick={this.warningOnClick()}
          style={{ borderRadius: '50px', ...style}}
        >
          警告
        </Button>
      </Col>
    </Row>
  );
}

// const list = [...Array(20).keys()].map(i => ({
//   unit: '无锡晶安智慧科技有限公司',
// }));

export default class OffGuardWarning extends Component {
  render() {
    const { showed, data: { list=[] } } = this.props;

    return (
      <section style={{ display: showed ? 'block' : 'none' }} className={styles.container}>
        <Row span={24} style={{ height: '20%' }}>
          <Col span={12} style={{ height: '100%' }}>
            <div className={styles.left}>
              <Button type="primary">一键警告</Button>
            </div>
          </Col>
          <Col span={12} style={{ height: '100%' }}>
            <div className={styles.right}>
              <p>
                脱岗单位:
                <span style={{ paddingLeft: '5px' }}>5</span>
              </p>
            </div>
          </Col>
        </Row>
        <div className={styles.table}>
          {list.map((item, index) => {
            const { id, companyName, alertFlag: flag } = item;
            return <UnitCard key={id} index={index + 1} companyName={companyName} alerted={flag} />
          })}
        </div>
      </section>
    );
  }
}
