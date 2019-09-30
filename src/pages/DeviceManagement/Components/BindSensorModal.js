import {
  Form,
  Modal,
  Table,
  Button,
  Row,
  Col,
  Input,
} from 'antd';

const FormItem = Form.Item;

const defaultPageSize = 10;
const colWrapper = { lg: 8, md: 12, sm: 24, xs: 24 }
const formItemStyle = { style: { margin: '0', padding: '4px 0' } }


const TableModal = Form.create()(props => {
  const {
    form: { getFieldDecorator, resetFields, getFieldsValue },
    visible,
    onCancel,
    fetch,
    onOk,
    onSensorChange,
    selectedSensorKeys, // 选择的所有传感器的key数组
    companySensor: {
      list = [],
      pagination: {
        pageNum = 1,
        pageSize = defaultPageSize,
        total = 0,
      },
    },
  } = props
  // 查询传感器列表
  const handleQuery = (pageNum = 1, pageSize = defaultPageSize) => {
    const values = getFieldsValue()
    fetch({
      payload: {
        pageNum,
        pageSize,
        ...values,
      },
    })
  }
  const handleReset = () => {
    resetFields()
    handleQuery()
  }
  const columns = [
    {
      title: '型号代码',
      dataIndex: 'classModel',
      align: 'center',
    },
    {
      title: '传感器Token',
      dataIndex: 'relationDeviceId',
      align: 'center',
    },
    {
      title: '所在区域',
      dataIndex: 'area',
      align: 'center',
    },
    {
      title: '所在位置',
      dataIndex: 'location',
      align: 'center',
    },
  ]
  const rowSelection = {
    selectedSensorKeys,
    onChange: onSensorChange,
  }
  return (
    <Modal
      title="绑定传感器"
      width={700}
      visible={visible}
      destroyOnClose={true}
      onCancel={onCancel}
      onOk={onOk}
    >
      <Form>
        <Row gutter={16}>
          <Col {...colWrapper}>
            <FormItem {...formItemStyle}>
              {getFieldDecorator('code')(
                <Input placeholder="传感器编号" />
              )}
            </FormItem>
          </Col>
          <Col {...colWrapper}>
            <FormItem {...formItemStyle}>
              {getFieldDecorator('deviceNo')(
                <Input placeholder="传感器Token" />
              )}
            </FormItem>
          </Col>
          <Col {...colWrapper}>
            <FormItem {...formItemStyle}>
              <Button style={{ marginRight: '10px' }} type="primary" onClick={handleQuery}>查询</Button>
              <Button onClick={handleReset}>重置</Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
      <Table
        rowKey="deviceId"
        // loading={bindTableLoading}
        columns={columns}
        dataSource={list}
        bordered
        pagination={{
          current: pageNum,
          pageSize,
          total,
          showQuickJumper: true,
          showSizeChanger: true,
          pageSizeOptions: ['5', '10', '15', '20'],
          onChange: this.queryBindList,
          onShowSizeChange: (num, size) => {
            this.queryBindList(1, size);
          },
        }}
        rowSelection={rowSelection}
      />
    </Modal>
  )
})

export default TableModal;
