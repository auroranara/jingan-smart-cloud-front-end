import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Button, Card, TreeSelect, Select, Input, Form, message } from 'antd';

import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { METHODS, formItemLayout, tailFormItemLayout, getIdMap, sortTree, addProps } from '@/pages/SystemManagement/PageAuthority/utils';

const { Item: FormItem } = Form;
const { Option } = Select;
// const { TreeNode } = TreeSelect;

const breadcrumbList = [
  { title: '首页', name: '首页', href: '/' },
  { title: '系统管理', name: '系统管理' },
  { title: 'APP权限配置', name: 'APP权限配置', href: '/system-management/app-authority/index' },
  { title: '配置', name: '配置' },
];

const KEYS = ['parentId', 'code', 'showZname', 'sort', 'type', 'method', 'url'];
const TREE_TYPES = ['企业', '政府', '维保'];

@connect(({ appAuth, loading }) => ({ appAuth, loading: loading.models.appAuth }))
@Form.create()
export default class AppAuthorityAdd extends Component {
  componentDidMount() {
    const { match: { params: { id } }, dispatch, form: { setFieldsValue } } = this.props;
    if (id !== 'undefined')
      dispatch({
        type: 'appAuth/fetchList',
        payload: { ids: id },
        callback: data => {
          if (!Array.isArray(data) || !data.length)
            return;

          const detail = data[0];
          this.fetchTree(detail.type);
          setFieldsValue(KEYS.reduce((prev, next) => {
            if (next === 'code') {
              const codes = detail[next].split('.').filter(c => c);
              prev[next] = codes[codes.length - 1];
            }
            else
              prev[next] = detail[next];
            return prev;
          }, {}));
        },
      });
    else
      this.fetchTree(1);
  }

  idMap = {};
  codeMap = {};

  handleTreeTypeChange = value => {
    const { form: { setFieldsValue } } = this.props;
    this.fetchTree(value, () => setFieldsValue({ parentId: undefined }));
  };

  fetchTree = (type, cb) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'appAuth/fetchTree',
      payload: { type },
      callback: data => {
        [this.idMap, this.codeMap] = getIdMap(data);
        addProps(data);
        sortTree(data);
        cb && cb();
      },
    });
  };

  handleSubmit = e => {
    const { dispatch, match: { params: { id } } } = this.props;
    const isAdd = id === 'undefined';

    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { parentId, code } = values;
        const parentCode = this.codeMap[parentId];
        const newVals = {
          ...values,
          // ename: code,
          code: parentCode ? `${parentCode}.${code}` : code,
          parentIds: [...this.idMap[parentId], parentId].join(','),
        };

        // 编辑时，传id，新增时不传
        if (!isAdd)
          newVals.id = id;

        dispatch({
          type: `appAuth/${isAdd ? 'postAuth' :'putAuth'}`,
          payload: newVals,
          callback: (code, msg) => {
            if (code === 200) {
              message.success('成功');
              router.push('/system-management/app-authority/index');
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
      appAuth: { tree=[] },
    } = this.props;
    const isAdd = id === 'undefined';

    // 在节点数外面加一层根节点NULL层，以此来可以添加或编辑节点时，可以在最顶层添加模块
    const newTreeData = [{ title: 'NULL', value: '0', key: '0', children: tree }];

    return (
      <PageHeaderLayout
          title={`${isAdd ? '新增' : '编辑'}APP权限`}
          breadcrumbList={breadcrumbList}
        >
          <Card>
            <Form onSubmit={this.handleSubmit}>
              <FormItem label="权限树类型" {...formItemLayout}>
                {getFieldDecorator('type', { initialValue: '1', rules: [{ required: true, message: '请选择权限树类型' }] })(
                  <Select placeholder="请选择权限树类型" disabled={!isAdd} onChange={this.handleTreeTypeChange}>
                    {TREE_TYPES.map((c, i) => <Option key={c} value={(i + 1).toString()}>{c}</Option>)}
                  </Select>
                )}
              </FormItem>
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
              <FormItem label="中文名字" {...formItemLayout}>
                {getFieldDecorator('showZname', { rules: [{ required: true, message: '请输入中文名称' }] })(
                  <Input placeholder="请输入中文名称" />
                )}
              </FormItem>
              <FormItem label="排序优先级" {...formItemLayout}>
                {getFieldDecorator('sort', { rules: [{ required: true, message: '请输入排序优先级' }] })(
                  <Input placeholder="请输入排序优先级" />
                )}
              </FormItem>
              {/* <FormItem label="节点类型" {...formItemLayout}>
                {getFieldDecorator('type', {})(
                  <Select placeholder="请选择节点类型">
                    {NODE_TYPES.map(n => <Option key={n} value={n}>{n}</Option>)}
                  </Select>
                )}
              </FormItem> */}
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
