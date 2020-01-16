import React, { PureComponent, Fragment } from 'react';
import { Icon } from 'antd';
import moment from 'moment';
import DrawerContainer from '@/pages/BigPlatform/NewUnitFireControl/components/DrawerContainer';
import styles from './MonitorEquipDrawer.less';
import iconAlarm from '@/assets/icon-alarm.png';

const NO_DATA = '暂无数据';
const DEFAULT_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const STATUS = ['正常', '预警', '报警'];

export default class MonitorEquipDrawer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      visible,
      onClose,
      monitorMarker: {
        equipmentTypeName,
        name,
        areaLocation,
        beMonitorTargetName,
        type,
        allMonitorParam = [],
      },
    } = this.props;

    return (
      <DrawerContainer
        title={equipmentTypeName}
        visible={visible}
        onClose={onClose}
        width={535}
        destroyOnClose={true}
        zIndex={1222}
        left={
          <div className={styles.container}>
            <div className={styles.wrapper}>
              <div className={styles.name}>
                <span className={styles.label}>监测设备名称：</span>
                {name}
              </div>
              <div>
                <span className={styles.locIcon} style={{ marginRight: '5px' }}>
                  <Icon type="environment" />
                </span>
                {areaLocation}
              </div>
            </div>

            {type && (
              <div className={styles.wrapper}>
                <div className={styles.targetWrapper}>
                  <span className={styles.label}>监测对象：</span>
                  {beMonitorTargetName}
                  <div className={styles.more}>详情>></div>
                </div>
              </div>
            )}

            {allMonitorParam.length > 0 && (
              <div className={styles.wrapper}>
                {allMonitorParam.map((item, index) => {
                  const {
                    status,
                    paramDesc,
                    paramUnit,
                    logoWebUrl,
                    realValue,
                    dataUpdateTime,
                    condition,
                    limitValueStr,
                  } = item;
                  return (
                    <div className={styles.paramsWrapper} key={index}>
                      <div
                        className={styles.icon}
                        style={{
                          background: `url(${logoWebUrl}) center center / 100% 100% no-repeat`,
                        }}
                      />
                      <div className={styles.params}>
                        <div className={styles.lineWrapper}>
                          <div className={styles.line}>
                            <div className={styles.label}>
                              {paramDesc}（{paramUnit}
                              ）：
                            </div>
                            <div className={styles.value}>{realValue || NO_DATA}</div>
                          </div>
                          <div className={styles.line}>
                            <div className={styles.label}>状态：</div>
                            <div
                              className={styles.value}
                              style={{ color: +status > 0 ? '#ff4848' : '#0ff' }}
                            >
                              {`${STATUS[status]}${
                                condition && limitValueStr ? `（${condition}${limitValueStr}）` : ''
                              }`}
                            </div>
                          </div>
                        </div>
                        <div className={styles.updateTime}>
                          更新时间：
                          {dataUpdateTime ? moment(dataUpdateTime).format(DEFAULT_FORMAT) : NO_DATA}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        }
      />
    );
  }
}
