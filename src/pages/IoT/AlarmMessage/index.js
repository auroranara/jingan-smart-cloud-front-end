import React, { Component } from 'react';
import { Input } from 'antd';
import SelectOrSpan from '@/jingan-components/SelectOrSpan';
import DatePickerOrSpan from '@/jingan-components/DatePickerOrSpan';
import TablePage from '@/templates/TablePage';
import MonitorTypeSelect from './components/MonitorTypeSelect';
import { connect } from 'dva';
import moment from 'moment';

const TITLE = '报警消息';
const BREADCRUMB_LIST = [
  { title: '首页', name: '首页', href: '/' },
  { title: '物联网监测', name: '物联网监测' },
  { title: TITLE, name: TITLE },
];
const GET_LIST = 'alarmMessage/getList';
const REMOVE = 'alarmMessage/remove';
const EXPORT_LIST = 'alarmMessage/exportList';
const DEFAULT_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const TYPES = [
  { key: '0', value: '预警' },
  { key: '1', value: '告警' },
  { key: '2', value: '失联' },
  { key: '3', value: '故障' },
  { key: '4', value: '报警解除' },
  { key: '5', value: '恢复在线' },
  { key: '6', value: '故障消除' },
];
const TYPE_MAPPER = [
  { statusType: -1, warnLevel: 1 },
  { statusType: -1, warnLevel: 2 },
  { statusType: -2 },
  { statusType: -3 },
  { statusType: 1 },
  { statusType: 2 },
  { statusType: 3 },
];
const GET_TYPE_NAME = ({ statusType, warnLevel }) => {
  if (+statusType === -1) {
    if (+warnLevel === 1) {
      return '预警';
    } else if (+warnLevel === 2) {
      return '告警';
    }
  } else if (+statusType === -2) {
    return '失联';
  } else if (+statusType === -3) {
    return '故障';
  } else if (+statusType === 1) {
    return '报警解除';
  } else if (+statusType === 2) {
    return '恢复在线';
  } else if (+statusType === 3) {
    return '故障消除';
  }
};
const TRANSFORM = (data) => {
  const { statusType, range: [startTime, endTime]=[], ...rest } = data || {};
  return {
    ...rest,
    ...TYPE_MAPPER[statusType],
    startTime: startTime && startTime.format(DEFAULT_FORMAT),
    endTime: endTime && endTime.format(DEFAULT_FORMAT),
  };
};

@connect(({
  user,
  alarmMessage,
  loading,
}) => ({
  user,
  alarmMessage,
  loading: loading.effects[GET_LIST] || loading.effects[REMOVE] || loading.effects[EXPORT_LIST],
}), dispatch => ({
  getList(payload, callback) {
    dispatch({
      type: GET_LIST,
      payload,
      callback,
    });
  },
  remove(payload, callback) {
    dispatch({
      type: REMOVE,
      payload,
      callback,
    });
  },
  exportList(payload, callback) {
    dispatch({
      type: EXPORT_LIST,
      payload,
      callback,
    });
  },
}))
export default class AlarmMessage extends Component {
  render() {
    const {
      user: {
        currentUser: {
          unitType,
        },
      },
      alarmMessage: {
        list,
      },
      getList,
      remove,
      exportList,
      loading,
    } = this.props;
    const isNotCompany = +unitType !== 4;
    const fields = [
      ...(isNotCompany ? [
        {
          id: 'companyName',
          label: '单位名称',
          transform: value => value.trim(),
          render: ({ handleSearch }) => <Input placeholder="请输入单位名称" onPressEnter={handleSearch} maxLength={50} />,
        },
      ] : []),
      {
        id: 'monitorType',
        label: '监测类型',
        render: () => <MonitorTypeSelect />,
      },
      {
        id: 'monitorEquipmentAreaLocation',
        label: '报警区域位置',
        transform: value => value.trim(),
        render: ({ handleSearch }) => <Input placeholder="请输入报警区域位置" onPressEnter={handleSearch} maxLength={50} />,
      },
      {
        id: 'range',
        label: '发生时间',
        // span: {
        //   xl: 16,
        //   sm: 24,
        //   xs: 24,
        // },
        render: () => <DatePickerOrSpan placeholder={['开始时间', '结束时间']} format={DEFAULT_FORMAT} showTime allowClear type="RangePicker" style={{ width: '100%' }} />,
      },
      {
        id: 'statusType',
        label: '消息类型',
        render: () => <SelectOrSpan placeholder="请选择消息类型" list={TYPES} allowClear />,
      },
    ];
    const columns = [
      ...(isNotCompany ? [
        {
          title: '单位名称',
          dataIndex: 'companyName',
          align: 'center',
        },
      ] : []),
      {
        title: '监测类型',
        dataIndex: 'monitorTypeName',
        align: 'center',
      },
      {
        title: '消息类型',
        dataIndex: 'statusType',
        render: (_, data) => GET_TYPE_NAME(data),
        align: 'center',
      },
      {
        title: '发生时间',
        dataIndex: 'happenTime',
        render: (time) => time && moment(time).format(DEFAULT_FORMAT),
        align: 'center',
      },
      {
        title: '消息内容',
        dataIndex: 'messageContent',
        render: (value) => value && (
          <div style={{ textAlign: 'left' }}>
            {value.split('\n').map(v => <div>{v}</div>)}
          </div>
        ),
        align: 'center',
      },
    ];
    const props = {
      title: TITLE,
      breadcrumbList: BREADCRUMB_LIST,
      permissions: {
        export: true,
      },
      list,
      getList,
      remove,
      exportList,
      loading,
      addEnable: false,
      // exportEnable: true,
      operateEnable: false,
      fields,
      columns,
      transform: TRANSFORM,
    };

    return (
      <TablePage
        {...props}
      />
    );
  }
}
