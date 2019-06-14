import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Card, Spin, Table, Tabs, Tree, Button } from 'antd';
import { routerRedux } from 'dva/router';

import DescriptionList from '@/components/DescriptionList';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import { hasAuthority } from '@/utils/customAuth';
import urls from '@/utils/urls';
import codes from '@/utils/codes';
import styles1 from '../Role/Role.less';
import { getEmptyData, sortTree, getSelectedTree } from '../Role/utils';

const { Description } = DescriptionList;
const { TreeNode } = Tree;
const { TabPane } = Tabs;

// 标题
const title = '角色详情';
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
    title: '角色权限',
    name: '角色权限',
  },
  {
    title: '系统角色',
    name: '系统角色',
    href: backUrl,
  },
  {
    title,
    name: title,
  },
];

@connect(({ account, role, user, loading }) => ({
  account,
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
  // 获取完整消息树
  fetchMsgTree(action) {
    dispatch({ type: 'role/fetchMsgTree', ...action });
  },
  // 返回
  goBack() {
    dispatch(routerRedux.push(backUrl));
  },
  /* 跳转到编辑页面 */
  goToEdit(id) {
    dispatch(routerRedux.push(editUrl + id));
  },
  dispatch,
}))
@Form.create()
export default class RoleDetail extends PureComponent {
  state={ msgList: [] };

  componentDidMount() {
    const {
      dispatch,
      fetchDetail,
      fetchPermissionTree,
      fetchMsgTree,
      role: { permissionTree },
      match: { params: { id } },
    } = this.props;
    dispatch({ type: 'account/fetchOptions' });
    // 根据id获取详情
    fetchDetail({
      payload: {
        id,
      },
      success: detail => {
        const { messagePermissions } = detail || {};
        const msgs = messagePermissions ? messagePermissions.split(',').filter(id => id) : [];
        fetchMsgTree({
          callback: list => this.setState({ msgList: getSelectedTree(msgs, list, 'children') }),
        });
      },
    });
    // 获取权限树
    if (permissionTree.length === 0) {
      fetchPermissionTree();
    }
  }

  /* 渲染基础信息 */
  renderBasicInfo() {
    const {
      account: { unitTypes },
      role: { detail: { sysRole: { name, description, unitType } } },
    } = this.props;
    const typeMap = unitTypes ? unitTypes.reduce((prev, next) => {
      const { id, label } = next;
      prev[id] = label;
      return prev;
    }, {}) : {};

    return (
      <Card title="基本信息">
        <DescriptionList col={1} style={{ marginBottom: 16 }}>
          <Description term="角色名称">{name || getEmptyData()}</Description>
          <Description term="角色单位类型">{typeMap[unitType] || getEmptyData()}</Description>
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
    const { role: { detail: { treeMap, appTreeMap, sysRole: { unitType } } } } = this.props;
    const menu = treeMap ? (treeMap.menu || []) : [];
    const tree = sortTree(menu);
    const appMenu = appTreeMap && Array.isArray(appTreeMap.menu) ? appTreeMap.menu : [];
    const appTree = sortTree(appMenu);
    const isAdmin = +unitType === 3;

    return (
      <TabPane tab="权限配置" key="1" className={styles1.tabPane2}>
      {/* <Card title="权限配置" style={{ marginTop: '24px' }}> */}
        <DescriptionList col={2} style={{ marginBottom: 16 }}>
          <Description term="WEB权限树">
            {treeMap ? (
              <Tree>
                {this.renderTreeNodes(tree)}
              </Tree>
            ) : getEmptyData()}
          </Description>
          {!isAdmin && (
            <Description term="APP权限树">
              {treeMap ? (
                <Tree>
                  {this.renderTreeNodes(appTree)}
                </Tree>
              ) : getEmptyData()}
            </Description>
          )}
        </DescriptionList>
        {this.renderButtonGroup()}
      {/* </Card> */}
      </TabPane>
    );
  }

  renderMessageSubscription() {
    const { msgList } = this.state;
    const columns = [
      { title: '消息类别', dataIndex: 'name', key: 'name' },
      { title: '消息示例', dataIndex: 'example', key: 'example',
        render: txt => {
          return txt ? txt.split('\n').map((t, i) => <p key={i} className={styles1.example}>{t}</p>) : txt;
        },
      },
      { title: '推荐接收人', dataIndex: 'accepter', key: 'accepter' },
    ];

    return (
      <TabPane tab="消息订阅配置" key="2" className={styles1.tabPane1}>
        <Table
          rowKey="id"
          className={styles1.table}
          columns={columns}
          dataSource={msgList}
          pagination={false}
        />
        {this.renderButtonGroup()}
      </TabPane>
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
          <Tabs className={styles1.tabs}>
            {this.renderAuthorizationConfiguration()}
            {this.renderMessageSubscription()}
          </Tabs>
        </Spin>
      </PageHeaderLayout>
    );
  }
}
