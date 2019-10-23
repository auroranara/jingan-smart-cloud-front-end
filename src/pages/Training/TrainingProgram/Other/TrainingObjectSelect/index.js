import React, { Component } from 'react';
import { Input, Modal, Table, Spin, Button } from 'antd';
import CustomForm from '@/jingan-components/CustomForm';
import { connect } from 'dva';
import styles from './index.less';

const { TextArea } = Input;
const FIELDS = [
  {
    id: 'department',
    label: '部门',
    render({ onSearch }) {
      return <Input placeholder="请输入部门" onPressEnter={onSearch} />;
    },
    transform(value) {
      return value.trim();
    },
  },
  {
    id: 'name',
    label: '人员姓名',
    render({ onSearch }) {
      return <Input placeholder="请输入人员姓名" onPressEnter={onSearch} />;
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
    title: '部门',
    dataIndex: 'department',
    key: 'department',
    align: 'center',
  },
  {
    title: '人员姓名',
    dataIndex: 'name',
    key: 'name',
    align: 'center',
  },
  {
    title: '电话',
    dataIndex: 'phone',
    key: 'phone',
    align: 'center',
  },
];

// 选择培训对象
@connect(({
  trainingProgram: {
    trainingObjectList: list,
  },
  loading,
}) => ({
  list, // 培训对象列表
  loading: loading.effects['trainingProgram/getTrainingObjectList'],
}), (dispatch) => ({
  getList(payload, callback) { // 获取培训对象列表
    dispatch({
      type: 'trainingProgram/getTrainingObjectList',
      payload: {
        pageNum: 1,
        pageSize: 0,
        ...payload,
      },
      callback,
    });
  },
}))
export default class TrainingObjectSelect extends Component {
  state = {
    visible: false, // 是否显示modal
    selectedRowKeys: [], // 选中的表格行
    list: [], // 表格数据
    pageNum: 1,
    pageSize: 5,
  }

  cache = {
    arg1: undefined,
    arg2: undefined,
    result: undefined,
  }

  componentDidMount() {
    const { companyId } = this.props;
    if (companyId) {
      this.getList();
    }
  }

  componentDidUpdate({ companyId: prevCompanyId }) {
    const { companyId, onChange } = this.props;
    if (prevCompanyId !== companyId) {
      if (companyId) {
        this.getList();
      }
      if (prevCompanyId){
        onChange && onChange([]);
      }
    }
  }

  getList = () => {
    const { companyId, getList } = this.props;
    getList({
      companyId,
    }, (list) => {
      this.setState({
        list,
        pageNum: 1,
      });
    });
  }

  getLabel = (list, value) => {
    const { arg1, arg2, result } = this.cache;
    if (arg1 === list && arg2 === value) {
      return result;
    }
    const count = {};
    const storage = [];
    let res;
    if (value && value.length > 0 && list && list.length > 0) {
      if (value.length === list.length) {
        return '全体成员';
      }
      list.forEach(({ id, name, department }) => {
        if (count[department]) {
          count[department] += 1;
        } else {
          count[department] = 1;
        }
        if (value.includes(id)) {
          const obj = storage.find(({ key }) => key === department);
          if (obj) {
            obj.value.push(name);
          } else {
            storage.push({
              key: department,
              value: [name],
            });
          }
        }
      })
      res = storage.map(({ key, value }) => value.length === count[key] ? `${key}全体成员` : `${key}\n${value.join('、')}`).join('\n\n');
    }
    this.cache.arg1 = list;
    this.cache.arg2 = value;
    this.cache.result = res;
    return res;
  }

  setFormReference = (form) => {
    this.form = form;
  }

  setTextAreaReference = (textArea) => {
    this.textArea = textArea;
  }

  showModal = () => {
    const { value } = this.props;
    this.textArea.blur();
    this.setState({
      visible: true,
      selectedRowKeys: value,
    });
  }

  handleAfterClose = () => {
    const { list } = this.props;
    this.setState({
      list,
      pageNum: 1,
    });
    this.form && this.form.resetFields();
  }

  // 查询
  handleSearch = (values) => {
    const { list } = this.props;
    this.setState({
      list: list.filter((item) => (!values.department || item.department === values.department) && (!values.name || item.name === values.name)),
      pageNum: 1,
    });
  }

  // 重置
  handleReset = () => {
    const { list } = this.props;
    this.setState({
      list,
      pageNum: 1,
    });
  }

  // 分页
  handlePageChange = (pageNum, pageSize) => {
    this.setState({
      pageNum,
      pageSize,
    });
  }

  // 选中
  handleChange = (selectedRowKeys) => {
    this.setState({
      selectedRowKeys,
    });
  }

  // 确定
  handleConfirm = () => {
    const { onChange } = this.props;
    const { selectedRowKeys } = this.state;
    this.setState({
      visible: false,
    });
    onChange && onChange(selectedRowKeys);
  }

  // 取消
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  }

  render() {
    const {
      className,
      companyId,
      list: originalList,
      value,
      disabled,
      loading,
    } = this.props;
    const { visible, selectedRowKeys, pageNum, pageSize, list } = this.state;
    const label = this.getLabel(originalList, value);

    return !disabled ? (
      <div className={className}>
        <TextArea
          className={companyId ? styles.enabled : styles.disabled}
          placeholder="请选择培训对象"
          value={label}
          autosize={{ minRows: 3 }}
          onClick={this.showModal}
          disabled={!companyId}
          ref={this.setTextAreaReference}
        />
        <Modal
          title="选择培训对象"
          visible={visible}
          width={800}
          zIndex={1010}
          onCancel={this.handleCancel}
          afterClose={this.handleAfterClose}
          footer={null}
        >
          <Spin spinning={loading}>
            <CustomForm
              className={styles.form}
              fields={FIELDS}
              onSearch={this.handleSearch}
              onReset={this.handleReset}
              action={(
                <Button type="primary" /* disabled={selectedRowKeys.length === 0} */ onClick={this.handleConfirm}>选择</Button>
              )}
              ref={this.setFormReference}
            />
            <Table
              rowKey="id"
              rowSelection={{
                selectedRowKeys,
                onChange: this.handleChange,
              }}
              dataSource={list}
              columns={COLUMNS}
              pagination={{
                total: list.length,
                current: pageNum,
                pageSize,
                showQuickJumper: true,
                showSizeChanger: true,
                pageSizeOptions: PAGE_SIZE_LIST,
                onChange: this.handlePageChange,
                onShowSizeChange: (_, pageSize) => this.handlePageChange(1, pageSize),
              }}
            />
          </Spin>
        </Modal>
      </div>
    ) : (
      <div className={styles.container}>
        {label && label.split(/\n+/).map((v) => <div key={v}>{v}</div>)}
      </div>
    );
  }
}
