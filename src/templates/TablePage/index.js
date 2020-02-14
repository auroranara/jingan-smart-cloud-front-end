import React, { Component } from 'react';
import { Card, Table, message, Button, Empty, Spin, Popconfirm } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import CustomForm from '@/jingan-components/CustomForm';
import { getPageSize, setPageSize } from '@/utils/utils';
import classNames from 'classnames';
import router from 'umi/router';
import { connect } from 'dva';
import { kebabCase } from 'lodash';
import locales from '@/locales/zh-CN';
import styles from './index.less';

const GET_METHOD_NAME = (targetName, result, after = 2) => {
  return result[targetName]
    ? GET_METHOD_NAME(`${targetName.replace(/\d*$/, '')}${after}`, result, after + 1)
    : targetName;
};

/**
 * 表格页
 */
@connect(
  (
    state,
    {
      route: { name, code },
      match: {
        params: { unitId: unitId1 },
      },
      otherOperation,
      mapper,
      breadcrumbList: b,
    }
  ) => {
    const { namespace: n, list: l, getList: gl, remove: r, exportList: el, loading } = mapper || {};
    let breadcrumbList;
    const namespace = n || code.replace(/.*\.(.*)\..*/, '$1');
    const {
      user: {
        currentUser: { unitType, unitId: unitId2, permissionCodes },
      },
      [namespace]: { [l || 'list']: list },
      loading: {
        effects: {
          [`${namespace}/${gl || 'getList'}`]: loading1,
          [`${namespace}/${r || 'remove'}`]: loading2,
          [`${namespace}/${el || 'exportList'}`]: loading3,
        },
      },
    } = state;
    const loading4 =
      loading &&
      (Array.isArray(loading) ? loading : [loading]).reduce((result, item) => {
        return result || state.loading.effects[`${namespace}/${item}`];
      }, false);
    const isUnit = +unitType === 4;
    const unitId = isUnit ? unitId2 : unitId1;
    if (b) {
      breadcrumbList =
        typeof b === 'function' ? b({ isUnit, unitId, title: locales[`menu.${code}`] }) : b;
    } else {
      breadcrumbList = code
        .split('.')
        .slice(0, -1)
        .reduce(
          (result, item) => {
            const key = `${result.key}.${item}`;
            const title = locales[key];
            result.key = key;
            result.breadcrumbList.push({
              title,
              name: title,
            });
            return result;
          },
          {
            breadcrumbList: [{ title: '首页', name: '首页', href: '/' }],
            key: 'menu',
          }
        ).breadcrumbList;
    }
    return {
      unitId,
      list,
      loading: loading1 || loading2 || loading3 || loading4,
      breadcrumbList,
      hasAddAuthority: permissionCodes.includes(code.replace(name, 'add')),
      hasEditAuthority: permissionCodes.includes(code.replace(name, 'edit')),
      hasDetailAuthority: permissionCodes.includes(code.replace(name, 'detail')),
      hasDeleteAuthority: permissionCodes.includes(code.replace(name, 'delete')),
      hasExportAuthority: permissionCodes.includes(code.replace(name, 'export')),
      ...(otherOperation &&
        otherOperation.reduce((result, { code: codeName }) => {
          return {
            ...result,
            [`has${codeName[0].toUpperCase()}${codeName.slice(
              1
            )}Authority`]: permissionCodes.includes(code.replace(name, codeName)),
          };
        }, {})),
    };
  },
  (
    dispatch,
    { route: { name, code }, location: { pathname }, error = true, otherOperation, mapper }
  ) => {
    const { namespace: n, getList: gl, remove: r, exportList: el } = mapper || {};
    const namespace = n || code.replace(/.*\.(.*)\..*/, '$1');
    return {
      getList(payload, callback) {
        dispatch({
          type: `${namespace}/${gl || 'getList'}`,
          payload,
          callback: (success, data) => {
            if (!success && error) {
              message.error('获取列表数据失败，请稍后重试或联系管理人员！');
            }
            callback && callback(success, data);
          },
        });
      },
      remove(payload, callback) {
        dispatch({
          type: `${namespace}/${r || 'remove'}`,
          payload,
          callback: (success, data) => {
            if (success) {
              message.success('删除成功');
            } else if (error) {
              message.error('删除失败，请稍后重试或联系管理人员！');
            }
            callback && callback(success, data);
          },
        });
      },
      exportList(payload, callback) {
        dispatch({
          type: `${namespace}/${el || 'exportList'}`,
          payload,
          callback: (success, data) => {
            if (!success && error) {
              message.error('导出失败，请稍后重试或联系管理人员！');
            }
            callback && callback(success, data);
          },
        });
      },
      goToAdd() {
        router.push(pathname.replace(new RegExp(`${name}.*`), 'add'));
      },
      goToEdit(data) {
        router.push(pathname.replace(new RegExp(`${name}.*`), `edit/${(data && data.id) || data}`));
      },
      goToDetail(data) {
        router.push(
          pathname.replace(new RegExp(`${name}.*`), `detail/${(data && data.id) || data}`)
        );
      },
      ...(otherOperation &&
        otherOperation.reduce((result, { code: codeName, onClick }) => {
          return onClick
            ? result
            : {
                ...result,
                [`goTo${codeName[0].toUpperCase()}${codeName.slice(1)}`](data) {
                  const id = (data && data.id) || data;
                  router.push(
                    pathname.replace(
                      new RegExp(`${name}.*`),
                      `${kebabCase(codeName)}${id ? `/${id}` : ''}`
                    )
                  );
                },
              };
        }, {})),
    };
  },
  null,
  {
    withRef: true,
  }
)
export default class TablePage extends Component {
  state = {
    selectedRowKeys: [],
  };

  // 除了用来保存控件值以外，还可以用来初始化
  prevValues = null;

  componentDidMount() {
    this.handleSearchButtonClick();
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.list !== this.props.list ||
      nextProps.loading !== this.props.loading ||
      nextProps.children !== this.props.children ||
      nextState !== this.state
    );
  }

  // 设置form的引用
  setFormReference = form => {
    this.form = form;
  };

  // 刷新列表
  reload = () => {
    const {
      list: { pagination: { pageNum = 1, pageSize = getPageSize() } = {} } = {},
      getList,
      transform,
      withUnitId,
      unitId,
    } = this.props;
    const payload = withUnitId ? { unitId, ...this.prevValues } : this.prevValues;
    getList({
      ...(transform && (this.prevValues || withUnitId) ? transform(payload) : payload),
      pageNum,
      pageSize,
    });
    this.form &&
      (this.prevValues ? this.form.setFieldsValue(this.prevValues) : this.form.resetFields());
  };

  // 查询按钮点击事件
  handleSearchButtonClick = values => {
    const {
      list: { pagination: { pageSize = getPageSize() } = {} } = {},
      getList,
      transform,
      withUnitId,
      unitId,
    } = this.props;
    const payload = withUnitId ? { unitId, ...values } : values;
    this.prevValues = values;
    getList({
      ...(transform ? transform(payload) : payload),
      pageNum: 1,
      pageSize,
    });
  };

  // 重置按钮点击事件
  handleResetButtonClick = values => {
    this.handleSearchButtonClick(values);
    this.setState({
      selectedRowKeys: [],
    });
  };

  // 导出按钮点击事件
  handleExportButtonClick = () => {
    const { exportList } = this.props;
    const { selectedRowKeys } = this.state;
    exportList({
      ids: selectedRowKeys.join(','),
    });
    this.setState({
      selectedRowKeys: [],
    });
  };

  // 删除按钮点击事件
  handleDeleteButtonClick = id => {
    const { remove } = this.props;
    remove({ id }, success => {
      if (success) {
        this.reload();
      }
    });
  };

  // 表格的change事件
  handleTableChange = ({ current, pageSize }) => {
    const {
      list: { pagination: { pageSize: prevPageSize = getPageSize() } = {} } = {},
      getList,
      transform,
      withUnitId,
      unitId,
    } = this.props;
    const payload = withUnitId ? { unitId, ...this.prevValues } : this.prevValues;
    getList({
      ...(transform && (this.prevValues || withUnitId) ? transform(payload) : payload),
      pageNum: prevPageSize !== pageSize ? 1 : current,
      pageSize,
    });
    this.form &&
      (this.prevValues ? this.form.setFieldsValue(this.prevValues) : this.form.resetFields());
    prevPageSize !== pageSize && setPageSize(pageSize);
  };

  // SelectedRowKeys的change事件
  handleSelectedRowKeysChange = selectedRowKeys => {
    this.setState({
      selectedRowKeys,
    });
  };

  renderAddButton = () => {
    const { hasAddAuthority, goToAdd } = this.props;
    return (
      <Button type="primary" onClick={goToAdd} disabled={!hasAddAuthority}>
        新增
      </Button>
    );
  };

  renderExportButton = () => {
    const { hasExportAuthority } = this.props;
    const { selectedRowKeys } = this.state;
    return (
      <Button
        type="primary"
        onClick={this.handleExportButtonClick}
        disabled={!hasExportAuthority || !selectedRowKeys || !selectedRowKeys.length}
      >
        导出
      </Button>
    );
  };

  renderForm() {
    const { fields, action, unitId } = this.props;
    const Fields = typeof fields === 'function' ? fields({ unitId }) : fields;
    const Action =
      typeof action === 'function'
        ? action({
            renderAddButton: this.renderAddButton,
            renderExportButton: this.renderExportButton,
          })
        : action;

    return (
      <Card className={styles.card}>
        <CustomForm
          fields={Fields}
          onSearch={this.handleSearchButtonClick}
          onReset={this.handleResetButtonClick}
          action={Action}
          ref={this.setFormReference}
        />
      </Card>
    );
  }

  renderDetailButton = data => {
    const { hasDetailAuthority, goToDetail } = this.props;
    return (
      <span
        className={classNames(styles.operation, !hasDetailAuthority && styles.disabled)}
        onClick={hasDetailAuthority ? () => goToDetail(data) : undefined}
      >
        查看
      </span>
    );
  };

  renderEditButton = data => {
    const { hasEditAuthority, goToEdit } = this.props;
    return (
      <span
        className={classNames(styles.operation, !hasEditAuthority && styles.disabled)}
        onClick={hasEditAuthority ? () => goToEdit(data) : undefined}
      >
        编辑
      </span>
    );
  };

  renderDeleteButton = data => {
    const { hasDeleteAuthority } = this.props;
    return hasDeleteAuthority ? (
      <Popconfirm
        title="你确定要删除吗?"
        onConfirm={() => this.handleDeleteButtonClick((data && data.id) || data)}
      >
        <span className={styles.operation}>删除</span>
      </Popconfirm>
    ) : (
      <span className={classNames(styles.operation, styles.disabled)}>删除</span>
    );
  };

  renderTable() {
    const {
      hasExportAuthority,
      list: { list = [], pagination: { total, pageNum, pageSize } = {} } = {},
      columns,
      loading = false,
      unitId,
      otherOperation,
      showTotal = true,
    } = this.props;
    const { selectedRowKeys } = this.state;

    const Columns =
      typeof columns === 'function'
        ? columns({
            unitId,
            list,
            ...(otherOperation || []).reduce(
              (result, { code, name, onClick, disabled }) => {
                const upperCode = `${code[0].toUpperCase()}${code.slice(1)}`;
                const hasAuthority = this.props[`has${upperCode}Authority`];
                const methodName = GET_METHOD_NAME(`render${upperCode}Button`, result);
                return {
                  ...result,
                  [methodName]: id => {
                    const enabled =
                      hasAuthority && !(typeof disabled === 'function' ? disabled(id) : disabled);
                    return (
                      <span
                        className={classNames(styles.operation, !enabled && styles.disabled)}
                        onClick={
                          enabled
                            ? onClick
                              ? () => onClick(id)
                              : () => this.props[`goTo${upperCode}`](id)
                            : undefined
                        }
                      >
                        {typeof name === 'function' ? name(id) : name}
                      </span>
                    );
                  },
                };
              },
              {
                renderDetailButton: this.renderDetailButton,
                renderEditButton: this.renderEditButton,
                renderDeleteButton: this.renderDeleteButton,
              }
            ),
          })
        : columns;

    return (
      <Card className={styles.card}>
        <Spin spinning={loading}>
          {list && list.length > 0 ? (
            <Table
              className={styles.table}
              dataSource={list}
              columns={Columns}
              rowKey="id"
              scroll={{
                x: true,
              }}
              onChange={this.handleTableChange}
              pagination={{
                current: pageNum,
                pageSize,
                total,
                pageSizeOptions: ['5', '10', '15', '20'],
                showTotal: showTotal ? total => `共 ${total} 条` : undefined,
                showQuickJumper: true,
                showSizeChanger: true,
              }}
              rowSelection={
                hasExportAuthority
                  ? {
                      selectedRowKeys,
                      onChange: this.handleSelectedRowKeysChange,
                    }
                  : undefined
              }
            />
          ) : (
            <Empty />
          )}
        </Spin>
      </Card>
    );
  }

  render() {
    const { breadcrumbList, content, children, list } = this.props;

    return (
      <PageHeaderLayout
        title={breadcrumbList[breadcrumbList.length - 1].title}
        breadcrumbList={breadcrumbList}
        content={typeof content === 'function' ? content({ list }) : content}
      >
        {this.renderForm()}
        {this.renderTable()}
        {children}
      </PageHeaderLayout>
    );
  }
}
