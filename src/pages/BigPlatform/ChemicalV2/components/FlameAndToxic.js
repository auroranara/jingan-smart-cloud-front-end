import React, { PureComponent, Fragment } from 'react';
import { CardItem, MonitorBtns } from './Components';
import { MonitorConfig } from '../utils';
import styles from './FlameAndToxic.less';

export default class FlameAndToxic extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { meList = [], handleShowVideo, noBorder } = this.props;
    const flameEquips = meList.filter(item => item.equipmentType === '405');
    const toxicEquips = meList.filter(item => item.equipmentType === '406');
    const flameAndToxic = [
      { list: flameEquips, label: '可燃气体监测点' },
      { list: toxicEquips, label: '有毒气体监测点' },
    ];

    return (
      <div className={styles.container}>
        {flameAndToxic.map((item, index) => {
          const { list, label } = item;
          return (
            list.length > 0 && (
              <div
                className={styles.wrapper}
                key={index}
                style={{ borderTop: noBorder ? '1px solid #1C5D90' : undefined }}
              >
                <div className={styles.wrapperTitle}>
                  {label} ({list.length})
                </div>
                {list.map((equip, i) => {
                  const {
                    noFinishWarningProcessId,
                    id: monitorEquipmentId,
                    videoList,
                    equipmentType,
                  } = equip;
                  const { fields, icon, iconStyle, labelStyle, btnStyles } =
                    MonitorConfig[equipmentType] || {};

                  return (
                    <CardItem
                      key={i}
                      data={{ ...equip, icon: typeof icon === 'function' ? icon(equip) : icon }}
                      fields={fields}
                      iconStyle={iconStyle}
                      labelStyle={{ color: '#8198b4', ...labelStyle }}
                      fieldsStyle={{ lineHeight: '32px' }}
                      style={{ border: noBorder ? 'none' : '1px solid #1C5D90' }}
                      extraBtn={
                        <Fragment>
                          <MonitorBtns
                            videoList={videoList}
                            onVideoClick={handleShowVideo}
                            noFinishWarningProcessId={noFinishWarningProcessId}
                            monitorEquipmentId={monitorEquipmentId}
                            style={{ top: 15, ...btnStyles }}
                          />
                        </Fragment>
                      }
                    />
                  );
                })}
              </div>
            )
          );
        })}
      </div>
    );
  }
}
