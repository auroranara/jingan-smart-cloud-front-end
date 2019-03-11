import React from 'react';
import MonitorBall from '@/components/MonitorBall';
import Section from '../Section';
import safetyOfficerIcon from '@/assets/icon_safety_officer.png';
import riskPointIcon from '@/assets/icon_risk_point.png';
import specialEquipmentIcon from '@/assets/icon_special_equipment.png';
import currentHiddenDangerIcon from '@/assets/icon_current_hidden_danger.png';
// 引入样式文件
import styles from './index.less';

/**
 * description: 企业信息
 */
export default function CompanyInfo({
  // 模型
  model: {
    companyMessage: {
      companyMessage: {
        // 企业名称
        companyName,
        // 安全负责人
        headOfSecurity,
        // 联系电话
        headOfSecurityPhone,
        // 风险点总数
        countCheckItem,
        // 安全人员总数
        countCompanyUser,
      },
      // 是否是重点企业
      isImportant,
    },
    // 特种设备统计
    specialEquipmentCount,
    // 隐患列表
    hiddenDangerCount: { total = 0 } = {},
    // 安全指数
    safetyIndex,
  },
  // 点击企业名称
  handleClickUnitName,
  // 点击安全指数
  handleClickSafetyIndex,
  // 点击统计数
  handleClickCount,
  // 安全指数是否正在加载中
  loading,
}) {
  // 安全指数图颜色
  const color = safetyIndex >= 80 ? '#00a8ff' : '#ff4848';

  return (
    <Section extra={isImportant && <div className={styles.importantUnit}>重点单位</div>}>
      <div className={styles.container}>
        {/* 企业基本信息 */}
        <div className={styles.top}>
          <div className={styles.table}>
            <div className={styles.unitName} onClick={handleClickUnitName} title={companyName}>
              <div className={styles.cell}>{companyName}</div>
            </div>
            <div className={styles.unitContact} title={`安全负责人：${headOfSecurity}`}>
              <div className={styles.cell}>
                <span className={styles.fieldName}>安全负责人：</span>
                {headOfSecurity}
              </div>
            </div>
            <div className={styles.unitContact} title={`联系方式：${headOfSecurityPhone}`}>
              <div className={styles.cell}>
                <span className={styles.fieldName} style={{ letterSpacing: 4 }}>
                  联系方式：
                </span>
                {headOfSecurityPhone}
              </div>
            </div>
            <div className={styles.emptyRow} />
          </div>
          {/* 安全指数 */}
          {(safetyIndex || safetyIndex === 0) && !loading ? (
            <MonitorBall
              className={styles.safetyIndex}
              style={{ boxShadow: `0 0 2em ${color}` }}
              percentStyle={{ fontSize: 32 }}
              titleStyle={{ fontSize: 12 }}
              height={88}
              color={color}
              percent={safetyIndex}
              title="安全指数"
              onClick={handleClickSafetyIndex}
            />
          ) : null}
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
            className={countCheckItem ? styles.hoverable : undefined}
            style={{ backgroundImage: `url(${riskPointIcon})` }}
            onClick={() => {
              countCheckItem && handleClickCount('riskPoint', { riskPointType: { key: 'status' } });
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

          <div style={{ backgroundImage: `url(${currentHiddenDangerIcon})` }}>
            <div className={styles.countLabel}>
              <div>当前隐患</div>
            </div>
            <div className={styles.countValue}>
              <div>{total}</div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
}
