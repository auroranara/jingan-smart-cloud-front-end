import { PureComponent } from 'react';
import {
  Table,
  Modal,
  Input,
  Button,
} from 'antd';

export default class PersonSelectModal extends PureComponent {

  state = {
    selected: [], // 保存选中对象
    visible: false,
  }

  handleOk = () => {
    const { onOk } = this.props;
    const { selected } = this.state;
    this.setState({ visible: false });
    onOk(selected.map(item => item.key), selected);
  }

  handleClick = () => {
    this.props.fetch()
    this.setState({ visible: true });
  }

  render() {
    const {
      data: {
        list,
        pagination: {
          pageNum,
          pageSize,
          total,
        },
      },
    } = this.props;
    const { selected, visible } = this.state;
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
          width={600}
          visible={visible}
          title="选择复评人员"
          onOk={this.handleOk}
          onCancel={() => { this.setState({ visible: false }) }}
        >
          <Table
            rowKey="key"
            dataSource={list}
            columns={columns}
            zIndex={1010}
            rowSelection={{
              type: 'checkbox',
              selectedRowKeys: selected.map(item => item.key),
              onChange: (keys, rows) => { this.setState({ selected: rows }) },
            }}
            pagination={{
              current: pageNum,
              pageSize,
              total,
              showQuickJumper: true,
              showSizeChanger: true,
              pageSizeOptions: ['5', '10', '15', '20'],
              onChange: this.props.fetch,
              onShowSizeChange: (pageNum, pageSize) => {
                this.props.fetch(pageNum, pageSize)
              },
            }}
          />
        </Modal>
      </div>
    )
  }
}