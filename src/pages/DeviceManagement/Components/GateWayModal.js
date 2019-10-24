import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Modal, Table, Button, Input, TreeSelect, Form, Card, Row, Col } from 'antd';

const FormItem = Form.Item;

const colWrapper = { lg: 8, md: 12, sm: 24, xs: 24 }
const formItemStyle = { style: { margin: '0', padding: '4px 0' } }

@Form.create()
@connect(({ device, loading }) => ({
  device,
  tableLoading: loading.effects['device/fetchGatewayEquipmentForPage'],
}))
export default class GateWayModal extends PureComponent {

  /**
   * 搜索列表数据
   */
  handleQuery = (pageNum = 1, pageSize = 10) => {
    const {
      dispatch,
      form: { getFieldsValue },
    } = this.props
    const values = getFieldsValue()
    dispatch({
      type: 'device/fetchGatewayEquipmentForPage',
      payload: { pageNum, pageSize, ...values },
    })
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
                {getFieldDecorator('网关设备编号')(
                  <Input placeholder="code" />
                )}
              </FormItem>
            </Col>
            <Col {...colWrapper}>
              <FormItem {...formItemStyle}>
                <Button type="primary" onClick={() => this.handleQuery()}>查询</Button>
                <Button onClick={this.handleReset}>重置</Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Card>
    )
  }

  renderTable = () => {
    const {
      tableLoading,
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
        loading={tableLoading}
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
        title="选择品牌"
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
