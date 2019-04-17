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

/**
 * description: 点位巡查统计
 * author: sunkai
 * date: 2018年12月03日
 */
const { Description } = DescriptionList;
// 是否是常州二院
const isCzey = window.PROJECT_CONFIG.projectKey === 'czey_pro';

@connect(({ newUnitFireControl }) => ({
  newUnitFireControl,
}))
export default class CompanyInfo extends PureComponent {
  render() {
    const {
      handleViewCurrentDanger,
      handleCheckDrawer,
      model: {
        companyMessage: {
          companyMessage: { companyName = '', countCheckItem = 0 },
        },
        currentHiddenDanger: { totalNum },
        maintenanceCompany: {
          name: companyNames = [],
          result: userList = [],
          PrincipalName = '', //安全管理员
          PrincipalPhone = '',
        },
      },
    } = this.props;
    // console.log('currentHiddenDanger',this.props.model.currentHiddenDanger);

    // TODO: 为了常州二院过滤掉第一个人
    const newUsers = userList.slice(1, 2);

    return (
      <Section title="单位基本信息" style={{ height: 'auto' }}>
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
                {PrincipalName && (
                  <Description term="安全管理员">
                    <div className={styles.manWrapper} style={{ width: '160px' }}>
                      {PrincipalName}
                      <span className={styles.phone}>{PrincipalPhone}</span>
                    </div>
                  </Description>
                )}
                {isCzey && (
                  <Description term="值班人员">
                    <div className={styles.manWrapper} style={{ width: '160px' }}>
                      朱文琴
                      <span className={styles.phone}>13861080705</span>
                    </div>
                  </Description>
                )}
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
                  {newUsers.map((data, index) => {
                    return (
                      <div className={styles.manWrapper} key={index}>
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
                onClick={handleCheckDrawer}
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
                  <div className={styles.checkNum}>{totalNum}</div>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </Section>
    );
  }
}
