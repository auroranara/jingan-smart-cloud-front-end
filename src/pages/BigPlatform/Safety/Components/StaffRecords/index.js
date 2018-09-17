import React, { PureComponent, Fragment } from 'react';
import { Table, Select } from 'antd'
import moment from 'moment';
import backIcon from 'assets/back.png';
import Section from '../../../UnitFireControl/components/Section/Section';

import styles from './index.less';
const { Option } = Select;

const currentMonth = moment().get('month');
const months = [...Array(currentMonth+1).keys()].map(month => ({
  value: moment({ month: currentMonth-month }).format('YYYY-MM'),
}));
const defaultFieldNames = {
  person: 'person',
  time: 'time',
  point: 'point',
  result: 'result',
};
/**
 * 单位巡查人员巡查记录
 */
export default class App extends PureComponent {
  state={
    // 当前选中的月份
    selectedMonth: months[0].value,
    // 是否是通过下拉框修改的源数据
    isChangedBySelect: false,
  }

  componentDidUpdate({ data: prevData }) {
    const { data } = this.props;
    const { isChangedBySelect } = this.state;
    // 当源数据发生变化时，修改当前选择的月份为当前月份
    if (data !== prevData) {
      if (isChangedBySelect) {
        this.setState({
          isChangedBySelect: false,
        });
      }
      else {
        this.setState({
          selectedMonth: months[0].value,
        });
      }
    }
  }

  handleSelect = (value) => {
    const { onSelect } = this.props;
    this.setState({
      selectedMonth: value,
      isChangedBySelect: true,
    });
    if (onSelect) {
      onSelect(value);
    }
  }

  render() {
    const {
      onMouseEnter,
      onMouseLeave,
      onBack,
      data=[
        {
          person: '1',
          time: '1',
          point: '1',
          result: 1,
        },
        {
          person: '2',
          time: '2',
          point: '2',
          result: 0,
        },
      ],
      total=0,
      abnormal=0,
      fieldNames,
    } = this.props;
    const { selectedMonth } = this.state;
    const { person: personField, time: timeField, point: pointField, result: resultField } = {...defaultFieldNames, ...fieldNames};

    /* 表头 */
    const columns = [
      {
        title: '巡查人',
        dataIndex: personField,
        key: personField,
      },
      {
        title: '巡查时间',
        dataIndex: timeField,
        key: timeField,
      },
      {
        title: '巡查点位',
        dataIndex: pointField,
        key: pointField,
      },
      {
        title: '巡查结果',
        dataIndex: resultField,
        key: resultField,
        render: (text) => <div style={{ cursor: 'pointer' }} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>{text ? '异常':'正常'}</div>,
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
              value={selectedMonth}
              onSelect={this.handleSelect}
              className={styles.select}
              dropdownClassName={styles.dropDown}
            >
              {months.map(({ value }) => {
                const isSelected = selectedMonth === value;
                return (
                  <Option key={value} value={value} style={{ backgroundColor: isSelected && '#00A9FF', color: isSelected && '#fff' }}>{value}</Option>
                );
              })}
            </Select>
            <span className={styles.inspectionCount}>共巡查 <span style={{ color: '#00baff' }}>{total}</span> 次，异常 <span style={{ color: '#FF4848' }}>{abnormal}</span> 次</span>
            <div className={styles.jumpButton} onClick={onBack}><img src={backIcon} alt="" /></div>
          </Fragment>
        }
      >
        <Table
          className={styles.table}
          rowClassName={({ result }) => result ? styles.abnormal : '' }
          size="small"
          dataSource={data}
          columns={columns}
          pagination={false}
          bordered={false}
          rowKey={personField}
        />
      </Section>
    );
  }
}
