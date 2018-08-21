import React from 'react';
import { Row, Col } from 'antd';

import OvCard from './OvCard';
import styles from './OvDangerCards.less';
import divider from './divider.png';
import dangerIcon from './ovDanger.png';

const numStyle = { fontSize: 20, color: 'rgb(0, 168, 255)' };
const style1 = { borderRadius: '10% 0 0 10%' };
const style2 = { borderRadius: 0 };
const style3 = { borderRadius: '0 10% 10% 0' };

export default function OvDangerCards(props) {
  const { total, overdue, rectify, review } = props;

  return (
    <div className={styles.danger}>
      <Row gutter={20} style={{ margin: 0, height: '100%' }}>
        <Col style={{ height: '100%' }} span={6}>
          <div className={styles.container}>
            <span className={styles.icon} style={{ background: `url(${dangerIcon})`, backgroundSize: 'cover' }} />
            <p className={styles.title}>隐患数量</p>
          </div>
        </Col>
        <Col style={{ height: '100%' }} span={6}><OvCard title="总数" num={total} zeroLength={3} /></Col>
        <Col style={{ height: '100%' }} span={12}>
          <Row style={{ height: '100%', position: 'relative' }}>
            <Col style={{ height: '100%' }} span={8}><OvCard title="已超期" num={overdue} numStyle={numStyle} style={style1} titleContainerStyle={style1} /></Col>
            <Col style={{ height: '100%' }} span={8}><OvCard title="待整改" num={rectify} numStyle={numStyle} style={style2} titleContainerStyle={style2} /></Col>
            <Col style={{ height: '100%' }} span={8}><OvCard title="待复查" num={review} numStyle={numStyle} style={style3} titleContainerStyle={style3} /></Col>
            <span style={{ background: `url(${divider})`, backgroundSize: 'cover' }} className={styles.divider} />
            <span style={{ background: `url(${divider})`, backgroundSize: 'cover' }} className={styles.divider1} />
          </Row>
        </Col>
      </Row>
    </div>
  );
}
