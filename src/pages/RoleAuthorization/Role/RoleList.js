import React, { PureComponent } from 'react';
import { Form, Input, Card, Button, Select, Spin, List, Modal, message, TreeSelect } from 'antd';
import { Link } from 'dva/router';
import InfiniteScroll from 'react-infinite-scroller';
import Ellipsis from '@/components/Ellipsis';

import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import InlineForm from '../../BaseInfo/Company/InlineForm';
import { hasAuthority } from '@/utils/customAuth';
import styles from './Role.less';
import { LIST_PAGE_SIZE, getEmptyData, getRootChild, getUnitTypeLabel, preventDefault, transform } from './utils';

const { Option } = Select;
const { TreeNode } = TreeSelect;

@Form.create()
export default class RoleList extends PureComponent {
  state = {
    formData: {},
  };

  componentDidMount() {
    const {
      type,
      fetchUnitTypes,
      fetchList,
    } = this.props;

    fetchUnitTypes();
    fetchList({ payload: { pageNum: 1, pageSize: LIST_PAGE_SIZE, isPublic: type } });
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

  handleUnitTypeChange = id => {
    const { fetchPermissionTree, clearPermissionTree } = this.props;
    if (id)
      fetchPermissionTree({ payload: id });
    else
      clearPermissionTree();
  };

  /* 渲染表单 */
  renderForm() {
    const {
      goToAdd,
      codes: { add: addCode },
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
        render: () => {
          return (
            <Select placeholder="请选择单位类型" onChange={this.handleUnitTypeChange} allowClear>
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
              allowClear
              style={{ width: '100%' }}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              placeholder="请选择权限"
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

  handleDelete = id => e => {
    const { remove } = this.props;
    remove({
      payload: { id },
      callback: (code, msg) => {
        if (code === 200)
          message.success('删除成功');
        else
          message.error(msg);
      },
    });
  };

  /* 渲染列表 */
  renderList() {
    const {
      codes: { detail: detailCode, edit: editCode, delete: deleteCode },
      account: { unitTypes },
      role: {
        data: { list },
      },
      user: {
        currentUser: { permissionCodes },
      },
      goToDetail,
      urls: { detailUrl, editUrl },
    } = this.props;
    const hasDetailAuthority = hasAuthority(detailCode, permissionCodes); // 是否有查看权限
    const hasEditAuthority = hasAuthority(editCode, permissionCodes); // 是否有编辑权限
    const hasDeleteAuthority = hasAuthority(deleteCode, permissionCodes); // 是否有编辑权限

    return (
      <div className={styles.cardList} style={{ marginTop: '24px' }}>
        <List
          rowKey="id"
          grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
          dataSource={list}
          renderItem={item => {
            const { id, roleName, description, unitType } = item;
            return (
              <List.Item key={id}>
                <Card
                  title={roleName}
                  extra={getUnitTypeLabel(unitType, unitTypes)}
                  className={styles.card}
                  actions={[
                    <Link
                      to={`${detailUrl}/${id}`}
                      onClick={hasDetailAuthority ? null : preventDefault}
                      disabled={!hasDetailAuthority}
                    >
                      查看
                    </Link>,
                    <Link
                      to={`${editUrl}/${id}`}
                      onClick={hasEditAuthority ? null : preventDefault}
                      disabled={!hasEditAuthority}
                    >
                      编辑
                    </Link>,
                    <span
                      onClick={hasDeleteAuthority ? null : this.genHandleDelete(id)}
                    >
                      删除
                    </span>,
                  ]}
                >
                  <div
                    onClick={ hasDetailAuthority ? () => goToDetail(id) : null}
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
      title,
      breadcrumbList,
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
