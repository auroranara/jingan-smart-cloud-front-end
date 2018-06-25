import React, { PureComponent } from 'react';
import { Form, Input, Card } from 'antd';
import PageHeaderLayout from '../../../layouts/PageHeaderLayout';

const FormItem = Form.Item;

@Form.create()
export default class BasicForms extends PureComponent {
  render() {
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

    return (
      <PageHeaderLayout title="维保公司详情">
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <FormItem {...formItemLayout} label="企业名称">
              {getFieldDecorator('name')(<Input style={{ border: 0 }} />)}
            </FormItem>

            <FormItem {...formItemLayout} label="地址">
              {getFieldDecorator('address')(<Input style={{ border: 0 }} />)}
            </FormItem>

            <FormItem {...formItemLayout} label="下属公司数">
              {getFieldDecorator('subcompanynum')(<Input style={{ border: 0 }} />)}
            </FormItem>

            <FormItem {...formItemLayout} label="启用状态">
              {getFieldDecorator('status')(<Input style={{ border: 0 }} />)}
            </FormItem>

            <FormItem {...formItemLayout} label="服务单位数">
              {getFieldDecorator('servicenum')(<Input style={{ border: 0 }} />)}
            </FormItem>
          </Form>
        </Card>
      </PageHeaderLayout>
    );
  }
}
