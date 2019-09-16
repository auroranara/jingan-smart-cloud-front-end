import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Card, Button, Input, Select, Table, Divider } from 'antd';
// import { routerRedux } from 'dva/router';
// import router from 'umi/router';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import ToolBar from '@/components/ToolBar';
const { Option } = Select;

// 标题
const title = '重大危险源';

const dangerTypeList = [
  { key: '1', value: '一级' },
  { key: '2', value: '二级' },
  { key: '3', value: '三级' },
  { key: '4', value: '四级' },
];

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

const spanStyle = { md: 8, sm: 12, xs: 24 };
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
    id: 'area',
    label: '区域-位置',
    span: spanStyle,
    render: () => <Input placeholder="请输入区域位置" />,
    transform: v => v.trim(),
  },
  {
    id: 'level：',
    label: '重大危险源等级',
    span: spanStyle,
    render: () => (
      <Select allowClear placeholder="请选择危险性类别">
        {dangerTypeList.map(({ key, value }) => (
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

@connect(({ loading }) => ({}))
@Form.create()
export default class MajorHazardList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.exportButton = (
      <Button type="primary" href={`#/base-info/major-hazard/add`}>
        新增重大危险源
      </Button>
    );
  }

  // 挂载后
  componentDidMount() {}

  // 查询
  handleSearch = () => {};

  // 重置
  handleReset = () => {};

  handlePageChange = () => {};

  // 渲染表格
  renderTable = () => {
    const list = [
      {
        id: '1',
        companyName: '利民化工股份有限公司',
        info: '统一编码、重大危险源名称',
        desc: '---',
        chemicals: '---',
        area: '一车间一楼  液氨储罐A',
      },
    ];

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
      },
      {
        title: '重大危险源描述',
        dataIndex: 'desc',
        align: 'center',
        width: 200,
      },
      {
        title: '单元内涉及的危险化学品',
        dataIndex: 'chemicals',
        align: 'center',
        width: 200,
      },
      {
        title: '区域位置',
        dataIndex: 'area',
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
            <a>编辑</a>
            <Divider type="vertical" />
            <a>删除</a>
          </Fragment>
        ),
      },
    ];
    return list && list.length ? (
      <Card style={{ marginTop: '24px' }}>
        <Table
          rowKey="id"
          // loading={loading}
          columns={columns}
          dataSource={list}
          bordered
          scroll={{ x: 1300 }}
          // pagination={{
          //   current: pageNum,
          //   pageSize,
          //   total,
          //   showQuickJumper: true,
          //   showSizeChanger: true,
          //   pageSizeOptions: ['5', '10', '15', '20'],
          //   onChange: this.handleQuery,
          //   onShowSizeChange: (num, size) => {
          //     this.handleQuery(1, size);
          //   },
          // }}
        />
      </Card>
    ) : (
      <div style={{ textAlign: 'center', padding: '70px' }}> 暂无数据</div>
    );
  };

  render() {
    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        content={
          <div>
            <span>
              单位数量：
              {1}
            </span>
            <span style={{ paddingLeft: 20 }}>
              重大危险源：
              {1}
            </span>
          </div>
        }
      >
        <Card>
          <ToolBar
            fields={fields}
            onSearch={this.handleSearch}
            onReset={this.handleReset}
            action={this.exportButton}
          />
        </Card>
        {this.renderTable()}
      </PageHeaderLayout>
    );
  }
}
