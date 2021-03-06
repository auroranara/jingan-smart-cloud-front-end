content 页面头部内容
error=true 接口报错时是否提示
fields 控件栏配置对象
action 控件栏其余按钮
columns 表格配置对象
transform 转换控件值以后作为接口参数
withUnitId 是否将unitId作为参数传入getList接口
otherOperation 其他操作按钮

示例

```javascript
import React, { Component } from 'react';
import { Input } from 'antd';
import SelectOrSpan from '@/jingan-components/SelectOrSpan';
import DatePickerOrSpan from '@/jingan-components/DatePickerOrSpan';
import MonitorTypeSelect from '@/jingan-components/MonitorTypeSelect';
import TablePage from '@/templates/TablePage';
import moment from 'moment';

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

export default class AlarmMessage extends Component {
  empty = true

  getRangeFromEvent = (range) => {
    const empty = !(range && range.length);
    const result = this.empty && !empty ? [range[0].startOf('day'), range[1].endOf('day')] : range;
    this.empty = empty;
    return result;
  }

  getFields = ({
    unitId,
  }) => ([
    ...(!unitId ? [
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
      render: () => <MonitorTypeSelect allowClear />,
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
      options: {
        getValueFromEvent: this.getRangeFromEvent,
      },
    },
    {
      id: 'statusType',
      label: '消息类型',
      render: () => <SelectOrSpan placeholder="请选择消息类型" list={TYPES} allowClear />,
    },
  ])

  getColumns = ({
    unitId,
  }) => ([
    ...(!unitId ? [
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
          {value.split('\n').map(v => <div key={v}>{v}</div>)}
        </div>
      ),
      align: 'center',
    },
  ])

  render() {
    const props = {
      fields: this.getFields,
      columns: this.getColumns,
      transform: TRANSFORM,
      ...this.props,
    };

    return (
      <TablePage
        {...props}
      />
    );
  }
}
```
