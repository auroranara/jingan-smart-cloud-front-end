import React, { PureComponent } from 'react';

import styles from './TypeCard.less';
import InfoBar from './InfoBar';

export default class TypeCardBody extends PureComponent {
  render() {
    const {
      data: { name, allMonitorParam, videoList },
      url,
      handleShowVideo,
    } = this.props;

    return (
      <div className={styles.body}>
        <h4 className={styles.h4}>
          <span className={styles.label}>监测设备：</span>
          {name}
          {videoList.length > 0 && (
            <span className={styles.camera} onClick={() => handleShowVideo(videoList)} />
          )}
        </h4>
        <div className={styles.bodyInner}>
          <div className={styles.imgContainer}>
            <div className={styles.img} style={{ backgroundImage: `url(${url})` }} />
          </div>
          <div className={styles.info}>
            {allMonitorParam.map((item, index) => (
              <InfoBar data={item} key={index} />
            ))}
          </div>
        </div>
      </div>
    );
  }
}
