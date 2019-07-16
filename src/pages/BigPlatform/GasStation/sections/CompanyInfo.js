import React, { PureComponent } from 'react';
import { Row, Col } from 'antd';
import { connect } from 'dva';

import { vaguePhone } from '@/pages/BigPlatform/NewUnitFireControl/utils';
import { Section } from './Components';
import DescriptionList from '@/components/DescriptionList';
import styles from './CompanyInfo.less';
import { iconCheck, iconCompany, iconHd, iconMaintenance } from '../imgs/links';

const { Description } = DescriptionList;

function Hint(props) {
  const { labels=['超期', '总数'] } = props;
  return (
    <div className={styles.hint}>
      <p>
        <span className={styles.redDot} />
        {labels[0]}
      </p>
      <p>
        <span className={styles.cyanDot} />
        {labels[1]}
      </p>
    </div>
  );
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
          PrincipalName = '', //安全管理员
          PrincipalPhone = '',
        },
      },
      phoneVisible,
    } = this.props;

    return (
      <Section title="单位基本信息" style={{ height: 'auto' }} scrollStyle={{ overflow: 'visible' }}>
        <div className={styles.companyInfo}>
          <div className={styles.infoWrapper}>
            <div
              className={styles.iconInfo}
              style={{ backgroundImage: `url(${iconCompany})` }}
            />
            <div className={styles.info}>
              <div className={styles.companyName}>{companyName}</div>
              <DescriptionList col={1}>
                {PrincipalName && (
                  <Description term="安全管理员">
                    <div className={styles.manWrapper}>
                      {PrincipalName}
                      <br/>
                      <span className={styles.phone}>
                        {vaguePhone(PrincipalPhone, phoneVisible)}
                      </span>
                    </div>
                  </Description>
                )}
              </DescriptionList>
            </div>
          </div>
          <div className={styles.divider} />
          <div className={styles.icons}>
            <div
              className={styles.iconItem}
              onClick={handleCheckDrawer}
            >
              <div
                className={styles.icon}
                style={{ backgroundImage: `url(${iconCheck})` }}
              />
              <div className={styles.iconDesc}>
                检查点
                <div className={styles.checkNum}>
                  <span className={styles.outdate}>3</span>
                  <span className={styles.slash}>/</span>
                  {countCheckItem}
                  <Hint />
                </div>
              </div>
            </div>
            <div
              className={styles.iconItem}
              onClick={handleViewCurrentDanger}
            >
              <div
                className={styles.icon}
                style={{
                  backgroundImage: `url(${iconHd})`,
                }}
              />
              <div className={styles.iconDesc}>
                当前隐患
                <div className={styles.checkNum}>
                  <span className={styles.outdate}>333</span>
                  <span className={styles.slash}>/</span>
                  {totalNum}
                  <Hint labels={['超期', '当前']} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>
    );
  }
}
