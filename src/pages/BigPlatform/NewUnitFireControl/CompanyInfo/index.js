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

const { projectKey } = global.PROJECT_CONFIG;
const isVague = projectKey.indexOf('czey') >= 0 || projectKey.indexOf('test') >= 0;
function nameToVague(str) {
  let newStr = '';
  if (str && str.length === 1) return str;
  else if (str && str.length === 2) {
    newStr = str.substr(0, 1) + '*';
  } else if (str && str.length > 2) {
    newStr = str.substr(0, 1) + '*' + str.substr(-1);
  } else return str;
  return newStr;
}

function phoneToVague(str) {
  if (!str) return str;
  const newStr = str.substr(0, 3) + '****' + str.substr(-4);
  return newStr;
}

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
          PrincipalName = '',
          PrincipalPhone = '',
        },
      },
    } = this.props;
    // console.log('currentHiddenDanger',this.props.model.currentHiddenDanger);

    const newUsers = userList.slice(0, 2);

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
                  <Description term="主要负责人">
                    <div className={styles.manWrapper} style={{ width: '145px' }}>
                      {isVague ? nameToVague(PrincipalName) : PrincipalName}
                      <span className={styles.phone}>
                        {isVague ? phoneToVague(PrincipalPhone) : PrincipalPhone}
                      </span>
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
                        {isVague ? nameToVague(data.userName) : data.userName}
                        <span className={styles.phone}>
                          {isVague ? phoneToVague(data.phoneNumber) : data.phoneNumber}
                        </span>
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
