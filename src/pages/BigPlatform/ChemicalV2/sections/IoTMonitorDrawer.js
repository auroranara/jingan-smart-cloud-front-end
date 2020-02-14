import React, { PureComponent, Fragment } from 'react';
import DrawerContainer from '@/pages/BigPlatform/NewUnitFireControl/components/DrawerContainer';
import { EquipCard } from '../components/Components';
import styles from './IoTMonitorDrawer.less';

export default class IoTMonitorDrawer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      visible,
      onClose,
      list = [],
      handleShowVideo,
      handleClickShowMonitorDetail,
      selectedEquip: { label },
    } = this.props;

    return (
      <DrawerContainer
        title={<div className={styles.titleWrapper}>{label}</div>}
        visible={visible}
        onClose={onClose}
        width={535}
        destroyOnClose={true}
        zIndex={1222}
        left={
          <div className={styles.container}>
            {list.map((item, index) => (
              <EquipCard
                key={index}
                data={item}
                handleShowVideo={handleShowVideo}
                handleClickShowMonitorDetail={handleClickShowMonitorDetail}
              />
            ))}
          </div>
        }
      />
    );
  }
}
