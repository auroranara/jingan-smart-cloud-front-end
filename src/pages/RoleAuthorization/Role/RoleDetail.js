import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Card, Spin, Tree, Button } from 'antd';
import { routerRedux } from 'dva/router';
import DescriptionList from '@/components/DescriptionList';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import { hasAuthority } from '@/utils/customAuth';
import urls from '@/utils/urls';
import codes from '@/utils/codes';

const { Description } = DescriptionList;
const { TreeNode } = Tree;

// 标题
const title = '角色详情';
const TYPES = { 1: '企业', 2: '政府', 3: '维保' };
// 获取链接地址
const { role: { list: backUrl, edit: editUrl } } = urls;
// 获取code
const { role: { list: listCode, edit: editCode } } = codes;
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
    const { role: { detail: { sysRole: { name, description, type } } } } = this.props;

    return (
      <Card title="基本信息">
        <DescriptionList col={1} style={{ marginBottom: 16 }}>
          <Description term="角色名称">{name || getEmptyData()}</Description>
          <Description term="角色类型">{type ? TYPES[type] : getEmptyData()}</Description>
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
    const appMenu = treeMap && Array.isArray(treeMap.appMenu) ? treeMap.appMenu : [];
    const tree = sortTree(menu);
    const appTree = sortTree(appMenu);

    return (
      <Card title="权限配置" style={{ marginTop: '24px' }}>
        <DescriptionList col={2} style={{ marginBottom: 16 }}>
          <Description term="WEB权限树">
            {treeMap ? (
              <Tree>
                {this.renderTreeNodes(tree)}
              </Tree>
            ) : getEmptyData()}
          </Description>
          <Description term="APP权限树">
            {treeMap ? (
              <Tree>
                {this.renderTreeNodes(appTree)}
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
    const { goBack, goToEdit, match: { params: { id } }, user: { currentUser: { permissionCodes } } } = this.props;
    // 是否有列表权限
    const hasListAuthority = hasAuthority(listCode, permissionCodes);
    // 是否有编辑权限
    const hasEditAuthority = hasAuthority(editCode, permissionCodes);

    return (
      <div style={{ textAlign: 'center' }}>
        <Button disabled={!hasListAuthority} onClick={goBack} style={{ marginRight: '24px' }}>返回</Button>
        <Button type="primary" disabled={!hasEditAuthority} onClick={() => {goToEdit(id)}}>编辑</Button>
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
