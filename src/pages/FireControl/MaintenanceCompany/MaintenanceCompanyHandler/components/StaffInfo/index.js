import React, { PureComponent } from 'react';
import { Card, Form, Row, Col, Input } from 'antd';
import { phoneReg, emailReg } from '@/utils/validate';

/**
 * 人员信息
 */
export default class App extends PureComponent {
  /**
   * 去除数据左右空格
   */
  handleTrim = e => e.target.value.trim()

  render() {
    const {
      model: {
        detail: {
          companyBasicInfo: {
            legalName,
            legalPhone,
            legalEmail,
            principalName,
            principalPhone,
            principalEmail,
            safetyName,
            safetyPhone,
            safetyEmail,
          } = {},
        },
      },
      form: {
        getFieldDecorator,
      },
      styles,
      fieldLabels,
    } = this.props;

    return (
      <Card bordered={false}>
        <Form layout="vertical">
          <h3 className={styles.subTitle}>法定代表人</h3>
          <Row gutter={{ lg: 48, md: 24 }} className={styles.subBody}>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.principalName}>
                {getFieldDecorator('legalName', {
                  initialValue: legalName,
                  getValueFromEvent: this.handleTrim,
                  rules: [{ required: true, message: '请输入法定代表人姓名' }],
                })(<Input placeholder="请输入姓名" />)}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.principalPhone}>
                {getFieldDecorator('legalPhone', {
                  initialValue: legalPhone,
                  getValueFromEvent: this.handleTrim,
                  rules: [
                    { required: true, message: '请输入法定代表人联系方式' },
                    { pattern: phoneReg, message: '法定代表人联系方式格式不正确' },
                  ],
                })(<Input placeholder="请输入联系方式" />)}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.principalEmail}>
                {getFieldDecorator('legalEmail', {
                  initialValue: legalEmail,
                  getValueFromEvent: this.handleTrim,
                  rules: [{ pattern: emailReg, message: '法定代表人邮箱格式不正确' }],
                })(<Input placeholder="请输入邮箱" />)}
              </Form.Item>
            </Col>
          </Row>
          <h3 className={styles.subTitle}>主要负责人</h3>
          <Row gutter={{ lg: 48, md: 24 }} className={styles.subBody}>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.principalName}>
                {getFieldDecorator('safetyName', {
                  initialValue: safetyName,
                  getValueFromEvent: this.handleTrim,
                  rules: [{ required: true, message: '请输入主要负责人姓名' }],
                })(<Input placeholder="请输入姓名" />)}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.principalPhone}>
                {getFieldDecorator('safetyPhone', {
                  initialValue: safetyPhone,
                  getValueFromEvent: this.handleTrim,
                  rules: [
                    { required: true, message: '请输入主要负责人联系方式' },
                    { pattern: phoneReg, message: '主要负责人联系方式格式不正确' },
                  ],
                })(<Input placeholder="请输入联系方式" />)}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.principalEmail}>
                {getFieldDecorator('safetyEmail', {
                  initialValue: safetyEmail,
                  getValueFromEvent: this.handleTrim,
                  rules: [{ pattern: emailReg, message: '主要负责人邮箱格式不正确' }],
                })(<Input placeholder="请输入邮箱" />)}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    );
  }
}
