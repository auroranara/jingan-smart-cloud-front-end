import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Input, Form, Select, Switch, Button } from 'antd';

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
    const validate = () => {};
    return (
      <Form>
        <FormItem label="选择企业为维修单位：">
          {getFieldDecorator('title', {
            rules: [{ message: '请选择企业' }],
            initialValue: current.title,
          })(<Input placeholder="请选择企业" />)}
        </FormItem>
        <FormItem label="维修单位启用状态：">
          {getFieldDecorator('qiyong', {
            rules: [{ message: '请选择启用状态' }],
            initialValue: '启用',
          })(
            <Select placeholder="请选择">
              <SelectOption value="启用">启用</SelectOption>
              <SelectOption value="禁用">禁用</SelectOption>
            </Select>
          )}
        </FormItem>
        <FormItem label="是否为分公司：">
          {getFieldDecorator('owner', {
            initialValue: current.owner,
          })(<Switch checkedChildren="是" unCheckedChildren="否" onChange={this.switchOnchange} />)}
        </FormItem>
        {current.owner && (
          <FormItem label="选择所属总公司：">
            {getFieldDecorator('adgyg', {
              rules: [{ message: '请选择一家维保公司为总公司' }],
              initialValue: current.owner,
            })(<Input placeholder="请选择" />)}
          </FormItem>
        )}
        <Button type="primary" onClick={validate}>
          保存
        </Button>
      </Form>
    );
  }
}
