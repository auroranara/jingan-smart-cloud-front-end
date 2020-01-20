import React, { Component } from 'react';
import { message, Card, Switch, Row, Col } from 'antd';
import InfiniteList from '@/jingan-components/InfiniteList';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import NewVideoPlay from '@/pages/BigPlatform/NewFireControl/section/NewVideoPlay';
import WebsocketHeartbeatJs from '@/utils/heartbeat';
import { stringify } from 'qs';
import { connect } from 'dva';
import classNames from 'classnames';
import moment from 'moment';
import styles from './index.less';

const BREADCRUMB_LIST = [
  { title: '首页', name: '首页', href: '/' },
  { title: '物联设备管理', name: '物联设备管理' },
  { title: '智能空开', name: '智能空开' },
];
const GRID = { gutter: 24, sm: 2, xs: 1 };
const SPAN = { xl: 8, sm: 12, xs: 8 };
const LIST_API = 'intelligentAirSwitch/getList';
const SWITCH_API = 'intelligentAirSwitch/setSwitchStatus';
const RELOAD_API = 'intelligentAirSwitch/reloadList';
const EmptyData = () => <span className={styles.emtpyData}>暂无数据</span>;
const DEFAULT_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const GET_ICON_CLASSNAME = name => {
  if (name.includes('功率')) {
    return styles.power;
  } else if (name.includes('漏电')) {
    return styles.leakageCurrent;
  } else if (name.includes('电流')) {
    return styles.electricity;
  } else if (name.includes('电压')) {
    return styles.voltage;
  } else if (name.includes('温度')) {
    return styles.temperature;
  }
};
const options = {
  pingTimeout: 30000,
  pongTimeout: 10000,
  reconnectTimeout: 2000,
  pingMsg: 'heartbeat',
};

@connect(
  ({ user, intelligentAirSwitch, loading }) => ({
    user,
    intelligentAirSwitch,
    loading: loading.effects[LIST_API],
    switching: loading.effects[SWITCH_API],
  }),
  dispatch => ({
    getList(payload, callback) {
      dispatch({
        type: LIST_API,
        payload: {
          pageNum: 1,
          pageSize: 18,
          equipmentType: 416,
          ...payload,
        },
        callback: (success, data) => {
          if (!success) {
            message.error('获取智能空开列表失败，请稍后重试！');
          }
          callback && callback(success, data);
        },
      });
    },
    setSwitchStatus(payload, callback) {
      dispatch({
        type: SWITCH_API,
        payload,
        callback: (success, data) => {
          if (success) {
            message.success(`操作发送成功，请稍候！`);
          } else {
            message.error(data);
          }
          callback && callback(success, data);
        },
      });
    },
    reloadList(payload, callback) {
      dispatch({
        type: RELOAD_API,
        payload,
        callback,
      });
    },
  })
)
export default class IntelligentAirSwitch extends Component {
  state = {
    tabActiveKey: '0',
    reloading: false,
    switchingList: [],
    videoList: [],
  };

  componentDidMount() {
    const {
      user: {
        currentUser: { unitId },
      },
    } = this.props;
    const { projectKey: env, webscoketHost } = global.PROJECT_CONFIG;

    const params = {
      companyId: unitId,
      env,
      type: 100,
    };
    const url = `ws://${webscoketHost}/websocket?${stringify(params)}`;

    // 链接webscoket
    const ws = new WebsocketHeartbeatJs({ url, ...options });
    this.ws = ws;

    ws.onopen = () => {
      console.log('connect success');
      ws.send('heartbeat');
    };

    ws.onmessage = e => {
      // 判断是否是心跳
      if (!e.data || e.data.indexOf('heartbeat') > -1) return;
      try {
        const data = JSON.parse(e.data).data;
        if (+data.monitorEquipmentType === 416) {
          const { reloadList } = this.props;
          reloadList({ id: data.monitorEquipmentId });
          const { switchingList } = this.state;
          const item = switchingList.find(({ id }) => id === data.monitorEquipmentId);
          if (item && item.airSwitchStatus !== data.airSwitchStatus) {
            // message.success(`${item.name}${+data.airSwitchStatus ? '开启' : '关闭'}成功！`);
            this.setState({
              switchingList: switchingList.filter(v => v !== item),
            });
          }
        }
      } catch (error) {
        console.log('error', error);
      }
    };

    ws.onreconnect = () => {
      console.log('reconnecting...');
    };
  }

  componentWillUnmount() {
    this.ws.close();
  }

  getList = (pageNum = 1, callback) => {
    const {
      user: {
        currentUser: { unitId },
      },
      getList,
    } = this.props;
    getList(
      {
        companyId: unitId,
        pageNum,
      },
      callback
    );
  };

  handleSwitchClick = item => {
    const { setSwitchStatus } = this.props;
    this.setState(({ switchingList }) => ({
      switchingList: [...switchingList, item],
    }));
    setSwitchStatus(
      {
        id: item.id,
        airSwitchStatus: item.airSwitchStatus ^ 1,
      },
      success => {
        if (!success) {
          this.setState(({ switchingList }) => ({
            switchingList: switchingList.filter(({ id }) => id !== item.id),
          }));
        }
      }
    );
  };

  showVideo = videoList => {
    this.setState({
      videoList,
    });
  };

  hideVideo = () => {
    this.setState({
      videoList: [],
    });
  };

  handleTabChange = tabActiveKey => {
    this.setState({
      tabActiveKey,
    });
  };

  renderItem = item => {
    const {
      name,
      areaLocation,
      linkStatus,
      airSwitchStatus,
      videoList,
      allMonitorParam,
      linkStatusUpdateTime,
      dataUpdateTime,
      equipmentTypeLogoWebUrl,
    } = item;
    const { switchingList } = this.state;
    const isOffline = +linkStatus === -1;
    const lineClassName = isOffline ? styles.offline : styles.online;

    return (
      <Card className={styles.card}>
        <div className={styles.cardTop}>
          <div
            className={styles.cardIcon}
            style={{ backgroundImage: `url(${equipmentTypeLogoWebUrl})` }}
          />
          <div className={styles.cardTitle}>
            <div className={styles.cardNameWrapper}>
              <div className={styles.cardName}>{name}</div>
              <div className={classNames(styles.cardOnlineStatus, lineClassName)} />
            </div>
            <div className={styles.cardAddressWrapper}>
              <div className={styles.cardAddressIcon} title="区域位置" />
              <div className={styles.cardAddress}>{areaLocation || <EmptyData />}</div>
              {videoList &&
                videoList.length > 0 && (
                  <div className={styles.cardVideo} onClick={() => this.showVideo(videoList)} />
                )}
            </div>
          </div>
          {!isOffline && (
            <Switch
              className={styles.cardSwitch}
              // checkedChildren="开"
              // unCheckedChildren="关"
              loading={!!switchingList.find(({ id }) => id === item.id)}
              checked={!!+airSwitchStatus}
              onClick={() => this.handleSwitchClick(item)}
            />
          )}
        </div>
        <div className={styles.cardBottom}>
          <div className={styles.updateTimeWrapper}>
            <div className={styles.updateTimeLabel}>
              {isOffline ? '失联时间：' : '最近更新时间：'}
            </div>
            <div className={styles.updateTimeValue}>
              {isOffline ? (
                linkStatusUpdateTime ? (
                  moment(linkStatusUpdateTime).format(DEFAULT_FORMAT)
                ) : (
                  <EmptyData />
                )
              ) : dataUpdateTime ? (
                moment(dataUpdateTime).format(DEFAULT_FORMAT)
              ) : (
                <EmptyData />
              )}
            </div>
          </div>
          <Row className={styles.paramList}>
            {(allMonitorParam || []).map(({ paramDesc, paramUnit, realValue, logoWebUrl }) => (
              <Col key={paramDesc} {...SPAN}>
                <div className={styles.param}>
                  <div
                    className={classNames(
                      styles.paramIcon
                      // GET_ICON_CLASSNAME(paramDesc),
                      // lineClassName
                    )}
                    style={{
                      backgroundImage: `url(${logoWebUrl})`,
                      filter: isOffline ? 'grayscale(100%)' : undefined,
                    }}
                  />
                  <div className={styles.paramContent}>
                    <div className={styles.paramLabel}>
                      {paramDesc}
                      {paramUnit && `（${paramUnit}）`}
                    </div>
                    <div className={styles.paramValue}>
                      {isOffline || realValue === null ? '--' : realValue}
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </Card>
    );
  };

  render() {
    const {
      intelligentAirSwitch: { list, list: { pagination: { total } = {} } = {} },
      loading,
    } = this.props;
    const { tabActiveKey, reloading, videoList } = this.state;
    const tabList = [
      {
        key: '0',
        tab: `全部空开（${total || 0}）`,
      },
    ];

    return (
      <PageHeaderLayout
        className={styles.container}
        title={BREADCRUMB_LIST[BREADCRUMB_LIST.length - 1].title}
        breadcrumbList={BREADCRUMB_LIST}
        tabList={tabList}
        tabActiveKey={tabActiveKey}
        onTabChange={this.handleTabChange}
      >
        <InfiniteList
          className={styles.infiniteList}
          grid={GRID}
          list={list}
          loading={loading}
          reloading={reloading}
          getList={this.getList}
          renderItem={this.renderItem}
        />
        <NewVideoPlay
          style={{ zIndex: 9999, position: 'fixed' }}
          videoList={videoList}
          visible={!!(videoList && videoList.length)}
          showList={true}
          handleVideoClose={this.hideVideo}
        />
      </PageHeaderLayout>
    );
  }
}
