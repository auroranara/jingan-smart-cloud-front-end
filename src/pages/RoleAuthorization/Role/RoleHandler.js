import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Card, Input, Button, Spin, Tree, message } from 'antd';
import { routerRedux } from 'dva/router';

import PageHeaderLayout from '../../layouts/PageHeaderLayout.js';
import { hasAuthority } from '../../../utils/customAuth';
import urls from '../../../utils/urls';
import codes from '../../../utils/codes';

// import styles from './Role.less';

const { TreeNode } = Tree;
const { TextArea } = Input

// 标题
const addTitle = '新增角色';
const editTitle = '编辑角色';
// 获取链接地址
const { role: { list: backUrl } } = urls;
// 获取code
const { role: { list: listCode } } = codes;
/* 根据选中的子节点获取父节点 */
const checkParent = (list, permissions) => {
  let newList = [];
  list.forEach(item => {
    const { id, childMenus } = item;
    if (childMenus) {
      const newChildMenu =  checkParent(childMenus, permissions);
      if (newChildMenu.length !== 0) {
        newList = newList.concat(newChildMenu, id)
      }
    }
    else {
      permissions.includes(id) && newList.push(id);
    }
  });
  return newList;
};
/* 移除子元素未全部选中的父元素 */
const uncheckParent = (list, permissions) => {
  let newList = [];
  list.forEach(({ id, childMenus }) => {
    if (childMenus) {
      const newChildMenu =  uncheckParent(childMenus, permissions);
      if (newChildMenu.length !== 0) {
        newList = newList.concat(newChildMenu)
        if (childMenus.every(({ id }) => newChildMenu.includes(id))) {
          newList = newList.concat(id);
        }
      }
    }
    else {
      permissions.includes(id) && newList.push(id);
    }
  });
  return newList;
};
/* 对树排序 */
const sortTree = (list) => {
  const newList = [];
  list.forEach((item) => {
    const { childMenus, sort } = item;
    if (!sort && sort !== 0) {
      newList.push({
        ...item,
      });
      return;
    }
    if (childMenus) {
      newList[sort] = {
        ...item,
        childMenus: sortTree(childMenus),
      };
    }
    else {
      newList[sort] = {
        ...item,
      };
    }
  });
  for(var i=newList.length-1;i>=0;i--){
    if (!newList[i]) {
      newList.splice(i, 1);
    }
  }
  return newList;
};


@connect(({ role, user, loading }) => ({
  role,
  user,
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
    const { fetchDetail, fetchPermissionTree, clearDetail, role: { permissionTree }, match: { params: { id } } } = this.props;
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
    if (permissionTree.length === 0) {
      fetchPermissionTree();
    }
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
        const { role: { permissionTree } } = this.props;
        const { name, description, permissions } = values;
        const payload = {
          id,
          name: name.trim(),
          description,
          permissions: checkParent(permissionTree, permissions).join(','),
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
    const { role: { detail: { sysRole: { name, description } } }, form: { getFieldDecorator } } = this.props;

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
    return data.map((item) => {
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
    const { role: { permissionTree, detail: { permissions } }, form: { getFieldDecorator } } = this.props;
    const value = permissions && uncheckParent(permissionTree, permissions);
    const tree = sortTree(permissionTree);

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
            {getFieldDecorator('permissions', {
              initialValue: value,
              trigger: 'onCheck',
              validateTrigger: 'onCheck',
              valuePropName: 'checkedKeys',
              rules: [{ required: true, message: '请选择权限', transform: value => value && value.join(',') }],
            })(
              <Tree
                checkable
              >
                {this.renderTreeNodes(tree)}
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
    const { goBack, loading, user: { currentUser: { permissionCodes } } } = this.props;
    const hasListAuthority = hasAuthority(listCode, permissionCodes);

    return (
      <div style={{ textAlign: 'center' }}>
        <Button onClick={goBack} style={{ marginRight: '24px' }} disabled={!hasListAuthority}>返回</Button>
        <Button type="primary" onClick={this.handleSubmit} loading={loading}>确定</Button>
      </div>
    );
  }

  render() {
    const { loading, match: { params: { id } },  user: { currentUser: { permissionCodes } } } = this.props;
    const { submitting } = this.state;
    // 是否有列表权限
    const hasListAuthority = hasAuthority(listCode, permissionCodes);
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
        href: hasListAuthority ? backUrl : undefined,
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
