import React, { PureComponent } from 'react';
import { Icon } from 'antd';
import classNames from 'classnames';
import moment from 'moment';
import styles from './index.less';

export default class BigPlatformLayout extends PureComponent {
  constructor(props) {
    super(props);
    this.state={
      currentTime: '0000-00-00 星期一 00:00:00',
    }
  }

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
      // 头部样式
      headerStyle,
      // 内容样式
      contentStyle,
      // 标题样式
      titleStyle,
      // 是否显示设置按钮
      settable,
      // 设置按钮样式
      setStyle,
      // 设置按钮点击事件
      onSet,
      // 时间样式
      timeStyle,
      // extra样式
      extraStyle,
    } = this.props;
    const { currentTime } = this.state;
    // 合并以后的容器类名
    const containerClassName = classNames(styles.container, className);

    return (
      <div className={containerClassName} style={style}>
        <div className={styles.header} style={headerStyle}>
          <div className={styles.headerTitle} style={titleStyle}>{autoSpace ? title.split('').join(' ') : title}</div>
          <div className={styles.headerTime}><div className={styles.headerTimeContent} style={timeStyle}>{currentTime}</div></div>
          <div className={styles.headerExtra}>{extra && <div className={styles.headerExtraContent} style={extraStyle}>{extra}</div>}</div>
          {settable && <Icon style={setStyle} className={styles.setButton} type="setting" onClick={onSet} />}
        </div>
        <div className={styles.content} style={contentStyle}>
          {children}
        </div>
      </div>
    );
  }
}
