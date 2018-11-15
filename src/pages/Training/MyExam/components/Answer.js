import React from 'react';
import styles from './Answer.less';

const NO_DATA = '暂无信息';

export default function Answer(props) {
  const { answer=[], analysis=NO_DATA, ...restProps } = props;

  return (
    <div className={styles.container} {...restProps}>
      <p>
        正确答案：<span className={styles.correct}>{answer[0] || NO_DATA}</span>
        您选择的答案：<span className={styles.yours}>{answer[1] || '未选择'}</span>
      </p>
      <div className={styles.analysis}>
        <p className={styles.analysisTitle}>答案解析：</p>
        <div className={styles.content}>{analysis}</div>
      </div>
    </div>
  );
}
