import {
  Form,
  Modal,
  Table,
  Button,
  Row,
  Col,
  Input,
  Tag,
} from 'antd';
import { AuthPopConfirm } from '@/utils/customAuth';

const FormItem = Form.Item;

const defaultPageSize = 10;
const colWrapper = { lg: 8, md: 12, sm: 24, xs: 24 }
const formItemStyle = { style: { margin: '0', padding: '4px 0' } }
const defaultColumns = [
  {
    title: '品牌',
    dataIndex: 'brandName',
    align: 'center',
    width: 200,
  },
  {
    title: '型号',
    dataIndex: 'modelName',
    align: 'center',
    width: 200,
  },
  {
    title: '传感器Token',
    dataIndex: 'token',
    align: 'center',
  },
  {
    title: '可用性',
    dataIndex: 'useStatus',
    width: 150,
    align: 'center',
    render: (val) => <Tag color={val === 1 ? 'blue' : 'red'}>{val === 1 ? '启用' : '禁用'}</Tag>,
  },
]

/*
  绑定/解绑传感器弹窗
*/
const TableModal = Form.create()(props => {
  const {
    title,
    tag = 'bind', // 'bind' / 'unbind'
    loading,
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
    handleUnbind, // 解绑传感器
    unbindSensorCode, // 解绑传感器权限
    ...resProps
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
  const columns = tag === 'bind' ? defaultColumns : [
    ...defaultColumns,
    {
      title: '操作',
      key: '操作',
      align: 'center',
      width: 150,
      render: (val, row) => (
        <AuthPopConfirm
          code={unbindSensorCode}
          title="确认要解绑该传感器吗？"
          onConfirm={() => handleUnbind(row.id)}
        >
          <a>解绑</a>
        </AuthPopConfirm>
      ),
    },
  ]
  return (
    <Modal
      title={title || (tag === 'bind' && '绑定传感器') || (tag === 'unbind' && '已绑定传感器')}
      width={900}
      visible={visible}
      destroyOnClose={true}
      onCancel={onCancel}
      onOk={onOk}
      {...resProps}
    >
      <Form>
        <Row gutter={16}>
          <Col {...colWrapper}>
            <FormItem {...formItemStyle}>
              {getFieldDecorator('token')(
                <Input placeholder="传感器Token" />
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
            pageSizeOptions: ['5', '10', '15', '20'],
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
