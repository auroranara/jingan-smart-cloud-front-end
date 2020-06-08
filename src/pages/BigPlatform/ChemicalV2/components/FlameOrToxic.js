import React, { PureComponent, Fragment } from 'react';
import { MonitorBtns, CardItem } from './Components';
import { MonitorConfig } from '../utils';

import styles from './FlameOrToxic.less';

export default class FlameOrToxic extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      data: { equipmentType, beMonitorTargetType, targetId, beMonitorTargetName },
      data,
      handleShowVideo,
      handleClickShowMonitorDetail,
      noBorder,
    } = this.props;
    const { fields = [], icon, iconStyle, labelStyle, btnStyles } =
      MonitorConfig[equipmentType] || {};

    return (
      <div className={styles.container} style={{ border: noBorder ? 'none' : undefined }}>
        <CardItem
          data={{
            ...data,
            icon: typeof icon === 'function' ? icon(data) : icon,
          }}
          fields={fields}
          iconStyle={iconStyle}
          labelStyle={{ color: '#8198b4', ...labelStyle }}
          fieldsStyle={{ lineHeight: '32px' }}
          style={{ border: 'none' }}
          extraBtn={
            <Fragment>
              <MonitorBtns
                videoList={data.videoList}
                onVideoClick={handleShowVideo}
                noFinishWarningProcessId={data.noFinishWarningProcessId}
                monitorEquipmentId={data.id}
                style={{ top: 15, ...btnStyles }}
              />
            </Fragment>
          }
        />
        {beMonitorTargetType &&
          targetId && (
            <div className={styles.wrapper}>
              <div className={styles.targetWrapper}>
                <span className={styles.label}>监测对象：</span>
                {beMonitorTargetName}
                <div
                  className={styles.more}
                  onClick={() => handleClickShowMonitorDetail(beMonitorTargetType, targetId)}
                >
                  详情>>
                </div>
              </div>
            </div>
          )}
      </div>
    );
  }
}
