import React, { PureComponent } from 'react';
import { connect } from 'dva';
import classNames from 'classnames';
import SpecialEquipmentCard from '@/jingan-components/SpecialEquipmentCard';
import SectionDrawer from '@/pages/BigPlatform/Safety/Company3/components/SectionDrawer';
import moment from 'moment';

// import { SpecialEquipmentList } from '../utils';

// 引入样式文件
import styles from './SpecialEquipmentDrawer.less';

// 特种设备状态
const filterOptions = ['全部', '已过期', '即将过期', '未过期'];
// 时间格式
const TIME_FORMAT = 'YYYY-MM-DD';
const statusSetting = {
  '0': { label: '未过期', color: '#1E60FF' },
  '1': { label: '即将到期', color: 'rgb(250, 173, 20)' },
  '2': { label: '已过期', color: '#FF4848' },
};

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

  componentDidUpdate({ visible: prevVisible }) {
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
  renderStatusSelect() {
    const {
      // unitSafety: {
      //   specialEquipmentList: { allList = [], expiredList = [], unexpiredList = [] } = {},
      // },
      data: {
        list = [], // 全部
        expired = [], // 已过期
        notExpired = [], // 未过期
        expiring = [], // 即将到期
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
              <span className={index === 1 ? styles.expiredStatusItemValue : null}>
                {[list, expired, expiring, notExpired][index].length}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  render() {
    let {
      // 抽屉是否可见
      visible,
      // 关闭函数
      onClose,
      data: { list, expired, notExpired, expiring },
      dict = [], // 分类字典
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
    const currentList = [list, expired, expiring, notExpired][selectedStatus];
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
                category: 'category', // 分类
                brand: 'brand', // 品牌
                name: 'equipName', // 设备名称
                number: 'factoryNumber', // 出厂编号
                person: 'contact', // 负责人
                expiryDate: 'endDate', // 有效期至
              }}
              fields={[
                {
                  label: '分类',
                  render: ({ category }) => {
                    let dictData = dict;
                    return (
                      <span style={{ paddingRight: '2em', display: 'inline-block' }}>
                        {category
                          ? category
                              .split(',')
                              .reduce((arr, val) => {
                                const target = dictData.find(item => item.id === val) || {};
                                dictData = target.children;
                                return [...arr, target.label];
                              }, [])
                              .join('>>')
                          : ''}
                      </span>
                    );
                  },
                },
                {
                  label: '品牌',
                  key: 'brand',
                },
                {
                  label: '设备名称',
                  key: 'name',
                },
                {
                  label: '出厂编号',
                  key: 'number',
                },
                {
                  label: '负责人',
                  key: 'person',
                  labelWrapperClassName: styles.personLabelWrapper,
                },
                {
                  label: '有效期至',
                  render: ({ expiryDate, status }) => (
                    <span style={{ color: +status === 1 && '#ff4848' }}>
                      {expiryDate && moment(+expiryDate).format(TIME_FORMAT)}
                    </span>
                  ),
                },
              ]}
              statusLabel={
                statusSetting[item.paststatus] ? statusSetting[item.paststatus].label : undefined
              }
              statusColor={
                statusSetting[item.paststatus] ? statusSetting[item.paststatus].color : undefined
              }
              showStatus={!!item.endDate}
              url={`/facility-management/special-equipment/inspection-report/${item.id}`}
              linkLabel="查看检验报告"
            />
          ))}
        </div>
      </SectionDrawer>
    );
  }
}
