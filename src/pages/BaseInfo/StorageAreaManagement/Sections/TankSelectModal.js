import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Modal, Button, Row, Col, Input, Table } from 'antd';

const FormItem = Form.Item;

const defaultPageSize = 10;
const colWrapper = { lg: 8, md: 12, sm: 24, xs: 24 };
const formItemStyle = { style: { margin: '0', padding: '4px 0' } };

// 选择储罐弹窗
const TankSelectModal = Form.create()(props => {
  const {
    form: { getFieldDecorator, getFieldsValue, resetFields },
    title,
    visible,
    onOk,
    onCancel,
    fetch,
    rowSelection,
    loading = false,
    handleSelect,
    model: {
      list = [],
      pagination: { pageNum = 1, pageSize = defaultPageSize, total = 0 },
    },
  } = props;

  const handleQuery = (pageNum = 1, pageSize = defaultPageSize) => {
    const values = getFieldsValue();
    fetch({
      payload: {
        pageNum,
        pageSize,
        ...values,
      },
    });
  };
  const handleReset = () => {
    resetFields();
    handleQuery();
  };
  const columns = [
    {
      title: '统一编码',
      dataIndex: 'unifiedCode',
      align: 'center',
      width: 200,
    },
    {
      title: '储罐名称',
      dataIndex: 'tankName',
      align: 'center',
      width: 200,
    },
    {
      title: '位号',
      dataIndex: 'number',
      align: 'center',
      width: 200,
    },
    {
      title: '存储介质品名',
      dataIndex: 'chineName',
      align: 'center',
      width: 200,
    },
  ];
  return (
    <Modal
      title={title}
      visible={visible}
      destroyOnClose
      onCancel={onCancel}
      onOk={onOk}
      footer={null}
      width={800}
    >
      <Form>
        <Row gutter={16}>
          <Col {...colWrapper}>
            <FormItem {...formItemStyle}>
              {getFieldDecorator('tankName')(<Input placeholder="储罐名称" />)}
            </FormItem>
          </Col>
          <Col {...colWrapper}>
            <FormItem {...formItemStyle}>
              {getFieldDecorator('number')(<Input placeholder="位号" />)}
            </FormItem>
          </Col>
          <Col {...colWrapper}>
            <FormItem {...formItemStyle}>
              <Button style={{ marginRight: '10px' }} type="primary" onClick={() => handleQuery()}>
                查询
              </Button>
              <Button style={{ marginRight: '10px' }} onClick={handleReset}>
                重置
              </Button>
              <Button
                type="primary"
                onClick={handleSelect}
                disabled={rowSelection.selectedRowKeys.length === 0}
              >
                选择
              </Button>
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
          rowSelection={rowSelection}
          pagination={false}
          // pagination={{
          //   current: pageNum,
          //   pageSize,
          //   total,
          //   showQuickJumper: true,
          //   showSizeChanger: true,
          //   pageSizeOptions: ['5', '10', '15', '20'],
          //   onChange: handleQuery,
          //   onShowSizeChange: (num, size) => {
          //     handleQuery(1, size);
          //   },
          // }}
        />
      ) : (
        <div style={{ textAlign: 'center', padding: '100px 0', color: '#808080ad' }}>暂无数据</div>
      )}
    </Modal>
  );
});

export default TankSelectModal;
