import React, { PureComponent, Fragment } from 'react';
// import { connect } from 'dva';
import { Form, Card, Button, Input, Table, Divider } from 'antd';
import ToolBar from '@/components/ToolBar';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';

// 标题
const title = '储罐管理';

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
    name: '储罐管理',
  },
];

const spanStyle = { md: 8, sm: 12, xs: 24 };
const fields = [
  {
    id: 'name',
    label: '储罐名称',
    span: spanStyle,
    render: () => <Input placeholder="请输入储罐名称" />,
    transform: v => v.trim(),
  },
  {
    id: 'code',
    label: '储罐位号',
    span: spanStyle,
    render: () => <Input placeholder="请输入储罐位号" />,
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
    id: 'save',
    label: '存储介质：',
    span: spanStyle,
    render: () => <Input placeholder="请输入存储介质" />,
    transform: v => v.trim(),
  },
  {
    id: 'level：',
    label: 'CAS号',
    span: spanStyle,
    render: () => <Input placeholder="请输入CAS号" />,
  },
  {
    id: 'companyName',
    label: '单位名称：',
    span: spanStyle,
    render: () => <Input placeholder="请输入单位名称" />,
    transform: v => v.trim(),
  },
];

// @connect(({ loading }) => ({}))
@Form.create()
export default class StorageList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.exportButton = (
      <Button type="primary" href={`#/base-info/storage-management/add`}>
        新增储罐
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
        info: '储罐名称：苯胺',
        desc: 'CAS号:---',
        chemicals: '否',
        area: '一车间一楼  液氨储罐A',
        bind: '3',
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
        title: '存储介质',
        dataIndex: 'desc',
        align: 'center',
        width: 200,
      },
      {
        title: '重大危险源 / 高危储罐',
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
        title: '已绑传感器',
        dataIndex: 'bind',
        align: 'center',
        width: 150,
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
          scroll={{ x: 1400 }}
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
              储罐总数：
              {1}
            </span>
            <span style={{ paddingLeft: 20 }}>
              已绑传感器数：
              {3}
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
