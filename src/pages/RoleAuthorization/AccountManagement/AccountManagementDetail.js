import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Card, Button, Modal, Input, message } from 'antd';
import { routerRedux } from 'dva/router';

import DescriptionList from 'components/DescriptionList';
import FooterToolbar from 'components/FooterToolbar';
import PageHeaderLayout from '../../layouts/PageHeaderLayout.js';

import styles from './AccountManagementEdit.less';

const { Description } = DescriptionList;

// 标题
const title = '查看账号';
// 面包屑
const breadcrumbList = [
  {
    title: '首页',
  },
  {
    title: '权限管理',
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
  loginName: '用户名',
  password: '密码',
  userName: '姓名',
  phoneNumber: '手机号',
  unitType: '单位类型',
  unitId: '所属单位',
  accountStatus: '账号状态',
  treeIds: '数据权限',
};

const UnitTypes = ['', '维保企业', '政府机构', '运营企业', '一般企业'];

/* 获取无数据 */
const getEmptyData = () => {
  return <span style={{ color: 'rgba(0,0,0,0.45)' }}>暂无数据</span>;
};

@connect(({ account, loading }) => ({
  account,
  loading: loading.models.account,
}))
@Form.create()
export default class accountManagementDetail extends PureComponent {
  state = { visible: false };

  /* 生命周期函数 */
  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;

    // 获取详情
    dispatch({
      type: 'account/fetchAccountDetail',
      payload: { id },
      error() {
        dispatch(routerRedux.push('/exception/500'));
      },
    });
  }

  // 跳转到编辑页面
  goToEdit = id => {
    const { dispatch } = this.props;
    dispatch(routerRedux.push(`/role-authorization/account-management/edit/${id}`));
  };

  /* 显示重置密码模态框 */
  showModalPassword = () => {
    this.setState({
      visible: true,
    });
  };

  /* 判断输入的两次密码是否一致 */
  checkConfirm = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('newPassword')) {
      callback('两次输入的密码不匹配!');
    } else {
      callback();
    }
  };

  /* 点击提交按钮验证信息 */
  handleOk = () => {
    const {
      form,
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;
    form.validateFields((err, { password }) => {
      if (!err) {
        dispatch({
          type: 'account/updateAccountPwd',
          payload: {
            id,
            password,
          },
          success: () => {
            message.success('提交成功！', () => {
              this.handleCancel();
            });
          },
          err: () => {
            message.err('提交失败！', () => {});
          },
        });
      }
    });
  };

  /* 隐藏模态框 */
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  /* 渲染基础信息 */
  renderBasicInfo() {
    const {
      account: {
        detail: {
          data: { loginName, userName, phoneNumber, unitType, unitName, accountStatus },
        },
      },
    } = this.props;

    return (
      <Card title="基础信息" className={styles.card} bordered={false}>
        <DescriptionList col={3}>
          <Description term={fieldLabels.loginName}>{loginName || getEmptyData()}</Description>
          <Description term={fieldLabels.userName}>{userName || getEmptyData()}</Description>
          <Description term={fieldLabels.phoneNumber}>{phoneNumber || getEmptyData()}</Description>
          <Description term={fieldLabels.unitType}>
            {UnitTypes[unitType] || getEmptyData()}
          </Description>
          <Description term={fieldLabels.unitId}>{unitName || getEmptyData()}</Description>
          <Description term={fieldLabels.accountStatus}>
            {accountStatus === 1 ? '启用' : '禁用' || getEmptyData()}
          </Description>
        </DescriptionList>
      </Card>
    );
  }

  /* 渲染角色权限信息 */
  renderRolePermission() {
    const {
      account: {
        detail: {
          data: { treeNames },
        },
      },
    } = this.props;

    return (
      <Card title="角色权限配置" className={styles.card} bordered={false}>
        <DescriptionList layout="vertical">
          <Description term={fieldLabels.treeIds}>
            <p style={{ paddingTop: 15 }}>{treeNames || getEmptyData()}</p>
            <p style={{ fontSize: 12 }}>包括该组织下的所有数据</p>
          </Description>
        </DescriptionList>
      </Card>
    );
  }

  /* 渲染底部工具栏 */
  renderFooterToolbar() {
    const {
      match: {
        params: { id },
      },
      form: { getFieldDecorator },
    } = this.props;

    const { visible } = this.state;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };
    return (
      <FooterToolbar>
        <Button type="primary" onClick={this.showModalPassword}>
          重置密码
        </Button>
        <Button
          type="primary"
          onClick={() => {
            this.goToEdit(id);
          }}
        >
          编辑
        </Button>
        <Modal
          title="重置密码"
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          okText="确认"
          cancelText="取消"
        >
          <Form.Item {...formItemLayout} label="密码">
            {getFieldDecorator('newPassword', {
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: '请输入密码',
                },
              ],
            })(<Input placeholder="请重新输入密码" type="password" />)}
          </Form.Item>
          <Form.Item {...formItemLayout} label="确认密码">
            {getFieldDecorator('password', {
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: '请重新输入密码',
                },
                {
                  validator: this.checkConfirm,
                },
              ],
            })(<Input placeholder="请重新输入密码" type="password" />)}
          </Form.Item>
        </Modal>
      </FooterToolbar>
    );
  }

  render() {
    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        wrapperClassName={styles.advancedForm}
      >
        {this.renderBasicInfo()}
        {this.renderRolePermission()}
        {this.renderFooterToolbar()}
      </PageHeaderLayout>
    );
  }
}
