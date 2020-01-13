import React from 'react';
import { Modal } from 'antd';
import { isPointInPolygon } from '@/utils/map';

const fengMap = fengmap; // eslint-disable-line
const fmapID = '100';
const COLOR = {
  orange: 'rgb(241, 122, 10)',
  yellow: 'rgb(251, 247, 25)',
  red: 'rgb(255, 72, 72)',
  blue: 'rgb(30, 96, 255)',
};

const COLORS = {
  1: 'rgb(252, 31, 2)',
  2: 'rgb(237, 126, 17)',
  3: 'rgb(251, 247, 24)',
  4: 'rgb(30, 96, 255)',
};
const selectedColor = 'rgb(255,255,255, 0.8)';

const defaultPolygonMarkerHeight = 5;
//配置线型、线宽、透明度等

let map;
let points = [];
let naviLines = [];

let buildingId = [];
export default class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.polygonLayers = [];
    this.polygonMarkers = [];
  }

  componentDidMount() {
    const { onRef } = this.props;
    onRef && onRef(this);
    // this.initMap();
  }

  getPointList = pointList => {
    const newList = pointList.length > 0 ? pointList : [];
    newList.length > 0 &&
      pointList.map(item => {
        const { zoneLevel, coordinateList, modelIds } = item;
        const cordPoints = coordinateList.map(item => ({ x: +item.x, y: +item.y }));
        const modeIdList = modelIds.split(',').map(Number);
        if (modeIdList.length > 0) {
          const models = map.getDatasByAlias(1, 'model');
          models.forEach(item => {
            if (item.ID && modeIdList.includes(item.ID)) {
              item.setColor(COLORS[zoneLevel], 1);
            }
          });
          this.drawPolygon(cordPoints, '');
        } else {
          this.drawPolygon(cordPoints, COLORS[zoneLevel]);
          this.setModelColor(cordPoints, COLORS[zoneLevel]);
        }
        return null;
      });
  };

  handleDispose = () => {
    map && map.dispose();
  };

  initMap = ({ appName, key, mapId }) => {
    var mapOptions = {
      //必要，地图容器
      container: document.getElementById('fengMap'),
      //地图数据位置
      mapServerURL: './data/' + mapId,
      defaultViewMode: fengMap.FMViewMode.MODE_2D,
      //主题数据位置
      // mapThemeURL: './data/theme',
      //设置主题
      defaultThemeName: '2001',
      modelSelectedEffect: false,
      //默认背景颜色,十六进制颜色值或CSS颜色样式 0xff00ff, '#00ff00'
      // defaultBackgroundColor: '#f7f4f4',
      //必要，地图应用名称，通过蜂鸟云后台创建
      appName,
      //必要，地图应用密钥，通过蜂鸟云后台获取
      key,
    };

    //初始化地图对象
    map = new fengMap.FMMap(mapOptions);

    //打开Fengmap服务器的地图数据和主题
    map.openMapById(mapId);

    //2D、3D控件配置
    var toolControl = new fengMap.toolControl(map, {
      init2D: true, //初始化2D模式
      groupsButtonNeeded: false, //设置为false表示只显示2D,3D切换按钮
      position: fengMap.controlPositon.LEFT_TOP,
      offset: { x: 0, y: 40 },
      //点击按钮的回调方法,返回type表示按钮类型,value表示对应的功能值
      clickCallBack: function(type, value) {
        console.log(type, value);
      },
    });

    map.on('mapClickNode', event => {
      var clickedObj = event.target;
      if (!clickedObj || !clickedObj.eventInfo) return;

      var { coord } = clickedObj.eventInfo;
      if (this.props.isDrawing) {
        // 默认第一张地图
        this.addPoint(1, coord);
        points.push(coord);
        // 画线
        this.drawLines(points);
        // 获取当前所选建筑物ID
      }
    });

    map.on('loadComplete', () => {
      this.getPointList(this.props.pointList);
      this.props.pointList.length > 0 &&
        this.props.pointList.map(item => {
          const { coordinateList } = item;
          const cordList = coordinateList.map(item => ({ x: +item.x, y: +item.y, z: +item.z }));
          const models = map.getDatasByAlias(1, 'model');
          return (
            (buildingId = models
              .filter(({ mapCoord }) => isPointInPolygon(mapCoord, cordList))
              .map(item => ({ buildingId: item.ID, points: item.mapCoord }))),
            this.props.getBuilding && this.props.getBuilding(buildingId)
          );
        });
    });
  };

  //在点击的位置添加图片标注
  addPoint(gid, coord) {
    var group = map.getFMGroup(gid);
    //返回当前层中第一个imageMarkerLayer,如果没有，则自动创建
    var layer = group.getOrCreateLayer('imageMarker');
    var im = new fengMap.FMImageMarker({
      x: coord.x,
      y: coord.y,
      url: 'https://webapi.amap.com/images/dd-via.png',
      height: 3, //defaultPolygonMarkerHeight,
      size: 10,
      callback: function() {
        im.alwaysShow();
      },
    });
    layer.addMarker(im);
  }

  drawPolygon(points, color) {
    var groupLayer = map.getFMGroup(1);
    //创建PolygonMarkerLayer
    var layer = new fengMap.FMPolygonMarkerLayer();
    groupLayer.addLayer(layer);
    var polygonMarker = new fengMap.FMPolygonMarker({
      alpha: 0.5, //设置透明度
      lineWidth: 1, //设置边框线的宽度
      height: 5, //设置高度*/
      points, //多边形坐标点
    });
    polygonMarker.setColor(color);
    layer.addMarker(polygonMarker);
    this.polygonLayers.push(layer);
    this.polygonMarkers.push(polygonMarker);
  }

  // 设置model的颜色
  setModelColor(points, color) {
    // 默认gid为1
    const models = map.getDatasByAlias(1, 'model');
    models
      .filter(({ mapCoord }) => isPointInPolygon(mapCoord, points))
      .map(model => model.setColor(color));
    // 获取当前选中区域所有ID
    buildingId = models
      .filter(({ mapCoord }) => isPointInPolygon(mapCoord, points))
      .map(item => ({ buildingId: item.ID, points: item.mapCoord }));
    this.props.getBuilding && this.props.getBuilding(buildingId);
  }

  // 切换tag
  handleModelEdit = (points, areaId, point, selected) => {
    const models = map.getDatasByAlias(1, 'model');
    const orginList = models.filter(({ mapCoord }) => isPointInPolygon(mapCoord, points));
    if (!!selected && this.polygonMarkers[0].contain({ ...point, z: 1 })) {
      const model = orginList.find(item => item.mapCoord === point);
      model.setColorToDefault();
      return null;
    }
    if (!selected && this.polygonMarkers[0].contain({ ...point, z: 1 })) {
      const model = orginList.find(item => item.mapCoord === point);
      this.props.pointList.length > 0
        ? this.props.pointList.map(item => {
            const { zoneLevel } = item;
            return model.setColor(COLORS[zoneLevel]);
          })
        : model.setColor(COLOR.blue);

      return null;
    }
  };

  // 删除分区
  removeArea = index => {
    const groupLayer = map.getFMGroup(1);
    groupLayer.removeLayer(this.polygonLayers[index]);
    this.polygonLayers.splice(index, 1);
    const models = map.getDatasByAlias(1, 'model');
    models.map(model => {
      const { mapCoord } = model;
      if (this.polygonMarkers[index].contain({ ...mapCoord, z: 1 })) model.setColorToDefault();
      return null;
    });
    this.polygonMarkers.splice(index, 1);
  };

  // 重置地图
  setRestMap = () => {
    const group = map.getFMGroup(1);
    const layerImg = group.getOrCreateLayer('imageMarker');
    group.removeLayer(layerImg);
    const layerPolygon = group.getOrCreateLayer('polygonMarker');
    group.removeLayer(layerPolygon);
    const models = map.getDatasByAlias(1, 'model');
    models.map(model => model.setColorToDefault());
    map.clearLineMark();
    buildingId = [];
  };

  // 高亮对应区域颜色
  selectedModelColor = (id, fun) => {
    const { pointList } = this.props;
    pointList.filter(item => item.id === id).map(item => {
      const { coordinateList } = item;
      const points = coordinateList.map(item => ({ x: +item.x, y: +item.y }));
      this.setModelColor(points, selectedColor);
      this.drawPolygon(points, selectedColor);
      return null;
    });
  };

  // 恢复对应区域颜色
  restModelColor = id => {
    const { pointList } = this.props;
    pointList.filter(item => item.id === id).map(item => {
      const { coordinateList, zoneLevel } = item;
      const points = coordinateList.map(item => ({ x: +item.x, y: +item.y }));
      this.drawPolygon(points, COLORS[zoneLevel]);
      this.setModelColor(points, COLORS[zoneLevel]);
      return null;
    });
  };

  //绘制线图层
  drawLines(
    points,
    lineStyle = {
      //设置线的宽度
      lineWidth: 4,
      //设置线的透明度
      alpha: 0.8,
      // offsetHeight 默认的高度为 1, (离楼板1米的高度)
      height: defaultPolygonMarkerHeight,
      //设置线的类型为导航线
      lineType: fengMap.FMLineType.FMARROW,
      //设置线动画,false为动画
      noAnimate: true,
    }
  ) {
    //绘制部分
    var line = new fengMap.FMLineMarker();
    var seg = new fengMap.FMSegment();
    seg.groupId = map.focusGroupID;
    seg.points = points;
    line.addSegment(seg);
    var lineObject = map.drawLineMark(line, lineStyle);
    naviLines.push(lineObject);
    // 获取选中坐标点
    this.props.getPoints(points);
  }

  render() {
    const { isDrawing } = this.props;
    if (!isDrawing && points.length > 0) {
      // doDraw
      this.drawPolygon(points, COLOR.blue);
      // 建筑物上色
      this.setModelColor(points, COLOR.blue);
      map.clearLineMark();
      points = [];
    }
    return <div style={{ height: '80vh' }} id="fengMap" />;
  }
}
