import React, { PureComponent } from 'react';

import { waveBlue, waveRed } from '../imgs/links';

export default class WaterTank extends PureComponent {
  componentDidMount() {
    const img = this.img = new Image();
    img.src = waveRed;
    const canvas = this.canvas;
    const ctx = canvas.getContext('2d');
    img.onload = e => {
      this.drawWave(ctx);
      this.drawRect(ctx);
      this.drawSplits(ctx, [90, 0], [90, 150]);
      this.drawTriangle(ctx, [105, 100]);
    };
  }

  drawRect(ctx) {
    ctx.strokeRect(0, 0, 100, 150);
  }

  drawSplits(ctx, start, end, width=10, interval=15) {
    const origin = { x: start[0], y: start[1] };
    let index = 10;
    while(origin.y <= end[1]) {
      const target = { x: origin.x + width, y: origin.y };
      ctx.moveTo(origin.x, origin.y);
      ctx.lineTo(target.x, target.y);
      ctx.fillText(index, origin.x - 12, origin.y + 5);
      origin.y += interval;
      index--;
    }
    ctx.stroke();
  }

  drawWave(ctx) {
    ctx.drawImage(this.img, 0, 0, 309, 126, 0, 100, 100, 50);
  }

  drawTriangle(ctx, target) {
    const [x, y] = target;
    const h = 10;
    const a = h * 1.414 / 2;
    const up = [x + h, y - a];
    const down = [x + h, y + a];
    ctx.moveTo(x, y);
    ctx.lineTo(...up);
    ctx.lineTo(...down);
    ctx.lineTo(x, y);
    ctx.fill();
  }

  render() {
    const { width='400', height='200' } = this.props;
    return <canvas width={width} height={height} ref={node => this.canvas = node} />;
  }
}
