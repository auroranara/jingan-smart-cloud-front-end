import React, { Component } from 'react';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import classNames from 'classnames';
import moment from 'moment';
import './index.less';

const c = n => `big-platform-${n}`;

// 大屏容器
export default class BigPlatformLayout extends Component {
  state = {
    currentTime: '',
  };

  componentDidMount() {
    this.myTimer = setInterval(() => {
      this.setCurrentTime();
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.myTimer);
  }

  /**
   * 设置当前时间
   */
  setCurrentTime = () => {
    this.setState({ currentTime: moment().locale('zh-cn').format('YYYY-MM-DD dddd HH:mm:ss') });
  }

  render() {
    const {
      // 布局容器的类名
      className,
      // 布局容器的style
      style,
      // 标题
      title=global.PROJECT_CONFIG.projectName,
      // 标题是否添加空格
      autoSpace=true,
      // 头部左边的内容，如企业名称或选择框等
      extra,
      // 子节点
      children,
      // 是否显示设置按钮
      settable,
      // 设置按钮点击事件
      onSet,
    } = this.props;
    const { currentTime } = this.state;
    // 合并以后的容器类名
    const containerClassName = classNames(c('container'), className);

    return (
      <div className={containerClassName} style={style}>
        <div className={c('header')}>
          <div className={c('title')}>{autoSpace ? title.split('').join(' ') : title}</div>
          <div className={c('time-wrapper')}><div className={c('time')}>{currentTime}</div></div>
          {extra && <div className={c('extra-wrapper')}><div className={c('extra')}>{extra}</div></div>}
          {settable && <LegacyIcon className={c('set-button')} type="setting" onClick={onSet} />}
        </div>
        <div className={c('content')}>
          {children}
        </div>
      </div>
    );
  }
}
