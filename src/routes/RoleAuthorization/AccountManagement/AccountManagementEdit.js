import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Card, Button, Row, Col, Input, Cascader, Spin } from 'antd';
import { routerRedux } from 'dva/router';

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
};

@connect(
  ({ accountmanagement, loading }) => ({
    accountmanagement,
    loading: loading.models.accountmanagement,
  }),
  dispatch => ({
    // 修改
    editCompany(action) {
      dispatch({
        type: 'accountmanagement/',
        ...action,
      });
    },
    // 获取详情
    fetchCompany(action) {
      dispatch({
        type: 'accountmanagement/',
        ...action,
      });
    },
    // 返回
    goBack() {
      dispatch(routerRedux.push('/role-authorization/account-management/list'));
    },
    // 异常
    goToException() {
      dispatch(routerRedux.push('/exception/500'));
    },
  })
)
@Form.create()
export default class AccountManagementEdit extends PureComponent {
  /* 生命周期函数 */
  componentWillMount() {}

  /* 去除左右两边空白 */
  handleTrim = e => e.target.value.trim();

  /* 渲染基础信息 */
  renderBasicInfo() {
    const {
      detail: {
        data: { user, name, unitType, hasUnit },
      },
      form: { getFieldDecorator },
    } = this.props;

    return (
      <Card title="账号基础信息" className={styles.card} bordered={false}>
        <Form layout="vertical">
          <Row gutter={{ lg: 48, md: 24 }}>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.user}>
                {getFieldDecorator('user', {
                  initialValue: user,
                  getValueFromEvent: this.handleTrim,
                  rules: [{ required: true, message: '请输入用户名' }],
                })(<Input placeholder="请输入用户名" />)}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.name}>
                {getFieldDecorator('name', {
                  initialValue: name,
                  getValueFromEvent: this.handleTrim,
                  rules: [{ required: true, message: '请输入手机号' }],
                })(<Input placeholder="请输入手机号" />)}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.unitType}>
                {getFieldDecorator('unitType', {
                  initialValue: unitType,
                  getValueFromEvent: this.handleTrim,
                  rules: [{ required: true, message: '政府单位' }],
                })(<Cascader placeholder="政府单位" />)}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.hasUnit}>
                {getFieldDecorator('hasUnit', {
                  initialValue: hasUnit,
                  getValueFromEvent: this.handleTrim,
                  rules: [{ required: true, message: '所属单位' }],
                })(<Cascader placeholder="所属单位" />)}
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
    const { submitting } = this.state;
    return (
      <FooterToolbar>
        {this.renderErrorInfo()}
        <Button type="primary" onClick={this.handleClickValidate} loading={loading || submitting}>
          提交
        </Button>
      </FooterToolbar>
    );
  }
  render() {
    const { loading } = this.props;
    const { submitting } = this.state;
    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        wrapperClassName={styles.advancedForm}
      >
        <Spin spinning={loading || submitting}>
          {this.renderBasicInfo()}
          {this.renderFooterToolbar()}
        </Spin>
      </PageHeaderLayout>
    );
  }
}
