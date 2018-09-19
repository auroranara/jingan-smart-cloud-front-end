import { Map, MouseTool, Polygon } from 'react-amap';
import React, { PureComponent } from 'react';
import { message, Button } from 'antd'
import { connect } from 'dva'

const layerStyle = {
  padding: '10px',
  background: '#fff',
  border: '1px solid #ddd',
  borderRadius: '4px',
  position: 'absolute',
  top: '10px',
  left: '10px',
};
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
    this.mapCenter = { longitude: 120, latitude: 35 };
  }

  componentDidMount() {
    const {
      dispatch,
      match: { params: { id } },
    } = this.props
    dispatch({
      type: 'map/fetchGridPoints',
      payload: { gridId: id },
      callback: (list) => {
        this.setState({
          path: JSON.parse(list),
        })
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
    this.close();
  };

  // 开始绘制
  drawPolygon = () => {
    const { path } = this.state
    const points = this.mapinst.getAllOverlays('polygon')

    if (!points || points.length === 0) {
      if (this.tool) {
        this.obj = undefined;
        this.tool.polygon();
        this.setState({
          what: '准备绘制多边形，双击后结束绘制',
          path: [],
        });
      }
    } else message.warning('只能同时绘制一块区域！')
  };

  // 开启/关闭绘制区域
  editPolygon = () => {
    const { editActive } = this.state
    const points = this.mapinst.getAllOverlays('polygon')
    // console.log(this.mapinst.getAllOverlays('polygon')[0]);
    // console.log('AMap2', window.AMap);
    if (points && points.length) {
      if (!editActive) {
        // 开启编辑
        this.mapinst.plugin(['AMap.PolyEditor'], () => {
          this.polylineEditor = new window.AMap.PolyEditor(
            this.mapinst,
            this.mapinst.getAllOverlays('polygon')[0] //获取第一个多边形
          );
          this.setState(
            {
              editActive: true,
            },
            () => {
              this.polylineEditor.open();
            }
          );
        });

      } else {
        this.setState(
          {
            editActive: false,
          },
          () => {
            this.polylineEditor.close();
          }
        );
      }
    } else message.warning('请先绘制网格点！')
  };
  // 提交网格点
  handleSubmit = () => {
    const points = this.mapinst.getAllOverlays('polygon')
    const {
      dispatch,
      match: { params: { id } },
    } = this.props
    const { editActive } = this.state
    if (!editActive) {
      if (points && points.length) {
        // console.log('points[0]',points[0].getPath());

        dispatch({
          type: 'map/updateGridPoints',
          payload: {
            gridId: id,
            location: JSON.stringify(points[0].getPath()),
          },
          success: () => { message.success('操作成功！') },
          error: () => { message.error('操作失败！') },
        })
      } else message.warning('请先绘制网格点！')
    } else message.warning('请先结束编辑！')
  }

  close = () => {
    if (this.tool) {
      this.tool.close();
    }
  };

  handleClear = () => {
    const { editActive } = this.state
    if (!editActive) {
      this.setState({ editActive: false, path: [] })
      this.mapinst.remove(this.mapinst.getAllOverlays('polygon'))
    } else message.warning('请先结束编辑！')
  }

  render() {
    const { editActive, what, path } = this.state;
    const center = path && path.length ? path.reduce((res, item) => {
      return { longitude: (res.longitude + item.lng) / 2, latitude: (res.latitude + item.lat) / 2 }
    }, { longitude: path[0].lng, latitude: path[0].lat }) : this.mapCenter

    return (
      <div>
        <div style={{ width: '100%', height: 720 }}>
          <Map plugins={this.mapPlugins} center={center} events={this.mapEvents} zoom={12}>
            <MouseTool events={this.toolEvents} />
            <div style={layerStyle}>{what}</div>
            {path && path.length && <Polygon path={path} style={{ strokeOpacity: 0.5, fillOpacity: 0.5 }} />}
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
