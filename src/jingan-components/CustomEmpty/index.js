import React, { Component } from 'react';
import classNames from 'classnames';
import './index.less';

export default class CustomEmpty extends Component {
  render() {
    const {
      className,
      style,
    } = this.props;

    return (
      <div className={classNames("custom-empty-container", className)} style={style}>
        <div className="custom-empty-icon" />
        <div className="custom-empty-label">暂无数据</div>
      </div>
    );
  }
}
