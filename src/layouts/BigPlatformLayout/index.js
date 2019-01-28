import React, { PureComponent } from 'react';
import { Icon } from 'antd';
import classNames from 'classnames';
import moment from 'moment';
import styles from './index.less';
import headerBg from '@/assets/header_bg.png';

const { projectName } = global.PROJECT_CONFIG;
export default class App extends PureComponent {
  state={
    currentTime: '0000-00-00 星期一 00:00:00',
  }

  componentDidMount() {
    this.myTimer = setInterval(() => {
      this.getCurrentTime();
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.myTimer);
  }

  /**
   * 获取当前时间
   */
  getCurrentTime = () => {
    this.setState({ currentTime: moment().locale('zh-cn').format('YYYY-MM-DD dddd HH:mm:ss') });
  }

  render() {
    const {
      // 布局容器的类名
      className,
      // 布局容器的style
      style,
      // 标题
      title=projectName,
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
      // 时间样式
      timeStyle,
      // extra样式
      extraStyle,
      // 设置按钮点击事件
      onSet,
    } = this.props;
    const { currentTime } = this.state;
    // 合并以后的容器类名
    const containerClassName = classNames(styles.container, className);

    return (
      <div className={containerClassName} style={{ backgroundImage: `url(http://data.jingan-china.cn/v2/big-platform/fire-control/gov/new_bg.png)`, ...style}}>
        <div className={styles.header} style={{ backgroundImage: `url(${headerBg})`, ...headerStyle }}>
          <div className={styles.headerTitle} style={titleStyle}>{autoSpace ? title.split('').join(' ') : title}</div>
          <div className={styles.headerTime} style={timeStyle}>{currentTime}</div>
          {extra && <div className={styles.headerExtra} style={extraStyle}>{extra}</div>}
          {settable && <Icon style={setStyle} className={styles.setButton} type="setting" onClick={onSet} />}
        </div>
        <div className={styles.content} style={contentStyle}>
          {children}
        </div>
      </div>
    );
  }
}
