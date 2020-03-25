import { PureComponent } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Table, Modal, Input, Button, Row, Col, TreeSelect } from 'antd';
import { connect } from 'dva';
import { treeData } from './ProductionArea/List.js';

@Form.create()
@connect(({ account }) => ({
  account,
}))
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
    const { onOk, onChange } = this.props;
    const { selectedKeys, selected } = this.state;
    this.setState({ visible: false });
    onOk && onOk(selectedKeys, selected);
    onChange && onChange(selectedKeys);
  }

  handleViewModal = () => {
    const { selectedKeys } = this.props;
    this.handleQuery();
    this.setState({ visible: true, selectedKeys });
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
      account: { departments },
      label,
      style = {},
    } = this.props;
    const { selectedKeys, visible } = this.state;
    const columns = [
      {
        title: '姓名',
        dataIndex: 'value',
        align: 'center',
      },
      {
        title: '部门',
        key: 'department',
        align: 'center',
        render: (_, { users }) => Array.isArray(users) && users.length ? users[0].departmentName : '',
      },
      {
        title: '联系电话',
        dataIndex: 'phoneNumber',
        align: 'center',
      },
    ];
    const treeList = treeData(departments);
    return (
      <div style={{ display: 'flex', ...style }}>
        <Input
          value={label}
          disabled
          style={{ width: 'calc(100% - 75px)', marginRight: '10px' }}
          placeholder="请选择"
        />
        <Button onClick={this.handleViewModal} type="primary">选择</Button>
        <Modal
          width={750}
          visible={visible}
          title="选择负责人"
          onOk={this.handleOk}
          onCancel={() => { this.setState({ visible: false }) }}
          footer={null}
        >
          <Form>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item>
                  {getFieldDecorator('userName')(
                    <Input placeholder="人员名称" allowClear />
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item>
                  {getFieldDecorator('department')(
                    <TreeSelect
                      allowClear
                      dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                      placeholder="请选择所属部门"
                    >
                      {treeList}
                    </TreeSelect>
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item>
                  <Button style={{ marginRight: '10px' }} type="primary" onClick={() => this.handleQuery()}>查询</Button>
                  <Button style={{ marginRight: '10px' }} onClick={this.handleReset}>重置</Button>
                  <Button disabled={!selectedKeys || selectedKeys.length < 1} type="primary" onClick={this.handleOk}>选择</Button>
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
              type: 'radio',
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
