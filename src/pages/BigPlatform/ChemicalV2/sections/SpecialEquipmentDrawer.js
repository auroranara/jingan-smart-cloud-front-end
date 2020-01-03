import React, { PureComponent } from 'react';
import { connect } from 'dva';
import classNames from 'classnames';
import SpecialEquipmentCard from '@/jingan-components/SpecialEquipmentCard';
import SectionDrawer from '@/pages/BigPlatform/Safety/Company3/components/SectionDrawer';
import { SpecialEquipmentList } from '../utils';
// 引入样式文件
import styles from './SpecialEquipmentDrawer.less';

const filterOptions = ['全部', '已过期', '未过期'];

/**
 * 特种设备抽屉
 */
@connect(({ unitSafety }) => ({
  unitSafety,
}))
export default class SpecialEquipmentDrawer extends PureComponent {
  state = {
    selectedStatus: 0,
  };

  componentDidUpdate ({ visible: prevVisible }) {
    const { visible } = this.props;
    if (!prevVisible && visible) {
      this.scroll && this.scroll.scrollTop();
      this.handleStatusChange(0); // 默认选中全部
    }
  }

  refScroll = scroll => {
    this.scroll = (scroll && scroll.dom) || scroll;
  };

  /**
   * 状态切换
   */
  handleStatusChange = selectedStatus => {
    this.setState({
      selectedStatus,
    });
  };

  /**
   * 选择状态
   */
  renderStatusSelect () {
    const {
      // unitSafety: {
      //   specialEquipmentList: { allList = [], expiredList = [], unexpiredList = [] } = {},
      // },
      data: {
        list = [],
        expired = [],
        notExpired = [],
      },
    } = this.props;
    const { selectedStatus } = this.state;
    return (
      <div className={styles.statusList}>
        {/* <div className={styles.statusItemWrapper}>
          <div
            className={classNames(
              styles.statusItem,
              selectedStatus ===0 && styles.selectedStatusItem
            )}
            onClick={() => this.handleStatusChange(0)}
          >
            <span className={styles.statusItemLabel}>全部</span>
            {total}
          </div>
        </div>
        <div className={styles.statusItemWrapper}>
          <div
            className={classNames(
              styles.statusItem,
              selectedStatus === 1 && styles.selectedStatusItem
            )}
            onClick={() => this.handleStatusChange(1)}
          >
            <span className={styles.statusItemLabel}>已过期</span>
            <span className={styles.expiredStatusItemValue}>{expired.length}</span>
          </div>
        </div>
        <div className={styles.statusItemWrapper}>
          <div
            className={classNames(
              styles.statusItem,
              selectedStatus === 2 && styles.selectedStatusItem
            )}
            onClick={() => this.handleStatusChange(2)}
          >
            <span className={styles.statusItemLabel}>未过期</span>
            {notExpired.length}
          </div>
        </div> */}
        {filterOptions.map((item, index) => (
          <div className={styles.statusItemWrapper} key={index}>
            <div
              className={classNames(
                styles.statusItem,
                selectedStatus === index && styles.selectedStatusItem
              )}
              onClick={() => this.handleStatusChange(index)}
            >
              <span className={styles.statusItemLabel}>{item}</span>
              <span className={styles.expiredStatusItemValue}>{([list, expired, notExpired][index]).length}</span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  render () {
    let {
      // 抽屉是否可见
      visible,
      // 关闭函数
      onClose,
      // unitSafety: {
      //   specialEquipmentList: { allList = [], expiredList = [], unexpiredList = [] } = {},
      // },
      data: { list, expired, notExpired },
    } = this.props;
    const { selectedStatus } = this.state;
    // let list;
    // if (selectedStatus === '1') {
    //   // 已过期
    //   list = expiredList;
    // } else if (selectedStatus === '0') {
    //   // 未过期
    //   list = unexpiredList;
    // } else {
    //   // 全部
    //   list = allList;
    // }
    const currentList = [list, expired, notExpired][selectedStatus];
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
          {currentList.map(item => (
            <SpecialEquipmentCard
              className={styles.card}
              data={item}
              key={item.id}
              fieldNames={{
                name: 'equipName', // 设备名称
                number: 'factoryNumber', // 出厂编号
                person: 'contact', // 负责人
                expiryDate: 'endDate', // 有效期至
                status: ({ paststatus }) => paststatus === '2' ? 1 : 0, // 1为已过期，0为未过期
              }}
            />
          ))}
        </div>
      </SectionDrawer>
    );
  }
}
