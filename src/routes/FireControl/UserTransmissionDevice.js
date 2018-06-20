import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Link } from 'react-router-dom';
import { Card, Button, Input, List, Row, Col, Spin } from 'antd';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './UserTransmissionDevice.less';
// import { add } from 'gl-matrix/src/gl-matrix/quat';

const PAGE_SIZE = 18;

// div[id="root"]下的唯一子元素相对于定高的root滚动
const rootElement = document.getElementById('root');

@connect(({ transmission, loading }) => ({
  transmission,
  loading: loading.models.transmission,
}))
export default class CardList extends PureComponent {
  state = {
    company: '',
    address: '',
    scrollLoading: false,
    hasMore: true,
  };

  componentDidMount() {
    rootElement.addEventListener('scroll', this.handleScroll, false);

    this.props.dispatch({
      type: 'transmission/fetch',
      payload: {
        pageIndex: 1,
        pageSize: PAGE_SIZE,
      },
    });
  }

  currentPageIndex = 2;

  handleScroll = e => {
    const rootDOM = e.target;
    // console.log('rootDOM', rootDOM.scrollTop);
    const childDOM = rootDOM.firstElementChild;
    // console.log('child', childDOM);
    // console.log(rootDOM.scrollTop, rootDOM.offsetHeight, childDOM.offsetHeight);

    const { scrollLoading, hasMore } = this.state;
    // 滚动时子元素相对定高的父元素滚动，事件加在父元素上，且查看父元素scrollTop，当滚到底时，父元素scrollTop+父元素高度=子元素高度
    const meetEnd = rootDOM.scrollTop + rootDOM.offsetHeight >= childDOM.offsetHeight;
    // 当页面滚到底部且当前并不在请求数据且数据库还有数据时，才能再次请求
    if (meetEnd && !scrollLoading && hasMore) this.handleInfiniteOnLoad();
  };

  handleCheck = () => {
    const { company, address } = this.state;
    this.setState({ hasMore: true });
    this.currentPageIndex = 2;
    this.props.dispatch({
      type: 'transmission/fetch',
      payload: {
        pageIndex: 1,
        pageSize: PAGE_SIZE,
        company,
        address,
      },
    });
  };

  handleReset = () => {
    this.setState({ company: '', address: '', hasMore: true });
    this.currentPageIndex = 2;
    this.props.dispatch({
      type: 'transmission/fetch',
      payload: {
        pageIndex: 1,
        pageSize: PAGE_SIZE,
      },
    });
  };

  handleCompanyChange = e => {
    this.setState({ company: e.target.value.trim() });
  };

  handleAddressChange = e => {
    this.setState({ address: e.target.value.trim() });
  };

  handleInfiniteOnLoad = () => {
    const that = this;
    const { company, address } = this.state;
    this.setState({ scrollLoading: true });

    this.props.dispatch({
      type: 'transmission/fetch',
      payload: {
        pageIndex: this.currentPageIndex,
        pageSize: PAGE_SIZE,
        company,
        address,
      },
      callback(total) {
        const currentLength = that.currentPageIndex * PAGE_SIZE;
        that.currentPageIndex += 1;
        that.setState({ scrollLoading: false });
        if (currentLength >= total) that.setState({ hasMore: false });
      },
    });
  };

  render() {
    const {
      transmission: { list },
      loading,
    } = this.props;
    const { company, address, scrollLoading, hasMore } = this.state;

    return (
      <PageHeaderLayout title="用户传输装置">
        <div className={styles.check}>
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col span={6}>
              <Input
                placeholder="请输入单位名称"
                onChange={this.handleCompanyChange}
                onPressEnter={this.handleCheck}
                value={company}
              />
            </Col>
            <Col span={6}>
              <Input
                placeholder="请输入单位地址"
                onChange={this.handleAddressChange}
                onPressEnter={this.handleCheck}
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
                  <Card hoverable className={styles.card} title={item.name}>
                    <p>地址：{item.praticalAddress}</p>
                    <p>安全负责人：{item.leader}</p>
                    <p>联系电话：{item.phone}</p>
                    <p>消防主机数量：{item.hostQuantity}</p>
                    <span className={styles.quantity}>{item.hostQuantity}</span>
                  </Card>
                </Link>
              </List.Item>
            )}
          />
        </div>
        <div className={scrollLoading && hasMore ? styles.spinContainer : styles.none}>
          <Spin />
        </div>
      </PageHeaderLayout>
    );
  }
}
