import React, { PureComponent } from 'react';
import router from 'umi/router';
import { Button, Col, Form, Input, Row, Upload } from 'antd';

import { getFieldDecConfig, UploadButton } from './utils';

const { Item: FormItem } = Form;

@Form.create()
export default class PointEdit extends PureComponent {
  render() {
    const { form: { getFieldDecorator } } = this.props;

    return (
      <Form layout="vertical">
        <Row gutter={{ lg: 48, md: 24 }}>
          <Col lg={8} md={12} sm={24}>
            <FormItem label="卡口名称">
              {getFieldDecorator('name', getFieldDecConfig('请输入卡口名称'))(
                <Input placeholder="请输入卡口名称" min={1} max={20} />
              )}
            </FormItem>
          </Col>
          <Col lg={8} md={12} sm={24}>
            <FormItem label="卡口位置">
              {getFieldDecorator('location', getFieldDecConfig('请输入卡口位置'))(
                <Input placeholder="请输入卡口位置" min={1} max={20} />
              )}
            </FormItem>
          </Col>
          <Col lg={8} md={12} sm={24}>
            <FormItem label="卡口方向">
              {getFieldDecorator('direction', getFieldDecConfig('请输入卡口方向'))(
                <Input placeholder="请输入卡口名称" min={1} max={20} />
              )}
            </FormItem>
          </Col>
          <Col lg={8} md={12} sm={24}>
            <FormItem label="关联设备">
              {getFieldDecorator('equipmentList', {
                // rules: [{ required: true, whitespace: true, message: '请选择关联设备' }],
              })(
                <Input placeholder="请选择关联设备" min={1} max={20} />
              )}
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ lg: 48, md: 24 }}>
          <Col lg={8} md={12} sm={24}>
            <FormItem label="卡口照片">
              <Upload listType="picture-card">
                <UploadButton />
              </Upload>
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
