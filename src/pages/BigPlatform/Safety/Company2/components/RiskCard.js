import React, { PureComponent, Fragment } from 'react';
import Ellipsis from '@/components/Ellipsis';

import styles from './RiskCard.less';

const NO_DATA = '暂无信息';
const STATUS = {
  1: '正常',
  2: '异常',
  3: '待检查',
  4: '已超时',
};
// status === 2 || 4，其他情况为#FFF
const RED = '#FF4848';
const LABEL_STYLE = {
  red: { color: '#fff', backgroundColor: '#FF4848' },
  orange: { color: '#fff', backgroundColor: '#F17A0A' },
  yellow: { color: '#000', backgroundColor: '#FBF719' },
  blue: { color: '#fff', backgroundColor: '#1E60FF' },
  notRated: { color: '#fff', backgroundColor: '#4F6793' },
};
const FLAG_CN = { red: '红', orange: '橙', yellow: '黄', blue: '蓝', notRated: '未评级' };

export default class RiskCard extends PureComponent {
  render() {
    const {
      data: {
        flag,
        item_id: id,
        object_title: name,
        status,
        user_name: checkPerson,
        check_date: checkTime,
      },
    } = this.props;

    return (
      <div className={styles.outer}>
        <div className={styles.riskPointItem}>
          <div
            className={styles.riskPointItemLabel}
            style={LABEL_STYLE[flag]}
          >
            {FLAG_CN[flag]}
          </div>
          <div className={styles.riskPointItemNameWrapper}>
            <div className={styles.riskPointItemName}>风险点</div>
            <div className={styles.riskPointItemValue}><Ellipsis tooltip lines={1} style={{ height: 36 }}>{name || NO_DATA}</Ellipsis></div>
          </div>
          <div className={styles.riskPointItemNameWrapper}>
            <div className={styles.riskPointItemName}>检查人</div>
            <div className={styles.riskPointItemValue}>{checkPerson || NO_DATA}</div>
          </div>
          <div className={styles.riskPointItemNameWrapper}>
            <div className={styles.riskPointItemName}>检查时间</div>
            <div className={styles.riskPointItemValue}>{checkTime || NO_DATA}</div>
          </div>
          <div className={styles.riskPointItemNameWrapper}>
            <div className={styles.riskPointItemName}>状态</div>
            <div className={styles.riskPointItemValue} style={{ color: status === 2 || status === 4 ? RED : '#FFF' }}>
              {STATUS[status]}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
