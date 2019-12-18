import React, { Component, Fragment } from 'react';
import { Input } from 'antd';
import SelectOrSpan from '@/jingan-components/SelectOrSpan';
import DatePickerOrSpan from '@/jingan-components/DatePickerOrSpan';
import MonitorTypeSelect from '@/jingan-components/MonitorTypeSelect';
import TablePage from '@/templates/TablePage';
import moment from 'moment';
import classNames from 'classnames';
import router from 'umi/router';
import styles from './index.less';

export const DEFAULT_FORMAT = 'YYYY-MM-DD HH:mm:ss';
export const STATUSES = [
  { key: '2', value: '待处理' },
  { key: '0', value: '处理中' },
  { key: '1', value: '已处理' },
];
const TRANSFORM = (data) => {
  const { range: [startTime, endTime]=[], ...rest } = data || {};
  return {
    ...rest,
    queryCreateStartDate: startTime && startTime.format(DEFAULT_FORMAT),
    queryCreateEndDate: endTime && endTime.format(DEFAULT_FORMAT),
  };
};

export default class AlarmWorkOrderList extends Component {
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
      id: 'reportType',
      label: '监测类型',
      render: () => <MonitorTypeSelect allowClear />,
    },
    {
      id: 'deviceName',
      label: '设备名称/主机编号',
      transform: value => value.trim(),
      render: ({ handleSearch }) => <Input placeholder="请输入监测设备名称" onPressEnter={handleSearch} maxLength={50} />,
    },
    {
      id: 'areaLocation',
      label: '报警区域位置',
      transform: value => value.trim(),
      render: ({ handleSearch }) => <Input placeholder="请输入报警区域位置" onPressEnter={handleSearch} maxLength={50} />,
    },
    {
      id: 'range',
      label: '工单创建时间',
      // span: {
      //   xl: 16,
      //   sm: 24,
      //   xs: 24,
      // },
      render: () => <DatePickerOrSpan placeholder={['开始时间', '结束时间']} allowClear type="RangePicker" style={{ width: '100%' }} />,
    },
    {
      id: 'status',
      label: '处理状态',
      render: () => <SelectOrSpan placeholder="请选择处理状态" list={STATUSES} allowClear />,
    },
  ])

  // getAction = ({
  //   renderExportButton,
  // }) => (
  //   <Fragment>
  //     {renderExportButton()}
  //   </Fragment>
  // )

  getColumns = ({
    unitId,
    list,
    renderDetailButton,
    renderMonitorTrendButton,
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
      dataIndex: 'reportTypeName',
      align: 'center',
    },
    {
      title: '设备名称/主机编号',
      dataIndex: 'deviceName',
      align: 'center',
    },
    {
      title: '区域位置',
      dataIndex: 'areaLocation',
      align: 'center',
    },
    {
      title: '工单创建时间',
      dataIndex: 'createDate',
      render: (time) => time && moment(time).format(DEFAULT_FORMAT),
      align: 'center',
    },
    {
      title: '处理状态',
      dataIndex: 'status',
      render: (value) => <SelectOrSpan list={STATUSES} value={`${value}`} type="span" />,
      align: 'center',
    },
    {
      title: '工单结束时间',
      dataIndex: 'endDate',
      render: (time) => time && moment(time).format(DEFAULT_FORMAT),
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'id',
      width: 132,
      fixed: list && list.length ? 'right' : undefined,
      render: (id, { reportType }) => (
        <Fragment>
          <div>
            {renderDetailButton(id)}
          </div>
          {+reportType !== 1 && (
            <div>
              {renderMonitorTrendButton(id)}
            </div>
          )}
        </Fragment>
      ),
      align: 'center',
    },
    {
      title: '消息通知',
      dataIndex: 'msgCount',
      width: 132,
      fixed: list && list.length ? 'right' : undefined,
      render: (value, { id }) => <span>已发送 <span className={classNames(styles.clickable, !+value && styles.disabled)} onClick={value > 0 ? this.handleClick : undefined} data-id={id}>{value || 0}条</span></span>,
      align: 'center',
    },
  ])

  handleClick = ({ target: { dataset: { id } } }) => {
    const { route: { path, name } } = this.props;
    router.push(path.replace(new RegExp(`${name}.*`), `detail/${id}`));
  }

  render() {
    const props = {
      fields: this.getFields,
      action: this.getAction,
      columns: this.getColumns,
      transform: TRANSFORM,
      otherOperation: [
        {
          code: 'detail',
          name: '查看详情',
        },
        {
          code: 'monitorTrend',
          name: '查看监测趋势',
        },
      ],
      ...this.props,
    };

    return (
      <TablePage
        {...props}
      />
    );
  }
}
