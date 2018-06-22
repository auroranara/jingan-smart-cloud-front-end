import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Card, Switch } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';
// import styles from './MaintenanceCompanyAdd.less';

const FormItem = Form.Item;

@connect(({ loading }) => ({
  submitting: loading.effects['form/submitRegularForm'],
}))
@Form.create()
export default class BasicForms extends PureComponent {
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'form/submitRegularForm',
          payload: values,
        });
      }
    });
  };
  render() {
    const { submitting } = this.props;
    //
    const {
      getFieldDecorator,
      // getFieldValue
    } = this.props.form;

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

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };

    return (
      <PageHeaderLayout title="新增维保单位">
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="企业名称">
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '请选择企业',
                  },
                ],
              })(<Input placeholder="请选择企业" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="是否启用">
              {getFieldDecorator('goal')(<Switch defaultChecked />)}
            </FormItem>
            <FormItem {...formItemLayout} label="是否为分公司">
              {getFieldDecorator('standard')(<Switch defaultChecked />)}
            </FormItem>
            <FormItem {...formItemLayout} label="总公司名称">
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '请选择企业',
                  },
                ],
              })(<Input placeholder="请选择总公司" />)}
            </FormItem>

            <FormItem {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                提交
              </Button>
              <Button style={{ marginLeft: 8 }}>保存</Button>
            </FormItem>
          </Form>
        </Card>
      </PageHeaderLayout>
    );
  }
}
