import React from 'react';
import { Button, Row, Col, Form, Input, Card, Select } from 'antd';
// import styles from './TableList.less';
import Map from './Map';

const FormItem = Form.Item;
const { Option } = Select;

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};
const itemStyles = {
  style: {
    width: 'calc(70%)',
    marginRight: '10px',
  },
};

@Form.create()
export default class TableList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDrawing: false,
    };
  }

  componentDidMount() {}

  renderDrawButton = () => {
    const { isDrawing } = this.state;
    return (
      <Button
        onClick={() => {
          this.setState({ isDrawing: !isDrawing });
        }}
      >
        {!isDrawing ? '开始画' : '结束画'}
      </Button>
    );
  };

  render() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    const { isDrawing } = this.state;
    return (
      <div>
        <Row gutter={[8, 8]}>
          <Col span={12}>
            <Card title="地图" bordered={false}>
              {this.renderDrawButton()}
              <Map isDrawing={isDrawing} />
            </Card>
          </Col>
          <Col span={12}>
            <Card title="新增" bordered={false}>
              <FormItem label="区域编号" {...formItemLayout}>
                {getFieldDecorator('number', {
                  initialValue: '',
                  getValueFromEvent: this.handleTrim,
                  rules: [{ required: true, message: '请输入' }],
                })(<Input placeholder="请输入" {...itemStyles} />)}
              </FormItem>
              <FormItem label="区域名称" {...formItemLayout}>
                {getFieldDecorator('name', {
                  initialValue: '',
                  getValueFromEvent: this.handleTrim,
                  rules: [{ required: true, message: '请输入' }],
                })(<Input placeholder="请输入" {...itemStyles} />)}
              </FormItem>
              <FormItem label="风险分级" {...formItemLayout}>
                {getFieldDecorator('level', {
                  // initialValue: '',
                  getValueFromEvent: this.handleTrim,
                  rules: [{ required: true, message: '请选择' }],
                })(
                  <Select placeholder="请选择" {...itemStyles} allowClear>
                    {['红', '橙', '黄', '蓝'].map((item, index) => (
                      <Select.Option key={index} value={index}>
                        {item}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </FormItem>
              <FormItem label="所属图层" {...formItemLayout}>
                {getFieldDecorator('hasPic', {
                  initialValue: '',
                  getValueFromEvent: this.handleTrim,
                  rules: [{ required: true, message: '请输入' }],
                })(<Input placeholder="请输入" {...itemStyles} />)}
              </FormItem>
              <FormItem label="区域负责人" {...formItemLayout}>
                {getFieldDecorator('person', {
                  initialValue: '',
                  getValueFromEvent: this.handleTrim,
                  rules: [{ required: true, message: '请输入' }],
                })(<Input placeholder="请输入" {...itemStyles} />)}
              </FormItem>
              <FormItem label="联系电话" {...formItemLayout}>
                {getFieldDecorator('phone', {
                  initialValue: '',
                  getValueFromEvent: this.handleTrim,
                  rules: [{ required: true, message: '请输入' }],
                })(<Input placeholder="请输入" {...itemStyles} />)}
              </FormItem>
              <FormItem label="复评周期(月)" {...formItemLayout}>
                {getFieldDecorator('reVvaluation', {
                  initialValue: '',
                  getValueFromEvent: this.handleTrim,
                  rules: [{ required: true, message: '请输入' }],
                })(<Input placeholder="请输入" {...itemStyles} />)}
              </FormItem>
              <FormItem label="关联内容" {...formItemLayout}>
                {getFieldDecorator('conetnt', {
                  initialValue: '',
                  getValueFromEvent: this.handleTrim,
                  rules: [{ required: true, message: '请输入' }],
                })(<Input placeholder="请输入" {...itemStyles} />)}
              </FormItem>
              <FormItem {...formItemLayout}>
                <div style={{ textAlign: 'center' }}>
                  <Button style={{ marginRight: 10 }} onClick={this.handleSubmit}>
                    提交
                  </Button>
                  <Button href={'#/risk-control/four-color-image/list'}>返回</Button>
                </div>
              </FormItem>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}
