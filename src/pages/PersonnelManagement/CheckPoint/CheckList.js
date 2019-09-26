import React, { PureComponent } from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import Ellipsis from '@/components/Ellipsis';
import { Button, Card, Input, List, Switch } from 'antd';

import ToolBar from '@/components/ToolBar';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import styles from './CompanyList.less';
import { genListLink, genOperateCallback, getAddress, TAB_LIST, POINT_INDEX, EQUIPMENT_INDEX, SCREEN_INDEX, TABS } from './utils';

const title = '卡口列表';
const breadcrumbList = [
  { title: '首页', name: '首页', href: '/' },
  { title: '人员在岗在位管理', name: '人员在岗在位管理' },
  { title: '卡口信息', name: '卡口信息', href: '/personnel-management/check-point/company-list' },
  { title, name: title },
];

const documentElem = document.documentElement;

const NO_DATA = '暂无信息';
const PAGE_SIZE = 18;
const EQUIPMENT = 'equipment';
const SCREEN = 'screen';

@connect(({ checkPoint, loading }) => ({ checkPoint, loading: loading.effects['checkPoint/fetchCheckList'] }))
export default class CheckList extends PureComponent {
  state={ tabIndex: '0', equipmentStatus: {}, screenStatus: {} };

  componentDidMount() {
    const { match: { params: { tabIndex } } } = this.props;
    this.childElem = document.querySelector('#root div');
    document.addEventListener('scroll', this.handleScroll, false);
    [0, 1, 2].forEach(n => this.fetchInitCheckList(n));

    this.setState({ tabIndex });
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.handleScroll);
  }

  value = '';
  hasMore = [true, true, true];
  childElem = null;
  currentpageNum = [2, 2, 2];

  handleScroll = e => {
    const { loading } = this.props;
    const { tabIndex } = this.state;

    const hasMore = this.hasMore[tabIndex];
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
    const { tabIndex } = this.state;

    this.value = vals && vals.name ? vals.name : '';
    this.hasMore[tabIndex] = true;
    this.currentpageNum[tabIndex] = 2;
    this.fetchInitCheckList();
  };

  handleReset = () => {
    const { tabIndex } = this.state;

    this.value = '';
    this.hasMore[tabIndex] = true;
    this.currentpageNum[tabIndex] = 2;
    this.fetchInitCheckList();
  };

  fetchInitCheckList = index => {
    const { tabIndex } = this.state;
    const idx = index === undefined ? tabIndex : index; // 传了就用传的，不传用state里的
    const callback = (total, list) => {
      if (total <= PAGE_SIZE) this.hasMore[idx] = false;  // 如果第一页已经返回了所有结果，则hasMore置为false
      const newStatus = list.reduce((prev, next) => {
        const { id, status } = next;
        prev[id] = !+status;
        return prev;
      }, {});
      this.setState({ [`${+idx === EQUIPMENT_INDEX ? EQUIPMENT : SCREEN}Status`]: newStatus });
    };

    this.fetchCheckList(idx, 1, callback);
  };

  handleLoadMore = () => {
    const { tabIndex } = this.state;
    const currentPageIndex = this.currentpageNum[tabIndex];
    const callback = total => {
      const currentLength = currentPageIndex * PAGE_SIZE;
      this.currentpageNum[tabIndex] += 1;
      if (currentLength >= total) this.hasMore[tabIndex] = false;
    };
    this.fetchCheckList(tabIndex, currentPageIndex, callback);
  };

  fetchCheckList = (index, pageIndex, callback) => {
    const { dispatch, match: { params: { companyId } } } = this.props;
    const name = this.value;
    const payload = {
      companyId,
      pageNum: pageIndex,
      pageSize: PAGE_SIZE,
    };
    if (name)
      payload.name = name;
    dispatch({
      type: 'checkPoint/fetchCheckList',
      index,
      payload,
      callback,
    });
  };

  handleTabChange = key => {
    this.setState({
      tabIndex: key,
    });
  };

  genSwitchChange = (item, tabIndex) => checked => {
    const { dispatch } = this.props;
    const { id } = item;
    const prop = `${+tabIndex === EQUIPMENT_INDEX ? EQUIPMENT : SCREEN}Status`;
    const status = this.state[prop];
    const newStatus = { ...status, [id]: checked };

    dispatch({
      index: tabIndex,
      type: 'checkPoint/editCheckPoint',
      payload: { ...item, status: +!checked },
      callback: genOperateCallback('', () => this.setState({ [prop]: newStatus })),
    });
  };

  genLink = (index, id) => {
    const { dispatch, match: { params: { companyId } } } = this.props;
    return genListLink(dispatch, companyId, index, id);
  };

  renderPoint = item => {
    const { id, name, location, direction, photoList } = item;

    const actions = this.genLink(POINT_INDEX, id);
    const address = `卡口位置：${location || NO_DATA}`;
    const photo = photoList && photoList.length ? photoList[0].webUrl : '';
    return (
      <List.Item key={id}>
        <Card
          className={styles.card1}
          title={
            <Ellipsis lines={1} tooltip style={{ height: 24 }}>
              {name}
            </Ellipsis>
          }
          actions={actions}
        >
          <p className={styles.p}>
            {address.length > 20 ? <Ellipsis lines={1} tooltip style={{ height: '1.5em' }}>{address}</Ellipsis> : address}
          </p>
          <p className={styles.pLast}>
            方向：
            {direction || NO_DATA}
          </p>
          {photo && <div className={styles.photo} style={{ backgroundImage: `url(${photo})` }} />}
        </Card>
      </List.Item>
    );
  };

  renderEquipment = item => {
    const { id, name, area, location, code, number } = item;

    const { equipmentStatus } = this.state;

    const actions = this.genLink(EQUIPMENT_INDEX, id);
    const address = `区域位置：${!area && !location ? NO_DATA : `${area || ''}${location || ''}`}`;
    const sts = equipmentStatus[id];
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
          extra={sts === undefined || sts ? null : <span className={styles.red}>禁用</span>}
        >
          <p className={styles.p}>
            {address.length > 20 ? <Ellipsis lines={1} tooltip style={{ height: '1.5em' }}>{address}</Ellipsis> : address}
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
            <Switch
              checkedChildren="启用"
              unCheckedChildren="禁用"
              checked={sts}
              onChange={this.genSwitchChange(item, EQUIPMENT_INDEX)}
            />
          </p>
        </Card>
      </List.Item>
    );
  };

  renderScreen = item => {
    const { id, name, code, ipAddress } = item;

    const { screenStatus } = this.state;

    const sts = screenStatus[id];
    const actions = this.genLink(SCREEN_INDEX, id);
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
          extra={sts === undefined || sts ? null : <span className={styles.red}>禁用</span>}
        >
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
            <Switch
              checkedChildren="启用"
              unCheckedChildren="禁用"
              checked={screenStatus[id]}
              onChange={this.genSwitchChange(item, SCREEN_INDEX)}
            />
          </p>
        </Card>
      </List.Item>
    );
  };

  handleAdd = () => {
    const { match: { params: { companyId } } } = this.props;
    const { tabIndex } = this.state;
    router.push(`/personnel-management/check-point/add/${companyId}/${tabIndex}`);
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
        render: () => <Input placeholder={`请输入${TABS[tabIndex]}名称`} />,
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
            {TABS[tabIndex]}总数：
            {list.length}
          </p>
        }
      >
        <Card style={{ marginBottom: 15 }}>
          <ToolBar
            key={tabIndex}
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
