import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Card, Button, Row, Col, Input, Cascader, Select } from 'antd';
// import { routerRedux } from 'dva/router';

import FooterToolbar from 'components/FooterToolbar';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout.js';

import styles from './AccountManagementEdit.less';

// 标题
const title = '编辑账号';
// 面包屑
const breadcrumbList = [
  {
    title: '首页',
    href: '/',
  },
  {
    title: '权限管理',
    href: '/',
  },
  {
    title: '账号管理',
    href: '/role-authorization/account-management/list',
  },
  {
    title,
  },
];

/* 表单标签 */
const fieldLabels = {
  user: '用户名',
  name: '姓名',
  phone: '手机号',
  unitType: '单位类型',
  hasUnit: '所属单位',
  accountStatus: '账号状态',
};

@connect(({ accountmanagement, loading }) => ({
  accountmanagement,
  loading: loading.models.accountmanagement,
}))
@Form.create()
export default class AccountManagementEdit extends PureComponent {
  /* 生命周期函数 */
  componentWillMount() {}

  /* 去除左右两边空白 */
  handleTrim = e => e.target.value.trim();

  /* 渲染基础信息 */
  renderBasicInfo() {
    const {
      accountmanagement: { detail: data },
      form: { getFieldDecorator },
    } = this.props;

    const { Option } = Select;

    return (
      <Card title="账号基础信息" className={styles.card} bordered={false}>
        <Form layout="vertical">
          <Row gutter={{ lg: 48, md: 24 }}>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.user}>
                {getFieldDecorator('user', {
                  initialValue: data.user,
                  getValueFromEvent: this.handleTrim,
                  rules: [{ message: '请输入用户名' }],
                })(<Input placeholder="请输入用户名" />)}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.name}>
                {getFieldDecorator('name', {
                  initialValue: data.name,
                  getValueFromEvent: this.handleTrim,
                  rules: [{ message: '请输入姓名' }],
                })(<Input placeholder="请输入姓名" />)}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.phone}>
                {getFieldDecorator('phone', {
                  initialValue: data.phone,
                  getValueFromEvent: this.handleTrim,
                  rules: [{ message: '请输入手机号' }],
                })(<Input placeholder="请输入手机号" />)}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.unitType}>
                {getFieldDecorator('unitType', {
                  initialValue: data.unitType,
                  getValueFromEvent: this.handleTrim,
                  rules: [{ message: '政府单位' }],
                })(<Cascader placeholder="政府单位" />)}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.hasUnit}>
                {getFieldDecorator('hasUnit', {
                  initialValue: data.hasUnit,
                  getValueFromEvent: this.handleTrim,
                  rules: [{ message: '所属单位' }],
                })(<Cascader placeholder="所属单位" />)}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.accountStatus}>
                <Select defaultValue="启用">
                  <Option value="启用">启用</Option>
                  <Option value="禁用">禁用</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    );
  }

  /* 渲染底部工具栏 */
  renderFooterToolbar() {
    const { loading } = this.props;
    return (
      <FooterToolbar>
        <Button type="primary" loading={loading}>
          提交
        </Button>
      </FooterToolbar>
    );
  }
  render() {
    const content = (
      <div>
        <p>编辑单个账号的基本信息，角色权限、数据权限</p>
      </div>
    );

    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        wrapperClassName={styles.advancedForm}
        content={content}
      >
        {this.renderBasicInfo()}
        {this.renderFooterToolbar()}
      </PageHeaderLayout>
    );
  }
}
