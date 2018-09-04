import React, { PureComponent } from 'react';
import { Button, Form, Card, Input, message } from 'antd';
import PageHeaderLayout from '../layouts/PageHeaderLayout';
import { connect } from 'dva';
import { aesEncrypt } from '../../utils/utils'

const FormItem = Form.Item;

const title = "修改密码"
const breadcrumbList = [
  { title: '首页', name: '首页', href: '/' },
  { title: '修改密码', name: '修改密码' },
]


@connect(({ account, user, loading }) => ({
  user,
  account,
  loading: loading.effects['account/changePass'],
}))


@Form.create()
export default class ChangePassword extends PureComponent {
  state = {
    checkPassStatus: '',
  }

  componentDidMount() {
    this.handleResetForm()
  }

  // 提交表单
  handleSubmit = () => {
    const { dispatch, form: { validateFields }, user: { currentUser: { id } } } = this.props
    validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: 'account/changePass',
          payload: { id, newPassword: aesEncrypt(values.newPassword), oldPassword: aesEncrypt(values.oldPassword) },
          callback: response => {
            if (response.code && response.code === 200) {
              this.handleResetForm()
              message.success('密码修改成功！')
            } else {
              message.error(response.msg || '密码修改失败!')
            }
          },
        });
      }
    });

  }

  // 验证旧密码
  validatePass = (rule, value, callback) => {
    const { dispatch, user: { currentUser: { id } } } = this.props
    if (value) {
      this.setState({ checkPassStatus: 'validating' })
      dispatch({
        type: 'account/checkOldPass',
        payload: { oldPassword: aesEncrypt(value), id },
        callback: code => {
          this.setState({ checkPassStatus: code === 200 ? 'success' : 'error' })
          code === 200 ? callback() : callback('旧密码不正确')
        },
      })
    } else {
      callback()
      this.setState({ checkPassStatus: 'error' })
    }
  }

  // 验证确认密码
  validateConfirm = (rule, value, callback) => {
    const { form: { getFieldValue } } = this.props;
    if (value && value !== getFieldValue('newPassword')) {
      callback('两次输入的密码不匹配!');
    } else {
      callback();
    }
  };

  // 重置表单
  handleResetForm = () => {
    const { form: { resetFields } } = this.props
    resetFields()
    this.setState({ checkPassStatus: '' })
  }

  render() {
    const { loading, form: { getFieldDecorator } } = this.props
    const { checkPassStatus } = this.state
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
    }
    return (
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList} >
        <Card>
          <Form>
            <FormItem hasFeedback={true} validateStatus={checkPassStatus} {...formItemLayout} label="旧密码">
              {getFieldDecorator('oldPassword', {
                validateTrigger: 'onBlur',
                rules: [{ required: true, message: '请输入旧密码', whitespace: true }, { validator: this.validatePass }],
              })(
                <Input type="password"></Input>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="新密码">
              {getFieldDecorator('newPassword', {
                rules: [{ required: true, message: '请输入新密码', whitespace: true }, { min: 6, max: 20, message: '密码长度请控制在5到15位' }],
              })(
                <Input type="password"></Input>
              )}
            </FormItem>
            <FormItem {...formItemLayout} label="确认新密码">
              {getFieldDecorator('reNewPassword', {
                rules: [{ required: true, message: '请确认新密码', whitespace: true }, { validator: this.validateConfirm }],
              })(
                <Input type="password"></Input>
              )}
            </FormItem>
            <FormItem wrapperCol={{
              xs: { span: 24, offset: 4 },
              sm: { span: 16, offset: 8 },
              md: { span: 13, offset: 8 },
              lg: { span: 9, offset: 9 },
            }}>
              <Button loading={loading} type="primary" onClick={this.handleSubmit}>提交</Button>
              <Button onClick={this.handleResetForm} style={{ marginLeft: 80 }}>重置</Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderLayout>
    )
  }
}
