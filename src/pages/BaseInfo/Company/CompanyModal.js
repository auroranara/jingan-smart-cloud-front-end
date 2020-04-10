import React, { PureComponent } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Modal, Button, Table, Input } from 'antd';

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
// 默认页面显示数量列表
const defaultPageSizeOptions = ['5', '10', '15', '20'];
// 表格列
const defaultColumns = [
  {
    title: '单位名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '社会信用代码',
    dataIndex: 'code',
    key: 'code',
  },
];

@Form.create()
export default class CompanyModal extends PureComponent {
  state = {
    selectedRowKeys: [],
    name: undefined,
  };

  getSnapshotBeforeUpdate(prevProps, prevState) {
    return (
      this.props.visible === true &&
      !!this.props.rowSelection &&
      !!this.props.rowSelection.selectedRowKeys
    );
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (snapshot) {
      this.setState({ selectedRowKeys: this.props.rowSelection.selectedRowKeys });
    }
  }

  /* 关闭按钮点击事件 */
  handleClose = () => {
    const { onClose } = this.props;
    if (onClose) {
      this.setState({ selectedRowKeys: [] });
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
    const {
      fetch,
      modal: {
        pagination: { pageSize },
      },
      payload,
      cameraKeys,
    } = this.props;
    if (cameraKeys) {
      this.setState({
        ...value,
      });
    } else {
      this.setState({ ...value });
    }
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
      isId,
      multiSelect,
    } = this.props;
    let selectedData;
    if (multiSelect) {
      selectedData = selectedRowKeys.map(data => {
        return list.find(item => {
          return isId ? item.loginId === data : item.id === data;
        });
      });
    } else {
      selectedData = list.filter(item => item.id === selectedRowKeys[0])[0];
    }
    if (onSelect) {
      onSelect(selectedData);
    }
    this.setState({ selectedRowKeys: [] });
  };

  /* 重置按钮点击事件 */
  handleReset = value => {
    const {
      fetch,
      modal: {
        pagination: { pageSize },
      },
      payload,
      cameraKeys,
    } = this.props;
    if (cameraKeys) {
      this.setState({
        ...value,
      });
    } else {
      this.setState({
        ...value,
        selectedRowKeys: [],
      });
    }

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
    const { fetch, payload, cameraKeys } = this.props;
    const { selectedRowKeys, ...resValues } = this.state;
    if (!cameraKeys) {
      this.setState({
        selectedRowKeys: [],
      });
    }
    fetch({
      payload: {
        ...resValues,
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
      pagination,
      rowSelection,
      field,
      actSelect = true,
      modal: {
        list,
        pagination: { total, pageNum, pageSize },
      },
      bindPoint,
      onChangeCheckBox,
      checked,
      butonStyles,
    } = this.props;
    const { selectedRowKeys } = this.state;

    return (
      <Modal
        title={title || '选择单位'}
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
          bindPoint={bindPoint}
          onChangeCheckBox={onChangeCheckBox}
          checked={checked}
          butonStyles={butonStyles}
          buttonSpan={{ xl: 16, md: 12, sm: 24 }}
        />
        <Table
          style={{ marginTop: '16px' }}
          loading={loading}
          bordered
          size="middle"
          rowKey={rowKey || 'id'}
          dataSource={list || []}
          columns={columns || defaultColumns}
          pagination={
            pagination === false
              ? false
              : {
                  total,
                  current: pageNum,
                  pageSize,
                  showQuickJumper: true,
                  showSizeChanger: true,
                  showTotal: t => `共 ${t} 条记录`,
                  pageSizeOptions: defaultPageSizeOptions,
                  ...pagination,
                }
          }
          rowSelection={{
            selectedRowKeys,
            onChange: this.handleSelectChange,
            hideDefaultSelections: true,
            type: 'radio',
            ...rowSelection,
          }}
          onChange={this.handleChangePagination}
        />
      </Modal>
    );
  }
}
