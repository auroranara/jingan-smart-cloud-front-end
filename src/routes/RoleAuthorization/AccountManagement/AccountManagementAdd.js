import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Card, Row, Col, Input, Select, Button, message, Icon, Popover, Spin } from 'antd';
import { routerRedux } from 'dva/router';
import FooterToolbar from 'components/FooterToolbar';

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

/* 表单标签 */
const fieldLabels = {
  loginName: '用户名',
  password: '密码',
  userName: '姓名',
  phoneNumber: '手机号',
  unitType: '单位类型',
  unitId: '所属单位',
  accountStatus: '账号状态',
};

/* root下的div */
const getRootChild = () => document.querySelector('#root>div');

@connect(
  ({ accountmanagement, loading }) => ({
    accountmanagement,
    loading: loading.models.accountmanagement,
  }),
  dispatch => ({
    fetchOptions(action) {
      dispatch({
        type: 'accountmanagement/fetchOptions',
        ...action,
      });
    },
    fetchUnitList(action) {
      dispatch({
        type: 'accountmanagement/fetchUnitList',
        ...action,
      });
    },
    addAccount(action) {
      dispatch({
        type: 'accountmanagement/addAccount',
        ...action,
      });
    },
    goBack() {
      dispatch(routerRedux.push(href));
    },
  })
)
@Form.create()
export default class AccountManagementAdd extends PureComponent {
  state = {
    submitting: false,
  };

  /* 生命周期函数 */
  componentWillMount() {
    const { fetchOptions, fetchUnitList } = this.props;

    // 获取单位类型
    fetchOptions({
      payload: {
        type: 'unitType',
        key: 'unitTypes',
      },
    });

    // 获取账号状态
    fetchOptions({
      payload: {
        type: 'accountStatus',
        key: 'accountStatuses',
      },
    });

    // 获取所属单位
    fetchUnitList({
      payload: {
        type: 'unitId',
        key: 'unitIds',
      },
    });
  }

  /* 点击提交按钮验证表单信息 */
  handleClickValidate = () => {
    const {
      addAccount,
      goBack,
      form: { validateFieldsAndScroll },
    } = this.props;
    // 如果验证通过则提交，没有通过则滚动到错误处
    validateFieldsAndScroll((error, values) => {
      if (!error) {
        this.setState({
          submitting: true,
        });
        addAccount({
          payload: {
            ...values,
          },
          success: () => {
            message.success('新建成功！', () => {
              goBack();
            });
          },
          error: err => {
            message.error(err, () => {
              this.setState({
                submitting: false,
              });
            });
          },
        });
      }
    });
  };

  /* 选择单位类型以后查询所属单位 */
  handleQueryUnit = value => {
    const { fetchUnitList } = this.props;
    fetchUnitList({
      payload: {
        unitType: value,
      },
    });
  };

  /* 渲染基本信息 */
  renderBasicInfo() {
    const {
      accountmanagement: { unitTypes, accountStatuses, unitIds },
      form: { getFieldDecorator },
    } = this.props;

    const { Option } = Select;

    return (
      <Card title="基础信息" className={styles.card} bordered={false}>
        <Form layout="vertical">
          <Row gutter={{ lg: 48, md: 24 }}>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.loginName}>
                {getFieldDecorator('loginName', {
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      type: 'string',
                      message: '请输入用户名',
                    },
                  ],
                })(<Input placeholder="请输入用户名" min={1} max={20} />)}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.password}>
                {getFieldDecorator('password', {
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      type: 'string',
                      message: '请输入密码',
                    },
                  ],
                })(<Input placeholder="请输入密码" min={6} max={20} />)}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.accountStatus}>
                {getFieldDecorator('accountStatus', {
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      type: 'integer',
                      message: '请选择账号状态',
                    },
                  ],
                })(
                  <Select placeholder="请选择账号状态" getPopupContainer={getRootChild}>
                    {accountStatuses.map(item => (
                      <Option value={item.id} key={item.id}>
                        {item.label}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.userName}>
                {getFieldDecorator('userName', {
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      type: 'string',
                      message: '请输入姓名',
                    },
                  ],
                })(<Input placeholder="请输入姓名" min={1} max={10} />)}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.phoneNumber}>
                {getFieldDecorator('phoneNumber', {
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      type: 'string',
                      message: '请输入手机号',
                    },
                  ],
                })(<Input placeholder="请输入手机号" min={11} max={11} />)}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.unitType}>
                {getFieldDecorator('unitType', {
                  rules: [
                    {
                      required: true,
                      message: '请选择单位类型',
                    },
                  ],
                })(
                  <Select
                    placeholder="请选择单位类型"
                    getPopupContainer={getRootChild}
                    onChange={this.handleQueryUnit}
                  >
                    {unitTypes.map(item => (
                      <Option value={item.id} key={item.id}>
                        {item.label}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.unitId}>
                {getFieldDecorator('unitId', {
                  rules: [
                    {
                      required: true,
                      message: '请选择所属单位',
                    },
                  ],
                })(
                  <Select
                    // mode="multiple"
                    // labelInValue
                    placeholder="请选择所属单位"
                    getPopupContainer={getRootChild}
                  >
                    {unitIds.map(item => (
                      <Option value={item.id} key={item.id}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    );
  }

  /* 渲染错误信息 */
  renderErrorInfo() {
    const {
      form: { getFieldsError },
    } = this.props;
    const errors = getFieldsError();
    const errorCount = Object.keys(errors).filter(key => errors[key]).length;
    if (!errors || errorCount === 0) {
      return null;
    }
    const scrollToField = fieldKey => {
      const labelNode = document.querySelector(`label[for="${fieldKey}"]`);
      if (labelNode) {
        labelNode.scrollIntoView(true);
      }
    };
    const errorList = Object.keys(errors).map(key => {
      if (!errors[key]) {
        return null;
      }
      return (
        <li key={key} className={styles.errorListItem} onClick={() => scrollToField(key)}>
          <Icon type="cross-circle-o" className={styles.errorIcon} />
          <div className={styles.errorMessage}>{errors[key][0]}</div>
          <div className={styles.errorField}>{fieldLabels[key]}</div>
        </li>
      );
    });
    return (
      <span className={styles.errorIcon}>
        <Popover
          title="表单校验信息"
          content={errorList}
          overlayClassName={styles.errorPopover}
          trigger="click"
          getPopupContainer={trigger => trigger.parentNode}
        >
          <Icon type="exclamation-circle" />
          {errorCount}
        </Popover>
      </span>
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
        <Spin spinning={loading || submitting}>
          {this.renderBasicInfo()}
          {this.renderFooterToolbar()}
        </Spin>
      </PageHeaderLayout>
    );
  }
}
