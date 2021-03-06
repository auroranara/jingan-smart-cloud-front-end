import React, { PureComponent } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Modal, Input } from 'antd';
import {
  Map,
  FeatureGroup,
  ImageOverlay,
  Polygon,
  Circle,
  Rectangle,
  Marker,
  CircleMarker,
  ZoomControl,
} from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import L from 'leaflet';

import styles from './index.less';

// 边线宽度
const DEFAULT_WEIGHT = 1;
// 颜色
const DEFAULT_COLOR = '#000';
// 默认字体大小
const defaultFontSize = 14;
// 默认字体颜色
const defaultFontColor = '#fff';

(function init() {
  L.drawLocal = {
    draw: {
      toolbar: {
        actions: {
          title: '',
          text: '取消',
        },
        finish: {
          title: '',
          text: '完成',
        },
        undo: {
          title: '',
          text: '撤销',
        },
        buttons: {
          polyline: '折线',
          polygon: '多边形',
          rectangle: '矩形',
          circle: '圆形',
          marker: '标记',
          circlemarker: '圆形标记',
        },
      },
      handlers: {
        circle: {
          tooltip: {
            start: '单击并拖动绘制圆形',
          },
          radius: '半径',
        },
        circlemarker: {
          tooltip: {
            start: '单击绘制圆形标记',
          },
        },
        marker: {
          tooltip: {
            start: '单击绘制标记',
          },
        },
        polygon: {
          tooltip: {
            start: '单击开始绘制多边形',
            cont: '单击继续绘制多边形',
            end: '单击第一个节点结束绘制多边形',
          },
        },
        polyline: {
          error: '<strong>错误:</strong>绘制图形不能有交叉!',
          tooltip: {
            start: '单击开始绘制折线',
            cont: '单击继续绘制折线',
            end: '单击最后一个点结束绘制折线',
          },
        },
        rectangle: {
          tooltip: {
            start: '单击并拖动绘制矩形',
          },
        },
        simpleshape: {
          tooltip: {
            end: '松开鼠标完成绘制',
          },
        },
      },
    },
    edit: {
      toolbar: {
        actions: {
          save: {
            title: '',
            text: '保存',
          },
          cancel: {
            title: '',
            text: '取消',
          },
          clearAll: {
            title: '',
            text: '清空',
          },
        },
        buttons: {
          edit: '',
          editDisabled: '',
          remove: '',
          removeDisabled: '',
        },
      },
      handlers: {
        edit: {
          tooltip: {
            text: '拖动修改图形',
            subtext: '',
            // subtext: '单击"取消"撤消修改'
          },
        },
        remove: {
          tooltip: {
            text: '单击要删除的图形',
          },
        },
      },
    },
  };

  /* eslint-disable */
  const originalUpdatePathRectangle = L.Rectangle.prototype._updatePath;
  L.Rectangle.include({
    _updatePath: function() {
      if (this._path.parentNode && this.options.data && this.options.data.name) {
        const center = this._map.latLngToLayerPoint(this.getCenter());
        if (this._textNode && this._textNode.parentNode) {
          this._path.parentNode.removeChild(this._textNode);
        }
        // const zoom = this._map.getZoom();
        const textNode = L.SVG.create('text');
        textNode.setAttribute('text-anchor', 'middle');
        textNode.setAttribute('style', 'font-weight:bold');
        textNode.setAttribute('fill', defaultFontColor);
        textNode.setAttribute('x', center.x);
        textNode.setAttribute('y', center.y);
        textNode.setAttribute('font-size', defaultFontSize);
        textNode.appendChild(document.createTextNode(this.options.data.name));
        this._path.parentNode.appendChild(textNode);
        this._textNode = textNode;
      }
      return originalUpdatePathRectangle.call(this);
    },
  });
  const originalUpdatePathPolygon = L.Polygon.prototype._updatePath;
  L.Polygon.include({
    _updatePath: function() {
      if (this._path.parentNode && this.options.data && this.options.data.name) {
        const center = this._map.latLngToLayerPoint(this.getCenter());
        if (this._textNode && this._textNode.parentNode) {
          this._path.parentNode.removeChild(this._textNode);
        }
        // const zoom = this._map.getZoom();
        const textNode = L.SVG.create('text');
        textNode.setAttribute('text-anchor', 'middle');
        textNode.setAttribute('style', 'font-weight:bold');
        textNode.setAttribute('fill', defaultFontColor);
        textNode.setAttribute('x', center.x);
        textNode.setAttribute('y', center.y);
        textNode.setAttribute('font-size', defaultFontSize);
        textNode.appendChild(document.createTextNode(this.options.data.name));
        this._path.parentNode.appendChild(textNode);
        this._textNode = textNode;
      }
      return originalUpdatePathPolygon.call(this);
    },
  });
  const originalUpdatePathCircle = L.Circle.prototype._updatePath;
  L.Circle.include({
    _updatePath: function() {
      if (this._path.parentNode && this.options.data && this.options.data.name) {
        const center = this._point;
        if (this._textNode && this._textNode.parentNode) {
          this._path.parentNode.removeChild(this._textNode);
        }
        // const zoom = this._map.getZoom();
        const textNode = L.SVG.create('text');
        textNode.setAttribute('text-anchor', 'middle');
        textNode.setAttribute('style', 'font-weight:bold');
        textNode.setAttribute('fill', defaultFontColor);
        textNode.setAttribute('x', center.x);
        textNode.setAttribute('y', center.y);
        textNode.setAttribute('font-size', defaultFontSize);
        textNode.appendChild(document.createTextNode(this.options.data.name));
        this._path.parentNode.appendChild(textNode);
        this._textNode = textNode;
      }
      return originalUpdatePathCircle.call(this);
    },
  });
  /* eslint-enable */
})();

/**
 * description: 图片绘制
 * author: sunkai
 * date: 2019年01月16日
 */
@Form.create()
class ImageDraw extends PureComponent {
  state = {
    // 地图中心点
    center: undefined,
    // 地图边界，用于坐标参考
    bounds: undefined,
    // 命名弹出框是否显示
    visible: false,
    // 最大边界，用于实际可见范围
    maxBounds: undefined,
    // 缩放等级，0为正常大小，1为乘以2，-1为除以2
    zoom: 0,
    // list: [
    //   { name: '很长很长的阳台名称', type: 'circle', latlng: { lat: 237, lng: 378 }, radius: 200 },
    //   { name: '矩形', type: 'rectangle', latlngs: [{lat: 349, lng: 78}, {lat: 428, lng: 78},{lat: 428, lng: 140},{lat: 349, lng: 140}]},
    //   { name: '多边形', type: 'polygon', latlngs: [{lat: 0, lng: 0}, {lat: 100, lng: 100},{lat: 0, lng: 100}]},
    // ],
  };

  // 暂时存放的图形对象
  layer = null;

  // 暂时存放的图形类型
  layerType = null;

  // 是否处于编辑状态
  editing = false;

  // 是否处于删除状态
  deleting = false;

  // 是否处于绘制状态
  drawing = false;

  componentDidMount() {
    const { url } = this.props;
    if (url) {
      this.dynamicInitMap(url);
    }
  }

  componentDidUpdate({ url: prevUrl, reference: prevReference }) {
    const { url, reference } = this.props;
    if (url !== prevUrl) {
      if (url) {
        this.dynamicInitMap(url);
      } else {
        // 当url不存在时，通过清除bounds来清除所有元素
        this.setState({ bounds: undefined });
      }
    } else if (reference !== prevReference) {
      this.initReference();
    }
  }

  // 图形容器
  refFeatureGroup = drawnItems => {
    this.drawnItems = drawnItems;
  };

  // 地图实例
  refMap = map => {
    this.map = map;
  };

  /**
   * 获取合适的zoom
   * @param {number} width reference图片的宽度
   * @param {number} height reference图片的高度
   */
  getFitZoom = (width, height) => {
    const { autoZoom } = this.props;
    let zoom = 0;
    if (autoZoom) {
      const { clientWidth, clientHeight } = this.map.container;
      zoom = Math.floor(Math.log2(Math.min(clientWidth / width, clientHeight / height)));
    }
    return zoom;
  };

  /**
   * 动态初始化地图
   * @param {string} url 背景图片地址
   */
  dynamicInitMap = url => {
    const { filled } = this.props;
    const { clientWidth, clientHeight } = this.map.container;
    // console.log(clientWidth, clientHeight);

    // 如果使用填充效果
    if (filled) {
      // 按照容器的比例
      this.initMap(clientWidth, clientHeight);
    } else {
      // 按照图片本身的比例
      const image = new Image();
      image.src = url;
      image.onload = e => {
        const { width, height } = e.target;
        // console.log(width, height);

        // 计算适应容器的最大缩放比例
        const widthRatio = clientWidth / width;
        const heightRatio = clientHeight / height;
        const ratio = Math.min(clientWidth / width, clientHeight / height);
        // console.log('ratio', ratio);

        this.initMap(
          widthRatio > heightRatio ? width * heightRatio : clientWidth,
          widthRatio > heightRatio ? clientHeight : height * widthRatio
        );
      };
    }
  };

  /**
   * 初始化地图
   * @param {number} width 坐标参考图片的宽度
   * @param {number} height 坐标参考图片的高度
   */
  initMap = (width, height) => {
    // console.log('zoom', width, height);

    const { maxBounds, center, zoom } = this.getReferenceParams(width, height);
    this.setState(
      {
        bounds: L.latLngBounds([0, 0], [height, width]),
        maxBounds,
      },
      () => {
        this.setState({
          center,
          zoom,
        });
      }
    );
  };

  /**
   * 初始化引用
   */
  initReference = () => {
    const { bounds } = this.state;
    if (bounds) {
      const {
        _northEast: { lat: height, lng: width },
      } = bounds;
      const { maxBounds, center, zoom } = this.getReferenceParams(width, height);
      this.setState(
        {
          maxBounds,
        },
        () => {
          this.setState({
            center,
            zoom,
          });
        }
      );
    }
  };

  /**
   * 获取引用相关参数，包括maxBounds，zoom，center
   * @param {number} width 坐标参考图片的宽度
   * @param {number} height 坐标参考图片的高度
   */
  getReferenceParams = (width, height) => {
    const { maxBoundsRatio = 1, reference } = this.props;
    let center;
    let maxBounds;
    let zoom;
    // 如果reference存在，则使用reference数据计算最大边界及设置缩放等级以适应容器
    if (reference) {
      const { latlngs, radius, latLng } = reference;
      if (radius) {
        center = latLng;
        maxBounds = L.circle(
          { lat: latLng.lat * height, lng: latLng.lng * width },
          radius * width
        ).getBounds();
      } else {
        maxBounds = L.latLngBounds(
          latlngs.map(({ lat, lng }) => ({ lat: lat * height, lng: lng * width }))
        );
        center = maxBounds.getCenter();
        center = { lat: center.lat / height, lng: center.lng / width };
      }
      const {
        _southWest: { lat: lat1, lng: lng1 },
        _northEast: { lat: lat2, lng: lng2 },
      } = maxBounds;
      const boundWidth = lng2 - lng1;
      const boundHeight = lat2 - lat1;

      zoom = this.getFitZoom(boundWidth, boundHeight);
      if (maxBoundsRatio !== 1) {
        maxBounds = L.latLngBounds(
          [lat1 - boundHeight * (maxBoundsRatio - 1), lng1 - boundWidth * (maxBoundsRatio - 1)],
          [lat2 + boundHeight * (maxBoundsRatio - 1), lng2 + boundWidth * (maxBoundsRatio - 1)]
        );
      }
    }
    // 否则使用url图片计算最大边界及设置缩放等级以适应容器
    else {
      center = { lat: 0.5, lng: 0.5 };
      maxBounds = L.latLngBounds(
        [-height * (maxBoundsRatio - 1), -width * (maxBoundsRatio - 1)],
        [height * maxBoundsRatio, width * maxBoundsRatio]
      );
      zoom = this.getFitZoom(width, height);
    }
    return {
      center: L.latLng(height * center.lat, width * center.lng),
      maxBounds,
      zoom,
    };
  };

  /**
   * 获取图形特征
   * @param {string} type 图形类型
   * @param {object} layer 图形对象
   */
  getShapeFeature = (type, layer) => {
    const {
      bounds: {
        _northEast: { lat: height, lng: width },
      },
    } = this.state;
    const { _latlngs: latlngs, _latlng: latlng, _mRadius: radius } = layer;
    switch (type) {
      case 'polygon':
      case 'rectangle':
        return {
          latlngs: latlngs[0].map(({ lat, lng }) => ({ lat: lat / height, lng: lng / width })),
        };
      case 'marker':
        return { latlng: { lat: latlng.lat / height, lng: latlng.lng / width } };
      case 'circle':
      case 'circlemarker':
        return {
          latlng: { lat: latlng.lat / height, lng: latlng.lng / width },
          radius: radius / width,
        };
      default:
        return undefined;
    }
  };

  /**
   * 验证名称是否重复
   */
  validateName = (rule, value, callback) => {
    const { data = [] } = this.props;
    const isExist = data.filter(({ name }) => name === value).length > 0;
    if (isExist) {
      callback('区域名称已存在');
    } else {
      callback();
    }
  };

  /**
   * 插入新数据
   * @param {string} type 图形类型
   * @param {object} layer 图形对象
   * @param {string} name 图形名称
   */
  pushData = (layerType, layer, name = '') => {
    const { data, onUpdate, limit = Infinity } = this.props;
    const list = data || [];
    if (onUpdate && list.length < limit) {
      onUpdate(
        list.concat({
          type: layerType,
          options: layer.options,
          name,
          ...this.getShapeFeature(layerType, layer),
        })
      );
    }
    this.handleCancel();
  };

  /**
   * 点击绘制图形完成按钮
   */
  handleCreated = ({ layer, layerType }) => {
    const { namable } = this.props;
    // 保存参数
    this.layer = layer;
    this.layerType = layerType;
    if (namable) {
      // 显示设置区域名称弹出框
      this.setState({ visible: true });
    } else {
      this.pushData(layerType, layer);
    }
  };

  /**
   * 点击修改图形完成按钮
   */
  handleEdited = ({ layers: { _layers: editedObj } }) => {
    const { data, onUpdate } = this.props;
    if (data && onUpdate) {
      const editedList = Object.values(editedObj);
      if (editedList.length > 0) {
        const editedDataList = editedList.map(({ options: { data } }) => data);
        onUpdate(
          data.map(item => {
            const index = editedDataList.indexOf(item);
            if (index > -1) {
              return {
                ...item,
                ...this.getShapeFeature(item.type, editedList[index]),
              };
            }
            return item;
          })
        );
      }
    }
  };

  /**
   * 点击删除图形完成按钮或清空图形按钮
   */
  handleDeleted = ({ layers: { _layers: deletedObj } }) => {
    const { data, onUpdate } = this.props;
    if (data && onUpdate) {
      const deletedList = Object.values(deletedObj);
      if (deletedList.length > 0) {
        const deletedDataList = deletedList.map(({ options: { data } }) => data);
        onUpdate(data.filter(item => deletedDataList.indexOf(item) === -1));
      }
    }
  };

  /**
   * 点击图形
   */
  handleClickShape = e => {
    // 当图形处于正常状态时才触发点击事件
    if (!this.editing && !this.deleting && !this.drawing) {
      const { onClick } = this.props;
      onClick && onClick(e);
    }
  };

  /**
   * 弹出框确定事件
   */
  handleOk = () => {
    const {
      form: { validateFields },
    } = this.props;
    validateFields(['name'], (errors, values) => {
      if (!errors) {
        const { name } = values;
        // 将绘制的图形对象插入数据源并清除绘制的图形
        this.pushData(this.layerType, this.layer, name);
      }
    });
  };

  /**
   * 弹出框取消事件
   */
  handleCancel = () => {
    const {
      form: { setFieldsValue },
    } = this.props;
    // 清除绘制的图形
    this.drawnItems.leafletElement.removeLayer(this.layer);
    // 清除输入框内容
    setFieldsValue({ name: undefined });
    // 隐藏弹出框
    this.setState({ visible: false });
  };

  /**
   * 数据源图形渲染以后
   */
  handleAdd = ({ target: layer }) => {
    const {
      options: {
        data: { type, name, showTooltip },
      },
      _point: point,
    } = layer;
    // 绑定tooltip
    showTooltip && layer.bindTooltip(name, { sticky: true });
    // 绑定文字
    if (['polygon', 'rectangle', 'circle'].includes(type)) {
      const center = type === 'circle' ? point : layer._map.latLngToLayerPoint(layer.getCenter());
      if (layer._textNode && layer._textNode.parentNode) {
        layer._path.parentNode.removeChild(layer._textNode);
      }
      // const zoom = layer._map.getZoom();
      const textNode = L.SVG.create('text');
      textNode.setAttribute('text-anchor', 'middle');
      textNode.setAttribute('style', 'font-weight:bold');
      textNode.setAttribute('fill', defaultFontColor);
      textNode.setAttribute('x', center.x);
      textNode.setAttribute('y', center.y);
      textNode.setAttribute('font-size', defaultFontSize);
      textNode.appendChild(document.createTextNode(name));
      layer._path.parentNode.appendChild(textNode);
      layer._textNode = textNode;
    }
  };

  // /**
  //  * 删除状态下点击图形删除或点击清空按钮触发
  //  */
  // handleRemove = ({ target: layer }) => {
  //   console.log('remove');
  //   // 删除文字
  //   if (layer._textNode) {
  //     layer._textNode.parentNode.removeChild(layer._textNode);
  //   }
  // }

  /**
   * 图形容器委托监听图形删除
   */
  handleLayerRemove = ({ layer }) => {
    if (layer._textNode) {
      layer._textNode.parentNode.removeChild(layer._textNode);
    }
  };

  handleEditStart = () => {
    this.editing = true;
  };

  handleEditStop = () => {
    this.editing = false;
  };

  handleDeleteStart = () => {
    this.deleting = true;
  };

  handleDeleteStop = () => {
    this.deleting = false;
  };

  handleDrawStart = () => {
    this.drawing = true;
  };

  handleDrawStop = () => {
    this.drawing = false;
  };

  /**
   * 渲染圆形标记
   */
  renderCircleMarker = item => {
    const {
      bounds: {
        _northEast: { lat: height, lng: width },
      },
    } = this.state;
    const { id, latlng, name, options: { color = DEFAULT_COLOR } = {} } = item;
    return (
      <CircleMarker
        key={id || name}
        data={item}
        center={{ lat: latlng.lat * height, lng: latlng.lng * width }}
        color={color}
        onClick={this.handleClickShape}
      />
    );
  };

  /**
   * 渲染图标
   */
  renderDivIcon = item => {
    const {
      bounds: {
        _northEast: { lat: height, lng: width },
      },
    } = this.state;
    const { id, latlng, name, iconProps, icon } = item;
    return (
      <Marker
        key={id || name}
        data={item}
        icon={iconProps ? L.divIcon(iconProps) : icon}
        position={{ lat: latlng.lat * height, lng: latlng.lng * width }}
        onAdd={this.handleAdd}
        onClick={this.handleClickShape}
      />
    );
  };

  /**
   * 渲染图形
   */
  renderShape = item => {
    const {
      bounds: {
        _northEast: { lat: height, lng: width },
      },
    } = this.state;
    const {
      id,
      latlngs,
      latlng,
      type,
      radius,
      name,
      render,
      options: {
        color = DEFAULT_COLOR,
        weight = DEFAULT_WEIGHT,
        fill = true,
        fillOpacity = 0.2,
      } = {},
      className,
    } = item;
    let shape = null;
    switch (type) {
      case 'polygon': // 多边形
        shape = (
          <Polygon
            key={id || name}
            data={item}
            positions={latlngs.map(({ lat, lng }) => ({ lat: lat * height, lng: lng * width }))}
            onClick={this.handleClickShape}
            onAdd={this.handleAdd}
            onRemove={this.handleRemove}
            color={color}
            weight={weight}
            fill={fill}
            fillOpacity={fillOpacity}
            className={className}
          />
        );
        break;
      case 'rectangle': // 矩形
        shape = (
          <Rectangle
            key={id || name}
            data={item}
            bounds={latlngs.map(({ lat, lng }) => ({ lat: lat * height, lng: lng * width }))}
            onClick={this.handleClickShape}
            onAdd={this.handleAdd}
            onRemove={this.handleRemove}
            color={color}
            weight={weight}
            fill={fill}
            fillOpacity={fillOpacity}
            className={className}
          />
        );
        break;
      case 'circle': // 圆
        shape = (
          <Circle
            key={id || name}
            data={item}
            center={{ lat: latlng.lat * height, lng: latlng.lng * width }}
            radius={radius * width}
            onClick={this.handleClickShape}
            onAdd={this.handleAdd}
            onRemove={this.handleRemove}
            color={color}
            weight={weight}
            fill={fill}
            fillOpacity={fillOpacity}
            className={className}
          />
        );
        break;
      case 'marker': // 标记
        shape = render ? (
          render(item, {
            position: { lat: latlng.lat * height, lng: latlng.lng * width },
            onAdd: this.handleAdd,
            onClick: this.handleClickShape,
          })
        ) : (
          <Marker
            key={id || name}
            data={item}
            position={{ lat: latlng.lat * height, lng: latlng.lng * width }}
            onAdd={this.handleAdd}
            onClick={this.handleClickShape}
          />
        );
        break;
      case 'circlemarker':
        shape = (
          <CircleMarker
            key={id || name}
            data={item}
            center={{ lat: latlng.lat * height, lng: latlng.lng * width }}
            // radius={radius * width}
            onClick={this.handleClickShape}
            onAdd={this.handleAdd}
            color={color}
          />
        );
        break;
      default:
        break;
    }
    return shape;
  };

  renderImageOverlay = ({ id, url, latlngs, zIndex }) => {
    const {
      bounds: {
        _northEast: { lat: height, lng: width },
      },
    } = this.state;
    const bounds = L.latLngBounds(
      latlngs.map(({ lat, lng }) => ({ lat: lat * height, lng: lng * width }))
    );
    return (
      <ImageOverlay
        key={id}
        url={url}
        bounds={bounds}
        className={styles.imageOverlay}
        zIndex={zIndex}
      />
    );
  };

  render() {
    const {
      className,
      style,
      mapProps,
      zoomControlProps,
      zoomControl = true,
      editControlProps,
      drawable,
      url,
      hideBackground,
      data = [],
      divIcons = [],
      menu,
      circleMarkers,
      images,
      arrows,
      color = DEFAULT_COLOR,
      shapes = ['polygon', 'rectangle', 'circle'],
      form: { getFieldDecorator },
    } = this.props;
    const { center, bounds, visible, maxBounds, zoom } = this.state;

    return (
      <div className={className} style={{ height: 600, ...style }}>
        <Map
          id="mapContainer"
          className={styles.mapContainer}
          center={center}
          minZoom={-3}
          maxZoom={8}
          zoom={zoom}
          editable
          crs={L.CRS.Simple}
          attributionControl={false}
          bounds={bounds}
          maxBounds={maxBounds}
          ref={this.refMap}
          zoomControl={false}
          // dragging={false}
          {...mapProps}
        >
          {bounds &&
            zoomControl && (
              <ZoomControl
                zoomInTitle=""
                zoomOutTitle=""
                className={styles.zoomControl}
                {...zoomControlProps}
              />
            )}
          {bounds && (
            <ImageOverlay
              url={url}
              bounds={bounds}
              className={hideBackground ? styles.hiddenImageOverlay : styles.imageOverlay}
            >
              <FeatureGroup ref={this.refFeatureGroup} onLayerRemove={this.handleLayerRemove}>
                {drawable && (
                  <EditControl
                    onEdited={this.handleEdited}
                    onCreated={this.handleCreated}
                    onDeleted={this.handleDeleted}
                    onEditStart={this.handleEditStart}
                    onEditStop={this.handleEditStop}
                    onDeleteStart={this.handleDeleteStart}
                    onDeleteStop={this.handleDeleteStop}
                    onDrawStart={this.handleDrawStart}
                    onDrawStop={this.handleDrawStop}
                    draw={{
                      polyline: false,
                      polygon: shapes.includes('polygon') && {
                        allowIntersection: false,
                        showArea: false,
                        drawError: {
                          color: '#f00', // Color the shape will turn when intersects
                          message: '<strong>错误<strong>，你不能这么画!',
                        },
                        shapeOptions: {
                          weight: DEFAULT_WEIGHT,
                          color,
                        },
                      },
                      rectangle: shapes.includes('rectangle') && {
                        showArea: false,
                        shapeOptions: {
                          weight: DEFAULT_WEIGHT,
                          color,
                        },
                      },
                      circle: shapes.includes('circle') && {
                        showRadius: false,
                        shapeOptions: {
                          weight: DEFAULT_WEIGHT,
                          color,
                        },
                      },
                      marker: shapes.includes('marker'),
                      circlemarker: shapes.includes('circlemarker') && {
                        color,
                      },
                    }}
                    edit={{
                      poly: {
                        allowIntersection: false,
                      },
                      edit: true,
                      remove: true,
                    }}
                    {...editControlProps}
                  />
                )}
                {data && data.map(this.renderShape)}
                {divIcons && divIcons.map(this.renderDivIcon)}
                {circleMarkers && circleMarkers.map(this.renderCircleMarker)}
                {menu && this.renderDivIcon(menu)}
              </FeatureGroup>
            </ImageOverlay>
          )}
          {bounds && images && images.map(this.renderImageOverlay)}
          {bounds && arrows && arrows.map(this.renderImageOverlay)}
        </Map>
        <Modal
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          closable={false}
          maskClosable={false}
          keyboard={false}
        >
          <Form>
            <Form.Item label="请输入区域名称">
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: '区域名称不能为空',
                  },
                  {
                    validator: this.validateName,
                    message: '区域名称已存在',
                  },
                ],
              })(<Input placeholder="请输入区域名称，名称不能重复" onPressEnter={this.handleOk} />)}
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default ImageDraw;
export { L };
