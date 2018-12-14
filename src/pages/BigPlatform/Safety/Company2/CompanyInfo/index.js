import React, { PureComponent } from 'react';
import Section from '@/components/Section';
import Ellipsis from '@/components/Ellipsis';
import importantIcon from '../../img/importantCompany.png';

import styles from './index.less';

/* 图片地址前缀 */
const iconPrefix = 'http://data.jingan-china.cn/v2/big-platform/safety/com/';
/* 图片 */
const unitIcon = `${iconPrefix}unitIcon.png`;
const peopleIcon = `${iconPrefix}people-icon.png`;
const checkIcon = `${iconPrefix}check-icon.png`;
const specialIcon = `${iconPrefix}special-icon.png`;
const hdIcon = `${iconPrefix}hd-icon.png`;

/**
 * description: 企业信息
 * author: sunkai
 * date: 2018年12月10日
 */
export default class CompanyInfo extends PureComponent {
  render() {
    const {
      // 样式
      style,
      // 类名
      className,
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
          // 四色图
          fourColorImg=[],
        },
        // 特种设备统计
        specialEquipmentCount,
        // 隐患列表
        hiddenDangerList: { ycq = [], wcq = [], dfc = [] },
      },
      // 点击企业名称
      handleClickUnitName,
      // 点击统计数
      handleClickCount,
      // 当前隐患弹出框是否可见
      currentHiddenDangerVisible,
      // 点击当前隐患统计
      handleClickCurrentHiddenDanger,
    } = this.props;
    // 计算当前隐患总数
    const hiddenDangerCount = ycq.length + wcq.length + dfc.length;
    // 安全人员统计是否可以点击
    const isPersonCountClickable = +countCompanyUser !== 0;
    // 风险点统计是否可以点击
    const isPointCountClickable = +countCheckItem !== 0;
    // 当前隐患统计是否可以点击
    const isHiddenDangerCountClickable = +hiddenDangerCount !== 0 && fourColorImg.length > 0 && !currentHiddenDangerVisible;

    return (
      <Section className={className} style={style}>
        <div className={styles.container}>
          {/* 企业基本信息 */}
          <div className={styles.top} style={{ backgroundImage: `url(${unitIcon})` }}>
            <div onClick={handleClickUnitName}>
              <Ellipsis lines={1} /* tooltip */>{companyName}</Ellipsis>
            </div>
            <div>
              <Ellipsis lines={1} /* tooltip */>
                <span className={styles.fieldName} style={{ flex: 'none' }}>安全负责人：</span>
                {headOfSecurity}
              </Ellipsis>
            </div>
            <div style={{ position: 'relative' }}>
              <Ellipsis lines={1} /* tooltip */>
                <span className={styles.fieldName}>联系方式：</span>
                {headOfSecurityPhone}
              </Ellipsis>
              {/* 是否是重点单位 */}
              {isImportant && (
                <div className={styles.importantUnit} style={{ backgroundImage: `url(${importantIcon})` }} />
              )}
            </div>
          </div>
          {/* 统计信息 */}
          <div className={styles.bottom}>
            <div
              className={isPersonCountClickable ? styles.hoverable : undefined}
              style={{ backgroundImage: `url(${peopleIcon})` }}
              onClick={isPersonCountClickable ? () => {handleClickCount('safetyOfficer');} : undefined}
            >
              <div className={styles.countLabel}><Ellipsis lines={1} /* tooltip */>安全人员</Ellipsis></div>
              <div className={styles.countValue}><Ellipsis lines={1} /* tooltip */>{countCompanyUser}</Ellipsis></div>
            </div>

            <div
              className={isPointCountClickable ? styles.hoverable : undefined}
              style={{ backgroundImage: `url(${checkIcon})` }}
              onClick={isPointCountClickable ? () => {handleClickCount('riskPoint', { riskPointType: { key: 'status' } });} : undefined}
            >
              <div className={styles.countLabel}><Ellipsis lines={1} /* tooltip */>风险点</Ellipsis></div>
              <div className={styles.countValue}><Ellipsis lines={1} /* tooltip */>{countCheckItem}</Ellipsis></div>
            </div>

            <div style={{ backgroundImage: `url(${specialIcon})` }}>
              <div className={styles.countLabel}><Ellipsis lines={1} /* tooltip */>特种设备</Ellipsis></div>
              <div className={styles.countValue}><Ellipsis lines={1} /* tooltip */>{specialEquipmentCount}</Ellipsis></div>
            </div>

            <div
              className={isHiddenDangerCountClickable ? styles.hoverable : undefined}
              style={{ backgroundImage: `url(${hdIcon})` }}
              onClick={isHiddenDangerCountClickable ? handleClickCurrentHiddenDanger : undefined}
            >
              <div className={styles.countLabel}><Ellipsis lines={1} /* tooltip */>当前隐患</Ellipsis></div>
              <div className={styles.countValue}><Ellipsis lines={1} /* tooltip */>{hiddenDangerCount}</Ellipsis></div>
            </div>
          </div>
        </div>
      </Section>
    );
  }
}
