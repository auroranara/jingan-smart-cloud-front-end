import React, { PureComponent } from 'react';
import { Tooltip } from 'antd';
import styles from './TypeCard.less';
import InfoBar from './InfoBar';

export default class TypeCardBody extends PureComponent {
  render() {
    const {
      data: { name, allMonitorParam, videoList },
      url,
      icon,
      handleShowVideo,
    } = this.props;

    return (
      <div className={styles.body}>
        <h4 className={styles.h4}>
          <span className={styles.label}>监测设备：</span>
          {name}
          {videoList.length > 0 && (
            <Tooltip placement="bottom" title={'摄像头'} overlayStyle={{ zIndex: 9999 }}>
              <span className={styles.camera} onClick={() => handleShowVideo(videoList)} />
            </Tooltip>
          )}
        </h4>
        <div className={styles.bodyInner}>
          <div className={styles.imgContainer}>
            {icon ? (
              icon
            ) : (
              <div className={styles.img} style={{ backgroundImage: `url(${url})` }} />
            )}
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
