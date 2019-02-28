//此组件用于在body内渲染弹层
import React, { Component } from 'react';
import ReactDom from 'react-dom';

function setStyle(obj, styles) {
  for (const key in styles) {
    if (styles.hasOwnProperty(key)) {
      const style = styles[key];
      obj.style[key] = style;
    }
  }
}
export default class RenderInPopup extends Component {
  // constructor(props) {
  //   super(props);
  // }
  componentDidMount() {
    const { popupContainer = document.querySelector('body'), className, dragHandle, draggable } = this.props;
    this.popup = document.createElement('div');
    this.rootDom = popupContainer;
    this.rootDom.appendChild(this.popup);
    this.popup.setAttribute('class', className);
    this.popup.setAttribute('className', className);
    this.popup.setAttribute('id', 'videoPlay');
    setStyle(this.popup, this.props);
    this._renderLayer();
    if(!draggable) return;
    const oDiv = this.popup;
    /*鼠标点击的位置距离DIV左边的距离 */
    let disX = 0;
    /*鼠标点击的位置距离DIV顶部的距离*/
    let disY = 0;
    oDiv.onmousedown = function(event) {
      const handle = document.querySelector(dragHandle);
      console.log('handleoffsetLeft',handle.offsetLeft);
      console.log('handleoffsetTop',handle.offsetTop);
      console.log('event',event);
      let ifHandle = false;
      event.path.forEach(element => {
        if(element === handle) ifHandle = true;
      });
      if(!ifHandle) return null;
      // const event = e || window.event;
      disX = event.clientX - oDiv.offsetLeft;
      disY = event.clientY - oDiv.offsetTop;
      event.preventDefault();
      event.stopPropagation();
      document.onmousemove = function(e) {
        // 横轴坐标
        const leftX = e.clientX - disX + oDiv.offsetWidth / 2;
        // 纵轴坐标
        const topY = e.clientY - disY + oDiv.offsetHeight / 2;
        oDiv.style.left = leftX + 'px';
        oDiv.style.top = topY + 'px';
        e.preventDefault();
        e.stopPropagation();
      };
      document.onmouseup = function() {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    };
  }
  componentDidUpdate() {
    this._renderLayer();
  }
  componentWillUnmount() {
    this.rootDom.removeChild(this.popup);
  }
  _renderLayer() {
    ReactDom.render(this.props.children, this.popup);
  }
  render() {
    return null;
  }
}
