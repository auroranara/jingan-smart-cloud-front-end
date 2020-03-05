import React, { Component } from 'react';
import { Button, Modal, Table, Input, Select, DatePicker } from 'antd';
import CustomForm from '@/jingan-components/CustomForm';
import SelectOrSpan from '@/jingan-components/SelectOrSpan';
import moment from 'moment';
import TypeSelect from '../../../components/TypeSelect';
import { LEVELS, DEFAULT_FORMAT } from '../../List';
import { connect } from 'dva';
import { getPageSize, setPageSize } from '@/utils/utils';
import styles from './index.less';
const { Option } = Select;
const GET_LIST = 'accidentReport/getList';

@connect(
  ({ accidentReport, loading }) => ({
    accidentReport,
    loading: loading.effects[GET_LIST],
  }),
  dispatch => ({
    getList(payload, callback) {
      dispatch({
        type: GET_LIST,
        payload: {
          type: '0',
          pageNum: 1,
          pageSize: getPageSize(),
          ...payload,
        },
        callback,
      });
    },
  })
)
export default class AccidentInfo extends Component {
  state = {
    visible: false,
    selectedRowKeys: undefined,
  };

  prevValues = null;

  setFormReference = form => {
    this.form = form;
  };

  handleButtonClick = () => {
    const { companyId, getList } = this.props;
    getList({ accidentCompanyId: companyId });
    this.prevValues = null;
    this.setState({
      visible: true,
      selectedRowKeys: undefined,
    });
  };

  handleModalCancel = () => {
    this.setState({
      visible: false,
    });
    this.form && this.form.resetFields();
  };

  handleSelectButtonClick = () => {
    const { onChange } = this.props;
    const { selectedRowKeys } = this.state;
    onChange && onChange(selectedRowKeys[0]);
    this.setState({
      visible: false,
    });
    this.form && this.form.resetFields();
  };

  handleSelectedRowKeysChange = selectedRowKeys => {
    this.setState({
      selectedRowKeys,
    });
  };

  // 查询
  handleSearch = values => {
    const {
      companyId,
      accidentReport: { list: { pagination: { pageSize = getPageSize() } = {} } = {} },
      getList,
    } = this.props;
    this.prevValues = values;
    getList({
      ...values,
      pageSize,
      accidentCompanyId: companyId,
    });
  };

  // 重置
  handleReset = values => {
    this.handleSearch(values);
  };

  // 表格change
  handleTableChange = ({ current, pageSize }) => {
    const {
      companyId,
      accidentReport: {
        list: { pagination: { pageSize: prevPageSize = getPageSize() } = {} } = {},
      },
      getList,
    } = this.props;
    getList({
      ...this.prevValues,
      pageNum: prevPageSize !== pageSize ? 1 : current,
      pageSize,
      accidentCompanyId: companyId,
    });
    this.form &&
      (this.prevValues ? this.form.setFieldsValue(this.prevValues) : this.form.resetFields());
    prevPageSize !== pageSize && setPageSize(pageSize);
  };

  render() {
    const {
      companyId,
      accidentReport: { list: { list = [], pagination: { pageNum, pageSize, total } = {} } = {} },
      loading,
      ...restProps
    } = this.props;
    const { visible, selectedRowKeys } = this.state;

    const fields = [
      {
        id: 'accidentTitle',
        label: '事故信息标题',
        transform: value => value.trim(),
        render: _this => (
          <Input
            placeholder="请输入事故信息标题"
            onPressEnter={_this.handleSearch}
            maxLength={50}
          />
        ),
      },
      {
        id: 'accidentType',
        label: '事故类型代码',
        render: () => <TypeSelect allowClear />,
      },
      {
        id: 'accidentLevel',
        label: '事故级别',
        render: () => (
          <Select placeholder="请选择事故级别" allowClear>
            {LEVELS.map(({ key, value }) => (
              <Option key={key}>{value}</Option>
            ))}
          </Select>
        ),
      },
      {
        id: 'happenTime',
        label: '事故发生时间',
        render: () => (
          <DatePicker
            className={styles.datePicker}
            placeholder="请选择事故发生时间"
            format={DEFAULT_FORMAT}
            showTime
            allowClear
          />
        ),
      },
    ];
    const columns = [
      {
        title: '事故信息标题',
        dataIndex: 'accidentTitle',
        align: 'center',
      },
      {
        title: '事故发生时间',
        dataIndex: 'happenTime',
        render: time => time && moment(time).format(DEFAULT_FORMAT),
        align: 'center',
      },
      {
        title: '事故类型代码',
        dataIndex: 'accidentTypeDesc',
        align: 'center',
      },
      {
        title: '事故级别',
        dataIndex: 'accidentLevel',
        render: value => <SelectOrSpan list={LEVELS} value={`${value}`} type="span" />,
        align: 'center',
      },
    ];

    return (
      <div {...restProps}>
        <Button type="primary" onClick={this.handleButtonClick} disabled={!companyId}>
          选择
        </Button>
        <Modal
          title="选择事故信息"
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
            action={
              <Button
                type="primary"
                onClick={this.handleSelectButtonClick}
                disabled={!selectedRowKeys || !selectedRowKeys.length}
              >
                选择
              </Button>
            }
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
      </div>
    );
  }
}
