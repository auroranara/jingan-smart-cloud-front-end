import React, { PureComponent } from 'react';
import { Select } from 'antd';
import Section from '../Section';
import HiddenDanger from '../HiddenDanger';
import defaultHiddenDanger from '@/assets/default_hidden_danger.png';
// 引入样式文件
import styles from './index.less';
const { Option } = Select;

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
   * 根据当前选中的状态获取隐患列表
   */
  getHiddenDangerList = () => {
    const {
      data: { ycq=[], wcq=[], dfc=[] },
    } = this.props;
    const { selectedStatus } = this.state;
    if (selectedStatus === '已超期') {
      return ycq;
    }
    else if (selectedStatus === '未超期') {
      return wcq;
    }
    else if (selectedStatus === '待复查') {
      return dfc;
    }
    else {
      return ycq.concat(wcq, dfc);
    }
  }

  /**
   * 下拉框选择事件
   */
  handleSelect = (selectedStatus) => {
    this.setState({
      selectedStatus,
    });
    // 移到最顶部
    this.scroll.dom.scrollTop();
  }



  /**
   * 下拉框
   */
  renderSelect() {
    const {
      data: { ycq=[], wcq=[], dfc=[] },
    } = this.props;
    const { selectedStatus } = this.state;
    const all = ycq.length + wcq.length + dfc.length;
    const list = [
      {
        key: '全部',
        value: `全部 ${all}`,
      },
      {
        key: '已超期',
        value: `已超期 ${ycq.length}`,
      },
      {
        key: '未超期',
        value: `未超期 ${wcq.length}`,
      },
      {
        key: '待复查',
        value: `待复查 ${dfc.length}`,
      },
    ];
    // 当四色图的数量大于1时才显示下拉框
    return all > 0 ? (
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
    const list = this.getHiddenDangerList();

    return (
      <Section refScroll={this.refScroll} title="当前隐患" action={this.renderSelect()} contentStyle={{ padding: '12px 0' }}>
        <div className={styles.container}>
          {list.length > 0 ? list.map(item => (
            <HiddenDanger key={item.id} data={item} showSource />
          )) : <div className={styles.empty} style={{ backgroundImage: `url(${defaultHiddenDanger})` }} />}
        </div>
      </Section>
    );
  }
}
