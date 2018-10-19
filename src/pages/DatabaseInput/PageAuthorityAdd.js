import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Button, Card, TreeSelect, Select, Input, Form } from 'antd';

import PageHeaderLayout from '@/layouts/PageHeaderLayout';

const { Item: FormItem } = Form;
const { Option } = Select;
// const { TreeNode } = TreeSelect;

const TREE = [{
  title: 'Node1',
  value: '0-0',
  key: '0-0',
  children: [{
    title: 'Child Node1',
    value: '0-0-1',
    key: '0-0-1',
  }, {
    title: 'Child Node2',
    value: '0-0-2',
    key: '0-0-2',
  }],
}, {
  title: 'Node2',
  value: '0-1',
  key: '0-1',
}];

const METHODS = ['GET', 'PUT', 'POST', 'DELETE'];
const NODE_TYPES = ['menu', 'node', 'page', 'button'];
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 12 },
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
      offset: 10,
    },
  },
};

@Form.create()
export default class PageAuthorityAdd extends Component {
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    return (
      <PageHeaderLayout
          title="新增页面权限"
          // breadcrumbList={breadcrumbList}
          // content={
          //   <div>
          //     layout
          //   </div>
          // }
          action={<Button type="primary" onClick={e => router.push("/database-input/pageAuthority/index")}>编辑</Button>}
        >
          <Card>
            <Form onSubmit={this.handleSubmit}>
              <FormItem label="父节点" {...formItemLayout}>
                {getFieldDecorator('parentId', { rules: [{ required: true, message: '请选择父节点' }] })(
                  <TreeSelect treeData={[{ title: 'NULL', value: '0', key: '0', children: TREE }]} placeholder="请选择父节点" />
                )}
              </FormItem>
              <FormItem label="编码值" {...formItemLayout}>
                {getFieldDecorator('code', { rules: [{ required: true, message: '请输入编码值' }] })(
                  <Input placeholder="请输入编码值" />
                )}
              </FormItem>
              <FormItem label="英文名字" {...formItemLayout}>
                {getFieldDecorator('ename', { rules: [{ required: true, message: '请输入英文名称' }] })(
                  <Input placeholder="请输入英文名称" />
                )}
              </FormItem>
              <FormItem label="中文名字(参考)" {...formItemLayout}>
                {getFieldDecorator('zName', {})(
                  <Input placeholder="请输入中文名称(参考)" />
                )}
              </FormItem>
              <FormItem label="中文名字(显示)" {...formItemLayout}>
                {getFieldDecorator('showZName', { rules: [{ required: true, message: '请输入中文名称(显示)' }] })(
                  <Input placeholder="请输入中文名称(显示)" />
                )}
              </FormItem>
              <FormItem label="排序优先级" {...formItemLayout}>
                {getFieldDecorator('sort', { rules: [{ required: true, message: '请输入排序优先级' }] })(
                  <Input placeholder="请输入排序优先级" />
                )}
              </FormItem>
              <FormItem label="节点类型" {...formItemLayout}>
                {getFieldDecorator('type', {})(
                  <Select placeholder="请选择节点类型">
                    {NODE_TYPES.map(n => <Option key={n} value={n}>{n}</Option>)}
                  </Select>
                )}
              </FormItem>
              <FormItem label="请求方式" {...formItemLayout}>
                {getFieldDecorator('method', {})(
                  <Select placeholder="请选择请求方式">
                    {METHODS.map(m => <Option key={m} value={m}>{m}</Option>)}
                  </Select>
                )}
              </FormItem>
              <FormItem label="请求路径" {...formItemLayout}>
                {getFieldDecorator('type', {})(
                  <Input placeholder="请输入节点类型" />
                )}
              </FormItem>
              <FormItem {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit">提交</Button>
              </FormItem>
            </Form>
          </Card>
        </PageHeaderLayout>
    );
  }
}
