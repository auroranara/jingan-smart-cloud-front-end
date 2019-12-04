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
  { x: 13224092.737655401, y: 3771528.058833545, z: 5 },
  { x: 13224082.323110294, y: 3771521.7336946093, z: 5 },
  { x: 13224090.980083626, y: 3771508.279856456, z: 5 },
  { x: 13224100.86477513, y: 3771515.1545231547, z: 5 },
];
var polygon2 = [
  { x: 13224084.575739587, y: 3771540.668235109, z: 5 },
  { x: 13224080.351547241, y: 3771537.8089334294, z: 5 },
  { x: 13224086.527122464, y: 3771528.2824612646, z: 5 },
  { x: 13224090.902601298, y: 3771531.1079516136, z: 5 },
];

export default class Map extends PureComponent {
  state = {
    gdMapVisible: false,
  };

  ids = [];

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
      map.rotateAngle = 60;
      map.mapScaleLevel = 21;
      //显示按钮
      // document.getElementById('btnsGroup').style.display = 'block';
      [...riskPointData, ...videoData, ...monitorData].forEach(element => {
        const { x, y, url } = element;
        this.addMarkers(x, y, url);
      });

      this.addPolygon(polygon, 'rgb(255, 72, 72)');
      this.addPolygon(polygon2, 'rgb(241, 122, 10)');
      console.log('fengmap', fengmap);
      console.log('fengmap.FMNodeType', fengmap.FMNodeType);
      console.log('getDatasByAlias', map.getDatasByAlias(1, 'model'));
      // redModel
      map.getDatasByAlias(1, 'model').forEach(item => {
        if ((item.ID && (item.ID >= 158 && item.ID <= 171)) || (item.ID >= 258 && item.ID <= 271))
          item.setColor('rgb(255, 72, 72)', 1);
      });
      // orange Model
      map.getDatasByAlias(1, 'model').forEach(item => {
        if ([284, 285, 286, 287, 364, 363, 366, 362].includes(item.ID))
          item.setColor('rgb(241, 122, 10)', 1);
      });
      // const model = fengmap.FMStoreModel({ ID: 171 });
      // console.log('map', map);
      // model.setColor('#FF00FF', 1);
    });

    map.on('mapClickNode', event => {
      var clickedObj = event.target;
      console.log('clickedObj', clickedObj);
      if (!clickedObj) return;
      const { ID, nodeType } = clickedObj;
      // clickedObj.setColor('#FF00FF', 1);
      if (
        [
          fengmap.FMNodeType.FLOOR,
          fengmap.FMNodeType.IMAGE_MARKER,
          fengmap.FMNodeType.TEXT_MARKER,
          fengmap.FMNodeType.LABEL,
          fengmap.FMNodeType.NONE,
        ].includes(nodeType)
      )
        return;

      this.ids.push(ID);
      console.log('IDS', JSON.stringify(this.ids));
      // clickedObj.setColorToDefault();
      // clickedObj.setColor('rgb(212,214,215)', 0.9);
      // const { eventInfo: { coord: { x, y } } = { coord: {} }, ID } = clickedObj;
      if (ID && (ID >= 158 && ID <= 171)) {
        setDrawerVisible('storageArea');
      } else if (ID && [18, 22, 23, 45, 24, 26, 25].includes(ID)) {
        setDrawerVisible('dangerArea');
      }
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
