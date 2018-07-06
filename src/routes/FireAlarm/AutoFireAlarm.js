import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Link } from 'react-router-dom';
import { Card, Tabs, Table } from 'antd';
// import Ellipsis from 'components/Ellipsis';

import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './AutoFireAlarm.less';

const { TabPane } = Tabs;

const PAGE_SIZE = 10;
const ALARM_ITEMS = ['fireAlarm', 'failure', 'linkage', 'regulation', 'shield', 'feedback'];
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
    const { currentTabKey } = this.state;

    const pagination = { pageNum: 1, pageSize: PAGE_SIZE };

    dispatch({ type: 'fireAlarm/fetchAlarmNums', payload: companyId });
    this.timer = setInterval(() => {
      dispatch({ type: 'fireAlarm/fetchAlarmNums', payload: companyId });
      dispatch({ type: 'fireAlarm/fetchAlarmTableData', payload: { companyId, item: currentTabKey, pagination } });
    }, Math.random() * 5000 + 5000);

    dispatch({ type: 'fireAlarm/fetchAlarmTableData', payload: { companyId, item: ALARM_ITEMS[0], pagination } });
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  timer = null;

  handleTabChange = key => {
    const { dispatch, match: { params: { companyId } } } = this.props;

    this.setState({ currentTabKey: key });
    dispatch({ type: 'fireAlarm/fetchAlarmTableData', payload: { companyId, item: key } });
  };

  render() {
    const { currentTabKey } = this.state;
    const { fireAlarm: { alarmNums, tableList }, match: { params: { companyId } } } = this.props;

    const COLUMNS = [
      { title: '警情状态', dataIndex: 'status', key: 'status', align: 'center' },
      { title: '发生时间', dataIndex: 'time', key: 'time', align: 'center' },
      { title: '主机编号', dataIndex: 'code', key: 'code', align: 'center' },
      { title: '回路故障号', dataIndex: 'failureCode', key: 'failureCode', align: 'center' },
      { title: '设施部件类型', dataIndex: 'type', key: 'type', align: 'center' },
      { title: '具体位置', dataIndex: 'position', key: 'position', align: 'center' },
      { title: '操作', key: 'operation', align: 'center', render: (text, record) => <Link to={`/fire-alarm/company/detail/${companyId}/${record.id}`}>查看</Link> },
    ];

    return (
      <PageHeaderLayout title="常熟创新科技有限公司" breadcrumbList={breadcrumbList}>
        <Card>
          <Tabs className={styles.tabs} onChange={this.handleTabChange} >
            {ALARM_ITEMS.map((item, index) =>(
              <TabPane tab={<CustomTab num={alarmNums[index]} tabKey={item} currentTabKey={currentTabKey} itemName={ALARM_ITEMS_CHINESE[index]} />} key={item}>
                <Table columns={COLUMNS} dataSource={tableList} pagination={false} rowKey="id" onChange={this.handlePageChange} />
              </TabPane>
            ))}
          </Tabs>
        </Card>
      </PageHeaderLayout>
    );
  }
}
