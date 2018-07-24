import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Card, Spin, Tree, Button } from 'antd';
import { routerRedux } from 'dva/router';
import DescriptionList from 'components/DescriptionList';
import PageHeaderLayout from '../../layouts/PageHeaderLayout.js';

const { Description } = DescriptionList;
const { TreeNode } = Tree;

// 标题
const title = '角色详情';
// 返回地址
const backUrl = '/role-authorization/role/list';
// 编辑地址
const editUrl = '/role-authorization/role/edit/';
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
/* 获取无数据 */
const getEmptyData = () => {
  return <span style={{ color: 'rgba(0,0,0,0.45)' }}>暂无数据</span>;
};

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
  // 返回
  goBack() {
    dispatch(routerRedux.push(backUrl));
  },
  /* 跳转到编辑页面 */
  goToEdit(id) {
    dispatch(routerRedux.push(editUrl + id));
  },
  /* 异常 */
  goToException() {
    dispatch(routerRedux.push('/exception/500'));
  },
  dispatch,
}))
@Form.create()
export default class RoleDetail extends PureComponent {
  /* 挂载后 */
  componentDidMount() {
    const { fetchDetail, fetchPermissionTree, goToException, role: { permissionTree }, match: { params: { id } } } = this.props;
    // 根据id获取详情
    fetchDetail({
      payload: {
        id,
      },
      error: () => {
        goToException();
      },
    });
    // 获取权限树
    if (permissionTree.length === 0) {
      fetchPermissionTree();
    }
  }

  /* 渲染基础信息 */
  renderBasicInfo() {
    const { role: { detail: { sysRole: { name, description } } } } = this.props;

    return (
      <Card title="基本信息">
        <DescriptionList col={1} style={{ marginBottom: 16 }}>
          <Description term="角色名称">{name || getEmptyData()}</Description>
          <Description term="角色描述">{<div style={{ whiteSpace: 'pre-wrap' }}>{description}</div> || getEmptyData()}</Description>
        </DescriptionList>
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
    const { role: { detail: { treeMap } } } = this.props;
    const menu = treeMap ? (treeMap.menu || []) : [];

    return (
      <Card title="权限配置" style={{ marginTop: '24px' }}>
        <DescriptionList col={1} style={{ marginBottom: 16 }}>
          <Description term="权限树">
            {treeMap ? (
              <Tree>
                {this.renderTreeNodes(menu)}
              </Tree>
            ) : getEmptyData()}
          </Description>
        </DescriptionList>
        {this.renderButtonGroup()}
      </Card>
    );
  }

  /* 按钮组 */
  renderButtonGroup() {
    const { goBack, goToEdit, match: { params: { id } } } = this.props;

    return (
      <div style={{ textAlign: 'center' }}>
        <Button onClick={goBack} style={{ marginRight: '24px' }}>返回</Button>
        <Button type="primary" onClick={() => {goToEdit(id)}}>编辑</Button>
      </div>
    );
  }

  render() {
    const { loading } = this.props;

    return (
      <PageHeaderLayout title={title} breadcrumbList={breadcrumbList}>
        <Spin spinning={loading}>
          {this.renderBasicInfo()}
          {this.renderAuthorizationConfiguration()}
        </Spin>
      </PageHeaderLayout>
    );
  }
}
