import { Fragment } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Modal, Table, Button, Row, Col, Input, Tag, Divider } from 'antd';
import { AuthPopConfirm, AuthA } from '@/utils/customAuth';

const FormItem = Form.Item;

const defaultPageSize = 10;
const colWrapper = { lg: 8, md: 12, sm: 24, xs: 24 }
const formItemStyle = { style: { margin: '0', padding: '4px 0' } }

const defaultColumns = [
  {
    title: '设备名称',
    dataIndex: 'name',
    align: 'center',
    width: 200,
  },
  {
    title: '编号',
    dataIndex: 'code',
    align: 'center',
    width: 200,
  },
  {
    title: '设备类型',
    dataIndex: 'equipmentTypeName',
    align: 'center',
    width: 200,
  },
]

/* 绑定/解绑监测设备 */
const TableModal = Form.create()(props => {
  const {
    type = 'bind', // bind 绑定/unbind解绑
    loading, // 列表加载状态
    form: { getFieldDecorator, resetFields, getFieldsValue },
    visible,
    onCancel,
    fetch,
    onOk,
    rowSelection,
    model: {
      list = [],
      pagination: {
        pageNum = 1,
        pageSize = defaultPageSize,
        total = 0,
      },
    },
    handleUnbind, // 解绑
    unbindAuthority, // 解绑权限
    ...resProps
  } = props
  // 查询列表
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
  const columns = type === 'bind' ? defaultColumns : [
    ...defaultColumns,
    {
      title: '操作',
      key: '操作',
      align: 'center',
      width: 150,
      render: (val, row) => (
        <Fragment>
          <AuthPopConfirm
            authority={unbindAuthority}
            title="确认要解绑吗？"
            onConfirm={() => handleUnbind(row.id)}
          >
            解绑
        </AuthPopConfirm>
          {/* {canEditSensor && (
            <Fragment>
              <Divider type="vertical" />
              <AuthA code={editSensorCode} onClick={() => {
                const winHandler = window.open('', '_blank');
                winHandler.location.href = `${window.publicPath}#/device-management/new-sensor/edit/${row.id}`;
                winHandler.focus();
              }}>编辑</AuthA>
            </Fragment>
          )} */}
        </Fragment>
      ),
    },
  ]
  return (
    <Modal
      title={(type === 'bind' && '绑定监测设备') || (type === 'unbind' && '已绑定监测设备')}
      width={900}
      visible={visible}
      destroyOnClose
      onCancel={onCancel}
      onOk={onOk}
      {...resProps}
    >
      <Form>
        <Row gutter={16}>
          <Col {...colWrapper}>
            <FormItem {...formItemStyle}>
              {getFieldDecorator('name')(
                <Input placeholder="名称" />
              )}
            </FormItem>
          </Col>
          <Col {...colWrapper}>
            <FormItem {...formItemStyle}>
              {getFieldDecorator('code')(
                <Input placeholder="编号" />
              )}
            </FormItem>
          </Col>
          <Col {...colWrapper}>
            <FormItem {...formItemStyle}>
              <Button style={{ marginRight: '10px' }} type="primary" onClick={() => handleQuery()}>查询</Button>
              <Button onClick={handleReset}>重置</Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
      {list && list.length ? (
        <Table
          style={{ marginTop: '10px' }}
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={list}
          bordered
          pagination={{
            current: pageNum,
            pageSize,
            total,
            showQuickJumper: true,
            showSizeChanger: true,
            // pageSizeOptions: ['5', '10', '15', '20'],
            onChange: handleQuery,
            onShowSizeChange: (num, size) => {
              handleQuery(1, size);
            },
          }}
          rowSelection={rowSelection}
        />
      ) : (
          <div style={{ textAlign: 'center', padding: '100px 0', color: '#808080ad' }}>暂无数据</div>
        )}
    </Modal>
  )
})
export default TableModal;
