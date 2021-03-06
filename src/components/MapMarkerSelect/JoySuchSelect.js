import React, { PureComponent } from 'react';
import { Button } from 'antd';
import { connect } from 'dva';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { isPointInPolygon } from '@/utils/map';
import styles from './JoySuchSelect.less';

import defaultMarkrtIcon from '@/assets/icon-marker.png';

// 风险等级对应颜色
const levelColor = {
  '1': 'rgba(255, 72, 72, 0.5)', // 红
  '2': 'rgba(241, 122, 10, 0.5)', // 橙
  '3': 'rgba(251, 247, 25, 0.5)', // 黄
  '4': 'rgba(30, 96, 255, 0.5)', // 蓝
};
let tool = null;
let isLoadComplete = false;

@connect(({ map }) => ({
  map,
}))
export default class JoySuchSelect extends PureComponent {
  state = {
    show: true, // 是否显示地图
    otherMarkersVisible: true,
  };

  static propTypes = {
    // companyId: PropTypes.string.isRequired,
    readonly: PropTypes.bool,
  };

  static defaultProps = {
    noDataContent: '该单位暂无地图',
    readonly: false,
  };

  constructor(props) {
    super(props);
    this.map = null;
    this.selectedMarker = null;
    this.btnFloorControl = null; // 楼层控件实例
    this.polygonMarkers = []; // 保存区域实例
    this.otherMarkers = []; // 保存区域实例
  }

  componentDidMount() {
    this.mapDispose();
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
        // this.map && this.map.dispose();
        this.initData();
        this.handleUpdateMap();
      });
    }
    if (JSON.stringify(prevMarkerList) !== JSON.stringify(markerList)) {
      this.renderOtherMarkers();
    }
  }

  mapDispose = () => {
    this.map = null;
    document.getElementById('joySuchMap').innerHTML = '';
  }

  componentWillUnmount() {
    this.mapDispose();
  }

  initData = () => {
    const { onChange } = this.props;
    this.mapDispose();
    this.btnFloorControl = null; // 楼层控件实例
    this.polygonMarkers = []; // 保存区域实例
    this.otherMarkers = []; // 保存区域实例
    onChange && onChange({ coord: null, groupId: null, areaId: null });
  };

  // 渲染其他图标
  renderOtherMarkers = (markerProps = {}) => {
    const { markerList, otherMarkersOption = {}, markerId } = this.props;
    const { otherMarkersVisible } = this.state;
    console.log('markerList',markerList);
    if (!this.map || !markerList || markerList.length === 0 || !isLoadComplete) return;
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
        coord: tool.MercatorToWGS84(new jsmap.JSPoint(+xnum, +ynum, 0)) /* eslint-disable-line */,
        markerId: item.id,
        show: otherMarkersVisible,
        ...otherMarkersOption,
        ...markerProps,
      });
      // if (imgMarker) imgMarker.show = otherMarkersVisible;
      this.otherMarkers.push(imgMarker);
      return null;
    });
  };

  /**
   * 更新地图
   * @param {boolean} isInit 是否初始化
   **/
  handleUpdateMap = (isInit = false) => {
    const { dispatch, companyId, mapInfo } = this.props;
    if (!companyId) return;
    // 获取地图列表
    // dispatch({
    //   type: 'map/fetchMapList',
    //   payload: { companyId },
    //   callback: mapInfo => {
    this.initMap({ ...mapInfo, isInit }, () => {
      // 获取区域列表
      dispatch({
        type: 'map/fetchMapAreaList',
        payload: { companyId, pageNum: 1, pageSize: 0 },
        callback: ({ list }) => {
          list.forEach(({ coordinateList, groupId, id, zoneLevel }) => {
            this.drawPolygon({
              groupId,
              coords: tool.MercatorToWGS84(coordinateList),
              id,
              color: levelColor[zoneLevel],
            });
          });
        },
      });
    });
    //   },
    // });
  };

  /* eslint-disable */
  // 初始化地图定位
  initMap = ({ appName, key, mapId, isInit }, fun) => {
    if (!appName || !key || !mapId) {
      this.setState({ show: false });
      return;
    }
    const mapOptions = {
      mapType: jsmap.JSMapType.MAP_PSEUDO_3D,
      container: 'joySuchMap',
      token:
        'pk.eyJ1IjoiZ2lzZXJxaWFuIiwiYSI6ImNrNzJzMG1nZjAzMDczZmwxaXh6NnE3dnoifQ.7qR_dD6h8qloqCr9_OpxLQ',
      mapServerURL: './data/map',
    };

    //初始化地图对象
    this.map = new jsmap.JSMap(mapOptions);
    //打开Fengmap服务器的地图数据和主题
    this.map.openMapById(mapId);
    tool = new jsmap.JSMapCoordTool(this.map);
    // 监听点击
    this.map.on('mapClickNode', event => {
      const { onChange, readonly, markerOption = {} } = this.props;
      const clickedObj = event;
      console.log('clickedObj', clickedObj);
      if (!clickedObj || !clickedObj.nodeType || readonly) return;
      const {
        eventInfo: { coord },
        floorId,
        nodeType,
        properties,
        id,
      } = clickedObj;
      let fId, areaId;
      if (nodeType === jsmap.JSNodeType.POLYGON_MARKER) {
        fId = +properties.get('groupId');
        areaId = id;
      }
      // 清除之前的坐标
      // this.handleResetMapLocation();
      this.removeSelectedMarker();
      this.selectedMarker = this.addImgMarker({
        groupId: fId || floorId,
        coord,
        ...markerOption,
      });
      // this.renderOtherMarkers();
      const point = tool.WGS84ToMercator(coord);
      console.log('areaId', areaId);

      onChange &&
        onChange({
          groupId: fId || floorId,
          coord: { x: point.x, y: point.y, z: 0 },
          // areaId: this.generateArea(coord),
          areaId,
        });
    });

    //地图加载完回调事件
    this.map.on('loadComplete', event => {
      if (!this.map) return;
      isLoadComplete = true;
      const { value: { groupId, coord } = {}, markerOption = {}, markerList } = this.props;
      //加载按钮型楼层切换控件
      this.loadBtnFloorCtrl(isInit ? groupId : 1);
      // 如果初始化且传入点信息则画点
      if (isInit && groupId && coord)
        this.selectedMarker = this.addImgMarker({
          groupId,
          coord: tool.MercatorToWGS84(coord),
          ...markerOption,
        });
      if (markerList && markerList.length > 0) this.renderOtherMarkers();
      // 标注区域
      fun && fun();
    });
  };

  generateArea = coord => {
    if (!this.polygonMarkers || this.polygonMarkers.length === 0) return undefined;
    const {
      map: {
        mapArea: { list },
      },
    } = this.props;
    const target =
      list.find(item =>
        isPointInPolygon(
          coord,
          item.coordinateList.map(cood => {
            const { x, y, z } = cood;
            return { x: +x, y: +y, z: +z };
          })
        )
      ) || {};
    return target.id;
  };

  //加载按钮型楼层切换控件
  loadBtnFloorCtrl = (groupId = 1) => {
    if (!this.map) return;
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
    this.map.addControl(floorControl);
  };

  //在点击的位置添加图片标注
  addImgMarker = props => {
    const { groupId, coord, url, size, ...restProps } = props;
    const imageMarker = new jsmap.JSImageMarker({
      // id: 'selectedMarker', //id
      image: url || defaultMarkrtIcon, //图片路径
      // position: new jsmap.JSPoint(coord.x, coord.y, 0), //坐标位置
      position: coord,
      width: size, //尺寸-宽
      height: size, //尺寸-高
      floorId: +groupId, //楼层 id
      offset: jsmap.JSControlPosition.RIGHT_BOTTOM, //偏移位置
      depthTest: false, //是否开启深度检测
      properties: props, //属性设置
      callback: node => {
        console.log('node', node);
      }, //回调
    });
    this.map.addMarker(imageMarker);
    return imageMarker;
  };

  // 删除所选点
  removeSelectedMarker = () => {
    if (!this.map || !this.selectedMarker) return;
    // ?????   我也不晓得为什么 执行一次remove不掉也是鸡儿6666
    this.map.removeMarker(this.selectedMarker);
    // setTimeout(() => {
    //   this.map.removeMarker(this.selectedMarker);
    // }, 0);
  };

  // 删除其他点
  removeOtherMarker = () => {
    if (!this.map) return;
    this.otherMarkers.map(item => {
      this.map.removeMarker(item);
      return null;
    });
  };

  //创建自定义形状标注
  drawPolygon = props => {
    const { coords, groupId, id, color } = props;
    const polygonMarker = new jsmap.JSPolygonMarker({
      id,
      position: coords.map(item => ({ x: +item.x, y: +item.y, z: 0 })),
      floorId: +groupId,
      color,
      strokeColor: color,
      properties: { ...props },
      strokeWidth: 2, //边线宽度
      depthTest: false, //是否开启深度检测
      // callback: marker => {
      //   console.log('Polygon', marker);
      // },
    });
    this.polygonMarkers = [...this.polygonMarkers, polygonMarker];
    this.map.addMarker(polygonMarker);
  };

  handleClickReset = () => {
    const { onChange } = this.props;
    this.removeSelectedMarker();
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

    const list = markerList.filter(item => {
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
      <div style={{ display: 'flex', position: 'relative' }}>
        <div className={styles.mapLocation} id="joySuchMap" />
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
