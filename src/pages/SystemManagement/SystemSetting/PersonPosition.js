import React, { PureComponent } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Button, Card, Input, message } from 'antd';
import router from 'umi/router';

const { Item: FormItem } = Form;

const formItemLayout = {
  labelCol: { xs: { span: 24 }, sm: { span: 4 } },
  wrapperCol: { xs: { span: 24 }, sm: { span: 16 } },
};

@Form.create()
export default class PersonPosition extends PureComponent {
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
          buildingId,
          url,
          userName,
          secret,
        } = detail;
        setFieldsValue({
          buildingId,
          url,
          userName,
          secret,
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
    // const { listPath } = this.props;
    // router.push(listPath);
    window.close();
  }

  render () {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Card>
        <Form>
          <FormItem label="buildingId" {...formItemLayout}>
            {getFieldDecorator('buildingId', {
              getValueFromEvent: e => e.target.value.trim(),
              rules: [
                { max: 50, message: '请输入不超过50个字符' },
                { pattern: /^[A-Za-z0-9]*$/, message: '请输入数字或字母' },
              ],
            })(
              <Input placeholder="请输入" />
            )}
          </FormItem>
          <FormItem label="url" {...formItemLayout}>
            {getFieldDecorator('url', {
              getValueFromEvent: e => e.target.value.trim(),
              rules: [{ max: 50, message: '请输入不超过50个字符' }],
            })(
              <Input placeholder="请输入" />
            )}
          </FormItem>
          <FormItem label="userName" {...formItemLayout}>
            {getFieldDecorator('userName', {
              getValueFromEvent: e => e.target.value.trim(),
              rules: [
                { max: 50, message: '请输入不超过50个字符' },
                { pattern: /^[A-Za-z0-9]*$/, message: '请输入数字或字母' },
              ],
            })(
              <Input placeholder="请输入" />
            )}
          </FormItem>
          <FormItem label="secret" {...formItemLayout}>
            {getFieldDecorator('secret', {
              getValueFromEvent: e => e.target.value.trim(),
              rules: [
                { max: 50, message: '请输入不超过50个字符' },
                { pattern: /^[A-Za-z0-9]*$/, message: '请输入数字或字母' },
              ],
            })(
              <Input placeholder="请输入" />
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
