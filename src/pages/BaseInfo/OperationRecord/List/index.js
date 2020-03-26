import React, { Component, Fragment } from 'react';
import { Input } from 'antd';
import SelectOrSpan from '@/jingan-components/SelectOrSpan';
import DatePickerOrSpan from '@/jingan-components/DatePickerOrSpan';
import InputOrSpan from '@/jingan-components/InputOrSpan';
import TablePage from '@/templates/TablePage';
import moment from 'moment';

const DEFAULT_FORMAT = 'YYYY-MM-DD HH:mm:ss';
export const TYPES = [
  { key: '1', value: '安全设施' },
  { key: '2', value: '监控设施' },
  { key: '3', value: '生产装置' },
  { key: '4', value: '特种设备' },
];
const TRANSFORM = (data) => {
  const { range: [startDate, endDate]=[], ...rest } = data || {};
  return {
    ...rest,
    startDate: startDate && startDate.format('YYYY-MM-DD'),
    endDate: endDate && endDate.format('YYYY-MM-DD'),
  };
};

export default class OperationRecordList extends Component {
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
      id: 'equipType',
      label: '设备设施类型',
      render: () => <SelectOrSpan placeholder="请选择设备设施类型" list={TYPES} allowClear />,
    },
    {
      id: 'range',
      label: '运维时间',
      // span: {
      //   xl: 16,
      //   sm: 24,
      //   xs: 24,
      // },
      render: () => <DatePickerOrSpan placeholder={['开始时间', '结束时间']} allowClear type="RangePicker" style={{ width: '100%' }} />,
      options: {
        initialValue: [],
      },
    },
  ])

  getAction = ({
    renderAddButton,
  }) => (
    <Fragment>
      {renderAddButton()}
    </Fragment>
  )

  getColumns = ({
    unitId,
    list,
    renderDetailButton,
    renderEditButton,
    renderDeleteButton,
  }) => ([
    ...(!unitId ? [
      {
        title: '单位名称',
        dataIndex: 'companyName',
        align: 'center',
      },
    ] : []),
    {
      title: '设备设施类型',
      dataIndex: 'equipType',
      render: value => <SelectOrSpan list={TYPES} type="span" value={`${value}`} />,
      align: 'center',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      render: time => time && moment(time).format(DEFAULT_FORMAT),
      align: 'center',
    },
    {
      title: '运维时间',
      dataIndex: 'operaDate',
      render: time => time && moment(time).format('YYYY-MM-DD'),
      align: 'center',
    },
    {
      title: '运维人员',
      dataIndex: 'operaPerson',
      align: 'center',
    },
    {
      title: '运维评价',
      dataIndex: 'operaEvaluation',
      render: value => <InputOrSpan value={value} type="span" style={{ padding: 0, maxWidth: 256 }} />,
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'id',
      width: 164,
      fixed: list && list.length ? 'right' : false,
      render: id => (
        <Fragment>
          {renderDetailButton(id)}
          {renderEditButton(id)}
          {renderDeleteButton(id)}
        </Fragment>
      ),
      align: 'center',
    },
  ])

  render() {
    const props = {
      fields: this.getFields,
      action: this.getAction,
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
