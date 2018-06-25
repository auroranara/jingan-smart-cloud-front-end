import React, { PureComponent } from 'react';
import { Form, Input } from 'antd';
import { connect } from 'dva';

const FormItem = Form.Item;

@connect(({ transmission, loading }) => ({
  transmission,
  loading: loading.models.transmission,
}))
@Form.create()
export default class ImportPointPosition extends PureComponent {
  render() {
    const {
      form,
      match: {
        params: { hostId },
      },
    } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Form>
        <FormItem label="主机编号" labelCol={{ span: 5 }} wrapperCol={{ span: 15 }}>
          {getFieldDecorator('hostId', { initialValue: hostId })(<Input disabled />)}
        </FormItem>
      </Form>
    );
  }
}
