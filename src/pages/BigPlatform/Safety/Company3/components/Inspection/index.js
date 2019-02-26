import React from 'react';
import moment from 'moment';
// 引入样式文件
import styles from './index.less';

/**
 * description: 巡查
 */
export default function Inspection({
  style,
  data: {
    // 状态
    status,
    check_user_names,
    check_date,
    data: {
      finish=0,
      overTime=0,
      rectifyNum=0,
      reviewNum=0,
    }={},
  }={},
}) {
  // 是否为正常
  const isNormal = +status === 1;

  return (
    <div className={styles.item} style={style}>
      <div className={`${styles.itemRow} ${styles.itemPadding}`}>
        <div className={styles.itemCol}>
          <div className={styles.itemLabel}>巡查日期：</div>
          <div className={styles.itemValue}>{check_date && moment(check_date).format('YYYY-MM-DD')}</div>
        </div>
        <div className={styles.itemCol}>
          <div className={styles.itemLabel}>巡查人：</div>
          <div className={styles.itemValue}>{check_user_names}</div>
        </div>
      </div>
      <div className={`${styles.itemRow} ${styles.itemPadding}`}>
        <div className={styles.itemCol}>
          <div className={styles.itemLabel}>巡查结果：</div>
          <div className={styles.itemValue}>{isNormal?'正常':<span className={styles.abnormal}>异常</span>}</div>
        </div>
      </div>
      <div className={`${styles.itemRow} ${styles.itemPadding}`}>
        <div className={styles.itemCol}>
          <div className={styles.itemLabel}>处理结果：</div>
          <div className={`${styles.itemValue} ${styles.itemRow}`}>
            {overTime !== 0 && (
              <div className={styles.itemResult}>
                <div className={styles.itemPoint} style={{ backgroundColor: '#f83329' }} />
                <div className={styles.itemResultLabel}>已超期</div>
                {overTime}
              </div>
            )}
            {rectifyNum !== 0 && (
              <div className={styles.itemResult}>
                <div className={styles.itemPoint} style={{ backgroundColor: '#ffb400' }} />
                <div className={styles.itemResultLabel}>待整改</div>
                {rectifyNum}
              </div>
            )}
            {reviewNum !== 0 && (
              <div className={styles.itemResult}>
                <div className={styles.itemPoint} style={{ backgroundColor: '#00a8ff' }} />
                <div className={styles.itemResultLabel}>待复查</div>
                {reviewNum}
              </div>
            )}
            {finish !== 0 && (
              <div className={styles.itemResult}>
                <div className={styles.itemPoint} style={{ backgroundColor: '#9f9f9f' }} />
                <div className={styles.itemResultLabel}>已关闭</div>
                {finish}
              </div>
            )}
            {overTime + rectifyNum + reviewNum + finish === 0 && (
              <div className={styles.itemResult}>——</div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
