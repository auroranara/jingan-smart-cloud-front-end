import React from 'react';
import { Row, Col } from 'antd';

import OvCard from './OvCard';
import styles from './OvDangerCards.less';
import divider from '../img/divider.png';
import dangerIcon from '../img/ovDanger.png';

// const numStyle = { fontSize: 20, color: 'rgb(0, 168, 255)' };
const numStyle = { fontSize: 20 };
// const style1 = { borderRadius: '10% 0 0 10%' };
const style1 = { borderRadius: '5px 0 0 0', borderRight: 'none' };
const styleNum1 = { borderRadius: '0 0 0 5px', borderRight: 'none' };
// const style2 = { borderRadius: 0 };
const style2 = { borderRadius: 0, borderLeft: 'none', borderRight: 'none' };
const styleNum2 = { borderRadius: 0, borderLeft: 'none', borderRight: 'none' };
// const style3 = { borderRadius: '0 10% 10% 0' };
const style3 = { borderRadius: '0 5px 0 0', borderLeft: 'none' };
const styleNum3 = { borderRadius: '0 0 5px 0', borderLeft: 'none' };

export default function OvDangerCards(props) {
  const { total=0, overdue=0, rectify=0, review=0, isUnit, handleClick, ...restProps } = props;

  return (
    <div className={styles.danger} {...restProps}>
      <Row gutter={20} style={{ margin: 0, height: '100%' }}>
        <Col style={{ height: '100%' }} span={6}>
          <div className={styles.container}>
            {/* <span className={styles.icon} /> */}
            <span className={styles.icon} style={{ backgroundImage: `url(${dangerIcon})` }} />
            <p className={styles.title}>隐患数量</p>
          </div>
        </Col>
        <Col style={{ height: '100%' }} span={6}>
          <OvCard
            title="总数"
            num={total}
            zeroLength={3}
            onClick={e => handleClick && handleClick(0)}
          />
        </Col>
        <Col style={{ height: '100%' }} span={12}>
          <Row style={{ height: '100%', position: 'relative' }}>
            <Col style={{ height: '100%' }} span={8}>
              <OvCard
                title="已超期"
                num={overdue}
                numStyle={numStyle}
                style={style1}
                titleContainerStyle={style1}
                numContainerStyle={styleNum1}
                onClick={e => handleClick && handleClick(1)}
              />
            </Col>
            <Col style={{ height: '100%' }} span={8}>
              <OvCard
                title="待整改"
                num={rectify}
                numStyle={numStyle}
                style={style2}
                titleContainerStyle={style2}
                numContainerStyle={styleNum2}
                onClick={e => handleClick && handleClick(2)}
              />
            </Col>
            <Col style={{ height: '100%' }} span={8}>
              <OvCard title="待复查"
                num={review}
                numStyle={numStyle}
                style={style3}
                titleContainerStyle={style3}
                numContainerStyle={styleNum3}
                onClick={e => handleClick && handleClick(3)}
              />
            </Col>
            {/* <span className={styles.divider} />
            <span className={styles.divider1} /> */}
            <span style={{ backgroundImage: `url(${divider})` }} className={styles.divider} />
            <span style={{ backgroundImage: `url(${divider})` }} className={styles.divider1} />
          </Row>
        </Col>
      </Row>
    </div>
  );
}
