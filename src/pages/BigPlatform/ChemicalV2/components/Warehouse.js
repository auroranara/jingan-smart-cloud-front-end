import React, { PureComponent, Fragment } from 'react';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import { CardItem, MonitorBtns, FlameAndToxic } from './Components';
import { MonitorConfig } from '../utils';
import styles from './Warehouse.less';

const MonitorType = '304';
export default class Warehouse extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleClickMonitorDetail = id => {
    const { detailUrl } = MonitorConfig[MonitorType] || {};
    detailUrl && id && window.open(`${window.publicPath}#/${detailUrl}/${id}`);
  };

  render() {
    const { data = {}, handleShowVideo, outBorder, style = {} } = this.props;
    const fields = [
      {
        label: '存储物质',
        value: 'unitChemiclaNumDetail',
        render: val => (val || []).map(item => item.chineName).join('，'),
      },
      { label: '库房面积', value: 'area', render: val => val + '㎡' },
      { label: '危化品仓库', value: 'dangerWarehouse', render: val => (+val === 0 ? '否' : '是') },
      {
        value: 'position',
        render: val => {
          return (
            <span>
              <LegacyIcon type="environment" style={{ color: '#8198b4', marginRight: 5 }} />
              {val}
            </span>
          );
        },
      },
    ];
    const { icon, iconStyle, labelStyle, btnStyles, moreStyle } = MonitorConfig[MonitorType] || {};
    const { videoList = [], meList = [], name } = data;
    // 筛选非有毒可燃的传感器
    const noFlameAndToxic = meList
      .filter(item => !['405', '406'].includes(item.equipmentType))
      .reduce((res, cur) => {
        const { allMonitorParam } = cur;
        res = [...res, ...allMonitorParam];
        return res;
      }, []);
    const newItem = {
      ...data,
      icon: typeof icon === 'function' ? icon({ ...data, monitorParams: noFlameAndToxic }) : icon,
    };
    const { noFinishWarningProcessId, id: monitorEquipmentId } = meList[0] || {};

    return (
      <div
        className={styles.container}
        style={{ ...(outBorder ? { padding: 10, border: '1px solid #1C5D90' } : {}), ...style }}
      >
        <CardItem
          data={newItem}
          fields={fields}
          iconStyle={iconStyle}
          labelStyle={{ color: '#8198b4', ...labelStyle }}
          fieldsStyle={{ lineHeight: '32px' }}
          style={{
            border: 'none',
            // borderBottom: '1px solid #1C5D90',
            paddingTop: 40,
            paddingBottom: 20,
          }}
          extraBtn={
            <Fragment>
              <MonitorBtns
                videoList={videoList}
                onVideoClick={handleShowVideo}
                noFinishWarningProcessId={noFinishWarningProcessId}
                monitorEquipmentId={monitorEquipmentId}
                style={{ ...btnStyles }}
              />
              <div className={styles.name}>{name}</div>
              <div
                className={styles.detail}
                onClick={() => this.handleClickMonitorDetail(data.id)}
                style={{ ...moreStyle }}
              >
                详情>>
              </div>
            </Fragment>
          }
        />
        <FlameAndToxic handleShowVideo={handleShowVideo} meList={meList} noBorder={outBorder} />
      </div>
    );
  }
}
