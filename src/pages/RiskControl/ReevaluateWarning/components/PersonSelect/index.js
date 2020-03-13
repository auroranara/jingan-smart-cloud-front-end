import { PureComponent } from 'react';
import {
  Table,
  Modal,
  Input,
  Button,
  Form,
  Row,
  Col,
} from 'antd';

@Form.create()
export default class PersonSelectModal extends PureComponent {

  state = {
    selected: [], // 保存选中对象
    selectedKeys: [], // 保存选中的key
    visible: false,
  }

  handleQuery = (pageNum = 1, pageSize = 10) => {
    const { form: { getFieldsValue }, fetch } = this.props;
    const values = getFieldsValue();
    fetch({
      ...values,
      pageNum,
      pageSize,
    })
  }

  handleReset = () => {
    const { form: { resetFields }, fetch } = this.props;
    resetFields();
    fetch();
  }

  handleOk = () => {
    const { onOk } = this.props;
    const { selectedKeys, selected } = this.state;
    this.setState({ visible: false });
    onOk(selectedKeys, selected);
  }

  handleClick = () => {
    this.handleQuery();
    this.setState({ visible: true });
  }

  handleTableChange = (keys, rows) => {
    this.setState(({ selected }) => {
      return {
        selectedKeys: keys,
        selected: [...selected, ...rows].filter((item, i, self) => {
          return keys.includes(item.key) && self.findIndex(val => val.key === item.key) === i;
        }),
      }
    });
  }

  render () {
    const {
      data: {
        list,
        pagination: {
          pageNum,
          pageSize,
          total,
        },
      },
      form: { getFieldDecorator },
    } = this.props;
    const { selected, selectedKeys, visible } = this.state;
    const columns = [
      {
        title: '姓名',
        dataIndex: 'value',
        align: 'center',
      },
    ];
    return (
      <div style={{ display: 'flex' }}>
        <Input
          value={selected.map(item => item.value).join('、')}
          disabled
          style={{ width: 'calc(100% - 70px)', marginRight: '10px' }}
          placeholder="请选择"
        />
        <Button onClick={this.handleClick} type="primary">选择</Button>
        <Modal
          width={700}
          visible={visible}
          title="选择复评人员"
          onOk={this.handleOk}
          onCancel={() => { this.setState({ visible: false }) }}
        >
          <Form>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item>
                  {getFieldDecorator('userName')(
                    <Input placeholder="人员名称" allowClear />
                  )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item>
                  <Button style={{ marginRight: '10px' }} type="primary" onClick={() => this.handleQuery()}>查询</Button>
                  <Button onClick={this.handleReset}>重置</Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <Table
            rowKey="key"
            dataSource={list}
            columns={columns}
            zIndex={1010}
            rowSelection={{
              type: 'checkbox',
              selectedRowKeys: selectedKeys,
              onChange: this.handleTableChange,
            }}
            pagination={{
              current: pageNum,
              pageSize,
              total,
              showQuickJumper: true,
              showSizeChanger: true,
              pageSizeOptions: ['5', '10', '15', '20'],
              onChange: this.handleQuery,
              onShowSizeChange: (pageNum, pageSize) => {
                this.handleQuery(pageNum, pageSize)
              },
            }}
          />
        </Modal>
      </div>
    )
  }
}
