import React, { PureComponent } from 'react';
import { Button } from 'antd';
import { connect } from 'dva';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import styles from './index.less';

import defaultMarkrtIcon from '@/assets/icon-marker.png';
import { tuple } from 'antd/lib/_util/type';

const fengMap = fengmap; // eslint-disable-line
// 风险等级对应颜色
const levelColor = {
  '1': '#FF0000', // 红
  '2': '#FF6600', // 橙
  '3': '#FFFF00', // 黄
  '4': '#0099FF', // 蓝
};

@connect(({ map }) => ({
  map,
}))
export default class MapMarkerSelect extends PureComponent {
  state = {
    show: true, // 是否显示地图
    otherMarkersVisible: true,
  };

  static propTypes = {
    companyId: PropTypes.string.isRequired,
    readonly: PropTypes.bool,
  };

  static defaultProps = {
    noDataContent: '该单位暂无地图',
    readonly: false,
  };

  constructor(props) {
    super(props);
    this.map = null;
    this.btnFloorControl = null; // 楼层控件实例
    this.polygonMarkers = []; // 保存区域实例
    this.otherMarkers = []; // 保存区域实例
  }

  componentDidMount() {
    this.handleUpdateMap(true);
  }

  getSnapshotBeforeUpdate(prevPros, prevState) {
    return prevPros.companyId !== this.props.companyId;
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { markerList: prevMarkerList } = prevProps;
    const { markerList } = this.props;
    if (snapshot) {
      this.setState({ show: true }, () => {
        this.map && this.map.dispose();
        this.initData();
        this.handleUpdateMap();
      });
    }
    if (JSON.stringify(prevMarkerList) !== JSON.stringify(markerList)) {
      this.renderOtherMarkers();
    }
  }

  initData = () => {
    const { onChange } = this.props;
    this.map = null;
    this.btnFloorControl = null; // 楼层控件实例
    this.polygonMarkers = []; // 保存区域实例
    this.otherMarkers = []; // 保存区域实例
    onChange && onChange({ coord: null, groupId: null, areaId: null });
  };

  // 渲染其他图标
  renderOtherMarkers = (markerProps = {}) => {
    const { markerList, otherMarkersOption = {}, markerId } = this.props;
    const { otherMarkersVisible } = this.state;
    if (!this.map || !markerList || markerList.length === 0) return;
    this.removeOtherMarker();
    this.otherMarkers = [];
    markerList.map(item => {
      if (
        !item.pointFixInfoList ||
        item.pointFixInfoList.length === 0 ||
        !+item.pointFixInfoList[0].isShow ||
        markerId === item.id
      )
        return null;
      const { groupId, xnum, ynum } = item.pointFixInfoList[0];
      const imgMarker = this.addImgMarker({
        groupId,
        coord: { x: +xnum, y: +ynum },
        markerId: item.id,
        ...otherMarkersOption,
        ...markerProps,
      });
      if (imgMarker) imgMarker.show = otherMarkersVisible;
      this.otherMarkers.push(imgMarker);
      return null;
    });
  };

  /**
   * 更新地图
   * @param {boolean} isInit 是否初始化
   **/
  handleUpdateMap = (isInit = false) => {
    const { dispatch, companyId } = this.props;
    // 获取地图列表
    dispatch({
      type: 'map/fetchMapList',
      payload: { companyId },
      callback: mapInfo => {
        this.initMap({ ...mapInfo, isInit }, () => {
          // 获取区域列表
          dispatch({
            type: 'map/fetchMapAreaList',
            payload: { companyId, pageNum: 1, pageSize: 0 },
            callback: ({ list }) => {
              list.forEach(({ coordinateList, groupId, id, zoneLevel }) => {
                this.drawPolygon({
                  groupId,
                  coords: coordinateList,
                  id,
                  color: levelColor[zoneLevel],
                });
              });
            },
          });
        });
      },
    });
  };

  // 初始化地图定位
  initMap = ({ appName, key, mapId, isInit }, fun) => {
    if (!appName || !key || !mapId) {
      this.setState({ show: false });
      return;
    }
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
      const { onChange, readonly, markerOption = {} } = this.props;
      const clickedObj = event.target;
      // console.log('clickedObj', clickedObj);
      if (!clickedObj || !clickedObj.eventInfo || readonly) return;
      const { coord } = clickedObj.eventInfo;
      const groupId = clickedObj.groupID;
      // 清除之前的坐标
      // this.handleResetMapLocation();
      this.removeSelectedMarker();
      this.addImgMarker({ groupId, coord, ...markerOption });
      this.renderOtherMarkers();
      onChange && onChange({ groupId, coord, areaId: this.generateArea(coord) });
    });

    //地图加载完回调事件
    this.map.on('loadComplete', event => {
      const { value: { groupId, coord } = {}, markerOption = {}, markerList } = this.props;
      //加载按钮型楼层切换控件
      this.loadBtnFloorCtrl(isInit ? groupId : 1);
      // 如果初始化且传入点信息则画点
      // isInit && groupId && coord && this.addImgMarker({ groupId, coord });
      isInit && groupId && coord && this.addImgMarker({ groupId, coord, ...markerOption });
      if (markerList && markerList.length > 0) this.renderOtherMarkers();
      // 标注区域
      fun && fun();
      // 清空之前的数据
      // !isInit && this.handleResetMapLocation();
    });
  };

  generateArea = coord => {
    if (!this.polygonMarkers || this.polygonMarkers.length === 0) return undefined;
    const target = this.polygonMarkers.find(item => item.contain(coord)) || {};
    return target.areaId;
  };

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
    this.btnFloorControl.onChange(function(groups, allLayer) {
      //groups 表示当前要切换的楼层ID数组,
      //allLayer表示当前楼层是单层状态还是多层状态。
    });
    //默认是否展开楼层列表，true为展开，false为不展开
    this.btnFloorControl.expand = true;
    //楼层控件是否可点击，默认为true
    this.btnFloorControl.enableExpand = true;
    // 切换到指定楼层(可传入两个参数：目标层groupID,是否多层状态)
    this.btnFloorControl.changeFocusGroup(groupId);
  };

  //在点击的位置添加图片标注
  addImgMarker({ groupId, coord, ...restProps }) {
    const group = this.map.getFMGroup(groupId);
    if (!group) return null;
    //返回当前层中第一个imageMarkerLayer,如果没有，则自动创建
    const layer = group.getOrCreateLayer('imageMarker');
    const im = new fengMap.FMImageMarker({
      x: coord.x,
      y: coord.y,
      // url: 'https://webapi.amap.com/images/dd-via.png',
      url: defaultMarkrtIcon,
      height: 6, //defaultPolygonMarkerHeight,
      size: 20,
      callback: function() {
        im.alwaysShow();
      },
      ...restProps,
    });
    layer.addMarker(im);
    return im;
  }

  // 删除所选点
  removeSelectedMarker = () => {
    const { markerOption: { url } = {} } = this.props;
    if (!this.map) return;
    let isRemoved = false;
    this.map.groupIDs.map(gId => {
      const group = this.map.getFMGroup(gId);
      //遍历图层
      group.traverse(fm => {
        if (fm instanceof fengMap.FMImageMarkerLayer) {
          fm.markers.forEach(marker => {
            const {
              opts_: { url: markerUrl },
            } = marker;
            if (markerUrl === url || markerUrl === defaultMarkrtIcon) {
              fm.removeMarker(marker);
              isRemoved = true;
            }
          });
        }
      });
    });
    return isRemoved;
  };

  // 删除其他点
  removeOtherMarker = () => {
    const { otherMarkersOption: { url } = {} } = this.props;
    if (!this.map) return;
    let isRemoved = false;
    this.map.groupIDs.map(gId => {
      const group = this.map.getFMGroup(gId);
      //遍历图层
      if (!group) return null;
      group.traverse(fm => {
        if (fm instanceof fengMap.FMImageMarkerLayer) {
          fm.markers.forEach(marker => {
            const {
              opts_: { url: markerUrl },
            } = marker;
            if (markerUrl === url) {
              fm.removeMarker(marker);
              isRemoved = true;
            }
          });
        }
      });
      return null;
    });
    return isRemoved;
  };

  //创建自定义形状标注
  drawPolygon = ({ coords, groupId, id, color }) => {
    //添加多边形-圆形图层
    const groupLayer = this.map.getFMGroup(groupId);
    //返回当前层中第一个polygonMarker,如果没有，则自动创建
    const layer = groupLayer.getOrCreateLayer('polygonMarker');
    //实例化polygonMarker
    let polygonMarker = new fengMap.FMPolygonMarker({
      //设置透明度
      alpha: 0.5,
      //设置边框线的宽度
      lineWidth: 1,
      //设置高度
      height: 6,
      //多边形的坐标点集数组
      points: coords,
      color,
    });
    polygonMarker.areaId = id;
    this.polygonMarkers = [...this.polygonMarkers, polygonMarker];
    layer.addMarker(polygonMarker);
  };

  handleClickReset = () => {
    const { onChange } = this.props;
    this.removeSelectedMarker();
    onChange && onChange({ coord: null, groupId: null, areaId: null });
  };

  // 重置地图定位标注的点
  handleResetMapLocation = () => {
    const { value = {}, onChange } = this.props;
    const groupId = value.groupId;
    if (!groupId) return;
    // 清除地图marker
    const group = this.map.getFMGroup(groupId);
    const layer = group.getOrCreateLayer('imageMarker');
    layer.removeAll();
    onChange && onChange({ coord: null, groupId: null, areaId: null });
  };

  // 显示隐藏已标注点位
  handleClickControl = () => {
    const { otherMarkersVisible } = this.state;
    this.setState({ otherMarkersVisible: !otherMarkersVisible });
    this.otherMarkers.map(item => {
      item.show = !otherMarkersVisible;
      return null;
    });
  };

  render() {
    const {
      noDataContent,
      readonly,
      legend: { label = '其他标注', icon, activeIcon } = {},
      legend,
      markerList = [],
      markerId,
    } = this.props;
    const { show, otherMarkersVisible } = this.state;
    const itemStyles = classnames(styles.controlItem, {
      [styles.active]: otherMarkersVisible,
    });

    const list =
      markerList !== undefined &&
      markerList.filter(item => {
        if (
          !item.pointFixInfoList ||
          item.pointFixInfoList.length === 0 ||
          !+item.pointFixInfoList[0].isShow ||
          markerId === item.id
        )
          return false;
        else return true;
      });

    return show ? (
      <div style={{ display: 'flex' }}>
        <div className={styles.mapLocation} id="fengMap">
          {legend &&
            list.length > 0 && (
              <div className={styles.controlContainer}>
                <div className={itemStyles} onClick={() => this.handleClickControl()}>
                  <span
                    className={styles.icon}
                    style={{
                      background: `url(${
                        otherMarkersVisible ? activeIcon : icon
                      }) center center / auto 100% no-repeat`,
                    }}
                  />
                  {label}
                </div>
              </div>
            )}
        </div>
        {!readonly && (
          <Button type="primary" onClick={this.handleClickReset}>
            重置
          </Button>
        )}
      </div>
    ) : (
      <span>{noDataContent}</span>
    );
  }
}
