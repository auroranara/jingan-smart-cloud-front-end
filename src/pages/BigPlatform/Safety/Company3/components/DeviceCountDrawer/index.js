import React, { PureComponent } from 'react';
import { Select } from 'antd';
import { connect } from 'dva';
import classNames from 'classnames';
import DeviceCard from '@/jingan-components/DeviceCard';
import SectionDrawer from '../SectionDrawer';
// 引入样式文件
import styles from './index.less';
import selectStyles from '../../select.less';

const { Option } = Select;

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
    const deviceCountStatusList = [
      {
        key: '全部状态',
        value: '全部状态',
      },
      {
        key: '-3',
        value: '故障',
      },
      {
        key: '-1',
        value: '失联',
      },
      {
        key: '0',
        value: '正常',
      },
      {
        key: '2',
        value: '报警',
      },
    ];
    return (
      <Select
        value={deviceCountSelectedStatus}
        onChange={this.handleStatusChange}
        className={classNames(selectStyles.select, styles.select)}
        dropdownClassName={selectStyles.dropdown}
      >
        {deviceCountStatusList.map(({ key, value }) => (
          <Option value={key} key={key}>{value}</Option>
        ))}
      </Select>
    );
  }

  /**
   * 监测类型选择器
   */
  renderMonitoringTypeSelect() {
    const { deviceCountSelectedMonitoringType } = this.props;
    const deviceCountMonitoringTypeList = [
      {
        key: '全部监测类型',
        value: '全部监测类型',
      },
      {
        key: '消防主机监测',
        value: '消防主机监测',
      },
      {
        key: '电气火灾监测',
        value: '电气火灾监测',
      },
      {
        key: '可燃/有毒气体监测',
        value: '可燃/有毒气体监测',
      },
      {
        key: '废水监测',
        value: '废水监测',
      },
      {
        key: '废气监测',
        value: '废气监测',
      },
      {
        key: '储罐监测',
        value: '储罐监测',
      },
      {
        key: '独立烟感',
        value: '独立烟感',
      },
      {
        key: '水系统监测',
        value: '水系统监测',
      },
    ];
    return (
      <Select
        value={deviceCountSelectedMonitoringType}
        onChange={this.handleMonitoringTypeChange}
        className={classNames(selectStyles.select, styles.select)}
        dropdownClassName={selectStyles.dropdown}
      >
        {deviceCountMonitoringTypeList.map(({ key, value }) => (
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
              <DeviceCard className={styles.card} data={device} />
            );
          }) : ''}
        </div>
      </SectionDrawer>
    );
  }
}
