import React, { Component } from 'react';
import { Input } from 'antd';
import TablePage from '@/templates/TablePage';
import Company from '../../Company';
import { connect } from 'dva';
import styles from './index.less';

export const BREADCRUMB_LIST = [
  { title: '首页', name: '首页', href: '/' },
  { title: '人员在岗在位管理', name: '人员在岗在位管理' },
  { title: '车牌识别系统', name: '车牌识别系统' },
];
const MAPPER = {
  namespace: 'licensePlateRecognitionSystem',
  list: 'transportCompanyList',
  getList: 'getTransportCompanyList',
  remove: 'deleteTransportCompany',
};
const COMPANY_MAPPER = {
  namespace: 'licensePlateRecognitionSystem',
  list: 'transportCompanyCompanyList',
  getList: 'getTransportCompanyCompanyList',
};

@connect(({ user }) => ({
  user,
}))
export default class TransportCompanyList extends Component {
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
          title: '单位运输公司管理',
          name: '单位运输公司管理',
          href: this.props.route.path.replace(/\/:[^\/]*/g, ''),
        },
        { title: '运输公司管理', name: '运输公司管理' },
      ].filter(v => v)
    );

  getContent = ({ list: { pagination: { total } = {} } = {} }) => (
    <span>
      总数：
      {total || 0}
    </span>
  );

  getFields = () => [
    {
      id: 'transitCompanyName',
      transform: v => v.trim(),
      render: ({ onSearch }) => (
        <Input placeholder="请输入运输公司名称" maxLength={50} onPressEnter={onSearch} />
      ),
    },
  ];

  getAction = ({ renderAddButton }) => renderAddButton({ name: '新增运输公司' });

  getColumns = ({ list, renderDetailButton, renderEditButton, renderDeleteButton }) => [
    {
      title: '运输公司名称',
      dataIndex: 'transitCompanyName',
      align: 'center',
    },
    {
      title: '地址',
      dataIndex: 'address',
      align: 'center',
    },
    {
      title: '联系人',
      dataIndex: 'manager',
      align: 'center',
    },
    {
      title: '联系电话',
      dataIndex: 'managerTel',
      align: 'center',
    },
    {
      title: '公司描述',
      dataIndex: 'companyDesc',
      align: 'center',
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
        name="运输公司"
        breadcrumbList={BREADCRUMB_LIST.concat({
          title: '单位运输公司管理',
          name: '单位运输公司管理',
        })}
        mapper={COMPANY_MAPPER}
        {...props}
      />
    );
  }
}
