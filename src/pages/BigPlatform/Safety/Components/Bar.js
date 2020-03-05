import React, { Component } from 'react';
import { Chart, Axis, Tooltip, Geom, Shape } from 'bizcharts';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import autoHeight from 'components/Charts/autoHeight';

Shape.registerShape('interval', 'triangle', {
  getPoints(cfg) {
    const x = cfg.x;
    const y = cfg.y;
    const y0 = cfg.y0;
    const width = cfg.size;
    return [{ x: x - width / 2, y: y0 }, { x: x, y: y }, { x: x + width / 2, y: y0 }];
  },
  drawShape(cfg, group) {
    // 自定义最终绘制
    const points = this.parsePoints(cfg.points); // 将0-1空间的坐标转换为画布坐标
    const value = cfg.origin._origin.value;

    group.addShape('text', {
      attrs: {
        text: value,
        textAlign: 'center',
        x: points[1].x,
        y: points[1].y,
        fontSize: 12,
        fill: '#fff',
      },
    });
    const polygon = group.addShape('polygon', {
      attrs: {
        points: [
          [points[0].x, points[0].y],
          [points[1].x, points[1].y],
          [points[2].x, points[2].y],
        ],
        fill: cfg.color,
        opacity: 0.75,
      },
    });
    // 左半三角
    group.addShape('polygon', {
      attrs: {
        points: [
          [points[0].x, points[0].y],
          [points[1].x, points[1].y],
          [points[1].x, points[2].y],
        ],
        fill: cfg.color,
        opacity: 1,
      },
    });
    return polygon; // !必须返回 shape
  },
});

@autoHeight()
class Bar extends Component {
  state = {
    autoHideXLabels: false,
  };

  componentDidMount() {
    window.addEventListener('resize', this.resize, { passive: true });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  handleRoot = n => {
    this.root = n;
  };

  handleRef = n => {
    this.node = n;
  };

  @Bind()
  @Debounce(400)
  resize() {
    if (!this.node) {
      return;
    }
  }

  render() {
    const {
      height,
      forceFit = true,
      data,
      color = 'rgba(24, 144, 255, 0.85)',
      padding,
    } = this.props;

    const { autoHideXLabels } = this.state;

    const scale = {
      x: {
        type: 'cat',
      },
      y: {
        min: 0,
      },
    };

    const tooltip = [
      'x*y',
      (x, y) => ({
        name: x,
        value: y,
      }),
    ];

    return (
      <div ref={this.handleRef}>
        <Chart
          scale={scale}
          forceFit={forceFit}
          height={height}
          data={data}
          padding={[25, 30, 45, 40] || 'auto'}
          onGetG2Instance={chart => {
            this.chart = chart;
          }}
        >
          <Axis
            name="name"
            title={null}
            label={{
              textStyle: {
                fontSize: 12, // 文本大小
                textAlign: 'center', // 文本对齐方式
                fill: '#fff', // 文本颜色
              },
            }}
          />
          <Axis
            name="value"
            label={{
              textStyle: {
                fontSize: 12, // 文本大小
                textAlign: 'center', // 文本对齐方式
                fill: '#fff', // 文本颜色
              },
            }}
          />
          <Axis name="y" min={0} />
          <Tooltip showTitle={false} crosshairs={false} />
          <Geom
            type="interval"
            position="name*value"
            color={['name', ['#e86767', '#ff6028', '#f6b54e', '#2a8bd5']]}
            shape="triangle"
          />
        </Chart>
      </div>
    );
  }
}

export default Bar;
