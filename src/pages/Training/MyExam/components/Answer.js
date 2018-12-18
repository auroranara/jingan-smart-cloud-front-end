import React from 'react';

import { isRight } from '../utils';
import styles from './Answer.less';

const NO_DATA = '略';
const INDEX_MAP = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const COLORS = { 'right': 'rgb(51, 186, 105)', 'wrong': 'rgb(205, 63, 63)' };

export default function Answer(props) {
  const { answer=[], analysis, ...restProps } = props;
  const answerStyle = { color: COLORS[isRight(answer[0], answer[1] || []) ? 'right' : 'wrong'] };

  return (
    <div className={styles.container} {...restProps}>
      <p className={styles.answerContainer}>
        正确答案：<span className={styles.correct}>{answer[0].map(i => INDEX_MAP[i]).join(',') || '/'}</span>
        您选择的答案：<span className={styles.yours} style={answerStyle}>{answer[1] && answer[1].length ? answer[1].map(i => INDEX_MAP[i]).join(',')  : '/'}</span>
      </p>
      <div className={styles.analysis}>
        <p className={styles.analysisTitle}>答案解析：</p>
        <div className={styles.content}>{analysis || NO_DATA}</div>
      </div>
    </div>
  );
}
