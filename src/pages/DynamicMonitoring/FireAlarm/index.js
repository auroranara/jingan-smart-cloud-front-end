import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Card, Button, Input, List, Row, Col, Spin } from 'antd';
import Ellipsis from 'components/Ellipsis';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import styles from './index.less';
import InfiniteScroll from 'react-infinite-scroller';
// import VisibilitySensor from 'react-visibility-sensor';
import { AuthLink, ERROR_MSG } from '@/utils/customAuth';
import codesMap from '@/utils/codes';

const PAGE_SIZE = 18;

const breadcrumbList = [
  { title: '首页', name: '首页', href: '/' },
  { title: '动态监测', name: '动态监测' },
  { title: '火灾自动报警系统', name: '火灾自动报警系统' },
];

// div[id="root"]下的唯一子元素相对于定高的root滚动
// const rootElement = document.getElementById('root');
// const rootElement = document.body;
// console.log(rootElement);

@connect(({ fireAlarm, user, loading }) => ({
  fireAlarm,
  user,
  loading: loading.models.fireAlarm,
}))
export default class FireAlarm extends PureComponent {
  state = {
    company: '',
    address: '',
    scrollLoading: false, // 下拉加载，当前是否正在请求数据
    hasMore: true, // 数据库中是否还存在数据
  };

  componentDidMount() {
    const that = this;
    // rootElement.onscroll = this.handleScroll;
    // rootElement.addEventListener('scroll', this.handleScroll, false);

    this.props.dispatch({
      type: 'fireAlarm/fetch',
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
    // rootElement.onscroll = null;
    // rootElement.removeEventListener('scroll', this.handleScroll);
  }

  currentpageNum = 2;

  // handleScroll = e => {
  //   console.log('scroll', e, e.target);
  //   const rootDOM = e.target;
  //   // const rootDOM = document.body;
  //   // console.log('rootDOM', rootDOM.scrollTop);
  //   const childDOM = rootDOM.firstElementChild;
  //   // const childDOM = document.getElementById('root').firstElementChild;
  //   // console.log('child', childDOM);
  //   console.log(rootDOM.scrollTop, rootDOM.offsetHeight, childDOM.offsetHeight);

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
      type: 'fireAlarm/fetch',
      payload: {
        pageNum: 1,
        pageSize: PAGE_SIZE,
        name: company,
        address,
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
      type: 'fireAlarm/fetch',
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
      type: 'fireAlarm/fetch',
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

  /* 滚动加载 */
  handleLoadMore = () => {
    const {
      fireAlarm: { isLast },
    } = this.props;
    if (isLast) {
      return;
    }
    const {
      fireAlarm: { pageNum },
    } = this.props;
    // 请求数据
    this.props.dispatch({
      type: 'fireAlarm/fetch',
      payload: {
        pageSize: PAGE_SIZE,
        pageNum: pageNum + 1,
        ...this.formData,
      },
    });
  };

  renderForm() {
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
        </Row>
      </Card>
    );
  }

  renderList() {
    const {
      fireAlarm: {
        data: { list },
      },
      // loading,
    } = this.props;

    return (
      <div className={styles.cardList}>
        <List
          rowKey="id"
          // loading={loading}
          grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
          dataSource={list}
          renderItem={item => {
            const {
              id,
              name,
              hostCount,
              alertCount,
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
                  code={codesMap.dynamicMonitoring.comanyDetailView}
                  to={`/dynamic-monitoring/fire-alarm/company/${id}`}
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
                      火警主机数量：
                      {hostCount}
                    </p>
                    <div className={styles.quantityContainer}>
                      <div className={styles.quantity}>{alertCount}</div>
                      <p className={styles.quantityDescrip}>警情数量</p>
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

  render() {
    const {
      fireAlarm: {
        data: {
          pagination: { total },
        },
        isLast,
      },
      loading,
    } = this.props;

    return (
      <PageHeaderLayout
        title="单位列表"
        breadcrumbList={breadcrumbList}
        content={
          <div>
            单位总数：
            {total}
            {''}
          </div>
        }
      >
        {this.renderForm()}

        <InfiniteScroll
          initialLoad={false}
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
        >
          {this.renderList()}
        </InfiniteScroll>
      </PageHeaderLayout>
    );
  }
}
