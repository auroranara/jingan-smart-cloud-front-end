import React, { PureComponent } from 'react';
import router from 'umi/router';
import { Button, Col, Form, Input, Row, Select, Switch } from 'antd';

import { getFieldDecConfig, CARDS } from './utils';

const { Item: FormItem } = Form;
const { Option } = Select;

@Form.create()
export default class ScreenEdit extends PureComponent {
  render() {
    const { form: { getFieldDecorator } } = this.props;

    return (
      <Form layout="vertical">
        <Row gutter={{ lg: 48, md: 24 }}>
          <Col lg={8} md={12} sm={24}>
            <FormItem label="显示屏名称">
              {getFieldDecorator('name', getFieldDecConfig('请输入显示屏名称'))(
                <Input placeholder="请输入显示屏名称" min={1} max={20} />
              )}
            </FormItem>
          </Col>
          <Col lg={8} md={12} sm={24}>
            <FormItem label="卡口点位">
              {getFieldDecorator('pointId', {
                rules: [{ required: true, message: '请选择卡口点位' }],
              })(
                <Select placeholder="请选择卡口点位" />
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
            <FormItem label="IP地址">
              {getFieldDecorator('ipAddress', getFieldDecConfig('请输入IP地址'))(
                <Input placeholder="请输入IP地址" min={1} max={20} />
              )}
            </FormItem>
          </Col>
          <Col lg={8} md={12} sm={24}>
            <FormItem label="端口号">
              {getFieldDecorator('portNumber', getFieldDecConfig('请输入端口号'))(
                <Input placeholder="请输入端口号" min={1} max={20} />
              )}
            </FormItem>
          </Col>
          <Col lg={8} md={12} sm={24}>
            <FormItem label="控制卡型号">
              {getFieldDecorator('controllerCardType', {
                rules: [{ required: true, message: '请选择控制卡型号' }],
              })(
                <Select placeholder="控制卡型号">
                  {CARDS.map((label, index) => <Option key={index}>{label}</Option>)}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col lg={8} md={12} sm={24}>
            <FormItem label="模组类型">
              {getFieldDecorator('modelType', getFieldDecConfig('请输入模组类型'))(
                <Input placeholder="请输入模组类型" min={1} max={20} />
              )}
            </FormItem>
          </Col>
          <Col lg={8} md={12} sm={24}>
            <FormItem label="模组数">
              {getFieldDecorator('modelNumber', getFieldDecConfig('请输入模组数'))(
                <Input placeholder="请输入模组数" min={1} max={20} />
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
        <Form.Item wrapperCol={{ span: 24, offset: 11 }}>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
        </Form.Item>
      </Form>
    )
  }
}
