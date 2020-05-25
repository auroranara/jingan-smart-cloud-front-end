import React, { PureComponent, Fragment } from 'react';
import { Radio, Input } from 'antd';
import DrawerContainer from '../../components/DrawerContainer';
import {
  EquipCard,
  RadioBtns,
  NoData,
  CardItem,
  MonitorBtns,
  FlameOrToxic,
} from '../../components/Components';
import { DrawerIcons, MonitorConfig } from '../../utils';

import styles from './IoTMonitorDrawer.less';

const { Search } = Input;
export default class IoTMonitorDrawer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      searchVisible: false,
      inputValue: '',
      statusIndex: 0,
    };
  }

  handleSearch = e => {
    this.setState({ inputValue: e });
  };

  handleSearchClick = () => {
    const { searchVisible } = this.state;
    this.setState({ searchVisible: !searchVisible, inputValue: '' });
  };

  handleClickRadio = value => {
    this.setState({ statusIndex: +value });
  };

  render() {
    const {
      visible,
      onClose,
      list = [],
      handleShowVideo,
      handleClickShowMonitorDetail,
      selectedEquip: { label, type, warningCount, count },
    } = this.props;
    const { searchVisible, inputValue, statusIndex } = this.state;
    const filters = ({ name, areaLocation }) =>
      name.includes(inputValue) || areaLocation.includes(inputValue);

    const filterList = list
      .filter(item => {
        if (!filters) return true;
        else return filters(item, inputValue);
      })
      .filter(item => {
        switch (statusIndex) {
          case 0:
            return true;
          case 1:
            return item.warnStatus === -1;
          case 2:
            return item.warnStatus !== -1;
          default:
            return false;
        }
      });

    return (
      <DrawerContainer
        title={label}
        visible={visible}
        onClose={() => {
          setTimeout(() => {
            this.setState({
              searchVisible: false,
              inputValue: '',
              statusIndex: 0,
            });
          }, 300);
          onClose();
        }}
        width={535}
        destroyOnClose={true}
        zIndex={1222}
        icon={DrawerIcons[type]}
        onSearchClick={this.handleSearchClick}
        left={
          <div className={styles.container}>
            <div className={styles.radioBtn}>
              {!searchVisible ? (
                <RadioBtns
                  value={statusIndex}
                  onClick={this.handleClickRadio}
                  fields={['全部', '报警', '正常'].map((item, index) => ({
                    label: item,
                    render: () => {
                      const numbers = [count, warningCount, count - warningCount];
                      return (
                        <span key={index}>
                          {item} ({numbers[index]})
                        </span>
                      );
                    },
                  }))}
                  // onClick={this.handleRadioChange}
                />
              ) : (
                <div className={styles.input}>
                  <Search
                    style={{ width: '100%' }}
                    placeholder="输入监测设备名称 / 区域位置"
                    onSearch={this.handleSearch}
                    enterButton
                  />
                </div>
              )}
            </div>
            {filterList.length > 0 ? (
              filterList.map((item, index) => {
                if (['405', '406'].includes(type)) {
                  // 可燃气体监测/有毒气体监测
                  return (
                    <FlameOrToxic
                      key={index}
                      data={item}
                      handleShowVideo={handleShowVideo}
                      handleClickShowMonitorDetail={handleClickShowMonitorDetail}
                    />
                  );
                } else {
                  return (
                    <EquipCard
                      key={index}
                      data={item}
                      handleShowVideo={handleShowVideo}
                      handleClickShowMonitorDetail={handleClickShowMonitorDetail}
                    />
                  );
                }
              })
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
