import React from 'react';
import { isPointInPolygon } from '@/utils/map';
import dotImg from './img/dot.png';

// 风险等级1红 2橙 3黄 4蓝
const COLORS = [
  'rgba(254, 0, 3, 0.5)',
  'rgba(236, 106, 52, 0.5)',
  'rgba(236, 242, 65, 0.5)',
  'rgba(20, 35, 196, 0.5)',
];
const StrokeColors = {
  'rgba(254, 0, 3, 0.5)': 'rgba(254, 0, 3, 1)',
  'rgba(236, 106, 52, 0.5)': 'rgba(236, 106, 52, 1)',
  'rgba(236, 242, 65, 0.5)': 'rgba(236, 242, 65, 1)',
  'rgba(20, 35, 196, 0.5)': 'rgba(20, 35, 196, 1)',
};
const selectedColor = 'rgb(245,245,245, 0.5)';

const defaultPolygonMarkerHeight = 5;
//配置线型、线宽、透明度等

let map;
let linePoints = [];
let lineMarker = null;
let drawedPolygon = null;
let pointMarkers = [];
let tool = [];

export default class JoySuchMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.polygonLayers = [];
    this.polygonMarkers = [];
  }

  /* eslint-disable */
  componentDidMount() {
    const { onRef, mapInfo } = this.props;
    onRef && onRef(this);
    mapInfo && this.initMap(mapInfo);
  }

  getPointList = (pointList, getBuilding) => {
    const newList = pointList.length > 0 ? pointList : [];
    newList.map(item => {
      const { zoneLevel, coordinateList, groupId, modelIds } = item;
      this.drawPolygon({
        floorId: +groupId,
        points: tool.MercatorToWGS84(coordinateList),
        color: COLORS[zoneLevel - 1],
      });
      return null;
    });
  };

  handleDispose = () => {
    if (!map) return;
    document.getElementById('joySuchMap').innerHTML = '';
    map = undefined;
  };

  initMap = ({ appName, key, mapId }) => {
    if (!jsmap) return;
    const mapOptions = {
      mapType: jsmap.JSMapType.MAP_PSEUDO_3D,
      container: 'joySuchMap',
      token: key,
      mapServerURL: './data/map',
    };

    //初始化地图对象
    map = new jsmap.JSMap(mapOptions);

    //打开Fengmap服务器的地图数据和主题
    map.openMapById(mapId);
    tool = new jsmap.JSMapCoordTool(map);

    map.on('mapClickNode', event => {
      const clickedObj = event;
      if (!clickedObj || !clickedObj.nodeType) return;

      const { coord } = clickedObj.eventInfo;
      const groupId = clickedObj.floorId;

      if (this.props.isDrawing) {
        // 默认第一张地图
        const pointMarker = this.addPoint(groupId, coord);
        pointMarkers.push(pointMarker);
        linePoints.push(coord);
        // 画线
        this.drawLines(groupId, linePoints);
      }
    });

    //地图加载完回调事件
    map.on('loadComplete', () => {
      const { pointList, init, groupId, getBuilding } = this.props;
      //加载按钮型楼层切换控件
      this.loadBtnFloorCtrl(init ? 1 : groupId);
      this.getPointList(pointList, getBuilding);
    });
  };

  //加载按钮型楼层切换控件
  loadBtnFloorCtrl = (groupId = 1) => {
    //楼层控制控件配置参数
    const floorControl = new jsmap.JSFloorControl({
      position: jsmap.JSControlPosition.LEFT_TOP, //控件在容器中的位置             ??????
      showBtnCount: 6, //默认显示楼层的个数 TODO
      allLayers: false, //初始是否是多层显示，默认单层显示
      needAllLayerBtn: true, // 是否显示多层/单层切换按钮
      offset: {
        x: 0,
        y: -5,
      }, //位置 x,y 的偏移量
    });
    map.addControl(floorControl);
  };

  renderDrawedPolygon = (groupId, points, color) => {
    this.resetMap();
    drawedPolygon = this.drawPolygon({
      floorId: +groupId,
      points,
      color,
    });
    points.map(item => {
      const pointMarker = this.addPoint(groupId, item);
      pointMarkers.push(pointMarker);
      return null;
    });
  };

  //在点击的位置添加图片标注
  addPoint = (gid, coord) => {
    const imageMarker = new jsmap.JSImageMarker({
      // id: 'selectedMarker', //id
      image: dotImg, //图片路径
      // image: testImg,
      position: new jsmap.JSPoint(coord.x, coord.y, 0), //坐标位置
      width: 10, //尺寸-宽
      height: 10, //尺寸-高
      floorId: gid, //楼层 id
      offset: jsmap.JSControlPosition.CENTER, //偏移位置
      depthTest: false, //是否开启深度检测
      // offset: {
      //   x: 0,
      //   y: -20,
      // },
      // properties: props, //属性设置
      // callback: node => {
      //   console.log('node', node);
      // }, //回调
    });
    map.addMarker(imageMarker);
    return imageMarker;
  };

  drawPolygon = ({ floorId, points, color = 'rgba(20, 35, 196, 0.5)' }) => {
    const strokeColor = StrokeColors[color];
    const polygonMarker = new jsmap.JSPolygonMarker({
      // id,
      position: points.map(item => ({ ...item, x: +item.x, y: +item.y, z: 0 })),
      floorId,
      color,
      strokeColor,
      // properties: props,
      strokeWidth: 2, //边线宽度
      depthTest: false, //是否开启深度检测
      // callback: marker => {
      //   console.log('marker', marker);
      // },
    });
    this.polygonMarkers.push(polygonMarker);
    map.addMarker(polygonMarker);
    return polygonMarker;
  };

  // 设置model的颜色
  setModelColor(groupId, points, color) {
    // 默认gid为1
    const models = map.getDatasByAlias(groupId, 'model');
    models
      .filter(({ mapCoord }) => isPointInPolygon(mapCoord, points))
      .map(model => model.setColor(color));
    // 获取当前选中区域所有ID
    const arrayList = models
      .filter(({ mapCoord }) => isPointInPolygon(mapCoord, points))
      .map(item => ({ buildingId: item.FID, points: item.mapCoord }));
    this.props.getBuilding && this.props.getBuilding(arrayList, 1);
  }

  // 切换tag
  handleModelEdit = (groupId, points, point, selected) => {
    const { pointList, levelId } = this.props;
    const models = map.getDatasByAlias(groupId, 'model');
    const orginList = models.filter(({ mapCoord }) => isPointInPolygon(mapCoord, points));
    if (selected) {
      const model = orginList.find(item => item.mapCoord === point);
      model.setColorToDefault();
      return null;
    }
    if (!selected) {
      const model = orginList.find(item => item.mapCoord === point);
      pointList.length > 0
        ? pointList.map(item => {
            const { zoneLevel } = item;
            return model.setColor(zoneLevel ? COLORS[zoneLevel] : COLORS[4]);
          })
        : model.setColor(levelId ? COLORS[levelId] : COLORS[4]);
      return null;
    }
  };

  // 删除分区
  removeArea = (index, filterList) => {
    const groupLayer = map.getFMGroup(filterList.groupId);
    groupLayer.removeLayer(this.polygonLayers[index]);
    this.polygonLayers.splice(index, 1);
    const models = map.getDatasByAlias(filterList.groupId, 'model');
    models.map(model => {
      const { mapCoord } = model;
      if (this.polygonMarkers[index].contain({ ...mapCoord, z: 1 })) model.setColorToDefault();
      return null;
    });
    this.polygonMarkers.splice(index, 1);
  };

  // 重置地图
  resetMap = () => {
    // const { groupId } = this.props;
    // const group = map.getFMGroup(groupId);
    // const layerImg = group.getOrCreateLayer('imageMarker');
    // group.removeLayer(layerImg);
    // const layerPolygon = group.getOrCreateLayer('polygonMarker');
    // group.removeLayer(layerPolygon);
    // const models = map.getDatasByAlias(groupId, 'model');
    // models.map(model => model.setColorToDefault());
    // map.removeMarker(lineMarker);
    map.removeMarker(drawedPolygon);
    pointMarkers.map(item => {
      map.removeMarker(item);
      return null;
    });
    linePoints = [];
    pointMarkers = [];
    drawedPolygon = null;
  };

  // 高亮对应区域颜色
  selectedModelColor = filterList => {
    const filterGroupId = filterList.map(item => item.groupId).join('');
    filterList.map(item => {
      const { modelIds } = item;
      const modeIdList = modelIds.split(',');
      const models = map.getDatasByAlias(filterGroupId, 'model');
      models.forEach(item => {
        if (item.FID && modeIdList.includes(item.FID)) {
          item.setColor(selectedColor, 1);
        }
      });
      return null;
    });
  };

  // 恢复对应区域颜色
  restModelColor = filterList => {
    const filterGroupId = filterList.map(item => item.groupId).join('');
    filterList.map(item => {
      const { zoneLevel, modelIds } = item;
      const modeIdList = modelIds.split(',');
      const models = map.getDatasByAlias(filterGroupId, 'model');
      models.forEach(item => {
        if (item.FID && modeIdList.includes(item.FID)) {
          item.setColor(COLORS[zoneLevel], 1);
        }
      });
      return null;
    });
  };

  //绘制线图层
  drawLines = (
    floorId,
    points,
    lineStyle = {
      //设置线的宽度
      width: 4,
      //设置线的类型为导航线
      lineType: jsmap.JSLineType.ARROW,
    }
  ) => {
    //绘制部分
    // 获取选中坐标点
    this.props.getPoints(
      floorId,
      tool.WGS84ToMercator(points).map(item => ({ x: item.x, y: item.y, z: 0 }))
    );
    if (points.length >= 2) {
      lineMarker && map.removeMarker(lineMarker);
      lineMarker = new jsmap.JSLineMarker({
        id: 'line',
        position: points,
        width: 5,
        floorId,
        color: '#3cff2e',
        strokeColor: '#f2ff50',
        strokeWidth: 1,
        lineType: jsmap.JSLineType.ARROW,
        // properties: {
        //   test: 0,
        // },
        // callback: marker => {
        //   console.log(marker);
        // },
        ...lineStyle,
      });
      map.addMarker(lineMarker);
    }
  };

  render() {
    const { isDrawing, levelId, style } = this.props;
    if (!isDrawing && linePoints.length > 0) {
      const groupId = linePoints.map(item => item.floorId)[0];
      const currColor = levelId ? COLORS[levelId - 1] : COLORS[4];
      // doDraw
      drawedPolygon = this.drawPolygon({
        floorId: +groupId,
        points: linePoints,
        color: currColor,
      });
      // 建筑物上色
      // this.setModelColor(groupId, linePoints, currColor);
      map.removeMarker(lineMarker);
      linePoints = [];
    }
    return <div style={style || { height: '70vh' }} id="joySuchMap" />;
  }
}
