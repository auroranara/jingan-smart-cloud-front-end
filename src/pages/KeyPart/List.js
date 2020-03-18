import React, { Component } from 'react';
import {
  Button,
  Input,
  Card,
  Table,
  message,
  Divider,
  Form,
  Row,
  Col,
  Select,
  TreeSelect,
} from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import CustomUpload from '@/jingan-components/CustomUpload';
import { connect } from 'dva';
import router from 'umi/router';
// import moment from 'moment';
import codes from '@/utils/codes'
import CompanySelect from '@/jingan-components/CompanySelect';
// 审核弹窗
import { AuthPopConfirm, AuthA, AuthButton } from '@/utils/customAuth';

const FormItem = Form.Item;
const { TreeNode: TreeSelectNode } = TreeSelect;

const {
  keyPart: {
    add: addCode,
    edit: editCode,
    delete: deleteCode,
    detail: detailCode,
  },
} = codes;
const TITLE = '关键装置重点部位';
const BREADCRUMB_LIST = [
  {
    title: '首页',
    name: '首页',
    href: '/',
  },
  {
    title: '设备设施管理',
    name: '设备设施管理',
  },
  {
    title: TITLE,
    name: TITLE,
  },
];
const colWrapper = {
  md: 8,
  sm: 12,
};
const formItemStyle = { style: { margin: '0', padding: '4px 0' } };
// 装置部位分类
export const partClassification = [
  { key: '1', value: '关键装置' },
  { key: '3', value: '重点部位' },
];

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

@connect(({ account, keyPart, user }) => ({
  account,
  keyPart,
  user,
}))
@Form.create()
export default class KeypartList extends Component {

  componentDidMount () {
    this.handleQuery();
    const { user: { isCompany, currentUser } } = this.props;
    if (isCompany) {
      this.fetchDepartmentList({ payload: { companyId: currentUser.companyId } })
    } else {
      // 清空部门
      this.resetDepartment();
    }
  }

  // 查询列表
  handleQuery = (payload = {}) => {
    const {
      dispatch,
      form: { getFieldsValue },
    } = this.props;
    const { company, ...resValues } = getFieldsValue();
    dispatch({
      type: 'keyPart/fetchKeyPartList',
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
    const { form: { resetFields } } = this.props;
    resetFields();
    this.handleQuery();
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

  handleToAdd = () => {
    router.push('/facility-management/key-part/add')
  }

  handleDelete = (id) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'keyPart/deleteKeyPart',
      payload: { id },
      callback: (success, msg) => {
        if (success) {
          message.success('删除成功');
          this.handleQuery();
        } else {
          message.error(msg || '删除失败');
        }
      },
    })
  }

  handleEdit = id => {
    router.push(`/facility-management/key-part/edit/${id}`)
  }

  handleView = id => {
    router.push(`/facility-management/key-part/detail/${id}`)
  }

  // 企业发生变化
  handleCompanyChange = company => {
    if (company && company.key !== company.label) {
      this.fetchDepartmentList({ payload: { companyId: company.key } });
      this.props.form.setFieldsValue({ department: undefined });
    }
  }

  renderForm = () => {
    const {
      user: { isCompany },
      form: { getFieldDecorator },
      account: { departments },
    } = this.props;
    const treeList = treeData(departments);
    return (
      <Card bordered={false}>
        <Form>
          <Row gutter={30}>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('facilityName')(
                  <Input placeholder="装置/部位名称" />
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('type')(
                  <Select placeholder="装置部位分类">
                    {partClassification.map(({ key, value }) => (
                      <Select.Option key={key} value={key}>{value}</Select.Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('location')(
                  <Input placeholder="具体位置" />
                )}
              </FormItem>
            </Col>
            {!isCompany && (
              <Col {...colWrapper}>
                <FormItem {...formItemStyle}>
                  {getFieldDecorator('company')(
                    <CompanySelect
                      onChange={this.handleCompanyChange}
                    />
                  )}
                </FormItem>
              </Col>
            )}
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('department')(
                  <TreeSelect
                    allowClear
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    placeholder="请选择所属部门"
                  >
                    {treeList}
                  </TreeSelect>
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('name')(
                  <Input placeholder="负责人姓名" />
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                <Button style={{ marginRight: '10px' }} type="primary" onClick={() => this.handleQuery()}>
                  查询
                </Button>
                <Button style={{ marginRight: '10px' }} onClick={this.handleReset}>
                  重置
                </Button>
                <AuthButton code={addCode} type="primary" onClick={this.handleToAdd}>
                  新增
                </AuthButton>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Card>
    );
  }

  renderTable = () => {
    const {
      keyPart: {
        list,
        pagination: { pageNum, pageSize, total },
      },
    } = this.props;

    const columns = [
      {
        title: '单位名称',
        dataIndex: 'companyName',
        align: 'center',
        width: 300,
      },
      {
        title: '装置/部位名称',
        dataIndex: 'facilityName',
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
        title: '具体位置',
        dataIndex: 'location',
        align: 'center',
        width: 200,
      },
      {
        title: '负责人姓名',
        dataIndex: 'name',
        align: 'center',
        width: 200,
      },
      {
        title: '相关应急预案',
        dataIndex: 'contingencyPlanContent',
        align: 'center',
        width: 200,
        render: value => <CustomUpload value={value} type="span" />,
      },
      {
        title: '操作',
        dataIndex: 'id',
        width: 200,
        align: 'center',
        fixed: list && list.length > 0 ? 'right' : false,
        render: (_, { id, status }) => (
          <div>
            <AuthA code={detailCode} onClick={() => this.handleView(id)} >
              查看
            </AuthA>
            <Divider type="vertical" />
            <AuthA code={editCode} onClick={() => this.handleEdit(id)} >
              编辑
            </AuthA>
            <Divider type="vertical" />
            <AuthPopConfirm
              title="你确定要删除吗?"
              code={deleteCode}
              onConfirm={() => this.handleDelete(id)}
            >
              删除
            </AuthPopConfirm>
          </div>
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
          scroll={{ x: 'max-content' }}
          pagination={{
            current: pageNum,
            pageSize,
            total,
            showQuickJumper: true,
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '15', '20'],
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
    const {
      keyPart: {
        pagination: { total = 0 },
        companyNum = 0,
      },
      user: { isCompany },
    } = this.props;
    return (
      <PageHeaderLayout
        title={TITLE}
        breadcrumbList={BREADCRUMB_LIST}
        content={(
          <div>
            {!isCompany && <span style={{ marginRight: '1em' }}>{`单位数量：${companyNum}`}</span>}
            <span>{`关键装置重点部位数量：${total}`}</span>
          </div>
        )}
      >
        {this.renderForm()}
        {this.renderTable()}
      </PageHeaderLayout>
    )
  }
}
