import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'react-router-dom';
import { Card, Button, Input, List, Row, Col } from 'antd';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './UserTransmissionDevice.less';
// import { add } from 'gl-matrix/src/gl-matrix/quat';

@connect(({ transmission, loading }) => ({
  transmission,
  loading: loading.models.transmission,
}))
export default class CardList extends PureComponent {
  state = {
    company: '',
    address: '',
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'transmission/fetch',
      payload: {
        pageIndex: 1,
        pageSize: 9,
      },
    });
  }

  handleCheck = () => {
    const { company, address } = this.state;
    this.props.dispatch({
      type: 'transmission/fetch',
      payload: {
        pageIndex: 1,
        pageSize: 9,
        company,
        address,
      },
    });
  };

  handleReset = () => {
    this.setState({ company: '', address: '' });
  };

  handleCompanyChange = e => {
    this.setState({ company: e.target.value });
  };

  handleAddressChange = e => {
    this.setState({ address: e.target.value });
  };

  render() {
    const {
      transmission: { list },
      loading,
    } = this.props; //eslint-disable-line
    const { company, address } = this.state;

    return (
      <PageHeaderLayout title="用户传输装置">
        <div className={styles.check}>
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col span={6}>
              <Input
                placeholder="请输入单位名称"
                onChange={this.handleCompanyChange}
                value={company}
              />
            </Col>
            <Col span={6}>
              <Input
                placeholder="请输入单位地址"
                onChange={this.handleAddressChange}
                value={address}
              />
            </Col>
            <Col span={2}>
              <Button type="primary" onClick={this.handleCheck}>
                查询
              </Button>
            </Col>
            <Col span={2}>
              <Button onClick={this.handleReset}>重置</Button>
            </Col>
          </Row>
        </div>
        <div className={styles.cardList}>
          <List
            rowKey="id"
            loading={loading}
            grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
            dataSource={list}
            renderItem={item => (
              <List.Item key={item.id}>
                <Link to={`/fire-control/user-transmission-device-detail/${item.id}`}>
                  <Card hoverable className={styles.card} title={item.company}>
                    <p>地址：{item.address}</p>
                    <p>安全负责人：{item.leader}</p>
                    <p>联系电话：{item.phone}</p>
                    <p>消防主机数量：{item.quantity}</p>
                    <span className={styles.quantity}>{item.quantity}</span>
                  </Card>
                </Link>
              </List.Item>
            )}
          />
        </div>
      </PageHeaderLayout>
    );
  }
}
