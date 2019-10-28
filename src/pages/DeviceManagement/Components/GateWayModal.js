import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Modal, Table, Button, Input, Form, Card, Row, Col } from 'antd';
import { AuthButton } from '@/utils/customAuth';
import codes from '@/utils/codes';

const FormItem = Form.Item;

const colWrapper = { lg: 8, md: 12, sm: 24, xs: 24 }
const formItemStyle = { style: { margin: '0', padding: '4px 0' } }

const {
  deviceManagement: {
    gateway: {
      add: gatewayAddCode,
    },
  },
} = codes

@Form.create()
@connect(({ device, loading }) => ({
  device,
}))
export default class GateWayModal extends PureComponent {

  /**
   * 搜索列表数据
   */
  handleQuery = (pageNum = 1, pageSize = 10) => {
    const {
      form: { getFieldsValue },
      fetch,
    } = this.props
    const values = getFieldsValue()
    fetch({ pageNum, pageSize, ...values })
  }


  /**
   * 点击重置
   */
  handleReset = () => {
    const {
      form: { resetFields },
    } = this.props
    resetFields()
    this.handleQuery()
  }

  /**
   * 点击重置
   */
  handleToAddGateway = () => {
    const win = window.open(`${window.publicPath}#/device-management/gateway/add`, '_blank');
    win.focus();
  }

  /**
   * 渲染筛选栏
   */
  renderFilter = () => {
    const {
      form: { getFieldDecorator },
    } = this.props
    return (
      <Card style={{ marginBottom: '20px' }}>
        <Form>
          <Row gutter={16}>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                {getFieldDecorator('code')(
                  <Input placeholder="网关设备编号" />
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                <Button type="primary" onClick={() => this.handleQuery()} style={{ marginRight: '10px' }}>查询</Button>
                <Button onClick={this.handleReset} style={{ marginRight: '10px' }}>重置</Button>
                <AuthButton code={gatewayAddCode} onClick={this.handleToAddGateway} type="primary" >新增</AuthButton>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Card>
    )
  }

  renderTable = () => {
    const {
      loading,
      device: {
        gatewayDevice: {
          list,
          pagination: { total, pageNum, pageSize },
        },
      },
      handleSelect,
    } = this.props
    const columns = [
      {
        title: '网关设备编号',
        dataIndex: 'code',
        align: 'center',
      },
      {
        title: '操作',
        key: '操作',
        align: 'center',
        width: 150,
        render: (val, row) => (
          <Fragment>
            <a onClick={() => handleSelect(row)}>选择</a>
          </Fragment>
        ),
      },
    ]
    return (
      <Table
        loading={loading}
        rowKey="id"
        columns={columns}
        dataSource={list}
        pagination={{
          current: pageNum,
          pageSize,
          total,
          showQuickJumper: true,
          showSizeChanger: true,
          pageSizeOptions: ['5', '10', '15', '20'],
          onChange: this.handleQuery,
          onShowSizeChange: (num, size) => {
            this.handleQuery(1, size);
          },
        }}
        bordered
      />
    )
  }

  render() {
    const {
      visible,
      onCancel,
    } = this.props
    return (
      <Modal
        title="选择网关设备"
        visible={visible}
        onCancel={onCancel}
        width={800}
        destroyOnClose
        footer={null}
      >
        {this.renderFilter()}
        {this.renderTable()}
      </Modal>
    )
  }
}
