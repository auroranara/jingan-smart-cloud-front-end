import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Button, Card, TreeSelect, Select, Input, Form } from 'antd';

import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { TREE, METHODS, NODE_TYPES, formItemLayout, tailFormItemLayout } from './utils';

const { Item: FormItem } = Form;
const { Option } = Select;
// const { TreeNode } = TreeSelect;

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
    const { form: { getFieldDecorator }, match: { params: { id } } } = this.props;
    const isAdd = id === 'undefined';

    // 在节点数外面加一层根节点NULL层，以此来可以添加或编辑节点时，可以在最顶层添加模块
    const newTreeData = [{ title: 'NULL', value: '0', key: '0', children: TREE }];

    return (
      <PageHeaderLayout
          title={`${isAdd ? '新增' : '编辑'}页面权限`}
          // breadcrumbList={breadcrumbList}
          // content={
          //   <div>
          //     layout
          //   </div>
          // }
          action={<Button type="primary" onClick={e => router.push("/system-management/page-authority/index")}>返回</Button>}
        >
          <Card>
            <Form onSubmit={this.handleSubmit}>
              <FormItem label="父节点" {...formItemLayout}>
                {getFieldDecorator('parentId', { rules: [{ required: true, message: '请选择父节点' }] })(
                  <TreeSelect
                    treeDefaultExpandAll
                    placeholder="请选择父节点"
                    treeData={newTreeData}
                  />
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
