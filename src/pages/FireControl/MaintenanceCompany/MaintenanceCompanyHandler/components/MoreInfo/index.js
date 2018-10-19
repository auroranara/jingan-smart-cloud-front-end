import React, { PureComponent } from 'react';
import { Card, Form, Row, Col, Input, Cascader, Select, DatePicker } from 'antd';
import moment from 'moment';

const { TextArea } = Input;
const { Option } = Select;

/* 获取root下的div元素 */
const getRootChild = () => document.querySelector('#root>div');

/**
 * 更多信息
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
            economicType,
            scale,
            licenseType,
            createTime,
            businessScope,
            companyType,
            companyStatus,
            industryCategory,
          }={},
        },
        // 经济类型列表
        economicTypeList,
        // 规模情况列表
        scaleList,
        // 营业执照类别列表
        licenseTypeList,
        // 单位类型列表
        companyTypeList,
        // 单位状态列表
        companyStatusList,
        // 行业类别列表
        industryCategoryList,
      },
      form: {
        getFieldDecorator,
      },
      styles,
      fieldLabels,
      defaultCompanyType,
    } = this.props;

    return (
      <Card className={styles.card} bordered={false}>
        <Form layout="vertical">
          <Row gutter={{ lg: 48, md: 24 }}>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.economicType}>
                {getFieldDecorator('economicType', {
                  initialValue: economicType,
                  rules: [{ required: true, message: '请选择经济类型' }],
                })(
                  <Select placeholder="请选择经济类型" getPopupContainer={getRootChild}>
                    {economicTypeList.map(item => (
                      <Option value={item.key} key={item.key}>
                        {item.value}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.companyStatus}>
                {getFieldDecorator('companyStatus', {
                  initialValue: companyStatus,
                  rules: [{ required: true, message: '请选择单位状态' }],
                })(
                  <Select placeholder="请选择单位状态" getPopupContainer={getRootChild}>
                    {companyStatusList.map(item => (
                      <Option value={item.key} key={item.key}>
                        {item.value}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.companyType}>
                {getFieldDecorator('companyType', {
                  initialValue: companyType !== undefined ? companyType+'' : (companyTypeList.length > 0
                    ? companyTypeList.filter(item => item.label === defaultCompanyType)[0].id+''
                    : undefined),
                  rules: [{ required: true, message: '请选择单位类型' }],
                })(
                  <Select allowClear placeholder="请选择单位类型" getPopupContainer={getRootChild}>
                    {companyTypeList.map(item => (
                      <Option key={item.id+''}>
                        {item.label}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.scale}>
                {getFieldDecorator('scale', {
                  initialValue: scale || undefined,
                })(
                  <Select allowClear placeholder="请选择规模情况" getPopupContainer={getRootChild}>
                    {scaleList.map(item => (
                      <Option value={item.key} key={item.key}>
                        {item.value}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.licenseType}>
                {getFieldDecorator('licenseType', {
                  initialValue: licenseType,
                  rules: [{ required: true, message: '请选择营业执照类别' }],
                })(
                  <Select placeholder="请选择营业执照类别" getPopupContainer={getRootChild}>
                    {licenseTypeList.map(item => (
                      <Option value={item.key} key={item.key}>
                        {item.value}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.createTime}>
                {getFieldDecorator('createTime', {
                  initialValue: createTime ? moment(+createTime) : undefined,
                })(
                  <DatePicker
                    placeholder="请选择成立时间"
                    style={{ width: '100%' }}
                    getCalendarContainer={getRootChild}
                  />
                )}
              </Form.Item>
            </Col>
            <Col lg={8} md={12} sm={24}>
              <Form.Item label={fieldLabels.industryCategory}>
                {getFieldDecorator('industryCategory', {
                  initialValue: industryCategory ? industryCategory.split(',') : [],
                })(
                  <Cascader
                    options={industryCategoryList}
                    fieldNames={{
                      value: 'type_id',
                      label: 'gs_type_name',
                      children: 'children',
                    }}
                    allowClear
                    changeOnSelect
                    notFoundContent
                    placeholder="请选择行业类别"
                    getPopupContainer={getRootChild}
                  />
                )}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={{ lg: 48, md: 24 }}>
            <Col lg={16} md={24} sm={24}>
              <Form.Item label={fieldLabels.businessScope}>
                {getFieldDecorator('businessScope', {
                  initialValue: businessScope,
                })(<TextArea rows={4} placeholder="请输入经营范围" maxLength="500" />)}
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    );
  }
}
