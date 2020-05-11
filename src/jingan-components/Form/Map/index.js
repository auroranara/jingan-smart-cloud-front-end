import React, { Component } from 'react';
import styles from './index.less';
const fengMap = fengmap; // eslint-disable-line
const MapContainer = 'joySuchMap';

export default class FormMap extends Component {
  state = {
    map: undefined,
  };

  imageMarkerMapper = undefined;

  polygonMarkerMapper = undefined;

  textMarkerMapper = undefined;

  componentDidMount() {
    const { options } = this.props;
    const { key, appName, mapId } = options || {};
    if (key && appName && mapId) {
      this.openMap();
    }
  }

  componentDidUpdate({
    options: prevOptions,
    imageMarkerList: prevImageMarkerList,
    polygonMarkerList: prevPolygonMarkerList,
    textMarkerList: prevTextMarkerList,
    modelList: prevModelList,
  }) {
    const { options, imageMarkerList, polygonMarkerList, textMarkerList, modelList } = this.props;
    const { map } = this.state;
    const { key: prevKey, appName: prevAppName, mapId: prevMapId } = prevOptions || {};
    const { key, appName, mapId } = options || {};
    if (key !== prevKey || appName !== prevAppName || mapId !== prevMapId) {
      if (key && appName && mapId) {
        if (map) {
          // options发生变化且存在时，如果之前已打开地图，则重新打开地图
          this.closeMap();
          this.openMap();
        } else {
          // options发生变化且存在时，如果之前未打开地图，则打开地图
          this.openMap();
        }
      } else if (map) {
        // options发生变化且不存在时，如果之前已打开地图，则关闭地图
        this.closeMap();
      }
    } else if (map) {
      // 楼层不变的情况下数据源发生变化
      if (imageMarkerList !== prevImageMarkerList) {
        // options没有发生变化但imageMarkerList发生变化时，重新渲染
        const groupId = map.focusGroupID;
        const { list, mapper } = (imageMarkerList || []).reduce(
          (result, item) => {
            if (item.groupId === groupId) {
              result.list.push(item);
              if (item.key) {
                result.mapper[item.key] = item;
              }
            }
            return result;
          },
          { list: [], mapper: {} }
        );
        const { deleteList, prevMapper } = (prevImageMarkerList || []).reduce(
          (result, prevItem) => {
            if (prevItem.groupId === groupId && prevItem.key) {
              if (!mapper[prevItem.key]) {
                result.deleteList.push(prevItem.key || prevItem);
              }
              if (prevItem.key) {
                result.prevMapper[prevItem.key] = prevItem;
              }
            }
            return result;
          },
          { deleteList: [], prevMapper: {} }
        );
        const { addList, editList } = list.reduce(
          (result, item) => {
            const prevItem = prevMapper[item.key];
            if (!prevItem) {
              result.addList.push(item);
            } else if (item !== prevItem) {
              const position = (item.x !== prevItem.x ||
                item.y !== prevItem.y ||
                item.height !== prevItem.height) && { x: item.x, y: item.y, height: item.height };
              result.editList.push({
                key: item.key,
                position,
                size: item.size !== prevItem.size ? item.size : undefined,
                url: item.url !== prevItem.url ? item.url : undefined,
              });
            }
            return result;
          },
          { addList: [], editList: [] }
        );
        this.addImageMarkerList(addList);
        this.editImageMarkerList(editList);
        this.deleteImageMarkerList(deleteList);
      }
      if (polygonMarkerList !== prevPolygonMarkerList) {
        // options没有发生变化但polygonMarkerList发生变化时，重新渲染
        const groupId = map.focusGroupID;
        const { list, mapper } = (polygonMarkerList || []).reduce(
          (result, item) => {
            if (item.groupId === groupId) {
              result.list.push(item);
              if (item.key) {
                result.mapper[item.key] = item;
              }
            }
            return result;
          },
          { list: [], mapper: {} }
        );
        const { deleteList, prevMapper } = (prevPolygonMarkerList || []).reduce(
          (result, prevItem) => {
            if (prevItem.groupId === groupId && prevItem.key) {
              if (!mapper[prevItem.key]) {
                result.deleteList.push(prevItem.key || prevItem);
              }
              if (prevItem.key) {
                result.prevMapper[prevItem.key] = prevItem;
              }
            }
            return result;
          },
          { deleteList: [], prevMapper: {} }
        );
        const { addList, editList } = list.reduce(
          (result, item) => {
            const prevItem = prevMapper[item.key];
            if (!prevItem) {
              result.addList.push(item);
            } else if (item !== prevItem) {
              result.editList.push({
                key: item.key,
                color: item.color !== prevItem.color ? item.color : undefined,
                alpha: item.alpha !== prevItem.alpha ? item.alpha : undefined,
                lineWidth: item.lineWidth !== prevItem.lineWidth ? item.lineWidth : undefined,
                height: item.height !== prevItem.height ? item.height : undefined,
              });
            }
            return result;
          },
          { addList: [], editList: [] }
        );
        this.addPolygonMarkerList(addList);
        this.editPolygonMarkerList(editList);
        this.deletePolygonMarkerList(deleteList);
      }
      if (textMarkerList !== prevTextMarkerList) {
        // options没有发生变化但textMarkerList发生变化时，重新渲染
        const groupId = map.focusGroupID;
        const { list, mapper } = (textMarkerList || []).reduce(
          (result, item) => {
            if (item.groupId === groupId) {
              result.list.push(item);
              if (item.key) {
                result.mapper[item.key] = item;
              }
            }
            return result;
          },
          { list: [], mapper: {} }
        );
        const { deleteList, prevMapper } = (prevTextMarkerList || []).reduce(
          (result, prevItem) => {
            if (prevItem.groupId === groupId && prevItem.key) {
              if (!mapper[prevItem.key]) {
                result.deleteList.push(prevItem.key || prevItem);
              }
              if (prevItem.key) {
                result.prevMapper[prevItem.key] = prevItem;
              }
            }
            return result;
          },
          { deleteList: [], prevMapper: {} }
        );
        const { addList, editList } = list.reduce(
          (result, item) => {
            const prevItem = prevMapper[item.key];
            if (!prevItem) {
              result.addList.push(item);
            } else if (item !== prevItem) {
              result.editList.push({
                key: item.key,
                x: item.x !== prevItem.x ? item.x : undefined,
                y: item.y !== prevItem.y ? item.y : undefined,
                name: item.name !== prevItem.name ? item.name : undefined,
                fontsize: item.fontsize !== prevItem.fontsize ? item.fontsize : undefined,
                fillcolor: item.fillcolor !== prevItem.fillcolor ? item.fillcolor : undefined,
                strokecolor:
                  item.strokecolor !== prevItem.strokecolor ? item.strokecolor : undefined,
                alpha: item.alpha !== prevItem.alpha ? item.alpha : undefined,
              });
            }
            return result;
          },
          { addList: [], editList: [] }
        );
        this.addTextMarkerList(addList);
        this.editTextMarkerList(editList);
        this.deleteTextMarkerList(deleteList);
      }
      if (modelList !== prevModelList) {
        // options没有发生变化但modelList发生变化时，重新渲染
        this.renderModelList();
      }
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (
      nextProps.options !== this.props.options ||
      nextProps.imageMarkerList !== this.props.imageMarkerList ||
      nextProps.polygonMarkerList !== this.props.polygonMarkerList ||
      nextProps.textMarkerList !== this.props.textMarkerList ||
      nextProps.modelList !== this.props.modelList ||
      nextState !== this.state
    );
  }

  /* eslint-disable */
  // 打开地图
  openMap = () => {
    const { options, onLoadStart, onLoadEnd } = this.props;
    onLoadStart && onLoadStart();
    const {
      key,
      appName,
      mapId,
      theme,
      defaultMapScaleLevel,
      modelSelectedEffect,
      tiltAngle,
      rotateAngle,
      defaultViewMode,
    } = options;
    const mapOptions = {
      mapType: jsmap.JSMapType.MAP_PSEUDO_3D,
      container: MapContainer,
      token: key,
      mapServerURL: './data/map',
    };
    const map = new jsmap.JSMap(mapOptions);
    map.openMapById(mapId);

    map.on('loadComplete', () => {
      this.setState(
        {
          map,
        },
        () => {
          this.renderFloorContorl();
          this.renderList();
        }
      );
      onLoadEnd && onLoadEnd(map);
    });
    // map.on('mapClickNode', e => {
    //   console.log({ mapClickNode: e });
    // });
  };

  // 关闭地图
  closeMap = () => {
    // const { map } = this.state;
    document.getElementById(MapContainer).innerHTML = '';
    this.setState({
      map: undefined,
    });
  };

  // 新增imageMarker
  addImageMarkerList = list => {
    const { map } = this.state;
    const groupId = map.focusGroupID;
    const group = map.getFMGroup(groupId);
    const layer = group.getOrCreateLayer('imageMarker');
    return list.every(this.renderImageMarker.bind(this, layer));
  };

  // 新增polygonMarker
  addPolygonMarkerList = list => {
    const { map } = this.state;
    const groupId = map.focusGroupID;
    const group = map.getFMGroup(groupId);
    const layer = group.getOrCreateLayer('polygonMarker');
    return list.every(this.renderPolygonMarker.bind(this, layer));
  };

  // 新增textMarker
  addTextMarkerList = list => {
    const { map } = this.state;
    const groupId = map.focusGroupID;
    const group = map.getFMGroup(groupId);
    const layer = group.getOrCreateLayer('textMarker');
    return list.every(this.renderTextMarker.bind(this, layer));
  };

  // 编辑imageMarker
  editImageMarkerList = list => {
    const { map } = this.state;
    const groupId = map.focusGroupID;
    return list.every(item => {
      const marker = this.imageMarkerMapper.get(item.key);
      if (marker) {
        if (item.position) {
          const { x, y, height } = item.position;
          marker.setPosition(x, y, groupId, height);
        }
        if (item.size) {
          marker.size = item.size;
        }
        if (item.url) {
          marker.url = item.url;
        }
      }
      return marker;
    });
  };

  // 编辑polygonMarker
  editPolygonMarkerList = list => {
    return list.every(item => {
      const marker = this.polygonMarkerMapper.get(item.key);
      // 这里未完成，尤其是points属性
      if (marker) {
        if (item.color) {
          marker.color = item.color;
        }
        if (item.alpha) {
          marker.alpha = item.alpha;
        }
        if (item.lineWidth) {
          marker.lineWidth = item.lineWidth;
        }
        if (item.height) {
          marker.height = item.height;
        }
      }
      return marker;
    });
  };

  // 编辑textMarker
  editTextMarkerList = list => {
    return list.every(item => {
      const marker = this.textMarkerMapper.get(item.key);
      if (marker) {
        if (item.x) {
          marker.x = item.x;
        }
        if (item.y) {
          marker.y = item.y;
        }
        if (item.name) {
          marker.name = item.name;
        }
        if (item.fontsize) {
          marker.fontsize = item.fontsize;
        }
        if (item.fillcolor) {
          marker.fillcolor = item.fillcolor;
        }
        if (item.strokecolor) {
          marker.strokecolor = item.strokecolor;
        }
        if (item.alpha) {
          marker.alpha = item.alpha;
        }
      }
      return marker;
    });
  };

  // 删除对应的imageMarker
  deleteImageMarkerList = list => {
    const { map } = this.state;
    const groupId = map.focusGroupID;
    const group = map.getFMGroup(groupId);
    const layer = group.getOrCreateLayer('imageMarker');
    return list.every(key => {
      const marker = this.imageMarkerMapper.get(key);
      if (marker) {
        layer.removeMarker(marker);
        this.imageMarkerMapper.delete(key);
      }
      return layer;
    });
  };

  // 删除对应的polygonMarker
  deletePolygonMarkerList = list => {
    const { map } = this.state;
    const groupId = map.focusGroupID;
    const group = map.getFMGroup(groupId);
    const layer = group.getOrCreateLayer('polygonMarker');
    return list.every(key => {
      const marker = this.polygonMarkerMapper.get(key);
      if (marker) {
        layer.removeMarker(marker);
        this.polygonMarkerMapper.delete(key);
      }
      return layer;
    });
  };

  // 删除对应的textMarker
  deleteTextMarkerList = list => {
    const { map } = this.state;
    const groupId = map.focusGroupID;
    const group = map.getFMGroup(groupId);
    const layer = group.getOrCreateLayer('textMarker');
    return list.every(key => {
      const marker = this.textMarkerMapper.get(key);
      if (marker) {
        layer.removeMarker(marker);
        this.textMarkerMapper.delete(key);
      }
      return layer;
    });
  };

  renderList() {
    this.renderImageMarkerList();
    // this.renderPolygonMarkerList();
    // this.renderTextMarkerList();
    // this.renderModelList();
  }

  // 楼层切换控件
  renderFloorContorl() {
    const { map } = this.state;
    const floorControl = new jsmap.JSFloorControl({
      position: jsmap.JSControlPosition.RIGHT_TOP, //控件在容器中的位置             ??????
      showBtnCount: 6, //默认显示楼层的个数 TODO
      allLayers: false, //初始是否是多层显示，默认单层显示
      needAllLayerBtn: true, // 是否显示多层/单层切换按钮
      offset: {
        x: 0,
        y: 10,
      }, //位置 x,y 的偏移量
    });
    map.addControl(floorControl);
    return floorControl;
  }

  // 图片覆盖物
  renderImageMarker(data) {
    const { map } = this.state;
    return;
    const marker = new fengMap.FMImageMarker({
      ...data,
      callback: data.callback
        ? () => {
            data.callback(marker, map);
          }
        : undefined,
    });
    layer.addMarker(marker);
    this.imageMarkerMapper.set(data.key || data, marker);
    return marker;
  }

  // 图片覆盖物列表（重新生成当前楼层所有的imageMarker）
  renderImageMarkerList() {
    const { map } = this.state;
    const { imageMarkerList } = this.props;
    console.log('imageMarkerList', imageMarkerList);
    // const groupId = map.focusGroupID;
    // const list = (imageMarkerList || []).filter(item => item.groupId === groupId);
    // const group = map.getFMGroup(groupId);
    // const layer = group.getOrCreateLayer('imageMarker');
    // layer.removeAll();
    this.imageMarkerMapper = new Map();
    return imageMarkerList.every(this.renderImageMarker.bind(this));
  }

  // 多边形覆盖物
  renderPolygonMarker(layer, data) {
    const { map } = this.state;
    const marker = new fengMap.FMPolygonMarker({
      ...data,
    });
    layer.addMarker(marker);
    data.callback && data.callback(marker, map);
    this.polygonMarkerMapper.set(data.key || data, marker);
    return marker;
  }

  // 多边形覆盖物列表（重新生成当前楼层所有的polygonMarker）
  renderPolygonMarkerList() {
    const { map } = this.state;
    const { polygonMarkerList } = this.props;
    const groupId = map.focusGroupID;
    const list = (polygonMarkerList || []).filter(item => item.groupId === groupId);
    const group = map.getFMGroup(groupId);
    const layer = group.getOrCreateLayer('polygonMarker');
    layer.removeAll();
    this.polygonMarkerMapper = new Map();
    return list.every(this.renderPolygonMarker.bind(this, layer));
  }

  // 文本覆盖物
  renderTextMarker(layer, data) {
    const { map } = this.state;
    const marker = new fengMap.FMTextMarker({
      ...data,
    });
    layer.addMarker(marker);
    data.callback && data.callback(marker, map);
    this.textMarkerMapper.set(data.key || data, marker);
    return marker;
  }

  // 文本覆盖物列表（重新生成当前楼层所有的textMarker）
  renderTextMarkerList() {
    const { map } = this.state;
    const { textMarkerList } = this.props;
    const groupId = map.focusGroupID;
    const list = (textMarkerList || []).filter(item => item.groupId === groupId);
    const group = map.getFMGroup(groupId);
    const layer = group.getOrCreateLayer('textMarker');
    layer.removeAll();
    this.textMarkerMapper = new Map();
    return list.every(this.renderTextMarker.bind(this, layer));
  }

  // 模型列表（重新设置当前楼层所有model的颜色）
  renderModelList() {
    const { map } = this.state;
    const { modelList } = this.props;
    const groupId = map.focusGroupID;
    const list = (modelList || []).filter(item => item.groupId === groupId);
    const mapper = list.reduce((result, item) => {
      result[item.key] = item;
      return result;
    }, {});
    const models = map.getDatasByAlias(groupId, 'model');
    return models.every(model => {
      const item = mapper[model.FID];
      if (item && item.color) {
        model.setColor(item.color, item.alpha || 1);
      } else {
        model.setColorToDefault();
      }
      return model;
    });
  }

  render() {
    const { children } = this.props;
    const { map } = this.state;

    return (
      <div className={styles.container}>
        <div className={styles.map} id={MapContainer} />
        {map && children}
      </div>
    );
  }
}
