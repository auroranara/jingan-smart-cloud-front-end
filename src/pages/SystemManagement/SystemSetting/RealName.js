import React, { PureComponent } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Card, Input, message, Switch } from 'antd';
import router from 'umi/router';

const { Item: FormItem } = Form;
const { TextArea } = Input;

const formItemLayout = {
  labelCol: { xs: { span: 24 }, sm: { span: 4 } },
  wrapperCol: { xs: { span: 24 }, sm: { span: 16 } },
};

@Form.create()
export default class RealName extends PureComponent {

  componentDidMount () {
    const {
      dispatch,
      match: { params: { id } },
      form: { setFieldsValue },
    } = this.props;
    if (!id) return;
    dispatch({
      type: 'systemManagement/fetchSettingDetail',
      payload: { id },
      callback: (detail) => {
        const {
          appName,
          appId,
          appKey,
          appSecret,
          remark,
          onLine,
        } = detail;
        setFieldsValue({
          appName,
          appId,
          appKey,
          appSecret,
          remark,
          onLine: +onLine === 1,
        })
      },
    });
  }

  handleSubmit = () => {
    const {
      dispatch,
      form: { validateFields },
      match: { params: { id } },
      listPath,
    } = this.props;
    validateFields((err, values) => {
      if (err) return;
      const { onLine, ...resValues } = values;
      dispatch({
        type: 'systemManagement/updateSystemSetting',
        payload: { ...resValues, id, onLine: onLine ? '1' : '0' },
        callback: (success, msg) => {
          if (success) {
            message.success('操作成功');
            // router.push(listPath);
            setTimeout(this.handleBack, 1000);
          } else { message.error(msg || '操作失败') }
        },
      })
    })
  }

  handleBack = () => {
    // router.push(this.props.listPath);
    window.close();
  }

  render () {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Card>
        <Form>
          <FormItem label="应用名称" {...formItemLayout}>
            {getFieldDecorator('appName', {
              getValueFromEvent: e => e.target.value.trim(),
              rules: [
                { required: true, message: '请输入应用名称' },
                { max: 50, message: '请输入不超过50个字符' },
              ],
            })(
              <Input placeholder="请输入" />
            )}
          </FormItem>
          <FormItem label="应用ID" {...formItemLayout}>
            {getFieldDecorator('appId', {
              rules: [
                { required: true, message: '请输入应用ID' },
                { max: 50, message: '请输入不超过50个字符' },
                { pattern: /^[A-Za-z0-9]*$/, message: '请输入数字或字母' },
              ],
            })(
              <Input placeholder="请输入" />
            )}
          </FormItem>
          <FormItem label="AppKey" {...formItemLayout}>
            {getFieldDecorator('appKey', {
              rules: [
                { required: true, message: '请输入AppKey' },
                { max: 50, message: '请输入不超过50个字符' },
                { pattern: /^[A-Za-z0-9]*$/, message: '请输入数字或字母' },
              ],
            })(
              <Input placeholder="请输入" />
            )}
          </FormItem>
          <FormItem label="AppSecret" {...formItemLayout}>
            {getFieldDecorator('appSecret', {
              rules: [
                { required: true, message: '请输入AppSecret' },
                { max: 50, message: '请输入不超过50个字符' },
                { pattern: /^[A-Za-z0-9]*$/, message: '请输入数字或字母' },
              ],
            })(
              <Input placeholder="请输入" />
            )}
          </FormItem>
          <FormItem label="描述" {...formItemLayout}>
            {getFieldDecorator('remark', {
              getValueFromEvent: e => e.target.value.trim(),
              rules: [{ max: 50, message: '请输入不超过50个字符' }],
            })(
              <TextArea placeholder="请输入" rows={3} />
            )}
          </FormItem>
          <FormItem label="系统上下线" {...formItemLayout}>
            {getFieldDecorator('onLine', {
              valuePropName: 'checked',
            })(
              <Switch checkedChildren="上线" unCheckedChildren="下线" />
            )}
          </FormItem>
        </Form>
        <div style={{ textAlign: 'center' }}>
          <Button type="primary" onClick={this.handleSubmit}>提交</Button>
          <Button style={{ marginLeft: 20 }} onClick={this.handleBack}>返回</Button>
        </div>
      </Card>
    )
  }
}
