import React, { PureComponent } from 'react';
import { Form, Input, Card, Button, Select, Spin, List, Modal, message, TreeSelect } from 'antd';
import { Link } from 'dva/router';
import InfiniteScroll from 'react-infinite-scroller';
import Ellipsis from '@/components/Ellipsis';

import PageHeaderLayout from '@/layouts/PageHeaderLayout.js';
import InlineForm from '../../BaseInfo/Company/InlineForm';
import { hasAuthority, AuthSpan } from '@/utils/customAuth';
import styles from './Role.less';
import { OPE, LIST_PAGE_SIZE, getEmptyData, getRootChild, getUnitTypeLabel, preventDefault, transform } from './utils';

const { Option } = Select;
const { TreeNode } = TreeSelect;

@Form.create()
export default class RoleList extends PureComponent {
  state = {
    formData: {},
    unitType: undefined,
  };

  componentDidMount() {
    const { type, fetchUnitTypes, fetchPermissionTree, user: { currentUser: { unitId } } } = this.props;

    const isPublic = type;
    fetchUnitTypes();
    this.getRoleList({ pageNum: 1 });

    if (!isPublic && unitId)
      fetchPermissionTree({ payload: unitId });
  }

  form = null;

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
    if (!values.companyName)
      delete values.companyName;

    this.getRoleList({ ...values, pageNum: 1 }, () => {
      this.setState({
        formData: values,
      });
    });
  };

  /* 重置点击事件 */
  handleReset = () => {
    const { clearPermissionTree } = this.props;
    clearPermissionTree();
    this.getRoleList({ pageNum: 1 }, () => {
      this.setState({
        formData: {},
      });
    });
  };

  getRoleList = (payload, success) => {
    const { type, companyId, fetchList } = this.props;
    const newPayload = {
      ...payload,
      pageSize: LIST_PAGE_SIZE,
      isPublic: type,
    };
    if (companyId)
      newPayload.companyId = companyId;
    fetchList({ payload: newPayload, success});
  };

  /* 显示删除确认提示框 */
  genHandleShowDeleteConfirm = id => e => {
    Modal.confirm({
      title: '你确定要删除这个角色吗?',
      content: '如果你确定要删除这个角色，点击确定按钮',
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        this.handleDelete(id);
      },
    });
  };

  handleDelete = id => {
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
    this.setState({ unitType: id });
    this.form.setFieldsValue({ queryWebPermissionId: undefined, queryAppPermissionId: undefined });
    if (id)
      fetchPermissionTree({ payload: id });
    else
      clearPermissionTree();
  };

  /* 渲染表单 */
  renderForm() {
    const {
      type,
      goToAdd,
      companyId,
      codes: { add: addCode },
      account: { unitTypes },
      role: { permissionTree, appPermissionTree },
      user: {
        currentUser: { permissionCodes },
      },
    } = this.props;
    const { unitType } = this.state;

    const isPublic = type;
    const isAdmin = !companyId;

    const sortedUnitTypes = unitTypes ? Array.from(unitTypes) : [];
    sortedUnitTypes.sort((u1, u2) => u1.sort - u2.sort);
    const unitTypeField = {
      id: 'unitType',
      render: () => {
        return (
          <Select placeholder="请选择单位类型" onChange={this.handleUnitTypeChange} allowClear>
            {sortedUnitTypes.map(({ id, label }, i) => <Option key={id} value={id}>{label}</Option>)}
          </Select>
        );
      },
    };
    const companyNameField = {
      id: 'companyName',
      render() {
        return <Input placeholder="请输入单位名称" />;
      },
      transform,
    };

    /* 表单字段 */
    const fields = [
      {
        id: 'roleName',
        render() {
          return <Input placeholder="请输入角色名称" />;
        },
        transform,
      },
      {
        id: 'queryWebPermissionId',
        render: () => {
          return (
            <TreeSelect
              allowClear
              style={{ width: '100%' }}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              placeholder="请选择WEB权限"
              getPopupContainer={getRootChild}
            >
              {this.renderTreeNodes(permissionTree)}
            </TreeSelect>
          );
        },
        transform,
      },
      {
        id: 'queryAppPermissionId',
        render: () => {
          return (
            <TreeSelect
              allowClear
              style={{ width: '100%' }}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              placeholder="请选择APP权限"
              getPopupContainer={getRootChild}
            >
              {this.renderTreeNodes(appPermissionTree)}
            </TreeSelect>
          );
        },
        transform,
      },
    ];

    if (!isPublic && isAdmin) // 私有角色，管理员
      fields.unshift(companyNameField);

    if (isAdmin)
      fields.unshift(unitTypeField);

    if (+unitType === OPE)
      fields.pop();

    const hasAddAuthority = hasAuthority(addCode, permissionCodes); // 是否有新增权限

    return (
      <Card>
        <InlineForm
          ref={form => { this.form = form; }}
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
      type,
      companyId,
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

    const isPublic = type;
    const isAdmin = !companyId;
    const isAdminAndPrivate = isAdmin && !isPublic;
    const hasDetailAuthority = hasAuthority(detailCode, permissionCodes); // 是否有查看权限
    const hasEditAuthority = hasAuthority(editCode, permissionCodes); // 是否有编辑权限

    return (
      <div className={styles.cardList} style={{ marginTop: '24px' }}>
        <List
          rowKey="id"
          grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
          dataSource={list}
          renderItem={item => {
            const { id, roleName, description, unitType, companyName } = item;
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
                    <AuthSpan
                      code={deleteCode}
                      onClick={this.genHandleShowDeleteConfirm(id)}
                    >
                      删除
                    </AuthSpan>,
                  ]}
                >
                  <div
                    onClick={ hasDetailAuthority ? () => goToDetail(id) : null}
                    style={hasDetailAuthority ? { cursor: 'pointer' } : null}
                  >
                    {isAdminAndPrivate && (
                      <Ellipsis tooltip lines={1} className={isAdminAndPrivate ? styles.ellipsisUpText : styles.ellipsisText}>
                      {companyName ? <span>{companyName}</span> : '暂无所属企业信息'}
                      </Ellipsis>
                    )}
                    <Ellipsis tooltip lines={1} className={isAdminAndPrivate ? styles.ellipsisDownText : styles.ellipsisText}>
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
      user: { currentUser: { unitName } },
    } = this.props;

    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        content={
          <div>
            角色总数：{total}
            {unitName && <p className={styles.companyName}>{unitName}</p>}
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
