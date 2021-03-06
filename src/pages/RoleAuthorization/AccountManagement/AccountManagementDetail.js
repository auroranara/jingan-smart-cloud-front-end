import React, { PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Card, Modal, Input, message, Badge } from 'antd';
import { routerRedux } from 'dva/router';

import DescriptionList from '@/components/DescriptionList';
import FooterToolbar from '@/components/FooterToolbar';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';

import styles from './AccountManagementEdit.less';
import { aesEncrypt } from '@/utils/utils';
import { AuthButton } from '@/utils/customAuth';
import codesMap from '@/utils/codes';
import { getLabel, FIELD_LABELS as fieldLabels, SEXES, DEGREES } from './utils';

const { Description } = DescriptionList;

// 标题
const title = '查看账号';
// 面包屑
const breadcrumbList = [
  {
    title: '首页',
    name: '首页',
  },
  {
    title: '权限管理',
    name: '权限管理',
  },
  {
    title: '账号管理',
    name: '账号管理',
    href: '/role-authorization/account-management/list',
  },
  {
    title,
    name: '查看账号',
  },
];
@connect(({ account, company, loading }) => ({
  account,
  company,
  loading: loading.models.account,
}))
@Form.create()
export default class accountManagementDetail extends PureComponent {
  state = {
    companyType: false,
    gavType: false,
    visible: false,
    passwordRule: 1,
  };

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
      payload: {
        id,
      },
      success: ({ unitType, passwordRule }) => {
        this.setState({
          companyType: unitType === 4,
          gavType: unitType === 2,
        });
        if (passwordRule) this.setState({ passwordRule: +passwordRule });
      },
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

  handleRestForm = () => {
    const {
      form: { resetFields },
    } = this.props;
    resetFields();
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
            loginId: id,
            password: aesEncrypt(password),
          },
          callback: response => {
            if (response.code && response.code === 200) {
              this.handleCancel();
              message.success('提交成功！');
            } else {
              message.error(response.msg || '提交失败！!');
            }
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
    this.handleRestForm();
  };

  /* 渲染基础信息 */
  renderBasicInfo() {
    const {
      account: {
        detail: {
          data: {
            loginName,
            accountStatus,
            userName,
            phoneNumber,
            sex,
            birth,
            education,
            major,
            educationFileList,
            avatarFileList,
          },
        },
      },
    } = this.props;

    return (
      <Card title="基础信息" className={styles.card} bordered={false}>
        <DescriptionList col={3}>
          <Description term={fieldLabels.loginName}>{loginName || '-'}</Description>
          <Description term={fieldLabels.accountStatus}>
            {accountStatus === 1 ? (
              <span>
                <Badge status="success" />
                启用
              </span>
            ) : (
              (
                <span>
                  <Badge status="error" />
                  禁用
                </span>
              ) || '-'
            )}
          </Description>
          <Description term={fieldLabels.userName}>{userName || '-'}</Description>
          <Description term={fieldLabels.sex}>{getLabel(sex, SEXES)}</Description>
          <Description term={fieldLabels.birthday}>
            {birth ? moment(birth).format('YYYY-MM-DD') : '-'}
          </Description>
          <Description term={fieldLabels.phoneNumber}>
            {(phoneNumber + '').trim() || '-'}
          </Description>
          <Description term={fieldLabels.degree}>{getLabel(education, DEGREES)}</Description>
          <Description term={fieldLabels.major}>{major}</Description>
        </DescriptionList>
        <DescriptionList col={1} style={{ marginTop: 20 }}>
          <Description term={fieldLabels.avatar}>
            {Array.isArray(avatarFileList) && avatarFileList.length
              ? avatarFileList.map(({ id, fileName, webUrl }) => (
                  <p style={{ margin: 0 }}>
                    <a key={id} href={webUrl} target="_blank" rel="noopener noreferrer">
                      {fileName}
                    </a>
                  </p>
                ))
              : '暂无头像'}
          </Description>
          <Description term={fieldLabels.attached}>
            {Array.isArray(educationFileList) && educationFileList.length
              ? educationFileList.map(({ id, fileName, webUrl }) => (
                  <a
                    key={id}
                    href={webUrl}
                    style={{ marginRight: 20 }}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {fileName}
                  </a>
                ))
              : '暂无附件'}
          </Description>
        </DescriptionList>
      </Card>
    );
  }

  // 验证密码
  validatorPassword = (rule, value, callback) => {
    const { passwordRule } = this.state;
    let reg, text;
    switch (passwordRule) {
      case 1:
        reg = /^(?=.*[a-zA-Z])(?=.*\d)[^]{6,16}$/;
        text = '密码长度为6-16个字符，其中必须包含字母、数字';
        break;
      case 2:
        reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{6,16}$/;
        text = '密码长度为6-16个字符，其中必须包含大写字母、小写字母和数字';
        break;
      case 3:
        reg = /^(?=.*?[A-Z])(?=(.*[a-z]){1,})(?=(.*[\d]){1,})(?=(.*[\W]){1,})(?!.*\s).{6,16}$/;
        text = '密码长度为6-16个字符，其中必须包含大写字母、小写字母、数字和特殊字符（除空格）';
        break;
      default:
        reg = /^(?=.*[a-zA-Z])(?=.*\d)[^]{6,16}$/;
        text = '密码长度为6-16个字符，其中必须包含字母、数字';
        break;
    }
    if (value) {
      if (reg.test(value)) {
        callback();
        return;
      }
    }
    callback(text);
  };

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
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
        md: { span: 16 },
      },
    };
    return (
      <FooterToolbar>
        <AuthButton
          code={codesMap.account.reset}
          type="primary"
          size="large"
          onClick={this.showModalPassword}
        >
          重置密码
        </AuthButton>
        <Button size="large" onClick={e => window.close()}>
          返回
        </Button>
        {/* <AuthButton
          code={codesMap.account.edit}
          type="primary"
          size="large"
          onClick={() => {
            this.goToEdit(id);
          }}
        >
          编辑
        </AuthButton> */}
        <Modal
          title="重置密码"
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          okText="确认"
          cancelText="取消"
          width={650}
        >
          <Form.Item {...formItemLayout} label="密码">
            {getFieldDecorator('newPassword', {
              rules: [
                {
                  required: true,
                  whitespace: true,
                  message: '请输入密码',
                },
                {
                  validator: this.validatorPassword,
                },
              ],
            })(<Input.Password placeholder="请重新输入密码" type="password" />)}
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
            })(<Input.Password placeholder="请重新输入密码" type="password" />)}
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
        {this.renderFooterToolbar()}
      </PageHeaderLayout>
    );
  }
}
