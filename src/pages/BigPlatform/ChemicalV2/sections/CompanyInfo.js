import React, { PureComponent } from 'react';
import { connect } from 'dva';
import Section from '@/pages/BigPlatform/Safety/Company3/components/Section';
import safetyOfficerIcon from '@/assets/icon_safety_officer.png';
import riskPointIcon from '@/assets/icon_risk_point.png';
import specialEquipmentIcon from '@/assets/icon_special_equipment.png';
import currentHiddenDangerIcon from '@/assets/icon_current_hidden_danger.png';
// 引入样式文件
import styles from './CompanyInfo.less';

/**
 * description: 企业信息
 */
@connect(({ unitSafety, loading }) => ({
  unitSafety,
  loading: loading.effects['unitSafety/fetchSafetyIndex'],
}))
export default class CompanyInfo extends PureComponent {
  render () {
    const {
      handleClickCount,
      data: {
        // 特种设备统计
        specialEquipmentCount,
      },
      unitSafety: {
        companyMessage: {
          companyMessage: {
            // 企业名称
            companyName,
            // 安全管理员
            headOfSecurity,
            // 联系电话
            headOfSecurityPhone,
            // 风险点总数
            countCheckItem,
          },
          // 是否是重点企业
          isImportant,
        },
        // 安全人员
        safetyOfficer: { valueList = [] } = {},
        // 特种设备统计
        // specialEquipmentCount,
        // 隐患列表
        hiddenDangerCount: { total = 0 } = {},
        // 安全指数
        safetyIndex,
        // 手机号是否可见
        phoneVisible,
      },
    } = this.props;
    const countCompanyUser = (valueList || []).reduce((total, value) => {
      return total + (value ? value.length : 0);
    }, 0);
    const phone = headOfSecurityPhone;
    // phoneVisible || !headOfSecurityPhone
    //   ? headOfSecurityPhone
    //   : `${headOfSecurityPhone}`.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');

    return (
      <Section extra={isImportant && <div className={styles.importantUnit}>重点单位</div>}>
        <div className={styles.container}>
          {/* 企业基本信息 */}
          <div className={styles.top}>
            <div className={styles.table}>
              <div className={styles.unitName} title={companyName}>
                <div className={styles.cell}>{companyName}</div>
              </div>
              <div className={styles.unitContact} title={`安全管理员：${headOfSecurity}`}>
                <div className={styles.cell}>
                  <span className={styles.fieldNameWrapper}>
                    <span className={styles.fieldName}>安全管理员</span>：
                  </span>
                  {headOfSecurity}
                </div>
              </div>
              <div className={styles.unitContact} title={`联系方式：${phone}`}>
                <div className={styles.cell}>
                  <span className={styles.fieldNameWrapper}>
                    <span className={styles.fieldName} style={{ letterSpacing: '0.333333em' }}>
                      联系方式
                    </span>
                    ：
                  </span>
                  {phone}
                </div>
              </div>
              <div className={styles.emptyRow} />
            </div>
          </div>

          {/* 统计信息 */}
          <div className={styles.bottom}>
            <div
              className={countCompanyUser ? styles.hoverable : undefined}
              style={{ backgroundImage: `url(${safetyOfficerIcon})` }}
              onClick={() => {
                countCompanyUser && handleClickCount('safetyOfficer');
              }}
            >
              <div className={styles.countLabel}>
                <div>安全人员</div>
              </div>
              <div className={styles.countValue}>
                <div>{countCompanyUser}</div>
              </div>
            </div>

            <div
              className={styles.hoverable}
              style={{ backgroundImage: `url(${currentHiddenDangerIcon})` }}
              onClick={() => {
                total && handleClickCount('currentHiddenDanger');
              }}
            >
              <div className={styles.countLabel}>
                <div>当前隐患</div>
              </div>
              <div className={styles.countValue}>
                <div>{total}</div>
              </div>
            </div>

            <div
              className={specialEquipmentCount ? styles.hoverable : undefined}
              style={{ backgroundImage: `url(${specialEquipmentIcon})` }}
              onClick={() => {
                specialEquipmentCount && handleClickCount('specialEquipment');
              }}
            >
              <div className={styles.countLabel}>
                <div>特种设备</div>
              </div>
              <div className={styles.countValue}>
                <div>{specialEquipmentCount}</div>
              </div>
            </div>

            <div
              className={countCheckItem ? styles.hoverable : undefined}
              style={{ backgroundImage: `url(${riskPointIcon})` }}
              onClick={() => {
                countCheckItem &&
                  handleClickCount('riskPoint', { riskPointType: { key: 'status' } });
              }}
            >
              <div className={styles.countLabel}>
                <div>
                  风险点
                  <span style={{ opacity: 0 }}>隐</span>
                </div>
              </div>
              <div className={styles.countValue}>
                <div>{countCheckItem}</div>
              </div>
            </div>
          </div>
        </div>
      </Section>
    );
  }
}
