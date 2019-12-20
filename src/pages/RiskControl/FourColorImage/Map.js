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
const defaultPolygonMarkerHeight = 5;
//配置线型、线宽、透明度等

let map;
let points = [];
let naviLines = [];

export default class Map extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.initMap();
  }

  initMap() {
    var mapOptions = {
      //必要，地图容器
      container: document.getElementById('fengMap'),
      //地图数据位置
      mapServerURL: './data/' + fmapID,
      defaultViewMode: fengMap.FMViewMode.MODE_2D,
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
    map.openMapById(fmapID);

    //2D、3D控件配置
    // var toolControl = new fengMap.toolControl(map, {
    //   init2D: true, //初始化2D模式
    //   groupsButtonNeeded: false, //设置为false表示只显示2D,3D切换按钮
    //   position: fengMap.controlPositon.LEFT_TOP,
    //   //点击按钮的回调方法,返回type表示按钮类型,value表示对应的功能值
    //   clickCallBack: function(type, value) {
    //     console.log(type, value);
    //   },
    // });

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
      }
    });
  }

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
  }

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
  }

  render() {
    const { isDrawing } = this.props;
    if (!isDrawing && points.length > 0) {
      // doDraw
      this.drawPolygon(points, COLOR.blue);
      map.clearLineMark();
      points = [];
    }
    return <div style={{ height: '80vh' }} id="fengMap" />;
  }
}
