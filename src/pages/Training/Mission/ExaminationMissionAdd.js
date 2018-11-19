import React, { PureComponent } from 'react';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { Card, Form, Button, Row, Col, Input } from 'antd';

const breadcrumbList = [
  { title: '首页', name: '首页', href: '/' },
  { title: '培训', name: '培训' },
  { title: '考试任务', name: '考试任务', href: "/training/mission/list" },
  { title: '新增考试任务', name: '新增考试任务' },
]

const formItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 16 },
};

@Form.create()
export default class ExaminationMissionAdd extends PureComponent {

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props
    return (
      <PageHeaderLayout
        title="新增考试任务"
        breadcrumbList={breadcrumbList}
      >
        <Card>
          <Form>
            <Row>
              <Col>
                <Form.Item label="考试名称" {...formItemLayout}>
                  {getFieldDecorator('name', {
                    rules: [
                      { required: true, message: '请输入考试名称，不少于6个字符', min: 6 },
                    ],
                  })(
                    <Input placeholder="请输入考试名称" />
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      </PageHeaderLayout>
    )
  }
}
