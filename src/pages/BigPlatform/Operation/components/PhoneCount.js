import React from 'react';

import styles from './PhoneCount.less';

const DESCES = ['重复拨打', '已接听', '未应答', '呼叫失败'];

export default function PhoneCount(props) {
  const { data: { countCall=0, successCall=0, noResponseCall=0, errorCall=0 }={} } = props;
  return (
    <div className={styles.container}>
      报警电话{countCall ? '已': '未'}拨打
      {!!countCall && (
        <div className={styles.counts}>
          {[countCall, successCall, noResponseCall, errorCall].map((n, i) => (
            <span className={styles.countContainer} key={i}>
              {DESCES[i]}
              <span className={styles.count}>{n}</span>
              次
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
