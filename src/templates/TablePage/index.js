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

/**
 * 表格页
 */
@connect((state, { route: { name, code }, otherOperation }) => {
  const { breadcrumbList } = code.split('.').slice(0, -1).reduce((result, item) => {
    const key = `${result.key}.${item}`;
    const title = locales[key];
    result.key = key;
    result.breadcrumbList.push({
      title,
      name: title,
    });
    return result;
  }, {
    breadcrumbList: [
      { title: '首页', name: '首页', href: '/' },
    ],
    key: 'menu',
  });
  const namespace = code.replace(/.*\.(.*)\..*/, '$1');
  const {
    user: {
      currentUser: {
        unitType,
        unitId,
        permissionCodes,
      },
    },
    [namespace]: {
      list,
    },
    loading: {
      effects: {
        [`${namespace}/getList`]: loading1,
        [`${namespace}/remove`]: loading2,
        [`${namespace}/exportList`]: loading3,
      },
    },
  } = state;
  return {
    unitId: +unitType === 4 ? unitId : undefined,
    list,
    loading: loading1 || loading2 || loading3,
    breadcrumbList,
    hasAddAuthority: permissionCodes.includes(code.replace(name, 'add')),
    hasEditAuthority: permissionCodes.includes(code.replace(name, 'edit')),
    hasDetailAuthority: permissionCodes.includes(code.replace(name, 'detail')),
    hasDeleteAuthority: permissionCodes.includes(code.replace(name, 'delete')),
    hasExportAuthority: permissionCodes.includes(code.replace(name, 'export')),
    ...(otherOperation && otherOperation.reduce((result, { code: codeName }) => {
      return {
        ...result,
        [`has${codeName[0].toUpperCase()}${codeName.slice(1)}Authority`]: permissionCodes.includes(code.replace(name, codeName)),
      };
    }, {})),
  };
}, (dispatch, { route: { name, code, path }, error=true, otherOperation }) => {
  const namespace = code.replace(/.*\.(.*)\..*/, '$1');
  return {
    getList(payload, callback) {
      dispatch({
        type: `${namespace}/getList`,
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
        type: `${namespace}/remove`,
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
        type: `${namespace}/exportList`,
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
      router.push(path.replace(new RegExp(`${name}.*`), 'add'));
    },
    goToEdit(id) {
      router.push(path.replace(new RegExp(`${name}.*`), `edit/${id}`));
    },
    goToDetail(id) {
      router.push(path.replace(new RegExp(`${name}.*`), `detail/${id}`));
    },
    ...(otherOperation && otherOperation.reduce((result, { code: codeName, onClick }) => {
      return onClick ? result : {
        ...result,
        [`goTo${codeName[0].toUpperCase()}${codeName.slice(1)}`](id) {
          router.push(path.replace(new RegExp(`${name}.*`), `${kebabCase(codeName)}${id ? `/${id}` : ''}`));
        },
      };
    }, {})),
  };
})
export default class TablePage extends Component {
  state = {
    selectedRowKeys: [],
  }

  // 除了用来保存控件值以外，还可以用来初始化
  prevValues = {}

  componentDidMount() {
    this.handleSearchButtonClick(this.prevValues);
  }

  // 设置form的引用
  setFormReference = form => {
    this.form = form;
  }

  // 刷新列表
  reload = () => {
    const {
      list: {
        pagination: {
          pageNum=1,
          pageSize=getPageSize(),
        }={},
      }={},
      getList,
      transform,
    } = this.props;
    getList({
      ...(transform ? transform(this.prevValues) : this.prevValues),
      pageNum,
      pageSize,
    });
    this.form && this.form.setFieldsValue(this.prevValues);
  }

  // 查询按钮点击事件
  handleSearchButtonClick = values => {
    const {
      list: {
        pagination: {
          pageSize=getPageSize(),
        }={},
      }={},
      getList,
      transform,
    } = this.props;
    this.prevValues = values;
    getList({
      ...(transform ? transform(values) : values),
      pageNum: 1,
      pageSize,
    });
  }

  // 重置按钮点击事件
  handleResetButtonClick = values => {
    this.handleSearchButtonClick(values);
    this.setState({
      selectedRowKeys: [],
    });
  }

  // 新增按钮点击事件
  handleAddButtonClick = () => {
    this.props.goToAdd();
  }

  // 导出按钮点击事件
  handleExportButtonClick = () => {
    const {
      exportList,
    } = this.props;
    const {
      selectedRowKeys,
    } = this.state;
    exportList({
      ids: selectedRowKeys.join(','),
    });
    this.setState({
      selectedRowKeys: [],
    });
  }

  // 查看按钮点击事件
  handleDetailButtonClick = ({ currentTarget: { dataset: { id } } }) => {
    this.props.goToDetail(id);
  }

  // 编辑按钮点击事件
  handleEditButtonClick = ({ currentTarget: { dataset: { id } } }) => {
    this.props.goToEdit(id);
  }

  // 删除按钮点击事件
  handleDeleteButtonClick = id => {
    const {
      remove,
    } = this.props;
    remove({ id }, success => {
      if (success) {
        this.reload();
      }
    });
  }

  // 表格的change事件
  handleTableChange = ({ current, pageSize }) => {
    const {
      list: {
        pagination: {
          pageSize: prevPageSize=getPageSize(),
        }={},
      }={},
      getList,
      transform,
    } = this.props;
    getList({
      ...(transform ? transform(this.prevValues) : this.prevValues),
      pageNum: prevPageSize !== pageSize ? 1 : current,
      pageSize,
    });
    this.form && this.form.setFieldsValue(this.prevValues);
    prevPageSize !== pageSize && setPageSize(pageSize);
  }

  // SelectedRowKeys的change事件
  handleSelectedRowKeysChange = selectedRowKeys => {
    this.setState({
      selectedRowKeys,
    });
  }

  renderAddButton = () => {
    const { hasAddAuthority } = this.props;
    return <Button type="primary" onClick={this.handleAddButtonClick} disabled={!hasAddAuthority}>新增</Button>;
  }

  renderExportButton = () => {
    const { hasExportAuthority } = this.props;
    const { selectedRowKeys } = this.state;
    return <Button type="primary" onClick={this.handleExportButtonClick} disabled={!hasExportAuthority || !selectedRowKeys || !selectedRowKeys.length}>导出</Button>
  }

  renderForm() {
    const {
      fields,
      action,
      unitId,
    } = this.props;
    const Fields = typeof fields === 'function' ? fields({ unitId }) : fields;
    const Action = typeof action === 'function' ? action({
      renderAddButton: this.renderAddButton,
      renderExportButton: this.renderExportButton,
    }) : fields;

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

  renderDetailButton = (id) => {
    const { hasDetailAuthority } = this.props;
    return <span className={classNames(styles.operation, !hasDetailAuthority && styles.disabled)} onClick={hasDetailAuthority ? this.handleDetailButtonClick : undefined} data-id={id}>查看</span>;
  }

  renderEditButton = (id) => {
    const { hasEditAuthority } = this.props;
    return <span className={classNames(styles.operation, !hasEditAuthority && styles.disabled)} onClick={hasEditAuthority ? this.handleEditButtonClick : undefined} data-id={id}>编辑</span>;
  }

  renderDeleteButton = (id) => {
    const { hasDeleteAuthority } = this.props;
    return hasDeleteAuthority ? (
      <Popconfirm title="你确定要删除吗?" onConfirm={() => this.handleDeleteButtonClick(id)}>
        <span className={styles.operation}>删除</span>
      </Popconfirm>
    ) : (
      <span className={classNames(styles.operation, styles.disabled)}>删除</span>
    );
  }

  renderTable() {
    const {
      hasExportAuthority,
      list: {
        list=[],
        pagination: {
          total,
          pageNum,
          pageSize,
        }={},
      }={},
      columns,
      loading=false,
      unitId,
      otherOperation,
    } = this.props;
    const { selectedRowKeys } = this.state;

    const Columns = typeof columns === 'function' ? columns({
      unitId,
      list,
      renderDetailButton: this.renderDetailButton,
      renderEditButton: this.renderEditButton,
      renderDeleteButton: this.renderDeleteButton,
      ...(otherOperation && otherOperation.reduce((result, { code, name, onClick }) => {
        const upperCode = `${code[0].toUpperCase()}${code.slice(1)}`;
        const hasAuthority = this.props[`has${upperCode}Authority`];
        return {
          ...result,
          [`render${upperCode}Button`]: (id) => {
            return (
              <span className={classNames(styles.operation, !hasAuthority && styles.disabled)} onClick={hasAuthority ? (
                onClick ? () => onClick(id) : () => this.props[`goTo${upperCode}`](id)
              ) : undefined}>{name}</span>
            );
          },
        };
      }, {})),
    }) : columns;

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
                showTotal: total => `共 ${total} 条`,
                showQuickJumper: true,
                showSizeChanger: true,
              }}
              rowSelection={hasExportAuthority ? {
                selectedRowKeys,
                onChange: this.handleSelectedRowKeysChange,
              } : undefined}
            />
          ) : (
            <Empty />
          )}
        </Spin>
      </Card>
    );
  }

  render() {
    const {
      breadcrumbList,
      content,
    } = this.props;

    return (
      <PageHeaderLayout
        title={breadcrumbList[breadcrumbList.length - 1].title}
        breadcrumbList={breadcrumbList}
        content={content}
      >
        {this.renderForm()}
        {this.renderTable()}
      </PageHeaderLayout>
    );
  }
}
