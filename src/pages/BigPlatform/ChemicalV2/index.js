import React, { PureComponent } from 'react';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import { Row, Col, Badge, notification } from 'antd';
import { connect } from 'dva';
// import moment from 'moment';
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
import { GET_STATUS_NAME } from '@/pages/IoT/AlarmMessage';
import NewVideoPlay from '@/pages/BigPlatform/NewFireControl/section/NewVideoPlay';
import ImagePreview from '@/jingan-components/ImagePreview';
import { VideoList, MonitorConfig } from './utils';
import iconFire from '@/assets/icon-fire-msg.png';
import iconFault from '@/assets/icon-fault-msg.png';
import iconAlarm from '@/assets/icon-alarm.png';
import Lightbox from 'react-images';
import TankMonitorDrawer from './sections/TankMonitorDrawer';
import AreaMonitorDrawer from './sections/AreaMonitorDrawer';

import {
  DangerSourceInfoDrawer,
  KeyPoints,
  SafetyOfficerDrawer,
  DangerSourceDrawer,
  Remind,
  Tips,
  CompanyInfo,
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
  MHDrawer,
  MonitorEquipDrawer,
  IoTMonitorDrawer,
  FireMonitorDrawer,
  GasListDrawer,
  FireMonitorDetailDrawer,
  NewMonitorDrawer,
  MonitorTabDrawer,
} from './sections/Components';

const headerBg = 'http://data.jingan-china.cn/v2/chem/assets/new-header-bg.png';
const bgImg = 'http://data.jingan-china.cn/v2/chem/chemScreen/bg.png';
// 可燃气体图片
const iconFlamGas = 'http://data.jingan-china.cn/v2/chem/chemScreen/gas.png';
// 有毒气体图片
const iconToxicGas = 'http://data.jingan-china.cn/v2/chem/chemScreen/poison.png';
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

const GAS_FIELDS = {
  code: 'code', // 编号
  location: 'areaLocation', // 位置
  // imgUrl: 'equipmentTypeLogoWebUrl', // 图片地址
  monitorParams: 'allMonitorParam', // 实时监测的数据
  imgUrl: ({ equipmentType }) =>
    (equipmentType === '405' && iconFlamGas) || (equipmentType === '406' && iconToxicGas) || null,
};
const TANK_FIELDS = {
  name: 'tankName', // 储罐名称
  location: ({ area, location, buildingName, floorName }) =>
    `${buildingName || ''}${floorName || ''}${area || ''}${location || ''}`, // 位置
  monitorParams: 'monitorParams', // 监测参数列表
  capacity: 'designReserves', // 设计储量
  capacityUnit: 'designReservesUnit', // 设计储量单位
  pressure: 'designPressure', // 设计压力
};
const Treasury_FIELDS = {
  name: 'name',
  location: 'position',
  monitorParams: 'monitorParams',
  capacity: ({ unitChemiclaNumDetail }) =>
    unitChemiclaNumDetail.reduce((to, { unitChemiclaNum = 0 }) => (to += +unitChemiclaNum), 0), // 设计储量
};
const msgInfo = [
  {
    title: '火警提示',
    icon: iconFire,
    color: '#f83329',
    body: '发生火警，',
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
  duration: 30,
  bottom: 6,
});
const SocketOptions = {
  pingTimeout: 30000,
  pongTimeout: 10000,
  reconnectTimeout: 2000,
  pingMsg: 'heartbeat',
};
// const DEFAULT_FORMAT = 'YYYY-MM-DD HH:mm:ss';

const transformCondition = condition => {
  if (condition === '>=') return '超过';
  else if (condition === '<=') return '低于';
  return condition;
};

@connect(
  ({
    unitSafety,
    bigPlatform,
    loading,
    fourColorImage,
    chemical,
    specialEquipment,
    newUnitFireControl,
    device,
    storehouse,
    baseInfo,
    materials,
    majorHazardInfo,
    gasMonitor,
    emergencyManagement,
    alarmWorkOrder,
  }) => ({
    unitSafety,
    bigPlatform,
    chemical,
    fourColorImage,
    specialEquipment,
    newUnitFireControl,
    device,
    storehouse,
    baseInfo,
    materials,
    majorHazardInfo,
    gasMonitor,
    emergencyManagement,
    alarmWorkOrder,
    hiddenDangerLoading: loading.effects['bigPlatform/fetchHiddenDangerListForPage'],
    riskPointLoading: loading.effects['unitSafety/fetchPoints'],
    zoneLoading: loading.effects['chemical/fetchZoneContent'],
  })
)
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
      monitorType: undefined,
      monitorDetailDrawerVisible: false,
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
      monitorDetail: {},
      tankMonitorDrawerVisible: false,
      mhVisible: false,
      hdStatus: 5,
      tankDetail: {},
      // 特种设备
      specialEquip: {
        total: 0,
        list: [], // 全部
        expired: [], // 已过期
        notExpired: [], // 未过期
        expiring: [], // 即将到期
      },
      // 罐区监测详情弹窗
      tankAreaDrawerVisible: false,
      // 库区监测详情弹窗
      storehouseDrawerVisible: false,
      // 监测对象详情
      monitorObjectDetail: {},
      // 可燃气体列表
      flameGasList: [],
      // 有毒气体列表
      toxicGasList: [],
      chemicalDetail: {},
      monitorEquipDrawerVisible: false,
      monitorMarker: {},
      dangerSourceDetail: {},
      IoTMonitorDrawerVisible: false,
      fireMonitorDrawerVisible: false,
      selectedEquip: {},
      gasListDrawerVisible: false,
      fireMonitorDetailDrawerVisible: false,
      fireDetail: {},
      newMonitorDrawerVisible: false,
      monitorTabDrawerVisible: false,
    };
    this.itemId = 'DXx842SFToWxksqR1BhckA';
    this.ws = null;

    mapMutations(this, {
      namespace: 'unitSafety',
      types: [
        // 获取企业信息
        'fetchCompanyMessage',
        // 获取特种设备数
        // 'fetchSpecialEquipmentCount',
        // 获取隐患列表
        // 'fetchHiddenDangerList',
        // 获取安全人员信息
        'fetchSafetyOfficer',
        'fetchHiddenDangerCount',
        // 获取特种设备列表
        // 'fetchSpecialEquipmentList',
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
        // 风险点列表
        'fetchRiskPoint',
        // 监测设备列表
        'fetchMonitorEquipment',
        // 公告
        'fetchNotice',
        // 当前隐患总数
        'fetchHiddenDangerTotal',
        // 重大危险源列表
        'fetchDangerSourceList',
        // 重点监管危化品生产存储场所
        'fetchMesageByMaterialId',
        // 统计IoT监测各个类型的数量
        'fetchMonitorEquipCount',
        // 消防主机列表
        'fetchFireDeviceList',
        // 重大危险源存储物质
        'fetchDangerSourceMaterials',
        // 消防主机详情
        'fetchFireDeviceDetail',
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
    } = this.props;
    // 公告
    this.fetchNotice({ pageSize: 1, pageNum: 1, companyId });
    // socket消息
    this.handleSocket();
    // 获取企业信息
    this.fetchCompanyMessage({ company_id: companyId });
    // 获取特种设备数
    // this.fetchSpecialEquipmentCount({ company_id: companyId });
    // 当前隐患总数
    this.fetchHiddenDangerTotal({
      company_id: companyId,
      pageNum: 1,
      pageSize: 10,
      status: 5,
    });
    // 获取安全人员信息（安全人员信息卡片源数据）
    this.fetchSafetyOfficer({ company_id: companyId });
    // 获取特种设备列表
    this.fetchAllSpecialEquipList({ companyId });
    // 统计监测对象各个类型的数量
    this.fetchMonitorTargetCount({ companyId });
    // 统计IoT监测各个类型的数量
    this.fetchMonitorEquipCount({ companyId });
    // 到期提醒数量
    this.fetchPastStatusCount({ companyId });
    // 两重点一重大的数量
    this.fetchCountDangerSource({ companyId });
    // 消息
    this.fetchScreenMessage();
    // 获取特种设备分类字典
    this.fetchSpecialEquipDict();
    // this.fetchPoints();
    // this.fetchHiddenDangerList();
    // 四色图分区
    // this.fetchFourColorPolygons();
  };

  // 获取特种设备列表（全部）
  fetchAllSpecialEquipList = values => {
    const { dispatch } = this.props;
    dispatch({
      type: 'specialEquipment/fetchSpecialEquipList',
      payload: { pageNum: 1, pageSize: 0, ...values },
      callback: ({
        data: {
          pagination: { total = 0 },
          list = [],
        },
      }) => {
        this.setState({
          specialEquip: {
            total,
            list,
            notExpired: list.filter(item => item.paststatus === '0'), // 未过期
            expiring: list.filter(item => item.paststatus === '1'), // 即将过期
            expired: list.filter(item => item.paststatus === '2'), // 已过期
          },
        });
      },
    });
  };

  // 获取特种设备分类字典
  fetchSpecialEquipDict = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'emergencyManagement/fetchDicts',
      payload: { type: 'specialEquipment' },
    });
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
      env,
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
        const data = JSON.parse(e.data).data;
        // console.log('e.data', data);
        const {
          type,
          monitorMessageDto: { monitorEquipmentId, statusType, fireDeviceCode, fixType } = {},
          messageContent = '{}',
        } = data;
        // 更新消息
        this.fetchScreenMessage(data);
        // 更新监测对象各个类型的数量
        this.fetchMonitorTargetCount({ companyId });
        // 更新IoT监测各个类型的数量
        this.fetchMonitorEquipCount({ companyId });
        if (+type === 100) {
          if (fireDeviceCode) {
            // 消防主机
            this.childMap.handleUpdateFire(monitorEquipmentId, statusType, fixType);
          }
          // 报警弹框
          this.showNotification(data);
          // 地图点位弹跳
          monitorEquipmentId && this.childMap.handleUpdateMap(monitorEquipmentId, statusType);
          // 更新监测对象各个类型的数量
          // this.fetchMonitorTargetCount({ companyId });
          // // 更新IoT监测各个类型的数量
          // this.fetchMonitorEquipCount({ companyId });
        } else if (+type === 101) {
          // 变更预警消息
          this.childMap.handleChangeWarning();
          // 添加/替换特种设备图标及信息
          this.childMap.handleAddSpecialEquipment(JSON.parse(messageContent));
        } else if (+type === 52) {
          // 主机复位
          this.childMap.handleUpdateFire();
        }
      } catch (error) {
        console.log('error', error);
      }
    };

    ws.onreconnect = () => {
      console.log('reconnecting...');
    };
  };

  /**
   * 获取大屏消息
   */
  fetchScreenMessage = data => {
    console.log('data', data);

    const {
      match: {
        params: { unitId: companyId },
      },
      dispatch,
    } = this.props;
    dispatch({
      type: 'newUnitFireControl/fetchScreenMessage',
      payload: { companyId },
      success: res => {},
    });
  };

  showNotification = data => {
    const {
      monitorMessageDto: {
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
        condition,
        fixType,
        monitorEquipmentType,
        installAddress,
        monitorEquipmentId,
      },
    } = data;
    if (+statusType !== -1) return;
    const typeName = GET_STATUS_NAME({ statusType, warnLevel, fixType });
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
      style: { ...style },
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
        >{`${typeName}提示`}</div>
      ),
      description: (
        <div
          className={styles.notificationBody}
          onClick={() => {
            monitorEquipmentType === '1'
              ? this.handleClickFireMsg(monitorEquipmentId)
              : this.handleClickMsgEquip(monitorEquipmentId);
          }}
        >
          {/* <div>{`发生时间：${happenTime ? moment(happenTime).format(DEFAULT_FORMAT) : ''}`}</div> */}
          <div>{`刚刚 ${monitorEquipmentTypeName}${typeName}`}</div>
          {[-1].includes(+statusType) &&
            fixType !== 5 && (
              <div
                className={styles.alarm}
              >{`监测数值：当前${paramDesc}为${monitorValue}${paramUnit || ''}${
                ['预警', '告警'].includes(typeName)
                  ? `，${transformCondition(condition)}${typeName}值${Math.round(
                      Math.abs(monitorValue - limitValue) * 100
                    ) / 100}${paramUnit || ''}`
                  : ''
              }`}</div>
            )}
          {/* {![-2, -3].includes(+statusType) && (
            <div
              className={styles.alarm}
            >{`监测数值：当前${paramDesc}为${monitorValue}${paramUnit || ''}${
              ['预警', '告警'].includes(typeName)
                ? `，超过${typeName}值${Math.round(Math.abs(monitorValue - limitValue) * 100) /
                100}${paramUnit || ''}`
                : ''
              }`}</div>
          )}
          {[-3, 3].includes(+statusType) && (
            <div className={styles.alarm}>{`故障类型：${faultTypeName || ''}`}</div>
          )} */}
          {monitorEquipmentType !== '1' && <div>{`监测设备：${monitorEquipmentName || ''}`}</div>}
          <div>{`区域位置：${
            monitorEquipmentType !== '1' ? monitorEquipmentAreaLocation : installAddress || ''
          }`}</div>
        </div>
      ),
      // duration: 30,
    };
    notification.open(options);

    setTimeout(() => {
      // 解决加入animation覆盖notification自身显示动效时长问题
      notification.open({
        ...options,
        style: { ...styleAnimation },
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
    const { hdStatus, zoneId } = this.state;
    dispatch({
      type: 'bigPlatform/fetchHiddenDangerListForPage',
      payload: {
        company_id: companyId,
        // businessType: 2,
        status: hdStatus,
        pageNum,
        pageSize: 10,
        zoneId,
      },
    });
  };

  handleClickHiddenDanger = () => {
    const {
      match: {
        params: { unitId: companyId },
      },
    } = this.props;
    const { zoneId } = this.state;
    this.fetchHiddenDangerCount({ company_id: companyId, zoneId });
    this.fetchHiddenDangerList();
    this.setDrawerVisible('currentHiddenDanger');
  };

  // 点击当前隐患图表进行筛选
  handleFilterCurrentDanger = ({ dataIndex }, callback = null) => {
    const {
      dispatch,
      match: {
        params: { unitId: companyId },
      },
    } = this.props;
    const { zoneId } = this.state;
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
        zoneId,
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

  handleShowVideo = videoList => {
    if (!videoList || !videoList.length) return;
    this.setState({ videoList, videoVisible: true });
  };

  handleParentChange = (newState, callback) => {
    this.setState({ ...newState }, callback);
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

    // this.childMap.handleUpdateMap('mgvmzd3bwa59qi4j', -1);

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
        onClick={() => this.handleClickShowMonitorDetail('302', 'wzebvd6dwgfukxh5')}
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
    const { zoneId } = this.state;
    dispatch({ type: 'unitSafety/fetchPoints', payload: { companyId, zoneId } });
  };

  handleShowRiskPoint = () => {
    this.fetchPoints();
    this.setDrawerVisible('riskPoint', { riskPointType: { key: 'status' } });
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

  handleMHOpen = () => {
    this.setState({ mhVisible: true });
  };

  handleMHClose = () => {
    this.setState({ mhVisible: false });
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
    this.fetchTankList({ companyId, hasMonitor: true, pageSize: 0, pageNum: 1 });
    this.setDrawerVisible('storage');
  };

  // 点击储罐查看详情
  handleClickTank = tankDetail => {
    this.setState({ tankDetail, tankMonitorDrawerVisible: true });
  };

  // 显示监测对象列表弹窗
  handleClickMonitor = monitorType => {
    const {
      match: {
        params: { unitId: companyId },
      },
      dispatch,
    } = this.props;
    if (!MonitorConfig[monitorType]) return;
    dispatch({
      type: 'chemical/fetchMonitorData',
      payload: { companyId, pageSize: 0, pageNum: 1, monitorType, hasMonitor: true },
    });
    // this.setState({ monitorType, monitorDrawerVisible: true });
    if (['304', '303', '301'].includes(monitorType)) {
      this.setState({ monitorType, monitorTabDrawerVisible: true });
    } else if (['302'].includes(monitorType)) {
      this.setState({ monitorType, newMonitorDrawerVisible: true });
    } else {
      this.setState({ monitorType, monitorDrawerVisible: true });
    }
  };

  // 监测设备详情弹窗
  handleClickMonitorIcon = markerProps => {
    this.setDrawerVisible('monitorEquip', {
      monitorMarker: markerProps,
    });
  };

  handleClickShowMonitorDetail = (monitorType, id) => {
    const {
      match: {
        params: { unitId: companyId },
      },
      dispatch,
    } = this.props;
    if (!MonitorConfig[monitorType]) return;
    dispatch({
      type: 'chemical/fetchMonitorData',
      payload: { companyId, pageSize: 0, pageNum: 1, monitorType, id },
      callback: res => {
        if (!res || !res.data) return;
        const {
          data: { list },
        } = res;
        const detail = list[0];
        if (['304', '303', '301', '302'].includes(monitorType)) {
          dispatch({ type: 'chemical/saveMonitorData', payload: { monitorType, list } });
          if (['302'].includes(monitorType))
            this.setState({ monitorType, newMonitorDrawerVisible: true });
          else this.setState({ monitorType, monitorTabDrawerVisible: true });
        } else {
          this.setState({ monitorType }, () => {
            this.handleClickMonitorDetail(detail);
          });
        }
      },
    });
  };

  // 点击地图区域
  handleShowAreaDrawer = id => {
    const {
      dispatch,
      match: {
        params: { unitId: companyId },
      },
    } = this.props;
    dispatch({
      type: 'chemical/fetchZoneContent',
      payload: { id },
    });
    // 可燃
    dispatch({
      type: 'chemical/fetchZoneEquip',
      payload: { zoneId: id, equipmentType: '405', pageNum: 1, pageSize: 0, companyId },
    });
    // 有毒
    dispatch({
      type: 'chemical/fetchZoneEquip',
      payload: { zoneId: id, equipmentType: '406', pageNum: 1, pageSize: 0, companyId },
    });
    this.setState({ zoneId: id });
    this.setDrawerVisible('dangerArea');
  };

  handleShowMonitorDetail = (detail, visible) => {
    this.setState({ monitorDetailDrawerVisible: true, monitorDetail: detail });
  };

  // 监测对象详情
  handleClickMonitorDetail = detail => {
    const { monitorType } = this.state;
    switch (monitorType) {
      case '301':
        // 储罐区
        this.handleViewTankAreaDetail(detail);
        break;
      case '302':
        // 储罐
        this.handleClickTank(detail);
        break;
      case '303':
        // 库区
        this.handleViewReservoirAreaDetail(detail);
        break;
      // case '304':
      //   // 库房
      //   this.handleShowMonitorDetail(detail);
      //   break;
      case '305':
        // 高危工艺
        break;
      case '306':
        // 特种设备
        break;
      // case '311':
      //   // 生产装置
      //   this.handleShowMonitorDetail(detail);
      //   break;
      // case '312':
      //   // 气柜
      //   this.handleShowMonitorDetail(detail);
      //   break;
      default:
        this.handleShowMonitorDetail(detail);
        return null;
    }
  };

  // 查看罐区监测详情
  handleViewTankAreaDetail = detail => {
    // 获取已绑定监测设备
    const {
      dispatch,
      match: {
        params: { unitId: companyId },
      },
    } = this.props;
    dispatch({
      // monitoringDevice{list}
      type: 'device/fetchMonitoringDevice',
      payload: {
        companyId,
        targetId: detail.id,
        pageNum: 1,
        pageSize: 0,
      },
      callback: ({ list }) => {
        this.setState({
          flameGasList: list.filter(item => item.equipmentType === '405'),
          toxicGasList: list.filter(item => item.equipmentType === '406'),
        });
      },
    });
    // 获取储罐区下储罐列表
    dispatch({
      // storageTank {list}
      type: 'baseInfo/fetchStorageTankForPage',
      payload: { pageNum: 1, pageSize: 0, tankArea: detail.id },
    });
    this.setState({ monitorObjectDetail: detail, tankAreaDrawerVisible: true });
  };

  // 查看库区监测详情
  handleViewReservoirAreaDetail = detail => {
    const {
      dispatch,
      match: {
        params: { unitId: companyId },
      },
    } = this.props;
    // 获取已绑定监测设备
    dispatch({
      type: 'device/fetchMonitoringDevice',
      payload: {
        pageNum: 1,
        pageSize: 0,
        companyId,
        targetId: detail.id,
      },
      callback: ({ list }) => {
        this.setState({
          flameGasList: list.filter(item => item.equipmentType === '405'),
          toxicGasList: list.filter(item => item.equipmentType === '406'),
        });
      },
    });
    // 获取库房列表（库房监测）
    dispatch({
      // state= storehouse.list
      type: 'storehouse/fetchStorehouseList',
      payload: {
        pageNum: 1,
        pageSize: 0,
        areaId: detail.id,
      },
    });
    this.setState({ monitorObjectDetail: detail, storehouseDrawerVisible: true });
  };

  // 重大危险源列表
  handleClickDangerSource = () => {
    const {
      match: {
        params: { unitId: companyId },
      },
    } = this.props;
    this.fetchDangerSourceList({ companyId, pageSize: 0, pageNum: 1 });
    this.setDrawerVisible('dangerSource');
  };

  // 重点监管危险化学品列表
  handleShowChemicalList = () => {
    const {
      dispatch,
      match: {
        params: { unitId: companyId },
      },
    } = this.props;
    dispatch({
      type: 'materials/fetchMaterialsList',
      payload: {
        pageNum: 1,
        pageSize: 0,
        superviseChemicals: 1,
        companyId,
      },
    });
    this.setDrawerVisible('chemical');
  };

  // 重点监管危险化学品列表
  handleShowProcessList = () => {
    const {
      dispatch,
      match: {
        params: { unitId: companyId },
      },
    } = this.props;
    dispatch({
      type: 'majorHazardInfo/fetchHighRiskProcessList',
      payload: {
        pageNum: 1,
        pageSize: 0,
        iskeySupervisionProcess: 1,
        companyId,
      },
    });
    this.setDrawerVisible('technology');
  };

  // 重点监管危化品安全措施和应急处置措施
  handleShowChemicalDetail = detail => {
    this.setState({ chemicalDetail: detail });
    this.setDrawerVisible('chemicalDetail');
  };

  // 重大危险源详情
  handleShowDangerSourceDetail = detail => {
    this.setState({ dangerSourceDetail: detail });
    this.setDrawerVisible('dangerSourceInfo');
    this.fetchDangerSourceMaterials({ id: detail.id });
  };

  // 重点监管危化品生产存储场所
  handleShowChemicalStore = detail => {
    this.fetchMesageByMaterialId({ id: detail.id });
    this.setState({ chemicalDetail: detail });
    this.handleMHOpen();
  };

  // 监测设备列表
  handleShowMonitorList = equip => {
    const {
      dispatch,
      match: {
        params: { unitId: companyId },
      },
    } = this.props;
    const { type } = equip;
    this.setState({ selectedEquip: equip });
    if (type === '1') {
      // 消防主机
      this.fetchFireDeviceList({ companyId, pageSize: 0, pageNum: 1 });
      this.setDrawerVisible('fireMonitor');
    } else {
      dispatch({
        type: 'gasMonitor/getRealTimeList',
        payload: {
          pageNum: 1,
          pageSize: 0,
          companyId,
          equipmentType: type,
        },
      });
      this.setDrawerVisible('IoTMonitor');
    }
  };

  handleClickMsgEquip = equipmentId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'alarmWorkOrder/getDeviceDetail',
      payload: { id: equipmentId },
      callback: (success, deviceDetail) => {
        if (success) {
          this.handleClickMonitorIcon(deviceDetail);
        }
      },
    });
  };

  // 分区信息点击重大危险源或可燃有毒
  handleClickAreaDangerSource = (list, monitorType) => {
    const { dispatch } = this.props;
    if (!MonitorConfig[monitorType]) return;
    dispatch({
      type: 'chemical/saveMonitorData',
      payload: { list, monitorType },
    });
    this.setState({ monitorType, monitorDrawerVisible: true });
  };

  // 分区信息点击重大危险源或可燃有毒
  handleClickAreaGas = (list, monitorType) => {
    const { dispatch } = this.props;
    if (!MonitorConfig[monitorType]) return;
    dispatch({
      type: 'chemical/saveMonitorData',
      payload: { list, monitorType },
    });
    this.setState({ monitorType, gasListDrawerVisible: true });
  };

  // 点击地图消防主机
  handleClickFireMonitor = fireDetail => {
    this.setState({ fireDetail });
    this.setDrawerVisible('fireMonitorDetail');
  };

  // 点击消防主机消息
  handleClickFireMsg = monitorEquipmentId => {
    // return null;
    const {
      match: {
        params: { unitId: companyId },
      },
    } = this.props;
    this.fetchFireDeviceDetail(
      {
        id: monitorEquipmentId,
        pageNum: 1,
        pageSize: 0,
        companyId,
      },
      res => {
        const { code, data } = res || {};
        if (code === 200 && data && data.list) {
          const { list: fireDeviceList = [] } = data;
          const fireDeviceDetail = fireDeviceList[0] || {};
          this.handleClickFireMonitor(fireDeviceDetail);
        }
      }
    );
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
      chemical: {
        monitorTargetCount,
        monitorEquipCount,
        fireDeviceList,
        pastStatusCount,
        dangerSourceCount,
        tankList,
        monitorData = {},
        zoneContent = {},
        noticeList,
        dangerSourceList,
        mesageByMaterialId: {
          gasholderManage = [],
          industryPipelines = [],
          productDevice = [],
          tankManages = [],
          warehouseInfos = [],
        },
        dangerSourceMaterials,
        zoneEquip = {},
      },
      match: {
        params: { unitId: companyId },
      },
      newUnitFireControl,
      baseInfo: {
        storageTank: { list: tanksUnderArea },
      },
      storehouse: { list: storeroomList },
      riskPointLoading,
      materials: { list: materialsList },
      majorHazardInfo: {
        highRiskProcess: { list: highRiskProcessList = [] },
      },
      emergencyManagement: { specialEquipment: specialEquipDict = [] },
      gasMonitor: { realTimeList },
      zoneLoading,
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
      monitorDetail,
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
      specialEquip,
      mhVisible,
      tankAreaDrawerVisible,
      monitorObjectDetail,
      flameGasList,
      toxicGasList,
      storehouseDrawerVisible,
      chemicalDetail,
      monitorEquipDrawerVisible,
      monitorMarker,
      dangerSourceDetail,
      IoTMonitorDrawerVisible,
      fireMonitorDrawerVisible,
      selectedEquip,
      gasListDrawerVisible,
      fireMonitorDetailDrawerVisible,
      fireDetail,
      newMonitorDrawerVisible,
      monitorTabDrawerVisible,
    } = this.state;
    const mhList = [
      { list: tankManages, type: 302 },
      { list: gasholderManage, type: 312 },
      { list: warehouseInfos, type: 304 },
      { list: productDevice, type: 311 },
      { list: industryPipelines, type: 314 },
    ].reduce((prev, next) => {
      const { type, list } = next;
      list.forEach(element => {
        prev.push({ type, target: element });
      });
      return prev;
    }, []);
    const href = location.href;

    return (
      <BigPlatformLayout
        title="五位一体信息化管理平台"
        // extra={'无锡市'}
        style={{
          background: `url(${bgImg}) no-repeat center`,
          backgroundSize: '100% 100%',
        }}
        headerStyle={HEADER_STYLE}
        titleStyle={{ fontSize: 46 }}
        contentStyle={CONTENT_STYLE}
        // other={
        //   <div
        //     className={styles.menuBtn}
        //     style={{ background: `url(${menuIcon}) center center / 100% 100% no-repeat` }}
        //     onClick={this.handleClickMenu}
        //   />
        // }
      >
        <Tips noticeList={noticeList} />
        <div className={styles.container}>
          <Row gutter={15} className={styles.height100}>
            <Col span={6} className={styles.height100}>
              <div className={styles.leftTop}>
                <CompanyInfo
                  handleClickCount={this.setDrawerVisible}
                  handleClickHiddenDanger={this.handleClickHiddenDanger}
                  handleShowRiskPoint={this.handleShowRiskPoint}
                  data={{
                    specialEquipmentCount: specialEquip.total,
                  }}
                />
              </div>

              <div className={styles.leftMiddle}>
                <Remind pastStatusCount={pastStatusCount} />
              </div>

              <div className={styles.leftBottom}>
                <KeyPoints
                  monitorList={monitorTargetCount}
                  monitorEquipList={monitorEquipCount}
                  dangerSourceCount={dangerSourceCount}
                  setDrawerVisible={this.setDrawerVisible}
                  handleGasOpen={this.handleGasOpen}
                  handlePoisonOpen={this.handlePoisonOpen}
                  handleClickTankMonitor={this.handleClickTankMonitor}
                  handleClickMonitor={this.handleClickMonitor}
                  handleClickDangerSource={this.handleClickDangerSource}
                  handleShowChemicalList={this.handleShowChemicalList}
                  handleShowProcessList={this.handleShowProcessList}
                  handleShowMonitorList={this.handleShowMonitorList}
                  companyId={companyId}
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
                  companyId={companyId}
                  handleClickTank={this.handleClickTank}
                  handleShowAreaDrawer={this.handleShowAreaDrawer}
                  handleClickMonitorIcon={this.handleClickMonitorIcon}
                  handleClickFireMonitor={this.handleClickFireMonitor}
                />

                {msgVisible ? (
                  <Messages
                    setDrawerVisible={this.setDrawerVisible}
                    handleParentChange={this.handleParentChange}
                    handleGasOpen={this.handleGasOpen}
                    model={newUnitFireControl}
                    handleClickMsgEquip={this.handleClickMsgEquip}
                    handleClickFireMsg={this.handleClickFireMsg}
                  />
                ) : (
                  <div className={styles.msgContainer}>
                    {/* <Badge count={3}> */}
                    <LegacyIcon
                      type="message"
                      className={styles.msgIcon}
                      onClick={() => this.setState({ msgVisible: true })}
                    />
                    {/* </Badge> */}
                  </div>
                )}

                {href.indexOf('five.jinganyun.net') < 0 && (
                  <div className={styles.fadeBtn} onClick={this.handleClickNotification} />
                )}
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
          loading={riskPointLoading}
          zIndex={1266}
          width={535}
          handleClickCard={this.handleClickRiskPoint}
        />

        {/* 当前隐患抽屉 */}
        <CurrentHiddenDanger
          visible={currentHiddenDangerDrawerVisible}
          onClose={() => {
            this.setDrawerVisible('currentHiddenDanger');
          }}
          handleParentChange={this.handleParentChange}
          hiddenDangerList={hiddenDangerList}
          fetchHiddenDangerList={this.fetchHiddenDangerList}
          onClickChat={this.handleFilterCurrentDanger}
          loading={hiddenDangerLoading}
          {...hiddenDangerCount}
        />

        <DangerAreaDrawer
          visible={dangerAreaDrawerVisible}
          onClose={() => {
            this.setDrawerVisible('dangerArea', { zoneId: undefined });
          }}
          setDrawerVisible={this.setDrawerVisible}
          handleShowImg={this.handleShowImg}
          handleShowVideo={this.handleShowVideo}
          handleGasOpen={this.handleGasOpen}
          handlePoisonOpen={this.handlePoisonOpen}
          zoneContent={zoneContent}
          handleClickHiddenDanger={this.handleClickHiddenDanger}
          handleShowRiskPoint={this.handleShowRiskPoint}
          loading={zoneLoading}
          handleClickAreaDangerSource={this.handleClickAreaDangerSource}
          zoneEquip={zoneEquip}
          handleClickAreaGas={this.handleClickAreaGas}
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
          data={specialEquip}
          dict={specialEquipDict}
        />

        <NewVideoPlay
          showList={true}
          style1111={{ position: 'fixed' }}
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
          monitorType={monitorType}
          monitorData={monitorData}
          handleClickMonitorDetail={this.handleClickMonitorDetail}
          setDrawerVisible={this.setDrawerVisible}
          // handleGasOpen={this.handleGasOpen}
          // handlePoisonOpen={this.handlePoisonOpen}
        />

        <NewMonitorDrawer
          visible={newMonitorDrawerVisible}
          onClose={() => {
            this.setDrawerVisible('newMonitor');
          }}
          monitorType={monitorType}
          monitorData={monitorData}
          setDrawerVisible={this.setDrawerVisible}
          handleShowVideo={this.handleShowVideo}
        />

        <MonitorTabDrawer
          visible={monitorTabDrawerVisible}
          onClose={() => {
            this.setDrawerVisible('monitorTab');
          }}
          monitorType={monitorType}
          monitorData={monitorData}
          handleClickMonitorDetail={this.handleClickMonitorDetail}
          setDrawerVisible={this.setDrawerVisible}
          handleShowVideo={this.handleShowVideo}
        />

        {/* <StorageDrawer
          visible={storageDrawerVisible}
          onClose={() => {
            this.setDrawerVisible('storage');
          }}
          setDrawerVisible={this.setDrawerVisible}
          tankList={tankList}
          handleClickTank={this.handleClickTank}
        /> */}

        <MonitorDetailDrawer
          visible={monitorDetailDrawerVisible}
          onClose={() => {
            this.setDrawerVisible('monitorDetail');
          }}
          monitorType={monitorType}
          monitorDetail={monitorDetail}
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
          zIndex={1288}
          width={535}
        />

        <DangerSourceDrawer
          visible={dangerSourceDrawerVisible}
          onClose={() => {
            this.setDrawerVisible('dangerSource');
          }}
          setDrawerVisible={this.setDrawerVisible}
          dangerSourceList={dangerSourceList}
          handleShowDangerSourceDetail={this.handleShowDangerSourceDetail}
        />

        <DangerSourceInfoDrawer
          visible={dangerSourceInfoDrawerVisible}
          onClose={() => {
            this.setDrawerVisible('dangerSourceInfo');
          }}
          setDrawerVisible={this.setDrawerVisible}
          dangerSourceDetail={dangerSourceDetail}
          handleClickShowMonitorDetail={this.handleClickShowMonitorDetail}
          dangerSourceMaterials={dangerSourceMaterials}
        />

        <DangerSourceLvlDrawer
          visible={dangerSourceLvlDrawerVisible}
          onClose={() => {
            this.setDrawerVisible('dangerSourceLvl');
          }}
          setDrawerVisible={this.setDrawerVisible}
          dangerSourceDetail={dangerSourceDetail}
          dangerSourceMaterials={dangerSourceMaterials}
        />

        <ChemicalDrawer
          visible={chemicalDrawerVisible}
          onClose={() => {
            this.setDrawerVisible('chemical');
          }}
          setDrawerVisible={this.setDrawerVisible}
          materialsList={materialsList}
          handleShowChemicalDetail={this.handleShowChemicalDetail}
          handleShowChemicalStore={this.handleShowChemicalStore}
        />

        <ChemicalDetailDrawer
          visible={chemicalDetailDrawerVisible}
          onClose={() => {
            this.setDrawerVisible('chemicalDetail');
          }}
          setDrawerVisible={this.setDrawerVisible}
          chemicalDetail={chemicalDetail}
        />

        <TechnologyDrawer
          visible={technologyDrawerVisible}
          onClose={() => {
            this.setDrawerVisible('technology');
          }}
          setDrawerVisible={this.setDrawerVisible}
          highRiskProcessList={highRiskProcessList}
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

        <MHDrawer
          visible={mhVisible}
          handleClose={this.handleMHClose}
          mhList={mhList}
          chemicalDetail={chemicalDetail}
          handleShowVideo={this.handleShowVideo}
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

        {/* 监测对象--罐区 详情抽屉 */}
        <AreaMonitorDrawer
          title="罐区监测详情"
          visible={tankAreaDrawerVisible}
          data={monitorObjectDetail}
          tabs={[
            {
              tab: '储罐监测',
              dataSourse: tanksUnderArea.filter(item => item.meList && item.meList.length),
              fields: TANK_FIELDS,
            },
            { tab: '可燃气体', dataSourse: flameGasList, fields: GAS_FIELDS },
            { tab: '有毒气体', dataSourse: toxicGasList, fields: GAS_FIELDS },
          ].filter(({ dataSourse }) => dataSourse && dataSourse.length)}
          onClose={() => {
            this.setState({ tankAreaDrawerVisible: false });
          }}
          onVideoClick={this.handleShowVideo}
        />

        {/* 监测对象--库区 详情抽屉 */}
        <AreaMonitorDrawer
          title="库区监测详情"
          visible={storehouseDrawerVisible}
          data={monitorObjectDetail}
          tabs={[
            {
              tab: '库房监测',
              dataSourse: storeroomList.filter(item => item.meList && item.meList.length),
              fields: Treasury_FIELDS,
            },
            { tab: '可燃气体', dataSourse: flameGasList, fields: GAS_FIELDS },
            { tab: '有毒气体', dataSourse: toxicGasList, fields: GAS_FIELDS },
          ].filter(({ dataSourse }) => dataSourse && dataSourse.length)}
          onClose={() => {
            this.setState({ storehouseDrawerVisible: false });
          }}
          onVideoClick={this.handleShowVideo}
        />

        {/* 监测设备弹窗 */}
        <MonitorEquipDrawer
          visible={monitorEquipDrawerVisible}
          onClose={() => {
            this.setDrawerVisible('monitorEquip');
          }}
          monitorMarker={monitorMarker}
          handleShowVideo={this.handleShowVideo}
          handleClickShowMonitorDetail={this.handleClickShowMonitorDetail}
        />

        {/* IoT监测设备弹窗 */}
        <IoTMonitorDrawer
          visible={IoTMonitorDrawerVisible}
          onClose={() => {
            this.setDrawerVisible('IoTMonitor');
          }}
          selectedEquip={selectedEquip}
          list={realTimeList}
          handleShowVideo={this.handleShowVideo}
          handleClickShowMonitorDetail={this.handleClickShowMonitorDetail}
        />

        {/* 主机监测设备弹窗 */}
        <FireMonitorDrawer
          visible={fireMonitorDrawerVisible}
          onClose={() => {
            this.setDrawerVisible('fireMonitor');
          }}
          selectedEquip={selectedEquip}
          list={fireDeviceList}
          handleShowVideo={this.handleShowVideo}
        />

        <GasListDrawer
          visible={gasListDrawerVisible}
          onClose={() => {
            this.setDrawerVisible('gasList');
          }}
          monitorType={monitorType}
          monitorData={monitorData}
          handleClickMonitorDetail={this.handleClickMonitorDetail}
          setDrawerVisible={this.setDrawerVisible}
          handleClickMonitorIcon={this.handleClickMonitorIcon}
        />

        {/* 主机监测详情 */}
        <FireMonitorDetailDrawer
          visible={fireMonitorDetailDrawerVisible}
          onClose={() => {
            this.setDrawerVisible('fireMonitorDetail');
          }}
          fireDetail={fireDetail}
          handleShowVideo={this.handleShowVideo}
        />
      </BigPlatformLayout>
    );
  }
}
