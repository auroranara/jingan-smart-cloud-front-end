import React, { PureComponent } from 'react';
import { Form, Modal, Table } from 'antd';

import InlineForm from '../../BaseInfo/Company/InlineForm';

// 默认页面显示数量列表
const defaultPageSizeOptions = ['5', '10', '15', '20'];
const PageSize = 5;
@Form.create()
export default class CompanyModal extends PureComponent {
  state = {
    // selectedRowKeys: [],
    object_title: undefined,
    business_type: undefined,
    checkList: [],
    clickContent: false,
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
    this.setState({ clickContent: false });
  };

  // handleContentTable = record => {
  //   const { onShowTable } = this.props;
  //   if (onShowTable) {
  //     onShowTable(record);
  //   }
  // };

  /* 查询按钮点击事件 */
  handleSearch = value => {
    const {
      fetch,
      checkModal: {
        pagination: { pageSize },
      },
      payload,
    } = this.props;
    this.setState({
      ...value,
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

  /* 重置按钮点击事件 */
  handleReset = value => {
    const {
      fetch,
      checkModal: {
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

  /* 更换页码或显示数量 */
  handleChangePagination = ({ current, pageSize }) => {
    const { fetch, payload } = this.props;
    const { object_title, business_type } = this.state;
    this.setState({
      selectedRowKeys: [],
    });
    fetch({
      payload: {
        object_title,
        business_type,
        pageNum: current,
        pageSize,
        ...payload,
      },
    });
  };

  handleContentTable = record => {
    const { flows, business_type, industry } = record;
    this.setState({
      clickContent: true,
      checkList: flows.map(d => {
        return { ...d, business_type, industry };
      }),
    });
  };

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
      field,
      actSelect = true,
      checkModal: {
        list,
        pagination: { total, pageNum, pageSize },
      },
    } = this.props;
    const { checkList, clickContent } = this.state;

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
          fields={field}
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
            dataSource={list || []}
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
              pagination={{ pageSize: PageSize }}
              dataSource={checkList || []}
              columns={column}
            />
          )}
        </div>
      </Modal>
    );
  }
}
