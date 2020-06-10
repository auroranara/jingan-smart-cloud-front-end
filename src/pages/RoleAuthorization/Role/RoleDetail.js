import React, { PureComponent } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Card, Spin, Table, Tabs, Tree, Button } from 'antd';

import DescriptionList from '@/components/DescriptionList';
import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import { hasAuthority } from '@/utils/customAuth';
import styles from './Role.less';
import { COMMON_LIST_URL, PRIVATE_LIST_URL, getEmptyData, sortTree, getSelectedTree, removeEmptyChildren } from './utils';

const { Description } = DescriptionList;
const { TreeNode } = Tree;
const { TabPane } = Tabs;

const TITLE = '角色详情';

@Form.create()
export default class RoleDetail extends PureComponent {
  state = { webSelected: [], appSelected: [], msgList: [] };

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
          const { unitType, webPermissionIds, appPermissionIds, messagePermissionList } = detail;
          this.setState({ msgList: removeEmptyChildren(messagePermissionList) });
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

  msgs={};

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
          <Description term="角色单位类型">{typeMap[unitType] || getEmptyData()}</Description>
          {companyName && <Description term="角色所属单位">{companyName}</Description>}
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
      <TabPane tab="权限配置" key="1" className={styles.tabPane2}>
      {/* <Card title="权限配置" style={{ marginTop: '24px' }}> */}
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
          return txt ? txt.split('\n').map((t, i) => <p key={i} className={styles.example}>{t}</p>) : txt;
        },
      },
      { title: '推荐接收人', dataIndex: 'accepter', key: 'accepter' },
    ];

    return (
      <TabPane tab="消息订阅配置" key="2" className={styles.tabPane1}>
        <Table
          rowKey="id"
          className={styles.table}
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
        {/* <Button type="primary" disabled={!hasEditAuthority} onClick={() => {goToEdit(id)}}>编辑</Button> */}
        <Button disabled={!hasListAuthority} onClick={goBack}>返回</Button>
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
          <Tabs className={styles.tabs}>
            {this.renderAuthorizationConfiguration()}
            {this.renderMessageSubscription()}
          </Tabs>
        </Spin>
      </PageHeaderLayout>
    );
  }
}
