import React, { PureComponent, Fragment } from 'react';
import { Map as GDMap, InfoWindow, Marker, Polygon } from 'react-amap';
import classnames from 'classnames';
import moment from 'moment';
import { connect } from 'dva';
// import { isPointInPolygon } from '@/utils/map';
import NewVideoPlay from '@/pages/BigPlatform/NewFireControl/section/NewVideoPlay';
import TruckModal from '../components/TruckModal';
import styles from './Map.less';

import monitor from '../imgs/monitor.png';
import riskPoint from '../imgs/risk-point.png';
import video from '../imgs/video.png';
import mapDot from '@/pages/BigPlatform/NewFireControl/img/mapDot.png';
import monitorActive from '../imgs/monitor-active.png';
import monitorGray from '../imgs/monitor-gray.png';
import riskPointActive from '../imgs/risk-point-active.png';
import riskPointGray from '../imgs/risk-point-gray.png';
import riskPointAlarm from '../imgs/risk-point-alarm.png';
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

const fengMap = fengmap; // eslint-disable-line
const TiltAngle = 50;
const RotateAngle = 60;
const MapScaleLevel = 21;
// 风险等级1红 2橙 3黄 4蓝
const COLORS = ['rgb(255, 72, 72)', 'rgb(241, 122, 10)', 'rgb(251, 247, 25)', 'rgb(30, 96, 255)'];
let map;
let popInfoWindow;
const controls = [
  {
    label: '风险点',
    icon: riskPointGray,
    activeIcon: riskPointActive,
    markerIcon: riskPoint,
    alarmIcon: riskPointAlarm,
  },
  {
    label: '视频监控',
    icon: videoGray,
    activeIcon: videoActive,
    markerIcon: video,
  },
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
  }) => ({
    map,
    chemical,
    alarmWorkOrder,
    user,
    specialEquipment,
    emergencyManagement,
    changeWarning,
    licensePlateRecognitionSystem,
  })
)
export default class Map extends PureComponent {
  state = {
    gdMapVisible: false,
    visibles: [true, false, false, false],
    videoVisible: false,
    videoList: [],
    keyId: undefined,
    truckModalVisible: false,
  };

  ids = [];
  polygonArray = [];
  polygonLayers = [];
  markerArray = [];
  markerLayers = [];
  lastTime = 0;
  jumpEquipIds = [];
  jumpFireIds = [];

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
    const { dispatch, companyId, mapInfo } = this.props;
    // 获取地图列表
    // dispatch({
    //   type: "map/fetchMapList",
    //   payload: { companyId },
    //   callback: (mapInfo) => {
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
    });
    // },
    // });
  };

  fetchDict = (payload, success, error) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'emergencyManagement/fetchDicts',
      payload,
      success,
      error,
    });
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
          const points = coordinateList.map(item => ({
            x: +item.x,
            y: +item.y,
            z: +item.z,
          }));
          const polygonMarker = this.addPolygon(groupId, points, COLORS[zoneLevel - 1], polygon);
          // this.setModelColor(groupId, polygonMarker, COLORS[zoneLevel - 1]);
          this.setModelColorByFID(groupId, modelIds.split(','), COLORS[zoneLevel - 1]);
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
        this.polygonArray.map(polygon => {
          const {
            polygonProps: { coordinateList, id, groupId },
          } = polygon;
          if (JSON.stringify(warningList).indexOf(id) < 0) {
            if (popInfoWindow) {
              // 关闭风险变更的提示
              const {
                options_: { zoneId },
              } = popInfoWindow;
              if (id === zoneId) popInfoWindow.close();
            }
            return null;
          }
          this.addMarkers(+groupId, {
            x: +coordinateList[0].x,
            y: +coordinateList[0].y,
            z: +coordinateList[0].z,
            url: iconTips,
            iconType: -1,
            markerProps: { zoneId: id },
            size: 25,
            height: 1,
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
      const { warnStatus, status, deviceCode, pointCountMap } = item;
      const { groupId, xnum, ynum, znum, isShow } = item.pointFixInfoList[0];
      if (iconType === 1 && +status !== 1) return null; // 筛选掉禁用的视频
      // if (!+isShow) return null;
      let url = controls[iconType].markerIcon;
      if (iconType === 2) {
        if (deviceCode || deviceCode === 0) {
          // 消防主机
          const { fire_state } = pointCountMap || {};
          if (+fire_state > 0) url = controls[iconType].alarmIcon;
          else controls[iconType].markerIcon;
        } else if (warnStatus === -1) url = controls[iconType].alarmIcon;
      }
      if (iconType === 0 && +status === 2) {
        url = controls[iconType].alarmIcon;
      }
      const marker = this.addMarkers(+groupId, {
        x: +xnum,
        y: +ynum,
        z: +znum,
        // url: warnStatus === -1 ? controls[iconType].alarmIcon : controls[iconType].markerIcon,
        url,
        iconType,
        markerProps: item,
        groupId: +groupId,
      });
      if (marker) marker.show = visibles[iconType];
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
        // const pointsInfo = res.data.list.filter(
        //   item => item.pointFixInfoList && item.pointFixInfoList.length > 0
        // );
        // .map(item => {
        //   return item.pointFixInfoList[0];
        // });
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
    if (!appName || !key || !mapId) return;
    const [tiltAngle, rotateAngle] = mapScaleLevelRangeList || [];
    const mapOptions = {
      //必要，地图容器
      container: document.getElementById('fengMap'),
      //地图数据位置
      mapServerURL: './data/' + mapId,
      defaultViewMode: defaultViewMode || fengMap.FMViewMode.MODE_2D,
      //设置主题
      defaultThemeName: theme || '2001',
      modelSelectedEffect: false,
      //支持悬停模型高亮，默认为false悬停不高亮
      modelHoverEffect: true,
      //悬停时间触发时间，默认1000
      modelHoverTime: 200,
      appName,
      key,
    };

    //初始化地图对象
    map = new fengMap.FMMap(mapOptions);
    //打开Fengmap服务器的地图数据和主题
    map.openMapById(mapId);

    //2D、3D控件配置
    const toolControl = new fengmap.toolControl(map, {
      init2D: defaultViewMode === fengMap.FMViewMode.MODE_2D, //初始化2D模式
      groupsButtonNeeded: false, //设置为false表示只显示2D,3D切换按钮
      position: fengmap.controlPositon.LEFT_TOP,
      offset: { x: 0, y: 40 },
      //点击按钮的回调方法,返回type表示按钮类型,value表示对应的功能值
      clickCallBack: function(type, value) {},
    });

    // 地图加载完成事件
    map.on('loadComplete', () => {
      if (!map) return;
      map.tiltAngle = typeof tiltAngle === 'number' ? tiltAngle : TiltAngle;
      map.rotateAngle = typeof rotateAngle === 'number' ? rotateAngle : RotateAngle;
      // map.mapScaleLevel = MapScaleLevel;
      map.mapScaleLevel = defaultMapScaleLevel || MapScaleLevel;
      // console.log('map.getFMGroup()', map.groupIDs);
      this.loadBtnFloorCtrl();
      // 四色图
      fun && fun();
    });

    map.on('mapHoverNode', event => {
      // 鼠标悬停事件
      console.log('mapHoverNode', event);
    });

    /**
     * 过滤不允许hover的地图元素，设置为true为允许点击，设置为false为不允许点击
     * @param event
     */
    map.hoverFilterFunction = event => {
      if (event.nodeType === fengmap.FMNodeType.FLOOR) {
        return false;
      }
      return true;
    };

    // 地图点击事件
    map.on('mapClickNode', event => {
      const {
        handleClickRiskPoint,
        setDrawerVisible,
        handleShowAreaDrawer,
        handleClickMonitorIcon,
        handleClickFireMonitor,
      } = this.props;
      const clickedObj = event.target;
      console.log('clickedObj', clickedObj);
      // console.log('time', moment().valueOf());
      const thisTime = moment().valueOf();
      // 防止点区域时也点到建筑
      if (thisTime - this.lastTime < 300) return;
      this.lastTime = thisTime;
      if (!clickedObj) return;
      const { nodeType } = clickedObj;
      if (
        [
          // fengmap.FMNodeType.FLOOR,
          fengmap.FMNodeType.FACILITY,
          fengmap.FMNodeType.TEXT_MARKER,
          fengmap.FMNodeType.LABEL,
          fengmap.FMNodeType.NONE,
        ].includes(nodeType)
      )
        return;

      const { eventInfo: { coord } = {}, FID, groupID } = clickedObj;
      if (coord) {
        // 点击区域
        for (let index = 0; index < this.polygonArray.length; index++) {
          const polygon = this.polygonArray[index];
          const {
            polygonProps: { modelIds, id },
          } = polygon;
          const FIDs = modelIds.split(',');
          if (
            (groupID === polygon.groupID && this.isPointInPolygon(coord, polygon)) ||
            FIDs.includes(FID)
          ) {
            handleShowAreaDrawer(id);
            break;
          }
        }
      }
      if (nodeType === fengmap.FMNodeType.IMAGE_MARKER) {
        // 点击图标
        const {
          opts_: { iconType, markerProps, x, y, z, height, groupId: markerGroupId },
        } = clickedObj;
        switch (iconType) {
          case 0:
            // 风险点
            const { itemId, status } = markerProps;
            handleClickRiskPoint(itemId, status);
            break;
          case 1:
            // 视频监控
            const { keyId } = markerProps;
            this.handleShowVideo(keyId);
            break;
          case 2:
            // 监测设备
            const { deviceCode } = markerProps;
            if (deviceCode || deviceCode === 0) {
              // 消防主机
              handleClickFireMonitor(markerProps);
            } else {
              // 监测设备
              this.handleClickMonitorEquip(markerProps.id);
              // handleClickMonitorIcon(markerProps);
            }
            break;
          case 3:
            // 特种设备
            this.handleShowSpecialInfo(markerProps, {
              x,
              y,
              z,
              height,
              groupID: markerGroupId,
            });
            break;
          case -1:
            // 变更预警
            const { zoneId } = markerProps;
            this.handleShowChangeWarning(zoneId, {
              x,
              y,
              z,
              height,
              groupID: markerGroupId,
            });
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
          setTimeout(() => {
            this.handleMarkerJump(equipmentId, this.jumpEquipIds);
          }, 50);
        }
      },
    });
  };

  // 变更预警
  handleShowChangeWarning = (zoneId, mapCoord) => {
    const { companyId } = this.props;
    popInfoWindow && popInfoWindow.close();
    const ctlOpt = new fengmap.controlOptions({
      mapCoord: {
        ...mapCoord,
        z: 1,
        height: 0,
      },
      //设置弹框的宽度
      width: 400,
      //设置弹框的高度
      height: 105,
      marginTop: 0,
      //设置弹框的内容
      content: `<div style="line-height: 24px;font-size: 14px;padding: 10px 15px;height: 100%;border: 1px solid #f83329;border-radius: 5px;">
          <div style="font-size: 16px;">
            <span style="display: inline-block;width: 20px;height: 20px;margin-right: 5px;position: relative;top: 4px;background: url(${iconTips}) center center / 100% 100% no-repeat;"></span>
            风险变更预警
          </div>
          <div style="padding-left: 30px;">此区域有变更，请对该区域重新进行风险评价。</div>
          <div style="text-align: right;color: #0ff;">
            <span style="cursor: pointer;" onclick="window.open('${
              window.publicPath
            }#/risk-control/change-warning/list?companyId=${companyId}&status=0&zoneId=${zoneId}','_blank');">查看详情>></span></div>
        </div>`,
      zoneId,
    });
    popInfoWindow = new fengmap.FMPopInfoWindow(map, ctlOpt);
  };

  handleShowSpecialInfo = (info, mapCoord) => {
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
    popInfoWindow && popInfoWindow.close();
    //添加绑定marker信息窗
    const noData = '--';
    const ctlOpt = {
      mapCoord: {
        ...mapCoord,
        z: 1,
        height: 0,
      },
      //设置弹框的宽度
      width: 450,
      //设置弹框的高度px
      height: 210,
      //设置弹框的内容，文本或html页面元素
      content: `<div class="specContainer">
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
          <div class="specValue">${
            endDate ? moment(endDate).format('YYYY年MM月DD日') : noData
          }</div>
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
      </style>`,
    };
    //添加弹框到地图上，绑定marker
    popInfoWindow = new fengmap.FMPopInfoWindow(map, ctlOpt);
  };

  // 判断点是否在FMPolygonMarker区域内
  isPointInPolygon = (point, polygon) => {
    return polygon.contain({ ...point });
  };

  //加载按钮型楼层切换控件
  loadBtnFloorCtrl = (groupId = 1) => {
    //楼层控制控件配置参数
    const btnFloorCtlOpt = new fengMap.controlOptions({
      //默认在右下角
      position: fengMap.controlPositon.LEFT_TOP,
      //初始楼层按钮显示个数配置。默认显示5层,其他的隐藏，可滚动查看
      showBtnCount: 6,
      //初始是否是多层显示，默认单层显示
      allLayer: false,
      //位置x,y的偏移量
      offset: {
        x: 0,
        y: 100,
      },
    });
    //不带单/双层楼层控制按钮,初始时只有1个按钮,点击后可弹出其他楼层按钮
    const btnFloorControl = new fengMap.buttonGroupsControl(map, btnFloorCtlOpt);
    //楼层切换
    btnFloorControl.onChange(function(groups, allLayer) {
      //groups 表示当前要切换的楼层ID数组,
      //allLayer表示当前楼层是单层状态还是多层状态。
      popInfoWindow && popInfoWindow.close();
    });
    //默认是否展开楼层列表，true为展开，false为不展开
    btnFloorControl.expand = true;
    //楼层控件是否可点击，默认为true
    btnFloorControl.enableExpand = true;
    // 切换到指定楼层(可传入两个参数：目标层groupID,是否多层状态)
    btnFloorControl.changeFocusGroup(groupId);
  };

  removeMarkersByType = iconType => {
    if (!map) return;
    map.groupIDs.map(gId => {
      const group = map.getFMGroup(gId);
      //遍历图层
      group.traverse(fm => {
        if (fm instanceof fengmap.FMImageMarkerLayer) {
          // console.log('fm', fm);
          // console.log('fm.markers', fm.markers);
          fm.markers.forEach(marker => {
            const {
              opts_: { iconType: type },
            } = marker;
            if (type === iconType) fm.removeMarker(marker);
          });
        }
      });
    });
  };

  removeMarkerById = equipmentId => {
    if (!map) return;
    let isRemoved = false;
    map.groupIDs.map(gId => {
      const group = map.getFMGroup(gId);
      //遍历图层
      group.traverse(fm => {
        if (fm instanceof fengmap.FMImageMarkerLayer) {
          // console.log('fm', fm);
          // console.log('fm.markers', fm.markers);
          fm.markers.forEach(marker => {
            const {
              opts_: {
                markerProps: { id },
              },
            } = marker;
            if (id === equipmentId) {
              fm.removeMarker(marker);
              isRemoved = true;
            }
          });
        }
      });
    });
    return isRemoved;
  };

  removeMarkerByItemId = id => {
    if (!map) return;
    let isRemoved = false;
    map.groupIDs.map(gId => {
      const group = map.getFMGroup(gId);
      //遍历图层
      group.traverse(fm => {
        if (fm instanceof fengmap.FMImageMarkerLayer) {
          fm.markers.forEach(marker => {
            const {
              opts_: {
                markerProps: { itemId },
              },
            } = marker;
            if (itemId === id) {
              fm.removeMarker(marker);
              isRemoved = true;
            }
          });
        }
      });
    });
    return isRemoved;
  };

  // 监测设备状态图标变化
  handleMarkerStatusChange = (equipmentId, statusType, warnStatus, jumpIds) => {
    map.groupIDs.map(gId => {
      const group = map.getFMGroup(gId);
      //遍历图层
      group.traverse(fm => {
        if (fm instanceof fengmap.FMImageMarker) {
          const {
            opts_: { iconType, markerProps },
          } = fm;
          const { id } = markerProps;
          if (iconType === 2 && id === equipmentId) {
            if (statusType === -1) {
              fm.url = monitorAlarm;
              // fm.jump({ times: 0, duration: 2, height: 2, delay: 0 });
            } else if (statusType === 1) {
              if (warnStatus !== -1) {
                fm.url = monitor;
                fm.stopJump();
              }
            }
            if (jumpIds.indexOf(id) >= 0) {
              fm.jump({ times: 0, duration: 2, height: 2, delay: 0 });
            }
          }
        }
      });
    });
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
          setTimeout(() => {
            this.handleMarkerJump(equipmentId, this.jumpEquipIds, warnStatus !== -1);
          }, 50);
        }
      },
    });
  };

  handleMarkerJump = (equipmentId, jumpIds, isStop = false) => {
    map.groupIDs.map(gId => {
      const group = map.getFMGroup(gId);
      //遍历图层
      group.traverse(fm => {
        if (fm instanceof fengmap.FMImageMarker) {
          const {
            opts_: { iconType, markerProps },
          } = fm;
          const { id } = markerProps;
          if (iconType === 2 && id === equipmentId) {
            if (jumpIds.indexOf(id) >= 0) {
              fm.jump({ times: 0, duration: 2, height: 2, delay: 0 });
            }
            // else if (isStop) {
            //   fm.stopJump();
            // }
          }
        }
      });
    });
  };

  handleFireMarkerJump = jumpIds => {
    map.groupIDs.map(gId => {
      const group = map.getFMGroup(gId);
      //遍历图层
      group.traverse(fm => {
        if (fm instanceof fengmap.FMImageMarker) {
          const {
            opts_: { iconType, markerProps },
          } = fm;
          const { id } = markerProps;
          if (iconType === 2 && jumpIds.indexOf(id) >= 0) {
            fm.jump({ times: 0, duration: 2, height: 2, delay: 0 });
          }
        }
      });
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

        setTimeout(() => {
          this.handleFireMarkerJump(this.jumpFireIds);
        }, 50);
      },
    });
    return null;
  };

  handleUpdateRiskPoint = itemId => {
    const { dispatch, companyId } = this.props;
    dispatch({
      type: 'chemical/fetchSingleRiskPoint',
      payload: { companyId, itemId, pageSize: 1, pageNum: 1 },
      callback: (suc, res) => {
        if (!map) return;
        this.removeMarkerByItemId(itemId);
        if (suc) this.renderPoints([res], 0);
      },
    });
  };

  setModelColor(groupId, polygon, color) {
    const models = map.getDatasByAlias(groupId, 'model');
    models.map(model => {
      const { mapCoord } = model;
      if (polygon.contain({ ...mapCoord, z: 1 })) model.setColor(color);
      return null;
    });
  }

  setModelColorByFID = (groupId, FIDs, color) => {
    const models = map.getDatasByAlias(groupId, 'model');
    models.map(model => {
      const { FID } = model;
      if (FIDs.includes(FID)) model.setColor(color);
      return null;
    });
  };

  addMarkers = (gId, markerProps, layer) => {
    let markerLayer = layer;
    const groupId = gId || 1;
    if (!layer) {
      const groupLayer = map.getFMGroup(groupId);
      // const newLayer = new fengmap.FMImageMarkerLayer(); //实例化ImageMarkerLayer
      // markerLayer = newLayer;
      // groupLayer.addLayer(markerLayer); //添加图片标注层到模型层。否则地图上不会显示
      markerLayer = groupLayer.getOrCreateLayer('imageMarker');
    }
    const im = new fengmap.FMImageMarker({
      size: 50, //设置图片显示尺寸
      height: 0, //标注高度，大于model的高度
      ...markerProps,
      callback: function() {
        im.alwaysShow();
      },
    });

    markerLayer.addMarker(im); //图片标注层添加图片Marker
    this.markerArray.push(im);
    return im;
  };

  addPolygon = (gId, points, color, polygonProps = {}) => {
    const groupId = gId || 1;
    const groupLayer = map.getFMGroup(groupId);
    //创建PolygonMarkerLayer
    const layer = new fengmap.FMPolygonMarkerLayer();
    groupLayer.addLayer(layer);
    const polygonMarker = new fengmap.FMPolygonMarker({
      alpha: 0.5, //设置透明度
      lineWidth: 0, //设置边框线的宽度
      height: 1, //设置高度*/
      points, //多边形坐标点
      polygonProps,
    });
    polygonMarker.setColor(color);
    layer.addMarker(polygonMarker);
    this.polygonArray.push(polygonMarker);
    // this.polygonLayers.push(layer);
    return polygonMarker;
    // polygonMarker.alwaysShow(true);
    // polygonMarker.avoid(false);
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

  renderMarkers = () => {
    return (
      <Marker
        position={{ longitude: 120.3660553694, latitude: 31.5441255765 }}
        offset={[-22, -45]}
        events={{
          click: this.handleClickMap,
        }}
      >
        <div className={styles.dotIcon} style={{ backgroundImage: `url(${mapDot})` }} />
      </Marker>
    );
  };

  // 切换图标是否显示
  handleClickControl = index => {
    const { visibles } = this.state;
    const copy = [...visibles];
    copy[index] = !visibles[index];
    this.setState({ visibles: copy });
    map.groupIDs.map(gId => {
      const group = map.getFMGroup(gId);
      //遍历图层
      if (!group) return;
      group.traverse(fm => {
        if (fm instanceof fengmap.FMImageMarker) {
          const {
            opts_: { iconType },
          } = fm;
          if (iconType === index) fm.show = copy[index];
        }
      });
    });
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
    } = this.props;
    const presentCar = inCount - outCount >= 0 ? inCount - outCount : 0;
    const controlDataList = [
      filterMarkerList(riskPoint),
      filterMarkerList(videoList).filter(({ status }) => status && +status === 1),
      filterMarkerList(monitorEquipment),
      filterMarkerList(specialEquipmentList),
    ];
    const controlDataLength = controlDataList.filter(list => list.length > 0).length;

    return (
      <Fragment>
        <div className={styles.container} id="fengMap">
          {gdMapVisible && (
            <GDMap
              version={'1.4.10'}
              amapkey="665bd904a802559d49a33335f1e4aa0d"
              plugins={[
                { name: 'Scale', options: { locate: false } },
                { name: 'ToolBar', options: { locate: false } },
              ]}
              status={{
                keyboardEnable: false,
              }}
              useAMapUI
              mapStyle="amap://styles/b9d9da96da6ba2487d60019876b26fc5"
              center={[120.3660553694, 31.5441255765]}
              zoom={18}
              pitch={60}
              expandZoomRange
              zooms={[3, 20]}
              events={{
                created: mapInstance => {
                  this.mapInstance = mapInstance;
                  // mapInstance.setCity(region);
                },
              }}
            >
              {this.renderMarkers()}
            </GDMap>
          )}
          {!gdMapVisible && (
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
                    onClick={() => this.handleClickControl(index)}
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
          )}
          <div className={styles.fourColorsContainer}>
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
          data={{
            top: inOutRecordList,
            left: truckCount,
            right: abnormalRecordList.list,
          }}
        />
      </Fragment>
    );
  }
}
