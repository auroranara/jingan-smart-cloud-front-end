import React, { Component } from 'react';
import { Input } from 'antd';
import TablePage from '@/templates/TablePage';
import SelectOrSpan from '@/jingan-components/SelectOrSpan';
import Company from '../../Company';
import { connect } from 'dva';
import styles from './index.less';

export const STATUSES = [{ key: '1', value: '启用' }, { key: '0', value: '停用' }];
export const BREADCRUMB_LIST = [
  { title: '首页', name: '首页', href: '/' },
  { title: '人员在岗在位管理', name: '人员在岗在位管理' },
  { title: '车牌识别系统', name: '车牌识别系统' },
  { title: '车场管理', name: '车场管理' },
];
const MAPPER = {
  namespace: 'licensePlateRecognitionSystem',
  list: 'parkList',
  getList: 'getParkList',
  remove: 'deletePark',
};
const COMPANY_MAPPER = {
  namespace: 'licensePlateRecognitionSystem',
  list: 'parkCompanyList',
  getList: 'getParkCompanyList',
};

@connect(({ user }) => ({
  user,
}))
export default class ParkList extends Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.match.params.unitId !== this.props.match.params.unitId;
  }

  transform = ({ unitId, ...props }) => ({
    companyId: unitId,
    ...props,
  });

  getBreadcrumbList = ({ isUnit }) =>
    BREADCRUMB_LIST.concat(
      [
        !isUnit && {
          title: '单位车场信息',
          name: '单位车场信息',
          href: this.props.route.path.replace(/\/:[^\/]*/g, ''),
        },
        { title: '车场信息', name: '车场信息' },
      ].filter(v => v)
    );

  getContent = ({ list: { pagination: { total } = {} } = {} }) => (
    <span>
      车场总数：
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
      id: 'parkName',
      transform: v => v.trim(),
      render: ({ onSearch }) => (
        <Input placeholder="请输入车场名称" maxLength={50} onPressEnter={onSearch} />
      ),
    },
    {
      id: 'managerName',
      transform: v => v.trim(),
      render: ({ onSearch }) => (
        <Input placeholder="请输入联系人" maxLength={50} onPressEnter={onSearch} />
      ),
    },
    {
      id: 'parkStatus',
      render: () => <SelectOrSpan placeholder="请选择车场状态" list={STATUSES} allowClear />,
    },
  ];

  getAction = ({ renderAddButton }) => renderAddButton({ name: '新增车场' });

  getColumns = ({ list, renderDetailButton, renderEditButton, renderDeleteButton }) => [
    {
      title: '车场ID',
      dataIndex: 'parkId',
      align: 'center',
    },
    {
      title: '车场名称',
      dataIndex: 'parkName',
      align: 'center',
    },
    {
      title: '车场联系人',
      dataIndex: 'managerName',
      align: 'center',
    },
    {
      title: '联系电话',
      dataIndex: 'managerPhone',
      align: 'center',
    },
    {
      title: '车场状态',
      dataIndex: 'parkStatus',
      align: 'center',
      render: value => <SelectOrSpan list={STATUSES} value={`${value}`} type="span" />,
    },
    // {
    //   title: '区域（个）',
    //   dataIndex: 'areaCount',
    //   align: 'center',
    //   render: value => value || 0,
    // },
    {
      title: '通道（个）',
      dataIndex: 'gateCount',
      align: 'center',
      render: value => value || 0,
    },
    // {
    //   title: '设备（个）',
    //   dataIndex: 'deviceCount',
    //   align: 'center',
    //   render: value => value || 0,
    // },
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
        name="车场"
        breadcrumbList={BREADCRUMB_LIST.concat({
          title: '单位车场信息',
          name: '单位车场信息',
        })}
        mapper={COMPANY_MAPPER}
        {...props}
      />
    );
  }
}
