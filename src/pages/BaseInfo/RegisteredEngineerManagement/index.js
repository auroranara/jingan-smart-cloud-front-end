import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Card, Button, Input, Select, Table, Divider, Popconfirm, message } from 'antd';
import { Link } from 'dva/router';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import ToolBar from '@/components/ToolBar';
import { hasAuthority } from '@/utils/customAuth';
import codes from '@/utils/codes';
const { Option } = Select;

// 标题
const title = '工业产品生产许可证';

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
    name: '工业产品生产许可证',
  },
];

// 权限
const {
  baseInfo: {
    industrialProductLicence: { add: addAuth, edit: editAuth, delete: deleteAuth },
  },
} = codes;

const spanStyle = { md: 8, sm: 12, xs: 24 };

/* session前缀 */
// const sessionPrefix = 'product_licence_list_';

@connect(({ industrialProductLicence, user, loading }) => ({
  industrialProductLicence,
  user,
  loading: loading.models.industrialProductLicence,
}))
export default class licenceList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // 挂载后
  componentDidMount() {}

  // 获取列表
  fetchList = params => {};

  setFormReference = toobar => {
    this.form = toobar && toobar.props && toobar.props.form;
  };

  // 查询
  handleSearch = () => {};

  // 重置
  handleReset = () => {};

  // 删除
  handleDelete = id => {};

  // 分页变动
  handlePageChange = (pageNum, pageSize) => {};

  // 渲染表格
  renderTable = () => {
    const {
      loading,
      industrialProductLicence: {
        industrialData: {
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
    const deleteCode = hasAuthority(deleteAuth, permissionCodes);

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
                种类:
                {code}
              </p>
              <p>
                发证机关:
                {name}
              </p>
              <p>
                发证日期:
                {dangerLevel}
              </p>
              <p>
                证书编号:
                {dangerLevel}
              </p>
            </div>
          );
        },
      },
      {
        title: '证件状态',
        dataIndex: 'desc',
        align: 'center',
        width: 200,
      },
      {
        title: '有效期至',
        dataIndex: 'unitChemiclaNumDetail',
        align: 'center',
        width: 200,
        render: val => {
          return val
            .map(item => item.chineName + ' ' + item.unitChemiclaNum + item.unitChemiclaNumUnit)
            .join(',');
        },
      },
      {
        title: '证照附件',
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
              <Link to={`/base-info/major-hazard/edit/${row.id}`}>编辑</Link>
            ) : (
              <span style={{ cursor: 'not-allowed', color: 'rgba(0, 0, 0, 0.25)' }}>编辑</span>
            )}
            <Divider type="vertical" />
            {deleteCode ? (
              <Popconfirm title="确认要删除数据吗？" onConfirm={() => this.handleDelete(row.id)}>
                <a>删除</a>
              </Popconfirm>
            ) : (
              <span style={{ cursor: 'not-allowed', color: 'rgba(0, 0, 0, 0.25)' }}>删除</span>
            )}
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
      industrialProductLicence: {
        industrialData: {
          pagination: { total },
        },
        credentialTypeList,
        expireList,
        credentialStatusList,
      },
      user: {
        currentUser: { permissionCodes },
      },
    } = this.props;

    const addCode = hasAuthority(addAuth, permissionCodes);

    const fields = [
      {
        id: 'name',
        label: '姓名',
        span: spanStyle,
        render: () => <Input placeholder="请输入姓名" />,
        transform: v => v.trim(),
      },
      {
        id: 'code',
        label: '执业资格证编号',
        span: spanStyle,
        render: () => <Input placeholder="请输入执业资格证编号" />,
        transform: v => v.trim(),
      },
      {
        id: 'area',
        label: '到期状态',
        span: spanStyle,
        render: () => (
          <Select allowClear placeholder="请选择到期状态">
            {expireList.map(({ key, value }) => (
              <Option key={key} value={value}>
                {value}
              </Option>
            ))}
          </Select>
        ),
        transform: v => v.trim(),
      },
      {
        id: 'level',
        label: '工程师级别',
        span: spanStyle,
        render: () => (
          <Select allowClear placeholder="请选择工程师级别">
            {credentialStatusList.map(({ key, value }) => (
              <Option key={key} value={value}>
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
              {''}
            </span>
            <span style={{ paddingLeft: 20 }}>
              安全工程师数量:
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
                href={`#/base-info/industrial-product-licence/add`}
              >
                新增人员
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
