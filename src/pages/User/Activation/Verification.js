import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Col, Row, message } from 'antd';
import { routerRedux } from 'dva/router';
import router from 'umi/router'
import styles from './style.less';

const InputGroup = Input.Group;
const FormItem = Form.Item;

@connect(({ user, loading }) => ({
  user,
  submitting: loading.effects['user/verifyCode'],
}))

@Form.create()
export default class Verification extends React.PureComponent {
  state = {
    count: 0,
    type: 'activation',
  };
  componentDidMount() {
    const { location: { pathname } } = this.props
    const pathList = pathname.split('/');
    const type = pathList[pathList.length - 2]
    this.setState({ type })
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }

  // 获取验证码
  getVerification = () => {
    const { type } = this.state
    this.props.form.validateFields(['phone'], (err, value) => {
      if (!err) {
        // 倒计时
        let count = 59;
        this.setState({ count });
        this.interval = setInterval(() => {
          count -= 1;
          this.setState({ count });
          if (count === 0) {
            clearInterval(this.interval);
          }
        }, 1000);
        const callback = (res) => {
          if (res && res.code === 200) {
            message.success('验证码发送成功!');
          } else {
            message.error(res.msg);
            this.setState({ count: 0 });
            clearInterval(this.interval);
          }
        }
        if (type === 'activation') {
          this.props.dispatch({
            type: 'user/activationSendCode',
            payload: value,
            callback: callback,
          });
        } else {
          this.props.dispatch({
            type: 'user/forgetSendCode',
            payload: value,
            callback: callback,
          });
        }
      }
    });
  }

  // 点击下一步
  handleNext = () => {
    const { type } = this.state
    this.props.form.validateFields((err, values) => {
      const callback = (res) => {
        if (res && res.code === 200) {
          message.success('验证成功!');
          type === 'activation' ? router.push(`/user/activation/set-password?phone=${values.phone}`) :
            router.push(`/user/forget-password/set-password?phone=${values.phone}`)
        } else {
          message.error('验证失败!');
        }
      }
      if (!err) {
        this.props.dispatch({
          type: 'user/verifyCode',
          payload: values,
          callback: callback,
        });
      }
    });
  }

  // 返回登录页
  handleBack = () => {
    router.push('/user/login');
  };

  render() {
    const { submitting } = this.props;
    const { form: { getFieldDecorator } } = this.props;
    const { count } = this.state;

    return (
      <Fragment>
        <div className={styles.main}>
          <Form layout="horizontal" className={styles.stepForm} hideRequiredMark>
            <Row>
              <Col
                lg={{ span: 10, offset: 7 }}
                md={{ span: 18, offset: 3 }}
                sm={{ span: 24 }}
                xs={{ span: 24 }}
              >
                <FormItem>
                  {getFieldDecorator('phone', {
                    validateTrigger: 'onBlur',
                    rules: [
                      {
                        required: true,
                        message: '请输入手机号！',
                      },
                      {
                        pattern: /^1\d{10}$/,
                        message: '手机号格式错误！',
                      },
                    ],
                  })(<Input
                    id="phone"
                    size="large"
                    placeholder="11位手机号"
                  />)}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col
                lg={{ span: 7, offset: 7 }}
                md={{ span: 13, offset: 3 }}
                sm={{ span: 24 }}
                xs={{ span: 24 }}
              >
                <FormItem>
                  <InputGroup >
                    {getFieldDecorator('code', {
                      validateTrigger: 'onBlur',
                      rules: [
                        {
                          required: true,
                          message: '请输入验证码！',
                        },
                      ],
                    })(<Input id="code" size="large" placeholder="验证码" />)}
                  </InputGroup >
                </FormItem>
              </Col>
              <Col
                lg={{ span: 3, offset: 0 }}
                md={{ span: 5, offset: 0 }}
                sm={{ span: 24, offset: 0 }}
                xs={{ span: 24, offset: 0 }}
              >
                <Button
                  style={{ width: '100%' }}
                  size="large"
                  disabled={count}
                  className={styles.getCaptcha}
                  onClick={this.getVerification}
                >
                  {count ? `${count} s` : '获取验证码'}
                </Button>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col
                lg={{ span: 3, offset: 7 }}
                md={{ span: 6, offset: 3 }}
                sm={{ span: 10, offset: 0 }}
                xs={{ span: 10, offset: 0 }}
              >
                <Button className={styles.nextButton} type="primary" size="large" onClick={this.handleBack}>
                  上一步
                </Button>
              </Col>
              <Col
                lg={{ span: 3, offset: 4 }}
                md={{ span: 6, offset: 6 }}
                sm={{ span: 10, offset: 4 }}
                xs={{ span: 10, offset: 4 }}
              >
                <Button className={styles.nextButton} loading={submitting} htmlType="submit" type="primary" size="large" onClick={this.handleNext}>
                  下一步
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
      </Fragment>
    );
  }
}
