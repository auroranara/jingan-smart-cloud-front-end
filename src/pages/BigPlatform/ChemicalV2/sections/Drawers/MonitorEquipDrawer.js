import React, { PureComponent, Fragment } from 'react';
import { EquipCard, MonitorBtns, CardItem } from '../../components/Components';
import DrawerContainer from '../../components/DrawerContainer';
import { DrawerIcons, MonitorConfig } from '../../utils';

import styles from './MonitorEquipDrawer.less';

export default class MonitorEquipDrawer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      visible,
      onClose,
      monitorMarker: { equipmentTypeName, equipmentType },
      monitorMarker,
      handleShowVideo,
      handleClickShowMonitorDetail,
    } = this.props;
    const { fields, icon, iconStyle, labelStyle, btnStyles } = MonitorConfig[equipmentType] || {};

    return (
      <DrawerContainer
        title={<div className={styles.titleWrapper}>{equipmentTypeName}</div>}
        visible={visible}
        onClose={onClose}
        width={460}
        destroyOnClose={true}
        zIndex={1288}
        icon={DrawerIcons[equipmentType]}
        left={
          <div className={styles.container}>
            {['405', '406'].includes(equipmentType) ? (
              <CardItem
                data={{
                  ...monitorMarker,
                  icon: typeof icon === 'function' ? icon(monitorMarker) : icon,
                }}
                fields={fields}
                iconStyle={iconStyle}
                labelStyle={{ color: '#8198b4', ...labelStyle }}
                fieldsStyle={{ lineHeight: '32px' }}
                style={{ border: 'none' }}
                extraBtn={
                  <Fragment>
                    <MonitorBtns
                      videoList={monitorMarker.videoList}
                      onVideoClick={handleShowVideo}
                      noFinishWarningProcessId={monitorMarker.noFinishWarningProcessId}
                      monitorEquipmentId={monitorMarker.id}
                      style={{ top: 15, ...btnStyles }}
                    />
                  </Fragment>
                }
              />
            ) : (
              <EquipCard
                data={monitorMarker}
                handleShowVideo={handleShowVideo}
                handleClickShowMonitorDetail={handleClickShowMonitorDetail}
                noborder
              />
            )}
          </div>
        }
      />
    );
  }
}
