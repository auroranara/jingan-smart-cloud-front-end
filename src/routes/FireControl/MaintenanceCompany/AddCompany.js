import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Input, Form, Select, Switch, Button, Layout, Breadcrumb } from 'antd';

const { Content } = Layout;
const FormItem = Form.Item;
const SelectOption = Select.Option;

@connect(({ list, loading }) => ({
  list,
  loading: loading.models.list,
}))
@Form.create()
export default class AddCompany extends PureComponent {
  state = {
    current: {
      title: '',
      owner: true,
    },
  };

  componentDidMount() {}

  switchOnchange = checked => {
    console.log(checked);
    this.setState({
      current: {
        owner: checked,
      },
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { current } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };

    return (
      <Layout className="layout">
        <Content style={{ padding: '0 40px' }}>
          <Breadcrumb style={{ margin: '10px 0' }}>
            <Breadcrumb.Item>我的桌面</Breadcrumb.Item>
            <Breadcrumb.Item>维修单位</Breadcrumb.Item>
          </Breadcrumb>
          <div style={{ background: '#fff', padding: 24, minHeight: 320 }}>
            <h3 style={{ padding: 2 }}>添加维修单位</h3>
            <Form>
              <FormItem label="选择企业为维修单位：" {...formItemLayout}>
                {getFieldDecorator('title', {
                  rules: [{ message: '请选择企业' }],
                  initialValue: current.title,
                })(<Input placeholder="请选择企业" />)}
              </FormItem>
              <FormItem label="维修单位启用状态：" {...formItemLayout}>
                {getFieldDecorator('comstatus', {
                  rules: [{ message: '请选择启用状态' }],
                  initialValue: '启用',
                })(
                  <Select placeholder="请选择">
                    <SelectOption value="启用">启用</SelectOption>
                    <SelectOption value="禁用">禁用</SelectOption>
                  </Select>
                )}
              </FormItem>
              <FormItem label="是否为分公司：" {...formItemLayout}>
                {getFieldDecorator('owner', {
                  initialValue: current.owner,
                })(
                  <Switch
                    checkedChildren="是"
                    unCheckedChildren="否"
                    onChange={this.switchOnchange}
                  />
                )}
              </FormItem>
              {current.owner && (
                <FormItem label="选择所属总公司：" {...formItemLayout}>
                  {getFieldDecorator('corporation', {
                    rules: [{ message: '请选择一家维保公司为总公司' }],
                    initialValue: current.owner,
                  })(<Input placeholder="请选择" />)}
                </FormItem>
              )}
              <FormItem {...tailFormItemLayout}>
                <Button type="primary">保存</Button>
              </FormItem>
            </Form>
          </div>
        </Content>
      </Layout>
    );
  }
}
