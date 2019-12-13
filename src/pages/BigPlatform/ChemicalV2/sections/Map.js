import React, { PureComponent, Fragment } from 'react';
import { Map as GDMap, InfoWindow, Marker, Polygon } from 'react-amap';
// 引入样式文件
import styles from './Map.less';
import moment from 'moment';
import classnames from 'classnames';
import monitor from '../imgs/monitor.png';
import riskPoint from '../imgs/risk-point.png';
import video from '../imgs/video.png';
import mapDot from '@/pages/BigPlatform/NewFireControl/img/mapDot.png';
import { MonitorList } from '../utils';
import monitorActive from '../imgs/monitor-active.png';
import monitorGray from '../imgs/monitor-gray.png';
import riskPointActive from '../imgs/risk-point-active.png';
import riskPointGray from '../imgs/risk-point-gray.png';
import videoActive from '../imgs/video-active.png';
import videoGray from '../imgs/video-gray.png';
import position from '../imgs/position.png';
import monitorAlarm from '../imgs/monitor-alarm.png';

const fengMap = fengmap; // eslint-disable-line
const COLOR = {
  blue: 'rgb(30, 96, 255)',
  orange: 'rgb(241, 122, 10)',
  yellow: 'rgb(251, 247, 25)',
  red: 'rgb(255, 72, 72)',
};
let map;
const fmapID = '100';
const riskPointData = [
  { x: 13224097.846242769, y: 3771544.420560548, itemId: 'xoderg7d9w_mm40m', status: 2 },
  { x: 13224106.708094861, y: 3771522.2904702066, itemId: '3j6vtq7_dolqfgy7', status: 4 },
  { x: 13224076.644961352, y: 3771543.500124462, itemId: 'o0lmmj6eupouatni', status: 2 },
  { x: 13224087.328251136, y: 3771529.231526666, itemId: 'mog_zz27sbvr2o3t', status: 1 },
].map(item => ({ ...item, url: riskPoint, iconType: 0 }));
const monitorData = [
  { x: 13224079.889752572, y: 3771535.0431545274 },
  // { x: 13224088.911112975, y: 3771542.825565829 },
  { x: 13224097.540287659, y: 3771516.5485505313 },
  { x: 13224087.917599482, y: 3771520.8262529834 },
].map(item => ({
  ...item,
  url: monitor,
  iconType: 1,
}));
const videoData = [{ x: 13224080.80175761, y: 3771554.9751555184 }].map(item => ({
  ...item,
  url: video,
  iconType: 2,
}));

const polygon = [
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
const blueIds = [325, 324, 323, 322, 320, 275, 2];
const yellowIds2 = [62, 63, 64, 65, 377, 376];
const isPointInPolygon = (point, polygon) => {
  //下述代码来源：http://paulbourke.net/geometry/insidepoly/，进行了部分修改
  //基本思想是利用射线法，计算射线与多边形各边的交点，如果是偶数，则点在多边形外，否则
  //在多边形内。还会考虑一些特殊情况，如点在多边形顶点上，点在多边形边上等特殊情况。

  var N = polygon.length;
  var boundOrVertex = true; //如果点位于多边形的顶点或边上，也算做点在多边形内，直接返回true
  var intersectCount = 0; //cross points count of x
  var precision = 2e-10; //浮点类型计算时候与0比较时候的容差
  var p1, p2; //neighbour bound vertices
  var p = point; //测试点

  p1 = polygon[0]; //left vertex
  for (var i = 1; i <= N; ++i) {
    //check all rays
    if (p.x == p1.x && p.y == p1.y) {
      return boundOrVertex; //p is an vertex
    }

    p2 = polygon[i % N]; //right vertex
    if (p.y < Math.min(p1.y, p2.y) || p.y > Math.max(p1.y, p2.y)) {
      //ray is outside of our interests
      p1 = p2;
      continue; //next ray left point
    }

    if (p.y > Math.min(p1.y, p2.y) && p.y < Math.max(p1.y, p2.y)) {
      //ray is crossing over by the algorithm (common part of)
      if (p.x <= Math.max(p1.x, p2.x)) {
        //x is before of ray
        if (p1.y == p2.y && p.x >= Math.min(p1.x, p2.x)) {
          //overlies on a horizontal ray
          return boundOrVertex;
        }

        if (p1.x == p2.x) {
          //ray is vertical
          if (p1.x == p.x) {
            //overlies on a vertical ray
            return boundOrVertex;
          } else {
            //before ray
            ++intersectCount;
          }
        } else {
          //cross point on the left side
          var xinters = ((p.y - p1.y) * (p2.x - p1.x)) / (p2.y - p1.y) + p1.x; //cross point of x
          if (Math.abs(p.x - xinters) < precision) {
            //overlies on a ray
            return boundOrVertex;
          }

          if (p.x < xinters) {
            //before ray
            ++intersectCount;
          }
        }
      }
    } else {
      //special case when ray is crossing through the vertex
      if (p.y == p2.y && p.x <= p2.x) {
        //p crossing over p2
        var p3 = polygon[(i + 1) % N]; //next vertex
        if (p.y >= Math.min(p1.y, p3.y) && p.y <= Math.max(p1.y, p3.y)) {
          //p.y lies between p1.y & p3.y
          ++intersectCount;
        } else {
          intersectCount += 2;
        }
      }
    }
    p1 = p2; //next ray left point
  }

  if (intersectCount % 2 == 0) {
    //偶数在多边形外
    return false;
  } else {
    //奇数在多边形内
    return true;
  }
};
const alarmIds = [
  164,
  162,
  163,
  161,
  158,
  159,
  160,
  167,
  170,
  168,
  165,
  169,
  166,
  171,
  270,
  268,
  267,
  264,
  262,
  261,
  258,
  259,
  260,
  263,
  282,
  265,
  266,
  269,
  271,
];
const controls = [
  { label: '风险点', icon: riskPointGray, activeIcon: riskPointActive },
  { label: '视频监控', icon: videoGray, activeIcon: videoActive },
  { label: '监测设备', icon: monitorGray, activeIcon: monitorActive },
];

export default class Map extends PureComponent {
  state = {
    gdMapVisible: true,
    visibles: [true, true, true],
  };

  ids = [];
  polygonArray = [];
  markerArray = [];
  lastTime = 0;

  componentDidMount() {
    // this.initMap();
    const { onRef } = this.props;
    onRef && onRef(this);
  }

  /* eslint-disable*/
  handleUpdateMap = () => {
    console.log('map', map);

    if (!map || !this.markerArray.length) return;
    // this.polygonArray[0].setColor('rgb(255, 72, 72)');
    // const models = map.getDatasByAlias(1, 'model');
    // models.forEach(item => {
    //   if (item.ID && alarmIds.includes(item.ID)) {
    //     item.setColor('rgb(255, 72, 72)', 1);
    //   }
    // });
    this.markerArray[5].url = monitorAlarm;
    this.markerArray[5].jump({ times: 0, duration: 2, height: 2, delay: 0 });
  };

  addMarkers = (x, y, url, restProps) => {
    const groupID = 1;
    const groupLayer = map.getFMGroup(groupID);
    const layer = new fengmap.FMImageMarkerLayer(); //实例化ImageMarkerLayer
    groupLayer.addLayer(layer); //添加图片标注层到模型层。否则地图上不会显示
    const im = new fengmap.FMImageMarker({
      x,
      y,
      url, //设置图片路径
      size: 50, //设置图片显示尺寸
      height: 3, //标注高度，大于model的高度
      ...restProps,
    });
    layer.addMarker(im); //图片标注层添加图片Marker
    im.alwaysShow();
    this.markerArray.push(im);
  };

  addPolygon = (points, color) => {
    const groupLayer = map.getFMGroup(1);
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
    // polygonMarker.alwaysShow(true);
    // polygonMarker.avoid(false);
  };
  /* eslint-disable*/

  initMap() {
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
      console.log('地图加载完成！');
      map.tiltAngle = 50;
      map.rotateAngle = 60;
      map.mapScaleLevel = 21;
      //显示按钮
      // document.getElementById('btnsGroup').style.display = 'block';
      [...riskPointData, ...videoData, ...monitorData].forEach(element => {
        const { x, y, url, ...rest } = element;
        this.addMarkers(x, y, url, rest);
      });

      const ctlOpt = new fengmap.controlOptions({
        mapCoord: {
          //设置弹框的x轴
          x: 13224086.641383199,
          //设置弹框的y轴
          y: 3771557.878213551,
          //设置弹框位于的楼层
          groupID: 1,
          height: 2,
        },
        //设置弹框的宽度
        width: 240,
        //设置弹框的高度
        height: 90,
        marginTop: 10,
        //设置弹框的内容
        content: '该区域新增了碳九解聚装置设施，请对该区域重新风险评价',
      });
      const popMarker = new fengmap.FMPopInfoWindow(map, ctlOpt);

      this.addPolygon(polygon, COLOR.red); // 罐区4
      this.addPolygon(polygon2, COLOR.red); // 罐区4 1 2
      this.addPolygon(polygon3, COLOR.orange);
      this.addPolygon(polygon4, COLOR.blue);
      this.addPolygon(polygon5, COLOR.yellow);
      this.addPolygon(polygon6, COLOR.orange); // 厂房装置区
      console.log('getDatasByAlias', map.getDatasByAlias(1, 'model'));
      // storeModels
      const models = map.getDatasByAlias(1, 'model');
      models.forEach(item => {
        if (item.ID && alarmIds.includes(item.ID)) {
          // 储罐 3 4
          item.setColor(COLOR.red, 1);
        } else if (orangeIds.includes(item.ID)) {
          // orange 储罐 1 2
          item.setColor(COLOR.red, 1);
        } else if (yellowIds.includes(item.ID)) {
          // 最大区域
          item.setColor(COLOR.orange, 1);
        } else if (blueIds.includes(item.ID)) {
          // blue
          item.setColor(COLOR.blue, 1);
        } else if (yellowIds2.includes(item.ID)) {
          item.setColor('rgb(251, 247, 25)', 1);
        }
      });
    });

    map.on('mapClickNode', event => {
      const { handleClickRiskPoint } = this.props;
      const clickedObj = event.target;
      console.log('clickedObj', clickedObj);
      console.log('time', moment().valueOf());
      const thisTime = moment().valueOf();
      if (thisTime - this.lastTime < 300) return;
      this.lastTime = thisTime;
      if (!clickedObj) return;
      const {
        ID,
        nodeType,
        // eventInfo: { coord: { x, y } = { coord: {} } },
      } = clickedObj;
      // this.ids.push({ x, y });
      // this.ids.push(ID);
      // console.log('IDS', JSON.stringify(this.ids));

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
      const { eventInfo: { coord } = {} } = clickedObj;
      if (coord && isPointInPolygon(coord, polygon)) setDrawerVisible('dangerArea');
      if (nodeType === fengmap.FMNodeType.IMAGE_MARKER) {
        const {
          opts_: { iconType, itemId, status },
        } = clickedObj;
        // console.log('iconType', iconType);
        console.log('itemId', itemId);

        if (iconType === 2) showVideo();
        else if (iconType === 0) handleClickRiskPoint(itemId, status);
        else if (iconType === 1)
          // setDrawerVisible('monitorDetail', { monitorType: 0, monitorData: MonitorList[0][0] });
          setDrawerVisible('tankMonitor');
      }
      // this.addMarkers(x, y, riskPoint, 0);

      // this.ids.push(ID);
      // console.log('IDS', JSON.stringify(this.ids));

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

  handlePosition = () => {
    window.open(`${window.publicPath}#/big-platform/personnel-position/index`, `_blank`);
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

  handleClickControl = index => {
    const { visibles } = this.state;
    const copy = [...visibles];
    copy[index] = !visibles[index];
    this.setState({ visibles: copy });
    // const groupLayer = map.getFMGroup(1);
    // const layers = groupLayer.getLayer('imageMarker');
    // console.log('layers', layers);
    if (index === 0) {
      for (let i = 0; i < 4; i++) {
        this.markerArray[i].show = copy[index];
      }
    } else if (index === 1) {
      this.markerArray[4].show = copy[index];
    } else if (index === 2) {
      this.markerArray[5].show = copy[index];
      this.markerArray[6].show = copy[index];
      this.markerArray[7].show = copy[index];
    }
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
            {/* <MapTypeBar /> */}
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
                // onClick={()=>this.setState({visibles: !visibles[index]})}
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
