import React, { PureComponent } from 'react';
import { Form, Modal, Button, Table, Input } from 'antd';

import InlineForm from './InlineForm';

const fieldList = {
  name: '单位名称',
};
const fields = [
  {
    id: 'name',
    // options: {
    //   // rules: [{
    //   //   required: true,
    //   //   whitespace: true,
    //   //   message: `请输入${fieldList.name}`,
    //   // }],
    // },
    render() {
      return <Input placeholder={fieldList.name} />;
    },
    transform(value) {
      return value.trim();
    },
  },
];

@Form.create()
export default class CompanyModal extends PureComponent {
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

  /* 查询按钮点击事件 */
  handleSearch = value => {
    const { onSearch } = this.props;
    if (onSearch) {
      onSearch(value);
    }
  };

  /* 选择按钮点击事件 */
  handleSelect = value => {
    const { onSelect } = this.props;
    if (onSelect) {
      onSelect(value);
    }
  };

  /* 重置按钮点击事件 */
  handleReset = value => {
    const { onReset } = this.props;
    if (onReset) {
      onReset(value);
    }
  };

  /* 渲染选择按钮 */
  renderSelectButton() {
    return (
      <Button
        type="primary"
        onClick={this.handleSelect}
        disabled={!this.props.rowSelection.selectedRowKeys.length}
      >
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
      size,
      rowKey,
      dataSource,
      columns,
      pagination,
      rowSelection,
      onChange,
    } = this.props;

    return (
      <Modal
        title={title}
        visible={visible}
        width={width}
        onCancel={this.handleClose}
        afterClose={this.handleAfterClose}
        footer={null}
        maskClosable={false}
        keyboard={false}
        destroyOnClose
      >
        <InlineForm
          fields={fields}
          action={this.renderSelectButton()}
          onSearch={this.handleSearch}
          onReset={this.handleReset}
        />
        <Table
          style={{ marginTop: '16px' }}
          loading={loading}
          bordered
          size={size}
          rowKey={rowKey}
          dataSource={dataSource}
          columns={columns}
          pagination={pagination}
          rowSelection={rowSelection}
          onChange={onChange}
        />
      </Modal>
    );
  }
}
