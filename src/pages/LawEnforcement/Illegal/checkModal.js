import React, { PureComponent } from 'react';
import { Form, Modal, Button, Table, Input } from 'antd';

import InlineForm from '../../BaseInfo/Company/InlineForm';

const fieldList = {
  name: '单位名称',
};
const fields = [
  {
    id: 'name',
    render() {
      return <Input placeholder={fieldList.name} />;
    },
    transform(value) {
      return value.trim();
    },
  },
];
// 默认页面显示数量列表
const defaultPageSizeOptions = ['5', '10', '15', '20'];

@Form.create()
export default class CompanyModal extends PureComponent {
  state = {
    selectedRowKeys: [],
    name: undefined,
  };

  /* 关闭按钮点击事件 */
  handleClose = () => {
    const { onClose } = this.props;
    if (onClose) {
      onClose();
    }
  };

  /* 完全关闭后 */
  handleAfterClose = () => {
    const { afterClose } = this.props;
    if (afterClose) {
      afterClose();
    }
  };

  handleContentTable = () => {
    const { onShowTable } = this.props;
    if (onShowTable) {
      onShowTable();
    }
  };

  /* 查询按钮点击事件 */
  handleSearch = value => {
    const {
      fetch,
      modal: {
        pagination: { pageSize },
      },
      payload,
    } = this.props;
    this.setState({
      ...value,
      selectedRowKeys: [],
    });
    fetch({
      payload: {
        ...value,
        pageNum: 1,
        pageSize,
        ...payload,
      },
    });
  };

  /* 选择按钮点击事件 */
  handleSelect = () => {
    const { selectedRowKeys } = this.state;
    const {
      modal: { list },
      onSelect,
    } = this.props;
    const selectedData = list.filter(item => item.id === selectedRowKeys[0])[0];
    if (onSelect) {
      onSelect(selectedData);
    }
  };

  /* 重置按钮点击事件 */
  handleReset = value => {
    const {
      fetch,
      modal: {
        pagination: { pageSize },
      },
      payload,
    } = this.props;
    this.setState({
      ...value,
      selectedRowKeys: [],
    });
    fetch({
      payload: {
        ...value,
        pageNum: 1,
        pageSize,
        ...payload,
      },
    });
  };

  /* 选择更换 */
  handleSelectChange = selectedRowKeys => {
    this.setState({
      selectedRowKeys,
    });
  };

  /* 更换页码或显示数量 */
  handleChangePagination = ({ current, pageSize }) => {
    const { fetch, payload } = this.props;
    const { name } = this.state;
    this.setState({
      selectedRowKeys: [],
    });
    fetch({
      payload: {
        name,
        pageNum: current,
        pageSize,
        ...payload,
      },
    });
  };

  /* 渲染选择按钮 */
  renderSelectButton() {
    const { selectedRowKeys } = this.state;
    return (
      <Button type="primary" onClick={this.handleSelect} disabled={!selectedRowKeys.length}>
        选择
      </Button>
    );
  }

  render() {
    const {
      visible,
      width,
      title,
      loading,
      rowKey,
      columns,
      column,
      pagination,
      rowSelection,
      field,
      actSelect = true,
      clickContent = true,
      checkList,
      modal: {
        list,
        pagination: { total, pageNum, pageSize },
      },
    } = this.props;
    const { selectedRowKeys } = this.state;

    return (
      <Modal
        title={title}
        width={width || 900}
        visible={visible}
        onCancel={this.handleClose}
        afterClose={this.handleAfterClose}
        footer={null}
        maskClosable={false}
        keyboard={false}
        destroyOnClose
      >
        <InlineForm
          fields={field || fields}
          action={actSelect && this.renderSelectButton()}
          onSearch={this.handleSearch}
          onReset={this.handleReset}
        />
        <div style={{ display: 'inline' }}>
          <Table
            style={{
              marginTop: '16px',
              width: '420px',
              display: 'table-cell',
            }}
            loading={loading}
            bordered
            size="middle"
            rowKey={rowKey || 'id'}
            dataSource={checkList || []}
            columns={columns}
            pagination={{
              total,
              current: pageNum,
              pageSize,
              showQuickJumper: true,
              showSizeChanger: true,
              showTotal: t => `共 ${t} 条记录`,
              pageSizeOptions: defaultPageSizeOptions,
              ...pagination,
            }}
            rowSelection={{
              selectedRowKeys,
              onChange: this.handleSelectChange,
              hideDefaultSelections: true,
              type: 'radio',
              ...rowSelection,
            }}
            onChange={this.handleChangePagination}
            onRow={record => {
              return {
                onClick: () => {
                  this.handleContentTable(record);
                },
              };
            }}
          />
          {clickContent && (
            <Table
              style={{
                marginTop: '16px',
                width: '320px',
                display: 'table-cell',
              }}
              loading={loading}
              bordered
              size="middle"
              rowKey={rowKey || 'id'}
              dataSource={list || []}
              columns={column}
            />
          )}
        </div>
      </Modal>
    );
  }
}
