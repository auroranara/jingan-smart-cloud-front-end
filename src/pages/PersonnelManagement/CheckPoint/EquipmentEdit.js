import React, { PureComponent } from 'react';
import router from 'umi/router';
import { Button, Col, Form, Input, Row, Switch } from 'antd';

import { getFieldDecConfig } from './utils';

const { Item: FormItem } = Form;

@Form.create()
export default class EquipmentEdit extends PureComponent {
  render() {
    const { form: { getFieldDecorator } } = this.props;

    return (
      <Form layout="vertical">
        <Row gutter={{ lg: 48, md: 24 }}>
          <Col lg={8} md={12} sm={24}>
            <FormItem label="设备名称">
              {getFieldDecorator('name', getFieldDecConfig('请输入设备名称'))(
                <Input placeholder="请输入设备名称" min={1} max={20} />
              )}
            </FormItem>
          </Col>
          <Col lg={8} md={12} sm={24}>
            <FormItem label="设备编号">
              {getFieldDecorator('code', getFieldDecConfig('请输入设备编号'))(
                <Input placeholder="请输入设备编号" min={1} max={20} />
              )}
            </FormItem>
          </Col>
          <Col lg={8} md={12} sm={24}>
            <FormItem label="设备ID">
              {getFieldDecorator('number', getFieldDecConfig('请输入设备ID'))(
                <Input placeholder="请输入设备ID" min={1} max={20} />
              )}
            </FormItem>
          </Col>
          <Col lg={8} md={12} sm={24}>
            <FormItem label="所在区域">
              {getFieldDecorator('area', getFieldDecConfig('请输入所在区域'))(
                <Input placeholder="请输入所在区域" min={1} max={20} />
              )}
            </FormItem>
          </Col>
          <Col lg={8} md={12} sm={24}>
            <FormItem label="所在位置">
              {getFieldDecorator('location', getFieldDecConfig('请输入所在位置'))(
                <Input placeholder="请输入所在位置" min={1} max={20} />
              )}
            </FormItem>
          </Col>
          <Col lg={8} md={12} sm={24}>
            <FormItem label="设备状态">
              {getFieldDecorator('status', {
                rules: [{ required: true, message: '请选择设备状态' }],
              })(
                <Switch
                  checkedChildren="启用"
                  unCheckedChildren="禁用"
                />
              )}
            </FormItem>
          </Col>
        </Row>
        <Form.Item wrapperCol={{ span: 12, offset: 5 }}>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
        </Form.Item>
      </Form>
    )
  }
}
