import React, { PureComponent, Fragment } from 'react';
// import { Route, Redirect, Switch } from 'dva/router';
import { connect } from 'dva';
import { Input, Button, message, Row, Col } from 'antd';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import router from 'umi/router';
import { aesEncrypt } from '@/utils/utils';
import styles from './ForgetPassword.less';

const CodeTime = 60;
const InputGroup = Input.Group;
const FormItem = Form.Item;

@connect(({ account, user, company, loading }) => ({
  user,
  account,
  company,
  loading: loading.effects['account/updatePwdNew'],
}))
@Form.create()
export default class ForgetPassword extends PureComponent {
  state = {
    checkPassStatus: '',
    passwordRule: 1, //1简单  2 中等  3复杂
    codeTime: 0,
  };

  timer = null;

  componentDidMount() {
    // const {
    //   user: {
    //     currentUser: { unitType },
    //   },
    // } = this.props;
    // this.handleResetForm();
    // if (+unitType === 4) this.fetchPasswordRules();
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
    } = this.props;
    validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'account/updatePwdNewForForget',
          payload: {
            phone: values.phone,
            password: aesEncrypt(values.newPassword),
            code: values.code,
          },
          callback: response => {
            if (response.code && response.code === 200) {
              this.handleResetForm();
              message.success('密码修改成功！');
              this.handleBack();
            } else {
              message.error(response.msg || '密码修改失败!');
            }
          },
        });
      }
    });
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
    if (value) {
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
      form: { getFieldValue },
    } = this.props;
    const phone = getFieldValue('phone');
    dispatch({
      type: 'account/sendVerifyCode',
      payload: { phone },
      success: ({ passwordRule }) => {
        message.success('验证码发送成功');
        passwordRule && this.setState({ passwordRule: +passwordRule });

        this.setState({ codeTime: CodeTime }, () => {
          this.timer = setInterval(() => {
            const { codeTime } = this.state;
            if (codeTime === 0) clearInterval(this.timer);
            else this.setState({ codeTime: codeTime - 1 });
          }, 1000);
        });
      },
      error: msg => {
        message.error(msg);
      },
    });
  };

  handleBack = () => {
    router.go(-1);
  };

  render() {
    const {
      loading,
      form: { getFieldDecorator, getFieldError, getFieldValue },
    } = this.props;
    const { codeTime } = this.state;
    const isSendingCode = codeTime !== 0;
    const phoneErr = getFieldError('phone');

    return (
      <div className={styles.container}>
        <div className={styles.head}>找回密码</div>
        <Form>
          <Row>
            <Col
              lg={{ span: 7, offset: 7 }}
              md={{ span: 13, offset: 3 }}
              sm={{ span: 24 }}
              xs={{ span: 24 }}
            >
              <FormItem>
                <InputGroup>
                  {getFieldDecorator('phone', {
                    rules: [
                      {
                        required: true,
                        message: '请输入手机号',
                      },
                      {
                        pattern: /^1\d{10}$/,
                        message: '手机号格式错误',
                      },
                    ],
                  })(<Input size="large" placeholder="手机号码" />)}
                </InputGroup>
              </FormItem>
            </Col>
            <Col
              lg={{ span: 3, offset: 0 }}
              md={{ span: 5, offset: 0 }}
              sm={{ span: 24, offset: 0 }}
              xs={{ span: 24, offset: 0 }}
            >
              <Button
                style={{ width: '100%', top: 1 }}
                size="large"
                disabled={isSendingCode || !!phoneErr || !getFieldValue('phone')}
                className={styles.getCaptcha}
                onClick={this.handleClickCode}
              >
                {isSendingCode ? `重新获取(${codeTime})` : '获取验证码'}
              </Button>
            </Col>
          </Row>
          <Row>
            <Col
              lg={{ span: 10, offset: 7 }}
              md={{ span: 18, offset: 3 }}
              sm={{ span: 24 }}
              xs={{ span: 24 }}
            >
              <FormItem>
                {getFieldDecorator('code', {
                  rules: [
                    {
                      required: true,
                      message: '请输入短信验证码',
                    },
                  ],
                })(<Input size="large" maxLength={6} placeholder="请输入短信验证码" />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col
              lg={{ span: 10, offset: 7 }}
              md={{ span: 18, offset: 3 }}
              sm={{ span: 24 }}
              xs={{ span: 24 }}
            >
              <FormItem>
                {getFieldDecorator('newPassword', {
                  rules: [
                    { required: true, message: '请输入新密码', whitespace: true },
                    {
                      validator: this.validatorPassword,
                    },
                  ],
                })(<Input.Password size="large" type="password" placeholder="请输入新密码" />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col
              lg={{ span: 10, offset: 7 }}
              md={{ span: 18, offset: 3 }}
              sm={{ span: 24 }}
              xs={{ span: 24 }}
            >
              <FormItem>
                {getFieldDecorator('reNewPassword', {
                  rules: [
                    { required: true, message: '请确认新密码', whitespace: true },
                    { validator: this.validateConfirm },
                  ],
                })(<Input.Password type="password" size="large" placeholder="请确认新密码" />)}
              </FormItem>
            </Col>
          </Row>

          <Row gutter={8}>
            <Col
              lg={{ span: 3, offset: 7 }}
              md={{ span: 6, offset: 3 }}
              sm={{ span: 10, offset: 0 }}
              xs={{ span: 10, offset: 0 }}
            >
              <Button className={styles.nextButton} size="large" onClick={this.handleBack}>
                返回
              </Button>
              {/* <Button className={styles.nextButton} size="large" onClick={this.handleResetForm}>
                重置
              </Button> */}
            </Col>
            <Col
              lg={{ span: 3, offset: 4 }}
              md={{ span: 6, offset: 6 }}
              sm={{ span: 10, offset: 4 }}
              xs={{ span: 10, offset: 4 }}
            >
              <Button
                className={styles.nextButton}
                loading={loading}
                htmlType="submit"
                type="primary"
                size="large"
                onClick={this.handleSubmit}
              >
                提交
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
    );
  }
}
