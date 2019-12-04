import React, { PureComponent, Fragment } from 'react';
import { Map as GDMap, InfoWindow, Marker, Polygon } from 'react-amap';
// 引入样式文件
import styles from './Map.less';
import monitor from '../imgs/monitor.png';
import riskPoint from '../imgs/risk-point.png';
import video from '../imgs/video.png';
import mapDot from '@/pages/BigPlatform/NewFireControl/img/mapDot.png';

const fengMap = fengmap; // eslint-disable-line
let map;
const fmapID = '100';
const riskPointData = [
  // { x: 13224085.195, y: 3771561.4 },
  // { x: 13224102.075, y: 3771523.09 },
  // { x: 13224092.86, y: 3771511.045 },
  { x: 13224101.001990594, y: 3771533.1014921553 },
].map(item => ({ ...item, url: riskPoint, iconType: 0 }));
const monitorData = [
  // { x: 13224071.03, y: 3771548.44 },
  // { x: 13224116.835, y: 3771518.5149999997 },
  // { x: 13224101.82, y: 3771541.99 },
  { x: 13224092.070077084, y: 3771519.1187018724 },
].map(item => ({ ...item, url: monitor, iconType: 1 }));
const videoData = [
  // { x: 13224089.8, y: 3771556.13 },
  // { x: 13224091.81, y: 3771525.2 },
  // { x: 13224087.335, y: 3771518.49 },
  { x: 13224080.80175761, y: 3771554.9751555184 },
].map(item => ({ ...item, url: video, iconType: 2 }));

var polygon = [
  { x: 13224092.737655401, y: 3771528.058833545, z: 5 },
  { x: 13224082.323110294, y: 3771521.7336946093, z: 5 },
  { x: 13224090.980083626, y: 3771508.279856456, z: 5 },
  { x: 13224100.86477513, y: 3771515.1545231547, z: 5 },
];
const polygon2 = [
  { x: 13224084.606447829, y: 3771540.677358584, z: 5 },
  { x: 13224075.302879425, y: 3771534.8369235117, z: 5 },
  { x: 13224082.510873934, y: 3771522.4809836615, z: 5 },
  { x: 13224091.869743008, y: 3771529.005799528, z: 5 },
];
const polygon3 = [
  { x: 13224102.220875029, y: 3771511.658937419, z: 5 },
  { x: 13224093.579820821, y: 3771505.850768219, z: 5 },
  { x: 13224096.925871624, y: 3771498.836214508, z: 5 },
  { x: 13224106.232107593, y: 3771504.932848931, z: 5 },
];
const polygon4 = [
  { x: 13224075.04874117, y: 3771558.455898758, z: 5 },
  { x: 13224065.32305676, y: 3771552.23997832, z: 5 },
  { x: 13224075.587787382, y: 3771535.5750350878, z: 5 },
  { x: 13224084.398874512, y: 3771541.403387627, z: 5 },
];
const polygon5 = [
  { x: 13224088.38895164, y: 3771566.2041060957, z: 5 },
  { x: 13224075.844274482, y: 3771558.4755680165, z: 5 },
  { x: 13224082.91298723, y: 3771546.7255567973, z: 5 },
  { x: 13224096.380126737, y: 3771555.779695424, z: 5 },
];
const polygon6 = [
  { x: 13224097.41787141, y: 3771555.96781488, z: 5 },
  { x: 13224082.09070458, y: 3771545.7784301136, z: 1 },
  { x: 13224107.523576317, y: 3771506.1517261784, z: 1 },
  { x: 13224123.953042774, y: 3771516.0555504337, z: 1 },
];

const orangeIds = [
  284,
  285,
  286,
  287,
  364,
  363,
  366,
  362,
  255,
  253,
  248,
  251,
  252,
  257,
  249,
  256,
  254,
  250,
  246,
  247,
  116,
  115,
  111,
  113,
];
const yellowIds = [
  13,
  15,
  17,
  21,
  94,
  6,
  18,
  22,
  23,
  24,
  25,
  26,
  27,
  28,
  45,
  46,
  69,
  70,
  71,
  72,
  73,
  74,
  75,
  76,
  106,
  107,
  108,
  51,
  54,
  58,
  57,
  56,
  55,
  379,
  378,
  374,
  30,
  32,
  67,
  35,
  36,
  37,
  38,
  39,
  44,
  43,
  42,
  41,
  40,
  401,
  19,
  20,
  47,
  48,
  49,
  5,
  50,
];
const blueIds = [325, 324, 323, 322, 320, 275, 2, 65, 376, 377, 64, 63, 62];

export default class Map extends PureComponent {
  state = {
    gdMapVisible: true,
  };

  ids = [];

  componentDidMount() {
    // this.initMap();
  }

  /* eslint-disable*/
  addMarkers = (x, y, url, iconType) => {
    const groupID = 1;
    const groupLayer = map.getFMGroup(groupID);
    var layer = new fengmap.FMImageMarkerLayer(); //实例化ImageMarkerLayer
    groupLayer.addLayer(layer); //添加图片标注层到模型层。否则地图上不会显示
    var im = new fengmap.FMImageMarker({
      x,
      y,
      url, //设置图片路径
      size: 50, //设置图片显示尺寸
      height: 3, //标注高度，大于model的高度
      iconType,
    });
    layer.addMarker(im); //图片标注层添加图片Marker
    im.alwaysShow();
  };

  addPolygon = (points, color) => {
    var groupLayer = map.getFMGroup(1);
    //创建PolygonMarkerLayer
    var layer = new fengmap.FMPolygonMarkerLayer();
    groupLayer.addLayer(layer);
    var polygonMarker = new fengmap.FMPolygonMarker({
      alpha: 0.5, //设置透明度
      lineWidth: 0, //设置边框线的宽度
      height: 1, //设置高度*/
      points, //多边形坐标点
    });
    polygonMarker.setColor(color);
    layer.addMarker(polygonMarker);
    // polygonMarker.alwaysShow(true);
    // polygonMarker.avoid(false);
  };
  /* eslint-disable*/

  initMap() {
    const { setDrawerVisible, showVideo } = this.props;
    var mapOptions = {
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
    var toolControl = new fengmap.toolControl(map, {
      init2D: false, //初始化2D模式
      groupsButtonNeeded: false, //设置为false表示只显示2D,3D切换按钮
      position: fengmap.controlPositon.LEFT_TOP,
      //点击按钮的回调方法,返回type表示按钮类型,value表示对应的功能值
      clickCallBack: function(type, value) {
        // console.log(type,value);
      },
    });

    // 地图加载完成事件
    map.on('loadComplete', () => {
      console.log('地图加载完成！');
      map.tiltAngle = 50;
      map.rotateAngle = 60;
      map.mapScaleLevel = 21;
      //显示按钮
      // document.getElementById('btnsGroup').style.display = 'block';
      [...riskPointData, ...videoData, ...monitorData].forEach(element => {
        const { x, y, url, iconType } = element;
        this.addMarkers(x, y, url, iconType);
      });

      this.addPolygon(polygon, 'rgb(255, 72, 72)');
      this.addPolygon(polygon2, 'rgb(241, 122, 10)');
      this.addPolygon(polygon3, 'rgb(241, 122, 10)');
      this.addPolygon(polygon4, 'rgb(30, 96, 255)');
      this.addPolygon(polygon5, 'rgb(30, 96, 255)');
      this.addPolygon(polygon6, 'rgb(251, 247, 25)');
      console.log('fengmap', fengmap);
      console.log('fengmap.FMNodeType', fengmap.FMNodeType);
      console.log('getDatasByAlias', map.getDatasByAlias(1, 'model'));
      // storeModels
      const models = map.getDatasByAlias(1, 'model');
      models.forEach(item => {
        if ((item.ID && (item.ID >= 158 && item.ID <= 171)) || (item.ID >= 258 && item.ID <= 271)) {
          // red
          item.setColor('rgb(255, 72, 72)', 1);
        } else if (orangeIds.includes(item.ID)) {
          // orange
          item.setColor('rgb(241, 122, 10)', 1);
        } else if (yellowIds.includes(item.ID)) {
          // yellow
          item.setColor('rgb(251, 247, 25)', 1);
        } else if (blueIds.includes(item.ID)) {
          // blue
          item.setColor('rgb(30, 96, 255)', 1);
        }
      });
    });

    map.on('mapClickNode', event => {
      var clickedObj = event.target;
      console.log('clickedObj', clickedObj);
      if (!clickedObj) return;
      const {
        ID,
        nodeType,
        // eventInfo: { coord: { x, y } = { coord: {} } },
      } = clickedObj;
      // this.ids.push({ x, y });
      // console.log('IDS', JSON.stringify(this.ids));
      if (
        [
          fengmap.FMNodeType.FLOOR,
          // fengmap.FMNodeType.IMAGE_MARKER,
          fengmap.FMNodeType.TEXT_MARKER,
          fengmap.FMNodeType.LABEL,
          fengmap.FMNodeType.NONE,
        ].includes(nodeType)
      )
        return;
      if (nodeType === fengmap.FMNodeType.IMAGE_MARKER) {
        const {
          opts_: { iconType },
        } = clickedObj;
        console.log('iconType', iconType);
        if (iconType === 2) showVideo();
        else if (iconType === 0) setDrawerVisible('dangerArea');
        else if (iconType === 1) setDrawerVisible('storageArea');
      }
      // this.addMarkers(x, y, riskPoint, 0);

      // this.ids.push(ID);
      // console.log('IDS', JSON.stringify(this.ids));
      // clickedObj.setColorToDefault();
      // clickedObj.setColor('rgb(212,214,215)', 0.9);
      // if (ID && (ID >= 158 && ID <= 171)) {
      //   setDrawerVisible('storageArea');
      // } else if (ID && [18, 22, 23, 45, 24, 26, 25].includes(ID)) {
      //   setDrawerVisible('dangerArea');
      // }
      // this.addMarkers(x, y, riskPoint, 0);

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

  handleClickMap = () => {
    this.setState({ gdMapVisible: false });
    this.initMap();
  };

  renderMarkers = () => {
    return (
      <Marker
        // title={name}
        position={{ longitude: 120.3660553694, latitude: 31.5441255765 }}
        // offset={isFire && isSelected ? [-100, -122] : [-22, -45]}
        offset={[-22, -45]}
        events={{
          click: this.handleClickMap,
          // created: () => {
          //   if (isLast) {
          //     this.mapInstance.on('complete', () => {
          //       this.mapInstance.setFitView(
          //         this.mapInstance.getAllOverlays().filter(d => d.CLASS_NAME === 'AMap.Marker')
          //       );
          //     });
          //   }
          // },
        }}
      >
        <div
          className={styles.dotIcon}
          // onMouseEnter={isSelected ? null : handleMouseEnter}
          // onMouseLeave={isSelected ? null : hideTooltip}
          style={{ backgroundImage: `url(${mapDot})` }}
        />
      </Marker>
    );
  };

  render() {
    const { gdMapVisible } = this.state;
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
            {/* <MapTypeBar /> */}
          </GDMap>
        )}
      </div>
    );
  }
}
