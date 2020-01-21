import React, { PureComponent, Fragment } from 'react';
import moment from 'moment';
import DrawerContainer from '@/pages/BigPlatform/NewUnitFireControl/components/DrawerContainer';
import { CardItem } from '../components/Components';
import { MonitorConfig } from '../utils';
import styles from './MonitorDrawer.less';
import iconAlarm from '@/assets/icon-alarm.png';

export default class MonitorDrawer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { visible, onClose, monitorData, handleClickMonitorDetail, monitorType } = this.props;
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
        zIndex={1222}
        left={
          <div className={styles.container}>
            {list.map((item, index) => {
              const { warnStatus } = item;
              const newItem = {
                ...item,
                icon: typeof icon === 'function' ? icon(item) : icon,
              };

              return (
                <CardItem
                  key={index}
                  data={newItem}
                  fields={fields}
                  extraBtn={
                    <Fragment>
                      {+warnStatus === -1 && (
                        <div
                          className={styles.alarm}
                          style={{
                            background: `url(${iconAlarm}) center center / 100% auto no-repeat`,
                          }}
                        />
                      )}
                      <div className={styles.detail} onClick={() => handleClickMonitorDetail(item)}>
                        监测详情>
                      </div>
                    </Fragment>
                  }
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
