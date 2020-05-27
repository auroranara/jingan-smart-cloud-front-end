import React, { PureComponent, Fragment } from 'react';
import { EquipCard, FlameOrToxic, DrawerContainer } from '../../components/Components';
// import DrawerContainer from '../../components/DrawerContainer';
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
              <FlameOrToxic
                data={monitorMarker}
                handleShowVideo={handleShowVideo}
                handleClickShowMonitorDetail={handleClickShowMonitorDetail}
                noBorder
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
