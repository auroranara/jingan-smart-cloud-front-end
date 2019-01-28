import React, { PureComponent } from 'react';
import { Modal, Input, Form } from 'antd';
import { Map, FeatureGroup, ImageOverlay, Polygon, Circle, Rectangle, Marker, CircleMarker, ZoomControl } from 'react-leaflet';
import { EditControl } from "react-leaflet-draw"
import L from 'leaflet';

import styles from './index.less';

// 边线宽度
const weight = 1;
// 颜色
const color = '#000';
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
    _updatePath: function () {
      if (this._path.parentNode && this.options.data.name) {
        const center = this._map.latLngToLayerPoint(this.getCenter());
        if (this._textNode && this._textNode.parentNode) {
            this._path.parentNode.removeChild(this._textNode);
        }
        const zoom = this._map.getZoom();
        const textNode = L.SVG.create('text');
        textNode.setAttribute('text-anchor', 'middle');
        textNode.setAttribute('style', 'font-weight:bold');
        textNode.setAttribute('fill', defaultFontColor);
        textNode.setAttribute('x', center.x);
        textNode.setAttribute('y', center.y);
        textNode.setAttribute('font-size', zoom > 0 ? defaultFontSize * zoom * 2 : defaultFontSize);
        textNode.appendChild(document.createTextNode(this.options.data.name));
        this._path.parentNode.appendChild(textNode);
        this._textNode = textNode;
      }
      return originalUpdatePathRectangle.call(this);
    },
  });
  const originalUpdatePathPolygon = L.Polygon.prototype._updatePath;
  L.Polygon.include({
    _updatePath: function () {
      if (this._path.parentNode && this.options.data.name) {
        const center = this._map.latLngToLayerPoint(this.getCenter());
        if (this._textNode && this._textNode.parentNode) {
            this._path.parentNode.removeChild(this._textNode);
        }
        const zoom = this._map.getZoom();
        const textNode = L.SVG.create('text');
        textNode.setAttribute('text-anchor', 'middle');
        textNode.setAttribute('style', 'font-weight:bold');
        textNode.setAttribute('fill', defaultFontColor);
        textNode.setAttribute('x', center.x);
        textNode.setAttribute('y', center.y);
        textNode.setAttribute('font-size', zoom > 0 ? defaultFontSize * zoom * 2 : defaultFontSize);
        textNode.appendChild(document.createTextNode(this.options.data.name));
        this._path.parentNode.appendChild(textNode);
        this._textNode = textNode;
      }
      return originalUpdatePathPolygon.call(this);
    }
  });
  const originalUpdatePathCircle = L.Circle.prototype._updatePath;
  L.Circle.include({
    _updatePath: function () {
      if (this._path.parentNode && this.options.data.name) {
        const center = this._point;
        if (this._textNode && this._textNode.parentNode) {
            this._path.parentNode.removeChild(this._textNode);
        }
        const zoom = this._map.getZoom();
        const textNode = L.SVG.create('text');
        textNode.setAttribute('text-anchor', 'middle');
        textNode.setAttribute('style', 'font-weight:bold');
        textNode.setAttribute('fill', defaultFontColor);
        textNode.setAttribute('x', center.x);
        textNode.setAttribute('y', center.y);
        textNode.setAttribute('font-size', zoom > 0 ? defaultFontSize * zoom * 2 : defaultFontSize);
        textNode.appendChild(document.createTextNode(this.options.data.name));
        this._path.parentNode.appendChild(textNode);
        this._textNode = textNode;
      }
      return originalUpdatePathCircle.call(this);
    }
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
    // center: L.latLng(300, 400),
    // bounds: L.latLngBounds([0,0], [600, 800]),
    center: undefined,
    bounds: undefined,
    visible: false,
    maxBounds: undefined,
    // list: [
    //   { name: '很长很长的阳台名称', type: 'circle', latlng: { lat: 237, lng: 378 }, radius: 200 },
    //   { name: '矩形', type: 'rectangle', latlngs: [{lat: 349, lng: 78}, {lat: 428, lng: 78},{lat: 428, lng: 140},{lat: 349, lng: 140}]},
    //   { name: '多边形', type: 'polygon', latlngs: [{lat: 0, lng: 0}, {lat: 100, lng: 100},{lat: 0, lng: 100}]},
    // ],
  }

  layer = null;

  layerType = null;

  // 是否处于编辑状态
  editing = false;

  // 是否处于删除状态
  deleting = false;

  // 是否处于绘制状态
  drawing = false;

  componentDidMount() {

  }

  componentDidUpdate({ url: prevUrl }) {
    const { url } = this.props;
    // 当图片地址发生变化时
    if (url !== prevUrl) {
      const { filled, maxBoundsRatio=1 } = this.props;
      // 如果使用填充效果
      if (filled) {
        // 按照容器的比例
        const { clientWidth: width, clientHeight: height } =  this.map.container;
        this.setState({
          bounds: L.latLngBounds([0, 0], [height, width]),
          maxBounds: L.latLngBounds([-height * (maxBoundsRatio-1), -width * (maxBoundsRatio-1)], [height * maxBoundsRatio, width * maxBoundsRatio]),
        }, () => {
          this.setState({
            center: L.latLng(height/2, width/2),
          });
        });
      }
      else {
        // 按照图片本身的比例
        const image = new Image();
        image.src = url;
        image.onload = (e) => {
          const { width, height } = e.path[0];
          this.setState({
            bounds: L.latLngBounds([0, 0], [height, width]),
            maxBounds: L.latLngBounds([-height * (maxBoundsRatio-1), -width * (maxBoundsRatio-1)], [height * maxBoundsRatio, width * maxBoundsRatio]),
          }, () => {
            this.setState({
              center: L.latLng(height/2, width/2),
            });
          });
        }
      }
    }
  }

  refFeatureGroup = (drawnItems) => {
    this.drawnItems = drawnItems;
  }

  refMap = (map) => {
    this.map = map;
  }

  /**
   * 获取图形特征
   */
  getShapeFeature = (type, layer) => {
    const { bounds: { _northEast: { lat: height, lng: width }  } } = this.state;
    const { _latlngs: latlngs, _latlng: latlng, _radius: radius } = layer;
    switch(type) {
      case 'polygon':
      case 'rectangle':
      return { latlngs: latlngs.map(({ lat, lng }) => ({ lat: lat / height, lng: lng / width })) };
      case 'marker':
      return { latlng: { lat: latlng.lat / height, lng: latlng.lng / width } };
      case 'circle':
      case 'circlemarker':
      return { latlng: { lat: latlng.lat / height, lng: latlng.lng / width }, radius: radius / width };
      default:
      return undefined;
    }
  };

  /**
   * 验证名称是否重复
   */
  validateName = (rule, value, callback) => {
    const { data=[] } = this.props;
    const isExist = data.filter(({ name }) => name === value).length > 0;
    if (isExist) {
      callback('区域名称已存在');
    }
    else {
      callback();
    }
  }

  /**
   * 插入新数据
   */
  pushData = (layerType, layer, name="") => {
    const { data, onUpdate, limit=Infinity } = this.props;
    if (data && onUpdate && data.length < limit) {
      onUpdate(data.concat({
        type: layerType,
        options: layer.options,
        name,
        ...this.getShapeFeature(layerType, layer),
      }));
    }
    this.handleCancel();
  }


  /**
   * 图形创建后
   */
  handleCreated = ({ layer, layerType }) => {
    const { namable } = this.props;
    if (namable) {
      // 保存参数
      this.layer = layer;
      this.layerType = layerType;
      // 显示设置区域名称弹出框
      this.setState({ visible: true });
    }
    else {
      this.pushData(layerType, layer);
    }
  }

  /**
   * 图形修改后
   */
  handleEdited = ({ layers: { _layers: editedObj } }) => {
    const { data, onUpdate } = this.props;
    if (data && onUpdate) {
      const editedList = Object.values(editedObj);
      if (editedList.length > 0) {
        const editedDataList = editedList.map(({ options: { data } }) => data);
        onUpdate(data.map(item => {
          const index = editedDataList.indexOf(item);
          if (index > -1) {
            return {
              ...item,
              ...this.getShapeFeature(item.type, editedList[index]),
            };
          }
          return item;
        }));
        // this.setState(({ list }) => ({
        //   list: list.map(item => {
        //     const index = editedDataList.indexOf(item);
        //     if (index > -1) {
        //       return {
        //         ...item,
        //         ...this.getShapeFeature(item.type, editedList[index]),
        //       };
        //     }
        //     return item;
        //   }),
        // }));
      }
    }
  }

  /**
   * 图形删除后
   */
  handleDeleted = ({ layers: { _layers: deletedObj } }) => {
    const { data, onUpdate } = this.props;
    if (data && onUpdate) {
      const deletedList = Object.values(deletedObj);
      if (deletedList.length > 0) {
        const deletedDataList = deletedList.map(({ options: { data } }) => data);
        onUpdate(data.filter((item) => deletedDataList.indexOf(item) === -1));
        // this.setState(({ list }) => ({
        //   list: list.filter((item) => deletedDataList.indexOf(item) === -1),
        // }));
      }
    }
  }

  /**
   * 点击图形
   */
  handleClickShape = (e) => {
    // 当图形处于正常状态时才触发点击事件
    if (!this.editing && !this.deleting && !this.drawing) {
      const { onClick } = this.props;
      onClick && onClick(e);
    }
  }

  /**
   * 弹出框ok事件
   */
  handleOk = () => {
    const { form: { validateFields } } = this.props;
    validateFields(['name'], (errors, values) => {
      if (!errors) {
        const { name } = values;
        this.pushData(this.layerType, this.layer, name);
        // 手动添加layer
        // this.setState(({ list }) => {
        //   const { options } = this.layer;
        //   return {
        //     list: list.concat({
        //       type: this.layerType,
        //       options,
        //       name,
        //       ...this.getShapeFeature(this.layerType, this.layer),
        //     }),
        //   };
        // }, () => {
        //   this.handleCancel();
        // });
      }
    });
  }

  /**
   * 取消
   */
  handleCancel = () => {
    const { form: { setFieldsValue } } = this.props;
    this.drawnItems.leafletElement.removeLayer(this.layer);
    setFieldsValue({ name: undefined });
    this.setState({ visible: false });
  }

  /**
   * 添加后
   */
  handleAdd = ({ target: layer }) => {
    const { options: { data: { type, name } }, _point: point } = layer;
    layer.bindTooltip(name, { sticky: true });
    if (['polygon', 'rectangle', 'circle'].includes(type)) {
      const center = type === 'circle' ? point : layer._map.latLngToLayerPoint(layer.getCenter());
      if (layer._textNode && layer._textNode.parentNode) {
        layer._path.parentNode.removeChild(layer._textNode);
      }
      const zoom = layer._map.getZoom();
      const textNode = L.SVG.create('text');
      textNode.setAttribute('text-anchor', 'middle');
      textNode.setAttribute('style', 'font-weight:bold');
      textNode.setAttribute('fill', defaultFontColor);
      textNode.setAttribute('x', center.x);
      textNode.setAttribute('y', center.y);
      textNode.setAttribute('font-size', zoom > 0 ? defaultFontSize * zoom * 2 : defaultFontSize);
      textNode.appendChild(document.createTextNode(name));
      layer._path.parentNode.appendChild(textNode);
      layer._textNode = textNode;
    }
  }

  /**
   * 图形移除
   */
  handleRemove = ({ target: layer }) => {
    if (layer._textNode) {
      layer._textNode.parentNode.removeChild(layer._textNode);
    }
  }


  handleEditStart = () => {
    this.editing = true;
  }

  handleEditStop = () => {
    this.editing = false;
  }

  handleDeleteStart = () => {
    this.deleting = true;
  }

  handleDeleteStop = () => {
    this.deleting = false;
  }

  handleDrawStart = () => {
    this.drawing = true;
  }

  handleDrawStop = () => {
    this.drawing = false;
  }

  /**
   * 渲染图形
   */
  renderShape = (item) => {
    const { bounds: { _northEast: { lat: height, lng: width }  } } = this.state;
    const { latlngs, latlng, type, radius, name, render } = item;
    let shape = null;
    switch(type){
      case 'polygon': // 多边形
        shape = (
          <Polygon
            key={name}
            data={item}
            positions={latlngs.map(({ lat, lng }) => ({ lat: lat * height, lng: lng * width }))}
            onClick={this.handleClickShape}
            onAdd={this.handleAdd}
            onRemove={this.handleRemove}
            color={color}
            weight={weight}
          />
        );
        break;
      case 'rectangle': // 矩形
        shape = (
          <Rectangle
            key={name}
            data={item}
            bounds={latlngs.map(({ lat, lng }) => ({ lat: lat * height, lng: lng * width }))}
            onClick={this.handleClickShape}
            onAdd={this.handleAdd}
            onRemove={this.handleRemove}
            color={color}
            weight={weight}
          />
        );
        break;
      case 'circle': // 圆
        shape = (
          <Circle
            key={name}
            data={item}
            center={{ lat: latlng.lat * height, lng: latlng.lng * width }}
            radius={radius * width}
            onClick={this.handleClickShape}
            onAdd={this.handleAdd}
            onRemove={this.handleRemove}
            color={color}
            weight={weight}
          />
        );
        break;
      case 'marker': // 标记
        shape = render ? render(item, { position: { lat: latlng.lat * height, lng: latlng.lng * width }, onAdd: this.handleAdd, onClick: this.handleClickShape }) : (
          <Marker
            key={name}
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
            key={name}
            data={item}
            center={{ lat: latlng.lat * height, lng: latlng.lng * width }}
            radius={radius * width}
            onClick={this.handleClickShape}
            onAdd={this.handleAdd}
            color={color}
            // weight={weight}
          />
        );
        break;
      default:
        break;
    }
    return shape;
  }

  render() {
    const { className, style, mapProps, zoomControlProps, editControlProps, drawable, url, data=[], shapes=['polygon', 'rectangle', 'circle'], form: { getFieldDecorator } } = this.props;
    const { center, bounds, visible, maxBounds } = this.state;

    return (
      <div className={className} style={{ height: 600, ...style }}>
        <Map
          id="mapContainer"
          className={styles.mapContainer}
          center={center}
          minZoom={-2}
          maxZoom={5}
          zoom={0}
          editable
          crs={L.CRS.Simple}
          attributionControl={false}
          bounds={bounds}
          maxBounds={maxBounds}
          ref={this.refMap}
          zoomControl={false}
          {...mapProps}
          // dragging={false}
        >
          {bounds && <ZoomControl zoomInTitle="" zoomOutTitle="" className={styles.zoomControl} {...zoomControlProps} />}
          {bounds && (
            <ImageOverlay url={url} bounds={bounds} className={styles.imageOverlay}>
              <FeatureGroup ref={this.refFeatureGroup}>
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
                          weight,
                          color,
                        },
                      },
                      rectangle: shapes.includes('rectangle') && {
                        showArea: false,
                        shapeOptions: {
                          weight,
                          color,
                        },
                      },
                      circle: shapes.includes('circle') && {
                        showRadius: false,
                        shapeOptions: {
                          weight,
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
              </FeatureGroup>
            </ImageOverlay>
          )}
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
                rules: [{
                  required: true,
                  message: '区域名称不能为空',
                }, {
                  validator: this.validateName,
                  message: '区域名称已存在',
                }],
              })(
                <Input placeholder="请输入区域名称，名称不能重复" onPressEnter={this.handleOk} />
              )}
            </Form.Item>
          </Form>
        </Modal>
      </div>
    )
  }
}

export default ImageDraw;
export { L };
