import React, { PureComponent } from 'react';
import { Col, Row, Table } from 'antd';

import FcSection from './FcSection';
import ProgressBar from '../components/ProgressBar';
import styles from './SystemSection.less';
import hostIcon from '../img/host.png';

function UnitCard(props) {
  const { index, comanyId, companyName, hostNum, isFire, isScroll, handleClick } = props;
  return (
    <Row style={{ borderBottom: '1px solid rgb(9, 103, 211)', paddingRight: isScroll ? 0 : 8 }}>
      <Col span={16}>
        <p className={styles.unitCard}>
          <a
            className={styles.link}
            href={`${window.publicPath}#/big-platform/fire-control/company/${comanyId}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {companyName}
          </a>
        </p>
      </Col>
      <Col span={4}>
        <p className={styles.unitCard}>{hostNum}</p>
      </Col>
      <Col span={4}>
        <p
          className={styles[isFire ? 'fire' : 'unitCard']}
          onClick={() => handleClick(index)}
        >
          {isFire ? '报警' : '正常'}
        </p>
      </Col>
    </Row>
  );
}

// const systemUint = [...Array(5).keys()].map(i => ({ company: '无锡晶安智慧科技有限公司', hostNum: Math.floor(Math.random() * 10) }));

// const COLUMNS = [{
//   title: '接入单位',
//   dataIndex: 'name',
//   key: 'name',
// }, {
//   title: '主机数量',
//   dataIndex: 'count',
//   key: 'count',
// }, {
//   title: '状态',
//   dataIndex: 'isFire',
//   key: 'isFire',
// }];

export default class SystemSection extends PureComponent {
  state = { isScroll: false };

  componentDidUpdate() {
    this.changePadding();
  }

  container = null;

  changePadding = () => {
    const container = this.container;
    let isScroll = false;
    if (container && container.offsetHeight < container.scrollHeight)
      isScroll = true;
    this.setState({ isScroll });
  };

  render() {
    const {
      data: { total = 0, activeCount = 0, deviceCount = 0, companyList = [] },
      handleClick,
    } = this.props;
    const { isScroll } = this.state;

    const percent = total ? Math.floor((activeCount / total) * 100) : 0;

    return (
      <FcSection title="系统接入" style={{ padding: '0 15px 15px' }}>
        <Row>
          <Col span={12}>
            <div className={styles.left}>
              <p className={styles.unit}>
                接入单位
                <span className={styles.percent}>{`${percent}%`}</span>
              </p>
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
          {/* <Row style={{ borderBottom: '1px solid rgb(9, 103, 211)' }}> */}
          <Row style={{ borderBottom: '1px solid rgb(9, 103, 211)', backgroundColor: 'rgba(9, 71, 146, 0.5)', paddingRight: 8 }}>
            <Col span={16}>
              <p className={styles.tableTitle}>接入单位</p>
            </Col>
            <Col span={4}>
              <p className={styles.tableTitle}>主机数量</p>
            </Col>
            <Col span={4}>
              <p className={styles.tableTitle}>状态</p>
            </Col>
          </Row>
          <div style={{ overflow: 'auto', height: 'calc(100% - 42px)' }} ref={dom => this.container = dom}>
            {companyList.map(({ companyId, name, count, isFire }, index) => (
              <UnitCard
                key={companyId}
                index={index}
                companyName={name}
                hostNum={count}
                comanyId={companyId}
                isFire={Number(isFire)}
                isScroll={isScroll}
                handleClick={handleClick}
              />
            ))}
          </div>
          {/* <Table
            rowKey="companyId"
            columns={COLUMNS}
            dataSource={companyList}
          /> */}
        </div>
      </FcSection>
    );
  }
}
