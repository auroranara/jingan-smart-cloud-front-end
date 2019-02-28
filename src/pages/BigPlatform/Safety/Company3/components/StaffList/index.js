import React, { PureComponent } from 'react';
import { Table, Select } from 'antd'
import moment from 'moment';
import Section from '../Section';
// 引入样式文件
import styles from './index.less';

const { Option } = Select;
const months = [...Array(12).keys()].map(month => ({
  value: moment().subtract(month, 'months').format('YYYY-MM'),
}));

/**
 * 巡查人员列表
 */
export default class StaffList extends PureComponent {
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
      month,
    } = this.props;
    let total = 0;
    let abnormal = 0;
    // 获取总巡查次数和总异常次数
    data.forEach(item => {
      total += item.totalCheck;
      abnormal += item.abnormal;
    });

    /* 表头 */
    const columns = [
      {
        title: '巡查人',
        dataIndex: 'user_name',
        key: 'user_name',
        render: (text, record) => <div style={{ color: '#00ffff', cursor: 'pointer' }} onClick={() => {this.handleClick(record.check_user_id);}}>{text}</div>,
      },
      {
        title: '巡查次数',
        dataIndex: 'totalCheck',
        key: 'totalCheck',
        sorter: (a, b) => a.totalCheck - b.totalCheck,
        defaultSortOrder: 'descend',
      },
      {
        title: '异常次数',
        dataIndex: 'abnormal',
        key: 'abnormal',
        sorter: (a, b) => a.abnormal - b.abnormal,
        render: (text) => <span style={{ color: text > 0 ? '#ff4848' : undefined }}>{text}</span>,
      },
    ];

    return (
      <Section
        title={
          <div className={styles.titleWrapper}>
            <span className={styles.title}>巡查记录</span>
            <span className={styles.splitLine} />
            <Select
              // size="small"
              value={month}
              onSelect={this.handleSelect}
              className={styles.select}
              dropdownClassName={styles.dropDown}
            >
              {months.map(({ value }) => {
                const isSelected = month === value;
                return (
                  <Option key={value} value={value} style={{ color: isSelected && '#00ffff' }}>{value}</Option>
                );
              })}
            </Select>
            <span className={styles.inspectionCount}>共巡查 <span style={{ color: '#00ffff' }}>{total}</span> 次，异常 <span style={{ color: '#FF4848' }}>{abnormal}</span> 次</span>
          </div>
        }
        action={<span className={styles.jumpButton} onClick={onBack}>单位巡查>></span>}
      >
        <Table
          className={styles.table}
          size="small"
          dataSource={data}
          columns={columns}
          pagination={false}
          bordered={false}
          rowKey="check_user_id"
        />
      </Section>
    );
  }
}
