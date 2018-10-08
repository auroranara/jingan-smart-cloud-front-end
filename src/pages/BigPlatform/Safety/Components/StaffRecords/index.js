import React, { PureComponent, Fragment } from 'react';
import { Table, Select } from 'antd'
import moment from 'moment';
import backIcon from 'assets/back.png';
import Section from '@/components/Section';
import Switcher from '@/components/Switcher'
import HiddenDanger from '../HiddenDanger';

import styles from './index.less';
const { Option } = Select;

const currentMonth = moment().get('month');
const months = [...Array(currentMonth+1).keys()].map(month => ({
  value: moment({ month: currentMonth-month }).format('YYYY-MM'),
}));
const defaultFieldNames = {
  id: 'id',
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
    hiddenDanger: null,
  }

  /**
   * 下拉框选择事件
   */
  handleSelect = (value) => {
    const { onSelect } = this.props;
    if (onSelect) {
      onSelect(value);
    }
  }

  /**
   * 修改隐患数据
   */
  setHiddenDanger = (hiddenDanger) => {
    this.setState({
      hiddenDanger,
    });
  }

  render() {
    const {
      onBack,
      data=[],
      fieldNames,
      month,
    } = this.props;
    const { hiddenDanger } = this.state;
    const { id: idField, person: personField, time: timeField, point: pointField, result: resultField } = {...defaultFieldNames, ...fieldNames};
    const total = data.length;
    const abnormal = data.filter(item => +item[resultField] !== 1).length;

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
        render: (text) => <span>{moment(+text).format('YYYY-MM-DD')}</span>,
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
        render: (text, { card }) => {
          const isNormal = +text === 1;
          return (
            <div style={{ cursor: isNormal?undefined:'pointer' }} onClick={isNormal?undefined:() => this.setHiddenDanger(card)}>{isNormal ? '正常':'异常'}</div>
          )
        },
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
            <div className={styles.jumpButton} onClick={onBack}><img src={backIcon} alt="" /></div>
          </Fragment>
        }
        hackHeight={data.length > 0 ? (38 * data.length + 37) : 38}
        isScroll
      >
        <Table
          className={styles.table}
          rowClassName={record => +record[resultField] === 1 ? '' : styles.abnormal }
          size="small"
          dataSource={data}
          columns={columns}
          pagination={false}
          bordered={false}
          rowKey={idField}
        />
        {hiddenDanger && (
          <Switcher
            visible={true}
            style={{
              position: 'fixed',
              bottom: '0',
              left: '25%',
              right: '25%',
            }}
            onClose={() => this.setHiddenDanger(null)}
          >
            {hiddenDanger.map(item => (
              <HiddenDanger
                key={item._id}
                style={{ marginBottom: 0 }}
                data={item}
                fieldNames={{
                  description: '_desc',
                  sbr: '_report_user_name',
                  sbsj: '_report_time',
                  zgr: '_rectify_user_name',
                  plan_zgsj: '_plan_rectify_time',
                  real_zgsj: '_real_rectify_time',
                  fcr: '_review_user_name',
                  status: 'hiddenStatus',
                  background: '_path',
                }}
              />
            ))}
          </Switcher>
        )}
      </Section>
    );
  }
}
