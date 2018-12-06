import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import { connect } from 'dva';

import Section from '../Section';
import DescriptionList from 'components/DescriptionList';
import styles from './index.less';
import iconCompany from '@/assets/icon-company.png';
import iconMaintenance from '@/assets/icon-maintenance.png';
import iconHd from '@/assets/icon-hidden-danger.png';
import iconCheck from '@/assets/icon-check.png';

import CheckingDrawer from '../Section/CheckingDrawer';

/**
 * description: 点位巡查统计
 * author: sunkai
 * date: 2018年12月03日
 */
const { Description } = DescriptionList;

@connect(({ newUnitFireControl }) => ({
  newUnitFireControl,
}))
export default class CompanyInfo extends PureComponent {
  state = {
    checkDrawerVisible: false, // 检查点弹框
  };

  handleCheckDrawer = () => {
    const { dispatch, companyId } = this.props;
    dispatch({
      type: 'newUnitFireControl/fetchCheckCount',
      payload: {
        companyId,
        item_type: 2,
      },
    });
    this.setState({
      checkDrawerVisible: true,
    });
  };

  render() {
    const { checkDrawerVisible } = this.state;
    console.log(this.props);

    const {
      handleViewCurrentDanger,
      model: {
        companyMessage: {
          companyMessage: {
            companyName = '',
            headOfSecurity = '',
            headOfSecurityPhone = '',
            countCheckItem = 0,
          },
        },
        riskDetailList: { ycq = [], wcq = [], dfc = [] },
        maintenanceCompany: { name: companyNames = [], result: userList = [] },
      },
      checkCount,
      checkList,
      companyId,
      pointRecordList,
    } = this.props;

    const hiddenDanger = ycq.length + wcq.length + dfc.length;
    const newUsers = userList.splice(0, 2);

    return (
      <Section title="企业基本信息" style={{ height: 'auto' }}>
        <div className={styles.companyInfo}>
          <div className={styles.infoWrapper}>
            <div
              className={styles.iconInfo}
              style={{
                background: `url(${iconCompany}) no-repeat center 8px`,
                backgroundSize: '65% auto',
              }}
            />
            <div className={styles.infoWrapper} style={{ marginTop: '8px' }}>
              <div className={styles.companyName}>{companyName}</div>
              <DescriptionList col={1}>
                <Description term="主要负责人">
                  <div className={styles.manWrapper} style={{ width: '145px' }}>
                    {headOfSecurity}
                    <span className={styles.phone}>{headOfSecurityPhone}</span>
                  </div>
                </Description>
              </DescriptionList>
            </div>
          </div>

          <div className={styles.divider} style={{ marginTop: '20px' }} />

          <div className={styles.infoWrapper}>
            <div
              className={styles.iconInfo}
              style={{
                background: `url(${iconMaintenance}) no-repeat center 8px`,
                backgroundSize: '65% auto',
              }}
            />
            <div className={styles.infoWrapper} style={{ marginTop: '15px', marginBottom: '5px' }}>
              <DescriptionList col={1}>
                <Description term="维保单位">
                  {companyNames.map(data => data.name).join(',')}
                </Description>
                <Description term="维保人员">
                  {newUsers.map(data => {
                    return (
                      <div className={styles.manWrapper}>
                        {data.userName}
                        <span className={styles.phone}>{data.phoneNumber}</span>
                      </div>
                    );
                  })}
                </Description>
              </DescriptionList>
            </div>
          </div>

          <div className={styles.divider} style={{ marginTop: '10px' }} />

          <Row>
            <Col span={12}>
              <div
                className={styles.infoWrapper}
                style={{ width: '120px', margin: '5px auto', cursor: 'pointer' }}
                onClick={() => this.handleCheckDrawer()}
              >
                <div
                  className={styles.iconInfo}
                  style={{
                    background: `url(${iconCheck}) no-repeat center center`,
                    backgroundSize: '95% auto',
                  }}
                />
                <div
                  className={styles.infoWrapper}
                  style={{ marginTop: '10px', marginLeft: '8px' }}
                >
                  检查点
                  <div className={styles.checkNum}>{countCheckItem}</div>
                </div>
              </div>
            </Col>

            <Col span={12}>
              <div
                className={styles.infoWrapper}
                onClick={handleViewCurrentDanger}
                style={{ width: '120px', margin: '5px auto', cursor: 'pointer' }}
              >
                <div
                  className={styles.iconInfo}
                  style={{
                    background: `url(${iconHd}) no-repeat center center`,
                    backgroundSize: '95% auto',
                  }}
                />
                <div
                  className={styles.infoWrapper}
                  style={{ marginTop: '10px', marginLeft: '8px' }}
                >
                  当前隐患
                  <div className={styles.checkNum}>{hiddenDanger}</div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
        <CheckingDrawer
          visible={checkDrawerVisible}
          companyId={companyId}
          checkCount={checkCount}
          checkList={checkList}
          pointRecordList={pointRecordList}
          onClose={() => {
            this.setState({
              checkDrawerVisible: false,
            });
          }}
        />
      </Section>
    );
  }
}
