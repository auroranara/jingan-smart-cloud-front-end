import React, { Component, Fragment, createRef } from 'react';
// import '@ant-design/compatible/assets/index.css';
// import { Form } from '@ant-design/compatible';
import {
  Button,
  Input,
  Card,
  Form,
  Table,
  message,
  Modal,
  Divider,
  Row,
  Col,
  Select,
  TreeSelect,
} from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { connect } from 'dva';
import router from 'umi/router';
import codes from '@/utils/codes'
import { AuthPopConfirm, AuthA, AuthButton } from '@/utils/customAuth';
import CompanySelect from '@/jingan-components/CompanySelect';

export const LIST_PATH = '/electronic-inspection/production-area/list';
export const ADD_PATH = '/electronic-inspection/production-area/add'

const { TreeNode: TreeSelectNode } = TreeSelect;
const {
  electronicInspection: {
    productionArea: {
      add: addCode,
      edit: editCode,
      delete: deleteCode,
      view: viewCode,
    },
  },
} = codes;

const TITLE = '生产区域';
const BREADCRUMB_LIST = [
  {
    title: '首页',
    name: '首页',
    href: '/',
  },
  {
    title: '电子巡检',
    name: '电子巡检',
  },
  {
    title: TITLE,
    name: TITLE,
  },
];
const colWrapper = {
  md: 12,
  sm: 24,
};
const formItemStyle = { style: { margin: '0', padding: '4px 0' } };

export const treeData = (data) => {
  return data.map(item => {
    if (item.children) {
      return (
        <TreeSelectNode title={item.name || item.text} key={item.id} value={item.id}>
          {treeData(item.children)}
        </TreeSelectNode>
      );
    }
    return <TreeSelectNode title={item.name || item.text} key={item.id} value={item.id} />;
  });
};

@connect(({ user, account, electronicInspection, loading }) => ({
  user,
  account,
  electronicInspection,
  tableLoading: loading.effects['electronicInspection/fetchProductionArea'],
}))
export default class ProductionAreaList extends Component {

  formRef = createRef();

  componentDidMount () {
    const { user: { isCompany, currentUser } } = this.props;
    this.handleQuery();
    if (isCompany) {
      this.fetchDepartmentList({ payload: { companyId: currentUser.companyId } })
    } else {
      // 清空部门
      this.resetDepartment();
    }
  }

  handleQuery = (payload = {}) => {
    const { dispatch } = this.props;
    const { company, ...resValues } = this.formRef.current.getFieldsValue();
    dispatch({
      type: 'electronicInspection/fetchProductionArea',
      payload: {
        pageNum: 1,
        pageSize: 10,
        companyId: company && company.key !== company.label ? company.key : undefined,
        ...payload,
        ...resValues,
      },
    })
  }

  handleReset = () => {
    this.formRef.current.resetFields();
    this.handleQuery();
  }

  handleToAdd = () => { router.push('/electronic-inspection/production-area/add') }

  handleDelete = id => {
    const { dispatch } = this.props;
    dispatch({
      type: 'electronicInspection/deleteProductionArea',
      payload: { id },
      callback: (success, msg) => {
        if (success) {
          message.success('删除成功')
          this.handleQuery();
        } else {
          message.error(msg || '删除失败')
        }
      },
    })
  }

  handleView = id => {
    router.push(`/electronic-inspection/production-area/view/${id}`)
  }

  handleEdit = id => {
    router.push(`/electronic-inspection/production-area/edit/${id}`)
  }

  // 获取部门列表
  fetchDepartmentList = actions => {
    const { dispatch } = this.props;
    dispatch({
      type: 'account/fetchDepartmentList',
      ...actions,
    })
  }

  // 清空部门列表
  resetDepartment = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'account/queryDepartment',
      payload: [],
    })
  }

  // 企业发生变化
  handleCompanyChange = company => {
    this.formRef.current.resetFields(['department']);
    if (company && company.key !== company.label) {
      this.fetchDepartmentList({ payload: { companyId: company.key } });
    }
  }

  renderForm = () => {
    const {
      user: { isCompany },
      account: { departments },
    } = this.props;
    const treeList = treeData(departments);
    return (
      <Card>
        <Form ref={this.formRef} labelCol={{ span: 5 }} wrapperCol={{ span: 19 }} labelAlign="left">
          <Row gutter={30}>
            {!isCompany && (
              <Col {...colWrapper}>
                <Form.Item name="company" label="单位名称" {...formItemStyle}>
                  <CompanySelect
                    onChange={this.handleCompanyChange}
                  />
                </Form.Item>
              </Col>
            )}
            <Col {...colWrapper}>
              <Form.Item name="department" label="所属部门" {...formItemStyle}>
                <TreeSelect
                  allowClear
                  dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                  placeholder="请选择所属部门"
                >
                  {treeList}
                </TreeSelect>
              </Form.Item>
            </Col>
            <Col {...colWrapper}>
              <Form.Item name="areaName" label="区域名称" {...formItemStyle}>
                <Input placeholder="区域名称" />
              </Form.Item>
            </Col>
            <Col {...colWrapper}>
              <Form.Item name="principalName" label="负责人姓名" {...formItemStyle}>
                <Input placeholder="负责人姓名" />
              </Form.Item>
            </Col>
            <Col {...colWrapper}>
              <Form.Item {...formItemStyle}>
                <Button style={{ marginRight: '10px' }} type="primary" onClick={() => this.handleQuery()}>
                  查询
                </Button>
                <Button style={{ marginRight: '10px' }} onClick={this.handleReset}>
                  重置
                </Button>
                <AuthButton code={addCode} type="primary" onClick={this.handleToAdd}>
                  新增
                </AuthButton>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    )
  }

  renderTable = () => {
    const {
      tableLoading,
      user: { isCompany },
      electronicInspection: {
        productionArea: {
          list = [],
          pagination: { pageNum, pageSize, total },
        },
      },
    } = this.props;
    const columns = [
      ...(isCompany ? [] : [{
        title: '单位名称',
        dataIndex: 'companyName',
        align: 'center',
        width: 250,
      }]),
      {
        title: '生产区域名称',
        dataIndex: 'areaName',
        align: 'center',
        width: 200,
      },
      {
        title: '所属部门',
        dataIndex: 'departmentName',
        align: 'center',
        width: 200,
      },
      {
        title: '区域位号',
        dataIndex: 'areaNumber',
        align: 'center',
        width: 200,
      },
      {
        title: '区域等级',
        dataIndex: 'areaLevel',
        align: 'center',
        width: 200,
      },
      {
        title: '负责人',
        key: '负责人',
        align: 'left',
        width: 200,
        render: (val, { principalContent = {} }) => (
          <div style={{ textAlign: 'left' }}>
            <p>姓名：{principalContent.userName || ''}</p>
            <p>部门：{principalContent.departmentName || ''}</p>
            <p>联系电话：{principalContent.phoneNumber || ''}</p>
          </div>
        ),
      },
      {
        title: '操作',
        dataIndex: 'id',
        width: 200,
        align: 'center',
        fixed: list && list.length > 0 ? 'right' : false,
        render: (_, row) => (
          <Fragment>
            <AuthA code={viewCode} onClick={() => this.handleView(row.id)}>
              查看
            </AuthA>
            <Divider type="vertical" />
            <AuthA code={editCode} onClick={() => this.handleEdit(row.id)}>
              编辑
            </AuthA>
            <Divider type="vertical" />
            <AuthPopConfirm
              title="你确定要删除该数据吗?"
              code={deleteCode}
              onConfirm={() => this.handleDelete(row.id)}
            >
              删除
            </AuthPopConfirm>
          </Fragment>
        ),
      },
    ];
    return list && list.length ? (
      <Card style={{ marginTop: '24px' }}>
        <Table
          rowKey="id"
          loading={tableLoading}
          columns={columns}
          dataSource={list}
          bordered
          scroll={{ x: 'max-content' }}
          pagination={{
            current: pageNum,
            pageSize,
            total,
            showQuickJumper: true,
            showSizeChanger: true,
            // pageSizeOptions: ['5', '10', '15', '20'],
            onChange: (pageNum, pageSize) => {
              this.handleQuery({ pageNum, pageSize });
            },
            onShowSizeChange: (pageNum, pageSize) => {
              this.handleQuery({ pageNum, pageSize });
            },
          }}
        />
      </Card>
    ) : (
        <div style={{ textAlign: 'center', padding: '70px' }}> 暂无数据</div>
      );
  }

  render () {

    return (
      <PageHeaderLayout
        title={TITLE}
        breadcrumbList={BREADCRUMB_LIST}
      // content={}
      >
        {this.renderForm()}
        {this.renderTable()}
      </PageHeaderLayout>
    )
  }
}
