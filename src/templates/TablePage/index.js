import React, { Component, Fragment } from 'react';
import { Card, Table, message, Button, Empty, Spin, Popconfirm } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import CustomForm from '@/jingan-components/CustomForm';
import { getPageSize, setPageSize } from '@/utils/utils';
import classNames from 'classnames';
import router from 'umi/router';
import styles from './index.less';

/**
 * 表格页
 */
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
      error=true,
    } = this.props;
    getList({
      ...(transform ? transform(this.prevValues) : this.prevValues),
      pageNum,
      pageSize,
    }, success => {
      if (!success && error) {
        message.error('获取表格数据失败，请稍后重试或联系管理人员！');
      }
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
      error=true,
    } = this.props;
    this.prevValues = values;
    getList({
      ...(transform ? transform(values) : values),
      pageNum: 1,
      pageSize,
    }, success => {
      if (!success && error) {
        message.error('获取表格数据失败，请稍后重试或联系管理人员！');
      }
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
    const {
      urls: {
        add,
      },
    } = this.props;
    router.push(add);
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
    const {
      urls: {
        detail,
      },
    } = this.props;
    router.push(`${detail.replace(/(.*)\/$/, '$1')}/${id}`);
  }

  // 编辑按钮点击事件
  handleEditButtonClick = ({ currentTarget: { dataset: { id } } }) => {
    const {
      urls: {
        edit,
      },
    } = this.props;
    router.push(`${edit.replace(/(.*)\/$/, '$1')}/${id}`);
  }

  // 删除按钮点击事件
  handleDeleteButtonClick = id => {
    const {
      remove,
      error=true,
    } = this.props;
    remove({ id }, success => {
      if (success) {
        message.success('删除成功');
        this.reload();
      } else if (error) {
        message.error('删除失败，请稍后重试或联系管理人员！');
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
      error=true,
    } = this.props;
    getList({
      ...(transform ? transform(this.prevValues) : this.prevValues),
      pageNum: prevPageSize !== pageSize ? 1 : current,
      pageSize,
    }, success => {
      if (!success && error) {
        message.error('获取表格数据失败，请稍后重试或联系管理人员！');
      }
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

  renderForm() {
    const {
      permissions: {
        add: hasAddAuthority,
        export: hasExportAuthority,
      },
      fields,
      addEnable=true,
      exportEnable,
      action,
    } = this.props;
    const { selectedRowKeys } = this.state;

    return (
      <Card className={styles.card}>
        <CustomForm
          fields={fields}
          onSearch={this.handleSearchButtonClick}
          onReset={this.handleResetButtonClick}
          action={(
            <Fragment>
              {addEnable && <Button type="primary" onClick={this.handleAddButtonClick} disabled={!hasAddAuthority}>新增</Button>}
              {exportEnable && <Button type="primary" onClick={this.handleExportButtonClick} disabled={!hasExportAuthority || !selectedRowKeys || !selectedRowKeys.length}>导出</Button>}
              {action}
            </Fragment>
          )}
          ref={this.setFormReference}
        />
      </Card>
    );
  }

  renderTable() {
    const {
      permissions: {
        detail: hasDetailAuthority,
        edit: hasEditAuthority,
        delete: hasDeleteAuthority,
        export: hasExportAuthority,
      },
      list: {
        list=[],
        pagination: {
          total,
          pageNum,
          pageSize,
        }={},
      }={},
      columns: prevColumns,
      exportEnable,
      operateEnable=true,
      detailEnable=true,
      editEnable=true,
      deleteEnable=true,
      loading=false,
    } = this.props;
    const { selectedRowKeys } = this.state;

    const columns = [
      ...prevColumns,
      ...(operateEnable ? [
        {
          title: '操作',
          dataIndex: 'id',
          width: 250,
          fixed: list && list.length > 0 ? 'right' : false,
          render: id => (
            <Fragment>
              {detailEnable && <span className={classNames(styles.operation, !hasDetailAuthority && styles.disabled)} onClick={hasDetailAuthority ? this.handleDetailButtonClick : undefined} data-id={id}>查看</span>}
              {editEnable && <span className={classNames(styles.operation, !hasEditAuthority && styles.disabled)} onClick={hasEditAuthority ? this.handleEditButtonClick : undefined} data-id={id}>编辑</span>}
              {deleteEnable && (hasDeleteAuthority ? (
                <Popconfirm title="你确定要删除吗?" onConfirm={() => this.handleDeleteButtonClick(id)}>
                  <span className={styles.operation}>删除</span>
                </Popconfirm>
              ) : (
                <span className={classNames(styles.operation, styles.disabled)}>删除</span>
              ))}
              {}
            </Fragment>
          ),
          align: 'center',
        },
      ] : []),
    ];

    return (
      <Card className={styles.card}>
        <Spin spinning={loading}>
          {list && list.length > 0 ? (
            <Table
              className={styles.table}
              dataSource={list}
              columns={columns}
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
              rowSelection={exportEnable && hasExportAuthority ? {
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
      title,
      breadcrumbList,
      content,
    } = this.props;

    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        content={content}
      >
        {this.renderForm()}
        {this.renderTable()}
      </PageHeaderLayout>
    );
  }
}
