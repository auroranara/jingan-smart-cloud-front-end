import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Card, Input, Button, Spin, Tree, message } from 'antd';
import { routerRedux } from 'dva/router';

import PageHeaderLayout from '../../layouts/PageHeaderLayout.js';

// import styles from './Role.less';

const { TreeNode } = Tree;
const { TextArea } = Input

// 标题
const addTitle = '新增角色';
const editTitle = '编辑角色';
// 返回地址
const backUrl = '/role-authorization/role/list';

@connect(({ role, loading }) => ({
  role,
  loading: loading.models.role,
}), (dispatch) => ({
  // 获取详情
  fetchDetail(action) {
    dispatch({
      type: 'role/fetchDetail',
      ...action,
    });
  },
  // 获取权限树
  fetchPermissionTree() {
    dispatch({
      type: 'role/fetchPermissionTree',
    });
  },
  // 新增角色
  insertRole(action) {
    dispatch({
      type: 'role/insertRole',
      ...action,
    });
  },
  // 编辑角色
  updateRole(action) {
    dispatch({
      type: 'role/updateRole',
      ...action,
    });
  },
  // 清空详情
  clearDetail() {
    dispatch({
      type: 'role/clearDetail',
    });
  },
  // 返回
  goBack() {
    dispatch(routerRedux.push(backUrl));
  },
  dispatch,
}))
@Form.create()
export default class RoleHandler extends PureComponent {
  state={
    submitting: false,
  }

  /* 挂载后 */
  componentDidMount() {
    const { fetchDetail, fetchPermissionTree, clearDetail, match: { params: { id } } } = this.props;
    // 根据params.id是否存在判断当前为新增还是编辑
    if (id) {
      // 根据id获取详情
      fetchDetail({
        payload: {
          id,
        },
      });
    }
    else {
      // 清空详情
      clearDetail();
    }
    // 获取权限树
    fetchPermissionTree();
  }

  /* 提交 */
  handleSubmit = () => {
    const { insertRole, updateRole, goBack, form: { validateFieldsAndScroll }, match: { params: { id } } } = this.props;
    // 验证表单
    validateFieldsAndScroll((error, values) => {
      if (!error) {
        // 验证成功后显示加载动画以确保无法重复点击
        this.setState({
          submitting: true,
        });
        const { name, remark, permission } = values;
        const payload = {
          name: name.trim(),
          remark,
          permission: permission.join(','),
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
        if (id) {
          updateRole({
            payload,
            success,
            error,
          });
        }
        // 否则新增角色
        else {
          insertRole({
            payload,
            success,
            error,
          });
        }
      }
    });
  }

  /* 基本信息 */
  renderBasicInfo() {
    const { role: { detail: { name, remark } }, form: { getFieldDecorator } } = this.props;

    return (
      <Card title="基本信息">
        <Form>
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
            {getFieldDecorator('name', {
              initialValue: name,
              rules: [{ required: true, message: '请输入角色名称', whitespace: true }],
            })(<Input maxLength="50" placeholder="请输入角色名称" />)}
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
            {getFieldDecorator('remark', {
              initialValue: remark,
              rules: [{ required: true, message: '请输入角色描述', whitespace: true }],
            })(<TextArea rows={4} maxLength="500" placeholder="请输入角色描述" />)}
          </Form.Item>
        </Form>
      </Card>
    );
  }

  /* 树节点 */
  renderTreeNodes(data) {
    return data.map((item) => {
      const { id, title, children, disable } = item;
      if (children) {
        return (
          <TreeNode title={title} key={id} dataRef={item} disable={disable} selectable={false}>
            {this.renderTreeNodes(children)}
          </TreeNode>
        );
      }
      return <TreeNode title={title} key={id} dataRef={item} disable={disable} selectable={false} />;
    });
  }

  /* 权限配置 */
  renderAuthorizationConfiguration() {
    const { role: { permissionTree, detail: { permission } }, form: { getFieldDecorator } } = this.props;

    return (
      <Card title="权限配置" style={{ marginTop: '24px' }}>
        <Form>
          <Form.Item
            label="权限树"
            labelCol={{
              sm: { span: 24 },
              md: { span: 3 },
            }}
            wrapperCol={{
              sm: { span: 24 },
              md: { span: 21 },
            }}
          >
            {getFieldDecorator('permission', {
              initialValue: permission || [],
              trigger: 'onCheck',
              validateTrigger: 'onCheck',
              rules: [{ required: true, message: '请选择权限', transform: value => value && value.join(',') }],
            })(
              <Tree
                checkable
              >
                {this.renderTreeNodes(permissionTree)}
              </Tree>
            )}
          </Form.Item>
        </Form>
        {this.renderButtonGroup()}
      </Card>
    );
  }

  /* 按钮组 */
  renderButtonGroup() {
    const { goBack, loading } = this.props;

    return (
      <div style={{ textAlign: 'center' }}>
        <Button onClick={goBack} style={{ marginRight: '24px' }}>返回</Button>
        <Button type="primary" onClick={this.handleSubmit} loading={loading}>确定</Button>
      </div>
    );
  }

  render() {
    const { loading, match: { params: { id } } } = this.props;
    const { submitting } = this.state;
    // 根据params.id是否存在判断当前为新增还是编辑
    const title = id ? editTitle : addTitle;
    // 面包屑
    const breadcrumbList = [
      {
        title: '首页',
        name: '首页',
        href: '/',
      },
      {
        title: '权限管理',
        name: '权限管理',
      },
      {
        title: '角色管理',
        name: '角色管理',
        href: backUrl,
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
