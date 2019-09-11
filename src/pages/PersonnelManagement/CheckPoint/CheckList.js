import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import Link from 'umi/link';
import Ellipsis from '@/components/Ellipsis';
import { Button, Card, Input, List, Switch, message } from 'antd';

import ToolBar from '@/components/ToolBar';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import styles from './CompanyList.less';
import { getAddress } from './utils';

const title = '卡口列表';
const breadcrumbList = [
  { title: '首页', name: '首页', href: '/' },
  { title: '人员在岗在位管理', name: '人员在岗在位管理' },
  { title: '卡口信息', name: '卡口信息' },
  { title, name: title },
];

const documentElem = document.documentElement;

const NO_DATA = '暂无信息';
const PAGE_SIZE = 18;
const TABS = ['卡口点位', '卡口设备', '显示屏'];
const TAB_LIST = TABS.map((tab, index) => ({ key: index.toString(), tab }));

@connect(({ checkPoint, loading }) => ({ checkPoint, loading: loading.effects['checkPoint/fetchCheckList'] }))
export default class CheckList extends PureComponent {
  state={ tabIndex: 0, statusList: [undefined, {}, {}] };

  componentDidMount() {
    const { match: { params: { tabIndex } } } = this.props;
    this.childElem = document.querySelector('#root div');
    document.addEventListener('scroll', this.handleScroll, false);
    // this.fetchInitCheckList(tabIndex);

    this.setState({ tabIndex });
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.handleScroll);
  }

  value = '';
  hasMore = true;
  childElem = null;
  currentpageNum = 2;

  handleScroll = e => {
    const { loading } = this.props;
    const hasMore = this.hasMore;
    const childElem = this.childElem;
    // 滚动时子元素相对定高的父元素滚动，事件加在父元素上，且查看父元素scrollTop，当滚到底时，父元素scrollTop+父元素高度=子元素高度
    // 判断页面是否滚到底部

    // 这里的页面结构是，html和body和div.#root是一样高的，而div.#root下的唯一子元素是高度比较大的
    // 发现向上滚动时，整个html都在往上滚，所以要获取document.documentElement元素，才能正确获取到scollTop，body及div.#root获取到的scrollTop都为0
    const scrollToBottom = documentElem.scrollTop + documentElem.offsetHeight >= childElem.offsetHeight;
    // 当页面滚到底部且当前并不在请求数据且数据库还有数据时，才能再次请求
    if (scrollToBottom && !loading && hasMore) this.handleLoadMore();
  };

  handleSearch = vals => {
    this.value = vals && vals.title ? vals.title : '';
    this.hasMore = true;
    this.currentpageNum = 2;
    this.fetchInitCheckList();
  };

  handleReset = () => {
    this.value = '';
    this.hasMore = true;
    this.currentpageNum = 2;
    this.fetchInitCheckList();
  };

  fetchInitCheckList = index => {
    const { tabIndex, statusList } = this.state;
    const idx = index === undefined ? tabIndex : index;
    const callback = (total, list) => {
      if (total <= PAGE_SIZE) this.hasMore = false;  // 如果第一页已经返回了所有结果，则hasMore置为false
      const newStatus = list.reduce((prev, next) => {
        const { id, status } = next;
        prev[id] = status;
        return prev;
      }, {});
      const newStatusList = statusList.map((sts, index) => index === +idx ? newStatus : sts);
      this.setState({ statusList: newStatusList });
    };

    this.fetchCheckList(1, callback);
  };

  handleLoadMore = () => {
    const currentPageIndex = this.currentpageNum;
    const callback = total => {
      const currentLength = currentPageIndex * PAGE_SIZE;
      this.currentpageNum += 1;
      if (currentLength >= total) this.hasMore = false;
    };
    this.fetchCheckList(currentPageIndex, callback);
  };

  fetchCheckList = (pageIndex, callback) => {
    const { dispatch, match: { params: { companyId } } } = this.props;
    const name = this.value;
    const payload = {
      companyId,
      pageNum: pageIndex,
      pageSize: PAGE_SIZE,
    };
    // if (name)
    //   payload.companyName = name;
    dispatch({
      type: 'checkPoint/fetchCheckList',
      payload,
      callback,
    });
  };

  handleTabChange = key => {
    this.setState({
      tabIndex: key,
    });
  };

  renderPoint = item => {
    const {
      id,
      companyName,
      safetyName,
      safetyPhone,
    } = item;

    const actions = ['查看', '编辑', '删除'];
    const address = ` 地址：${getAddress(item) || NO_DATA}`;
    return (
      <List.Item key={id}>
        <Card
          className={styles.card}
          title={
            <Ellipsis lines={1} tooltip style={{ height: 24 }}>
              {companyName}
            </Ellipsis>
          }
          actions={actions}
        >
          <p className={styles.p}>
            {address.length > 20 ? <Ellipsis lines={1} tooltip>{address}</Ellipsis> : address}
          </p>
          <p className={styles.p}>
            安全负责人：
            {safetyName || NO_DATA}
          </p>
          <p className={styles.pLast}>
            联系电话：
            {safetyPhone || NO_DATA}
          </p>
        </Card>
      </List.Item>
    );
  };

  renderEquipment = item => {
    const {
      id,
      companyId,
      name,
      area,
      location,
      code,
      number,
      status,
    } = item;

    const actions = ['查看', '编辑', '删除'];
    const address = `区域位置：${!area && !location ? NO_DATA : `${area || ''}${location || ''}`}`;
    return (
      <List.Item key={id}>
        <Card
          className={styles.card}
          title={
            <Ellipsis lines={1} tooltip style={{ height: 24 }}>
              {name}
            </Ellipsis>
          }
          actions={actions}
        >
          <p className={styles.p}>
            {address.length > 20 ? <Ellipsis lines={1} tooltip>{address}</Ellipsis> : address}
          </p>
          <p className={styles.p}>
            设备编号：
            {code || NO_DATA}
          </p>
          <p className={styles.p}>
            设备ID：
            {number || NO_DATA}
          </p>
          <p className={styles.pLast}>
            设备状态：
            {status || NO_DATA}
          </p>
        </Card>
      </List.Item>
    );
  };

  renderScreen = item => {
    const {
      id,
      name,
      code,
      ipAddress,
      status,
    } = item;

    const actions = ['查看', '编辑', '删除'];
    const address = ` 地址：${getAddress(item) || NO_DATA}`;
    return (
      <List.Item key={id}>
        <Card
          className={styles.card}
          title={
            <Ellipsis lines={1} tooltip style={{ height: 24 }}>
              {name}
            </Ellipsis>
          }
          actions={actions}
        >
          <p className={styles.p}>
            {address.length > 20 ? <Ellipsis lines={1} tooltip>{address}</Ellipsis> : address}
          </p>
          <p className={styles.p}>
            设备编号：
            {code || NO_DATA}
          </p>
          <p className={styles.p}>
            所在卡口：
            {ipAddress || NO_DATA}
          </p>
          <p className={styles.pLast}>
            设备状态：
            {status || NO_DATA}
          </p>
        </Card>
      </List.Item>
    );
  };

  render() {
    const {
      loading,
      checkPoint: { lists },
    } = this.props;

    const { tabIndex } = this.state;

    const list = lists[tabIndex];
    const toolBarAction = (
      <Button type="primary" onClick={this.handleAdd} style={{ marginTop: '8px' }}>
        新增
      </Button>
    );
    const fields = [
      {
        id: 'name',
        // label: '单位名称：',
        span: { md: 8, sm: 12, xs: 24 },
        render: () => <Input placeholder="请输入单位名称" />,
        transform: v => v.trim(),
      },
    ];
    const itemRenders = [this.renderPoint, this.renderEquipment, this.renderScreen];

    return (
      <PageHeaderLayout
        title={title}
        breadcrumbList={breadcrumbList}
        tabList={TAB_LIST}
        onTabChange={this.handleTabChange}
        tabActiveKey={tabIndex}
        content={
          <p className={styles.total}>
            卡口总数：
            {list.length}
          </p>
        }
      >
        <Card style={{ marginBottom: 15 }}>
          <ToolBar
            fields={fields}
            action={toolBarAction}
            onSearch={this.handleSearch}
            onReset={this.handleReset}
            buttonStyle={{ textAlign: 'right' }}
            buttonSpan={{ xl: 16, sm: 12, xs: 24 }}
          />
        </Card>
        <List
          rowKey="id"
          loading={loading}
          grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
          dataSource={list}
          renderItem={itemRenders[tabIndex]}
        />
      </PageHeaderLayout>
    );
  }
}
