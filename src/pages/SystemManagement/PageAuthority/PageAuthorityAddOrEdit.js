import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Button, Card, TreeSelect, Select, Input, Form, message } from 'antd';

import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { METHODS, NODE_TYPES, formItemLayout, tailFormItemLayout, getIdMap, sortTree, addProps } from './utils';

const { Item: FormItem } = Form;
const { Option } = Select;
// const { TreeNode } = TreeSelect;

const breadcrumbList = [
  { title: '首页', name: '首页', href: '/' },
  { title: '系统管理', name: '系统管理' },
  { title: '页面权限配置', name: '页面权限配置', href: '/system-management/page-authority/index' },
  { title: '配置', name: '配置' },
];

const KEYS = ['parentId', 'code', 'zname', 'showZname', 'sort', 'type', 'method', 'url'];

@connect(({ pageAuth, loading }) => ({ pageAuth, loading: loading.models.pageAuth }))
@Form.create()
export default class PageAuthorityAdd extends Component {
  componentDidMount() {
    const { match: { params: { id } }, dispatch, form: { setFieldsValue } } = this.props;
    if (id !== 'undefined')
      dispatch({
        type: 'pageAuth/fetchOne',
        payload: id,
        callback: (data) => {
          setFieldsValue(KEYS.reduce((prev, next) => {
            if (next === 'code') {
              const codes = data[next].split('.').filter(c => c);
              prev[next] = codes[codes.length - 1];
            }
            else
              prev[next] = data[next];
            return prev;
          }, {}));
        },
      });
      dispatch({
        type: 'pageAuth/fetchTree',
        callback: data => {
          [this.idMap, this.codeMap] = getIdMap(data);
          addProps(data);
          sortTree(data);

          // console.log(this.idMap);
        },
      });
  }

  idMap = {};
  codeMap = {};

  handleSubmit = e => {
    const { dispatch, match: { params: { id } } } = this.props;
    const isAdd = id === 'undefined';

    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // console.log('Received values of form: ', values);
        const { parentId, code } = values;
        const parentCode = this.codeMap[parentId];
        const newVals = {
          ...values,
          ename: code,
          code: parentCode ? `${parentCode}.${code}` : code,
          parentIds: [...this.idMap[parentId], parentId].join(','),
        };

        // 编辑时，传id，新增时不传
        if (!isAdd)
          newVals.id = id;

        // console.log(newVals);

        dispatch({
          type: `pageAuth/${isAdd ? 'postAuth' :'putAuth'}`,
          payload: newVals,
          callback: (code, msg) => {
            if (code === 200) {
              message.success('成功');
              router.push('/system-management/page-authority/index');
            }
            else
              message.warn(msg);
          },
        });
      }
    });
  };

  render() {
    const {
      loading,
      form: { getFieldDecorator },
      match: { params: { id } },
      pageAuth: { tree=[] },
    } = this.props;
    const isAdd = id === 'undefined';

    // console.log(tree);

    // 在节点数外面加一层根节点NULL层，以此来可以添加或编辑节点时，可以在最顶层添加模块
    const newTreeData = [{ title: 'NULL', value: '0', key: '0', children: tree }];

    return (
      <PageHeaderLayout
          title={`${isAdd ? '新增' : '编辑'}页面权限`}
          breadcrumbList={breadcrumbList}
          // content={
          //   <div>
          //     layout
          //   </div>
          // }
          // action={<Button type="primary" onClick={e => router.push("/system-management/page-authority/index")}>返回</Button>}
        >
          <Card>
            <Form onSubmit={this.handleSubmit}>
              <FormItem label="父节点" {...formItemLayout}>
                {getFieldDecorator('parentId', { rules: [{ required: true, message: '请选择父节点' }] })(
                  <TreeSelect
                    // treeDefaultExpandAll
                    placeholder="请选择父节点"
                    treeData={newTreeData}
                  />
                )}
              </FormItem>
              <FormItem label="编码值" {...formItemLayout}>
                {getFieldDecorator('code', { rules: [{ required: true, message: '请输入编码值' }, { pattern: /^([a-z]|[A-Z])+$/, message: ' 请输入纯字母单词' }] })(
                  <Input placeholder="请输入编码值" />
                )}
              </FormItem>
              {/* <FormItem label="英文名字" {...formItemLayout}>
                {getFieldDecorator('ename', { rules: [{ required: true, message: '请输入英文名称' }] })(
                  <Input placeholder="请输入英文名称" />
                )}
              </FormItem> */}
              <FormItem label="中文名字(参考)" {...formItemLayout}>
                {getFieldDecorator('zname', {})(
                  <Input placeholder="请输入中文名称(参考)" />
                )}
              </FormItem>
              <FormItem label="中文名字(显示)" {...formItemLayout}>
                {getFieldDecorator('showZname', { rules: [{ required: true, message: '请输入中文名称(显示)' }] })(
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
                {getFieldDecorator('url', {})(
                  <Input placeholder="请输入节点类型" />
                )}
              </FormItem>
              <FormItem {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit" disabled={loading}>提交</Button>
              </FormItem>
            </Form>
          </Card>
        </PageHeaderLayout>
    );
  }
}
