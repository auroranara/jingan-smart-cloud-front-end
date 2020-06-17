import React, { PureComponent, Fragment } from 'react';
import { Map as GDMap, InfoWindow, Marker, Polygon } from 'react-amap';
import classnames from 'classnames';
import moment from 'moment';
import { connect } from 'dva';
import NewVideoPlay from '@/pages/BigPlatform/NewFireControl/section/NewVideoPlay';
import TruckModal from '../components/TruckModal';
import { MINUTE_FORMAT, TYPES, WORKING_STATUSES } from '@/pages/DataAnalysis/WorkingBill/config';
import styles from './Map.less';

import monitor from '../imgs/monitor.png';
import riskPoint from '../imgs/risk-point.png';
import video from '../imgs/video.png';
import mapDot from '@/pages/BigPlatform/NewFireControl/img/mapDot.png';
import monitorActive from '../imgs/monitor-active.png';
import monitorGray from '../imgs/monitor-gray.png';
import riskPointActive from '../imgs/risk-point-active.png';
import riskPointGray from '../imgs/risk-point-gray.png';
import videoActive from '../imgs/video-active.png';
import videoGray from '../imgs/video-gray.png';
import position from '../imgs/position.png';
import monitorAlarm from '../imgs/monitor-alarm.png';
import specialEquipment from '../imgs/special-equipment.png';
import specialEquipmentActive from '../imgs/special-equipment-active.png';
import specialEquipmentGray from '../imgs/special-equipment-gray.png';
import iconTips from '../imgs/icon-tips.png';
import iconCar from '../imgs/icon-car.png';
import iconFace from '../imgs/icon-face.png';
import workBill from '../imgs/work-bill.png';
import workBillActive from '../imgs/work-bill-active.png';
import workBillGray from '../imgs/work-bill-gray.png';
import workBillAlarm from '../imgs/work-bill-alarm.png';
import positionActive from '../imgs/position-active.png';
import positionGray from '../imgs/position-gray.png';
import helmet1 from '../imgs/helmet-1.png';

// 风险等级1红 2橙 3黄 4蓝
const COLORS = [
  'rgba(254, 0, 3, 0.5)',
  'rgba(236, 106, 52, 0.5)',
  'rgba(236, 242, 65, 0.5)',
  'rgba(20, 35, 196, 0.5)',
];
const StrokeColor = [
  'rgba(254, 0, 3, 1)',
  'rgba(236, 106, 52, 1)',
  'rgba(236, 242, 65, 1)',
  'rgba(20, 35, 196, 1)',
];
let map;
let popInfoWindow;
const controls = [
  { label: '风险点', icon: riskPointGray, activeIcon: riskPointActive, markerIcon: riskPoint },
  { label: '视频监控', icon: videoGray, activeIcon: videoActive, markerIcon: video },
  {
    label: '监测设备',
    icon: monitorGray,
    activeIcon: monitorActive,
    markerIcon: monitor,
    alarmIcon: monitorAlarm,
  },
  {
    label: '特种设备',
    icon: specialEquipmentGray,
    activeIcon: specialEquipmentActive,
    markerIcon: specialEquipment,
  },
  {
    label: '人员定位',
    icon: positionGray,
    activeIcon: positionActive,
    markerIcon: helmet1,
  },
  {
    label: '作业票',
    icon: workBillGray,
    activeIcon: workBillActive,
    markerIcon: workBill,
    alarmIcon: workBillAlarm,
  },
];
const paststatusVal = {
  0: '',
  1: '检验即将到期',
  2: '检验已过期',
  null: '',
};
function getColorVal(status) {
  switch (+status) {
    case 0:
      return 'rgba(0, 0, 0, 0.65)';
    case 1:
      return 'rgb(250, 173, 20)';
    case 2:
      return '#f5222d';
    default:
      return;
  }
}
const FourColors = [
  {
    color: '#FE0003',
    label: '重大风险',
  },
  {
    color: '#EC6A34',
    label: '较大风险',
  },
  {
    color: '#ECF241',
    label: '一般风险',
  },
  {
    color: '#1423C4',
    label: '低风险',
  },
];
const filterMarkerList = markerList => {
  return markerList.filter(({ pointFixInfoList }) => {
    if (pointFixInfoList && pointFixInfoList.length > 0) {
      const [{ isShow }] = pointFixInfoList;
      if (+isShow) return true;
    }
    return false;
  });
};

const mapChangeObj = map => {
  let obj = {};
  for (let [k, v] of map) {
    obj[k] = v;
  }
  return obj;
};

@connect(
  ({
    map,
    chemical,
    alarmWorkOrder,
    user,
    specialEquipment,
    emergencyManagement,
    changeWarning,
    licensePlateRecognitionSystem,
    workingBill,
  }) => ({
    map,
    chemical,
    alarmWorkOrder,
    user,
    specialEquipment,
    emergencyManagement,
    changeWarning,
    licensePlateRecognitionSystem,
    workingBill,
  })
)
export default class Map extends PureComponent {
  state = {
    gdMapVisible: false,
    visibles: [true, false, false, false, false, false],
    videoVisible: false,
    videoList: [],
    keyId: undefined,
    truckModalVisible: false,
  };

  ids = [];
  fourColorPolygons = []; // 四色图polygons
  polygonLayers = [];
  markerArray = [];
  markerLayers = [];
  lastTime = 0;
  jumpEquipIds = [];
  jumpFireIds = [];
  workBillMarkers = []; // 作业票markers
  workBillPolygons = []; // 作业票polygons

  /* eslint-disable*/
  componentDidMount() {
    // this.initMap();
    const { companyId } = this.props;
    this.fetchMap();
    const { onRef } = this.props;
    onRef && onRef(this);
    this.fetchDict({ type: 'specialEquipment' });
    this.fetchOnDuty({ companyId });
  }

  fetchMap = () => {
    const { mapInfo } = this.props;
    this.initMap({ ...mapInfo }, () => {
      this.fetchMapAreaList();
      [
        'chemical/fetchRiskPoint',
        'chemical/fetchVideoList',
        'chemical/fetchMonitorEquipment',
        'specialEquipment/fetchSpecialEquipList',
      ].map((type, index) => {
        this.fetchPonits(type, index);
        return null;
      });
      this.fetchPonits('chemical/fetchFireDevice', 2);
      this.renderPosition();
      this.renderWorkingBill();
    });
  };

  renderPosition = () => {
    // 人员定位
    this.fetchPonits('chemical/fetchMonitorEquipment', 4);
  };

  renderWorkingBill = () => {
    // 作业票
    const { dispatch, companyId } = this.props;
    const iconType = 5;
    dispatch({
      type: 'workingBill/getList',
      payload: {
        companyId,
        pageNum: 1,
        pageSize: 0,
        // approveStatus: 2,
        // startWorkingDate: moment().format('YYYY-MM-DD 00:00'),
        // endWorkingDate: moment().format('YYYY-MM-DD 23:59'),
      },
      callback: (success, { list }) => {
        if (!success) return;
        list.map(item => {
          const { mapAddress } = item;
          const { visibles } = this.state;
          if (!mapAddress || !JSON.parse(mapAddress).length) return;
          const points = JSON.parse(mapAddress);
          const { floorId, x, y, z } = points[0];
          const polygonMarker = this.addPolygon({
            floorId: +floorId,
            points,
            color: COLORS[3],
            strokeColor: StrokeColor[3],
            polygonProps: { ...item, polygonType: 2 }, // polygonType 1 四色图， 2 作业票
            show: visibles[iconType],
          });
          this.workBillPolygons.push(polygonMarker);

          const marker = this.addMarkers({
            image: workBill, //图片路径
            position: new jsmap.JSPoint(+x, +y, 0),
            floorId: +floorId, //楼
            properties: { ...item, iconType },
            show: visibles[iconType],
          });
          this.workBillMarkers.push(marker);
        });
      },
    });
  };

  fetchDict = (payload, success, error) => {
    const { dispatch } = this.props;
    dispatch({ type: 'emergencyManagement/fetchDicts', payload, success, error });
  };

  fetchOnDuty = (payload, callback) => {
    const { dispatch } = this.props;
    dispatch({ type: 'chemical/fetchOnDuty', payload, callback });
  };

  // 获取区域列表
  fetchMapAreaList = () => {
    const { dispatch, companyId } = this.props;
    dispatch({
      type: 'map/fetchMapAreaList',
      payload: { companyId, pageNum: 1, pageSize: 0 },
      callback: ({ list }) => {
        list.map(polygon => {
          const { zoneLevel, coordinateList, groupId, modelIds } = polygon;
          const points = coordinateList.map(item => ({ x: +item.x, y: +item.y, z: +item.z }));
          const polygonMarker = this.addPolygon({
            floorId: +groupId,
            points,
            color: COLORS[zoneLevel - 1],
            strokeColor: StrokeColor[zoneLevel - 1],
            polygonProps: { ...polygon, polygonType: 1 },
          });
          return null;
        });
        // 变更预警管理
        this.handleChangeWarning();
      },
    });
  };

  // 变更预警管理
  handleChangeWarning = () => {
    const { dispatch, companyId } = this.props;
    dispatch({
      type: 'chemical/fetchWarningNewList',
      payload: { companyId, pageNum: 1, pageSize: 0, status: 0 },
      callback: response => {
        const { code, data } = response || {};
        if (!(code === 200 && data && data.list)) return;
        const warningList = data.list;
        this.removeMarkersByType(-1);
        this.fourColorPolygons.map(polygon => {
          const properties = polygon.getProperties();
          const coordinateList = properties.get('coordinateList');
          const id = properties.get('id');
          const floorId = +properties.get('groupId');
          if (JSON.stringify(warningList).indexOf(id) < 0) {
            if (popInfoWindow) {
              // 关闭风险变更的提示
              const {
                options_: { zoneId },
              } = popInfoWindow;
              if (id === zoneId) popInfoWindow.show = false;
            }
            return null;
          }
          this.addMarkers({
            image: iconTips, //图片路径
            position: new jsmap.JSPoint(+coordinateList[0].x, +coordinateList[0].y, 0),
            floorId, //楼
            properties: { zoneId: id, iconType: -1 },
            width: 25,
            height: 25,
            offset: jsmap.JSControlPosition.CENTER,
          });
          return null;
        });
      },
    });
  };

  // 添加/替换特种设备图标及信息
  handleAddSpecialEquipment = info => {
    const { id } = info;
    this.removeMarkerById(id);
    this.renderPoints([info], 3);
  };

  renderPoints = (pointsInfo, iconType) => {
    // if (!pointsInfo.length) return;
    const { visibles } = this.state;
    filterMarkerList(pointsInfo).map(item => {
      const { warnStatus, status, deviceCode, pointCountMap, id } = item;
      const { groupId, xnum, ynum, znum } = item.pointFixInfoList[0];
      if (iconType === 1 && +status !== 1) return null; // 筛选掉禁用的视频
      let url = controls[iconType].markerIcon;
      if (iconType === 2) {
        if (deviceCode || deviceCode === 0) {
          // 消防主机
          const { fire_state } = pointCountMap || {};
          if (+fire_state > 0) url = controls[iconType].alarmIcon;
          else controls[iconType].markerIcon;
        } else if (warnStatus === -1) url = controls[iconType].alarmIcon;
      }
      const marker = this.addMarkers({
        image: url, //图片路径
        position: new jsmap.JSPoint(+xnum, +ynum, 0),
        floorId: +groupId, //楼
        properties: { ...item, iconType },
        show: visibles[iconType],
      });
      return null;
    });
  };

  // 获取点位信息
  fetchPonits = (type, iconType, payload = {}, isUpdate = false) => {
    if (!type) return null;
    const { dispatch, companyId } = this.props;
    dispatch({
      type,
      payload: { companyId, pageNum: 1, pageSize: 0, ...payload },
      callback: res => {
        console.log('pointsInfo', filterMarkerList(res.data.list));
        if (isUpdate) this.removeMarkersByType(iconType);
        this.renderPoints(res.data.list, iconType);
      },
    });
  };

  handleJumpChangeWarning = () => {
    window.open(`${window.publicPath}#/risk-control/change-warning/list`, `_blank`);
  };

  // 初始化地图定位
  initMap = (
    { appName, key, mapId, defaultMapScaleLevel, theme, mapScaleLevelRangeList, defaultViewMode },
    fun
  ) => {
    if (!key || !mapId) return;
    const mapOptions = {
      mapType: jsmap.JSMapType.MAP_PSEUDO_3D,
      container: 'mapContainer',
      token: key,
      mapServerURL: './data/map',
      backgroundColor: 'transparent',
    };
    map = new jsmap.JSMap(mapOptions);
    map.openMapById(mapId);
    console.log('map', map);

    // 地图加载完成事件
    map.on('loadComplete', () => {
      if (!map) return;
      this.loadBtnFloorCtrl();
      // 四色图
      fun && fun();
    });

    // 地图点击事件
    map.on('mapClickNode', event => {
      const {
        handleClickRiskPoint,
        setDrawerVisible,
        handleShowAreaDrawer,
        handleClickMonitorIcon,
        handleClickFireMonitor,
      } = this.props;
      const clickedObj = event;
      console.log('clickedObj', clickedObj);
      if (!clickedObj || !clickedObj.nodeType) return;
      const {
        nodeType,
        floorId,
        eventInfo: { coord },
      } = clickedObj;
      if (nodeType === jsmap.JSNodeType.POLYGON_MARKER) {
        // 点击区域
        const { visibles } = this.state;
        // 作业票 return
        if (visibles[5]) return;
        const { id } = clickedObj;
        handleShowAreaDrawer(id);
      }
      if (nodeType === jsmap.JSNodeType.IMAGE_MARKER) {
        // 点击图标
        const { properties, node } = clickedObj;
        const iconType = properties.get('iconType');
        const markerProps = mapChangeObj(properties);
        switch (iconType) {
          case 0:
            // 风险点
            const itemId = properties.get('itemId');
            const status = properties.get('status');
            handleClickRiskPoint(itemId, status);
            break;
          case 1:
            // 视频监控
            const keyId = properties.get('keyId');
            this.handleShowVideo(keyId);
            break;
          case 2:
            // 监测设备
            const deviceCode = properties.get('deviceCode');
            if (deviceCode || deviceCode === 0) {
              // 消防主机
              handleClickFireMonitor(markerProps);
            } else {
              // 监测设备
              this.handleClickMonitorEquip(markerProps.id);
            }
            break;
          case 3:
            // 特种设备
            this.handleShowSpecialInfo(markerProps, floorId, new jsmap.JSPoint(node.x, node.y, 0));
            break;
          case 5:
            // 作业票
            this.handleShowWorkBillInfo(markerProps, floorId, new jsmap.JSPoint(node.x, node.y, 0));
            break;
          case -1:
            // 变更预警
            const { zoneId } = markerProps;
            this.handleShowChangeWarning(zoneId, floorId, new jsmap.JSPoint(node.x, node.y, 0));
            break;
          default:
            console.log('iconType', iconType);
            break;
        }
      }
    });
  };

  // 点击监测设备重新获取信息 重绘点位 显示详情内容
  handleClickMonitorEquip = equipmentId => {
    const { dispatch, handleClickMonitorIcon } = this.props;
    dispatch({
      type: 'alarmWorkOrder/getDeviceDetail',
      payload: { id: equipmentId },
      callback: (success, deviceDetail) => {
        if (success) {
          this.removeMarkerById(equipmentId);
          this.renderPoints([deviceDetail], 2);
          handleClickMonitorIcon(deviceDetail);
        }
      },
    });
  };

  // 变更预警
  handleShowChangeWarning = (zoneId, floorId, position) => {
    const { companyId } = this.props;
    if (popInfoWindow) {
      map.removeMarker(popInfoWindow);
      popInfoWindow = null;
    }
    const content = `<div style="line-height: 24px;font-size: 14px;padding: 10px 15px;height: 100%;border: 1px solid #f83329;border-radius: 5px;min-width: 400px;color: #fff;">
          <div style="font-size: 16px;">
            <span style="display: inline-block;width: 20px;height: 20px;margin-right: 5px;position: relative;top: 4px;background: url(${iconTips}) center center / 100% 100% no-repeat;"></span>
            风险变更预警
          </div>
          <div style="padding-left: 30px;">此区域有变更，请对该区域重新进行风险评价。</div>
          <div style="text-align: right;color: #0ff;">
            <span style="cursor: pointer;" onclick="window.open('${
              window.publicPath
            }#/risk-control/change-warning/list?companyId=${companyId}&status=0&zoneId=${zoneId}','_blank');">查看详情>></span></div>
        </div>`;
    popInfoWindow = new jsmap.JSPopInfoMarker({
      id: 'popInfoWindow',
      floorId: map.focusFloorId,
      content,
      position,
      properties: { zoneId },
      showCloseButton: true,
    });
    map.addMarker(popInfoWindow);
  };

  handleShowSpecialInfo = (info, floorId, position) => {
    const {
      emergencyManagement: { specialEquipment = [] },
    } = this.props;
    const { brand, equipName, factoryNumber, contact, endDate, category, paststatus, id } = info;
    const pastColor = getColorVal(paststatus);
    const paststatusStr = paststatusVal[paststatus]
      ? `<span style="font-size: 12px;color: ${pastColor};border: 1px solid ${pastColor};padding: 0 8px;border-radius: 10px;margin-left: 25px;">${
          paststatusVal[paststatus]
        }</span>`
      : '';
    let treeData = specialEquipment;
    const string = category
      .split(',')
      .map(id => {
        const val = treeData.find(item => item.id === id) || {};
        treeData = val.children || [];
        return val.label;
      })
      .join('>');
    const noData = '--';
    const content = `<div class="specContainer">
      <div class="specTitle">特种设备${paststatusStr}</div>
      <div class="specWrapper specOver">
        <div class="specLabel">分类：</div>
        <div class="specValue">${string || noData}</div>
        <div class="specTip">
          <span class="specTrigle"></span>
          ${string || noData}
        </div>
      </div>
      <div class="specWrapper">
        <div class="specLabel">品牌：</div>
        <div class="specValue">${brand || noData}</div>
      </div>
      <div class="specWrapper">
        <div class="specLabel">设备名称：</div>
        <div class="specValue">${equipName || noData}</div>
      </div>
      <div class="specWrapper">
        <div class="specLabel">出厂编号：</div>
        <div class="specValue">${factoryNumber || noData}</div>
      </div>
      <div class="specWrapper">
        <div class="specLabel">联系人：</div>
        <div class="specValue">${contact || noData}</div>
      </div>
      <div class="specWrapper">
        <div class="specLabel">检验有效期至：</div>
        <div class="specValue">${endDate ? moment(endDate).format('YYYY年MM月DD日') : noData}</div>
      </div>
      <div class="specFile" onclick="window.open('${
        window.publicPath
      }#/facility-management/special-equipment/inspection-report/${id}','_blank');">查看检验报告>></div>
    </div>
    <style>
      .specContainer {
        position: relative;
        line-height: 24px;
        color: #fff;
        font-size: 14px;
        padding: 10px 15px;
        height: 100%;
        border: 1px solid rgba(0,255,255,0.3);
        border-radius: 5px;
        min-width: 450px;
      }
      .specTitle {
        font-size: 16px;
        line-height: 32px;
      }
      .specOver {
        position: relative;
      }
      .specTip {
        display: none;
        position: absolute;
        width: calc(100% - 11em);
        left: 7em;
        background: #116fda;
        z-index: 6;
        padding: 6px 12px;
        border-radius: 5px;
        top: 28px;
      }
      .specTrigle {
        position: absolute;
        top: -16px;
        left: 15px;
        width: 0;
        height:0;
        display: inline-block;
        border-style: solid;
        border-width: 10px;
        border-color: #116fda transparent transparent;
        width: 0px;
        height: 0px;
        transform: rotate(180deg);
      }
      .specOver:hover .specTip {
        display: block;
      }
      .specLabel {
        color: #979495;
        display: inline-block;
        width: 7em;
        white-space: nowrap;
        vertical-align: middle;
      }
      .specValue {
        display: inline-block;
        width: calc(100% - 7.5em);
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        vertical-align: middle;
      }
      .specFile {
        color: #0ff;
        position: absolute;
        bottom: 10px;
        right: 15px;
        cursor: pointer;
      }
    </style>`;
    if (popInfoWindow) {
      map.removeMarker(popInfoWindow);
      popInfoWindow = null;
    }
    popInfoWindow = new jsmap.JSPopInfoMarker({
      id: 'popInfoWindow',
      floorId: map.focusFloorId,
      content,
      position,
      // marginTop: 0,
      properties: info,
      showCloseButton: true,
      // callback: node => {
      //   console.log('node', node);
      // },
    });
    map.addMarker(popInfoWindow);
  };

  handleShowWorkBillInfo = (info, floorId, position) => {
    console.log('info', info);
    console.log('position', position);
    const {
      billCode,
      billType,
      workingStatus,
      applyUserName,
      applyDepartmentName,
      workingEndDate,
      workingStartDate,
      id,
    } = info;
    const noData = '--';
    const content = `<div class="specContainer">
        <div class="specTitle">作业票</div>
        <div class="specWrapper">
          <div class="specLabel">作业证名称：</div>
          <div class="specValue">${(TYPES.find(item => +item.key === +billType) || {}).value ||
            noData}</div>
        </div>
        <div class="specWrapper">
          <div class="specLabel">作业证编号：</div>
          <div class="specValue">${billCode || noData}</div>
        </div>
        <div class="specWrapper">
          <div class="specLabel">申请人：</div>
          <div class="specValue">${applyUserName || noData}</div>
        </div>
        <div class="specWrapper">
          <div class="specLabel">申请部门：</div>
          <div class="specValue">${applyDepartmentName || noData}</div>
        </div>
        <div class="specWrapper">
          <div class="specLabel">作业时间：</div>
          <div class="specValue">${moment(workingStartDate).format(MINUTE_FORMAT)} ~ ${moment(
      workingEndDate
    ).format(MINUTE_FORMAT)}</div>
        </div>
        <div class="specWrapper">
          <div class="specLabel">作业状态：</div>
          <div class="specValue">${(
            WORKING_STATUSES.find(item => +item.key === +workingStatus) || {}
          ).value || noData}</div>
        </div>
        <div class="specFile" onclick="window.open('${
          window.publicPath
        }#/operation-safety/working-bill/${billType}/detail/${id}','_blank');">详情>></div>
      </div>
      <style>
        .specContainer {
          position: relative;
          line-height: 24px;
          color: #fff;
          font-size: 14px;
          padding: 10px 15px;
          height: 100%;
          border: 1px solid rgba(0,255,255,0.3);
          border-radius: 5px;
          min-width: 450px
        }
        .specTitle {
          font-size: 16px;
          line-height: 32px;
        }
        .specLabel {
          color: #979495;
          display: inline-block;
          width: 7em;
          white-space: nowrap;
          vertical-align: middle;
        }
        .specValue {
          display: inline-block;
          width: calc(100% - 7.5em);
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          vertical-align: middle;
        }
        .specFile {
          color: #0ff;
          position: absolute;
          bottom: 10px;
          right: 15px;
          cursor: pointer;
        }
      </style>`;
    if (popInfoWindow) {
      map.removeMarker(popInfoWindow);
      popInfoWindow = null;
    }
    popInfoWindow = new jsmap.JSPopInfoMarker({
      id: 'popInfoWindow',
      floorId: map.focusFloorId,
      content,
      position,
      // marginTop: 0,
      properties: info,
      showCloseButton: true,
      // callback: node => {
      //   console.log('node', node);
      // },
    });
    map.addMarker(popInfoWindow);
  };

  //加载按钮型楼层切换控件
  loadBtnFloorCtrl = () => {
    const {
      user: {
        currentUser: { permissionCodes },
      },
    } = this.props;
    const floorControl = new jsmap.JSFloorControl({
      position: jsmap.JSControlPosition.LEFT_TOP, //控件在容器中的位置             ??????
      showBtnCount: 6, //默认显示楼层的个数 TODO
      allLayers: false, //初始是否是多层显示，默认单层显示
      needAllLayerBtn: true, // 是否显示多层/单层切换按钮
      offset: {
        x: 0,
        y: permissionCodes.includes('dashboard.personnelPositioningView') ? 45 : -5,
      }, //位置 x,y 的偏移量
    });
    map.addControl(floorControl);
  };

  removeMarkersByType = iconType => {
    if (!map) return;
    map.removeMarkerByFilter(jsmap.JSMarkerType.IMAGE_MARKER, `iconType == ${iconType}`);
  };

  removeMarkerById = equipmentId => {
    if (!map) return;
    map.removeMarkerByFilter(jsmap.JSMarkerType.IMAGE_MARKER, `id == '${equipmentId}'`);
    return null;
  };

  // 监测设备状态变化
  handleUpdateMap = (equipmentId, statusType) => {
    if (!map || !this.markerArray.length) return;
    const { dispatch, companyId } = this.props;
    dispatch({
      type: 'alarmWorkOrder/getDeviceDetail',
      payload: { id: equipmentId },
      callback: (success, deviceDetail) => {
        if (success) {
          const { warnStatus } = deviceDetail;
          this.removeMarkerById(equipmentId);
          if (statusType === -1) {
            if (this.jumpEquipIds.indexOf(equipmentId) < 0) this.jumpEquipIds.push(equipmentId);
          } else if (statusType === 1 && warnStatus !== -1) {
            this.jumpEquipIds = this.jumpEquipIds.filter(ids => ids !== equipmentId);
          }
          this.renderPoints([deviceDetail], 2);
        }
      },
    });
  };

  handleUpdateFire = (equipmentId, statusType, fixType) => {
    if (equipmentId && +statusType === -1 && +fixType === 5) {
      // 火警
      if (this.jumpFireIds.indexOf(equipmentId) < 0) this.jumpFireIds.push(equipmentId);
    }
    const { dispatch, companyId } = this.props;
    dispatch({
      type: 'chemical/fetchFireDevice',
      payload: { companyId, pageNum: 1, pageSize: 0 },
      callback: res => {
        const pointsInfo = filterMarkerList(res.data.list);
        pointsInfo.map(item => {
          const { pointCountMap } = item;
          const { fire_state } = pointCountMap || {};
          this.removeMarkerById(item.id);
          this.renderPoints([item], 2);
          if (!fire_state) this.jumpFireIds = this.jumpFireIds.filter(ids => ids !== item.id);
        });
      },
    });
    return null;
  };

  addMarkers = (markerProps = {}) => {
    // console.log('markerProps', markerProps);

    const imageMarker = new jsmap.JSImageMarker({
      // id: 'selectedMarker', //id
      image: monitor, //图片路径
      position: new jsmap.JSPoint(0, 0, 0), //坐标位置
      width: 50, //尺寸-宽
      height: 50, //尺寸-高
      floorId: 1, //楼层 id
      offset: jsmap.JSControlPosition.RIGHT_BOTTOM, //偏移位置
      depthTest: false, //是否开启深度检测
      ...markerProps,
      show: undefined, // ??????????
      callback: node => {
        node.show = markerProps.show === undefined ? true : !!markerProps.show;
      }, //回调
    });
    map.addMarker(imageMarker);
    this.markerArray.push(imageMarker);
    return imageMarker;
  };

  addPolygon = ({ floorId, points, color, strokeColor, polygonProps = {}, show = true }) => {
    const polygonMarker = new jsmap.JSPolygonMarker({
      id: polygonProps.id,
      position: points.map(item => ({ ...item, z: 0 })),
      floorId,
      color,
      strokeColor: strokeColor,
      properties: polygonProps,
      strokeWidth: 2, //边线宽度
      depthTest: false, //是否开启深度检测
      callback: marker => {
        marker.show = show;
      },
    });
    this.fourColorPolygons.push(polygonMarker);
    map.addMarker(polygonMarker);
    return polygonMarker;
  };
  /* eslint-disable*/

  handleClickMap = () => {
    this.setState({ gdMapVisible: false });
    this.initMap();
  };

  // 跳转到人员定位
  handlePosition = () => {
    const { companyId } = this.props;
    window.open(`${window.publicPath}#/big-platform/personnel-position/${companyId}`, `_blank`);
  };

  // 切换图标是否显示
  handleClickControl = index => {
    const { visibles } = this.state;
    const copy = [...visibles];
    copy[index] = !visibles[index];
    this.setState({ visibles: copy });
    if (index === 0) {
      // setMarkerVisibleByFilter, iconType == 0不行    ?????????????
      this.markerArray.map(item => {
        const properties = item.getProperties();
        const iconType = properties.get('iconType');
        if (iconType === 0) item.show = copy[index];
        return null;
      });
      return;
    }
    map.setMarkerVisibleByFilter(
      jsmap.JSMarkerType.IMAGE_MARKER,
      copy[index],
      `iconType == ${index}`
    );
  };

  // 作业票是否显示
  handleToggleWorkBill = iconType => {
    const { visibles } = this.state;
    const visible = visibles[iconType];
    map.setMarkerVisibleByFilter(jsmap.JSMarkerType.POLYGON_MARKER, !visible, `polygonType == 2`);
    map.setMarkerVisibleByFilter(
      jsmap.JSMarkerType.IMAGE_MARKER,
      !visible,
      `iconType == ${iconType}`
    );

    // 四色图与作业票互斥
    map.setMarkerVisibleByFilter(jsmap.JSMarkerType.POLYGON_MARKER, visible, `polygonType == 1`);

    const copy = [...visibles];
    copy[iconType] = !visible;
    this.setState({ visibles: copy });
  };

  handleShowVideo = keyId => {
    this.setState({ videoVisible: true, keyId });
  };

  handleShowTruckModal = () => {
    this.fetchCountByParkId();
    this.fetchPresenceRecordList();
    // this.fetchAbnormalRecordList();
    this.setState({ truckModalVisible: true });
  };

  handleCloseTruckModal = () => {
    this.setState({ truckModalVisible: false });
  };

  // 车辆统计
  fetchCountByParkId = () => {
    const { companyId, dispatch } = this.props;
    dispatch({ type: 'chemical/fetchCountByParkId', payload: { companyId } });
  };

  // 出入记录
  fetchPresenceRecordList = () => {
    const { companyId, dispatch } = this.props;
    dispatch({
      type: 'chemical/fetchInOutRecord',
      payload: {
        companyId,
        pageNum: 1,
        pageSize: 50,
        startTime: moment().format('YYYY-MM-DD 00:00:00'),
        endTime: moment().format('YYYY-MM-DD 23:59:59'),
        today: 1,
      },
    });
  };

  // 异常抬杆记录
  fetchAbnormalRecordList = () => {
    const { companyId, dispatch } = this.props;
    dispatch({
      type: 'licensePlateRecognitionSystem/getAbnormalRecordList',
      payload: {
        companyId,
        pageNum: 1,
        pageSize: 50,
        startTime: moment().format('YYYY-MM-DD 00:00:00'),
        endTime: moment().format('YYYY-MM-DD 23:59:59'),
        today: 1,
      },
    });
  };

  handleIdentification = () => {
    window.open(
      `${
        window.publicPath
      }#/real-name-certification/identification-record/list?startTime=${moment().format(
        'YYYY-MM-DD 00:00:00'
      )}&endTime=${moment().format('YYYY-MM-DD 23:59:59')}`,
      `_blank`
    );
  };

  render() {
    const { gdMapVisible, visibles, videoVisible, keyId, truckModalVisible } = this.state;
    const {
      chemical: {
        videoList,
        onDuty: { recSuccess = 0, inCount = 0, outCount = 0 },
        truckCount,
        inOutRecordList,
        riskPoint,
        monitorEquipment,
      },
      specialEquipment: { list: specialEquipmentList },
      user: {
        currentUser: { permissionCodes },
      },
      licensePlateRecognitionSystem: { abnormalRecordList },
      workingBill: {
        list: { list: workBillList = [] },
      },
    } = this.props;
    const presentCar = inCount - outCount >= 0 ? inCount - outCount : 0;
    const controlDataList = [
      filterMarkerList(riskPoint),
      filterMarkerList(videoList).filter(({ status }) => status && +status === 1),
      filterMarkerList(monitorEquipment),
      filterMarkerList(specialEquipmentList),
      filterMarkerList(monitorEquipment),
      workBillList.filter(item => item.mapAddress && JSON.parse(item.mapAddress).length),
    ];
    const controlDataLength = controlDataList.filter(list => list.length > 0).length;

    return (
      <Fragment>
        <div className={styles.container} id="mapContainer">
          <div
            className={styles.controlContainer}
            style={{
              left: `calc(50% - ${0.5 *
                (120 * controlDataLength + 20 * (controlDataLength - 1))}px)`,
            }}
          >
            {controls.map((item, index) => {
              const { label, icon, activeIcon } = item;
              const itemStyles = classnames(styles.controlItem, {
                [styles.active]: visibles[index],
              });
              if (controlDataList[index].length === 0) return null;
              return (
                <div
                  className={itemStyles}
                  key={index}
                  onClick={() => {
                    if (index === 5) {
                      this.handleToggleWorkBill(index);
                    } else this.handleClickControl(index);
                  }}
                >
                  <span
                    className={styles.icon}
                    style={{
                      background: `url(${
                        visibles[index] ? activeIcon : icon
                      }) center center / auto 100% no-repeat`,
                    }}
                  />
                  {label}
                </div>
              );
            })}
          </div>
          {!visibles[5] && (
            <div className={styles.joySuchFour}>
              {FourColors.map((item, index) => {
                const { label, color } = item;
                return (
                  <div className={styles.fourColorsWrapper} key={index}>
                    <span className={styles.rect} style={{ backgroundColor: color }} />
                    {label}
                  </div>
                );
              })}
            </div>
          )}

          <div className={styles.extraContainer}>
            <div
              className={styles.extraWrapper}
              style={{
                background: `url(${iconCar}) 7px 6px / 24px auto no-repeat #033069`,
                cursor: +presentCar ? 'pointer' : 'default',
              }}
              onClick={+presentCar ? this.handleShowTruckModal : undefined}
            >
              <div>
                车辆识别
                <span className={styles.extra}>（当前）</span>
              </div>
              <div>
                在场车辆
                <span className={styles.value}>{presentCar}</span>
              </div>
            </div>

            <div
              className={styles.extraWrapper}
              style={{
                background: `url(${iconFace}) 7px 6px / 24px auto no-repeat #033069`,
                cursor: +recSuccess ? 'pointer' : 'default',
              }}
              onClick={+recSuccess ? this.handleIdentification : undefined}
            >
              <div>
                人脸识别
                <span className={styles.extra}>（今日）</span>
              </div>
              <div>
                对比成功
                <span className={styles.value}>{recSuccess}</span>
              </div>
            </div>
          </div>

          {permissionCodes.includes('dashboard.personnelPositioningView') && (
            <div
              className={styles.positionBtn}
              style={{
                background: `url(${position}) center center / auto 80% no-repeat #fff`,
              }}
              onClick={this.handlePosition}
            />
          )}
          <NewVideoPlay
            showList={true}
            videoList={videoList
              .map(item => ({ ...item, key_id: item.keyId }))
              .filter(({ status }) => status && +status === 1)}
            visible={videoVisible}
            keyId={keyId} // keyId
            handleVideoClose={() => this.setState({ videoVisible: false })}
            isTree={false}
          />
        </div>
        <TruckModal
          visible={truckModalVisible}
          onCancel={this.handleCloseTruckModal}
          data={{ top: inOutRecordList, left: truckCount, right: abnormalRecordList.list }}
        />
      </Fragment>
    );
  }
}
