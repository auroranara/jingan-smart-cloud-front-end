import React, { PureComponent, Fragment } from 'react';
import moment from 'moment';
import { Row, Col } from 'antd';
import DrawerContainer from '@/pages/BigPlatform/NewUnitFireControl/components/DrawerContainer';
import Wave from '@/jingan-components/Wave';
import styles from './StorageDrawer.less';
import { CardItem } from '../components/Components';
// import storage from '../imgs/storage.png';
import iconAlarm from '@/assets/icon-alarm.png';

const fields = [
  {
    value: 'tankName',
    render: val => {
      return <span style={{ fontSize: 16 }}>{val}</span>;
    },
  },
  { label: '位号', value: 'number' },
  { label: '存储物质', value: 'chineName' },
  {
    label: '区域位置',
    value: 'buildingName',
    render: (val, row) => {
      const { buildingName, floorName, areaName } = row;
      return (
        <span style={{ fontSize: 16 }}>
          {buildingName ? buildingName + (floorName || '') : areaName || '暂无'}
        </span>
      );
    },
  },
];

export default class DangerSourceInfoDrawer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleClickDetail = () => {
    const { setDrawerVisible } = this.props;
    setDrawerVisible('dangerSourceLvl');
  };

  render() {
    const {
      visible,
      onClose,
      setDrawerVisible,
      tankList: { list },
      handleClickTank,
    } = this.props;
    // const {} = this.state;

    return (
      <DrawerContainer
        title={`储罐监测(${list.length})`}
        visible={visible}
        onClose={onClose}
        width={535}
        destroyOnClose={true}
        zIndex={1222}
        left={
          <div className={styles.container}>
            {list.map((item, index) => {
              const { warnStatus, tankName } = item;
              const newItem = {
                ...item,
                icon: (
                  <div className={styles.iconWrapper}>
                    <Wave
                      frontStyle={{ height: '30%', color: 'rgba(178, 237, 255, 0.8)' }}
                      backStyle={{ height: '30%', color: 'rgba(178, 237, 255, 0.3)' }}
                    />
                    <div className={styles.iconName}>{tankName}</div>
                  </div>
                ),
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
                    </Fragment>
                  }
                  onClick={() => handleClickTank(item)}
                />
              );
            })}
          </div>
        }
      />
    );
  }
}
