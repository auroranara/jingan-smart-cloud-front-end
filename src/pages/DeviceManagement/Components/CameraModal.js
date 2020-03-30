import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Table, Button, Modal, Row, Col, Input, Select } from 'antd';
import { AuthA } from '@/utils/customAuth';
import codes from '@/utils/codes';

const FormItem = Form.Item;
const Option = Select.Option;

const colWrapper = { lg: 8, md: 12, sm: 24, xs: 24 }
const formItemStyle = { style: { margin: '0', padding: '4px 0' } }

const CameraModal = Form.create()(props => {
  const {
    visible,
    form: { getFieldsValue, getFieldDecorator, resetFields },
    onCancel,
    fetch,
    model: {
      list = [],
    },
    deviceInfo,
    loading,
    ...resProps
  } = props

  // 跳转到编辑摄像头页面
  const handleToEdit = (id) => {
    window.open(`${window.publicPath}#/device-management/video-monitor/edit/${id}?name=${deviceInfo.companyName}&companyId=${deviceInfo.companyId}`)
  }

  // 点击查询
  const handleQuery = () => {
    const values = getFieldsValue()
    fetch(values)
  }

  //  点击重置
  const handleReset = () => {
    resetFields()
    handleQuery()
  }

  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      align: 'center',
    },
    {
      title: '设备ID',
      dataIndex: 'deviceId',
      align: 'center',
    },
    {
      title: '摄像头ID',
      dataIndex: 'keyId',
      align: 'center',
    },
    {
      title: '操作',
      key: '',
      align: 'center',
      render: (val, row) => (
        <AuthA
          code={codes.deviceManagement.videoMonitor.edit}
          onClick={() => handleToEdit(row.id)}
        >编辑</AuthA>
      ),
    },
  ]

  return (
    <Modal
      title="已绑定摄像头"
      width={900}
      visible={visible}
      destroyOnClose={true}
      onCancel={onCancel}
      footer={false}
      {...resProps}
    >
      <Form>
        <Row gutter={16}>
          <Col {...colWrapper}>
            <FormItem {...formItemStyle}>
              {getFieldDecorator('name')(
                <Input placeholder="请输入视频名称" />
              )}
            </FormItem>
          </Col>
          <Col {...colWrapper}>
            <FormItem {...formItemStyle}>
              {getFieldDecorator('status')(
                <Select
                  allowClear
                  placeholder="请选择视频监控状态"
                  getPopupContainer={() => document.querySelector('#root>div')}
                  style={{ width: '180px' }}
                >
                  <Option value={'1'} key={'1'}>
                    启用
                  </Option>
                  <Option value={'0'} key={'0'}>
                    禁用
                  </Option>
                </Select>
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
      {list && list.length ? (
        <Table
          style={{ marginTop: '10px' }}
          rowKey="id"
          loading={loading}
          columns={columns}
          dataSource={list}
          bordered
          pagination={false}
        />
      ) : (
          <div style={{ textAlign: 'center', padding: '100px 0', color: '#808080ad' }}>暂无数据</div>
        )}
    </Modal>
  )
})
export default CameraModal;
