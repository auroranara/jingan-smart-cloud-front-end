import React, { PureComponent } from 'react';
import { Form, Card, Input, Button, Select, Spin, Tree, message } from 'antd';

import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import { hasAuthority } from '@/utils/customAuth';
import { checkParent, uncheckParent, sortTree } from './utils';

const { TreeNode } = Tree;
const { TextArea } = Input;
const { Option } = Select;

const INLINE_FORM_STYLE = { width: '50%', marginRight: 0 };
// 标题
const addTitle = '新增角色';
const editTitle = '编辑角色';

@Form.create()
export default class RoleHandler extends PureComponent {
  state = {
    submitting: false,
    unitType: undefined,
  };

  /* 挂载后 */
  componentDidMount() {
    const {
      match: { params: { id } },
      fetchUnitTypes,
      fetchDetail,
      fetchPermissionTree,
      clearPermissionTree,
      clearDetail,
    } = this.props;

    fetchUnitTypes();

    if (id) { // 编辑
      fetchDetail({
        payload: { id },
        success: detail => {
          const type = detail ? detail.unitType : undefined;
          type && +type !== 3 && fetchPermissionTree({ payload: type });

          this.setState({ unitType: type ? +type : type });
        },
      });
    } else { // 新增
      clearDetail();
      clearPermissionTree();
    }
  }

  handleTreeTypeChange = value => {
    const {
      fetchPermissionTree,
      form: { setFieldsValue },
      role: {
        detail: {
          unitType,
          webPermissionIds,
          appPermissionIds,
        },
      },
    } = this.props;

    this.setState({ unitType: +value });

    fetchPermissionTree({
      payload: value,
      // 在model变化前，先清空值，不然会报warning
      callback: () => { setFieldsValue({ permissions:undefined, appPermissions: undefined }); },
      // model变化后再设置值，不然当先设置值时，就会报warning，且model后变化，就没办法正确设置上值了
      callbackLater: (tree, appTree) => {
        console.log(tree, appTree);
        if (+value === +unitType) {
          const value = webPermissionIds ? uncheckParent(tree, webPermissionIds) : [];
          const appValue = appPermissionIds ? uncheckParent(appTree, appPermissionIds) : [];
          setFieldsValue({ permissions: value, appPermissions: appValue });
        }
      },
    });
  };

  /* 提交 */
  handleSubmit = () => {
    const {
      insertRole,
      updateRole,
      goBack,
      form: { validateFieldsAndScroll },
      match: { params: { id } },
    } = this.props;
    // 验证表单
    validateFieldsAndScroll((error, values) => {
      if (!error) {
        // 验证成功后显示加载动画以确保无法重复点击
        this.setState({
          submitting: true,
        });
        const {
          role: { permissionTree, appPermissionTree },
        } = this.props;
        const { roleName, description, permissions, appPermissions, unitType } = values;
        const payload = {
          id,
          unitType,
          roleName: roleName.trim(),
          description,
          webPermissionIds: checkParent(permissionTree, permissions),
          appPermissionIds: checkParent(appPermissionTree, appPermissions),
        };
        const success = () => {
          const msg = id ? '编辑成功' : '新增成功';
          message.success(msg, 1, goBack);
        };
        const error = () => {
          const msg = id ? '编辑失败' : '新增失败';
          message.error(msg, 1);
          this.setState({
            submitting: false,
          });
        };
        // 如果id存在，则编辑角色
        if (id)
          updateRole({ payload, success, error });
        // 否则新增角色
        else
          insertRole({ payload, success, error });
      }
    });
  };

  /* 基本信息 */
  renderBasicInfo() {
    const {
      account: { unitTypes },
      role: {
        detail: { roleName, description, unitType },
      },
      form: { getFieldDecorator },
    } = this.props;

    const sortedUnitTypes = unitTypes ? Array.from(unitTypes) : [];
    sortedUnitTypes.sort((u1, u2) => u1.sort - u2.sort);

    return (
      <Card title="基本信息">
        <Form>
          <Form.Item
            label="角色类型"
            labelCol={{
              sm: { span: 24 },
              md: { span: 3 },
              lg: { span: 3 },
            }}
            wrapperCol={{
              sm: { span: 24 },
              md: { span: 6 },
              lg: { span: 3 },
            }}
          >
            {getFieldDecorator('unitType', {
              initialValue: unitType ? +unitType : unitType,
              rules: [{ required: true, message: '请选择角色类型' }],
            })(
              <Select
                onChange={this.handleTreeTypeChange}
              >
                {sortedUnitTypes.map(({ id, label }, i) => <Option key={id} value={id}>{label}</Option>)}
              </Select>
            )}
          </Form.Item>
          <Form.Item
            label="角色名称"
            labelCol={{
              sm: { span: 24 },
              md: { span: 3 },
              lg: { span: 3 },
            }}
            wrapperCol={{
              sm: { span: 24 },
              md: { span: 21 },
              lg: { span: 9 },
            }}
          >
            {getFieldDecorator('roleName', {
              initialValue: roleName,
              rules: [{ required: true, message: '请输入角色名称', whitespace: true }],
            })(<Input maxLength={50} placeholder="请输入角色名称" />)}
          </Form.Item>
          <Form.Item
            label="角色描述"
            labelCol={{
              sm: { span: 24 },
              md: { span: 3 },
              lg: { span: 3 },
            }}
            wrapperCol={{
              sm: { span: 24 },
              md: { span: 21 },
              lg: { span: 17 },
            }}
          >
            {getFieldDecorator('description', {
              initialValue: description,
              rules: [{ required: true, message: '请输入角色描述', whitespace: true }],
            })(<TextArea rows={4} maxLength="500" placeholder="请输入角色描述" />)}
          </Form.Item>
        </Form>
      </Card>
    );
  }

  /* 树节点 */
  renderTreeNodes(data) {
    return data.map(item => {
      const { id, showZname: title, childMenus: children } = item;
      if (children) {
        return (
          <TreeNode title={title} key={id} dataRef={item} selectable={false}>
            {this.renderTreeNodes(children)}
          </TreeNode>
        );
      }
      return <TreeNode title={title} key={id} dataRef={item} selectable={false} />;
    });
  }

  /* 权限配置 */
  renderAuthorizationConfiguration() {
    const {
      role: {
        permissionTree,
        appPermissionTree,
        detail: { appPermissionIds, webPermissionIds },
      },
      form: { getFieldDecorator },
    } = this.props;
    const { unitType } = this.state;

    const value = webPermissionIds ? uncheckParent(permissionTree, webPermissionIds) : [];
    const appValue = appPermissionIds ? uncheckParent(appPermissionTree, appPermissionIds) : [];
    const tree = sortTree(permissionTree);
    const appTree = sortTree(appPermissionTree);

    return (
      <Card title="权限配置" style={{ marginTop: '24px' }}>
        <Form layout="inline">
          <Form.Item
            label="WEB权限树"
            style={INLINE_FORM_STYLE}
            labelCol={{
              sm: { span: 24 },
              md: { span: 6 },
            }}
            wrapperCol={{
              sm: { span: 24 },
              md: { span: 18 },
            }}
          >
            {getFieldDecorator('permissions', {
              initialValue: value,
              trigger: 'onCheck',
              validateTrigger: 'onCheck',
              valuePropName: 'checkedKeys',
              // rules: [
              //   {
              //     required: true,
              //     message: '请选择WEB权限',
              //     transform: value => value && value.join(','),
              //   },
              // ],
            })(<Tree checkable>{this.renderTreeNodes(tree)}</Tree>)}
          </Form.Item>
          {unitType !== 3 && (
            <Form.Item
              label="APP权限树"
              style={INLINE_FORM_STYLE}
              labelCol={{
                sm: { span: 24 },
                md: { span: 6 },
              }}
              wrapperCol={{
                sm: { span: 24 },
                md: { span: 18 },
              }}
            >
              {getFieldDecorator('appPermissions', {
                initialValue: appValue,
                trigger: 'onCheck',
                validateTrigger: 'onCheck',
                valuePropName: 'checkedKeys',
                // rules: [
                //   {
                //     required: true,
                //     message: '请选择APP权限',
                //     transform: value => value && value.join(','),
                //   },
                // ],
              })(<Tree checkable>{this.renderTreeNodes(appTree)}</Tree>)}
            </Form.Item>
          )}
        </Form>
        {this.renderButtonGroup()}
      </Card>
    );
  }

  /* 按钮组 */
  renderButtonGroup() {
    const {
      goBack,
      loading,
      codes: { list: listCode },
      user: { currentUser: { permissionCodes } },
    } = this.props;
    const hasListAuthority = hasAuthority(listCode, permissionCodes);

    return (
      <div style={{ textAlign: 'center' }}>
        <Button onClick={goBack} style={{ marginRight: '24px' }} disabled={!hasListAuthority}>
          返回
        </Button>
        <Button type="primary" onClick={this.handleSubmit} loading={loading}>
          确定
        </Button>
      </div>
    );
  }

  render() {
    const {
      loading,
      type,
      urls: { listUrl },
      codes: { list: listCode },
      match: { params: { id } },
      user: { currentUser: { permissionCodes } },
    } = this.props;
    const { submitting } = this.state;

    const typeLabel = type ? '公共' : '私有';
    const hasListAuthority = hasAuthority(listCode, permissionCodes); // 是否有列表权限
    const title = id ? editTitle : addTitle; // 根据params.id是否存在判断当前为新增还是编辑
    const breadcrumbList = [ // 面包屑
      {
        title: '首页',
        name: '首页',
        href: '/',
      },
      {
        title: '角色权限',
        name: '角色权限',
      },
      {
        title: `${typeLabel}角色`,
        name: `${typeLabel}角色`,
        href: hasListAuthority ? listUrl : undefined,
      },
      {
        title,
        name: title,
      },
    ];

    return (
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList}>
        <Spin spinning={loading || submitting}>
          {this.renderBasicInfo()}
          {this.renderAuthorizationConfiguration()}
        </Spin>
      </PageHeaderLayout>
    );
  }
}
