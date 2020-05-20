import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Card, Empty, Table, message, Input, Select, Divider } from 'antd';

import ToolBar from '@/components/ToolBar';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { AuthButton, AuthA, AuthPopConfirm } from '@/utils/customAuth';
import codes from '@/utils/codes';


export const LIST_URL = '/major-hazard-info/work-site/list';
export const PATH = '/major-hazard-info/work-site';
// 所处环境功能区选项
export const ENV_FUNCTIONAL_AREA = [
  { value: '1', label: '工业区' },
  { value: '2', label: '农业区' },
  { value: '3', label: '商业区' },
  { value: '4', label: '居民区' },
  { value: '5', label: '行政办公区' },
  { value: '6', label: '交通枢纽区' },
  { value: '7', label: '科技文化区' },
  { value: '8', label: '水源保护区' },
  { value: '9', label: '文物保护区' },
];
export const BREADCRUMBLIST = [
  // modify
  { title: '首页', name: '首页', href: '/' },
  { title: '基本信息', name: '基本信息' },
  { title: '生产场所', name: '生产场所', href: LIST_URL },
];
export const generateChemicalLabels = val => val ? val.split(',').map(item => item ? ENV_FUNCTIONAL_AREA[+item - 1].label : '').join('，') : '';

// 权限
export const {
  baseInfo: {
    workSite: {
      add: addCode,
      edit: editCode,
      delete: deleteCode,
      view: viewCode,
    },
  },
} = codes;
@connect(({ user, baseInfo, loading }) => ({
  user,
  baseInfo,
  loading: loading.effects['baseInfo/fetchWorkSite'],
}))
export default class TableList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      formData: {},
      companyTotal: '',
    };
    this.pageNum = 1;
    this.pageSize = 10;
  }

  componentDidMount () {
    this.fetchList();
  }

  fetchList = (pageNum = 1, pageSize = 10, params = {}) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'baseInfo/fetchWorkSite',
      payload: {
        ...params,
        pageSize,
        pageNum,
      },
    });
  };

  handleSearch = values => {
    const { environmentFunction } = values;
    const data = { ...values, environmentFunction: Array.isArray(environmentFunction) ? environmentFunction.join(',') : undefined };
    this.setState({ formData: data });
    this.fetchList(1, this.pageSize, data);
  };

  handleReset = () => {
    this.setState({ formData: {} });
    this.fetchList(1, this.pageSize);
  };

  handleAdd = () => {
    router.push(`${PATH}/add`);
  };

  handlePageChange = (pageNum, pageSize) => {
    const { formData } = this.state;
    this.pageNum = pageNum;
    this.pageSize = pageSize;
    this.fetchList(pageNum, pageSize, { ...formData });
  };

  // 删除
  handleConfirmDelete = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'baseInfo/deleteWorkSite',
      payload: { id },
      callback: (success, msg) => {
        if (success) {
          this.fetchList();
          message.success('删除成功！');
        } else {
          message.error('删除失败!');
        }
      },
    });
  };

  render () {
    const {
      loading,
      user: { isCompany },
      baseInfo: {
        workSite: {
          list = [],
          pagination: { total, pageNum, pageSize },
        },
      },
    } = this.props;

    const breadcrumbList = Array.from(BREADCRUMBLIST);
    breadcrumbList.push({ title: '列表', name: '列表' });
    const toolBarAction = (
      <AuthButton
        code={addCode}
        type="primary"
        onClick={this.handleAdd}
        style={{ marginTop: '8px' }}
      >
        新增
      </AuthButton>
    );
    const fields = [
      ...isCompany ? [] : [{
        id: 'companyName',
        label: '单位名称',
        render: () => <Input placeholder="请输入" allowClear />,
        transform: v => v.trim(),
      }],
      {
        id: 'unitName',
        label: '单元名称',
        render: () => <Input placeholder="请输入" allowClear />,
        transform: v => v.trim(),
      },
      {
        id: 'environmentFunction',
        label: '所处环境功能区',
        render: () => (
          <Select placeholder="请选择" mode="multiple" allowClear>
            {ENV_FUNCTIONAL_AREA.map(({ value, label }) => (
              <Select.Option key={value} value={value}>
                {label}
              </Select.Option>
            ))}
          </Select>
        ),
      },
    ];
    const columns = [
      ...isCompany ? [] : [{
        title: '单位名称',
        dataIndex: 'companyName',
        key: 'companyName',
        align: 'center',
        width: 250,
      }],
      {
        title: '单元名称',
        dataIndex: 'unitName',
        key: 'unitName',
        align: 'center',
        width: 250,
      },
      {
        title: '区域位置',
        dataIndex: 'location',
        key: 'location',
        align: 'center',
        width: 250,
      },
      {
        title: '占地面积（㎡）',
        dataIndex: 'floorSpace',
        key: 'floorSpace',
        align: 'center',
        width: 250,
      },
      {
        title: '所处环境功能区',
        dataIndex: 'environmentFunction',
        key: 'environmentFunction',
        align: 'center',
        width: 250,
        render: (val) => generateChemicalLabels(val),
      },
      {
        title: '涉及危化品',
        dataIndex: 'materialName',
        key: 'materialName',
        align: 'center',
        width: 250,
      },
      {
        title: '操作',
        dataIndex: 'id',
        key: 'id',
        width: 180,
        align: 'center',
        fixed: 'right',
        render: (id) => {
          return (
            <Fragment>
              <AuthA code={viewCode} onClick={() => { router.push(`${PATH}/view/${id}`) }}>
                查看
              </AuthA>
              <Divider type="vertical" />
              <AuthA
                code={editCode}
                onClick={() => { router.push(`${PATH}/edit/${id}`) }}
              >
                编辑
              </AuthA>
              <Divider type="vertical" />
              <AuthPopConfirm
                code={deleteCode}
                title="确定删除当前数据？"
                onConfirm={() => this.handleConfirmDelete(id)}
                okText="确定"
                cancelText="取消"
              >
                删除
              </AuthPopConfirm>
            </Fragment>
          );
        },
      },
    ];

    return (
      <PageHeaderLayout
        title={BREADCRUMBLIST[BREADCRUMBLIST.length - 1].title}
        breadcrumbList={breadcrumbList}
      // content={
      //   <div>
      //     <span>单位数量 ：{companyTotal}</span>
      //     <span style={{ paddingLeft: 20 }}>周边环境数量 : {total}</span>
      //   </div>
      // }
      >
        <Card style={{ marginBottom: 15 }}>
          <ToolBar
            fields={fields}
            action={toolBarAction}
            onSearch={this.handleSearch}
            onReset={this.handleReset}
          />
        </Card>
        <div>
          {list.length ? (
            <Table
              rowKey="id"
              bordered
              loading={loading}
              columns={columns}
              dataSource={list}
              onChange={this.onTableChange}
              scroll={{ x: 'max-content' }}
              pagination={{
                current: pageNum,
                pageSize,
                total,
                showQuickJumper: true,
                showSizeChanger: true,
                // pageSizeOptions: ['5', '10', '15', '20'],
                onChange: this.handlePageChange,
                onShowSizeChange: (num, size) => {
                  this.handlePageChange(1, size);
                },
              }}
            />
          ) : (
              <Empty />
            )}
        </div>
      </PageHeaderLayout>
    );
  }
}
