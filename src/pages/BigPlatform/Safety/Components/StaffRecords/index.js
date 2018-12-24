import React, { PureComponent, Fragment } from 'react';
import { Table, Select } from 'antd'
import moment from 'moment';
import backIcon from 'assets/back.png';
import Section from '@/components/Section';
import Ellipsis from '@/components/Ellipsis';
import Switcher from '@/components/Switcher'
import HiddenDanger from '../../Company2/HiddenDanger';

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
    visible: false,
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

  render() {
    const {
      onBack,
      data=[],
      inspectionRecordData: {
        hiddenData=[],
      },
      fieldNames,
      month,
      // 显示隐患详情
      handleShowDetail,
      getInspectionRecordData,
    } = this.props;
    const { visible } = this.state;
    const { id: idField, person: personField, time: timeField, point: pointField, result: resultField } = {...defaultFieldNames, ...fieldNames};
    const total = data.length;
    const abnormal = data.filter(item => +item[resultField] !== 1).length;

    /* 表头 */
    const columns = [
      {
        title: '巡查人',
        dataIndex: personField,
        key: personField,
        width: 88,
      },
      {
        title: '巡查时间',
        dataIndex: timeField,
        key: timeField,
        width: 90,
        render: (text) => <span>{moment(+text).format('YYYY-MM-DD')}</span>,
      },
      {
        title: '巡查点位',
        dataIndex: pointField,
        key: pointField,
        render: (value, { item_id, status }) => {
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
              onClick={() => {handleShowDetail(item_id, status);}}
            >
              {value}
              {showLabel && <div style={{ position: 'absolute', right: 0, top: 0, width: 58, height: 21, lineHeight: '19px', color: '#ff4848', border: '1px solid #ff4848' }}>{+status === 2 ? '异常' : '已超时'}</div>}
            </span>
          );
        },
      },
      {
        title: '巡查结果',
        dataIndex: resultField,
        key: resultField,
        width: 88,
        render: (text, { check_id, status }) => {
          const isNormal = +text === 1;
          return (
            <span style={{ color: isNormal ? undefined : '#ff4848', cursor: isNormal ? 'auto' : 'pointer' }} onClick={() => {!isNormal && getInspectionRecordData(check_id, status, () => { this.setState({ visible: true }); });}}>{isNormal ? '正常':'异常'}</span>
          )
        },
      },
      {
        title: '隐患当前状态',
        dataIndex: 'rectification',
        key: 'rectification',
        width: 116,
        render: (value, { check_id, rectification, review, closed, overTime, status }) => {
          const isAlert = rectification + review + closed + overTime > 0;
          return (
            <div style={{ display: 'inline-block', width: 72, cursor: isAlert ? 'pointer' : 'auto' }} onClick={() => {isAlert && getInspectionRecordData(check_id, status, () => { this.setState({ visible: true }); });}}>{isAlert ? <Ellipsis lines={1} tooltip style={{ height: '1.5em' }}>{this.getResult({ rectification, review, closed, overTime })}</Ellipsis> : '---'}</div>
          );
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
        skip
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
        {hiddenData && (
          <Switcher
            visible={visible}
            style={{
              position: 'fixed',
              bottom: '0',
              left: '25%',
              right: '25%',
            }}
            onClose={() => this.setState({ visible: false })}
          >
            {hiddenData.map(({
              _id,
              _report_user_name,
              _report_time,
              _rectify_user_name,
              _plan_rectify_time,
              _review_user_name,
              business_type,
              _desc,
              path,
              _real_rectify_time,
              _review_time,
              object_title,
              hiddenStatus,
              typeName,
              risk_level,
            }) => (
              <HiddenDanger
                key={_id}
                style={{ marginBottom: 0, backgroundColor: '#062756' }}
                data={{
                  report_user_name: _report_user_name,
                  report_time: _report_time,
                  rectify_user_name: _rectify_user_name,
                  real_rectify_time: _real_rectify_time,
                  plan_rectify_time: _plan_rectify_time,
                  review_user_name: _review_user_name,
                  review_time: _review_time,
                  source_type_name: typeName,
                  companyBuildingItem: { object_title, risk_level },
                  desc: _desc,
                  business_type,
                  status: hiddenStatus,
                  hiddenDangerRecordDto: [{ fileWebUrl: path }],
                }}
              />
            ))}
          </Switcher>
        )}
      </Section>
    );
  }
}
