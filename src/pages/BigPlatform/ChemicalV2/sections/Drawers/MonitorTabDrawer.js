import React, { PureComponent, Fragment } from 'react';
import DrawerContainer from '@/pages/BigPlatform/NewUnitFireControl/components/DrawerContainer';
import { RadioBtns, NoData, Warehouse, WarehouseArea, TankArea } from '../../components/Components';
import { MonitorConfig } from '../../utils';
import styles from './MonitorTabDrawer.less';

export default class MonitorTabDrawer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      active: 0,
    };
  }

  handleClickRadio = val => {
    this.setState({ active: val });
  };

  render() {
    const { visible, onClose, monitorData, monitorType, handleShowVideo } = this.props;
    const { active } = this.state;
    const list = monitorData[monitorType] || [];
    const { title } = MonitorConfig[monitorType] || {};

    return (
      <DrawerContainer
        title={title}
        visible={visible}
        onClose={onClose}
        width={535}
        destroyOnClose={true}
        zIndex={1226}
        left={
          <div className={styles.container}>
            {list.length > 1 && (
              <div className={styles.radioBtn}>
                <RadioBtns
                  value={active}
                  onClick={this.handleClickRadio}
                  fields={list.map((item, index) => ({
                    label: item.name,
                    render: () => {
                      const { monitorParams } = item;
                      const alarm = monitorParams.filter(item => +item.status > 0).length;
                      return (
                        <span key={index}>
                          {monitorType === '301' ? item.areaName : item.name}
                          {alarm > 0 && <span className={styles.alarmNum}>{alarm}</span>}
                        </span>
                      );
                    },
                  }))}
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
