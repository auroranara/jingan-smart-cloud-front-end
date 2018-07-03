import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {
  Form,
  Card,
  Row,
  Col,
  Input,
  Cascader,
  Select,
  // FooterToolbar,
  // Button
} from 'antd';
// import moment from 'moment';

import PageHeaderLayout from '../../../layouts/PageHeaderLayout.js';

import styles from './AccountManagementAdd.less';

// 标题
const title = '新增账号';
// 返回地址
const href = '/role-authorization/account-management/list';
// 面包屑
const breadcrumbList = [
  {
    title: '首页',
    href: '/',
  },
  {
    title: '权限管理',
  },
  {
    title: '账号管理',
    href,
  },
  {
    title,
  },
];

@connect(({ company, loading }) => ({
  company,
  loading: loading.models.company,
}))
@Form.create()
export default class AccountManagementAdd extends PureComponent {
  /* 去除左右两边空白 */
  handleTrim = e => e.target.value.trim();

  /* 渲染基本信息 */
  renderBasicInfo() {
    const {
      form: { getFieldDecorator },
    } = this.props;

    const { Option } = Select;

    return (
      <Card title="基础信息" className={styles.card} bordered={false}>
        <Form layout="vertical">
          <Row gutter={{ lg: 48, md: 24 }}>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label="用户名">
                {getFieldDecorator('user', {
                  getValueFromEvent: this.handleTrim,
                })(<Input placeholder="请输入用户名" />)}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label="姓名">
                {getFieldDecorator('name', {
                  getValueFromEvent: this.handleTrim,
                })(<Input placeholder="请输入姓名" />)}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label="手机号">
                {getFieldDecorator('phone', {
                  getValueFromEvent: this.handleTrim,
                })(<Input placeholder="请输入手机号" />)}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label="单位类型">
                {getFieldDecorator('unitType', {
                  getValueFromEvent: this.handleTrim,
                })(<Cascader placeholder="维保企业" />)}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label="所属单位">
                {getFieldDecorator('hasUnit', {
                  getValueFromEvent: this.handleTrim,
                })(<Cascader placeholder="所属单位" />)}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label="账号状态">
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
  // renderFooterToolbar() {
  //   const { loading } = this.props;
  //   const { submitting } = this.state;
  //   return (
  //     <FooterToolbar>
  //       <Button>取消</Button>
  //       <Button type="primary" loading={loading || submitting}>
  //         提交
  //       </Button>
  //     </FooterToolbar>
  //   );
  // }

  render() {
    const content = (
      <div>
        <p>创建单个账号，包括基本信息、角色权限等</p>
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
      </PageHeaderLayout>
    );
  }
}
