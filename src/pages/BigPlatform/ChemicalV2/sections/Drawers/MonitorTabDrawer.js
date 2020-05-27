import React, { PureComponent, Fragment } from 'react';
import { Tooltip } from 'antd';
// import { RightOutlined, LeftOutlined } from '@ant-design/icons';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import DrawerContainer from '../../components/DrawerContainer';
import { RadioBtns, NoData, Warehouse, WarehouseArea, TankArea } from '../../components/Components';
import { MonitorConfig } from '../../utils';
import styles from './MonitorTabDrawer.less';

const DefaultStates = {
  active: 0,
  page: 0,
};
const Size = 4;
const hasAlarm = list => {
  return !list.every(item => {
    const { monitorParams } = item;
    const alarm = monitorParams.filter(item => +item.status > 0).length;
    return alarm === 0;
  });
};
export default class MonitorTabDrawer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      ...DefaultStates,
    };
  }

  handleClickRadio = val => {
    this.setState({ active: val });
  };

  handlePageChange = page => {
    this.setState({ page });
  };

  render() {
    const { visible, onClose, monitorData, monitorType, handleShowVideo } = this.props;
    const { active, page } = this.state;
    const list = monitorData[monitorType] || [];
    const { title, drawerIcon } = MonitorConfig[monitorType] || {};
    const next = list.slice(page * Size, (page + 1) * Size);
    const nextIcon = hasAlarm(next) && (
      <div className={styles.pageBtns}>
        <LegacyIcon type="right" />
        <div className={styles.dot} />
      </div>
    );
    const prev = list.slice((page - 2) * Size, (page - 1) * Size);
    const prevIcon = hasAlarm(prev) && (
      <div className={styles.pageBtns}>
        <LegacyIcon type="left" />
        <div className={styles.dot} style={{ left: 2, right: 'auto' }} />
      </div>
    );

    return (
      <DrawerContainer
        title={title}
        visible={visible}
        onClose={() => {
          setTimeout(() => {
            this.setState({ ...DefaultStates });
          }, 300);
          onClose();
        }}
        width={535}
        destroyOnClose={true}
        zIndex={1299}
        icon={drawerIcon}
        left={
          <div className={styles.container}>
            {list.length > 1 && (
              <div className={styles.radioBtn}>
                <RadioBtns
                  value={active}
                  onClick={this.handleClickRadio}
                  // fields={list.map((item, index) => ({
                  fields={list.map((item, index) => ({
                    label: item.name,
                    render: () => {
                      const { monitorParams } = item;
                      const alarm = monitorParams.filter(item => +item.status > 0).length;
                      const name = monitorType === '301' ? item.areaName : item.name;
                      const len = alarm > 0 ? 5 : 7;
                      const nameContent =
                        name && name.length > len ? (
                          <Tooltip
                            placement="bottom"
                            title={name}
                            overlayStyle={{ zIndex: 9999 }}
                          >{`${name.substr(0, len)}...`}</Tooltip>
                        ) : (
                          name
                        );
                      return (
                        <span key={index} style={{ whiteSpace: 'nowrap' }}>
                          {nameContent}
                          {alarm > 0 && <span className={styles.alarmNum}>{alarm}</span>}
                        </span>
                      );
                    },
                  }))}
                  handlePageChange={this.handlePageChange}
                  nextIcon={nextIcon}
                  prevIcon={prevIcon}
                />
              </div>
            )}
            {list.length > 0 ? (
              <Fragment>
                {monitorType === '304' && (
                  <Warehouse data={list[active]} handleShowVideo={handleShowVideo} />
                )}
                {monitorType === '303' && (
                  <WarehouseArea data={list[active]} handleShowVideo={handleShowVideo} />
                )}
                {monitorType === '301' && (
                  <TankArea data={list[active]} handleShowVideo={handleShowVideo} />
                )}
              </Fragment>
            ) : (
              <NoData
                style={{
                  height: '400px',
                  display: 'flex',
                  flexDirection: 'column',
                  textAlign: 'center',
                  color: '#4f6793',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                }}
              />
            )}
          </div>
        }
      />
    );
  }
}
