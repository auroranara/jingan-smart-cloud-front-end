import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Card, Button, Input, List, Row, Col } from 'antd';
// import InfiniteScroll from 'react-infinite-scroller';

import Ellipsis from '@/components/Ellipsis';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import styles from './UserTransmissionDevice.less';
import { AuthButton, AuthLink, ERROR_MSG } from '@/utils/customAuth';
import buttonCodes from '@/utils/codes';

const PAGE_SIZE = 18;
// const CODE = 'fireControl.userTransmissionDevice.view';

const breadcrumbList = [
  { title: '首页', name: '首页', href: '/' },
  { title: '物联设备管理', name: '物联设备管理' },
  { title: '用户传输装置', name: '用户传输装置' },
];

// div[id="root"]下的唯一子元素相对于定高的root滚动
// const rootElement = document.getElementById('root');

const documentElem = document.documentElement;
// const body = document.body;

@connect(({ transmission, user, loading }) => ({
  transmission,
  user,
  loading: loading.effects['transmission/fetch'],
}))
export default class UserTransmissionDevice extends PureComponent {
  state = {
    company: '',
    address: '',
    // scrollLoading: false, // 下拉加载，当前是否正在请求数据
    hasMore: true, // 数据库中是否还存在数据
  };

  componentDidMount () {
    const that = this;

    // 不能将获取childElem放在外面，因为每次组件重新渲染后childElem都可能与原来不同，所以要每次重新获取
    this.childElem = document.querySelector('#root div');
    document.addEventListener('scroll', this.handleScroll, false);
    // 给body用addEventListener加并没有用，用onscroll却是可以的，不知为何，而用addEventListener加在document上是可以的
    // body.onscroll = this.handleScroll;

    this.props.dispatch({
      type: 'transmission/fetch',
      payload: {
        pageNum: 1,
        pageSize: PAGE_SIZE,
      },
      // 如果第一页已经返回了所有结果，则hasMore置为false
      callback (total) {
        if (total <= PAGE_SIZE) that.setState({ hasMore: false });
        that.companyTotal = total;
      },
    });
  }

  componentWillUnmount () {
    document.removeEventListener('scroll', this.handleScroll);
    // body.onscroll = null;
  }

  childElem = null;
  currentpageNum = 2;

  handleScroll = e => {
    // console.log('scroll');
    // const rootDOM = e.target;
    // console.log('rootDOM', rootDOM.scrollTop);
    // const childDOM = rootDOM.firstElementChild;
    // console.log('child', childDOM);
    // console.log(rootDOM.scrollTop, rootDOM.offsetHeight, childDOM.offsetHeight);

    const { loading } = this.props;
    const { hasMore } = this.state;
    const childElem = this.childElem;
    // const { scrollLoading, hasMore } = this.state;
    // 滚动时子元素相对定高的父元素滚动，事件加在父元素上，且查看父元素scrollTop，当滚到底时，父元素scrollTop+父元素高度=子元素高度
    // 判断页面是否滚到底部
    // const scrollToBottom = rootDOM.scrollTop + rootDOM.offsetHeight >= childDOM.offsetHeight;

    // 这里的页面结构是，html和body和div.#root是一样高的，而div.#root下的唯一子元素是高度比较大的
    // 发现向上滚动时，整个html都在往上滚，所以要获取document.documentElement元素，才能正确获取到scollTop，body及div.#root获取到的scrollTop都为0
    const scrollToBottom =
      documentElem.scrollTop + documentElem.offsetHeight >= childElem.offsetHeight;
    // console.log(childElem);
    // console.log(documentElem.scrollTop + documentElem.offsetHeight, childElem.offsetHeight);
    // 当页面滚到底部且当前并不在请求数据且数据库还有数据时，才能再次请求
    if (scrollToBottom && !loading && hasMore) this.handleLazyload();
    // if (scrollToBottom && !scrollLoading && hasMore) this.handleLazyload();
  };

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
      callback (total) {
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
      callback (total) {
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
    // const { loading } = this.props;
    const { company, address } = this.state;
    // this.setState({ scrollLoading: true });

    this.props.dispatch({
      type: 'transmission/fetch',
      payload: {
        pageNum: this.currentpageNum,
        pageSize: PAGE_SIZE,
        name: company,
        practicalAddress: address,
      },
      callback (total) {
        const currentLength = that.currentpageNum * PAGE_SIZE;
        that.currentpageNum += 1;
        // that.setState({ scrollLoading: false });
        if (currentLength >= total) that.setState({ hasMore: false });
      },
    });
  };

  // handleLoadMore = () => {
  //   const {
  //     transmission: { isLast },
  //   } = this.props;
  //   if (isLast) {
  //     return;
  //   }
  //   const {
  //     transmission: { pageNum },
  //   } = this.props;
  //   // 请求数据
  //   this.props.dispatch({
  //     type: 'transmission/fetch',
  //     payload: {
  //       pageSize: PAGE_SIZE,
  //       pageNum: pageNum + 1,
  //       ...this.formData,
  //     },
  //   });
  // };

  renderForm () {
    const { company, address } = this.state;
    return (
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
          <Col span={4} offset={4}>
            <AuthButton
              code={buttonCodes.deviceManagement.transmission.add}
              type="primary"
              onClick={e => router.push(`/device-management/user-transmission-device/add?equipmentType=201`)}
            >
              新增传输装置
            </AuthButton>
          </Col>
        </Row>
      </Card>
    );
  }

  renderList () {
    const {
      transmission: {
        data: { list },
      },
      loading,
    } = this.props;

    return (
      <div className={styles.cardList}>
        <List
          rowKey="id"
          loading={loading}
          grid={{ gutter: 24, column: 3, lg: 3, md: 2, sm: 1, xs: 1 }}
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
                  target="_blank"
                >
                  <Card hoverable className={styles.card} title={name}>
                    <Ellipsis tooltip className={styles.ellipsis} lines={1}>
                      地址：
                      {practicalAddressLabel ? practicalAddressLabel : '暂无信息'}
                    </Ellipsis>
                    <p>
                      安全管理员：
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
    );
  }
  render () {
    const {
      transmission: {
        data: {
          // pagination: { total },
          transmissionCount,
        },
        // isLast,
      },
      // loading,
    } = this.props;

    return (
      <PageHeaderLayout
        title="用户传输装置"
        breadcrumbList={breadcrumbList}
        content={
          <div>
            <span>
              单位总数：
              {this.companyTotal}
              {''}
            </span>
            <span style={{ paddingLeft: 20 }}>
              用户传输装置总数：
              {transmissionCount}
              {''}
            </span>
          </div>
        }
      >
        {this.renderForm()}

        {/* <InfiniteScroll
          pageStart={0}
          loadMore={() => {
            // 防止多次加载
            !loading && this.handleLoadMore();
          }}
          hasMore={!isLast}
          loader={
            <div className="loader" key={0}>
              {loading && (
                <div style={{ paddingTop: '50px', textAlign: 'center' }}>
                  <Spin />
                </div>
              )}
            </div>
          }
        > */}
        {this.renderList()}
        {/* </InfiniteScroll> */}
      </PageHeaderLayout>
    );
  }
}
