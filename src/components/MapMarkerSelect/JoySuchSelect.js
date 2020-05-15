import React, { PureComponent } from 'react';
import { Button } from 'antd';
import { connect } from 'dva';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import styles from './JoySuchSelect.less';

import defaultMarkrtIcon from '@/assets/icon-marker.png';

// 风险等级对应颜色
const levelColor = {
  '1': 'rgba(255, 72, 72, 0.5)', // 红
  '2': 'rgba(241, 122, 10, 0.5)', // 橙
  '3': 'rgba(251, 247, 25, 0.5)', // 黄
  '4': 'rgba(30, 96, 255, 0.5)', // 蓝
};

export const isPointInPolygon = (point, polygon) => {
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

  componentWillUnmount() {
    this.map = null;
    document.getElementById('joySuchMap').innerHTML = '';
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
    // this.removeOtherMarker();
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
              coords: coordinateList,
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

    // 监听点击
    this.map.on('mapClickNode', event => {
      const { onChange, readonly, markerOption = {} } = this.props;
      const clickedObj = event;
      // console.log('clickedObj', clickedObj);
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
        coord: { ...coord, z: 0 },
        ...markerOption,
      });
      // this.renderOtherMarkers();
      onChange &&
        onChange({
          groupId: fId || floorId,
          coord: { ...coord, z: 0 },
          // areaId: this.generateArea(coord),
          areaId,
        });
    });

    //地图加载完回调事件
    this.map.on('loadComplete', event => {
      if (!this.map) return;
      const { value: { groupId, coord } = {}, markerOption = {}, markerList } = this.props;
      //加载按钮型楼层切换控件
      this.loadBtnFloorCtrl(isInit ? groupId : 1);
      // 如果初始化且传入点信息则画点
      if (isInit && groupId && coord)
        this.selectedMarker = this.addImgMarker({ groupId, coord, ...markerOption });
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
      position: new jsmap.JSPoint(coord.x, coord.y, 0), //坐标位置
      width: size, //尺寸-宽
      height: size, //尺寸-高
      floorId: groupId, //楼层 id
      offset: jsmap.JSControlPosition.RIGHT_BOTTOM, //偏移位置
      depthTest: false, //是否开启深度检测
      properties: props, //属性设置
      // callback: node => {
      //   console.log('node', node);
      // }, //回调
    });
    this.map.addMarker(imageMarker);
    return imageMarker;
  };

  // 删除所选点
  removeSelectedMarker = () => {
    if (!this.map || !this.selectedMarker) return;
    this.map.removeMarker(this.selectedMarker);
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
