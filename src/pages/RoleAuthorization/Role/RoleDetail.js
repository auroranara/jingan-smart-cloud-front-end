import React, { PureComponent } from 'react';
import { Form, Card, Spin, Tree, Button } from 'antd';

import DescriptionList from '@/components/DescriptionList';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import { hasAuthority } from '@/utils/customAuth';
import { COMMON_LIST_URL, PRIVATE_LIST_URL, getEmptyData, sortTree, getSelectedTree } from './utils';

const { Description } = DescriptionList;
const { TreeNode } = Tree;

const TITLE = '角色详情';

@Form.create()
export default class RoleDetail extends PureComponent {
  state = { webSelected: [], appSelected: [] };

  componentDidMount() {
    const {
      fetchUnitTypes,
      fetchDetail,
      fetchPermissionTree,
      match: { params: { id } },
    } = this.props;

    fetchUnitTypes();
    fetchDetail({
      payload: { id },
      success: detail => {
        if (detail && detail.unitType !== undefined && detail.unitType !== null) {
          const { unitType, webPermissionIds, appPermissionIds } = detail;
          fetchPermissionTree({
            payload: unitType,
            callback: (webTree, appTree) => {
              this.setState({
                webSelected: getSelectedTree(webPermissionIds, webTree),
                appSelected: getSelectedTree(appPermissionIds, appTree),
              });
            },
          });
        }
      },
    });
  }

  /* 渲染基础信息 */
  renderBasicInfo() {
    const {
      account: { unitTypes },
      role: { detail: { roleName, description, unitType, companyName } },
    } = this.props;

    const typeMap = unitTypes ? unitTypes.reduce((prev, next) => {
      const { id, label } = next;
      prev[id] = label;
      return prev;
    }, {}) : {};

    return (
      <Card title="基本信息">
        <DescriptionList col={1} style={{ marginBottom: 16 }}>
          <Description term="角色名称">{roleName || getEmptyData()}</Description>
          <Description term="角色类型">{typeMap[unitType] || getEmptyData()}</Description>
          {companyName && <Description term="单位名称">{companyName}</Description>}
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
    const { role: { detail: { unitType } } } = this.props;
    const { webSelected, appSelected } = this.state;
    const tree = sortTree(webSelected);
    const appTree = sortTree(appSelected);
    const isAdmin = +unitType === 3;

    return (
      <Card title="权限配置" style={{ marginTop: '24px' }}>
        <DescriptionList col={2} style={{ marginBottom: 16 }}>
          <Description term="WEB权限树">
            {webSelected.length ? (
              <Tree>
                {this.renderTreeNodes(tree)}
              </Tree>
            ) : getEmptyData()}
          </Description>
          {!isAdmin && (
            <Description term="APP权限树">
              {appSelected.length ? (
                <Tree>
                  {this.renderTreeNodes(appTree)}
                </Tree>
              ) : getEmptyData()}
            </Description>
          )}
        </DescriptionList>
        {this.renderButtonGroup()}
      </Card>
    );
  }

  /* 按钮组 */
  renderButtonGroup() {
    const {
      goBack,
      goToEdit,
      codes: { list: listCode, edit: editCode },
      match: { params: { id } },
      user: { currentUser: { permissionCodes } },
    } = this.props;
    const hasListAuthority = hasAuthority(listCode, permissionCodes); // 是否有列表权限
    const hasEditAuthority = hasAuthority(editCode, permissionCodes); // 是否有编辑权限

    return (
      <div style={{ textAlign: 'center' }}>
        <Button disabled={!hasListAuthority} onClick={goBack} style={{ marginRight: '24px' }}>返回</Button>
        <Button type="primary" disabled={!hasEditAuthority} onClick={() => {goToEdit(id)}}>编辑</Button>
      </div>
    );
  }

  render() {
    const {
      type,
      loading,
    } = this.props;

    const isPublic = type;
    const typeLabel = isPublic ? '公共' : '用户';
    const breadcrumbList = [
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
        href: type ? COMMON_LIST_URL : PRIVATE_LIST_URL,
      },
      {
        title: TITLE,
        name: TITLE,
      },
    ];

    return (
      <PageHeaderLayout
        title={TITLE}
        breadcrumbList={breadcrumbList}
      >
        <Spin spinning={loading}>
          {this.renderBasicInfo()}
          {this.renderAuthorizationConfiguration()}
        </Spin>
      </PageHeaderLayout>
    );
  }
}
