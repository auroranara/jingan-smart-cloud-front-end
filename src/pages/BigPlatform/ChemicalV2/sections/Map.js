import React, { PureComponent, Fragment } from 'react';
import { Map as GDMap, InfoWindow, Marker, Polygon } from 'react-amap';
import classnames from 'classnames';
import moment from 'moment';
import { connect } from 'dva';
import { isPointInPolygon } from '@/utils/map';
import NewVideoPlay from '@/pages/BigPlatform/NewFireControl/section/NewVideoPlay';
// 引入样式文件
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

const fengMap = fengmap; // eslint-disable-line
const TiltAngle = 50;
const RotateAngle = 60;
const MapScaleLevel = 21;
// 风险等级1红 2橙 3黄 4蓝
const COLORS = ['rgb(255, 72, 72)', 'rgb(241, 122, 10)', 'rgb(251, 247, 25)', 'rgb(30, 96, 255)'];
let map;
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
];

@connect(({ map, chemical, alarmWorkOrder }) => ({
  map,
  chemical,
  alarmWorkOrder,
}))
export default class Map extends PureComponent {
  state = {
    gdMapVisible: false,
    visibles: [true, true, true],
    videoVisible: false,
    videoList: [],
    keyId: undefined,
  };

  ids = [];
  polygonArray = [];
  polygonLayers = [];
  markerArray = [];
  markerLayers = [];
  lastTime = 0;

  /* eslint-disable*/
  componentDidMount() {
    // this.initMap();
    this.fetchMap();
    const { onRef } = this.props;
    onRef && onRef(this);

    // setTimeout(() => {
    //   this.handleUpdateMap();
    // }, 8000);
  }

  fetchMap = () => {
    const { dispatch, companyId } = this.props;
    // 获取地图列表
    dispatch({
      type: 'map/fetchMapList',
      payload: { companyId },
      callback: mapInfo => {
        this.initMap({ ...mapInfo }, () => {
          this.fetchMapAreaList();
          [
            'chemical/fetchRiskPoint',
            'chemical/fetchVideoList',
            'chemical/fetchMonitorEquipment',
          ].map((type, index) => {
            this.fetchPonits(type, index);
            return null;
          });
        });
      },
    });
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
          const polygonMarker = this.addPolygon(groupId, points, COLORS[zoneLevel - 1], polygon);
          // this.setModelColor(groupId, polygonMarker, COLORS[zoneLevel - 1]);
          this.setModelColorById(
            groupId,
            modelIds.split(',').map(id => +id),
            COLORS[zoneLevel - 1]
          );
          return null;
        });
      },
    });
  };

  renderPoints = (pointsInfo, iconType) => {
    if (!pointsInfo.length) return;
    pointsInfo.map(item => {
      const { warnStatus } = item;
      const { groupId, xnum, ynum, znum, isShow } = item.pointFixInfoList[0];
      if (!+isShow) return null;
      this.addMarkers(+groupId, {
        x: +xnum,
        y: +ynum,
        z: +znum,
        url: warnStatus === -1 ? controls[iconType].alarmIcon : controls[iconType].markerIcon,
        iconType,
        markerProps: item,
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
        const pointsInfo = res.data.list.filter(item => item.pointFixInfoList.length > 0);
        // .map(item => {
        //   return item.pointFixInfoList[0];
        // });
        console.log('pointsInfo', pointsInfo.filter(item => item.pointFixInfoList[0].isShow));
        if (isUpdate) this.removeMarkersByType(iconType);
        this.renderPoints(pointsInfo, iconType);
      },
    });
  };

  handleJumpChangeWarning = () => {
    window.open(`${window.publicPath}#/risk-control/change-warning/list`, `_blank`);
  };

  // 初始化地图定位
  initMap = ({ appName, key, mapId, isInit }, fun) => {
    if (!appName || !key || !mapId) return;
    const mapOptions = {
      //必要，地图容器
      container: document.getElementById('fengMap'),
      //地图数据位置
      mapServerURL: './data/' + mapId,
      // defaultViewMode: fengMap.FMViewMode.MODE_2D,
      //设置主题
      defaultThemeName: '2001',
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
      init2D: false, //初始化2D模式
      groupsButtonNeeded: false, //设置为false表示只显示2D,3D切换按钮
      position: fengmap.controlPositon.LEFT_TOP,
      offset: { x: 0, y: 40 },
      //点击按钮的回调方法,返回type表示按钮类型,value表示对应的功能值
      clickCallBack: function(type, value) {
        // console.log(type,value);
      },
    });

    // 地图加载完成事件
    map.on('loadComplete', () => {
      map.tiltAngle = TiltAngle;
      map.rotateAngle = RotateAngle;
      map.mapScaleLevel = MapScaleLevel;
      console.log('map.getFMGroup()', map.groupIDs);
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

    // 风险变更预警弹窗
    const ctlOpt = new fengmap.controlOptions({
      mapCoord: {
        //设置弹框的x轴
        x: 13224097.37958329,
        //设置弹框的y轴
        y: 3771542.8635400063,
        //设置弹框位于的楼层
        groupID: 1,
        height: 1,
      },
      //设置弹框的宽度
      width: 330,
      //设置弹框的高度
      height: 100,
      marginTop: 10,
      //设置弹框的内容
      content: `<div style="line-height: 24px;">
          <div>风险变更预警</div>
          <div>此区域有变更，请对该区域重新进行风险评价。</div>
          <div style="text-align: right;color: #0ff;" onclick="window.open('${
            window.publicPath
          }#/risk-control/change-warning/list','_blank');"><span style="cursor: pointer;">查看详情>></span></div>
        </div>`,
    });
    const popMarker = new fengmap.FMPopInfoWindow(map, ctlOpt);

    map.on('mapClickNode', event => {
      const {
        handleClickRiskPoint,
        setDrawerVisible,
        handleShowAreaDrawer,
        handleClickMonitorIcon,
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

      const { eventInfo: { coord } = {}, ID, groupID } = clickedObj;
      if (coord) {
        // 点击区域
        for (let index = 0; index < this.polygonArray.length; index++) {
          const polygon = this.polygonArray[index];
          const {
            polygonProps: { modelIds, id },
          } = polygon;
          const IDs = modelIds.split(',').map(item => +item);
          if (
            (groupID === polygon.groupID && this.isPointInPolygon(coord, polygon)) ||
            IDs.includes(ID)
          ) {
            handleShowAreaDrawer(id);
            break;
          }
        }
      }
      if (nodeType === fengmap.FMNodeType.IMAGE_MARKER) {
        // 点击图标
        const {
          opts_: { iconType, markerProps },
        } = clickedObj;
        if (iconType === 0) {
          // 风险点
          const { itemId, status } = markerProps;
          handleClickRiskPoint(itemId, status);
        } else if (iconType === 1) {
          // 视频监控
          const { keyId } = markerProps;
          this.handleShowVideo(keyId);
        } else if (iconType === 2) {
          // 监测设备
          handleClickMonitorIcon(markerProps);
        }
      }
    });
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
            if (id === equipmentId) fm.removeMarker(marker);
          });
        }
      });
    });
  };

  // 监测设备状态图标变化
  handleMarkerStatusChange = (equipmentId, statusType, warnStatus) => {
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
              fm.jump({ times: 0, duration: 2, height: 2, delay: 0 });
            } else if (statusType === 1) {
              if (warnStatus !== -1) {
                fm.url = monitor;
                fm.stopJump();
              }
            }
          }
        }
      });
    });
  };

  // 监测设备状态变化
  handleUpdateMap = (equipmentId, statusType) => {
    if (!map || !this.markerArray.length) return;
    // this.fetchPonits('chemical/fetchMonitorEquipment', 2, {}, true);
    const { dispatch, companyId } = this.props;
    dispatch({
      type: 'alarmWorkOrder/getDeviceDetail',
      payload: { id: equipmentId },
      callback: (success, deviceDetail) => {
        if (success) {
          const { warnStatus } = deviceDetail;
          this.removeMarkerById(equipmentId);
          this.renderPoints([deviceDetail], 2);
          setTimeout(() => {
            this.handleMarkerStatusChange(equipmentId, statusType, warnStatus);
          }, 50);
        }
      },
    });
    // dispatch({
    //   type: 'chemical/fetchMonitorEquipment',
    //   payload: { companyId, pageNum: 1, pageSize: 0 },
    //   callback: res => {
    //     const pointsInfo = res.data.list.filter(item => item.pointFixInfoList.length > 0);
    //     this.removeMarkersByType(2);
    //     this.renderPoints(pointsInfo, 2);

    //     setTimeout(() => {
    //       this.handleMarkerStatusChange(equipmentId, status);
    //     }, 50);
    //   },
    // });
  };

  setModelColor(groupId, polygon, color) {
    const models = map.getDatasByAlias(groupId, 'model');
    models.map(model => {
      const { mapCoord } = model;
      if (polygon.contain({ ...mapCoord, z: 1 })) model.setColor(color);
      return null;
    });
  }

  setModelColorById = (groupId, IDs, color) => {
    const models = map.getDatasByAlias(groupId, 'model');
    models.map(model => {
      const { ID } = model;
      if (IDs.includes(ID)) model.setColor(color);
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
    window.open(`${window.publicPath}#/big-platform/personnel-position/index`, `_blank`);
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

  render() {
    const { gdMapVisible, visibles, videoVisible, keyId } = this.state;
    const {
      chemical: { videoList },
    } = this.props;

    return (
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
          <div className={styles.controlContainer}>
            {controls.map((item, index) => {
              const { label, icon, activeIcon } = item;
              const itemStyles = classnames(styles.controlItem, {
                [styles.active]: visibles[index],
              });
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
        <div
          className={styles.positionBtn}
          style={{
            background: `url(${position}) center center / auto 80% no-repeat #fff`,
          }}
          onClick={this.handlePosition}
        />
        {videoVisible && (
          <NewVideoPlay
            showList={true}
            videoList={videoList.map(item => ({ ...item, key_id: item.keyId }))}
            visible={videoVisible}
            keyId={keyId} // keyId
            handleVideoClose={() => this.setState({ videoVisible: false })}
            isTree={false}
          />
        )}
      </div>
    );
  }
}
