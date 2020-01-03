import React, { PureComponent, Fragment } from 'react';
import { Map as GDMap, InfoWindow, Marker, Polygon } from 'react-amap';
import classnames from 'classnames';
import moment from 'moment';
import { connect } from 'dva';
import { isPointInPolygon } from '@/utils/map';
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
const fmapID = '100';
const controls = [
  { label: '风险点', icon: riskPointGray, activeIcon: riskPointActive },
  { label: '视频监控', icon: videoGray, activeIcon: videoActive },
  { label: '监测设备', icon: monitorGray, activeIcon: monitorActive },
];

@connect(({ map, chemical }) => ({
  map,
  chemical,
}))
export default class Map extends PureComponent {
  state = {
    gdMapVisible: false,
    visibles: [true, true, true],
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
  }

  // componentDidUpdate(prevProps) {
  //   const { polygons: prevPolygons } = prevProps;
  //   const { polygons } = this.props;
  //   if (JSON.stringify(prevPolygons) !== JSON.stringify(polygons)) {
  //     map &&
  //       map.on('loadComplete', () => {
  //         polygons.map(polygon => {
  //           const { zoneLevel, coordinateList } = polygon;
  //           const points = coordinateList.map(item => ({ x: +item.x, y: +item.y, z: +item.z }));
  //           const polygonMarker = this.addPolygon(points, COLORS[zoneLevel - 1]);
  //           // this.setModelColor(points, COLORS[zoneLevel - 1]);
  //           this.setModelColor2(polygonMarker, COLORS[zoneLevel - 1]);
  //           return null;
  //         });
  //       });
  //   }
  // }

  fetchMap = () => {
    const { dispatch, companyId } = this.props;
    // 获取地图列表
    dispatch({
      type: 'map/fetchMapList',
      payload: { companyId },
      callback: mapInfo => {
        this.initMap({ ...mapInfo }, () => {
          this.fetchMapAreaList();
          // this.fetchRiskPoint();
          this.fetchMonitorEquipment();
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
          const { zoneLevel, coordinateList, groupId } = polygon;
          const points = coordinateList.map(item => ({ x: +item.x, y: +item.y, z: +item.z }));
          const polygonMarker = this.addPolygon(groupId, points, COLORS[zoneLevel - 1]);
          this.setModelColor2(groupId, polygonMarker, COLORS[zoneLevel - 1]);
          return null;
        });
      },
    });
  };

  renderPoints = points => {
    if (!points.length) return;
    points.map(item => {
      const { groupId, xnum, ynum, znum, id, itemId } = item;
      const groupLayer = map.getFMGroup(groupId);
      const layer = new fengmap.FMImageMarkerLayer(); //实例化ImageMarkerLayer
      groupLayer.addLayer(layer); //添加图片标注层到模型层。否则地图上不会显示

      const im = new fengmap.FMImageMarker({
        size: 50, //设置图片显示尺寸
        height: 3, //标注高度，大于model的高度
        ...markerProps,
      });
      layer.addMarker(im); //图片标注层添加图片Marker
      im.alwaysShow();
      this.markerArray.push(im);
      // this.addMarkers(item, layer);
      return null;
    });
  };

  // 风险点
  fetchRiskPoint = () => {
    const { dispatch, companyId } = this.props;
    dispatch({
      type: 'chemical/fetchRiskPoint',
      payload: { companyId, pageNum: 1, pageSize: 0 },
      callback: res => {
        const pointsInfo = res.data.list.filter(item => item.pointFixInfoList.length > 0);
        console.log('pointsInfo', pointsInfo);
        if (!pointsInfo.length) return;
        pointsInfo.map(item => {
          const {
            pointFixInfoList: { groupId, xnum, ynum, znum, id, itemId },
          } = item;
          const groupLayer = map.getFMGroup(groupId);
          const layer = new fengmap.FMImageMarkerLayer(); //实例化ImageMarkerLayer
          groupLayer.addLayer(layer); //添加图片标注层到模型层。否则地图上不会显示
          this.addMarkers(item, layer);
          return null;
        });
      },
    });
  };

  fetchMonitorEquipment = () => {
    const { dispatch, companyId } = this.props;
    dispatch({
      type: 'chemical/fetchMonitorEquipment',
      payload: { companyId, pageNum: 1, pageSize: 0 },
      callback: res => {
        const monitorsInfo = res.data.list.filter(item => item.pointFixInfoList.length > 0);
        console.log('monitorsInfo', monitorsInfo);
      },
    });
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
      appName,
      key,
    };

    //初始化地图对象
    map = new fengMap.FMMap(mapOptions);
    //打开Fengmap服务器的地图数据和主题
    map.openMapById(mapId);

    // console.log('map.getFMGroup()', map.getFMGroup());

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

    map.on('mapClickNode', event => {
      const { handleClickRiskPoint } = this.props;
      const clickedObj = event.target;
      console.log('clickedObj', clickedObj);
    });
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

  handleUpdateMap = () => {
    if (!map || !this.markerArray.length) return;
    this.markerArray[5].url = monitorAlarm;
    this.markerArray[5].jump({ times: 0, duration: 2, height: 2, delay: 0 });
  };

  setModelColor(points, color) {
    // 默认gid为1
    const models = map.getDatasByAlias(1, 'model');
    models
      .filter(({ mapCoord }) => isPointInPolygon(mapCoord, points))
      .map(model => model.setColor(color));
  }

  setModelColor2(groupId, polygon, color) {
    // 默认gid为1
    const models = map.getDatasByAlias(groupId, 'model');
    models.map(model => {
      const { mapCoord } = model;
      if (polygon.contain({ ...mapCoord, z: 1 })) model.setColor(color);
      return null;
    });
  }

  addMarkers = (gId, markerProps, layer) => {
    let markerLayer = layer;
    const groupId = gId || 1;
    if (!layer) {
      const groupID = 1;
      const groupLayer = map.getFMGroup(groupID);
      const newLayer = new fengmap.FMImageMarkerLayer(); //实例化ImageMarkerLayer
      groupLayer.addLayer(newLayer); //添加图片标注层到模型层。否则地图上不会显示
    }
    const im = new fengmap.FMImageMarker({
      size: 50, //设置图片显示尺寸
      height: 3, //标注高度，大于model的高度
      ...markerProps,
    });
    markerLayer.addMarker(im); //图片标注层添加图片Marker
    im.alwaysShow();
    this.markerArray.push(im);
  };

  addPolygon = (gId, points, color) => {
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
    });
    polygonMarker.setColor(color);
    layer.addMarker(polygonMarker);
    this.polygonArray.push(polygonMarker);
    this.polygonLayers.push(layer);
    return polygonMarker;
    // polygonMarker.alwaysShow(true);
    // polygonMarker.avoid(false);
  };
  /* eslint-disable*/

  initMap2() {
    const { setDrawerVisible, showVideo } = this.props;
    const mapOptions = {
      //必要，地图容器
      container: document.getElementById('fengMap'),
      //地图数据位置
      mapServerURL: './data/' + fmapID,
      //主题数据位置
      // mapThemeURL: './data/theme',
      //设置主题
      defaultThemeName: '2001',
      modelSelectedEffect: false,
      //默认背景颜色,十六进制颜色值或CSS颜色样式 0xff00ff, '#00ff00'
      // defaultBackgroundColor: '#f7f4f4',
      //必要，地图应用名称，通过蜂鸟云后台创建
      appName: '真趣办公室',
      //必要，地图应用密钥，通过蜂鸟云后台获取
      key: 'cbb7eb159ce5b7d9300f0ce004f3a614',
    };

    //初始化地图对象
    map = new fengMap.FMMap(mapOptions);

    //打开Fengmap服务器的地图数据和主题
    map.openMapById(fmapID, function(error) {
      //打印错误信息
      console.log(error);
    });

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
    });

    map.on('mapClickNode', event => {
      const { handleClickRiskPoint } = this.props;
      const clickedObj = event.target;
      console.log('clickedObj', clickedObj);
      // const thisTime = moment().valueOf();
      // // 防止点区域同时点到建筑
      // if (thisTime - this.lastTime < 300) return;
      // this.lastTime = thisTime;
      // if (!clickedObj) return;
      // const {
      //   ID,
      //   nodeType,
      //   // eventInfo: { coord: { x, y } = { coord: {} } },
      // } = clickedObj;
      // // this.ids.push({ x, y });
      // // this.ids.push(ID);
      // // console.log('IDS', JSON.stringify(this.ids));

      // if (
      //   [
      //     // fengmap.FMNodeType.FLOOR,
      //     fengmap.FMNodeType.FACILITY,
      //     fengmap.FMNodeType.TEXT_MARKER,
      //     fengmap.FMNodeType.LABEL,
      //     fengmap.FMNodeType.NONE,
      //   ].includes(nodeType)
      // )
      //   return;
      // const { eventInfo: { coord } = {} } = clickedObj;
      // if (coord && isPointInPolygon(coord, polygon)) setDrawerVisible('dangerArea');
      // if (nodeType === fengmap.FMNodeType.IMAGE_MARKER) {
      //   const {
      //     opts_: { iconType, itemId, status },
      //   } = clickedObj;
      //   if (iconType === 2) showVideo();
      //   else if (iconType === 0) handleClickRiskPoint(itemId, status);
      //   else if (iconType === 1)
      //     setDrawerVisible('tankMonitor');
      // }
    });
  }

  handleClickMap = () => {
    this.setState({ gdMapVisible: false });
    this.initMap();
  };

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

  handleClickControl = index => {
    const { visibles } = this.state;
    const copy = [...visibles];
    copy[index] = !visibles[index];
    this.setState({ visibles: copy });
    const groupLayer = map.getFMGroup(1);
    const layers = groupLayer.getLayer('imageMarker');
    if (!layers) return;
    layers[index].show = !visibles[index];
  };

  render() {
    const { gdMapVisible, visibles } = this.state;
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
            <div
              className={styles.positionBtn}
              style={{
                background: `url(${position}) center center / auto 80% no-repeat #fff`,
              }}
              onClick={this.handlePosition}
            />
          </div>
        )}
      </div>
    );
  }
}
