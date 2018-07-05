import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Link } from 'react-router-dom';
import { Card, Tabs, Table } from 'antd';
// import Ellipsis from 'components/Ellipsis';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './AutoFireAlarm.less';

const { TabPane } = Tabs;

// const PAGE_SIZE = 10;
// const WEBSOCKT_URL = 'ws://192.168.10.50:3000/test';
const ALARM_ITEMS = ['fire', 'fault', 'start', 'supervise', 'shield', 'feedback'];
const ALARM_ITEMS_CHINESE = ['火警', '故障', '联动', '监管', '屏蔽', '反馈'];

const breadcrumbList = [
  { title: '首页', href: '/' },
  { title: '火灾自动报警系统', href: '/fire-alarm/index' },
  { title: '单位页面' },
];

const CustomTab = ({ num, itemName, tabKey, currentTabKey }) => (
  <Fragment>
    <div className={tabKey === currentTabKey ? styles.chosen : styles.unchosen}>{num}</div>
    <p className={styles.tabName}>{itemName}</p>
  </Fragment>
);

export function convertMsToDate(ms) {
  if (typeof ms !== 'number')
    return '暂无信息';

  const d = new Date(ms);
  return `${d.getFullYear()}-${addZero(d.getMonth() + 1)}-${addZero(d.getDate())} ${addZero(d.getHours())}:${addZero(d.getMinutes())}:${addZero(d.getSeconds())}`;
}

function addZero(n) {
  return n < 10 ? `0${n}` : n;
}

// function getNums() {
//   return [...Array(6).keys()].map(() => Math.floor(Math.random() * 100));
// }

@connect(({ fireAlarm, loading }) => ({
  fireAlarm,
  loading: loading.models.fireAlarm,
}))
export default class AutoFireAlarm extends PureComponent {
  state = {
    currentTabKey: ALARM_ITEMS[0],
  };

  componentDidMount() {
    const { dispatch, match: { params: { companyId } } } = this.props;

    // const pagination = { pageNum: 1, pageSize: PAGE_SIZE };

    // const socket = new WebSocket(WEBSOCKT_URL);
    // this.socket = socket;
    // socket.onmessage = this.handleWbMessage;
    // socket.onopen = () => {
    //   message.info('socket open');
    //   socket.send('initial');
    // };
    // socket.onclose = () => message.info('socket closed');

    dispatch({ type: 'fireAlarm/fetchAlarmData', payload: companyId });
    this.timer = setInterval(() => {
      dispatch({ type: 'fireAlarm/fetchAlarmData', payload: companyId });
    }, 2000);
  }

  componentWillUnmount() {
    // this.socket.close(1000, 'componentUnmount');

    clearInterval(this.timer);
  }

  // socket = null;
  timer = null;

  handleWbMessage = msg => {
    const { dispatch } = this.props;
    dispatch({ type: 'fireAlarm/saveAlarmData', payload: JSON.parse(msg.data) });
  };

  handleTabChange = key => {
    this.setState({ currentTabKey: key });
  };

  render() {
    const { currentTabKey } = this.state;
    const { fireAlarm: { tableLists }, match: { params: { companyId } } } = this.props;

    // console.log(tableLists);

    const COLUMNS = [
      { title: '警情状态', dataIndex: 'status', key: 'status', align: 'center' },
      { title: '发生时间', dataIndex: 'createTime', key: 'createTime', align: 'center', render: (text) => convertMsToDate(text) },
      { title: '主机编号', dataIndex: 'clientAddr', key: 'clientAddr', align: 'center' },
      { title: '回路故障号', dataIndex: 'failureCode', key: 'failureCode', align: 'center' },
      { title: '设施部件类型', dataIndex: 'type', key: 'type', align: 'center' },
      { title: '具体位置', dataIndex: 'installAddress', key: 'installAddress', align: 'center' },
      { title: '操作', key: 'operation', align: 'center', render: (text, record) => <Link to={`/fire-alarm/company/detail/${companyId}/${record.detailId}`}>查看</Link> },
    ];

    return (
      <PageHeaderLayout title={tableLists.name} breadcrumbList={breadcrumbList}>
        <Card>
          <Tabs className={styles.tabs} onChange={this.handleTabChange} >
            {ALARM_ITEMS.map((item, index) => {
              const stateMap = tableLists[`${item}StateMap`] || {};

              return (
                <TabPane
                  tab={<CustomTab
                    num={stateMap[`${item}StateNum`] || 0}
                    tabKey={item}
                    currentTabKey={currentTabKey}
                    itemName={ALARM_ITEMS_CHINESE[index]}
                  />}
                  key={item}
                >
                  <Table
                    columns={COLUMNS}
                    dataSource={stateMap[`${item}StateList`] || []}
                    pagination={false}
                    rowKey="detailId"
                    onChange={this.handlePageChange}
                  />
                </TabPane>
              );
            })}
          </Tabs>
        </Card>
      </PageHeaderLayout>
    );
  }
}
