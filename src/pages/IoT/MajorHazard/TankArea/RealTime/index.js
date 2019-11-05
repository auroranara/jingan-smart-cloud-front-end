import React, { Component } from 'react';
import { message, List, Card } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import { connect } from 'dva';
import router from 'umi/router';
import {
  TITLE as SUPER_TITLE,
  URL as SUPER_URL,
  TANK_AREA_HISTORY_URL,
} from '../../index';
import iconHistory from '../../imgs/icon-history.png';
import iconAddress from '../../imgs/icon-address.png';
import iconIsMajorHazard from '../../imgs/icon-is-major-hazard.png';
import styles from './index.less';

const TITLE = '储罐区实时监测';
const BREADCRUMB_LIST = [
  {
    title: '首页',
    name: '首页',
    href: '/',
  },
  {
    title: '物联网监测',
    name: '物联网监测',
  },
  {
    title: SUPER_TITLE,
    name: SUPER_TITLE,
    href: SUPER_URL,
  },
  {
    title: TITLE,
    name: TITLE,
  },
];
const TABS = [
  {
    key: '0',
    tab: '全部储罐区',
  },
  {
    key: '1',
    tab: '报警储罐区',
  },
  {
    key: '2',
    tab: '正常储罐区',
  },
];
const STATUS_MAPPER = [undefined, 0, 1];

@connect(({
  user,
  majorHazardMonitor,
}) => ({
  user,
  majorHazardMonitor,
}), dispatch => ({
  getTankAreaRealTime(payload, callback) {
    dispatch({
      type: 'majorHazardMonitor/getTankAreaRealTime',
      payload,
      callback,
    });
  },
}))
export default class TankAreaRealTime extends Component {
  state = {
    tabActiveKey: TABS[0].key,
    loading: false,
  }

  realTimer = null;

  componentDidMount() {
    this.onTabChange(TABS[0].key);
  }

  getTankAreaRealTime = () => {
    const { getTankAreaRealTime } = this.props;
    const { tabActiveKey } = this.state;
    getTankAreaRealTime({
      status: STATUS_MAPPER[tabActiveKey],
    }, (successful) => {
      if (!successful) {
        message.error('获取储罐区实时监测数据失败，请稍后重试或联系管理人员！');
      }
      // this.setState({
      //   loading: false,
      // });
    });
  }

  setRealTimer = () => {
    setTimeout(() => {
      this.getTankAreaRealTime();
      this.setRealTimer();
    }, 1 * 60 * 1000);
  }

  clearRealTimer = () => {
    clearTimeout(this.realTimer);
  }

  jumpTo = ({ target: { dataset: { url } } }) => {
    router.push(url);
  }

  onTabChange = (tabActiveKey) => {
    this.setState({
      tabActiveKey,
      loading: true,
    }, this.getTankAreaRealTime);
    this.clearRealTimer();
    this.setRealTimer();
  }

  render() {
    const {
      majorHazardMonitor: {
        tankAreaRealTime=[],
      },
    } = this.props;
    const { tabActiveKey, loading } = this.state;

    return (
      <PageHeaderLayout
        className={styles.container}
        title={TITLE}
        breadcrumbList={BREADCRUMB_LIST}
        action={(
          <div className={styles.historyJumper} style={{ backgroundImage: `url(${iconHistory})` }} data-url={TANK_AREA_HISTORY_URL} onClick={this.jumpTo} title="储罐区历史统计" />
        )}
        tabList={TABS}
        tabActiveKey={tabActiveKey}
        onTabChange={this.onTabChange}
      >
        <List
          grid={{ gutter: 24, column: 2 }}
          dataSource={tankAreaRealTime}
          renderItem={item => (
            <List.Item>
              <Card>
                {item.name}
              </Card>
            </List.Item>
          )}
        />
      </PageHeaderLayout>
    );
  }
}
