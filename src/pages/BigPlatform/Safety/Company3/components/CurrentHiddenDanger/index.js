import React, { PureComponent } from 'react';
import { Select } from 'antd';
import Section from '../Section';
import HiddenDanger from '../HiddenDanger';
import LoadMoreButton from '../LoadMoreButton';
import defaultHiddenDanger from '@/assets/default_hidden_danger.png';
// 引入样式文件
import styles from './index.less';
const { Option } = Select;

const dict = {
  '全部': 5,
  '未超期': 2,
  '待复查': 3,
  '已超期': 7,
};

/**
 * description: 当前隐患
 */
export default class CurrentHiddenDanger extends PureComponent {
  state = {
    // 当前选中的状态
    selectedStatus: '全部',
  }

  refScroll = (scroll) => {
    this.scroll = scroll;
  }

  /**
   * 下拉框选择事件
   */
  handleSelect = (selectedStatus) => {
    const { onClick } = this.props;
    onClick({ status: dict[selectedStatus] });
    this.setState({
      selectedStatus,
    });
    // 移到最顶部
    this.scroll.dom.scrollTop();
  }

  /**
   * 加载更多
   */
  handleLoadMore = () => {
    const { onClick, data: { pagination: { pageNum=1 }={} }={} } = this.props;
    const { selectedStatus } = this.state;
    onClick({ pageNum: pageNum + 1, status: dict[selectedStatus] });
  }

  /**
   * 下拉框
   */
  renderSelect() {
    const {
      count: { total=0, ycq=0, wcq=0, dfc=0 }={},
    } = this.props;
    const { selectedStatus } = this.state;
    const list = [
      {
        key: '全部',
        value: `全部 ${total}`,
      },
      {
        key: '已超期',
        value: `已超期 ${ycq}`,
      },
      {
        key: '未超期',
        value: `未超期 ${wcq}`,
      },
      {
        key: '待复查',
        value: `待复查 ${dfc}`,
      },
    ];
    // 当四色图的数量大于1时才显示下拉框
    return total > 0 ? (
      <Select
        value={selectedStatus}
        onSelect={this.handleSelect}
        className={styles.fourColorImgSelect}
        dropdownClassName={styles.fourColorImgSelectDropDown}
      >
        {list.map(({ key, value }) => {
          const isSelected = selectedStatus === key;
          return (
            <Option
              key={key}
              value={key}
              style={{ color: isSelected && '#00ffff' }}
            >
              {value}
            </Option>
          );
        })}
      </Select>
    ) : null;
  }

  render() {
    const {
      data: {
        list=[],
        pagination: {
          total=0,
          pageNum=0,
          pageSize=0,
        }={},
      }={},
      loading,
    } = this.props;

    return (
      <Section refScroll={this.refScroll} title="当前隐患" action={this.renderSelect()} contentStyle={{ padding: '12px 0' }} spinProps={{ loading }}>
        <div className={styles.container}>
          {list.length > 0 ? list.map(item => (
            <HiddenDanger key={item.id} data={item} showSource />
          )) : <div className={styles.empty} style={{ backgroundImage: `url(${defaultHiddenDanger})` }} />}
          {pageNum * pageSize < total && (
            <div className={styles.loadMoreWrapper}><LoadMoreButton onClick={this.handleLoadMore} /></div>
          )}
        </div>
      </Section>
    );
  }
}
