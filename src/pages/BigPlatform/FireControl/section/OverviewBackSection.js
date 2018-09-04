import React from 'react';
import { Col, Row } from 'antd';
import Ellipsis from 'components/Ellipsis';

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

const NO_DATA = '暂无信息';

export default function OverviewBackSection(props) {
  const {
    data: {
      selected: { id, name, safetyName, safetyPhone } = {},
      companyOv: {
        todayCount = 0,
        thisWeekCount = 0,
        thisMonthCount = 0,
        safetyOfficer = 0,
        riskPointer = 0,
        totalDanger = 0,
        overdueNum = 0,
        rectifyNum = 0,
        reviewNum = 0,
      } = {},
    },
  } = props;

  return (
    <FcSection style={{ padding: 0 }} isBack>
      <div className={styles.up}>
        <div className={styles.unitInfo}>
          <img src={unitIcon} alt="单位图标" width={44} height={42} className={styles.unitIcon} />
          <div
            className={styles.name}
            onClick={e =>
              window.open(`${window.publicPath}#/big-platform/fire-control/company/${id}`)
            }
          >
            <Ellipsis lines={1} tooltip>
              {/* <a className={styles.link} href={`${window.publicPath}#/big-platform/fire-control/company/${id}`} target="_blank" rel="noopener noreferrer"> */}
              {/* 无锡晶安智慧科技有限公司无锡晶安智慧科技有限公司 */}
              {name ? name : NO_DATA}
              {/* </a> */}
            </Ellipsis>
          </div>
          <p className={styles.safety}>
            安全负责人：
            <span className={styles.info}>{safetyName ? safetyName : NO_DATA}</span>
          </p>
          <p>
            联系方式：
            <span className={styles.info}>{safetyPhone ? safetyPhone : NO_DATA}</span>
          </p>
        </div>
        <Row style={{ marginTop: 0 }}>
          <Col span={12}>
            <div className={styles.unit}>
              <OvUnit
                url={safetyIcon}
                title="安全人员"
                style={UNIT_STYLE}
                iconStyle={ICON_STYLE}
                num={safetyOfficer}
              />
            </div>
          </Col>
          <Col span={12}>
            <div className={styles.unit}>
              <OvUnit
                url={riskIcon}
                title="风险点"
                style={UNIT_STYLE}
                iconStyle={ICON_STYLE}
                num={riskPointer}
              />
            </div>
          </Col>
        </Row>
      </div>
      <div className={styles.down}>
        <OvFireCards
          today={todayCount}
          thisWeek={thisWeekCount}
          thisMonth={thisMonthCount}
          style={{ height: '50%', padding: '15px 10px 8px', margin: 0 }}
        />
        <OvDangerCards
          total={totalDanger}
          overdue={overdueNum}
          rectify={rectifyNum}
          review={reviewNum}
          style={{ height: '50%', border: 'none', padding: '8px 10px 15px' }}
        />
      </div>
    </FcSection>
  );
}
