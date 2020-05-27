import React, { Component, Fragment } from 'react';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import { message, List, Card, Carousel, notification } from 'antd';
import PageHeaderLayout from '@/layouts/PageHeaderLayout';
import NewVideoPlay from '@/pages/BigPlatform/NewFireControl/section/NewVideoPlay';
import CustomEmpty from '@/jingan-components/CustomEmpty';
import locales from '@/locales/zh-CN';
import { connect } from 'dva';
import WebsocketHeartbeatJs from '@/utils/heartbeat';
import { stringify } from 'qs';
import router from 'umi/router';
import classNames from 'classnames';
import moment from 'moment';
import { toFixed } from '@/utils/utils';
import {
  GET_STATUS_NAME,
} from '@/pages/IoT/AlarmMessage';
import styles from './index.less';

const GET_REAL_TIME_LIST = 'gasMonitor/getRealTimeList';
const TAB_LIST = [
  { key: '0', tab: '全部监测设备' },
  { key: '1', tab: '报警监测设备' },
  { key: '2', tab: '正常监测设备' },
];
const WARN_STATUS_MAPPER = {
  1: -1,
  2: 0,
};
const GRID = { gutter: 24, column: 3, xl: 3, md: 2, sm: 1, xs: 1 };
const options = {
  pingTimeout: 30000,
  pongTimeout: 10000,
  reconnectTimeout: 2000,
  pingMsg: 'heartbeat',
};
const DEFAULT_FORMAT = 'YYYY-MM-DD HH:mm:ss';

@connect(({ user: { currentUser: { unitId } }, gasMonitor }, { route: { code } }) => {
  const { breadcrumbList } = code.split('.').reduce((result, item) => {
    const key = `${result.key}.${item}`;
    const title = locales[key];
    result.key = key;
    result.breadcrumbList.push({
      title,
      name: title,
    });
    return result;
  }, {
    breadcrumbList: [
      { title: '首页', name: '首页', href: '/' },
    ],
    key: 'menu',
  });
  return {
    unitId,
    breadcrumbList,
    gasMonitor,
  };
}, (dispatch) => ({
  getRealTimeList(payload, callback) {
    dispatch({
      type: GET_REAL_TIME_LIST,
      payload,
      callback: (success, data) => {
        if (!success) {
          message.error('获取列表数据失败，请稍后重试或联系管理人员！');
        }
        callback && callback(success, data);
      },
    });
  },
}))
export default class GasRealTime extends Component {
  state = {
    loading: false,
    tabActiveKey: undefined,
    videoList: [],
    videoVisible: false,
    videoKeyId: undefined,
  }

  myTimer = null

  componentDidMount() {
    const { unitId } = this.props;
    const { projectKey: env, webscoketHost } = global.PROJECT_CONFIG;
    this.handleTabChange(TAB_LIST[0].key);

    const params = {
      companyId: unitId,
      env: 'v2_test',
      type: 12,
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
        console.log(data);
        if (['405', '406'].includes(`${data.monitorEquipmentType}`)) {
          this.reload();
          if (['1', '2'].includes(`${data.warnLevel}`)) {
            this.showNotification(data);
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
    notification.destroy();
    clearTimeout(this.myTimer);
  }

  reload = (callback) => {
    const {
      unitId,
      getRealTimeList,
    } = this.props;
    const { tabActiveKey } = this.state;
    clearTimeout(this.myTimer);
    getRealTimeList({
      companyId: unitId,
      equipmentTypes: '405,406',
      warnStatus: WARN_STATUS_MAPPER[tabActiveKey],
    }, () => {
      callback && callback();
      this.setTimer();
    });
  }

  setTimer = () => {
    this.myTimer = setTimeout(() => {
      this.reload();
    }, 5 * 1000);
  }

  showNotification = ({
    id,
    happenTime,
    statusType,
    fixType,
    warnLevel,
    monitorEquipmentTypeName,
    paramDesc,
    paramUnit,
    monitorValue,
    limitValue,
    monitorEquipmentAreaLocation,
    monitorEquipmentName,
    faultTypeName,
  }) => {
    const typeName = GET_STATUS_NAME({ statusType, warnLevel, fixType });
    notification.open({
      key: id,
      icon: <span className={classNames(styles.notificationIcon, statusType < 0 ? styles.error : styles.success)} />,
      message: `${monitorEquipmentTypeName}${[-1, -2, -3].includes(+statusType) ? '发生' : ''}${typeName}`,
      description: (
        <Fragment>
          <div>{`发生时间：${happenTime ? moment(happenTime).format(DEFAULT_FORMAT) : ''}`}</div>
          {![-2, -3].includes(+statusType) && <div>{`监测数值：当前${paramDesc}为${monitorValue}${paramUnit || ''}${['预警', '告警'].includes(typeName) ? `，超过${typeName}值${Math.abs(monitorValue - limitValue)}${paramUnit || ''}` : ''}`}</div>}
          {[-3, 3].includes(+statusType) && <div>{`故障类型：${faultTypeName || ''}`}</div>}
          <div>{`监测设备：${monitorEquipmentName || ''}`}</div>
          <div>{`区域位置：${monitorEquipmentAreaLocation || ''}`}</div>
        </Fragment>
      ),
      btn: <span className={styles.clickable} onClick={() => {
        router.push("/company-iot/alarm-message/list");
      }}>查看更多</span>,
      duration: 30,
    });
  }

  showVideo = (videoList) => {
    this.setState({
      videoList,
      videoVisible: true,
      videoKeyId: videoList[0].key_id,
    });
  }

  hideVideo = () => {
    this.setState({
      videoVisible: false,
    });
  }

  handleTabChange = (tabActiveKey) => {
    this.setState({
      loading: true,
      tabActiveKey,
    }, () => {
      this.reload(() => {
        this.setState({
          loading: false,
        });
      });
    });
  }

  handleJumpToWorkOrderDetail = ({ target: { dataset: { id } } }) => {
    router.push(`/company-iot/alarm-work-order/detail/${id}`);
  }

  handleJumpToWorkOrderMonitorTrend = ({ target: { dataset: { id } } }) => {
    router.push(`/company-iot/alarm-work-order/monitor-trend/${id}`);
  }

  renderParamValue = ({ realValue, limitValue, status }) => {
    if (!+status) {
      return (
        <div className={styles.paramValueWrapper}>
          <div className={styles.paramValue}>{realValue}</div>
        </div>
      );
    } else if (+status === 1) {
      return (
        <div className={styles.paramValueWrapper}>
          <div className={styles.alarmParamValue}>{realValue}</div>
          <div className={styles.paramTrendWrapper}>
            <LegacyIcon className={styles.paramTrendIcon} type="caret-up" style={{ color: '#f5222d' }} />
            <div className={styles.paramTrendValue}>{toFixed(Math.abs(realValue - limitValue))}</div>
            <div className={styles.paramTrendDescription}>超过预警阈值</div>
          </div>
        </div>
      );
    } else if (+status === 2) {
      return (
        <div className={styles.paramValueWrapper}>
          <div className={styles.alarmParamValue}>{realValue}</div>
          <div className={styles.paramTrendWrapper}>
            <LegacyIcon className={styles.paramTrendIcon} type="caret-up" style={{ color: '#f5222d' }} />
            <div className={styles.paramTrendValue}>{toFixed(Math.abs(realValue - limitValue))}</div>
            <div className={styles.paramTrendDescription}>超过告警阈值</div>
          </div>
        </div>
      );
    }
  }

  renderParam = (item) => {
    const { id, linkStatus, linkStatusUpdateTime, dataUpdateTime, paramDesc, paramUnit } = item;
    const isLoss = +linkStatus === -1;
    const updateTime = isLoss ? linkStatusUpdateTime : dataUpdateTime;
    return (
      <div className={styles.paramWrapper} key={id}>
        <div className={styles.paramName}>{`${paramDesc}${paramUnit ? `（${paramUnit}）` : ''}`}</div>
        {isLoss ? (
          <div className={styles.paramValue}>--</div>
        ) : this.renderParamValue(item)}
        <div className={styles.updateTime}><div>最近更新时间：</div><div>{updateTime && moment(updateTime).format(DEFAULT_FORMAT)}</div></div>
      </div>
    );
  }

  render() {
    const {
      breadcrumbList,
      gasMonitor: {
        realTimeList=[],
      },
    } = this.props;
    const { tabActiveKey, videoList, videoVisible, videoKeyId, loading } = this.state;

    return (
      <PageHeaderLayout
        className={styles.container}
        title={breadcrumbList[breadcrumbList.length - 1].title}
        breadcrumbList={breadcrumbList}
        tabList={TAB_LIST}
        tabActiveKey={tabActiveKey}
        onTabChange={this.handleTabChange}
      >
        <List
          grid={GRID}
          loading={loading}
          dataSource={realTimeList}
          renderItem={({ id, equipmentTypeLogoWebUrl, name, warnStatus, areaLocation, videoList, noFinishWarningProcessId, allMonitorParam }) => (
            <List.Item>
              <Card>
                <div className={styles.top}>
                  <div className={styles.basicInfoWrapper} style={{ backgroundImage: `url(${equipmentTypeLogoWebUrl})` }}>
                    <div className={styles.nameWrapper}>
                      <div className={styles.nameLabel}>监测设备名称：</div>
                      <div className={styles.nameValue}>
                        {name}
                        {+warnStatus === -1 && <div className={styles.isAlarm} />}
                      </div>
                    </div>
                    <div className={styles.addressWrapper}>
                      <LegacyIcon type="environment" className={styles.addressIcon} title="监测设备地址" />
                      <div className={styles.addressValue}>
                        {areaLocation || '暂无数据'}
                        {videoList && videoList.length > 0 && <div className={styles.video} onClick={() => this.showVideo(videoList)} />}
                      </div>
                    </div>
                  </div>
                  <div className={styles.workOrderJumperWrapper}>
                    {noFinishWarningProcessId && <span className={styles.workOrderJumper} onClick={this.handleJumpToWorkOrderDetail} data-id={noFinishWarningProcessId}>工单动态>></span>}
                  </div>
                </div>
                <div className={styles.bottom}>
                  <div className={styles.monitorTrendJumperWrapper}>
                    <span className={styles.monitorTrendJumper} onClick={this.handleJumpToWorkOrderMonitorTrend} data-id={id}>监测趋势>></span>
                  </div>
                  {allMonitorParam && allMonitorParam.length ? (
                    <Carousel className={styles.carousel}>
                      {allMonitorParam.map(this.renderParam)}
                    </Carousel>
                  ) : (
                    <CustomEmpty className={styles.emptyParam} label="暂无参数" />
                  )}
                </div>
              </Card>
            </List.Item>
          )}
        />
        <NewVideoPlay
          style={{ zIndex: 9999 }}
          videoList={videoList}
          visible={videoVisible}
          showList={true}
          keyId={videoKeyId}
          handleVideoClose={this.hideVideo}
        />
      </PageHeaderLayout>
    );
  }
}
