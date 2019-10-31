import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Form, Card, Button, Input, Table, Divider } from 'antd';
import ToolBar from '@/components/ToolBar';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
// import { DEFAULT_PAGE_SIZE } from 'src/pages/RoleAuthorization/AccountManagement/utils';
const DEFAULT_PAGE_SIZE = 10;
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
    id: 'tankName',
    label: '储罐名称',
    span: spanStyle,
    render: () => <Input placeholder="请输入储罐名称" />,
    transform: v => v.trim(),
  },
  {
    id: 'number',
    label: '储罐位号',
    span: spanStyle,
    render: () => <Input placeholder="请输入储罐位号" />,
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
    id: 'storageMedium',
    label: '存储介质：',
    span: spanStyle,
    render: () => <Input placeholder="请输入存储介质" />,
    transform: v => v.trim(),
  },
  {
    id: 'casNo',
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

@connect(({ loading, baseInfo }) => ({
  baseInfo,
}))
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
  componentDidMount() {
    this.handleQuery()
  }

  // 查询
  handleQuery = (_, pageNum = 1, pageSize = DEFAULT_PAGE_SIZE) => {
    const { dispatch } = this.props
    const fields = this.form.props.form.getFieldsValue()
    dispatch({
      type: 'baseInfo/fetchStorageTankForPage',
      payload: { ...fields, pageNum, pageSize },
    })
  };

  // 重置
  handleReset = () => {
    this.form.props.form.resetFields()
    this.handleQuery()
  };

  // 渲染表格
  renderTable = () => {
    const {
      baseInfo: {
        storageTank: {
          list,
          pagination: { total, pageNum, pageSize },
        },
      },
    } = this.props
    const columns = [
      {
        title: '单位名称',
        dataIndex: 'companyName',
        align: 'center',
        width: 200,
      },
      {
        title: '基本信息',
        key: 'info',
        align: 'center',
        width: 300,
        render: (val, { tankGroupNumber, tankNumber, tankName, number }) => (
          <div style={{ textAlign: 'left' }}>
            <div>所属罐组编号：{tankGroupNumber || '暂无数据'}</div>
            <div>储罐编号：{tankNumber || '暂无数据'}</div>
            <div>储罐名称：{tankName || '暂无数据'}</div>
            <div>位号：{number || '暂无数据'}</div>
          </div>
        ),
      },
      {
        title: '存储介质',
        dataIndex: 'storageMedium',
        align: 'center',
        width: 200,
      },
      {
        title: '重大危险源 / 高危储罐',
        dataIndex: 'chemicals',
        align: 'center',
        width: 200,
        render: (val, { majorHazard, highRiskTank }) => (<span>{majorHazard}/{highRiskTank}</span>),
      },
      {
        title: '区域位置',
        dataIndex: 'area',
        align: 'center',
        width: 200,
        render: (val, { area, location }) => `${area}${location}`,
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
          pagination={{
            current: pageNum,
            pageSize,
            total,
            showQuickJumper: true,
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '15', '20'],
            onChange: (pageNum, pageSize) => {
              this.handleQuery({}, pageNum, pageSize);
            },
            onShowSizeChange: (pageNum, pageSize) => {
              this.handleQuery({}, 1, pageSize);
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
      baseInfo: {
        storageTank: {
          a = 0, // 单位数量
          pagination: { total = 0 },
        },
      },
    } = this.props
    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        content={
          <div>
            <span>单位数量：{a}</span>
            <span style={{ paddingLeft: 20 }}>储罐总数：{total}</span>
            <span style={{ paddingLeft: 20 }}>已绑传感器数：{'TODO'}</span>
          </div>
        }
      >
        <Card>
          <ToolBar
            fields={fields}
            onSearch={this.handleQuery}
            onReset={this.handleReset}
            action={this.exportButton}
            wrappedComponentRef={form => { this.form = form }}
          />
        </Card>

        {this.renderTable()}
      </PageHeaderLayout>
    );
  }
}
