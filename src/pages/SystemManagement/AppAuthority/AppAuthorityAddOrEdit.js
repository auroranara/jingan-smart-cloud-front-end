import React, { Component } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Button, Card, TreeSelect, Select, Icon, Input, Form, message, Upload } from 'antd';

import { getToken } from '@/utils/authority';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { formItemLayout, tailFormItemLayout, getIdMap, sortTree, addProps, getSortValue, getBase64FromUrl } from '@/pages/SystemManagement/PageAuthority/utils';

const { Item: FormItem } = Form;
const { Option } = Select;

const UPLOAD_ACTION = '/acloud_new/v2/uploadFile';
const FOLDER = 'appIcons';
const breadcrumbList = [
  { title: '首页', name: '首页', href: '/' },
  { title: '系统管理', name: '系统管理' },
  { title: 'APP权限配置', name: 'APP权限配置', href: '/system-management/app-authority/index' },
  { title: '配置', name: '配置' },
];

const FUNCTION_POINTS = '2';
const KEYS = ['parentId', 'showZname', 'sort', 'type', 'realName', 'classType'];
const MORE_KEYS = ['code', 'clickType'];
const KEYS_POINTS = KEYS.concat(MORE_KEYS);
const TYPES = [{ name: '面板', key: '1' }, { name: '功能点', key: FUNCTION_POINTS }];

@connect(({ appAuth, loading }) => ({ appAuth, loading: loading.models.appAuth }))
@Form.create()
export default class AppAuthorityAdd extends Component {
  state = {
    showClickType: false,
    fileList: [],
  };

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
          this.detail = detail;
          const { type, logoUrl, webLogoUrl } = detail;

          if (logoUrl && webLogoUrl)
            getBase64FromUrl(webLogoUrl, (base64) => {
              this.setState({
                fileList: [
                  {
                    uid: Date.now(),
                    status: 'done',
                    thumbUrl: base64,
                    response: { data: { list: [{ dbUrl: logoUrl, webUrl: webLogoUrl }] } },
                  },
                ],
              });
            });

          this.handleShowClickType(type);
          this.fetchClassTypeList(type);
          const keys = type === FUNCTION_POINTS ? KEYS_POINTS : KEYS;
          setFieldsValue(keys.reduce((prev, next) => {
            // if (next === 'code') {
            //   const codes = detail[next].split('.').filter(c => c);
            //   prev[next] = codes[codes.length - 1];
            // }
            // else
            //   prev[next] = detail[next];
            prev[next] = detail[next];
            return prev;
          }, {}));
        },
      });
    else
      this.fetchClassTypeList();

    this.fetchTree();
    dispatch({ type: 'appAuth/fetchClickTypeList' });
  }

  idMap = {};
  detail = {};

  handleTypeChange = value => {
    const { form: { setFieldsValue } } = this.props;

    this.fetchClassTypeList(value);
    this.handleShowClickType(value);

    if (value === FUNCTION_POINTS)
      MORE_KEYS.forEach(key => {
        const value = this.detail[key];
        if (value !== undefined && value !== null)
          setFieldsValue({ [key]: value });
      });
  };

  handleClickTypeChange = (value, option) => {
    const { match: { params: { id } }, form: { setFieldsValue } } = this.props;

    const isAdd = id === 'undefined';
    const text = option.props.children;
    isAdd && setFieldsValue({ showZname: text, realName: text });
  };

  handleShowClickType = value => {
    if (value === undefined || value === null)
      return;

    if (value === FUNCTION_POINTS)
      this.setState({ showClickType: true });
    else
      this.setState({ showClickType: false });
  };

  fetchTree = cb => {
    const { dispatch } = this.props;
    dispatch({
      type: 'appAuth/fetchTree',
      callback: data => {
        [this.idMap] = getIdMap(data);
        addProps(data);
        sortTree(data);
        cb && cb();
      },
    });
  };

  fetchClassTypeList = (type=1) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'appAuth/fetchClassTypeList',
      payload: type,
    });
  };

  handleSubmit = e => {
    const { dispatch, match: { params: { id } }, appAuth: { tree=[] } } = this.props;
    const { fileList } = this.state;

    const isAdd = id === 'undefined';

    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { parentId, sort } = values;
        const newVals = {
          ...values,
          parentIds: [...this.idMap[parentId], parentId].join(','),
        };

        if (fileList.length)
          newVals.logoUrl = fileList[0].response.data.list[0].dbUrl;

        // 新增时自己计算sort值
        const [nextSort, sorts] = getSortValue(parentId, tree, id);
        if (isAdd)
          newVals.sort = nextSort;
        // 编辑时，传id，目标节点中已有当前sort，自动校正
        else {
          newVals.id = id;
          if (sorts.includes(+sort))
            newVals.sort = nextSort;
        }

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

  handleUploadChange = info => {
    const { fileList, file } = info;
    let newFileList = [];
    if (file.status === 'done')
      newFileList = [file];
    else if (file.status === 'error')
      newFileList = fileList.filter(file => file.status === 'done').slice(-1);
    else
      newFileList = fileList;

    this.setState({ fileList: newFileList });
  };

  render() {
    const {
      loading,
      form: { getFieldDecorator },
      match: { params: { id } },
      appAuth: { tree=[], classTypeList, clickTypeList },
    } = this.props;
    const { showClickType, fileList } = this.state;

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
              <FormItem label="父节点" {...formItemLayout}>
                {getFieldDecorator('parentId', { rules: [{ required: true, message: '请选择父节点' }] })(
                  <TreeSelect
                    placeholder="请选择父节点"
                    treeData={newTreeData}
                  />
                )}
              </FormItem>
              <FormItem label="类型" {...formItemLayout}>
                {getFieldDecorator('type', { initialValue: '1', rules: [{ required: true, message: '请选择类型' }] })(
                  <Select placeholder="请选择类型" onChange={this.handleTypeChange}>
                    {TYPES.map(({ name, key }) => <Option key={key} value={key}>{name}</Option>)}
                  </Select>
                )}
              </FormItem>
              <FormItem label="样式类型" {...formItemLayout}>
                {getFieldDecorator('classType')(
                  <Select placeholder="请选择样式类型">
                    {classTypeList.map(({ key, desc }) => <Option key={key} value={key}>{desc}</Option>)}
                  </Select>
                )}
              </FormItem>
              {showClickType && (
                <FormItem label="点击类型" {...formItemLayout}>
                  {getFieldDecorator('clickType', { rules: [{ required: true, message: '请选择类型' }] })(
                    <Select placeholder="请选择点击类型" onChange={this.handleClickTypeChange}>
                      {clickTypeList.map(({ key, desc }) => <Option key={key} value={key}>{desc}</Option>)}
                    </Select>
                  )}
                </FormItem>
              )}
              {showClickType && (
                <FormItem label="编码值" {...formItemLayout}>
                  {getFieldDecorator('code', { rules: [{ pattern: /^([a-z]|[A-Z])+$/, message: ' 请输入纯字母单词' }] })(
                    <Input placeholder="请输入编码值" />
                  )}
                </FormItem>
              )}
              <FormItem label="权限名字" {...formItemLayout}>
                {getFieldDecorator('showZname', { rules: [{ required: true, message: '请输入中文名称' }] })(
                  <Input placeholder="请输入权限名称" />
                )}
              </FormItem>
              <FormItem label="真实名字" {...formItemLayout}>
                {getFieldDecorator('realName', { rules: [{ required: true, message: '请输入中文名称' }] })(
                  <Input placeholder="请输入真实名字" />
                )}
              </FormItem>
              {!isAdd && (
                <FormItem label="排序优先级" {...formItemLayout}>
                  {getFieldDecorator('sort', { rules: [{ required: true, message: '请输入排序优先级' }] })(
                    <Input placeholder="请输入排序优先级" />
                  )}
                </FormItem>
              )}
              {showClickType && (
                <FormItem label="上传图标" {...formItemLayout}>
                  <Upload
                    name="files"
                    action={UPLOAD_ACTION}
                    data={{ folder: FOLDER }}
                    listType="picture-card"
                    fileList={fileList}
                    onChange={this.handleUploadChange}
                    headers={{ 'JA-Token': getToken() }}
                  >
                    <Icon type="plus" />
                  </Upload>
                </FormItem>
              )}
              <FormItem {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit" disabled={loading}>提交</Button>
              </FormItem>
            </Form>
          </Card>
        </PageHeaderLayout>
    );
  }
}
