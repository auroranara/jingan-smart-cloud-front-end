import { Map, MouseTool, Polygon } from 'react-amap';
import React, { PureComponent } from 'react';

const layerStyle = {
  padding: '10px',
  background: '#fff',
  border: '1px solid #ddd',
  borderRadius: '4px',
  position: 'absolute',
  top: '10px',
  left: '10px',
};

export default class GridMap extends PureComponent {
  constructor() {
    super();
    const self = this;
    this.state = {
      what: '点击下方按钮开始绘制',
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
    this.polygonPath = [
      { Q: 35.17305633655724, N: 118.39324951171875, lng: 118.39325, lat: 35.173056 },
      { Q: 34.894187895562276, N: 118.01422119140625, lng: 118.014221, lat: 34.894188 },
      { Q: 34.670860838959356, N: 118.83544921874994, lng: 118.835449, lat: 34.670861 },
      { Q: 35.069716183787286, N: 118.95355224609375, lng: 118.953552, lat: 35.069716 },
    ];
  }

  componentDidMount() {
    // console.log('AMap', window.AMap);
    // const polygon = new window.AMap.Polygon({ path: pathJson });
    // this.mapinst.add(polygon);
  }

  drawWhat = obj => {
    this.setState({
      what: `你绘制了一个多边形，有${obj.getPath().length}个端点`,
      path: obj.getPath(),
    });
    console.log(JSON.stringify(obj.getPath()));
    this.close();
  };

  drawPolygon = () => {
    if (this.tool) {
      this.obj = undefined;
      this.tool.polygon();
      this.setState({
        what: '准备绘制多边形',
        path: [],
      });
    }
  };

  editPolygon = () => {
    console.log(this.mapinst.getAllOverlays('polygon')[0]);
    console.log('AMap2', window.AMap);
    if (!this.state.editActive) {
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
  };

  close = () => {
    if (this.tool) {
      this.tool.close();
    }
  };

  render() {
    const { editActive } = this.state;
    return (
      <div>
        <div style={{ width: '100%', height: 370 }}>
          <Map plugins={this.mapPlugins} center={this.mapCenter} events={this.mapEvents}>
            <MouseTool events={this.toolEvents} />
            <div style={layerStyle}>{this.state.what}</div>
            <Polygon path={this.polygonPath} />
          </Map>
        </div>
        <button
          onClick={() => {
            this.drawPolygon();
          }}
        >
          绘制区域
        </button>
        <button
          onClick={() => {
            this.editPolygon();
          }}
        >
          {editActive ? '关闭' : '开启'}
          编辑区域
        </button>
      </div>
    );
  }
}
