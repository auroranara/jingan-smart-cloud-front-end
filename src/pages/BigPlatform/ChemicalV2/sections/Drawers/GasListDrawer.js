import React, { PureComponent, Fragment } from 'react';
import moment from 'moment';
import DrawerContainer from '@/pages/BigPlatform/NewUnitFireControl/components/DrawerContainer';
import { CardItem, FlameOrToxic } from '../../components/Components';
import { MonitorConfig } from '../../utils';
import styles from './MonitorDrawer.less';
import iconAlarm from '@/assets/icon-alarm.png';

export default class GasListDrawer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      visible,
      onClose,
      monitorData,
      handleClickMonitorDetail,
      monitorType,
      handleClickMonitorIcon,
      handleShowVideo,
      handleClickShowMonitorDetail,
    } = this.props;
    // const {} = this.state;
    const { title, fields, icon } = MonitorConfig[monitorType] || {};
    const list = monitorData[monitorType] || [];

    return (
      <DrawerContainer
        title={`${title} (${list.length})`}
        visible={visible}
        onClose={onClose}
        width={535}
        destroyOnClose={true}
        zIndex={1226}
        left={
          <div className={styles.container}>
            {list.map((item, index) => {
              const { warnStatus } = item;
              const newItem = {
                ...item,
                icon: typeof icon === 'function' ? icon(item) : icon,
              };
              return (
                <FlameOrToxic
                  key={index}
                  data={item}
                  handleShowVideo={handleShowVideo}
                  handleClickShowMonitorDetail={handleClickShowMonitorDetail}
                />
              );
              return (
                <CardItem
                  key={index}
                  data={newItem}
                  fields={fields}
                  iconStyle={{ width: '7em', height: '8em' }}
                  // extraBtn={
                  //   <Fragment>
                  //     {+warnStatus === -1 && (
                  //       <div
                  //         className={styles.alarm}
                  //         style={{
                  //           background: `url(${iconAlarm}) center center / 100% auto no-repeat`,
                  //         }}
                  //       />
                  //     )}
                  //     <div className={styles.detail} onClick={() => handleClickMonitorIcon(item)}>
                  //       监测详情>
                  //     </div>
                  //   </Fragment>
                  // }
                  // onClick={() => handleClickTank(item)}
                />
              );
            })}
          </div>
        }
      />
    );
  }
}
