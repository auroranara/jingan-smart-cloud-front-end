import React, { PureComponent } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import router from 'umi/router';
import { Button, Card, Input, message } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { connect } from 'dva';
import { aesEncrypt } from '@/utils/utils';

const FormItem = Form.Item;

const title = '修改密码';
const breadcrumbList = [
  { title: '首页', name: '首页', href: '/' },
  { title: '修改密码', name: '修改密码' },
];
const CodeTime = 30;

@connect(({ account, user, company, loading }) => ({
  user,
  account,
  company,
  loading: loading.effects['account/updatePwdNew'],
}))
@Form.create()
export default class ChangePassword extends PureComponent {
  state = {
    checkPassStatus: '',
    passwordRule: 1, //1简单  2 中等  3复杂
    codeTime: 0,
    code: '',
  };

  timer = null;

  componentDidMount() {
    const {
      user: {
        currentUser: { unitType },
      },
    } = this.props;
    this.handleResetForm();
    if (+unitType === 4) this.fetchPasswordRules();
  }

  componentWillUnmount() {
    this.timer && clearTimeout(this.timer);
  }

  fetchPasswordRules = () => {
    const {
      dispatch,
      user: {
        currentUser: { companyId },
      },
    } = this.props;
    dispatch({
      type: 'company/fetchCompany',
      payload: {
        id: companyId,
      },
      success: ({ passwordRule }) => {
        if (!passwordRule) return;
        this.setState({ passwordRule: +passwordRule });
      },
    });
  };

  // 提交表单
  handleSubmit = () => {
    const {
      dispatch,
      form: { validateFields },
      user: {
        currentUser: { phoneNumber },
      },
    } = this.props;
    if (!phoneNumber) {
      message.error('请先添加手机号码');
      return;
    }
    validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'account/updatePwdNew',
          payload: {
            phone: phoneNumber,
            password: aesEncrypt(values.newPassword),
            code: values.code,
            // oldPassword: aesEncrypt(values.oldPassword),
          },
          callback: response => {
            if (response.code && response.code === 200) {
              this.handleResetForm();
              message.success('密码修改成功！');
              dispatch({
                type: 'login/logout',
              });
            } else {
              message.error(response.msg || '密码修改失败!');
            }
          },
        });
      }
    });
  };

  // 验证旧密码
  validatePass = (rule, value, callback) => {
    const {
      dispatch,
      user: {
        currentUser: { id },
      },
    } = this.props;
    if (value) {
      this.setState({ checkPassStatus: 'validating' });
      dispatch({
        type: 'account/checkOldPass',
        payload: { oldPassword: aesEncrypt(value), id },
        callback: code => {
          this.setState({ checkPassStatus: code === 200 ? 'success' : 'error' });
          code === 200 ? callback() : callback('旧密码不正确');
        },
      });
    } else {
      callback();
      this.setState({ checkPassStatus: 'error' });
    }
  };

  // 验证确认密码
  validateConfirm = (rule, value, callback) => {
    const {
      form: { getFieldValue },
    } = this.props;
    if (value && value !== getFieldValue('newPassword')) {
      callback('两次输入的密码不匹配!');
    } else {
      callback();
    }
  };

  // 重置表单
  handleResetForm = () => {
    const {
      form: { resetFields },
    } = this.props;
    resetFields();
    this.setState({ code: '' });
  };

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
    // const reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]*$/;
    if (value) {
      // if (value.length >= 6 && value.length <= 16 && reg.test(value)) {
      if (reg.test(value)) {
        callback();
        return;
      }
    }
    callback(text);
  };

  handleClickCode = () => {
    const {
      dispatch,
      user: {
        currentUser: { phoneNumber },
      },
    } = this.props;
    if (!phoneNumber) {
      message.error('请先添加手机号码');
      return;
    }
    dispatch({
      type: 'account/sendVerifyCode',
      payload: { phone: phoneNumber },
      success: () => {
        message.success('验证码发送成功');
      },
      error: msg => {
        message.error(msg);
      },
    });
    this.setState({ codeTime: CodeTime }, () => {
      this.timer = setInterval(() => {
        const { codeTime } = this.state;
        if (codeTime === 0) clearInterval(this.timer);
        else this.setState({ codeTime: codeTime - 1 });
      }, 1000);
    });
  };

  handleChangeCode = e => {
    this.setState({ code: e.target.value });
  };

  render() {
    const {
      loading,
      form: { getFieldDecorator },
    } = this.props;
    const { code, codeTime } = this.state;
    const formItemLayout = {
      labelCol: {
        sm: { span: 24 },
        md: { span: 9 },
        lg: { span: 7 },
      },
      wrapperCol: {
        sm: { span: 24 },
        md: { span: 10 },
        lg: { span: 9 },
      },
    };
    const isSendingCode = codeTime !== 0;
    console.log(this.props);

    return (
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList}>
        <Card>
          <Form>
            {/* <FormItem
              hasFeedback={true}
              validateStatus={checkPassStatus}
              {...formItemLayout}
              label="旧密码"
            >
              {getFieldDecorator('oldPassword', {
                validateTrigger: 'onBlur',
                rules: [
                  { required: true, message: '请输入旧密码', whitespace: true },
                  { validator: this.validatePass },
                ],
              })(<Input.Password type="password" />)}
            </FormItem> */}
            <FormItem
              // hasFeedback={true}
              // validateStatus={checkPassStatus}
              {...formItemLayout}
              label="短信验证码"
            >
              {getFieldDecorator('code', {
                validateTrigger: 'onBlur',
                rules: [
                  { required: true, message: '请输入短信验证码', whitespace: true },
                  // { validator: this.validatePass },
                ],
              })(
                <div style={{ position: 'relative' }}>
                  <Input maxLength={6} value={code} onChange={this.handleChangeCode} />
                  <Button
                    onClick={this.handleClickCode}
                    style={{ position: 'absolute', right: -112, top: 3 }}
                    disabled={isSendingCode}
                  >
                    {isSendingCode ? `重新获取(${codeTime})` : '获取验证码'}
                  </Button>
                </div>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="新密码">
              {getFieldDecorator('newPassword', {
                rules: [
                  { required: true, message: '请输入新密码', whitespace: true },
                  //{ min: 6, max: 20, message: '密码长度请控制在5到15位' },
                  {
                    validator: this.validatorPassword,
                  },
                ],
              })(<Input.Password type="password" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="确认新密码">
              {getFieldDecorator('reNewPassword', {
                rules: [
                  { required: true, message: '请确认新密码', whitespace: true },
                  { validator: this.validateConfirm },
                ],
              })(<Input.Password type="password" />)}
            </FormItem>
            <FormItem
              wrapperCol={{
                xs: { span: 24, offset: 4 },
                sm: { span: 16, offset: 8 },
                md: { span: 13, offset: 8 },
                lg: { span: 9, offset: 9 },
              }}
            >
              <Button loading={loading} type="primary" onClick={this.handleSubmit}>
                提交
              </Button>
              <Button onClick={this.handleResetForm} style={{ marginLeft: 80 }}>
                重置
              </Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderLayout>
    );
  }
}
