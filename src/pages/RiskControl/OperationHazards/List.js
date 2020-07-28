import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Form, Icon as LegacyIcon } from '@ant-design/compatible';
import { getToken } from 'utils/authority';
import { Input, Table, Button, Card, Upload, Modal, message, Divider } from 'antd';
import ToolBar from '@/components/ToolBar';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import styles1 from '@/pages/SafetyKnowledgeBase/MSDS/MList.less';
import { AuthA, AuthPopConfirm, AuthButton } from '@/utils/customAuth';
import codes from '@/utils/codes';
import HandleModal from './HandleModal';

const title = '作业危害-JHA分析';
const breadcrumbList = [
  { title: '首页', name: '首页', href: '/' },
  { title: '风险分级管控', name: '风险分级管控' },
  { title, name: title },
]
const fields = [
  {
    id: 'dangerName',
    label: '风险点名称',
    render: () => <Input placeholder="请输入" allowClear />,
  },
  {
    id: 'code',
    label: '编号',
    render: () => <Input placeholder="请输入" allowClear />,
  },
  {
    id: 'activityName',
    label: '作业活动名称',
    render: () => <Input placeholder="请输入" allowClear />,
  },
  {
    id: 'companyName',
    label: '单位名称：',
    render: () => <Input placeholder="请输入" allowClear />,
    transform: v => v.trim(),
  },
];
const {
  riskControl: {
    operationHazards: {
      add: addCode,
      edit: editCode,
      view: viewCode,
      delete: deleteCode,
    },
  },
} = codes;

@connect(({ user }) => ({
  user,
}))
export default class TableList extends Component {

  state = {
    handleModalVisible: false, // 新增/编辑
  };

  // 获取列表
  fetchList = (pageNum = 1, pageSize = 10, params = {}) => {

  }

  handleSearch = values => {
    this.setState({ formData: { ...values } });
    this.fetchList(1, this.pageSize, { ...values });
  }

  handleReset = () => {
    this.setState({ formData: {} });
    this.fetchList(1, this.pageSize);
  }

  handlePageChange = (pageNum, pageSize) => {
    const { formData } = this.state;
    this.pageNum = pageNum;
    this.pageSize = pageSize;
    this.fetchList(pageNum, pageSize, { ...formData });
  };

  // 点击新增
  onClickAdd = () => {
    this.setState({ handleModalVisible: true, detail: {}, isDetail: false })
  }

  // 点击编辑
  onClickEdit = detail => {
    this.setState({ detail, handleModalVisible: true, isDetail: false });
  }

  // 点击查看
  onClickView = detail => {
    this.setState({ detail, handleModalVisible: true, isDetail: true });
  }

  // 点击提交新增/编辑弹窗
  onSubmitHnaldeModal = payload => {

  }

  // 删除
  handleDelete = () => { }

  render () {
    const {
      user: { currentUser: { unitType } },
    } = this.props;
    const { handleModalVisible, isDetail } = this.state;
    const list = [], pageNum = 1, pageSize = 10, total = 0, detail = {};
    const toolBarAction = (
      <Fragment>
        <AuthButton
          code={addCode}
          type="primary"
          style={{ marginTop: '8px', marginRight: '10px' }}
          onClick={this.onClickAdd}
        >
          新增SCL评价记录
        </AuthButton>
        <Button type="primary" style={{ marginTop: '8px', marginRight: '10px' }}>
          <a href="">下载模板</a>
        </Button>
        <Button type="primary" style={{ marginTop: '8px' }}>
          导入
        </Button>
      </Fragment>
    );
    const columns = [
      {
        title: '单位名称',
        dataIndex: 'companyName',
        key: 'companyName',
        align: 'center',
      },
      {
        title: '编号',
        dataIndex: 'code',
        key: 'code',
        align: 'center',
      },
      {
        title: '评价日期',
        dataIndex: 'date',
        key: 'date',
        align: 'center',
      },
      {
        title: '风险点',
        dataIndex: 'point',
        key: 'point',
        align: 'center',
      },
      {
        title: '作业活动名称',
        dataIndex: 'activityName',
        key: 'activityName',
        align: 'center',
      },
      {
        title: '风险分析方法',
        dataIndex: 'funName',
        key: 'funName',
        align: 'center',
      },
      {
        title: '最高风险等级',
        dataIndex: 'level',
        key: 'level',
        align: 'center',
      },
      {
        title: '评价项目',
        dataIndex: 'object',
        key: 'object',
        align: 'center',
      },
      {
        title: '操作',
        dataIndex: 'object',
        key: 'object',
        align: 'center',
        render: (val, row) => (
          <Fragment>
            <AuthA>添加评价项</AuthA>
            <AuthA>复制</AuthA>
            <AuthA onClick={() => this.onClickView(row)}>查看</AuthA>
            <AuthA onClick={() => this.onClickEdit(row)}>编辑</AuthA>
            <AuthPopConfirm
              code={deleteCode}
              title="确认要删除该数据吗？"
              onConfirm={() => this.handleDelete()}
            >删除</AuthPopConfirm>
          </Fragment>
        ),
      },
    ];
    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
      >
        <Card style={{ marginBottom: 15 }}>
          <ToolBar
            fields={unitType === 4 ? fields.slice(1, fields.length) : fields}
            action={toolBarAction}
            onSearch={this.handleSearch}
            onReset={this.handleReset}
          />
        </Card>
        <div className={styles1.container}>
          {list && list.length > 0 ? (
            <Table
              bordered
              rowKey="id"
              // loading={loading}
              columns={columns}
              dataSource={list}
              // scroll={{ x: 1200 }} // 项目不多时注掉
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
              <Card bordered={false} style={{ textAlign: 'center' }}>
                <span>暂无数据</span>
              </Card>
            )}
        </div>
        <HandleModal
          visible={handleModalVisible}
          onOk={this.onSubmitHnaldeModal}
          onCancel={() => { this.setState({ handleModalVisible: false }) }}
          detail={detail || {}}
          isDetail={isDetail}
        />
      </PageHeaderLayout>
    )
  }
}
