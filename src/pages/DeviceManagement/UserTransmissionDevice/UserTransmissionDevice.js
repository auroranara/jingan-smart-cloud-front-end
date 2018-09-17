import React, { PureComponent } from 'react';
import { connect } from 'dva';
// import { Link } from 'react-router-dom';
import { Card, Button, Input, List, Row, Col, Spin } from 'antd';
import Ellipsis from '@/components/Ellipsis';

import PageHeaderLayout from '@/layouts/PageHeaderLayout';

import VisibilitySensor from 'react-visibility-sensor';
import styles from './UserTransmissionDevice.less';
import { AuthLink, ERROR_MSG } from '@/utils/customAuth';
import buttonCodes from '@/utils/codes';

const PAGE_SIZE = 18;
// const CODE = 'fireControl.userTransmissionDevice.view';

const breadcrumbList = [
  { title: '首页', name: '首页', href: '/' },
  { title: '消防维保', name: '消防维保' },
  { title: '用户传输装置', name: '用户传输装置' },
];

// div[id="root"]下的唯一子元素相对于定高的root滚动
// const rootElement = document.getElementById('root');

@connect(({ transmission, user, loading }) => ({
  transmission,
  user,
  loading: loading.models.transmission,
}))
export default class UserTransmissionDevice extends PureComponent {
  state = {
    company: '',
    address: '',
    scrollLoading: false, // 下拉加载，当前是否正在请求数据
    hasMore: true, // 数据库中是否还存在数据
  };

  componentDidMount() {
    const that = this;
    // rootElement.addEventListener('scroll', this.handleScroll, false);

    this.props.dispatch({
      type: 'transmission/fetch',
      payload: {
        pageNum: 1,
        pageSize: PAGE_SIZE,
      },
      // 如果第一页已经返回了所有结果，则hasMore置为false
      callback(total) {
        if (total <= PAGE_SIZE) that.setState({ hasMore: false });
      },
    });
  }

  componentWillUnmount() {
    // rootElement.removeEventListener('scroll', this.handleScroll);
  }

  currentpageNum = 2;

  // handleScroll = e => {
  //   // console.log('scroll');
  //   const rootDOM = e.target;
  //   // console.log('rootDOM', rootDOM.scrollTop);
  //   const childDOM = rootDOM.firstElementChild;
  //   // console.log('child', childDOM);
  //   // console.log(rootDOM.scrollTop, rootDOM.offsetHeight, childDOM.offsetHeight);

  //   const { scrollLoading, hasMore } = this.state;
  //   // 滚动时子元素相对定高的父元素滚动，事件加在父元素上，且查看父元素scrollTop，当滚到底时，父元素scrollTop+父元素高度=子元素高度
  //   // 判断页面是否滚到底部
  //   const scrollToBottom = rootDOM.scrollTop + rootDOM.offsetHeight >= childDOM.offsetHeight;
  //   // 当页面滚到底部且当前并不在请求数据且数据库还有数据时，才能再次请求
  //   if (scrollToBottom && !scrollLoading && hasMore) this.handleLazyload();
  // };

  handleCheck = () => {
    const that = this;
    const { company, address } = this.state;
    this.setState({ hasMore: true });
    this.currentpageNum = 2;
    this.props.dispatch({
      type: 'transmission/fetch',
      payload: {
        pageNum: 1,
        pageSize: PAGE_SIZE,
        name: company,
        practicalAddress: address,
      },
      // 如果第一页已经返回了所有结果，则hasMore置为false
      callback(total) {
        if (total <= PAGE_SIZE) that.setState({ hasMore: false });
      },
    });
  };

  handleReset = () => {
    const that = this;
    this.setState({ company: '', address: '', hasMore: true });
    this.currentpageNum = 2;
    this.props.dispatch({
      type: 'transmission/fetch',
      payload: {
        pageNum: 1,
        pageSize: PAGE_SIZE,
      },
      // 如果第一页已经返回了所有结果，则hasMore置为false
      callback(total) {
        if (total <= PAGE_SIZE) that.setState({ hasMore: false });
      },
    });
  };

  handleCompanyChange = e => {
    this.setState({ company: e.target.value.trim() });
  };

  handleAddressChange = e => {
    this.setState({ address: e.target.value.trim() });
  };

  handleLazyload = () => {
    const that = this;
    const { company, address } = this.state;
    this.setState({ scrollLoading: true });

    this.props.dispatch({
      type: 'transmission/fetch',
      payload: {
        pageNum: this.currentpageNum,
        pageSize: PAGE_SIZE,
        name: company,
        practicalAddress: address,
      },
      callback(total) {
        const currentLength = that.currentpageNum * PAGE_SIZE;
        that.currentpageNum += 1;
        that.setState({ scrollLoading: false });
        if (currentLength >= total) that.setState({ hasMore: false });
      },
    });
  };

  handleLoadMore = flag => {
    // flag=true 能看到组件 flag=false 不能看到组件
    const { scrollLoading, hasMore } = this.state;
    // flag=true表示能看到组件，即已经到底，且请求还未返回且数据库还有数据
    if (flag && !scrollLoading && hasMore) this.handleLazyload();
  };

  render() {
    const {
      transmission: {
        data: {
          list,
          pagination: { total },
        },
      },
      // user: {
      //   currentUser: { permissionCodes: codes },
      // },
      loading,
    } = this.props;
    const { company, address, scrollLoading, hasMore } = this.state;

    return (
      <PageHeaderLayout
        title="用户传输装置"
        breadcrumbList={breadcrumbList}
        content={
          <div>
            单位总数：
            {total}
            {''}
          </div>
        }
      >
        <Card className={styles.check}>
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
        </Card>
        <div className={styles.cardList}>
          <List
            rowKey="id"
            loading={loading}
            grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
            dataSource={list}
            renderItem={item => {
              const {
                id,
                name,
                fireCount,
                transmissionCount,
                safetyName,
                safetyPhone,
                practicalProvinceLabel,
                practicalCityLabel,
                practicalDistrictLabel,
                practicalTownLabel,
                practicalAddress,
              } = item;

              const practicalAddressLabel =
                (practicalProvinceLabel || '') +
                (practicalCityLabel || '') +
                (practicalDistrictLabel || '') +
                (practicalTownLabel || '') +
                (practicalAddress || '');

              return (
                <List.Item key={id}>
                  <AuthLink
                    code={buttonCodes.deviceManagement.transmission.detail}
                    to={`/device-management/user-transmission-device/${id}/detail`}
                    errMsg={ERROR_MSG}
                  >
                    <Card hoverable className={styles.card} title={name}>
                      <Ellipsis tooltip className={styles.ellipsis} lines={1}>
                        地址：
                        {practicalAddressLabel ? practicalAddressLabel : '暂无信息'}
                      </Ellipsis>
                      <p>
                        安全负责人：
                        {safetyName ? safetyName : '暂无信息'}
                      </p>
                      <p>
                        联系电话：
                        {safetyPhone ? safetyPhone : '暂无信息'}
                      </p>
                      <p>
                        消防主机数量：
                        {fireCount}
                      </p>
                      <div className={styles.quantityContainer}>
                        <div className={styles.quantity}>{transmissionCount}</div>
                        <p className={styles.quantityDescrip}>传输装置数</p>
                      </div>
                    </Card>
                  </AuthLink>
                </List.Item>
              );
            }}
          />
        </div>
        {list.length !== 0 && <VisibilitySensor onChange={this.handleLoadMore} />}
        <div className={scrollLoading && hasMore ? styles.spinContainer : styles.none}>
          <Spin />
        </div>
      </PageHeaderLayout>
    );
  }
}
