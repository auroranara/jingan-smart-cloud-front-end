import React, { Component } from 'react';
import { Input } from 'antd';
import SelectOrSpan from '@/jingan-components/SelectOrSpan';
import DatePickerOrSpan from '@/jingan-components/DatePickerOrSpan';
import MonitorTypeSelect from '@/jingan-components/MonitorTypeSelect';
import MajorHazardSelect from '../components/MajorHazardSelect';
import MonitorObjectSelect from '../components/MonitorObjectSelect';
import Ellipsis from '@/components/Ellipsis';
import TablePage from '@/templates/TablePage';
import moment from 'moment';

export const DEFAULT_FORMAT = 'YYYY-MM-DD HH:mm:ss';
export const STATUSES = [
  { key: '0', value: '预警' },
  { key: '1', value: '告警' },
  { key: '7', value: '火警' },
  { key: '2', value: '失联' },
  { key: '3', value: '故障' },
  { key: '4', value: '报警解除' },
  { key: '5', value: '恢复在线' },
  { key: '6', value: '故障消除' },
];
export const STATUS_MAPPER = [
  { statusType: -1, warnLevel: 1 },
  { statusType: -1, warnLevel: 2, fixType: -1 },
  { statusType: -2 },
  { statusType: -3 },
  { statusType: 1 },
  { statusType: 2 },
  { statusType: 3 },
  { statusType: -1, fixType: 5 },
];
export const GET_STATUS_NAME = ({ statusType, warnLevel, fixType }) => {
  if (+statusType === -1) {
    if (+fixType === 5) {
      return '火警';
    } else if (+warnLevel === 1) {
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
const TRANSFORM = data => {
  const {
    statusType,
    range: [startTime, endTime] = [],
    majorHazard: [dangerSource, dangerSourceId] = [],
    monitorObject: [beMonitorTargetType, beMonitorTargetId] = [],
    ...rest
  } = data || {};
  return {
    ...rest,
    ...STATUS_MAPPER[statusType],
    startTime: startTime && startTime.format(DEFAULT_FORMAT),
    endTime: endTime && endTime.format(DEFAULT_FORMAT),
    dangerSource,
    dangerSourceId: dangerSourceId && dangerSourceId.key,
    beMonitorTargetType,
    beMonitorTargetId: beMonitorTargetId && beMonitorTargetId.key,
  };
};

export default class AlarmMessage extends Component {
  empty = true;

  getRangeFromEvent = range => {
    const empty = !(range && range.length);
    const result = this.empty && !empty ? [range[0].startOf('day'), range[1].endOf('day')] : range;
    this.empty = empty;
    return result;
  };

  getFields = ({ unitId }) => [
    ...(!unitId
      ? [
          {
            id: 'companyName',
            label: '单位名称',
            transform: value => value.trim(),
            render: ({ handleSearch }) => (
              <Input placeholder="请输入单位名称" onPressEnter={handleSearch} maxLength={50} />
            ),
          },
        ]
      : []),
    {
      id: 'monitorEquipmentTypes',
      label: '监测类型',
      render: () => <MonitorTypeSelect allowClear />,
    },
    {
      id: 'monitorEquipmentAreaLocation',
      label: '报警区域位置',
      transform: value => value.trim(),
      render: ({ handleSearch }) => (
        <Input placeholder="请输入报警区域位置" onPressEnter={handleSearch} maxLength={50} />
      ),
    },
    {
      id: 'range',
      label: '发生时间',
      // span: {
      //   xl: 16,
      //   sm: 24,
      //   xs: 24,
      // },
      render: () => (
        <DatePickerOrSpan
          placeholder={['开始时间', '结束时间']}
          format={DEFAULT_FORMAT}
          showTime
          allowClear
          type="RangePicker"
          style={{ width: '100%' }}
        />
      ),
      options: {
        getValueFromEvent: this.getRangeFromEvent,
      },
    },
    {
      id: 'statusType',
      label: '消息类型',
      render: () => <SelectOrSpan placeholder="请选择消息类型" list={STATUSES} allowClear />,
    },
    {
      id: 'majorHazard',
      label: '重大危险源',
      render: () => <MajorHazardSelect />,
    },
    {
      id: 'monitorObject',
      label: '监测对象',
      render: () => <MonitorObjectSelect />,
    },
  ];

  getColumns = ({ unitId }) => [
    ...(!unitId
      ? [
          {
            title: '单位名称',
            dataIndex: 'companyName',
            align: 'center',
          },
        ]
      : []),
    {
      title: '监测类型',
      dataIndex: 'monitorEquipmentTypeName',
      align: 'center',
    },
    {
      title: '监测对象类型',
      dataIndex: 'beMonitorTargetTypeName',
      align: 'center',
    },
    {
      title: '监测对象',
      dataIndex: 'beMonitorTargetName',
      align: 'center',
    },
    {
      title: '消息类型',
      dataIndex: 'statusType',
      render: (_, data) => GET_STATUS_NAME(data),
      align: 'center',
    },
    {
      title: '发生时间',
      dataIndex: 'happenTime',
      render: time => time && moment(time).format(DEFAULT_FORMAT),
      align: 'center',
    },
    {
      title: '消息内容',
      dataIndex: 'messageContent',
      render: value => <div style={{ textAlign: 'left', whiteSpace: 'pre-line' }}>{value}</div>,
      align: 'center',
    },
    {
      title: '接收人',
      dataIndex: 'mailAcceptUsers',
      render: value =>
        value &&
        value.length > 0 && (
          <div style={{ textAlign: 'left' }}>
            站内信：
            <Ellipsis length={20} tooltip>
              {value
                .map(
                  ({ accept_user_name, status }) =>
                    `${accept_user_name}（${+status === 1 ? '未读' : '已读'}）`
                )
                .join('，')}
            </Ellipsis>
          </div>
        ),
      align: 'center',
    },
  ];

  render() {
    const {
      location: { query },
    } = this.props;
    const props = {
      fields: this.getFields,
      columns: this.getColumns,
      transform: TRANSFORM,
      initialValues: query.majorHazard
        ? {
            majorHazard: query.majorHazard,
          }
        : null,
      ...this.props,
    };

    return <TablePage {...props} />;
  }
}
