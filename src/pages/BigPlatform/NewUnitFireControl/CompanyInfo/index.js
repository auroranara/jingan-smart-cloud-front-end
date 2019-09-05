import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import { connect } from 'dva';
import { vaguePhone } from '../utils';
import { Section2 as CustomSection } from '@/jingan-components/CustomSection';
import Ellipsis from '@/components/Ellipsis';

import iconCompany from '@/assets/icon-company.png';
import iconMaintenance from '@/assets/icon-maintenance.png';
import iconHd from '@/assets/icon-hidden-danger.png';
import iconCheck from '@/assets/icon-check.png';
import DescriptionList from 'components/DescriptionList';
import styles from './index.less';

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
      phoneVisible,
    } = this.props;

    // TODO: 为了常州二院过滤掉第一个人
    const newUsers = userList
      .filter(user => {
        return user.userName !== '万胜邦';
      })
      .slice(0, 1);

    return (
      <CustomSection
        className={styles.container}
        title="单位基本信息"
      >
        <div className={styles.wrapper}>
          <div className={styles.top}>
            <div className={styles.topIcon} style={{ backgroundImage: `url(${iconCompany})` }} />
            <div className={styles.topContent}>
              <div className={styles.companyName}><Ellipsis lines={1} tooltip>{companyName}</Ellipsis></div>
              {PrincipalName && (
                <div className={styles.person}>安全管理员：{PrincipalName}&nbsp;&nbsp;{vaguePhone(PrincipalPhone, phoneVisible)}</div>
              )}
              {isCzey && (
                <div className={styles.person}>值班人员：朱文琴&nbsp;&nbsp;{vaguePhone('13861080705', phoneVisible)}</div>
              )}
            </div>
          </div>

          <div className={styles.center}>
            <div className={styles.centerIcon} style={{ backgroundImage: `url(${iconMaintenance})` }} />
              <div className={styles.topContent}>
                <div className={styles.maintenanceCompany}>维保单位：{companyNames.map(data => data.name).join('，')}</div>
                <div className={styles.maintenancePeople}>
                  <div>维保人员：</div>
                  <div>
                    {newUsers.map(({ userName, phoneNumber }) => {
                      return (
                        <div className={styles.maintenancePerson} key={phoneNumber}>
                          {userName}&nbsp;&nbsp;{vaguePhone(phoneNumber, phoneVisible)}
                        </div>
                      );
                    })}
                  </div>
                </div>
            </div>
          </div>

          <div className={styles.bottom}>
            <div className={styles.bottomItem} onClick={handleCheckDrawer}>
              <div className={styles.bottomItemIcon} style={{ backgroundImage: `url(${iconCheck})` }} />
              <div className={styles.bottomItemContent}>
                <div className={styles.bottomItemLabel}>检查点</div>
                <div className={styles.bottomItemValue}>{countCheckItem}</div>
              </div>
            </div>
            <div className={styles.bottomItem} onClick={handleViewCurrentDanger}>
              <div className={styles.bottomItemIcon} style={{ backgroundImage: `url(${iconCheck})` }} />
              <div className={styles.bottomItemContent}>
                <div className={styles.bottomItemLabel}>当前隐患</div>
                <div className={styles.bottomItemValue}>{totalNum}</div>
              </div>
            </div>
          </div>
          {/* <div className={styles.infoWrapper}>
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
                    <div className={styles.manWrapper} style={{ width: '165px' }}>
                      {PrincipalName}
                      <span className={styles.phone}>
                        {vaguePhone(PrincipalPhone, phoneVisible)}
                      </span>
                    </div>
                  </Description>
                )}
                {isCzey && (
                  <Description term="值班人员">
                    <div className={styles.manWrapper} style={{ width: '165px' }}>
                      朱文琴
                      <span className={styles.phone}>
                        {vaguePhone('13861080705', phoneVisible)}
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
                        {data.userName}
                        <span className={styles.phone}>
                          {vaguePhone(data.phoneNumber, phoneVisible)}
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
          </Row> */}
        </div>
      </CustomSection>
    );
  }
}
