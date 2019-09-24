import React, { Component } from 'react';
import { Modal, Table, Button, Input } from 'antd';
import CustomForm from '@/jingan-components/CustomForm';
import { connect } from 'dva';
import styles from './index.less';

const { TextArea } = Input;
const DEFAULT_PAGE_NUM = 1;
const DEFAULT_PAGE_SIZE = 10;

@connect(({
  common,
  loading,
}) => ({
  list: common.employeeList,
  loading: loading.effects['common/fetchEmployeeList'],
}), (dispatch) => ({
  getList(payload, callback) {
    dispatch({
      type: 'common/fetchEmployeeList',
      payload: {
        pageNum: DEFAULT_PAGE_NUM,
        pageSize: DEFAULT_PAGE_SIZE,
        ...payload,
      },
      callback,
    });
  },
}))
export default class EmployeeSelect extends Component {
  state = {
    visible: false,
    selectedRowKeys: [],
  }

  componentDidMount() {
    const { getList, value } = this.props;
    getList();
    this.setState({ selectedRowKeys: value });
  }

  componentDidUpdate({ visible: prevVisible }) {
    const { value, visible, getList } = this.props;
    if (!prevVisible && visible) {
      const { resetFields } = this.form || {};
      resetFields && resetFields();
      getList();
      this.setState({ selectedRowKeys: value });
    }
  }

  setFormReference = (form) => {
    this.form = form;
  }

  setTextAreaReference = (textArea) => {
    this.textArea = textArea;
  }

  showModal = () => {
    const { getList } = this.props;
    getList();
    this.setState({
      visible: true,
    });
  }

  hideModal = () => {
    this.setState({
      visible: false,
    });
  }

  handleConfirm = () => {
    const { onChange } = this.props;
    const { selectedRowKeys } = this.state;
    onChange && onChange(selectedRowKeys);
    this.hideModal();
  }

  getLabel = () => {
    const { value, list } = this.props;
  }

  render() {
    const {
      value,
      allowClear,
      getList,
    } = this.props;
    const { visible } = this.state;
    const { selectedRowKeys } = this.state;
    const disabled = !selectedRowKeys || selectedRowKeys.length === 0;
    const fields = [
      {
        id: 'department',
        label: '部门',
        render: _this => <Input placeholder="请输入部门" onPressEnter={_this.handleSearch} maxLength={50} />,
      },
      {
        id: 'name',
        label: '人员姓名',
        render: _this => <Input placeholder="请输入人员姓名" onPressEnter={_this.handleSearch} maxLength={50} />,
      },
    ];

    return (
      <div>
        <TextArea
          value={this.getLabel()}
          autosize={{ minRows: 3 }}
          allowClear={allowClear}
          onClick={this.showModal}
          ref={this.setTextAreaReference}
        />
        <Modal
          title="选择培训对象"
          visible={visible}
          onCancel={this.hideModal}
          footer={null}
        >
          <CustomForm
            className={styles.form}
            fields={fields}
            onSearch={getList}
            onReset={getList}
            action={(
              <Button type="primary" onClick={this.handleConfirm} disabled={disabled}>选择</Button>
            )}
            ref={this.setFormReference}
          />
        </Modal>
      </div>
    );
  }
}
