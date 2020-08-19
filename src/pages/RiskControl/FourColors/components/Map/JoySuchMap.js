import React, { Fragment } from 'react';
import { Button, message } from 'antd';
import { isPointInPolygon } from '@/utils/map';
import styles from './Map.less';

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
let tool = null;

export default class JoySuchMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isDrawing: false,
    };
    this.polygonLayers = [];
    this.polygonMarkers = [];
  }

  /* eslint-disable */
  componentDidMount() {
    const { onRef, mapInfo } = this.props;
    onRef && onRef(this);
    mapInfo && this.initMap(mapInfo);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { mapInfo: prevMapInfo, value: prevValue, lvl: prevLvl } = prevProps;
    const { mapInfo, value, lvl } = this.props;
    if (JSON.stringify(prevMapInfo) !== JSON.stringify(mapInfo)) {
      this.handleDispose();
      this.initMap(mapInfo);
    }
    if (JSON.stringify(prevValue) !== JSON.stringify(value)) {
      this.getPolygon(value);
    }
    if (JSON.stringify(prevLvl) !== JSON.stringify(lvl)) {
      this.getPolygon(value);
    }
  }

  getPolygon = points => {
    // console.log('points', points);
    const { lvl } = this.props;
    if (!map || !points || !points.length) return;
    map.removeAllMarker();
    points.length > 0 &&
      this.drawPolygon({
        floorId: +points[0].floorId,
        points: tool.MercatorToWGS84(points),
        color: COLORS[lvl-1],
      });
    // this.addPoint(+points[0].floorId, tool.MercatorToWGS84(points)[0], {
    //   image: billImg,
    //   width: 46,
    //   height: 46,
    // });
  };

  handleDispose = () => {
    if (!map) return;
    document.getElementById('joySuchMap').innerHTML = '';
    map = undefined;
  };

  initMap = ({ appName, key, mapId }) => {
    if (!jsmap || !key) return;
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
      const { isDrawing } = this.state;
      const { coord } = clickedObj.eventInfo;
      const groupId = clickedObj.floorId;

      if (isDrawing) {
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
      //加载按钮型楼层切换控件
      this.loadBtnFloorCtrl();
      this.getPolygon(this.props.value);
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
  addPoint = (floorId, coord, imgProps) => {
    const imageMarker = new jsmap.JSImageMarker({
      // id: 'selectedMarker', //id
      image: dotImg, //图片路径
      // image: testImg,
      position: new jsmap.JSPoint(coord.x, coord.y, 0), //坐标位置
      width: 10, //尺寸-宽
      height: 10, //尺寸-高
      floorId, //楼层 id
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
      ...imgProps,
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
            return model.setColor(zoneLevel ? COLORS[zoneLevel] : COLORS[3]);
          })
        : model.setColor(levelId ? COLORS[levelId] : COLORS[3]);
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
    if (!linePoints.length) return;
    const { handleChangeMapSelect, onChange } = this.props;
    map.removeMarker(drawedPolygon);
    pointMarkers.map(item => {
      map.removeMarker(item);
      return null;
    });
    linePoints = [];
    pointMarkers = [];
    drawedPolygon = null;
    // handleChangeMapSelect([], []);
    onChange && onChange(this.props.value || []);
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

  handleFinishDraw = () => {
    const { levelId, handleChangeMapSelect, onChange } = this.props;
    const currColor = levelId ? COLORS[levelId] : COLORS[3];
    const groupId = linePoints.map(item => item.floorId)[0];
    drawedPolygon = this.drawPolygon({
      floorId: +groupId,
      points: linePoints,
      color: currColor,
    });
    map.removeMarker(lineMarker);

    onChange &&
      onChange(tool.WGS84ToMercator(linePoints).map(item => ({ x: item.x, y: item.y, z: 0, floorId: +groupId })));
    // handleChangeMapSelect && handleChangeMapSelect(linePoints, []);
  };

  renderDrawBtns = () => {
    const { isDrawing } = this.state;
    return (
      <Fragment>
        <Button
          onClick={() => {
            // if (levelId === '') return message.warning('请先选择风险分级！');
            if (!!isDrawing && linePoints.length <= 2) return message.error('区域至少三个坐标点！');
            if (!isDrawing) {
              // 开始画
              this.resetMap();
            } else {
              // 结束画
              this.handleFinishDraw();
            }
            this.setState({ isDrawing: !isDrawing });
          }}
        >
          {!isDrawing ? '开始画' : '结束画'}
        </Button>
        <Button style={{ marginLeft: 15 }} disabled={!!isDrawing} onClick={this.resetMap}>
          重置
        </Button>
      </Fragment>
    );
  };

  render() {
    const { readonly, style, mode } = this.props;
    const isNotDetail = mode !== 'detail';
    return (
      <div className={styles.container} style={style}>
        {isNotDetail && this.renderDrawBtns()}
        <div
          className={styles.map}
          style={{ height: readonly ? '100%' : undefined }}
          id="joySuchMap"
        />
      </div>
    );
  }
}
