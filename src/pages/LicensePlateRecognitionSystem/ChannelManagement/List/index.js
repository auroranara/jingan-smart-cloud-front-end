import React, { Component } from 'react';
import { Input } from 'antd';
import TablePage from '@/templates/TablePage';
import SelectOrSpan from '@/jingan-components/SelectOrSpan';
import Company from '../../Company';
import { connect } from 'dva';
import moment from 'moment';
import styles from './index.less';

export const STATUSES = [{ key: '1', value: '启用' }, { key: '0', value: '停用' }];
export const MODES = [{ key: '0', value: '无人值守' }, { key: '1', value: '有人值守' }];
export const DIRECTIONS = [{ key: '1', value: '入口' }, { key: '0', value: '出口' }];
export const BREADCRUMB_LIST = [
  { title: '首页', name: '首页', href: '/' },
  { title: '人员在岗在位管理', name: '人员在岗在位管理' },
  { title: '车牌识别系统', name: '车牌识别系统' },
  { title: '车场管理', name: '车场管理' },
];
const MAPPER = {
  namespace: 'licensePlateRecognitionSystem',
  list: 'channelList',
  getList: 'getChannelList',
  remove: 'deleteChannel',
};
const COMPANY_MAPPER = {
  namespace: 'licensePlateRecognitionSystem',
  list: 'channelCompanyList',
  getList: 'getChannelCompanyList',
};

@connect(({ user }) => ({
  user,
}))
export default class ChannelList extends Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.match.params.unitId !== this.props.match.params.unitId;
  }

  transform = ({ unitId, ...props }) => ({
    companyId: unitId, // 这个接接口时重点关注一下
    ...props,
  });

  getBreadcrumbList = ({ isUnit }) =>
    BREADCRUMB_LIST.concat(
      [
        !isUnit && {
          title: '单位通道信息',
          name: '单位通道信息',
          href: this.props.route.path.replace(/\/:[^\/]*/g, ''),
        },
        { title: '通道信息', name: '通道信息' },
      ].filter(v => v)
    );

  getContent = ({ list: { pagination: { total } = {} } = {} }) => (
    <span>
      通道总数：
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
      id: 'gateName',
      transform: v => v.trim(),
      render: ({ onSearch }) => (
        <Input placeholder="请输入通道名称" maxLength={50} onPressEnter={onSearch} />
      ),
    },
    // {
    //   id: 'mode',
    //   render: () => <SelectOrSpan placeholder="请选择通道模式" list={MODES} allowClear />,
    // },
  ];

  // getAction = ({ renderAddButton }) => renderAddButton({ name: '新增通道' });

  getColumns = ({ list, renderDetailButton, renderEditButton, renderDeleteButton }) => [
    // {
    //   title: '通道编码',
    //   dataIndex: 'code',
    //   align: 'center',
    // },
    {
      title: '通道名称',
      dataIndex: 'gateName',
      align: 'center',
    },
    {
      title: '所在车场',
      dataIndex: 'parkName',
      align: 'center',
    },
    // {
    //   title: '所在区域',
    //   dataIndex: 'areaName',
    //   align: 'center',
    // },
    {
      title: '方向',
      dataIndex: 'ioState',
      align: 'center',
      render: value => <SelectOrSpan list={DIRECTIONS} value={`${value}`} type="span" />,
    },
    // {
    //   title: '通道模式',
    //   dataIndex: 'mode',
    //   align: 'center',
    //   render: value => <SelectOrSpan list={MODES} value={`${value}`} type="span" />,
    // },
    // {
    //   title: '通道状态',
    //   dataIndex: 'status',
    //   align: 'center',
    //   render: value => <SelectOrSpan list={STATUSES} value={`${value}`} type="span" />,
    // },
    // {
    //   title: '设备（个）',
    //   dataIndex: 'deviceCount',
    //   align: 'center',
    //   render: value => value || 0,
    // },
    // {
    //   title: '相机处理白名单',
    //   dataIndex: 'whitelist',
    //   align: 'center',
    //   render: value => <SelectOrSpan list={STATUSES} value={`${value}`} type="span" />,
    // },
    // {
    //   title: '创建时间',
    //   dataIndex: 'createTime',
    //   align: 'center',
    //   render: value => value && moment(value).format('YYYY-MM-DD HH:mm:ss'),
    // },
    // {
    //   title: '操作',
    //   dataIndex: '操作',
    //   align: 'center',
    //   width: 148,
    //   fixed: list && list.length ? 'right' : undefined,
    //   render: (_, data) => (
    //     <div className={styles.buttonWrapper}>
    //       {renderDetailButton(data)}
    //       {renderEditButton(data)}
    //       {renderDeleteButton(data)}
    //     </div>
    //   ),
    // },
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
        key={unitId}
        breadcrumbList={this.getBreadcrumbList}
        content={this.getContent}
        fields={this.getFields}
        action={this.getAction}
        columns={this.getColumns}
        transform={this.transform}
        mapper={MAPPER}
        showTotal={false}
        withUnitId
        {...props}
      />
    ) : (
      <Company
        name="通道"
        breadcrumbList={BREADCRUMB_LIST.concat({
          title: '单位通道信息',
          name: '单位通道信息',
        })}
        mapper={COMPANY_MAPPER}
        addEnable={false}
        {...props}
      />
    );
  }
}
