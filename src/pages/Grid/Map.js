import { Map, MouseTool, Polygon, PolyEditor } from 'react-amap';
import React, { PureComponent } from 'react';
import { message, Button } from 'antd';
import { connect } from 'dva';

const layerStyle = {
  padding: '10px',
  background: '#fff',
  border: '1px solid #ddd',
  borderRadius: '4px',
  position: 'absolute',
  top: '10px',
  left: '10px',
};
const { location } = global.PROJECT_CONFIG;
const colors = [
  '#dc3912',
  '#ff9900',
  '#109618',
  '#990099',
  '#0099c6',
  '#dd4477',
  '#66aa00',
  '#b82e2e',
  '#316395',
  '#994499',
  '#22aa99',
  '#aaaa11',
  '#6633cc',
  '#e67300',
  '#8b0707',
  '#651067',
  '#329262',
  '#5574a6',
  '#3b3eac',
  '#3366cc',
];

@connect(({ map }) => ({
  map,
}))
export default class GridMap extends PureComponent {
  constructor() {
    super();
    const self = this;
    this.state = {
      what: '点击下方按钮开始绘制',
      //绘制的网格点
      path: [],
      editActive: false, // 是否开启编辑
      otherGridPoints: [], // 其他同级网格
    };
    this.toolEvents = {
      created: tool => {
        self.tool = tool;
      },
      draw({ obj }) {
        self.drawWhat(obj);
      },
    };
    this.mapEvents = {
      created: mapinst => {
        self.mapinst = mapinst;
      },
    };
    this.mapPlugins = ['ToolBar'];
    this.mapCenter = { longitude: location.x, latitude: location.y };
  }

  componentDidMount() {
    const {
      dispatch,
      match: {
        params: { id: gridId },
      },
    } = this.props;
    // 获取当前网格
    dispatch({
      type: 'map/fetchGridPoints',
      payload: { gridId },
      callback: list => {
        list && list.length && this.setState({
          path: JSON.parse(list),
        })
      },
    });
    // 获取同级其他网格
    dispatch({
      type: 'map/fetchOtherGridPoints',
      payload: { gridId },
      callback: (list) => {
        if (!list || !list.length) return
        const otherGridPoints = list.filter(item => item.mapLocation).map(item => ({
          ...item,
          mapLocation: JSON.parse(item.mapLocation),
        }))
        this.setState({ otherGridPoints })
      },
    })
    // console.log('AMap', window.AMap);
    // const polygon = new window.AMap.Polygon({ path: this.polygonPath });
    // this.mapinst.add(polygon);
  }

  // 结束绘制
  drawWhat(obj) {
    this.setState({
      what: `你绘制了一个多边形，有${obj.getPath().length}个端点`,
      // path: obj.getPath(),
    });
    this.setNewPolugon(obj)
    this.close();
  }

  // 开始绘制
  drawPolygon = () => {
    const { otherGridPoints = [] } = this.state;
    const points = this.mapinst.getAllOverlays('polygon');

    if (points.length === otherGridPoints.length) {
      if (this.tool) {
        this.obj = undefined;
        this.tool.polygon();
        this.setState({
          what: '准备绘制多边形，双击后结束绘制',
          path: [],
        });
      }
    } else message.warning('只能同时绘制一块区域！');
  };

  setNewPolugon = e => {
    const points = this.mapinst.getAllOverlays('polygon');
    this.setState({ path: e.Ge.path })
    this.mapinst.remove(points[points.length - 1])
  }

  /**
   * 开启/关闭绘制区域
   */
  editPolygon = () => {
    const { editActive, otherGridPoints = [] } = this.state;
    const points = this.mapinst.getAllOverlays('polygon');

    // 判断所有网格点数量和同级网格点数量是否相等，如果相等则当前没有绘制网格
    if (otherGridPoints.length !== points.length) {
      this.setState({ editActive: !this.state.editActive })
    } else message.warning('请先绘制网格点！');
  };


  // 点击提交网格点
  handleSubmit = () => {
    const points = this.mapinst.getAllOverlays('polygon');
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;
    const { editActive, otherGridPoints = [] } = this.state;
    if (!editActive) {
      if (points.length !== otherGridPoints.length) {
        dispatch({
          type: 'map/updateGridPoints',
          payload: {
            gridId: id,
            location: JSON.stringify(points[points.length - 1].getPath()),
          },
          success: () => {
            message.success('操作成功！');
          },
          error: () => {
            message.error('操作失败！');
          },
        });
      } else message.warning('请先绘制网格点！');
    } else message.warning('请先结束编辑！');
  };

  close = () => {
    if (this.tool) {
      this.tool.close();
    }
  };


  /**
   * 点击清空区域
   */
  handleClear = () => {
    const { editActive } = this.state;
    // 如果未开启编辑
    if (!editActive) {
      this.setState({ editActive: false, path: [] });
      // this.mapinst.remove(this.mapinst.getAllOverlays('polygon'));
    } else message.warning('请先结束编辑！');
  };


  /**
   * 渲染同级已绘制网格网格
   */
  renderPolygons = (polygons) => {
    return polygons.map(({ gridName, mapLocation: p }, i) => {
      if (p && p.length) {
        return (
          <Polygon
            key={i}
            path={p}
            visible={p.length}
            zIndex={9}
            style={{
              strokeColor: colors[i % 20],
              strokeOpacity: 1,
              strokeWeight: 0.5,
              fillColor: colors[i % 20],
              fillOpacity: 0.5,
            }}
          />
        );
      } else return null
    });
  };

  render() {
    const { editActive, what, path, otherGridPoints = [] } = this.state;
    const center =
      path && path.length
        ? path.reduce(
          (res, item) => {
            return {
              longitude: (res.longitude + item.lng) / 2,
              latitude: (res.latitude + item.lat) / 2,
            };
          },
          { longitude: path[0].lng, latitude: path[0].lat }
        )
        : this.mapCenter;
    if (path && path.length) {
      this.mapCenter = center;
    }

    return (
      <div>
        <div style={{ width: '100%', height: 720 }}>
          <Map
            plugins={this.mapPlugins}
            center={center}
            events={this.mapEvents}
            zoom={location.zoom}
          >
            <MouseTool events={this.toolEvents} />
            <div style={layerStyle}>{what}</div>
            {this.renderPolygons(otherGridPoints)}
            {/* 显示已绘制网格 */}
            {path &&
              path.length > 0 && (
                <Polygon path={path} style={{ strokeOpacity: 0.5, fillOpacity: 0.5 }} >
                  <PolyEditor active={editActive} event={{
                    end: this.setNewPolugon,
                  }} />
                </Polygon>
              )}
          </Map>
        </div>
        <Button
          onClick={() => {
            this.drawPolygon();
          }}
        >
          绘制区域
        </Button>
        <Button
          onClick={() => {
            this.editPolygon();
          }}
        >
          {editActive ? '关闭' : '开启'}
          编辑区域
        </Button>
        <Button onClick={() => this.handleClear()}>清空区域</Button>
        <Button onClick={() => this.handleSubmit()}>提交</Button>
      </div>
    );
  }
}
