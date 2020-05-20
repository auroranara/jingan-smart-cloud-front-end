import React, { PureComponent, Fragment } from 'react';
import { Radio, Input } from 'antd';
import DrawerContainer from '../../components/DrawerContainer';
import { EquipCard } from '../../components/Components';
import { DrawerIcons } from '../../utils';

import styles from './IoTMonitorDrawer.less';

const { Search } = Input;
export default class IoTMonitorDrawer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      visible,
      onClose,
      list = [],
      handleShowVideo,
      handleClickShowMonitorDetail,
      selectedEquip: { label, type },
    } = this.props;

    return (
      <DrawerContainer
        title={<div className={styles.titleWrapper}>{label}</div>}
        visible={visible}
        onClose={onClose}
        width={535}
        destroyOnClose={true}
        zIndex={1222}
        icon={DrawerIcons[type]}
        left={
          <div className={styles.container}>
            {/* <div className={styles.radioBtn}>
              {!searchVisible ? (
                <Radio.Group value={statusIndex} buttonStyle="solid" onChange={this.handleRadioChange}>
                  <Radio.Button value={0}>全部 ({count})</Radio.Button>
                  <Radio.Button value={1}>
                    报警(
                    {warningCount})
                  </Radio.Button>
                  <Radio.Button value={2}>
                    正常(
                    {count - warningCount})
                  </Radio.Button>
                </Radio.Group>
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
            </div> */}
            {list.map((item, index) => (
              <EquipCard
                key={index}
                data={item}
                handleShowVideo={handleShowVideo}
                handleClickShowMonitorDetail={handleClickShowMonitorDetail}
              />
            ))}
          </div>
        }
      />
    );
  }
}
