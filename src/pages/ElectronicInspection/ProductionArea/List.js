import React, { Component, Fragment, createRef } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Input, Card, Table, message, Modal, Divider, Row, Col, Select, TreeSelect } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import SelectOrSpan from '@/jingan-components/SelectOrSpan';
import CustomUpload from '@/jingan-components/CustomUpload';
import { connect } from 'dva';
import router from 'umi/router';
import moment from 'moment';
import codes from '@/utils/codes'
import { AuthPopConfirm, AuthA, AuthButton } from '@/utils/customAuth';
import CompanySelect from '@/jingan-components/CompanySelect';

export const LIST_PATH = '/electronic-inspection/production-area/list';
export const ADD_PATH = '/electronic-inspection/production-area/add'

const { TreeNode: TreeSelectNode } = TreeSelect;

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

@connect(({ user, account }) => ({
  user,
  account,
}))
export default class ProductionAreaList extends Component {

  // 获取部门列表
  fetchDepartmentList = actions => {
    const { dispatch } = this.props;
    dispatch({
      type: 'account/fetchDepartmentList',
      ...actions,
    })
  }

  formRef = createRef();

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
      account: { departments },
    } = this.props;
    const treeList = treeData(departments);
    return (
      <Card>
        <Form ref={this.formRef}>
          <Form.Item name="company" label="单位名称">
            <CompanySelect
              onChange={this.handleCompanyChange}
            />
          </Form.Item>
          <Form.Item name="department" label="所属部门">
            <TreeSelect
              allowClear
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              placeholder="请选择所属部门"
            >
              {treeList}
            </TreeSelect>
          </Form.Item>
          <Form.Item name="name" label="区域名称">
            <Input placeholder="区域名称" />
          </Form.Item>
          <Form.Item name="personName" label="负责人姓名">
            <Input placeholder="负责人姓名" />
          </Form.Item>
        </Form>
      </Card>
    )
  }

  renderTable = () => { }

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
