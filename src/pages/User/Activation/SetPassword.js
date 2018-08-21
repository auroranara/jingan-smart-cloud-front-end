import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Col, Row, message } from 'antd';
import router from 'umi/router';
import styles from './style.less';
import { aesEncrypt } from '../../../utils/utils';

const FormItem = Form.Item;

@connect(({ user, loading }) => ({
  user,
  submitting: loading.effects['user/updatePwd'],
}))

@Form.create()
export default class setPassword extends React.PureComponent {
  componentDidMount() {
    const { location: { pathname } } = this.props
    const pathList = pathname.split('/');
    const type = pathList[pathList.length - 2]
    this.setState({ type })
  }

  onValidateForm = () => {
    const { type } = this.state
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const arr = this.props.location.search.split('=');
        const item = { phone: arr[arr.length - 1], password: aesEncrypt(values.pass) };
        this.props.dispatch({
          type: 'user/updatePwd',
          payload: item,
          callback: res => {
            if (res && res.code === 200) {
              message.success('设置成功!');
              type === 'activation' ? router.push('/user/activation/result') : router.push('/user/forget-password/result')
            } else {
              message.error('设置失败!');
            }
          },
        });
      }
    });
  };

  checkPass2 = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('pass')) {
      callback('两次输入密码不一致！');
    } else {
      callback();
    }
  }

  render() {
    const { getFieldDecorator, submitting } = this.props.form;

    const handleBack = () => {
      router.push('/user/activation/verification')
    };
    return (
      <Fragment>
        <div className={styles.main}>
          <Form layout="horizontal" className={styles.setPassForm} hideRequiredMark>
            <Row>
              <Col
                lg={{ span: 10, offset: 7 }}
                md={{ span: 18, offset: 3 }}
                sm={{ span: 24 }}
                xs={{ span: 24 }}
              >
                <FormItem
                  hasFeedback
                >
                  {getFieldDecorator('pass', {
                    validateTrigger: 'onBlur',
                    rules: [
                      { required: true, whitespace: true, message: '请输入新密码' },
                      { pattern: '^[A-Za-z0-9]{6,25}$', message: '请输入6-25位由英文和数字组成的密码' },
                    ],
                  })(<Input
                    size="large"
                    type="password"
                    autoComplete="off"
                    placeholder="请输入新密码"
                    id="pass"
                  />)}
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
                <FormItem
                  hasFeedback
                >
                  {getFieldDecorator('rePass', {
                    rules: [{
                      required: true,
                      whitespace: true,
                      message: '请确认新密码',
                    }, {
                      validator: this.checkPass2,
                    }],
                  })(<Input
                    type="password"
                    size="large"
                    autoComplete="off"
                    placeholder="请确认新密码"
                    id="rePass"
                  />)}
                </FormItem>
              </Col>
            </Row>


            <Form.Item>
              <Row gutter={8}>
                <Col
                  lg={{ span: 3, offset: 7 }}
                  md={{ span: 6, offset: 3 }}
                  sm={{ span: 10, offset: 0 }}
                  xs={{ span: 10, offset: 0 }}
                >
                  <Button className={styles.nextButton} type="primary" size="large" onClick={handleBack}>
                    上一步
                  </Button>
                </Col>
                <Col
                  lg={{ span: 3, offset: 4 }}
                  md={{ span: 6, offset: 6 }}
                  sm={{ span: 10, offset: 4 }}
                  xs={{ span: 10, offset: 4 }}
                >
                  <Button className={styles.nextButton} loading={submitting} htmlType="submit" type="primary" size="large" onClick={this.onValidateForm}>
                    提交
                  </Button>
                </Col>
              </Row>
            </Form.Item>
          </Form>
        </div>
      </Fragment>
    );
  }
}
