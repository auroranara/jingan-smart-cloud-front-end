import React, { PureComponent } from 'react';
import { Table, Select } from 'antd'
import moment from 'moment';
import classNames from 'classnames';
import Ellipsis from '@/components/Ellipsis';
import InspectionResult from '../InspectionResult';
import Section from '../Section';
// 引入样式文件
import styles from './index.less';
import selectStyles from '../../select.less';

const { Option } = Select;
const months = [...Array(12).keys()].map(month => ({
  value: moment().subtract(month, 'months').format('YYYY-MM'),
}));

/**
 * 巡查人员列表
 */
export default class StaffList extends PureComponent {
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
      inspectionRecordData: {
        hiddenData=[],
      }={},
      month,
      // 显示隐患详情
      handleShowDetail,
      getInspectionRecordData,
      loading,
    } = this.props;
    const total = data.length;
    const abnormal = data.filter(item => +item.fireCheckStatus !== 1).length;

    /* 表头 */
    const columns = [
      {
        title: '巡查人',
        dataIndex: 'user_name',
        key: 'user_name',
        width: 88,
        render: (text) => <span className={styles.cellValue}>{text}</span>,
      },
      {
        title: '巡查时间',
        dataIndex: 'check_date',
        key: 'check_date',
        width: 100,
        render: (text) => <span className={styles.cellValue}>{moment(+text).format('YYYY-MM-DD')}</span>,
      },
      {
        title: '巡查点位',
        dataIndex: 'object_title',
        key: 'object_title',
        render: (value, { item_id, status }) => {
          // 当前状态为异常或超时时显示文本
          const showLabel = +status === 2 || +status === 4;
          return (
            <span
              className={styles.cellValue}
              style={{
                position: 'relative',
                padding: showLabel ? '0 60px' : undefined,
                color: '#00ffff',
                cursor: 'pointer',
              }}
              onClick={() => {handleShowDetail(item_id, status);}}
            >
              <Ellipsis lines={1} tooltip className={styles.ellipsis}>{value}</Ellipsis>
              {showLabel && <div style={{ position: 'absolute', right: 0, top: 0, width: 58, height: 20, lineHeight: '18px', color: '#ff4848', border: '1px solid #ff4848' }}>{+status === 2 ? '异常' : '已超时'}</div>}
            </span>
          );
        },
      },
      {
        title: '巡查结果',
        dataIndex: 'fireCheckStatus',
        key: 'fireCheckStatus',
        width: 88,
        render: (text, { check_id, status }) => {
          const isNormal = +text === 1;
          return (
            <span className={styles.cellValue} style={{ color: isNormal ? undefined : '#ff4848', cursor: isNormal ? 'auto' : 'pointer' }} onClick={() => {!isNormal && getInspectionRecordData(check_id, status);}}>{isNormal ? '正常':'异常'}</span>
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
            <div className={styles.cellValue} style={{ width: 72, cursor: isAlert ? 'pointer' : 'auto' }} onClick={() => {isAlert && getInspectionRecordData(check_id, status);}}>{isAlert ? <Ellipsis lines={1} tooltip className={styles.ellipsis}>{this.getResult({ rectification, review, closed, overTime })}</Ellipsis> : '---'}</div>
          );
        },
      },
    ];

    return (
      <Section
        title={
          <div className={styles.titleWrapper}>
            <span className={styles.title}>巡查记录</span>
            <span className={styles.splitLine} />
            <Select
              value={month}
              onSelect={this.handleSelect}
              className={classNames(selectStyles.select, styles.select)}
              dropdownClassName={selectStyles.dropdown}
            >
              {months.map(({ value }) => (
                <Option key={value} value={value}>{value}</Option>
              ))}
            </Select>
            <span className={styles.inspectionCount}>共巡查 <span style={{ color: '#00ffff' }}>{total}</span> 次，异常 <span style={{ color: '#FF4848' }}>{abnormal}</span> 次</span>
          </div>
        }
        action={<span className={styles.jumpButton} onClick={onBack}></span>}
      >
        <Table
          className={styles.table}
          size="small"
          dataSource={data}
          columns={columns}
          pagination={false}
          bordered={false}
          rowKey="check_id"
          loading={loading}
        />
        {hiddenData && hiddenData.length > 0 && <InspectionResult />}
      </Section>
    );
  }
}
