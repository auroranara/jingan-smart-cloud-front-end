import React from 'react';
import { Col, Divider, Row } from 'antd';

import FcSection from './FcSection';
import OvUnit from '../components/OvUnit';
import OvFireCards from '../components/OvFireCards';
import OvDangerCards from '../components/OvDangerCards';
import styles from './OverviewSection.less';
import companyIcon from '../img/ovCompany.png';
import hostIcon from '../img/ovHost.png';

const HEIGHT = 'calc(50% - 69px)';
const PADDING = '25px 0';
// const companyIcon = 'http://data.jingan-china.cn/v2/big-platform/fire-control/gov/ovCompany.png';
// const hostIcon = 'http://data.jingan-china.cn/v2/big-platform/fire-control/gov/ovHost.png';
const { region } = global.PROJECT_CONFIG;

export default function OverviewSection(props) {
  const {
    data: {
      titleName='暂无信息',
      total=0,
      activeCount=0,
      todayCount=0,
      thisWeekCount=0,
      thisMonthCount=0,
      totalDanger=0,
      overdueNum=0,
      rectifyNum=0,
      reviewNum=0,
    }={},
    handleDrawerVisibleChange,
  } = props;

  // console.log('overview', props.data);

  return (
    // <FcSection style={{ padding: '0 2px' }}>
    <FcSection title="辖区概况">
      {/* <div className={styles.divider}>
        <Divider><p className={styles.title}>{titleName}</p></Divider>
      </div> */}
      {/* <Row style={{ marginTop: 25 }}> */}
      <Row style={{ marginTop: 13 }}>
        <Col span={12}>
          <div className={styles.unit}>
            <OvUnit
              title="管辖单位"
              url={companyIcon}
              num={total}
              onClick={e => handleDrawerVisibleChange('unit')}
            />
          </div>
        </Col>
        <Col span={12}>
          <div className={styles.unit}>
            <OvUnit
              title="消防主机单位"
              url={hostIcon}
              num={activeCount}
              onClick={e => handleDrawerVisibleChange('host')}
            />
          </div>
        </Col>
      </Row>
      <OvFireCards
        isUnit={0}
        today={todayCount}
        thisWeek={thisWeekCount}
        thisMonth={thisMonthCount}
        handleDrawerVisibleChange={handleDrawerVisibleChange}
        // style={{ height: HEIGHT, padding: PADDING, marginTop: 25 }}
        style={{ height: HEIGHT, padding: PADDING, marginTop: 20 }}
      />
      <OvDangerCards
        isUnit={0}
        total={totalDanger}
        overdue={overdueNum}
        rectify={rectifyNum}
        review={reviewNum}
        handleDrawerVisibleChange={handleDrawerVisibleChange}
        style={{ height: HEIGHT, padding: PADDING }}
      />
    </FcSection>
  );
}
