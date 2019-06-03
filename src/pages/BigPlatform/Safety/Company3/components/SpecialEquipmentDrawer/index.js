import React, { PureComponent } from 'react';
import { connect } from 'dva';
import classNames from 'classnames';
import SpecialEquipmentCard from '@/jingan-components/SpecialEquipmentCard';
import SectionDrawer from '../SectionDrawer';
// 引入样式文件
import styles from './index.less';

/**
 * 特种设备抽屉
 */
@connect(({ unitSafety }) => ({
  unitSafety,
}))
export default class SpecialEquipmentDrawer extends PureComponent {
  state = {
    selectedStatus: '2',
  };

  componentDidUpdate({ visible: prevVisible }) {
    const { visible } = this.props;
    if (!prevVisible && visible) {
      this.scroll.dom.scrollTop();
      this.handleStatusChange('2'); // 默认选中全部
    }
  }

  refScroll = scroll => {
    this.scroll = scroll;
  };

  /**
   * 状态切换
   */
  handleStatusChange = (selectedStatus) => {
    this.setState({
      selectedStatus,
    });
  }

  /**
   * 选择状态
   */
  renderStatusSelect() {
    const {
      unitSafety: {
        specialEquipmentList: {
          allList=[],
          expiredList=[],
          unexpiredList=[],
        }={},
      },
    } = this.props;
    const { selectedStatus } = this.state;
    return (
      <div className={styles.statusList}>
        <div className={styles.statusItemWrapper}>
          <div className={classNames(styles.statusItem, selectedStatus === '2' && styles.selectedStatusItem)} onClick={() => this.handleStatusChange('2')}>
            <span className={styles.statusItemLabel}>全部</span>
            {allList.length}
          </div>
        </div>
        <div className={styles.statusItemWrapper}>
          <div className={classNames(styles.statusItem, selectedStatus === '1' && styles.selectedStatusItem)} onClick={() => this.handleStatusChange('1')}>
            <span className={styles.statusItemLabel}>已过期</span>
            <span className={styles.expiredStatusItemValue}>{expiredList.length}</span>
          </div>
        </div>
        <div className={styles.statusItemWrapper}>
          <div className={classNames(styles.statusItem, selectedStatus === '0' && styles.selectedStatusItem)} onClick={() => this.handleStatusChange('0')}>
            <span className={styles.statusItemLabel}>未过期</span>
            {unexpiredList.length}
          </div>
        </div>
      </div>
    );
  }

  render() {
    let {
      // 抽屉是否可见
      visible,
      // 关闭函数
      onClose,
      unitSafety: {
        specialEquipmentList: {
          allList=[],
          expiredList=[],
          unexpiredList=[],
        }={},
      },
    } = this.props;
    const { selectedStatus } = this.state;
    let list;
    if (selectedStatus === '1') { // 已过期
      list = expiredList;
    } else if (selectedStatus === '0') { // 未过期
      list = unexpiredList;
    } else { // 全部
      list = allList;
    }

    return (
      <SectionDrawer
        drawerProps={{
          title: '特种设备',
          visible,
          onClose,
        }}
        sectionProps={{
          refScroll: this.refScroll,
          scrollProps: { className: styles.scrollContainer },
          fixedContent: this.renderStatusSelect(),
        }}
      >
        <div className={styles.container}>
          {list.map(item => <SpecialEquipmentCard className={styles.card} data={item} key={item.id} />)}
        </div>
      </SectionDrawer>
    );
  }
}
