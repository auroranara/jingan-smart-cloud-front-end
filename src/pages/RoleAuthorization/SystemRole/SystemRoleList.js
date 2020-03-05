import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Input, Card, Button, Select, Spin, List, Modal, message, TreeSelect } from 'antd';
import { Link, routerRedux } from 'dva/router';
import InfiniteScroll from 'react-infinite-scroller';
import Ellipsis from '@/components/Ellipsis';

import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import InlineForm from '../../BaseInfo/Company/InlineForm';
import { hasAuthority, AuthSpan } from '@/utils/customAuth';
import urls from '@/utils/urls';
import codes from '@/utils/codes';
import styles from '../Role/Role.less';
import {
  OPE,
  getEmptyData,
  getRootChild,
  getUnitTypeLabel,
  preventDefault,
  transform,
} from '../Role/utils';

const { Option } = Select;
const { TreeNode } = TreeSelect;

const title = '系统角色';
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
    title,
    name: title,
  },
];
// 获取链接地址
const {
  role: { detail: detailUrl, edit: editUrl, add: addUrl },
} = urls;
// 获取code
const {
  role: { detail: detailCode, edit: editCode, add: addCode, delete: deleteCode },
} = codes;

@connect(
  ({ account, role, user, loading }) => ({
    account,
    role,
    user,
    loading: loading.models.role,
  }),
  dispatch => ({
    /* 获取角色列表 */
    fetchList(action) {
      dispatch({
        type: 'role/fetchList',
        ...action,
      });
    },
    /* 追加维保合同列表 */
    appendList(action) {
      dispatch({
        type: 'role/appendList',
        ...action,
      });
    },
    /* 删除 */
    remove(action) {
      dispatch({
        type: 'role/remove',
        ...action,
      });
    },
    // 获取WEB权限树
    fetchPermissionTree() {
      dispatch({
        type: 'role/fetchPermissionTree',
      });
    },
    // 获取APP权限树
    fetchAppPermissionTree() {
      dispatch({
        type: 'role/fetchAppPermissionTree',
      });
    },
    /* 跳转到详情页面 */
    goToDetail(id) {
      dispatch(routerRedux.push(detailUrl + id));
    },
    /* 跳转到新增页面 */
    goToAdd() {
      dispatch(routerRedux.push(addUrl));
    },
    /* 跳转到编辑页面 */
    goToEdit() {
      dispatch(routerRedux.push(editUrl));
    },
    // 异常
    goToException() {
      dispatch(routerRedux.push('/exception/500'));
    },
    dispatch,
  })
)
@Form.create()
export default class RoleList extends PureComponent {
  state = {
    formData: {},
    unitType: undefined,
  };

  componentDidMount() {
    const {
      dispatch,
      fetchList,
      goToException,
      fetchPermissionTree,
      fetchAppPermissionTree,
      role: {
        data: {
          pagination: { pageSize },
        },
      },
    } = this.props;
    dispatch({ type: 'account/fetchOptions' });
    // 获取列表
    fetchList({
      payload: {
        pageNum: 1,
        pageSize,
      },
      error: () => {
        goToException();
      },
    });
    // 获取权限树
    fetchPermissionTree();
    fetchAppPermissionTree();
  }

  /* 滚动加载 */
  handleLoadMore = () => {
    const {
      role: { isLast },
    } = this.props;
    if (isLast) {
      return;
    }
    const {
      appendList,
      role: {
        data: {
          pagination: { pageSize, pageNum },
        },
      },
    } = this.props;
    const { formData } = this.state;
    // 请求数据
    appendList({
      payload: {
        pageSize,
        pageNum: pageNum + 1,
        ...formData,
      },
    });
  };

  /* 查询点击事件 */
  handleSearch = values => {
    const {
      fetchList,
      goToException,
      role: {
        data: {
          pagination: { pageSize },
        },
      },
    } = this.props;

    fetchList({
      payload: {
        ...values,
        pageSize,
        pageNum: 1,
      },
      success: () => {
        this.setState({
          formData: values,
        });
      },
      error: () => {
        goToException();
      },
    });
  };

  /* 重置点击事件 */
  handleReset = () => {
    const {
      fetchList,
      goToException,
      role: {
        data: {
          pagination: { pageSize },
        },
      },
    } = this.props;
    fetchList({
      payload: {
        pageSize,
        pageNum: 1,
      },
      success: () => {
        this.setState({
          formData: {},
        });
      },
      error: () => {
        goToException();
      },
    });
  };

  /* 显示删除确认提示框 */
  genHandleShowDeleteConfirm = id => e => {
    const { remove } = this.props;
    Modal.confirm({
      title: '你确定要删除这个角色吗?',
      content: '如果你确定要删除这个角色，点击确定按钮',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        remove({
          payload: {
            id,
          },
          success: () => {
            message.success('删除成功！');
          },
          error: msg => {
            message.error(`删除失败，${msg}！`);
          },
        });
      },
    });
  };

  handleUnitTypeChange = id => {
    console.log(id);
    this.setState({ unitType: +id });
  };

  /* 渲染树节点 */
  renderTreeNodes(data) {
    return data.map(item => {
      const { id, showZname: title, childMenus: children } = item;
      if (children) {
        return (
          <TreeNode title={title} key={id} value={id}>
            {this.renderTreeNodes(children)}
          </TreeNode>
        );
      }
      return <TreeNode title={title} key={id} value={id} />;
    });
  }

  /* 渲染表单 */
  renderForm() {
    const {
      goToAdd,
      account: { unitTypes },
      role: { permissionTree, appPermissionTree },
      user: {
        currentUser: { permissionCodes },
      },
    } = this.props;
    const { unitType } = this.state;

    const sortedUnitTypes = unitTypes ? Array.from(unitTypes) : [];
    sortedUnitTypes.sort((u1, u2) => u1.sort - u2.sort);
    /* 表单字段 */
    const fields = [
      {
        id: 'unitType',
        render: () => {
          return (
            <Select
              placeholder="请选择角色单位类型"
              onChange={this.handleUnitTypeChange}
              allowClear
            >
              {sortedUnitTypes.map(({ id, label }, i) => (
                <Option key={id} value={id}>
                  {label}
                </Option>
              ))}
            </Select>
          );
        },
      },
      {
        id: 'name',
        render() {
          return <Input placeholder="请输入角色名称" />;
        },
        transform,
      },
      {
        id: 'permissionId',
        render: () => {
          return (
            <TreeSelect
              style={{ width: '100%' }}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              placeholder="请选择WEB权限"
              allowClear
              getPopupContainer={getRootChild}
            >
              {this.renderTreeNodes(permissionTree)}
            </TreeSelect>
          );
        },
        transform,
      },
      {
        id: 'appPermissionId',
        render: () => {
          return (
            <TreeSelect
              style={{ width: '100%' }}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              placeholder="请选择APP权限"
              allowClear
              getPopupContainer={getRootChild}
            >
              {this.renderTreeNodes(appPermissionTree)}
            </TreeSelect>
          );
        },
        transform,
      },
    ];

    if (unitType === OPE) fields.pop();
    // 是否有新增权限
    const hasAddAuthority = hasAuthority(addCode, permissionCodes);

    return (
      <Card>
        <InlineForm
          fields={fields}
          ref={form => (this.form = form)}
          gutter={{ lg: 48, md: 24 }}
          action={
            <Button type="primary" onClick={goToAdd} disabled={!hasAddAuthority}>
              新增
            </Button>
          }
          onSearch={this.handleSearch}
          onReset={this.handleReset}
        />
      </Card>
    );
  }

  /* 渲染列表 */
  renderList() {
    const {
      account: { unitTypes },
      role: {
        data: { list },
      },
      user: {
        currentUser: { permissionCodes },
      },
      goToDetail,
    } = this.props;
    // 是否有查看权限
    const hasDetailAuthority = hasAuthority(detailCode, permissionCodes);
    // 是否有编辑权限
    const hasEditAuthority = hasAuthority(editCode, permissionCodes);

    return (
      <div className={styles.cardList} style={{ marginTop: '24px' }}>
        <List
          rowKey="id"
          // loading={loading}
          grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
          dataSource={list}
          renderItem={item => {
            const { id, name, description, unitType } = item;
            return (
              <List.Item key={id}>
                <Card
                  title={name}
                  extra={getUnitTypeLabel(unitType, unitTypes)}
                  className={styles.card}
                  actions={[
                    <Link
                      to={detailUrl + id}
                      onClick={hasDetailAuthority ? null : preventDefault}
                      disabled={!hasDetailAuthority}
                      target="_blank"
                    >
                      查看
                    </Link>,
                    <Link
                      to={editUrl + id}
                      onClick={hasEditAuthority ? null : preventDefault}
                      disabled={!hasEditAuthority}
                      target="_blank"
                    >
                      编辑
                    </Link>,
                    <AuthSpan code={deleteCode} onClick={this.genHandleShowDeleteConfirm(id)}>
                      删除
                    </AuthSpan>,
                  ]}
                  // extra={
                  //   <Button
                  //     onClick={() => {
                  //       this.handleShowDeleteConfirm(id);
                  //     }}
                  //     shape="circle"
                  //     style={{ border: 'none', fontSize: '20px' }}
                  //   >
                  //     <Icon type="close" />
                  //   </Button>
                  // }
                >
                  <div
                    onClick={
                      hasDetailAuthority
                        ? () => {
                            goToDetail(id);
                          }
                        : null
                    }
                    style={hasDetailAuthority ? { cursor: 'pointer' } : null}
                  >
                    <Ellipsis tooltip lines={1} className={styles.ellipsisText}>
                      {description ? <span>{description}</span> : getEmptyData()}
                    </Ellipsis>
                  </div>
                </Card>
              </List.Item>
            );
          }}
        />
      </div>
    );
  }

  render() {
    const {
      loading,
      role: {
        isLast,
        data: {
          pagination: { total },
        },
      },
    } = this.props;

    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        content={
          <div>
            <p className={styles.desc}>
              角色总数：
              {total}
            </p>
            <p className={styles.desc}>
              系统角色是用来限定管理员或运营配置公共或用户(私有)角色时对应类型的权限树的范围，只有系统管理员才拥有管理系统角色的权限
            </p>
          </div>
        }
      >
        {this.renderForm()}
        <InfiniteScroll
          initialLoad={false}
          pageStart={0}
          loadMore={() => {
            // 防止多次加载
            !loading && this.handleLoadMore();
          }}
          hasMore={!isLast}
          loader={
            <div className="loader" key={0}>
              {loading && (
                <div style={{ paddingTop: '50px', textAlign: 'center' }}>
                  <Spin />
                </div>
              )}
            </div>
          }
        >
          {this.renderList()}
        </InfiniteScroll>
      </PageHeaderLayout>
    );
  }
}
