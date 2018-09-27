import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Card, Button, Spin, List, Modal, message, TreeSelect } from 'antd';
import { Link, routerRedux } from 'dva/router';
import InfiniteScroll from 'react-infinite-scroller';
import Ellipsis from '@/components/Ellipsis';

import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import InlineForm from '../../BaseInfo/Company/InlineForm';
import { hasAuthority } from '@/utils/customAuth';
import urls from '@/utils/urls';
import codes from '@/utils/codes';

import styles from './Role.less';

const { TreeNode } = TreeSelect;

// 标题
const title = '角色管理';
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
  role: { detail: detailCode, edit: editCode, add: addCode },
} = codes;
/* 去除两边空格 */
const transform = value => value.trim();
/* 获取无数据 */
const getEmptyData = () => {
  return <span style={{ color: 'rgba(0,0,0,0.45)' }}>暂无数据</span>;
};
/* 设置相对定位 */
const getRootChild = () => document.querySelector('#root>div');
// 阻止默认行为
const preventDefault = e => {
  e.preventDefault();
};

@connect(
  ({ role, user, loading }) => ({
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
    // 获取权限树
    fetchPermissionTree() {
      dispatch({
        type: 'role/fetchPermissionTree',
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
    isInit: false,
  };

  componentDidMount() {
    const {
      fetchList,
      goToException,
      fetchPermissionTree,
      role: {
        permissionTree,
        data: {
          pagination: { pageSize },
        },
      },
    } = this.props;
    // 获取列表
    fetchList({
      payload: {
        pageNum: 1,
        pageSize,
      },
      success: () => {
        this.setState({
          isInit: true,
        });
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
        // message.success('查询成功', 1);
        this.setState({
          formData: values,
        });
      },
      error: () => {
        // message.success('查询失败', 1);
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
        // message.success('重置成功', 1);
        this.setState({
          formData: {},
        });
      },
      error: () => {
        // message.success('重置失败', 1);
        goToException();
      },
    });
  };

  /* 显示删除确认提示框 */
  handleShowDeleteConfirm = id => {
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
          error: () => {
            message.error('删除失败，请联系管理人员！');
          },
        });
      },
    });
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
      role: { permissionTree },
      user: {
        currentUser: { permissionCodes },
      },
    } = this.props;
    /* 表单字段 */
    const fields = [
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
              placeholder="请选择权限"
              allowClear
              getPopupContainer={getRootChild}
            >
              {this.renderTreeNodes(permissionTree)}
            </TreeSelect>
          );
        },
        transform,
      },
    ];
    // 是否有新增权限
    const hasAddAuthority = hasAuthority(addCode, permissionCodes);

    return (
      <Card>
        <InlineForm
          fields={fields}
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
            const { id, name, description } = item;
            return (
              <List.Item key={id}>
                <Card
                  title={name}
                  className={styles.card}
                  actions={[
                    <Link
                      to={detailUrl + id}
                      onClick={hasDetailAuthority ? null : preventDefault}
                      disabled={!hasDetailAuthority}
                    >
                      查看
                    </Link>,
                    <Link
                      to={editUrl + id}
                      onClick={hasEditAuthority ? null : preventDefault}
                      disabled={!hasEditAuthority}
                    >
                      编辑
                    </Link>,
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
    const { isInit } = this.state;

    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        content={
          <div>
            角色总数：
            {total}{' '}
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
