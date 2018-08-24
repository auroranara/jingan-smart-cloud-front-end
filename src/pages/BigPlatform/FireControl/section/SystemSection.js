import React from 'react';
import { Col, Row } from 'antd';

import FcSection from './FcSection';
import ProgressBar from '../components/ProgressBar';
import styles from './SystemSection.less';
import hostIcon from '../img/host.png';

function UnitCard(props) {
  const { company, hostNum } = props;
  return (
    <Row style={{ borderBottom: '1px solid rgb(54, 129, 199)' }}>
      <Col span={16}><p className={styles.unitCard}>{company}</p></Col>
      <Col span={8}><p className={styles.unitCard}>{hostNum}</p></Col>
    </Row>
  );
}

// const systemUint = [...Array(5).keys()].map(i => ({ company: '无锡晶安智慧科技有限公司', hostNum: Math.floor(Math.random() * 10) }));

export default function SystemSection(props) {
  const { total = 0, activeCount = 0, deviceCount = 0, companyList = [] } = props.sysData;
  const percent = total ? Math.floor(activeCount / total * 100) : 0;

  return (
    <FcSection title="系统接入" style={{ padding: '0 15px 15px' }}>
      <Row>
        <Col span={12}>
          <div className={styles.left}>
            <p className={styles.unit}>接入单位<span className={styles.percent}>{`${percent}%`}</span></p>
            <ProgressBar width="90%" height={10} progress={percent} />
            <p className={styles.unitNumber}>{`${activeCount}/${total}`}</p>
          </div>
        </Col>
        <Col span={12}>
          <div className={styles.right}>
            {/* <span className={styles.hostIcon} /> */}
            <span className={styles.hostIcon} style={{ backgroundImage: `url(${hostIcon})` }} />
            <p className={styles.host}>消防主机</p>
            <p className={styles.hostNumber}>{deviceCount}</p>
          </div>
        </Col>
      </Row>
      <div className={styles.table} style={{ height: 'calc(100% - 180px)' }}>
        <Row style={{ borderBottom: '1px solid rgb(54, 129, 199)' }}>
          <Col span={16}><p className={styles.tableTitle}>接入单位</p></Col>
          <Col span={8}><p className={styles.tableTitle}>主机数量</p></Col>
        </Row>
        <div style={{ overflow: 'auto', height: 'calc(100% - 42px)'}}>
          {companyList.map(({ name, count }, index) => <UnitCard key={index} company={name} hostNum={count} /> )}
        </div>
      </div>
    </FcSection>
  );
}
