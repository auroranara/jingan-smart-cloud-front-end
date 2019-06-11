import React, { PureComponent } from 'react';
import { Select } from 'antd';
import { connect } from 'dva';
import classNames from 'classnames';
import DeviceCard from '@/jingan-components/DeviceCard';
import defaultBackground from '@/assets/default_dynamic_monitor.png';
import SectionDrawer from '../SectionDrawer';
// 引入样式文件
import styles from './index.less';
import selectStyles from '../../select.less';

const { Option } = Select;
// 状态字典
const statusDict = [
  {
    key: '0',
    value: '全部状态',
  },
  {
    key: '1',
    value: '正常',
  },
  {
    key: '2',
    value: '报警',
  },
  {
    key: '3',
    value: '故障',
  },
  {
    key: '4',
    value: '失联',
  },
];

/**
 * 设备统计抽屉
 */
@connect(({ unitSafety, loading }) => ({
  unitSafety,
  loading: loading.effects['unitSafety/fetchDeviceCountList'],
}))
export default class DeviceCountDrawer extends PureComponent {
  componentDidUpdate({ visible: prevVisible }) {
    const { visible } = this.props;
    if (!prevVisible && visible) {
      this.scroll.dom.scrollTop();
    }
  }

  refScroll = (scroll) => {
    this.scroll = scroll;
  }

  /**
   * 状态变化
   */
  handleStatusChange = (deviceCountSelectedStatus) => {
    const { onStatusChange } = this.props;
    onStatusChange(deviceCountSelectedStatus);
  }

  /**
   * 监测类型变化
   */
  handleMonitoringTypeChange = (deviceCountSelectedMonitoringType) => {
    const { onMonitoringTypeChange } = this.props;
    onMonitoringTypeChange(deviceCountSelectedMonitoringType);
  }

  /**
   * 状态选择器
   */
  renderStatusSelect() {
    const { deviceCountSelectedStatus } = this.props;
    return (
      <Select
        placeholder="请选择状态"
        value={deviceCountSelectedStatus}
        onChange={this.handleStatusChange}
        className={classNames(selectStyles.select, styles.select)}
        dropdownClassName={selectStyles.dropdown}
      >
        {statusDict.map(({ key, value }) => (
          <Option value={key} key={key}>{value}</Option>
        ))}
      </Select>
    );
  }

  /**
   * 监测类型选择器
   */
  renderMonitoringTypeSelect() {
    const {
      unitSafety: {
        dynamicMonitorData: {
          fireEngine,
          electricalFire,
          smokeAlarm,
          storageTank,
          toxicGas,
          effluent,
          exhaustGas,
        }={},
      },
      deviceCountSelectedMonitoringType,
    } = this.props;
    // 类型字典1电气火灾，2可燃/有毒气体，3废水，4废气，5储罐，6独立烟感，7消防主机，8水系统
    const typeDict = [
      {
        key: '0',
        value: '全部监测类型',
        show: true,
      },
      {
        key: '1',
        value: '电气火灾监测',
        show: electricalFire && electricalFire.totalNum > 0,
      },
      {
        key: '2',
        value: '可燃/有毒气体监测',
        show: toxicGas && toxicGas.totalNum > 0,
      },
      {
        key: '3',
        value: '废水监测',
        show: effluent && effluent.totalNum > 0,
      },
      {
        key: '4',
        value: '废气监测',
        show: exhaustGas && exhaustGas.totalNum > 0,
      },
      {
        key: '5',
        value: '储罐监测',
        show: storageTank && storageTank.totalNum > 0,
      },
      {
        key: '6',
        value: '独立烟感报警监测',
        show: smokeAlarm && smokeAlarm.totalNum > 0,
      },
      {
        key: '7',
        value: '消防主机监测',
        show: fireEngine && fireEngine.totalNum > 0,
      },
      // {
      //   key: '8',
      //   value: '水系统监测',
      //   show: electricalFire && electricalFire.totalNum > 0,
      // },
    ].filter(({ show }) => show);


    return (
      <Select
        placeholder="请选择监测类型"
        value={deviceCountSelectedMonitoringType}
        onChange={this.handleMonitoringTypeChange}
        className={classNames(selectStyles.select, styles.select)}
        dropdownClassName={selectStyles.dropdown}
      >
        {typeDict.map(({ key, value }) => (
          <Option value={key} key={key}>{value}</Option>
        ))}
      </Select>
    );
  }

  render() {
    const {
      // 抽屉是否可见
      visible,
      // 抽屉关闭事件
      onClose,
      // 源数据
      unitSafety: {
        deviceCountList=[],
      },
      loading,
    } = this.props;

    return (
      <SectionDrawer
        drawerProps={{
          title: '设备统计',
          visible,
          onClose,
        }}
        sectionProps={{
          refScroll: this.refScroll,
          scrollProps: { className: styles.scrollContainer },
          spinProps: { loading },
          fixedContent: (
            <div className={styles.toolbar}>
              <div className={styles.tool}>{this.renderStatusSelect()}</div>
              <div className={styles.tool}>{this.renderMonitoringTypeSelect()}</div>
            </div>
          ),
        }}
      >
        <div className={styles.container}>
          {deviceCountList && deviceCountList.length > 0 ? deviceCountList.map((device) => {
            return (
              <DeviceCard
                key={device.id}
                className={styles.card}
                data={device}
              />
            );
          }) : <div className={styles.defaultBackground} style={{ backgroundImage: `url(${defaultBackground})` }} />}
        </div>
      </SectionDrawer>
    );
  }
}
