import React, { PureComponent } from 'react';
import { Button, DatePicker, Icon, Select, TreeSelect, message } from 'antd';
import moment from 'moment';

import styles from './History.less';
import { Tabs } from '../components/Components';

const { RangePicker } = DatePicker;
const { Option } = Select;

// 时间格式
const timeFormat = 'YYYY-MM-DD HH:mm';
// 默认范围
const defaultRange = [moment().startOf('minute').subtract(5, 'minutes'), moment().startOf('minute')];
const RANGE_LIMIT = 24 * 3600 * 1000;

/**
 * description: 历史轨迹
 */
export default class AlarmList extends PureComponent {
  state = {
    range: defaultRange,
    selectedArea: undefined,
  };

  componentDidMount() {
    const {
      companyId,
      position: { sectionTree },
    } = this.props;

    this.setState({ selectedArea: sectionTree[0].value });
  }

  render() {
    const {
      labelIndex,
      position: { sectionTree },
      // handleLabelClick,
    } = this.props;
    const { range, selectedArea } = this.state;

    return (
      <div className={styles.container}>
        <div className={styles.left}>
          <Tabs value={labelIndex} handleLabelClick={this.onTabClick} />
          <div className={styles.wrapper}>
            <div className={styles.inner}>
              <div className={styles.leftTop}>
                top
              </div>
              <div className={styles.leftMiddle}>
                middle
              </div>
            </div>
          </div>
        </div>
        <div className={styles.right}>
          <div>
            <Select
              defaultValue="0"
              // value={0}
              className={styles.select1}
              dropdownClassName={styles.dropdown}
              onChange={this.handleIdTypeChange}
            >
              <Option key="0" value="0">人员</Option>
              <Option key="1" value="1">卡号</Option>
            </Select>
            <Select
              allowClear
              showSearch
              mode="multiple"
              className={styles.cardSelect}
              dropdownClassName={styles.dropdown}
              // value={0}
              placeholder="请选择或搜索人员/卡号"
              onChange={this.handleIdsChange}
            >
              <Option key="0" value="0">a</Option>
            </Select>
            <Select
              allowClear
              showSearch
              mode="multiple"
              className={styles.cardSelect}
              dropdownClassName={styles.dropdown}
              // value={0}
              placeholder="请选择或搜索人员/卡号"
              onChange={this.handleIdsChange}
            >
              <Option key="0" value="0">a</Option>
            </Select>
            <TreeSelect
              treeDefaultExpandAll
              value={selectedArea}
              className={styles.tree}
              treeData={sectionTree}
              onChange={this.handleAreaChange}
              dropdownClassName={styles.treeDropdown}
            />
            <RangePicker
              dropdownClassName={styles.rangePickerDropDown}
              className={styles.rangePicker}
              style={{ width: '100%' }}
              showTime={{ format: 'HH:mm' }}
              format={timeFormat}
              placeholder={['开始时间', '结束时间']}
              value={range}
              onChange={this.handleChange}
              onOk={this.handleOk}
              onOpenChange={this.handleOpenChange}
              allowClear={false}
            />
            <Button className={styles.searchBtn} onClick={this.handleSearch}>搜索</Button>
          </div>
        </div>
      </div>
    );
  }
}
