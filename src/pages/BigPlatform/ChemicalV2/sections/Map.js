import React, { PureComponent, Fragment } from 'react';
// 引入样式文件
import styles from './Map.less';
import monitor from '../imgs/monitor.png';
import riskPoint from '../imgs/risk-point.png';
import video from '../imgs/video.png';

const fengMap = fengmap; // eslint-disable-line
let map;
const fmapID = '100';
const riskPointData = [
  { x: 13224085.195, y: 3771561.4 },
  { x: 13224102.075, y: 3771523.09 },
  { x: 13224092.86, y: 3771511.045 },
].map(item => ({ ...item, url: riskPoint, type: 0 }));
const monitorData = [
  { x: 13224071.03, y: 3771548.44 },
  { x: 13224116.835, y: 3771518.5149999997 },
  { x: 13224101.82, y: 3771541.99 },
].map(item => ({ ...item, url: monitor, type: 1 }));
const videoData = [
  { x: 13224089.8, y: 3771556.13 },
  { x: 13224091.81, y: 3771525.2 },
  // { x: 13224087.335, y: 3771518.49 },
].map(item => ({ ...item, url: video, type: 2 }));

var polygon = [
  { x: 13224100.28002908, y: 3771532.907471671, z: 5 },
  { x: 13224082.323110294, y: 3771521.7336946093, z: 5 },
  { x: 13224090.980083626, y: 3771508.279856456, z: 5 },
  { x: 13224108.33396728, y: 3771520.1080805957, z: 5 },
  // { x: 12961590, y: 4861835, z: 56 },
];

export default class Map extends PureComponent {
  state = {};

  componentDidMount() {
    this.initMap();
  }

  /* eslint-disable*/
  addMarkers = (x, y, url, type) => {
    const groupID = 1;
    const groupLayer = map.getFMGroup(groupID);
    var layer = new fengmap.FMImageMarkerLayer(); //实例化ImageMarkerLayer
    groupLayer.addLayer(layer); //添加图片标注层到模型层。否则地图上不会显示
    var im = new fengmap.FMImageMarker({
      x,
      y,
      url, //设置图片路径
      size: 32, //设置图片显示尺寸
      height: 3, //标注高度，大于model的高度
      type,
    });
    layer.addMarker(im); //图片标注层添加图片Marker
    im.alwaysShow();
  };

  addPolygon = () => {
    var groupLayer = map.getFMGroup(1);
    //创建PolygonMarkerLayer
    var layer = new fengmap.FMPolygonMarkerLayer();
    groupLayer.addLayer(layer);
    var polygonMarker = new fengmap.FMPolygonMarker({
      alpha: 0.5, //设置透明度
      lineWidth: 0, //设置边框线的宽度
      height: 1, //设置高度*/
      points: polygon, //多边形坐标点
    });

    layer.addMarker(polygonMarker);
    // polygonMarker.alwaysShow(true);
    // polygonMarker.avoid(false);
  };
  /* eslint-disable*/

  initMap() {
    const { setDrawerVisible } = this.props;
    var mapOptions = {
      //必要，地图容器
      container: document.getElementById('fengMap'),
      //地图数据位置
      mapServerURL: './data/' + fmapID,
      //主题数据位置
      // mapThemeURL: './data/theme',
      //设置主题
      defaultThemeName: '2001',
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

    //地图加载完成事件
    map.on('loadComplete', () => {
      console.log('地图加载完成！');
      //显示按钮
      // document.getElementById('btnsGroup').style.display = 'block';
      [...riskPointData, ...videoData, ...monitorData].forEach(element => {
        const { x, y, url } = element;
        this.addMarkers(x, y, url);
      });

      this.addPolygon();
    });

    map.on('mapClickNode', function(event) {
      var clickedObj = event.target;
      console.log('clickedObj', clickedObj);
      if (!clickedObj) return;
      const {
        eventInfo: {
          coord: { x, y },
        },
        ID,
      } = clickedObj;
      if (ID && (ID >= 158 && ID <= 171)) {
        console.log('44444');
        setDrawerVisible('storageArea');
      } else if (ID && [18, 22, 23, 45, 24, 26, 25].includes(ID)) {
        setDrawerVisible('dangerArea');
      }

      // switch (clickedObj.nodeType) {
      //   case fengmap.FMNodeType.FLOOR:
      //     break;
      //   case fengmap.FMNodeType.MODEL:
      //     break;
      //   case fengmap.FMNodeType.IMAGE_MARKER:
      //     console.log('IMAGE_MARKER');
      //     break;
      //   case fengmap.FMNodeType.TEXT_MARKER:
      //     break;
      //   case fengmap.FMNodeType.POLYGON_MARKER:
      //     console.log('1111111111');
      //     setDrawerVisible('storageArea');
      //     break;
      //   case fengmap.FMNodeType.FACILITY:
      //     break;
      // }
    });
  }

  render() {
    return <div className={styles.container} id="fengMap" />;
  }
}
