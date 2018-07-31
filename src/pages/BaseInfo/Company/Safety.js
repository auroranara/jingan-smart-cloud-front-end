import React, { PureComponent } from 'react';
import { Button, Card, Col, DatePicker, Form, Icon, Upload, Select } from 'antd';
import { connect } from 'dva';

const { RangePicker } = DatePicker;
const { Item: FormItem } = Form;
const { Option } = Select;

const UploadIcon = <Icon type="upload" />;

const itemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
  },
};

const itemLayout1 = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
};

// @connect(({ safety, loading }) => ({ safety, loading: loading.models.safety }))
@Form.create()
export default class Safty extends PureComponent {
  renderFormItems(items) {
    const { getFieldDecorator } = this.props.form;
    return items.map(({ name, cName, span=12, formItemLayout=itemLayout, component }) => (
      <Col span={span} key={name}>
        <FormItem label={cName} {...formItemLayout}>
          {getFieldDecorator(name, { rules: [{ required: true }] })(component)}
        </FormItem>
      </Col>
    ));
  }

  formItems = [
    { name: 'grid', cName: '所属网格', component: <Select /> },
    { name: 'category', cName: '监管分类', component: <Select /> },
    { name: 'safetyLevel', cName: '安全监管等级', component: <Select /> },
    { name: 'standardLevel', cName: '标准化达标等级', component: <Select /> },
    { name: 'relationship', cName: '企业行政隶属关系', component: <Select /> },
    { name: 'status', cName: '企业状态', component: <Select /> },
    { name: 'organization', cName: '属地安监机构', component: <Select /> },
    { name: 'validity', cName: '服务有效期', span: 24, formItemLayout: itemLayout1, component: <RangePicker /> },
    { name: 'appendix', cName: '标准化达标等级附件', span: 24, formItemLayout: itemLayout1, component: <Upload><Button type="primary">{UploadIcon}上传附件</Button></Upload> },
    { name: 'fourColorImage', cName: '安全四色图', span: 24, formItemLayout: itemLayout1, component: <Upload><Button type="primary">{UploadIcon}上传图片</Button></Upload> },
    { name: 'logo', cName: '单位LOGO', span: 24, formItemLayout: itemLayout1, component: <Upload><Button type="primary">{UploadIcon}上传图片</Button></Upload> },
  ];

  render() {
    return <Card><Form>{this.renderFormItems(this.formItems)}</Form></Card>;
  }
}
