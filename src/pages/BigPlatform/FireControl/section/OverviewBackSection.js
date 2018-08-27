import React from 'react';
import { Col, Row } from 'antd';

import FcSection from './FcSection';
import OvUnit from '../components/OvUnit';
import OvFireCards from '../components/OvFireCards';
import OvDangerCards from '../components/OvDangerCards';
import styles from './OverviewBackSection.less';

import unitIcon from '../img/ovUnit.png';
import safetyIcon from '../img/ovSafety.png';
import riskIcon from '../img/ovRisk.png';

const UNIT_STYLE = { height: 48 };
const ICON_STYLE = { width: 48, height: 48 };

export default function OverviewBackSection(props) {
  return (
    <FcSection style={{ padding: 0 }} isBack>
      <div className={styles.up}>
        <div className={styles.unitInfo}>
          <img src={unitIcon} alt="单位图标" width={44} height={42} className={styles.unitIcon} />
          <p className={styles.name}>无锡晶安机械设备有限公司</p>
          <p className={styles.safety}>安全负责人：<span className={styles.info}>张小东</span></p>
          <p>联系方式：<span className={styles.info}>18151518810</span></p>
        </div>
        <Row style={{ marginTop: 0 }}>
          <Col span={12}>
            <div className={styles.unit}>
              <OvUnit url={safetyIcon} title="安全人员" style={UNIT_STYLE} iconStyle={ICON_STYLE} num={4} />
            </div>
          </Col>
          <Col span={12}>
            <div className={styles.unit}>
              <OvUnit url={riskIcon} title="风险点" style={UNIT_STYLE} iconStyle={ICON_STYLE} num={3} />
            </div>
          </Col>
        </Row>
      </div>
      <div className={styles.down}>
        <OvFireCards style={{ height: '50%', padding: '15px 10px 8px', margin: 0 }} />
        <OvDangerCards style={{ height: '50%', border: 'none', padding: '8px 10px 15px' }} />
      </div>
    </FcSection>
  );
}
