import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Button, Input, Select, Table, Divider, Popconfirm, message } from 'antd';
import { Link } from 'dva/router';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import Ellipsis from '@/components/Ellipsis';
import ToolBar from '@/components/ToolBar';
import { hasAuthority } from '@/utils/customAuth';
import codes from '@/utils/codes';
const { Option } = Select;

// 标题
const title = '重大危险源';

//面包屑
const breadcrumbList = [
  {
    title: '首页',
    name: '首页',
    href: '/',
  },
  {
    title: '一企一档',
    name: '一企一档',
  },
  {
    title,
    name: '重大危险源',
  },
];

// 权限
const {
  majorHazardInfo: {
    majorHazard: { add: addAuth, edit: editAuth, delete: deleteAuth },
  },
} = codes;

const spanStyle = { md: 8, sm: 12, xs: 24 };

const dangerList = {
  1: '一级',
  2: '二级',
  3: '三级',
  4: '四级',
};
/* session前缀 */
const sessionPrefix = 'major_hazard_list_';

@connect(({ reservoirRegion, user, loading }) => ({
  reservoirRegion,
  user,
  loading: loading.models.reservoirRegion,
}))
export default class MajorHazardList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // 挂载后
  componentDidMount() {
    const {
      user: {
        currentUser: { id },
      },
    } = this.props;
    // 从sessionStorage中获取存储的控件值
    const sessionData = JSON.parse(sessionStorage.getItem(`${sessionPrefix}${id}`));
    const payload = JSON.parse(sessionStorage.getItem(`${sessionPrefix}${id}`)) || {
      pageNum: 1,
      pageSize: 10,
    };
    this.fetchList({ ...payload });
    if (sessionData) {
      this.form.setFieldsValue({ ...payload });
    }
  }

  // 获取列表
  fetchList = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'reservoirRegion/fetchSourceList',
      payload: {
        ...params,
        pageNum: 1,
        pageSize: 10,
      },
    });
  };

  setFormReference = toobar => {
    this.form = toobar && toobar.props && toobar.props.form;
  };

  // 查询
  handleSearch = () => {
    const {
      user: {
        currentUser: { id },
      },
    } = this.props;
    const { ...rest } = this.form.getFieldsValue();
    const payload = { ...rest };
    this.fetchList(payload);
    sessionStorage.setItem(`${sessionPrefix}${id}`, JSON.stringify(payload));
  };

  // 重置
  handleReset = () => {
    this.fetchList();
    sessionStorage.clear();
  };

  // 删除
  handleDelete = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'reservoirRegion/fetchSourceDelete',
      payload: { ids: id },
      success: () => {
        this.fetchList();
        message.success('删除成功！');
      },
      error: () => {
        message.error('删除失败!');
      },
    });
  };

  // 分页变动
  handlePageChange = (pageNum, pageSize) => {
    const {
      dispatch,
      user: {
        currentUser: { id },
      },
    } = this.props;

    const payload = JSON.parse(sessionStorage.getItem(`${sessionPrefix}${id}`)) || {
      pageNum: 1,
      pageSize: 10,
    };
    dispatch({
      type: 'reservoirRegion/fetchCertificateList',
      payload: {
        ...payload,
        pageSize,
        pageNum,
      },
    });
  };
  // 渲染表格
  renderTable = () => {
    const {
      loading,
      reservoirRegion: {
        sourceData: {
          list = [],
          pagination: { pageNum, pageSize, total },
        },
      },
      user: {
        currentUser: { permissionCodes },
      },
    } = this.props;

    // 权限
    const editCode = hasAuthority(editAuth, permissionCodes);
    // const deleteCode = hasAuthority(deleteAuth, permissionCodes);

    const columns = [
      {
        title: '单位名称',
        dataIndex: 'companyName',
        align: 'center',
        width: 200,
      },
      {
        title: '基本信息',
        dataIndex: 'info',
        align: 'center',
        width: 300,
        render: (val, text) => {
          const { code, name, dangerLevel } = text;
          return (
            <div>
              <p>
                统一编码:
                {code}
              </p>
              <p>
                重大危险源名称:
                {name}
              </p>
              <p>
                重大危险源等级:
                {dangerList[dangerLevel]}
              </p>
            </div>
          );
        },
      },
      {
        title: '重大危险源描述',
        dataIndex: 'desc',
        align: 'center',
        width: 200,
        render: val => (
          <Ellipsis tooltip length={50} style={{ overflow: 'visible' }}>
            {val}
          </Ellipsis>
        ),
      },
      {
        title: '区域位置',
        dataIndex: 'location',
        align: 'center',
        width: 200,
      },
      {
        title: '操作',
        key: '操作',
        align: 'center',
        width: 150,
        render: (val, row) => (
          <Fragment>
            {editCode ? (
              <Link to={`/major-hazard-info/major-hazard/edit/${row.id}`}>编辑</Link>
            ) : (
              <span style={{ cursor: 'not-allowed', color: 'rgba(0, 0, 0, 0.25)' }}>编辑</span>
            )}
            {/* <Divider type="vertical" />
            {deleteCode ? (
              <Popconfirm title="确认要删除数据吗？" onConfirm={() => this.handleDelete(row.id)}>
                <a>删除</a>
              </Popconfirm>
            ) : (
              <span style={{ cursor: 'not-allowed', color: 'rgba(0, 0, 0, 0.25)' }}>删除</span>
            )} */}
          </Fragment>
        ),
      },
    ];
    return list && list.length ? (
      <Card style={{ marginTop: '24px' }}>
        <Table
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={list}
          bordered
          scroll={{ x: 1300 }}
          pagination={{
            current: pageNum,
            pageSize,
            total,
            showQuickJumper: true,
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '15', '20'],
            onChange: this.handlePageChange,
            onShowSizeChange: (num, size) => {
              this.handlePageChange(1, size);
            },
          }}
        />
      </Card>
    ) : (
      <div style={{ textAlign: 'center', padding: '70px' }}> 暂无数据</div>
    );
  };

  render() {
    const {
      reservoirRegion: {
        sourceData: {
          pagination: { total },
        },
        msg,
        dangerTypeList,
      },
      user: {
        currentUser: { permissionCodes },
      },
    } = this.props;

    const addCode = hasAuthority(addAuth, permissionCodes);

    const fields = [
      {
        id: 'name',
        label: '危险源名称',
        span: spanStyle,
        render: () => <Input placeholder="请输入危险源名称" />,
        transform: v => v.trim(),
      },
      {
        id: 'code',
        label: '统一编码',
        span: spanStyle,
        render: () => <Input placeholder="请输入统一编码" />,
        transform: v => v.trim(),
      },
      {
        id: 'location',
        label: '区域-位置',
        span: spanStyle,
        render: () => <Input placeholder="请输入区域位置" />,
        transform: v => v.trim(),
      },
      {
        id: 'dangerLevel',
        label: '重大危险源等级',
        span: spanStyle,
        render: () => (
          <Select allowClear placeholder="请选择危险性类别">
            {dangerTypeList.map(({ key, value }) => (
              <Option key={key} value={key}>
                {value}
              </Option>
            ))}
          </Select>
        ),
      },
      {
        id: 'companyName',
        label: '单位名称',
        span: spanStyle,
        render: () => <Input placeholder="请输入单位名称" />,
        transform: v => v.trim(),
      },
    ];

    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        content={
          <div>
            <span>
              单位数量：
              {msg}
            </span>
            <span style={{ paddingLeft: 20 }}>
              重大危险源：
              {total}
            </span>
          </div>
        }
      >
        <Card>
          <ToolBar
            fields={fields}
            onSearch={this.handleSearch}
            onReset={this.handleReset}
            action={
              <Button
                type="primary"
                disabled={!addCode}
                href={`#/major-hazard-info/major-hazard/add`}
              >
                新增重大危险源
              </Button>
            }
            wrappedComponentRef={this.setFormReference}
          />
        </Card>
        {this.renderTable()}
      </PageHeaderLayout>
    );
  }
}
