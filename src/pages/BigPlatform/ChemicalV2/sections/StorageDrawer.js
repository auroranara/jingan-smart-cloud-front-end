import React, { PureComponent, Fragment } from 'react';
import moment from 'moment';
import { Row, Col } from 'antd';
import DrawerContainer from '@/pages/BigPlatform/NewUnitFireControl/components/DrawerContainer';
import Wave from '@/jingan-components/Wave';
import styles from './StorageDrawer.less';
import { CardItem } from '../components/Components';
// import storage from '../imgs/storage.png';
import iconAlarm from '@/assets/icon-alarm.png';

const constructList = [
  { key: '1', value: '拱顶式' },
  { key: '2', value: '浮顶式' },
  { key: '3', value: '内浮顶' },
  { key: '4', value: '卧式' },
];

const fields = [
  {
    value: 'name',
    render: val => {
      return <span style={{ fontSize: 16 }}>{val}</span>;
    },
  },
  { label: '位号', value: 'number' },
  { label: '存储物质', value: 'store' },
  { label: '储罐结构', value: 'type' },
  {
    value: 'contain',
    render: (val, row) => {
      const { contain, nowCotain } = row;
      return (
        <Row gutter={10}>
          <Col span={12}>
            <span className={styles.label}>设计储量：</span>
            {contain}
          </Col>
          {/* <Col span={12}>
            <span className={styles.label}>实时储量：</span>
            {nowCotain}
          </Col> */}
        </Row>
      );
    },
  },
  {
    value: 'pressure',
    render: (val, row) => {
      const { pressure, nowPressure } = row;
      return (
        <Row gutter={10}>
          <Col span={12}>
            <span className={styles.label}>设计压力：</span>
            {pressure}
          </Col>
          {/* <Col span={12}>
            <span className={styles.label}>实时压力：</span>
            {nowPressure}
          </Col> */}
        </Row>
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
              const {
                tankName,
                chineName,
                number,
                tankStructure,
                designReserves,
                designReservesUnit,
                designPressure,
                warnStatus,
              } = item;
              const newItem = {
                // ...item,
                store: chineName,
                // acture: '8t',
                contain: designReserves + (designReservesUnit || ''),
                // nowCotain: '2t',
                pressure: designPressure + 'KPa',
                // nowPressure: '0.05MPa',
                name: tankName,
                number,
                icon: (
                  <Wave
                    frontStyle={{ height: '12.5%', color: 'rgba(178, 237, 255, 0.8)' }}
                    backStyle={{ height: '12.5%', color: 'rgba(178, 237, 255, 0.3)' }}
                  />
                ),
                type: constructList[tankStructure - 1].value,
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
                  // onClick={() => setDrawerVisible('tankMonitor')}
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
