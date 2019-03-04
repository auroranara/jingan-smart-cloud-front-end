import React, { PureComponent } from 'react';

import LastImg from './last.png';
import styles from './cards.less';

export default class Card extends PureComponent {
  renderItem = () => {
    const { contentList } = this.props;
    return contentList.map(({ label, value }, index) => (
      <div className={styles.line} key={index}>
        <span className={styles.label}>{label} :</span>
        <span className={styles.value}>{value}</span>
      </div>
    ));
  };

  render() {
    const { status } = this.props;
    return (
      <div className={styles.card}>
        <div className={styles.contentContainer}>
          <div className={styles.content}>{this.renderItem()}</div>
        </div>
        {+status === 1 && (
          <div
            className={styles.statusLogo}
            style={{
              top: '20px',
              right: '20px',
            }}
          >
            <img src={LastImg} style={{ width: '100%', height: '100%' }} alt="status" />
          </div>
        )}
      </div>
    );
  }
}
