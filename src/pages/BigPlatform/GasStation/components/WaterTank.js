import React, { PureComponent } from 'react';

import { waveBlue, waveRed } from '../imgs/links';

const RED = 'rgb(248,51,41)';
const BLUE = 'rgb(24,141,255)';
const WHITE = 'white';
const SPLIT_WIDTH = 10;
const SPLIT_NUM = 5;

const IMG_WIDTH = 309;
const IMG_HEIGHT = 378;

export default class WaterTank extends PureComponent {
  componentDidMount() {
    const canvas = this.canvas;
    this.ctx = canvas.getContext('2d');
    const imgs = this.imgs = [waveBlue, waveRed].map(src => {
      const img = new Image();
      img.src = src;
      return img;
    });
    imgs[0].onload = e => {
      this.draw();
    };
  }

  componentDidUpdate() {
    this.draw();
  }

  ctx = null;
  imgs = null;
  canvas = null;

  draw() {
    const { width, height } = this.props;
    this.ctx.clearRect(0, 0, width, height);
    this.drawWave();
    this.drawRect();
    this.drawSplits();
    this.drawAxis();
    this.drawTriangle();
    this.drawLimitLine();
  }

  drawWave() {
    const { dy=0, value, size: [w, h], range } = this.props;
    const ctx = this.ctx;
    const percent = value / range;
    const targetWidth = Math.floor(h * percent);
    ctx.drawImage(this.imgs[+this.isAlarm()], 0, 0, IMG_WIDTH, Math.floor(IMG_HEIGHT * percent), 0, h - targetWidth + dy, w, targetWidth);
  }

  drawRect() {
    const ctx = this.ctx;
    const { dy=0, size: [w, h] } = this.props;

    ctx.beginPath();
    ctx.strokeStyle = 'grey';
    ctx.strokeRect(0, dy, w, h);
  }

  drawSplits() {
    const { dy=0, size: [w, h] } = this.props;

    const ctx = this.ctx;
    const start = [w, h + dy];
    const end = [w, dy];
    const interval = (start[1] - end[1]) / SPLIT_NUM;
    const origin = [...start];

    ctx.beginPath();
    ctx.strokeStyle = WHITE;
    ctx.fillStyle = WHITE;
    for (let i = 0; i <= SPLIT_NUM; i++) {
      const [x, y] = origin;
      const target = [x - SPLIT_WIDTH, y];
      const originHalf = [x, y - interval / 2];
      const targetHalf = [x - SPLIT_WIDTH * 0.7, y - interval / 2];
      const text = [target[0] - 8, target[1] + (i ? 4 : 0)];
      ctx.moveTo(...origin);
      ctx.lineTo(...target);
      ctx.fillText(i, ...text);
      if (i !== SPLIT_NUM) {
        ctx.moveTo(...originHalf);
        ctx.lineTo(...targetHalf);
      }
      origin[1] = Math.floor(origin[1] - interval);
    }
    ctx.stroke();
  }

  drawAxis() {
    const { dy=0, size: [w, h], limits, range } = this.props;
    const ctx = this.ctx;
    const point1 = [w, h * (1 - limits[0] / range) + dy];
    const point2 = [w, h * (1 - limits[1] / range) + dy];

    ctx.save()
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(w, h + dy);
    ctx.strokeStyle = RED;
    ctx.lineTo(...point1);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(...point1)
    ctx.strokeStyle = BLUE;
    ctx.lineTo(...point2);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(...point2);
    ctx.strokeStyle = RED;
    ctx.lineTo(w, dy);
    ctx.stroke();

    ctx.font = '14px microsoft yahei';
    ctx.fillText('m', w + 10, dy);
    ctx.restore();
  }

  drawTriangle() {
    const { dy=0, value, size: [w, h], range } = this.props;

    const ctx = this.ctx;
    const target = [w, Math.floor(h * (1 - value / range)) + dy];
    const [x, y] = [target[0] + 5, target[1]];
    const th = 10;
    const a = th * 1.414 / 2;
    const up = [x + th, y - a];
    const down = [x + th, y + a];
    const color = this.isAlarm() ? RED : BLUE;

    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = ctx.fillStyle = color;
    ctx.moveTo(x, y);
    ctx.lineTo(...up);
    ctx.lineTo(...down);
    ctx.closePath();
    ctx.fill();
    ctx.font = '14px microsoft yahei';
    ctx.fillText(`${value}m`, target[0] + 25, target[1] + 10);
    ctx.fillStyle = WHITE;
    ctx.font = '12px microsoft yahei';
    ctx.fillText('当前水位', target[0] + 25, target[1] - 8);
    ctx.restore();
  }

  drawLimitLine() {
    const { dy=0, size: [w, h], limits, range } = this.props;
    const ctx = this.ctx;
    ctx.save();
    ctx.beginPath();
    ctx.setLineDash([4, 2]);
    ctx.strokeStyle = RED;
    limits.forEach((lmt, i) => {
      if (!lmt || i && lmt === range)
        return;
      const y = h * (1 - lmt / range) + dy;
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
    });
    ctx.stroke();
    ctx.restore();
  }

  isAlarm() {
    const { value, limits } = this.props;
    if (value < limits[0] || value > limits[1])
      return true;
    return false;
  }

  render() {
    const { width=400, height=200, className } = this.props;
    return (
      <canvas
        width={width}
        height={height}
        ref={node => this.canvas = node}
        className={className}
      />
    );
  }
}
