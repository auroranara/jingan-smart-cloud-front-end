import React from 'react';
import { Modal, Button, Row, Col, Table, Card, Divider, Tag } from 'antd';
import Map from './Map';

const columns = [
  {
    title: '区域名称',
    dataIndex: 'name',
    key: 'name',
    render: text => <a>{text}</a>,
  },
  {
    title: '负责人',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: '风险分级',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: '复评周期',
    key: 'tags',
    dataIndex: 'tags',
    render: tags => (
      <span>
        {tags.map(tag => {
          let color = tag.length > 5 ? 'geekblue' : 'green';
          if (tag === 'loser') {
            color = 'volcano';
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </span>
    ),
  },
  {
    title: 'Action',
    key: 'action',
    render: (text, record) => (
      <span>
        <a>编辑</a>
        <Divider type="vertical" />
        <a>删除</a>
      </span>
    ),
  },
];

const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
];

export default class TableList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDrawing: false,
    };
  }

  componentDidMount() {}

  renderDrawButton = () => {
    const { isDrawing } = this.state;
    return (
      <Button
        onClick={() => {
          this.setState({ isDrawing: !isDrawing });
        }}
      >
        {!isDrawing ? '开始画' : '结束画'}
      </Button>
    );
  };

  render() {
    const { isDrawing } = this.state;
    return (
      <div>
        <Row gutter={[8, 8]}>
          <Col span={12}>
            <Card title="地图" bordered={false}>
              {this.renderDrawButton()}
              <Map isDrawing={isDrawing} />
            </Card>
          </Col>
          <Col span={12}>
            <Card title="区域列表" bordered={false}>
              <Table columns={columns} dataSource={data} />
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}
