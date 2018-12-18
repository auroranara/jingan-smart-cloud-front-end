import React, { PureComponent, Fragment } from 'react';
import { Table, Select } from 'antd'
import moment from 'moment';
import backIcon from 'assets/back.png';
import Section from '@/components/Section';
import Ellipsis from '@/components/Ellipsis';

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
   * 获取处理结果
   */
  getResult = ({ rectification=0, review=0, closed=0, overTime=0 }={}) => {
    return (
      <span>
        {overTime > 0 && <span style={{ color: '#ff4848' }}>已超期-{overTime}{(rectification > 0 || review > 0 || closed > 0) && '/'}</span>}
        {rectification > 0 && <span>待整改-{rectification}{(review > 0 || closed > 0) && '/'}</span>}
        {review > 0 && <span>待复查-{review}{closed > 0 && '/'}</span>}
        {closed > 0 && <span>已关闭-{closed}</span>}
      </span>
    )
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
      // 显示隐患详情
      handleShowDetail,
    } = this.props;
    // const { hiddenDanger } = this.state;
    const { id: idField, person: personField, time: timeField, point: pointField, result: resultField } = {...defaultFieldNames, ...fieldNames};
    const total = data.length;
    const abnormal = data.filter(item => +item[resultField] !== 1).length;
    // const list = hiddenDanger && hiddenDanger.map(({
    //   _id,
    //   _desc,
    //   _report_user_name,
    //   _report_time,
    //   _rectify_user_name,
    //   _plan_rectify_time,
    //   _real_rectify_time,
    //   _review_user_name,
    //   _review_time,
    //   hiddenStatus,
    //   _path,
    //   business_type,
    // }) => ({
    //   id: _id,
    //   description: _desc,
    //   sbr: _report_user_name,
    //   sbsj: moment(+_report_time).format('YYYY-MM-DD'),
    //   zgr: _rectify_user_name,
    //   plan_zgsj: moment(+_plan_rectify_time).format('YYYY-MM-DD'),
    //   real_zgsj: moment(+_real_rectify_time).format('YYYY-MM-DD'),
    //   fcr: _review_user_name,
    //   fcsj: _review_time && moment(+_review_time).format('YYYY-MM-DD'),
    //   status: +hiddenStatus,
    //   background: _path,
    //   businessType: business_type,
    // }));

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
        width: 88,
        render: (text) => <span>{moment(+text).format('YYYY-MM-DD')}</span>,
      },
      {
        title: '巡查点位',
        dataIndex: pointField,
        key: pointField,
        render: (value, { check_id, status }) => {
          // 当前状态为异常或超时时显示文本
          const showLabel = +status === 2 || +status === 4;
          return (
            <span
              style={{
                display: 'inline-block',
                position: 'relative',
                padding: showLabel ? '0 66px' : undefined,
                color: '#00baff',
                cursor: 'pointer',
              }}
              onClick={() => {handleShowDetail(check_id);}}
            >
              {value}
              {showLabel && <div style={{ position: 'absolute', right: 0, top: 0, bottom: 0, width: 58, lineHeight: '19px', color: '#ff4848', border: '1px solid #ff4848' }}>{+status === 2 ? '异常' : '已超时'}</div>}
            </span>
          );
        },
      },
      {
        title: '巡查结果',
        dataIndex: resultField,
        key: resultField,
        width: 72,
        render: (text) => {
          const isNormal = +text === 1;
          return (
            <span style={{ color: isNormal ? undefined : '#ff4848' }}>{isNormal ? '正常':'异常'}</span>
          )
        },
      },
      {
        title: '隐患当前状态',
        dataIndex: 'rectification',
        key: 'rectification',
        width: 100,
        render: (value, { rectification, review, closed, overTime }) => rectification + review + closed + overTime > 0 ? <Ellipsis lines={1} tooltip style={{ width: 72, height: '1.5em' }}>{this.getResult({ rectification, review, closed, overTime })}</Ellipsis> : '---',
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
          // rowClassName={record => +record[resultField] === 1 ? '' : styles.abnormal }
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
