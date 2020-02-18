import React, { Component } from 'react';
import { Input } from 'antd';
import TablePage from '@/templates/TablePage';
import SelectOrSpan from '@/jingan-components/SelectOrSpan';
import DatePickerOrSpan from '@/jingan-components/DatePickerOrSpan';
import Company from '../../Company';
import { connect } from 'dva';
import moment from 'moment';
import { LICENCE_PLATE_TYPES } from '../../VehicleManagement/List';
import { DIRECTIONS } from '../../ChannelManagement/List';
import styles from './index.less';

export const BREADCRUMB_LIST = [
  { title: '首页', name: '首页', href: '/' },
  { title: '人员在岗在位管理', name: '人员在岗在位管理' },
  { title: '车牌识别系统', name: '车牌识别系统' },
  { title: '报表查询', name: '报表查询' },
];
const DEFAULT_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const MAPPER = {
  namespace: 'licensePlateRecognitionSystem',
  list: 'presenceRecordList',
  getList: 'getPresenceRecordList',
  exportList: 'exportPresenceRecordList',
};

@connect(({ user }) => ({
  user,
}))
export default class PresenceRecord extends Component {
  empty = true;

  shouldComponentUpdate(nextProps) {
    return nextProps.match.params.unitId !== this.props.match.params.unitId;
  }

  getRangeFromEvent = range => {
    const empty = !(range && range.length);
    const result = this.empty && !empty ? [range[0].startOf('day'), range[1].endOf('day')] : range;
    this.empty = empty;
    return result;
  };

  transform = ({ unitId, ...props }) => ({
    // unitId, // 这个接接口时重点关注一下
    ...props,
  });

  getBreadcrumbList = ({ isUnit }) =>
    BREADCRUMB_LIST.concat(
      [
        !isUnit && {
          title: '单位在场记录',
          name: '单位在场记录',
          href: this.props.route.path.replace(/\/:[^\/]*/g, ''),
        },
        { title: '在场记录', name: '在场记录' },
      ].filter(v => v)
    );

  getContent = ({ list: { pagination: { total } = {} } = {} }) => (
    <span>
      总数：
      {total || 0}
    </span>
  );

  getFields = () => [
    // {
    //   id: 'name',
    //   transform: v => v.trim(),
    //   render: ({ onSearch }) => (
    //     <Input placeholder="请输入所属单位" maxLength={50} onPressEnter={onSearch} />
    //   ),
    // },
    {
      id: 'licencePlate',
      transform: v => v.trim(),
      render: ({ onSearch }) => (
        <Input placeholder="请输入车牌" maxLength={50} onPressEnter={onSearch} />
      ),
    },
    {
      id: 'licencePlateType',
      render: () => (
        <SelectOrSpan placeholder="请选择车牌类型" list={LICENCE_PLATE_TYPES} allowClear />
      ),
    },
    {
      id: 'channelName',
      transform: v => v.trim(),
      render: ({ onSearch }) => (
        <Input placeholder="请输入通道名称" maxLength={50} onPressEnter={onSearch} />
      ),
    },
    {
      id: 'direction',
      render: () => <SelectOrSpan placeholder="请选择通道方向" list={DIRECTIONS} allowClear />,
    },
    {
      id: 'range',
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
  ];

  getAction = ({ renderExportButton }) => renderExportButton({ name: '导出报表' });

  getColumns = () => [
    {
      title: '车牌',
      dataIndex: 'licencePlate',
      align: 'center',
    },
    {
      title: '车牌类型',
      dataIndex: 'licencePlateType',
      align: 'center',
      render: value => <SelectOrSpan list={LICENCE_PLATE_TYPES} value={`${value}`} type="span" />,
    },
    {
      title: '放行时间',
      dataIndex: 'releaseTime',
      align: 'center',
      render: value => value && moment(value).format(DEFAULT_FORMAT),
    },
    {
      title: '车场名称',
      dataIndex: 'parkName',
      align: 'center',
    },
    {
      title: '区域名称',
      dataIndex: 'areaName',
      align: 'center',
    },
    {
      title: '通道名称',
      dataIndex: 'channelName',
      align: 'center',
    },
    {
      title: '通道方向',
      dataIndex: 'direction',
      align: 'center',
      render: value => <SelectOrSpan list={DIRECTIONS} value={`${value}`} type="span" />,
    },
  ];

  render() {
    const {
      user: { currentUser: { unitType } = {} },
      match: {
        params: { unitId },
      },
      route,
      location,
      match,
    } = this.props;
    const props = {
      route,
      location,
      match,
    };

    return unitType === 4 || unitId ? (
      <TablePage
        breadcrumbList={this.getBreadcrumbList}
        content={this.getContent}
        fields={this.getFields}
        action={this.getAction}
        columns={this.getColumns}
        mapper={MAPPER}
        showTotal={false}
        withUnitId
        {...props}
      />
    ) : (
      <Company
        name="在场记录"
        breadcrumbList={BREADCRUMB_LIST.concat({
          title: '单位在场记录',
          name: '单位在场记录',
        })}
        addEnable={false}
        {...props}
      />
    );
  }
}
