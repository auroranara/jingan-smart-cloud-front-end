import React, { Component } from 'react';
import { Modal, Button, Table, Input } from 'antd';
import CustomForm from '@/jingan-components/CustomForm';
import InputOrSpan from '@/jingan-components/InputOrSpan';
import SelectOrSpan from '@/jingan-components/SelectOrSpan';
import { connect } from 'dva';
import classNames from 'classnames';
import { getPageSize, setPageSize } from '@/utils/utils';
import { RISK_CATEGORIES } from '@/pages/SafetyKnowledgeBase/MSDS/utils';
import styles from './index.less';

const GET_STORAGE_MEDIUM_LIST = 'gasometer/getStorageMediumList';
const MATERIAL_FORMS = [
  { key: '1', value: '固态' },
  { key: '2', value: '液态' },
  { key: '3', value: '气态' },
  { key: '4', value: '等离子态' },
];
const RISKY_CATEGORIES = RISK_CATEGORIES.map((value, index) => ({ key: `${index}`, value }));

// 存储介质
@connect(({
  gasometer,
  loading,
}) => ({
  gasometer,
  loading: loading.effects[GET_STORAGE_MEDIUM_LIST],
}), dispatch => ({
  getStorageMediumList(payload, callback) {
    dispatch({
      type: GET_STORAGE_MEDIUM_LIST,
      payload: {
        pageNum: 1,
        pageSize: getPageSize(),
        ...payload,
      },
      callback,
    });
  },
}))
export default class Medium extends Component {
  state = {
    visible: false,
    selectedRowKeys: undefined,
  }

  prevValues = {}

  setFormReference = form => {
    this.form = form;
  }

  handleButtonClick = () => {
    const {
      getStorageMediumList,
    } = this.props;
    getStorageMediumList();
    this.prevValues = {};
    this.setState({
      visible: true,
      selectedRowKeys: undefined,
    });
  }

  handleModalCancel = () => {
    this.setState({
      visible: false,
    });
    this.form && this.form.resetFields();
  }

  handleSelectButtonClick = () => {
    const {
      gasometer: {
        storageMediumList: {
          list=[],
        }={},
      },
      onChange,
    } = this.props;
    const { selectedRowKeys } = this.state;
    onChange && onChange(list.find(({ id }) => id === selectedRowKeys[0]));
    this.setState({
      visible: false,
    });
    this.form && this.form.resetFields();
  }

  handleSelectedRowKeysChange = (selectedRowKeys) => {
    this.setState({
      selectedRowKeys,
    });
  }

  // 查询
  handleSearch = (values) => {
    const {
      gasometer: {
        storageMediumList: {
          pagination: {
            pageSize=getPageSize(),
          }={},
        }={},
      },
      getStorageMediumList,
    } = this.props;
    this.prevValues = values;
    getStorageMediumList({
      ...values,
      pageSize,
    });
  }

  // 重置
  handleReset = (values) => {
    this.handleSearch(values);
  }

  // 表格change
  handleTableChange = ({ current, pageSize }) => {
    const {
      gasometer: {
        storageMediumList: {
          pagination: {
            pageSize: prevPageSize=getPageSize(),
          }={},
        }={},
      },
      getStorageMediumList,
    } = this.props;
    getStorageMediumList({
      ...this.prevValues,
      pageNum: prevPageSize !== pageSize ? 1 : current,
      pageSize,
    });
    this.form && this.form.setFieldsValue(this.prevValues);
    prevPageSize !== pageSize && setPageSize(pageSize);
  }

  renderModal() {
    const {
      gasometer: {
        storageMediumList: {
          list=[],
          pagination: {
            pageNum,
            pageSize,
            total,
          }={},
        }={},
      },
      loading=false,
    } = this.props;
    const {
      visible,
      selectedRowKeys,
    } = this.state;

    const fields = [
      {
        id: 'casNo',
        label: 'CAS号',
        transform: value => value.trim(),
        render: _this => <Input placeholder="请输入CAS号" onPressEnter={_this.handleSearch} maxLength={50} />,
      },
      {
        id: 'chineName',
        label: '品名',
        transform: value => value.trim(),
        render: _this => <Input placeholder="请输入品名" onPressEnter={_this.handleSearch} maxLength={50} />,
      },
    ];
    const columns = [
      {
        title: '统一编码',
        dataIndex: 'unifiedCode',
        align: 'center',
      },
      {
        title: '品名',
        dataIndex: 'chineName',
        align: 'center',
      },
      {
        title: 'CAS号',
        dataIndex: 'casNo',
        align: 'center',
      },
      {
        title: '物质形态',
        dataIndex: 'materialForm',
        render: value => <SelectOrSpan list={MATERIAL_FORMS} value={`${value}`} type="span" />,
        align: 'center',
      },
      {
        title: '危险性类别',
        dataIndex: 'riskCateg',
        render: value => <SelectOrSpan list={RISKY_CATEGORIES} value={`${value}`} type="span" />,
        align: 'center',
      },
    ];

    return (
      <Modal
        title="选择存储介质"
        width="80%"
        zIndex={1009}
        visible={visible}
        footer={null}
        onCancel={this.handleModalCancel}
      >
        <CustomForm
          className={styles.form}
          fields={fields}
          onSearch={this.handleSearch}
          onReset={this.handleReset}
          action={<Button type="primary" onClick={this.handleSelectButtonClick} disabled={!selectedRowKeys || !selectedRowKeys.length}>选择</Button>}
          ref={this.setFormReference}
        />
        <Table
          dataSource={list}
          columns={columns}
          rowKey="id"
          loading={loading}
          onChange={this.handleTableChange}
          pagination={{
            current: pageNum,
            pageSize,
            total,
            pageSizeOptions: ['5', '10', '15', '20'],
            // showTotal: total => `共 ${total} 条`,
            showQuickJumper: true,
            showSizeChanger: true,
          }}
          rowSelection={{
            type: 'radio',
            selectedRowKeys,
            onChange: this.handleSelectedRowKeysChange,
          }}
        />
      </Modal>
    );
  }

  render() {
    const {
      className,
      value,
      allowClear=false,
      type,
    } = this.props;

    return (
      <div className={classNames(styles.container, className)}>
        <InputOrSpan
          value={value && value.chineName}
          placeholder="请选择存储介质"
          disabled
          addonAfter={(
            <Button
              type="primary"
              onClick={this.handleButtonClick}
            >
              选择
            </Button>
          )}
          allowClear={allowClear}
          type={type}
        />
        {this.renderModal()}
      </div>
    );
  }
}
