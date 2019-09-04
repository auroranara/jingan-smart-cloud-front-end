import React, { PureComponent } from 'react';

export default class HostAnime extends PureComponent {

  componentDidMount() {
    this.renderAnime()
    window.addEventListener('resize', () => {
      this.resize()
    },
      { passive: true })
  }

  componentWillUnmount() {
    clearInterval(this.timer)
    window.removeEventListener('resize', this.resize)
  }

  resize = () => {
    if (this.node && this.node.parentNode) {
      this.renderAnime()
    }
  }

  // 渲染动画
  renderAnime = () => {
    if (this.timer) clearInterval(this.timer)
    const canvas = this.node;
    const { offsetWidth, offsetHeight } = canvas.parentNode;
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, width, height);
    const width = offsetWidth, height = offsetHeight
    canvas.width = width
    canvas.height = height

    let inRadius = 15;
    let outRadius = 30
    //创建构造函数Circle
    function Circle(x, y, radius) {
      this.xx = x;//在画布内随机生成x值
      this.yy = y;
      // this.radius = radius;
    };
    Circle.prototype.radiu = function () {
      if (inRadius >= 45) {
        inRadius = 15;
      } else inRadius += 0.5;
      if (outRadius >= 45) {
        outRadius = 15
      } else outRadius += 0.5
    };
    // 绘制线条的方法
    Circle.prototype.paintkong = function (num, radius) {
      context.lineWidth = 2; //线条宽度
      context.strokeStyle = 'rgb(0,186,255)'; //颜色
      context.beginPath();
      context.arc(this.xx, this.yy, radius + num, -Math.PI / 8, Math.PI / 8, false);
      context.stroke();
      context.closePath();
      context.beginPath();
      context.arc(this.xx, this.yy, radius + num, 7 * Math.PI / 8, 9 * Math.PI / 8, false);
      context.stroke();
      context.closePath();
    };
    function createInnerCircle() {
      const newfun = new Circle(width / 2, height / 2, inRadius)
      newfun.paintkong(30, inRadius);
      newfun.radiu();
    }
    function createOuterCircle() {
      const newfun = new Circle(width / 2, height / 2, outRadius)
      newfun.paintkong(30, outRadius);
      newfun.radiu();
    }
    createInnerCircle()
    createOuterCircle()
    const backCanvas = document.createElement('canvas')
    const backCtx = backCanvas.getContext('2d');
    backCanvas.width = width;
    backCanvas.height = height;
    //设置主canvas的绘制透明度
    context.globalAlpha = 0.6;
    backCtx.globalCompositeOperation = 'copy';
    const render = () => {
      //先将主canvas的图像缓存到临时canvas中
      backCtx.drawImage(canvas, 0, 0, width, height);
      //清除主canvas上的图像
      context.clearRect(0, 0, width, height);
      createInnerCircle()
      createOuterCircle()
      //新圆画完后，再把临时canvas的图像绘制回主canvas中
      context.drawImage(backCanvas, 0, 0, width, height);
    };
    this.timer = setInterval(() => {
      render()
    }, 100)
  }

  render() {
    return (
      <canvas style={{ zIndex: -1 }} ref={node => { this.node = node }} />
    )
  }
}
