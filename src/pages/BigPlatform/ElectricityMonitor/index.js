import React, { PureComponent } from 'react';
import { Input } from 'antd';
import { Map, Marker } from 'react-amap';
import BigPlatformLayout from '@/layouts/BigPlatformLayout';
import NewSection from '@/components/NewSection';
import headerBg from '@/assets/new-header-bg.png';
// 告警信息
import WarningMessage from './WarningMessage';
// 引入样式文件
import styles from './index.less';
import {
  SettingModal,
  UnitDrawer,
} from './sections/Components';

const UNIT_DATA = { alarmNum: 2, warnNum: 198, commonNum: 100 };

const { Search } = Input;

/**
 * description: 用电监测
 * author:
 * date: 2019年01月08日
 */
export default class ElectricityMonitor extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      setttingModalVisible: false,
      unitDrawerVisible: true,
    };
  }

  /**
   * 挂载后
   */
  componentDidMount() {

  }

  /**
   * 更新后
   */
  componentDidUpdate() {

  }

  /**
   * 销毁前
   */
  componentWillUnmount() {

  }

  /**
   * 点击设置按钮
   */
  handleClickSetButton = () => {
    this.setState({ setttingModalVisible: true });
  };

  handleSettingOk = e => {
    this.setState({ setttingModalVisible: false });
  };

  handleSettingCancel = e => {
    this.setState({ setttingModalVisible: false });
  };

  handleDrawerVisibleChange = (name, rest) => {
    const stateName = `${name}DrawerVisible`;
    this.setState(state => ({
      [stateName]: !state[stateName],
      ...rest,
    }));
  };

  /**
   * 渲染
   */
  render() {
    const { setttingModalVisible, unitDrawerVisible } = this.state;

    return (
      <BigPlatformLayout
        title="晶安智慧用电监测平台"
        extra="无锡市"
        style={{ backgroundImage: 'none' }}
        headerStyle={{ position: 'absolute', top: 0, left: 0, width: '100%', fontSize: 16, zIndex: 999, backgroundImage: `url(${headerBg})`, backgroundSize: '100% 100%' }}
        titleStyle={{ fontSize: 46 }}
        contentStyle={{ position: 'relative', height: '100%', zIndex: 0 }}
        settable
        onSet={this.handleClickSetButton}
      >
        {/* 地图 */}
        <Map
          amapkey="665bd904a802559d49a33335f1e4aa0d"
          plugins={['Scale', { name: 'ToolBar', options: { locate: false } }]}
          // center={'无锡'}
          useAMapUI
        >
        </Map>
        {/* 搜索框 */}
        <Search placeholder="单位名称" enterButton="搜索" className={styles.left} style={{ top: 'calc(9.62963% + 24px)' }} />
        {/* 接入单位统计 */}
        <NewSection title="接入单位统计" className={styles.left} style={{ top: 'calc(9.62963% + 68px)', height: '13.611111%' }}>
        123
        </NewSection>
        {/* 实时报警统计 */}
        <NewSection title="实时报警统计" className={styles.left} style={{ top: 'calc(23.24% + 80px)', height: '21.944444%' }}>
        123
        </NewSection>
        {/* 近半年内告警统计 */}
        <NewSection title="近半年内告警统计" className={styles.left} style={{ top: 'calc(45.184444% + 92px)', height: '27.5926%' }}>
        123
        </NewSection>
        {/* 告警信息 */}
        <WarningMessage data={[]} className={styles.right} />
        <SettingModal
          visible={setttingModalVisible}
          handleOk={this.handleSettingOk}
          handleCancel={this.handleSettingCancel}
        />
        <UnitDrawer
          data={UNIT_DATA}
          visible={unitDrawerVisible}
          handleDrawerVisibleChange={this.handleDrawerVisibleChange}
        />
      </BigPlatformLayout>
    );
  }
}
