import React, { PureComponent, Fragment } from 'react';
import { Table, Select } from 'antd'
import moment from 'moment';
import Section from '@/components/Section';

import styles from './index.less';
const { Option } = Select;

const currentMonth = moment().get('month');
const months = [...Array(currentMonth+1).keys()].map(month => ({
  value: moment({ month: currentMonth-month }).format('YYYY-MM'),
}));
const defaultFieldNames = {
  id: 'id',
  person: 'person',
  total: 'total',
  abnormal: 'abnormal',
};
/**
 * 单位巡查人员列表
 */
export default class App extends PureComponent {
  handleSelect = (value) => {
    const { onSelect } = this.props;
    if (onSelect) {
      onSelect(value);
    }
  }

  handleClick = (id) => {
    const { onClick } = this.props;
    if (onClick) {
      onClick(id);
    }
  }

  render() {
    const {
      onBack,
      data=[],
      fieldNames,
      month,
    } = this.props;
    const { id: idField, person: personField, total: totalField, abnormal: abnormalField } = {...defaultFieldNames, ...fieldNames};
    let total = 0;
    let abnormal = 0;
    // 获取总巡查次数和总异常次数
    data.forEach(item => {
      total += item[totalField];
      abnormal += item[abnormalField];
    });

    /* 表头 */
    const columns = [
      {
        title: '巡查人',
        dataIndex: personField,
        key: personField,
        render: (text, record) => <div style={{ color: '#00baff', cursor: 'pointer' }} onClick={() => {this.handleClick(record[idField]);}}>{text}</div>,
      },
      {
        title: '巡查次数',
        dataIndex: totalField,
        key: totalField,
        sorter: (a, b) => a[totalField] - b[totalField],
        defaultSortOrder: 'descend',
      },
      {
        title: '异常次数',
        dataIndex: abnormalField,
        key: abnormalField,
        sorter: (a, b) => a[abnormalField] - b[abnormalField],
        render: (text) => <span style={{ color: text > 0 ? '#ff4848' : undefined }}>{text}</span>,
      },
    ];

    return (
      <Section
        title={
          <Fragment>
            <span className={styles.title}>巡查记录</span>
            <span className={styles.splitLine} />
            <Select
              size="small"
              value={month}
              onSelect={this.handleSelect}
              className={styles.select}
              dropdownClassName={styles.dropDown}
            >
              {months.map(({ value }) => {
                const isSelected = month === value;
                return (
                  <Option key={value} value={value} style={{ backgroundColor: isSelected && '#00A9FF', color: isSelected && '#fff' }}>{value}</Option>
                );
              })}
            </Select>
            <span className={styles.inspectionCount}>共巡查 <span style={{ color: '#00baff' }}>{total}</span> 次，异常 <span style={{ color: '#FF4848' }}>{abnormal}</span> 次</span>
            <div className={styles.jumpButton} onClick={onBack}>单位巡查>></div>
          </Fragment>
        }
        hackHeight={38 * data.length}
        isScroll
      >
        <Table
          className={styles.table}
          size="small"
          dataSource={data}
          columns={columns}
          pagination={false}
          bordered={false}
          rowKey={idField}
        />
      </Section>
    );
  }
}
