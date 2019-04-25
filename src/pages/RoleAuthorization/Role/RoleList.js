import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Card, Button, Select, Spin, List, Modal, message, TreeSelect } from 'antd';
import { Link } from 'dva/router';
import InfiniteScroll from 'react-infinite-scroller';
import Ellipsis from '@/components/Ellipsis';

import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import InlineForm from '../../BaseInfo/Company/InlineForm';
import { hasAuthority } from '@/utils/customAuth';
import urls from '@/utils/urls';
import codes from '@/utils/codes';
import styles from './Role.less';
import { LIST_PAGE_SIZE, getEmptyData, getRootChild, getUnitTypeLabel, preventDefault, transform } from './utils';

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

@Form.create()
export default class RoleList extends PureComponent {
  state = {
    formData: {},
  };

  componentDidMount() {
    const {
      dispatch,
      fetchList,
      fetchPermissionTree,
    } = this.props;
    dispatch({ type: 'account/fetchOptions' });
    fetchList({
      payload: {
        pageNum: 1,
        pageSize: LIST_PAGE_SIZE,
      },
    });
    fetchPermissionTree();
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
    const { fetchList } = this.props;

    fetchList({
      payload: {
        ...values,
        pageSize: LIST_PAGE_SIZE,
        pageNum: 1,
      },
      success: () => {
        this.setState({
          formData: values,
        });
      },
    });
  };

  /* 重置点击事件 */
  handleReset = () => {
    const { fetchList } = this.props;
    fetchList({
      payload: {
        pageSize: LIST_PAGE_SIZE,
        pageNum: 1,
      },
      success: () => {
        this.setState({
          formData: {},
        });
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
      account: { unitTypes },
      role: { permissionTree },
      user: {
        currentUser: { permissionCodes },
      },
    } = this.props;

    const sortedUnitTypes = unitTypes ? Array.from(unitTypes) : [];
    sortedUnitTypes.sort((u1, u2) => u1.sort - u2.sort);
    /* 表单字段 */
    const fields = [
      {
        id: 'unitType',
        render() {
          return (
            <Select placeholder="请选择单位类型">
              {sortedUnitTypes.map(({ id, label }, i) => <Option key={id} value={id}>{label}</Option>)}
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
    const hasAddAuthority = hasAuthority(addCode, permissionCodes); // 是否有新增权限

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
      account: { unitTypes },
      role: {
        data: { list },
      },
      user: {
        currentUser: { permissionCodes },
      },
      goToDetail,
    } = this.props;
    const hasDetailAuthority = hasAuthority(detailCode, permissionCodes); // 是否有查看权限
    const hasEditAuthority = hasAuthority(editCode, permissionCodes); // 是否有编辑权限

    return (
      <div className={styles.cardList} style={{ marginTop: '24px' }}>
        <List
          rowKey="id"
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
                    <span>删除</span>,
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
