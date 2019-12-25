import React, { PureComponent } from 'react';
import {
  Button,
} from 'antd';
import { connect } from 'dva';
import { isArray } from '@/utils/utils';
import styles from './index.less';

const fengMap = fengmap; // eslint-disable-line

@connect(({ map }) => ({
  map,
}))
export default class MarkerFengMap extends PureComponent {

  constructor(props) {
    super(props);
    this.map = null;
    this.btnFloorControl = null;
    this.polygonMarkers = [];
  }

  componentDidMount () {
    const {
      dispatch,
      companyId,
    } = this.props;
    // 获取地图列表
    dispatch({
      type: 'map/fetchMapList',
      payload: { companyId },
      callback: (mapInfo) => {
        this.initMap({ ...mapInfo }, () => {
          dispatch({
            type: 'map/fetchMapAreaList',
            payload: { companyId, pageNum: 1, pageSize: 0 },
            callback: ({ list }) => {
              list.forEach(({ coordinateList, groupId, id }) => {
                this.drawPolygon({ groupId, coords: coordinateList, id });
              })
            },
          })
        })
      },
    })
  }

  // 初始化地图定位
  initMap = ({ appName, key, mapId }, fun) => {
    const mapOptions = {
      //必要，地图容器
      container: document.getElementById('fengMap'),
      //地图数据位置
      mapServerURL: './data/' + mapId,
      defaultViewMode: fengMap.FMViewMode.MODE_2D,
      //设置主题
      defaultThemeName: '2001',
      modelSelectedEffect: false,
      appName,
      key,
    };

    //初始化地图对象
    this.map = new fengMap.FMMap(mapOptions);
    //打开Fengmap服务器的地图数据和主题
    this.map.openMapById(mapId);

    // 监听点击
    this.map.on('mapClickNode', event => {
      const { id, form: { setFieldsValue } } = this.props;
      const clickedObj = event.target;
      // console.log('clickedObj', clickedObj);
      if (!clickedObj || !clickedObj.eventInfo) return;
      const { coord } = clickedObj.eventInfo;
      const groupId = clickedObj.groupID;
      // 清除之前的坐标
      this.handleResetMapLocation();
      this.addImgMarker({ groupId, coord });
      let temp = {};
      temp[id] = { groupId, coord, areaId: this.generateArea(coord) };
      setFieldsValue(temp);
    });

    //地图加载完回调事件
    this.map.on('loadComplete', event => {
      const { initialData: { groupId, coord } } = this.props;
      //加载按钮型楼层切换控件
      this.loadBtnFloorCtrl(groupId);
      // 如果传入点信息
      groupId && coord && this.addImgMarker({ groupId, coord });
      // 标注区域
      fun && fun();
    });
  }


  generateArea = (coord) => {
    if (!this.polygonMarkers || this.polygonMarkers.length === 0) return undefined;
    const target = this.polygonMarkers.find(item => item.contain(coord)) || {};
    return target.areaId;
  }

  //加载按钮型楼层切换控件
  loadBtnFloorCtrl = (groupId = 1) => {
    //楼层控制控件配置参数
    const btnFloorCtlOpt = new fengMap.controlOptions({
      //默认在右下角
      position: fengMap.controlPositon.RIGHT_TOP,
      //初始楼层按钮显示个数配置。默认显示5层,其他的隐藏，可滚动查看
      showBtnCount: 6,
      //初始是否是多层显示，默认单层显示
      allLayer: false,
      //位置x,y的偏移量
      offset: {
        x: -20,
        y: 20,
      },
    });
    //不带单/双层楼层控制按钮,初始时只有1个按钮,点击后可弹出其他楼层按钮
    this.btnFloorControl = new fengMap.buttonGroupsControl(this.map, btnFloorCtlOpt);
    //楼层切换
    this.btnFloorControl.onChange(function (groups, allLayer) {
      //groups 表示当前要切换的楼层ID数组,
      //allLayer表示当前楼层是单层状态还是多层状态。
      // console.log('当前切换楼层：' + groups);
    });
    //切换楼层,changeFocusGroup(目标层groupID,是否多层状态)
    //btnFloorControl.changeFocusGroup(2, true);
    //默认是否展开楼层列表，true为展开，false为不展开
    this.btnFloorControl.expand = true;
    //楼层控件是否可点击，默认为true
    this.btnFloorControl.enableExpand = true;
    this.btnFloorControl.changeFocusGroup(groupId);
  }

  //在点击的位置添加图片标注
  addImgMarker ({ groupId, coord }) {
    const group = this.map.getFMGroup(groupId);
    //返回当前层中第一个imageMarkerLayer,如果没有，则自动创建
    const layer = group.getOrCreateLayer('imageMarker');
    var im = new fengMap.FMImageMarker({
      x: coord.x,
      y: coord.y,
      url: 'https://webapi.amap.com/images/dd-via.png',
      height: 3, //defaultPolygonMarkerHeight,
      size: 10,
      callback: function () {
        im.alwaysShow();
      },
    });
    layer.addMarker(im);
  }

  //创建自定义形状标注
  drawPolygon = ({ coords, groupId, id }) => {
    //添加多边形-圆形图层
    const groupLayer = this.map.getFMGroup(groupId);
    //返回当前层中第一个polygonMarker,如果没有，则自动创建
    const layer = groupLayer.getOrCreateLayer('polygonMarker');
    //实例化polygonMarker
    let polygonMarker = new fengMap.FMPolygonMarker({
      //设置透明度
      alpha: .5,
      //设置边框线的宽度
      lineWidth: 1,
      //设置高度
      height: 6,
      //多边形的坐标点集数组
      points: coords,
      // color: 'green',
    });
    polygonMarker.areaId = id;
    this.polygonMarkers = [...this.polygonMarkers, polygonMarker];
    layer.addMarker(polygonMarker);
  }

  // 重置地图定位标注的点
  handleResetMapLocation = () => {
    const {
      id,
      form: { setFieldsValue, getFieldValue },
    } = this.props;
    const value = getFieldValue(id) || {};
    const groupId = value.groupId;
    if (!groupId) return;
    const group = this.map.getFMGroup(groupId);
    const layer = group.getOrCreateLayer('imageMarker');
    layer.removeAll();
    let temp = {};
    temp[id] = { coord: null, groupId: null, areaId: null };
    setFieldsValue(temp);
  }

  render () {
    const {
      form: { getFieldDecorator },
      id,
    } = this.props;
    return getFieldDecorator(id)(
      <div style={{ display: 'flex' }}>
        <div className={styles.mapLocation} id="fengMap"></div>
        <Button type="primary" onClick={this.handleResetMapLocation}>重置</Button>
      </div>
    )
  }
}
