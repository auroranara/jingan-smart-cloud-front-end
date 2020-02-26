import React, { Component } from 'react';
import { Input } from 'antd';
import TablePage from '@/templates/TablePage';
import SelectOrSpan from '@/jingan-components/SelectOrSpan';
import Company from '../../Company';
import { connect } from 'dva';
import styles from './index.less';

export const BREADCRUMB_LIST = [
  { title: '首页', name: '首页', href: '/' },
  { title: '人员在岗在位管理', name: '人员在岗在位管理' },
  { title: '车牌识别系统', name: '车牌识别系统' },
  { title: '车场管理', name: '车场管理' },
];
export const TYPES = [
  { key: '1', value: '外区域' },
  { key: '2', value: '内区域' },
  { key: '3', value: '不分区域' },
];
const MAPPER = {
  namespace: 'licensePlateRecognitionSystem',
  list: 'areaList',
  getList: 'getAreaList',
  remove: 'deleteArea',
};

@connect(({ user }) => ({
  user,
}))
export default class AreaList extends Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.match.params.unitId !== this.props.match.params.unitId;
  }

  transform = ({ unitId, ...props }) => ({
    // unitId, // 这个接接口时重点关注一下
    ...props,
  });

  getBreadcrumbList = ({ isUnit }) =>
    BREADCRUMB_LIST.concat(
      [
        !isUnit && {
          title: '单位区域信息',
          name: '单位区域信息',
          href: this.props.route.path.replace(/\/:[^\/]*/g, ''),
        },
        { title: '区域信息', name: '区域信息' },
      ].filter(v => v)
    );

  getContent = ({ list: { pagination: { total } = {} } = {} }) => (
    <span>
      区域总数：
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
      id: 'name',
      transform: v => v.trim(),
      render: ({ onSearch }) => (
        <Input placeholder="请输入区域名称" maxLength={50} onPressEnter={onSearch} />
      ),
    },
    {
      id: 'type',
      render: () => <SelectOrSpan placeholder="请选择区域类型" list={TYPES} allowClear />,
    },
  ];

  getAction = ({ renderAddButton }) => renderAddButton({ name: '新增区域' });

  getColumns = ({ list, renderDetailButton, renderEditButton, renderDeleteButton }) => [
    {
      title: '所在车场',
      dataIndex: 'parkName',
      align: 'center',
    },
    {
      title: '区域名称',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '区域类型',
      dataIndex: 'type',
      align: 'center',
      render: value => <SelectOrSpan list={TYPES} value={`${value}`} type="span" />,
    },
    {
      title: '父区域',
      dataIndex: 'parentName',
      align: 'center',
    },
    {
      title: '通道（个）',
      dataIndex: 'channelCount',
      align: 'center',
      render: value => value || 0,
    },
    {
      title: '操作',
      dataIndex: '操作',
      align: 'center',
      width: 148,
      fixed: list && list.length ? 'right' : undefined,
      render: (_, data) => (
        <div className={styles.buttonWrapper}>
          {renderDetailButton(data)}
          {renderEditButton(data)}
          {renderDeleteButton(data)}
        </div>
      ),
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
        name="区域"
        breadcrumbList={BREADCRUMB_LIST.concat({
          title: '单位区域信息',
          name: '单位区域信息',
        })}
        {...props}
      />
    );
  }
}
