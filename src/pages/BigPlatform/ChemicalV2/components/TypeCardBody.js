import React, { PureComponent } from 'react';

import styles from './TypeCard.less';
import InfoBar from './InfoBar';

export default class TypeCardBody extends PureComponent {
  render() {
    const { data: { name, paramList }, url } = this.props;

    return (
      <div className={styles.body}>
        <h4 className={styles.h4}>
          <span className={styles.label}>监测设备：</span>{name}
          <span className={styles.camera} />
        </h4>
        <div className={styles.bodyInner}>
          <div className={styles.imgContainer}>
            <div className={styles.img} style={{ backgroundImage: `url(${url})` }} />
          </div>
          <div className={styles.info}>
            {paramList.map(item => <InfoBar data={item} />)}
          </div>
        </div>
      </div>
    );
  }
}
