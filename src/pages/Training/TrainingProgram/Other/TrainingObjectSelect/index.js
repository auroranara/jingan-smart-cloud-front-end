import React, { Component } from 'react';
import { Input, Modal, Table } from 'antd';
import CustomForm from '@/jingan-components/CustomForm';
import styles from './index.less';

const { TextArea } = Input;
const FIELDS = [
  {
    id: 'name',
    label: '',
    render() {
      return <Input placeholder="" />;
    },
    transform(value) {
      return value.trim();
    },
  },
];
// 默认页面显示数量列表
const PAGE_SIZE_LIST = ['5', '10', '15', '20'];
// 表格列
const COLUMNS = [
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

// 选择培训对象
export default class TrainingObjectSelect extends Component {
  state = {
    visible: false,
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  }

  hideModal = () => {
    this.setState({
      visible: false,
    });
  }

  render() {
    const {
      list,
      value,
      onChange,
    } = this.props;
    const { visible } = this.state;
    const { key, label } = value || {};

    return (
      <div>
        <TextArea placeholder="请选择培训对象" autosize={{ minRows: 1 }} onClick={this.showModal} />
        <Modal
          title="选择培训对象"
          visible={visible}
        >
          <CustomForm fields={FIELDS} />
        </Modal>
      </div>
    );
  }
}
