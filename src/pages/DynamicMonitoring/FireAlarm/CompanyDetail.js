import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
// import { Link } from 'react-router-dom';
import { Button, Card, Modal, Tabs, Table } from 'antd';
// import Ellipsis from 'components/Ellipsis';
import DescriptionList from 'components/DescriptionList';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './CompanyDetail.less';

const { TabPane } = Tabs;
const { Description } = DescriptionList;

// const PAGE_SIZE = 10;
// const WEBSOCKT_URL = 'ws://192.168.10.50:3000/test';
const DELAY = 3 * 1000;
const ALARM_ITEMS = ['fire', 'fault', 'start', 'supervise', 'shield', 'feedback'];
const ALARM_ITEMS_CHINESE = ['火警', '故障', '联动', '监管', '屏蔽', '反馈'];

const DETAIL_ITEMS = [
  'name',
  'time',
  'code',
  'failureCode',
  'type',
  'position',
  'alarmStatus',
  'hostStatus',
  'operateTime',
  'safetyName',
  'safetyPhone',
];
const DETAIL_ITEMS_CHINESE = [
  '单位名称',
  '发生时间',
  '主机编号',
  '回路故障号',
  '设施部件类型',
  '具体位置',
  '警情状态',
  '主机状态',
  '复位/关机时间',
  '安全负责人',
  '联系电话',
];

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
  if (typeof ms !== 'number') return '暂无信息';

  const d = new Date(ms);
  return `${d.getFullYear()}-${addZero(d.getMonth() + 1)}-${addZero(d.getDate())} ${addZero(
    d.getHours()
  )}:${addZero(d.getMinutes())}:${addZero(d.getSeconds())}`;
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
export default class CompanyDetail extends PureComponent {
  state = {
    currentTabKey: ALARM_ITEMS[0],
    detailVisible: false,
  };

  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { companyId },
      },
    } = this.props;

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
    }, DELAY);
  }

  componentWillUnmount() {
    // this.socket.close(1000, 'componentUnmount');

    clearInterval(this.timer);
  }

  timer = null;
  // socket = null;

  handleWbMessage = msg => {
    const { dispatch } = this.props;
    dispatch({ type: 'fireAlarm/saveAlarmData', payload: JSON.parse(msg.data) });
  };

  handleTabChange = key => {
    this.setState({ currentTabKey: key });
  };

  handleModalChange = (visible = false) => {
    this.setState({ detailVisible: visible });
  };

  handleDetailCheck = detailId => {
    const {
      dispatch,
      match: {
        params: { companyId },
      },
    } = this.props;
    this.handleModalChange(true);
    dispatch({ type: 'fireAlarm/fetchAlarmDetail', payload: { companyId, detailId } });
  };

  render() {
    // const { fireAlarm: { tableLists }, match: { params: { companyId } } } = this.props;
    const {
      fireAlarm: { tableLists, alarmDetail },
    } = this.props;
    const { currentTabKey, detailVisible } = this.state;

    // console.log(tableLists);

    const COLUMNS = [
      { title: '警情状态', dataIndex: 'status', key: 'status', align: 'center' },
      {
        title: '发生时间',
        dataIndex: 'createTime',
        key: 'createTime',
        align: 'center',
        render: text => convertMsToDate(text),
      },
      { title: '主机编号', dataIndex: 'clientAddr', key: 'clientAddr', align: 'center' },
      { title: '回路故障号', dataIndex: 'failureCode', key: 'failureCode', align: 'center' },
      { title: '设施部件类型', dataIndex: 'type', key: 'type', align: 'center' },
      { title: '具体位置', dataIndex: 'installAddress', key: 'installAddress', align: 'center' },
      // { title: '操作', key: 'operation', align: 'center', render: (text, record) => <Link to={`/dynamic-monitoring/fire-alarm/company/detail/${companyId}/${record.detailId}`}>查看</Link> },
      {
        title: '操作',
        key: 'operation',
        align: 'center',
        render: (text, record) => (
          <a onClick={() => this.handleDetailCheck(record.detailId)}>查看</a>
        ),
      },
    ];

    const okButton = <Button type="primary" onClick={() => { this.handleModalChange(false) }}>确认</Button>;

    return (
      <PageHeaderLayout title={tableLists.name} breadcrumbList={breadcrumbList}>
        <Card>
          <Tabs className={styles.tabs} onChange={this.handleTabChange}>
            {ALARM_ITEMS.map((item, index) => {
              const stateMap = tableLists[`${item}StateMap`] || {};

              return (
                <TabPane
                  tab={
                    <CustomTab
                      num={stateMap[`${item}StateNum`] || 0}
                      tabKey={item}
                      currentTabKey={currentTabKey}
                      itemName={ALARM_ITEMS_CHINESE[index]}
                    />
                  }
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
        <Modal
          title="详情信息"
          width="36%"
          visible={detailVisible}
          onOk={() => this.handleModalChange(false)}
          onCancel={() => this.handleModalChange(false)}
          footer={okButton}
        >
          <DescriptionList>
            {DETAIL_ITEMS.map((item, index) => (
              <Description term={DETAIL_ITEMS_CHINESE[index]} key={item}>
                {alarmDetail[item] === null
                  ? '暂无信息'
                  : item.toLowerCase().includes('time')
                    ? convertMsToDate(alarmDetail[item])
                    : alarmDetail[item]}
              </Description>
            ))}
          </DescriptionList>
        </Modal>
      </PageHeaderLayout>
    );
  }
}
