import React, { Component } from 'react';
import { Modal, Spin, Table, Input, message, Button, Empty } from 'antd';
import CustomForm from '@/jingan-components/CustomForm';
import InputOrSpan from '@/jingan-components/InputOrSpan';
// import SelectOrSpan from '@/jingan-components/SelectOrSpan';
import { connect } from 'dva';
import { RISK_CATEGORIES, getRiskCategoryLabel } from '@/pages/SafetyKnowledgeBase/MSDS/utils';
import { getModalPageSize, setModalPageSize } from '@/utils/utils';
import classNames from 'classnames';
import styles from './index.less';

// export const RISKY_CATEGORIES = RISK_CATEGORIES.map((value, index) => ({ key: `${index}`, value }));
const LIST_API = 'pipeline/getMediumList';

@connect(
  ({ pipeline: { mediumList }, loading }) => ({
    list: mediumList,
    loading: loading.effects[LIST_API],
  }),
  dispatch => ({
    getList(payload, callback) {
      dispatch({
        type: LIST_API,
        payload: {
          pageNum: 1,
          pageSize: getModalPageSize(),
          ...payload,
        },
        callback: (success, data) => {
          if (!success) {
            message.error('获取输送介质列表失败，请稍后重试！');
          }
          callback && callback(success, data);
        },
      });
    },
  })
)
export default class MediumModal extends Component {
  state = {
    visible: false,
    data: undefined, // 选中项
  };

  prevValues = null;

  componentDidUpdate({ companyId: prevCompanyId }) {
    const { companyId, value, onChange } = this.props;
    if (prevCompanyId && value && prevCompanyId !== companyId) {
      onChange && onChange();
    }
  }

  shouldComponentUpdate(
    { list: nextList, loading: nextLoading, companyId: nextCompanyId, value: nextValue },
    nextState
  ) {
    const { list, loading, companyId, value } = this.props;
    return (
      nextList !== list ||
      nextLoading !== loading ||
      nextCompanyId !== companyId ||
      nextValue !== value ||
      nextState !== this.state
    );
  }

  setFormReference = form => {
    this.form = form;
  };

  // 点击显示modal
  handleShowButtonClick = () => {
    const { companyId, value, getList } = this.props;
    this.prevValues = null;
    getList({ companyId });
    this.form && this.form.resetFields();
    this.setState({
      visible: true,
      data: value,
    });
  };

  handleModalCancel = () => {
    this.setState({
      visible: false,
    });
  };

  handleSelectButtonClick = () => {
    const { onChange } = this.props;
    const { data } = this.state;
    onChange && onChange(data);
    this.setState({
      visible: false,
    });
  };

  handleDataChange = selectedRowKeys => {
    const { list: { list = [] } = {} } = this.props;
    this.setState({
      data: list.find(({ id }) => id === selectedRowKeys[0]),
    });
  };

  // 查询
  handleSearch = values => {
    const {
      companyId,
      list: { pagination: { pageSize = getModalPageSize() } = {} } = {},
      getList,
    } = this.props;
    this.prevValues = values;
    getList({
      ...values,
      pageSize,
      companyId,
    });
  };

  // 重置
  handleReset = values => {
    this.handleSearch(values);
    this.setState({
      data: undefined,
    });
  };

  // 表格change
  handleTableChange = ({ current, pageSize }) => {
    const {
      companyId,
      list: { pagination: { pageSize: prevPageSize = getModalPageSize() } = {} } = {},
      getList,
    } = this.props;
    getList({
      ...this.prevValues,
      pageNum: prevPageSize !== pageSize ? 1 : current,
      pageSize,
      companyId,
    });
    this.form &&
      (this.prevValues ? this.form.setFieldsValue(this.prevValues) : this.form.resetFields());
    prevPageSize !== pageSize && setModalPageSize(pageSize);
  };

  renderModal() {
    const {
      list: { list = [], pagination: { pageNum, pageSize, total } = {} } = {},
      loading = false,
    } = this.props;
    const { visible, data } = this.state;

    const fields = [
      {
        id: 'casNo',
        label: 'CAS号',
        transform: value => value.trim(),
        render: ({ handleSearch }) => (
          <Input placeholder="请输入CAS号" onPressEnter={handleSearch} maxLength={50} />
        ),
      },
      {
        id: 'chineName',
        label: '品名',
        transform: value => value.trim(),
        render: ({ handleSearch }) => (
          <Input placeholder="请输入品名" onPressEnter={handleSearch} maxLength={50} />
        ),
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
        title: '危险性类别',
        dataIndex: 'riskCateg',
        // render: value => <SelectOrSpan list={RISKY_CATEGORIES} value={`${value}`} type="span" />,
        render: value => getRiskCategoryLabel(value, RISK_CATEGORIES),
        align: 'center',
      },
    ];

    return (
      <Modal
        title="选择输送介质"
        width="60%"
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
            <Button type="primary" onClick={this.handleSelectButtonClick} disabled={!data}>
              选择
            </Button>
          }
          ref={this.setFormReference}
        />
        <Spin spinning={loading}>
          {list && list.length > 0 ? (
            <Table
              dataSource={list}
              columns={columns}
              rowKey="id"
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
              rowSelection={{
                type: 'radio',
                selectedRowKeys: data && [data.id],
                onChange: this.handleDataChange,
              }}
            />
          ) : (
            <Empty />
          )}
        </Spin>
      </Modal>
    );
  }

  render() {
    const { className, companyId, value, type } = this.props;

    return (
      <div className={classNames(styles.container, className)}>
        <InputOrSpan
          value={value && value.chineName}
          placeholder="请选择输送介质"
          disabled
          addonAfter={
            <Button type="primary" onClick={this.handleShowButtonClick} disabled={!companyId}>
              选择
            </Button>
          }
          type={type}
        />
        {this.renderModal()}
      </div>
    );
  }
}
