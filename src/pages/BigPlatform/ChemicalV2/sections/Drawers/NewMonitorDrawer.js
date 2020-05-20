import React, { PureComponent, Fragment } from 'react';
import DrawerContainer from '@/pages/BigPlatform/NewUnitFireControl/components/DrawerContainer';
import { CardItem, MonitorBtns } from '../../components/Components';
import { MonitorConfig } from '../../utils';
import styles from './MonitorDrawer.less';

export default class NewMonitorDrawer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleClickMonitorDetail = id => {
    const { monitorType } = this.props;
    const { detailUrl } = MonitorConfig[monitorType] || {};
    detailUrl && id && window.open(`${window.publicPath}#/${detailUrl}/${id}`);
  };

  render() {
    const { visible, onClose, monitorData, handleClickMonitorDetail, monitorType } = this.props;
    const { title, fields, icon, iconStyle, labelStyle, btnStyles, moreStyle } =
      MonitorConfig[monitorType] || {};
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
              const { monitorParams, allMonitorParam, videoList, meList } = item;
              const newItem = {
                ...item,
                icon: typeof icon === 'function' ? icon(item) : icon,
              };
              const paramList = monitorParams || allMonitorParam || {};
              const { noFinishWarningProcessId, id: monitorEquipmentId } = meList[0] || {};

              return (
                <CardItem
                  key={index}
                  data={newItem}
                  fields={fields}
                  iconStyle={iconStyle}
                  labelStyle={{ color: '#8198b4', ...labelStyle }}
                  fieldsStyle={{ lineHeight: '32px' }}
                  style={{ border: '1px solid #1C5D90' }}
                  extraBtn={
                    <Fragment>
                      <MonitorBtns
                        videoList={videoList}
                        noFinishWarningProcessId={noFinishWarningProcessId}
                        monitorEquipmentId={monitorEquipmentId}
                        style={{ top: 15, ...btnStyles }}
                      />
                      {/* <div className={styles.detail} onClick={() => handleClickMonitorDetail(item)}> */}
                      <div
                        className={styles.detail}
                        onClick={() => this.handleClickMonitorDetail(item.id)}
                        style={{ ...moreStyle }}
                      >
                        详情>>
                      </div>
                    </Fragment>
                  }
                />
              );
            })}
          </div>
        }
      />
    );
  }
}
