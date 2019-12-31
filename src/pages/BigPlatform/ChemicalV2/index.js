import React, { PureComponent, Fragment } from 'react';
import { Row, Col, Icon, Badge, notification } from 'antd';
import { connect } from 'dva';
import moment from 'moment';
import WebsocketHeartbeatJs from '@/utils/heartbeat';
import { stringify } from 'qs';
import router from 'umi/router';
import classNames from 'classnames';
import BigPlatformLayout from '@/layouts/BigPlatformLayout';
import { mapMutations } from '@/utils/utils';
// import headerBg from '@/assets/new-header-bg.png';
// import bgImg from '@/pages/BigPlatform/ChemicalV2/imgs/bg.png';
import menuIcon from './imgs/menu-icon.png';
import styles from './index.less';
import {
  RiskPointDrawer,
  RiskPointDetailDrawer,
} from '@/pages/BigPlatform/Safety/Company3/components';
import NewVideoPlay from '@/pages/BigPlatform/NewFireControl/section/NewVideoPlay';
import ImagePreview from '@/jingan-components/ImagePreview';
import { VideoList, MonitorList } from './utils';
import iconFire from '@/assets/icon-fire-msg.png';
import iconFault from '@/assets/icon-fault-msg.png';
import iconAlarm from '@/assets/icon-alarm.png';
import Lightbox from 'react-images';
import TankMonitorDrawer from './sections/TankMonitorDrawer';

import {
  DangerSourceInfoDrawer,
  KeyPoints,
  SafetyOfficerDrawer,
  DangerSourceDrawer,
  Remind,
  Tips,
  CompanyInfo,
  StorageAreaDrawer,
  MonitorDrawer,
  Map,
  DangerAreaDrawer,
  SpecialEquipmentDrawer,
  CurrentHiddenDanger,
  MonitorDetailDrawer,
  DangerSourceLvlDrawer,
  ChemicalDrawer,
  ChemicalDetailDrawer,
  TechnologyDrawer,
  StorageDrawer,
  Messages,
  GasDrawer,
  PoisonDrawer,
} from './sections/Components';

const headerBg = 'http://data.jingan-china.cn/v2/chem/assets/new-header-bg.png';
const bgImg = 'http://data.jingan-china.cn/v2/chem/chemScreen/bg.png';
const HEADER_STYLE = {
  top: 0,
  left: 0,
  width: '100%',
  fontSize: 16,
  zIndex: 99,
  backgroundImage: `url(${headerBg})`,
  backgroundSize: '100% 100%',
};
const DEFAULT_PAGE_SIZE = 10;
const CONTENT_STYLE = { position: 'relative', height: '90.37037%', zIndex: 0 };

const msgInfo = [
  {
    title: '火警提示',
    icon: iconFire,
    color: '#f83329',
    body: '发生报警，',
    bottom: '情况危急，请立即处理！',
    animation: styles.redShadow,
    types: [7, 38],
  },
  {
    title: '故障提示',
    icon: iconFault,
    color: '#f4710f',
    body: '发生故障，',
    bottom: '请及时维修！',
    animation: styles.orangeShadow,
    types: [9, 40],
  },
  {
    title: '报警提示',
    icon: iconAlarm,
    color: '#f83329',
    body: '发生报警，',
    bottom: '情况危急，请立即处理！',
    animation: styles.redShadow,
    types: [32, 36, 39],
  },
];
notification.config({
  placement: 'bottomRight',
  duration: 0,
  bottom: 6,
});
const SocketOptions = {
  pingTimeout: 30000,
  pongTimeout: 10000,
  reconnectTimeout: 2000,
  pingMsg: 'heartbeat',
};
const DEFAULT_FORMAT = 'YYYY-MM-DD HH:mm:ss';
const GET_STATUS_NAME = ({ statusType, warnLevel, fixType }) => {
  if (+statusType === -1) {
    if (+warnLevel === 1) {
      return '预警';
    } else if (+warnLevel === 2) {
      if (+fixType === 5) {
        return '火警';
      } else {
        return '告警';
      }
    }
  } else if (+statusType === -2) {
    return '失联';
  } else if (+statusType === -3) {
    return '故障';
  } else if (+statusType === 1) {
    return '报警解除';
  } else if (+statusType === 2) {
    return '恢复在线';
  } else if (+statusType === 3) {
    return '故障消除';
  }
};

@connect(({ unitSafety, bigPlatform, loading, fourColorImage, chemical }) => ({
  unitSafety,
  bigPlatform,
  chemical,
  fourColorImage,
  hiddenDangerLoading: loading.effects['bigPlatform/fetchHiddenDangerListForPage'],
}))
export default class Chemical extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      riskPointDrawerVisible: false,
      riskPointType: {},
      dangerAreaDrawerVisible: false,
      storageAreaDrawerVisible: false,
      safetyOfficerDrawerVisible: false,
      specialEquipmentDrawerVisible: false,
      videoVisible: false,
      images: null,
      videoList: [],
      currentHiddenDangerDrawerVisible: false,
      monitorDrawerVisible: false,
      monitorType: 0,
      monitorDetailDrawerVisible: false,
      monitorData: {},
      msgVisible: false,
      dangerSourceDrawerVisible: false,
      dangerSourceInfoDrawerVisible: false,
      dangerSourceLvlDrawerVisible: false,
      chemicalDrawerVisible: false,
      chemicalDetailDrawerVisible: false,
      technologyDrawerVisible: false,
      storageDrawerVisible: false,
      riskPointDetailDrawerVisible: false,
      imageFiles: [],
      currentImage: 0,
      modalImgVisible: false,
      gasVisible: false,
      poisonVisible: false,
      tankMonitorDrawerVisible: false,
      hdStatus: 5,
      tankDetail: {},
    };
    this.itemId = 'DXx842SFToWxksqR1BhckA';
    this.ws = null;

    mapMutations(this, {
      namespace: 'unitSafety',
      types: [
        // 获取企业信息
        'fetchCompanyMessage',
        // 获取特种设备数
        'fetchSpecialEquipmentCount',
        // 获取隐患列表
        // 'fetchHiddenDangerList',
        // 获取安全人员信息
        'fetchSafetyOfficer',
        'fetchHiddenDangerCount',
        // 获取特种设备列表
        'fetchSpecialEquipmentList',
        // 获取标准及措施
        'fetchStandardsAndMeasuresList',
        // 获取点位检查标准
        'fetchpointInspectionStandards',
      ],
    });
    mapMutations(this, {
      namespace: 'chemical',
      types: [
        // 统计监测对象各个类型的数量
        'fetchMonitorTargetCount',
        // 到期提醒数量
        'fetchPastStatusCount',
        // 两重点一重大的数量
        'fetchCountDangerSource',
        // app储罐列表
        'fetchTankList',
      ],
    });
  }

  componentDidMount() {
    this.init();
  }

  componentWillUnmount() {
    this.ws.close();
    notification.destroy();
  }

  init = () => {
    const {
      match: {
        params: { unitId: companyId },
      },
      dispatch,
    } = this.props;
    // socket消息
    this.handleSocket();
    // 获取企业信息
    this.fetchCompanyMessage({ company_id: companyId });
    // 获取特种设备数
    this.fetchSpecialEquipmentCount({ company_id: companyId });
    // 获取隐患统计
    this.fetchHiddenDangerCount({ company_id: companyId });
    // 获取安全人员信息（安全人员信息卡片源数据）
    this.fetchSafetyOfficer({ company_id: companyId });
    // 获取特种设备列表
    this.fetchSpecialEquipmentList({ companyId });
    // 统计监测对象各个类型的数量
    this.fetchMonitorTargetCount({ companyId });
    // 到期提醒数量
    this.fetchPastStatusCount({ companyId });
    // 两重点一重大的数量
    this.fetchCountDangerSource({ companyId });

    this.fetchPoints();
    this.fetchHiddenDangerList();
    // 四色图分区
    this.fetchFourColorPolygons();
  };

  handleSocket = () => {
    const {
      match: {
        params: { unitId: companyId },
      },
    } = this.props;
    const { projectKey: env, webscoketHost } = global.PROJECT_CONFIG;
    const params = {
      companyId,
      env: 'v2_test',
      type: 1,
    };
    const url = `ws://${webscoketHost}/websocket?${stringify(params)}`;

    // 链接webscoket
    const ws = new WebsocketHeartbeatJs({ url, ...SocketOptions });
    this.ws = ws;

    ws.onopen = () => {
      console.log('connect success');
      ws.send('heartbeat');
    };

    ws.onmessage = e => {
      // 判断是否是心跳
      if (!e.data || e.data.indexOf('heartbeat') > -1) return;
      try {
        const data = JSON.parse(e.data);
        console.log('e.data', data);
        // if (
        //   ['405', '406'].includes(`${data.monitorEquipmentType}`) &&
        //   ['1', '2'].includes(`${data.warnLevel}`)
        // ) {
        this.showNotification(data);
        // }
      } catch (error) {
        console.log('error', error);
      }
    };

    ws.onreconnect = () => {
      console.log('reconnecting...');
    };
  };

  showNotification = data => {
    const {
      id,
      happenTime,
      statusType,
      warnLevel,
      monitorEquipmentTypeName,
      paramDesc,
      paramUnit,
      monitorValue,
      limitValue,
      monitorEquipmentAreaLocation,
      monitorEquipmentName,
      faultTypeName,
    } = data;
    if (statusType > 0) return;
    const typeName = GET_STATUS_NAME({ statusType, warnLevel });
    const style = {
      boxShadow: `0px 0px 20px #f83329`,
      padding: '14px 20px',
    };
    const styleAnimation = {
      ...style,
      animation: `${styles.redShadow} 2s linear 0s infinite alternate`,
    };
    const options = {
      key: id,
      className: styles.notification,
      style: { ...style, width: screen.availWidth / 5 },
      icon: (
        <span
          className={classNames(
            styles.notificationIcon,
            statusType < 0 ? styles.error : styles.success
          )}
        />
      ),
      message: (
        <div
          className={styles.notificationTitle}
          style={{ color: '#f83329' }}
        >{`刚刚 ${monitorEquipmentTypeName}发生${typeName}`}</div>
      ),
      description: (
        <div className={styles.notificationBody}>
          {/* <div>{`发生时间：${happenTime ? moment(happenTime).format(DEFAULT_FORMAT) : ''}`}</div> */}
          <div>{`刚刚 ${monitorEquipmentTypeName}发生${typeName}`}</div>
          {![-2, -3].includes(+statusType) && (
            <div
              className={styles.alarm}
            >{`监测数值：当前${paramDesc}为${monitorValue}${paramUnit || ''}${
              ['预警', '报警'].includes(typeName)
                ? `，超过${typeName}值${Math.round(Math.abs(monitorValue - limitValue) * 100) /
                    100}${paramUnit || ''}`
                : ''
            }`}</div>
          )}
          {[-3, 3].includes(+statusType) && (
            <div className={styles.alarm}>{`故障类型：${faultTypeName || ''}`}</div>
          )}
          <div>{`监测设备：${monitorEquipmentName || ''}`}</div>
          <div>{`区域位置：${monitorEquipmentAreaLocation || ''}`}</div>
        </div>
      ),
      // duration: 30,
    };
    notification.open(options);

    setTimeout(() => {
      // 解决加入animation覆盖notification自身显示动效时长问题
      notification.open({
        ...options,
        style: { ...styleAnimation, width: screen.availWidth / 5 },
        onClose: () => {
          notification.open({
            ...options,
          });
          setTimeout(() => {
            notification.close(id);
          }, 200);
        },
      });
    }, 800);
  };

  fetchFourColorPolygons = () => {
    const {
      match: {
        params: { unitId: companyId },
      },
      dispatch,
    } = this.props;
    dispatch({
      type: 'fourColorImage/fetchList',
      payload: {
        companyId,
        pageNum: 1,
        pageSize: 0,
      },
    });
  };

  fetchHiddenDangerList = (pageNum = 1) => {
    const {
      match: {
        params: { unitId: companyId },
      },
      dispatch,
    } = this.props;
    const { hdStatus } = this.state;
    dispatch({
      type: 'bigPlatform/fetchHiddenDangerListForPage',
      payload: {
        company_id: companyId,
        // businessType: 2,
        status: hdStatus,
        pageNum,
        pageSize: 10,
      },
    });
  };

  // 点击当前隐患图表进行筛选
  handleFilterCurrentDanger = ({ dataIndex }, callback = null) => {
    const {
      dispatch,
      match: {
        params: { unitId: companyId },
      },
    } = this.props;
    const status =
      (dataIndex === 0 && '7') || (dataIndex === 1 && '2') || (dataIndex === 2 && '3') || 5;
    this.setState({ hdStatus: status });
    // 获取当前隐患列表
    dispatch({
      type: 'bigPlatform/fetchHiddenDangerListForPage',
      payload: {
        company_id: companyId,
        status,
        pageNum: 1,
        pageSize: 10,
      },
    });
  };

  handleDrawerVisibleChange = (name, rest) => {
    const stateName = `${name}DrawerVisible`;
    this.setState(state => ({
      [stateName]: !state[stateName],
      ...rest,
    }));
  };

  handleParentChange = newState => {
    this.setState({ ...newState });
  };

  handleClickMenu = () => {
    router.push('/company-workbench/view');
  };

  /**
   * 设置抽屉是否显示
   * @param {string} drawerName 抽屉名称
   * @param {object} props 其他参数
   */
  setDrawerVisible = (drawerName, props, callback) => {
    const fullName = `${drawerName}DrawerVisible`;
    this.setState(({ [fullName]: visible }) => ({ [fullName]: !visible, ...props }));
    callback && callback(this.props);
  };

  handleShowImg = images => {
    this.setState({ images });
  };

  handleCloseImg = () => {
    this.setState({ images: null });
  };

  handleShowVideo = () => {
    this.setState({ videoList: VideoList, videoVisible: true });
  };

  handleParentChange = newState => {
    this.setState({ ...newState });
  };

  handleClickNotification = () => {
    const style = {
      boxShadow: `0px 0px 20px #f83329`,
    };
    const styleAnimation = {
      ...style,
      animation: `${styles.redShadow} 2s linear 0s infinite alternate`,
    };
    const options = {
      key: 'messageId',
      className: styles.notification,
      message: this.renderNotificationTitle(),
      description: this.renderNotificationMsg(),
      style: { ...style, width: screen.availWidth / 5 },
      // style: { ...style, width: '24%' },
    };
    notification.open({
      ...options,
    });

    this.childMap.handleUpdateMap();

    setTimeout(() => {
      // 解决加入animation覆盖notification自身显示动效时长问题
      notification.open({
        ...options,
        style: { ...styleAnimation, width: screen.availWidth / 5 },
        onClose: () => {
          notification.open({
            ...options,
          });
          setTimeout(() => {
            notification.close('messageId');
          }, 200);
        },
      });
    }, 800);
  };

  renderNotificationTitle = item => {
    const msgItem = msgInfo[2];
    return (
      <div className={styles.notificationTitle} style={{ color: msgItem.color }}>
        <span className={styles.iconFire}>
          <img src={msgItem.icon} alt="fire" />
        </span>
        {msgItem.title}
      </div>
    );
  };

  renderNotificationMsg = () => {
    return (
      <div
        className={styles.notificationBody}
        onClick={() =>
          // this.setDrawerVisible('monitorDetail', { monitorType: 2, monitorData: MonitorList[2][0] })
          this.setDrawerVisible('tankMonitor')
        }
      >
        <div>
          <span className={styles.time}>刚刚</span>{' '}
          {/* <span className={styles.time}>{moment(addTime).format('YYYY-MM-DD HH:mm')}</span>{' '} */}
          {/* <span className={styles.time}>{addTimeStr}</span>{' '} */}
          <span className={styles.address}>{'储罐监测发生报警'}</span>
        </div>
        <div style={{ color: '#f83329' }}>压力为0.15MPa，超过告警值0.05MPa</div>
        <div>监测设备：储罐监测设备</div>
        <div>区域位置：东厂区1号楼危险品液体原料储罐区</div>
      </div>
    );
  };

  onRef = ref => {
    this.childMap = ref;
  };

  /**
   * 获取风险点巡查列表
   */
  getRiskPointInspectionList = restProps => {
    const { dispatch } = this.props;
    dispatch({
      type: 'unitSafety/fetchRiskPointInspectionList',
      payload: {
        itemId: this.itemId,
        pageNum: 1,
        pageSize: DEFAULT_PAGE_SIZE,
        ...restProps,
      },
    });
  };

  /**
   * 获取风险点隐患列表
   */
  getRiskPointHiddenDangerList = restProps => {
    const { dispatch } = this.props;
    dispatch({
      type: 'unitSafety/fetchRiskPointHiddenDangerList',
      payload: {
        itemId: this.itemId,
        pageNum: 1,
        pageSize: DEFAULT_PAGE_SIZE,
        ...restProps,
      },
    });
  };

  /**
   * 获取风险点的隐患统计
   */
  getRiskPointHiddenDangerCount = restProps => {
    const { dispatch } = this.props;
    dispatch({
      type: 'unitSafety/fetchRiskPointHiddenDangerCount',
      payload: {
        itemId: this.itemId,
        ...restProps,
      },
    });
  };

  /**
   * 获取风险点的巡查统计
   */
  getRiskPointInspectionCount = restProps => {
    const { dispatch } = this.props;
    dispatch({
      type: 'unitSafety/fetchRiskPointInspectionCount',
      payload: {
        itemId: this.itemId,
        ...restProps,
      },
    });
  };

  handleClickRiskPoint = (itemId, status) => {
    const { dispatch } = this.props;
    this.itemId = itemId;
    dispatch({
      type: 'unitSafety/fetchRiskPointCardList',
      payload: { itemId, status },
      callback: () => {
        this.setDrawerVisible('riskPointDetail');
      },
    });
    // 获取隐患列表
    this.getRiskPointHiddenDangerList();
    // 获取隐患统计
    this.getRiskPointHiddenDangerCount();
  };

  fetchPoints = () => {
    const {
      dispatch,
      match: {
        params: { unitId: companyId },
      },
    } = this.props;
    dispatch({ type: 'unitSafety/fetchPoints', payload: { companyId } });
  };

  handleClickImgShow = images => {
    this.setState({
      modalImgVisible: true,
      currentImage: 0,
      imageFiles: images,
    });
  };

  handleModalImgClose = () => {
    this.setState({
      modalImgVisible: false,
    });
  };

  // 上一页
  gotoPrevious = () => {
    this.setState(({ currentImage }) => ({
      currentImage: currentImage - 1,
    }));
  };

  // 下一页
  gotoNext = () => {
    this.setState(({ currentImage }) => ({
      currentImage: currentImage + 1,
    }));
  };

  // 图片点击下方缩略图
  handleClickThumbnail = currentImage => {
    this.setState({
      currentImage,
    });
  };

  handleGasOpen = () => {
    this.setState({ gasVisible: true });
  };

  handleGasClose = () => {
    this.setState({ gasVisible: false });
  };

  handlePoisonOpen = () => {
    this.setState({ poisonVisible: true });
  };

  handlePoisonClose = () => {
    this.setState({ poisonVisible: false });
  };

  // 获取标准及措施列表
  getStandardsAndMeasures = () => {
    this.fetchStandardsAndMeasuresList({
      itemId: this.itemId,
      needStandards: 1,
    });
    this.fetchpointInspectionStandards({
      item_id: this.itemId,
    });
  };

  // 储罐列表
  handleClickTankMonitor = () => {
    const {
      match: {
        params: { unitId: companyId },
      },
    } = this.props;
    this.fetchTankList({ companyId, hasMonitor: true, pageSize: 10, pageNum: 0 });
    this.setDrawerVisible('storage');
  };

  // 点击储罐查看详情
  handleClickTank = tankDetail => {
    this.setState({ tankDetail, tankMonitorDrawerVisible: true });
  };

  /**
   * 渲染
   */
  render() {
    const {
      unitSafety: { points },
      bigPlatform: { hiddenDangerList },
      hiddenDangerLoading,
      unitSafety: { hiddenDangerCount },
      fourColorImage: {
        data: { list: polygons },
      },
      chemical: { monitorTargetCount, pastStatusCount, dangerSourceCount, tankList },
    } = this.props;
    const {
      riskPointDrawerVisible,
      riskPointType,
      dangerAreaDrawerVisible,
      storageAreaDrawerVisible,
      safetyOfficerDrawerVisible,
      specialEquipmentDrawerVisible,
      videoVisible,
      videoList,
      images,
      currentHiddenDangerDrawerVisible,
      monitorDrawerVisible,
      monitorType,
      monitorDetailDrawerVisible,
      monitorData,
      msgVisible,
      dangerSourceDrawerVisible,
      dangerSourceInfoDrawerVisible,
      dangerSourceLvlDrawerVisible,
      chemicalDrawerVisible,
      chemicalDetailDrawerVisible,
      riskPointDetailDrawerVisible,
      technologyDrawerVisible,
      storageDrawerVisible,
      imageFiles,
      currentImage,
      modalImgVisible,
      gasVisible,
      poisonVisible,
      tankMonitorDrawerVisible,
      tankDetail,
    } = this.state;

    return (
      <BigPlatformLayout
        title="五位一体信息化管理平台"
        extra={'无锡市'}
        style={{
          background: `url(${bgImg}) no-repeat center`,
          backgroundSize: '100% 100%',
        }}
        headerStyle={HEADER_STYLE}
        titleStyle={{ fontSize: 46 }}
        contentStyle={CONTENT_STYLE}
        other={
          <div
            className={styles.menuBtn}
            style={{ background: `url(${menuIcon}) center center / 100% 100% no-repeat` }}
            onClick={this.handleClickMenu}
          />
        }
      >
        <Tips />
        <div className={styles.container}>
          <Row gutter={15} className={styles.height100}>
            <Col span={6} className={styles.height100}>
              <div className={styles.leftTop}>
                <CompanyInfo handleClickCount={this.setDrawerVisible} />
              </div>

              <div className={styles.leftMiddle}>
                <Remind pastStatusCount={pastStatusCount} />
              </div>

              <div className={styles.leftBottom}>
                <KeyPoints
                  monitorList={monitorTargetCount}
                  dangerSourceCount={dangerSourceCount}
                  setDrawerVisible={this.setDrawerVisible}
                  handleGasOpen={this.handleGasOpen}
                  handlePoisonOpen={this.handlePoisonOpen}
                  handleClickTankMonitor={this.handleClickTankMonitor}
                />
              </div>
            </Col>

            <Col span={18} className={styles.height100}>
              <div className={styles.right}>
                <Map
                  setDrawerVisible={this.setDrawerVisible}
                  showVideo={this.handleShowVideo}
                  onRef={this.onRef}
                  handleClickRiskPoint={this.handleClickRiskPoint}
                  polygons={polygons}
                />

                {msgVisible ? (
                  <Messages
                    setDrawerVisible={this.setDrawerVisible}
                    handleParentChange={this.handleParentChange}
                    handleGasOpen={this.handleGasOpen}
                  />
                ) : (
                  <div className={styles.msgContainer}>
                    {/* <Badge count={3}> */}
                    <Icon
                      type="message"
                      className={styles.msgIcon}
                      onClick={() => this.setState({ msgVisible: true })}
                    />
                    {/* </Badge> */}
                  </div>
                )}

                <div className={styles.fadeBtn} onClick={this.handleClickNotification} />
              </div>
            </Col>
          </Row>
        </div>

        {/* 风险点抽屉 */}
        <RiskPointDrawer
          visible={riskPointDrawerVisible}
          onClose={() => {
            this.setDrawerVisible('riskPoint');
          }}
          data={points}
          riskPointType={riskPointType}
          zIndex={1266}
        />

        {/* 当前隐患抽屉 */}
        <CurrentHiddenDanger
          visible={currentHiddenDangerDrawerVisible}
          onClose={() => {
            this.setDrawerVisible('currentHiddenDanger');
          }}
          hiddenDangerList={hiddenDangerList}
          fetchHiddenDangerList={this.fetchHiddenDangerList}
          onClickChat={this.handleFilterCurrentDanger}
          loading={hiddenDangerLoading}
          {...hiddenDangerCount}
        />

        <DangerAreaDrawer
          visible={dangerAreaDrawerVisible}
          onClose={() => {
            this.setDrawerVisible('dangerArea');
          }}
          setDrawerVisible={this.setDrawerVisible}
          handleShowImg={this.handleShowImg}
          handleShowVideo={this.handleShowVideo}
          handleGasOpen={this.handleGasOpen}
          handlePoisonOpen={this.handlePoisonOpen}
        />

        <StorageAreaDrawer
          visible={storageAreaDrawerVisible}
          onClose={() => {
            this.setDrawerVisible('storageArea');
          }}
        />

        {/* 安全人员抽屉 */}
        <SafetyOfficerDrawer
          visible={safetyOfficerDrawerVisible}
          handleClickImgShow={this.handleClickImgShow}
          onClose={() => {
            this.setDrawerVisible('safetyOfficer');
          }}
        />

        {/* 特种设备抽屉 */}
        <SpecialEquipmentDrawer
          visible={specialEquipmentDrawerVisible}
          onClose={() => {
            this.setDrawerVisible('specialEquipment');
          }}
        />

        <NewVideoPlay
          showList={false}
          videoList={videoList}
          visible={videoVisible}
          keyId={videoList.length > 0 ? videoList[0].key_id : undefined} // keyId
          handleVideoClose={() => this.setState({ videoVisible: false })}
          isTree={false}
        />

        <MonitorDrawer
          visible={monitorDrawerVisible}
          onClose={() => {
            this.setDrawerVisible('monitor');
          }}
          type={monitorType}
          setDrawerVisible={this.setDrawerVisible}
          handleGasOpen={this.handleGasOpen}
          handlePoisonOpen={this.handlePoisonOpen}
        />

        <MonitorDetailDrawer
          visible={monitorDetailDrawerVisible}
          onClose={() => {
            this.setDrawerVisible('monitorDetail');
          }}
          type={monitorType}
          monitorData={monitorData}
          handleShowVideo={this.handleShowVideo}
        />

        {/* 风险点详情抽屉 */}
        <RiskPointDetailDrawer
          visible={riskPointDetailDrawerVisible}
          onClose={() => {
            this.setDrawerVisible('riskPointDetail');
          }}
          getRiskPointInspectionList={this.getRiskPointInspectionList}
          getRiskPointHiddenDangerList={this.getRiskPointHiddenDangerList}
          getRiskPointHiddenDangerCount={this.getRiskPointHiddenDangerCount}
          getRiskPointInspectionCount={this.getRiskPointInspectionCount}
          getStandardsAndMeasures={this.getStandardsAndMeasures}
        />

        <DangerSourceDrawer
          visible={dangerSourceDrawerVisible}
          onClose={() => {
            this.setDrawerVisible('dangerSource');
          }}
          setDrawerVisible={this.setDrawerVisible}
        />

        <DangerSourceInfoDrawer
          visible={dangerSourceInfoDrawerVisible}
          onClose={() => {
            this.setDrawerVisible('dangerSourceInfo');
          }}
          setDrawerVisible={this.setDrawerVisible}
        />

        <DangerSourceLvlDrawer
          visible={dangerSourceLvlDrawerVisible}
          onClose={() => {
            this.setDrawerVisible('dangerSourceLvl');
          }}
          setDrawerVisible={this.setDrawerVisible}
        />

        <ChemicalDrawer
          visible={chemicalDrawerVisible}
          onClose={() => {
            this.setDrawerVisible('chemical');
          }}
          setDrawerVisible={this.setDrawerVisible}
        />

        <ChemicalDetailDrawer
          visible={chemicalDetailDrawerVisible}
          onClose={() => {
            this.setDrawerVisible('chemicalDetail');
          }}
          setDrawerVisible={this.setDrawerVisible}
        />

        <TechnologyDrawer
          visible={technologyDrawerVisible}
          onClose={() => {
            this.setDrawerVisible('technology');
          }}
          setDrawerVisible={this.setDrawerVisible}
        />

        <StorageDrawer
          visible={storageDrawerVisible}
          onClose={() => {
            this.setDrawerVisible('storage');
          }}
          setDrawerVisible={this.setDrawerVisible}
          tankList={tankList}
          handleClickTank={this.handleClickTank}
        />

        <GasDrawer
          visible={gasVisible}
          handleClose={this.handleGasClose}
          handleShowVideo={this.handleShowVideo}
        />

        <PoisonDrawer
          visible={poisonVisible}
          handleClose={this.handlePoisonClose}
          handleShowVideo={this.handleShowVideo}
        />

        <TankMonitorDrawer
          id={'111'}
          visible={tankMonitorDrawerVisible}
          onClose={() => {
            this.setDrawerVisible('tankMonitor');
          }}
          onVideoClick={this.handleShowVideo}
          tankDetail={tankDetail}
        />

        <ImagePreview images={images} onClose={this.handleCloseImg} />

        <Lightbox
          images={imageFiles.map(src => ({ src }))}
          isOpen={modalImgVisible}
          currentImage={currentImage}
          onClickPrev={this.gotoPrevious}
          onClickNext={this.gotoNext}
          onClose={this.handleModalImgClose}
          showThumbnails
          onClickThumbnail={this.handleClickThumbnail}
          imageCountSeparator="/"
        />
      </BigPlatformLayout>
    );
  }
}
