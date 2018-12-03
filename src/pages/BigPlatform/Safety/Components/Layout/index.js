import React, { PureComponent } from 'react';
import classnames from 'classnames';
import moment from 'moment';
import styles from './index.less';

// 项目名称
const { projectName } = global.PROJECT_CONFIG;

/**
 * description: 企业安全大屏布局
 * author: sunkai
 * date: 2018年11月30日
 */
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
      // 时间容器样式
      timeStyle,
      // 额外容器样式
      extraStyle,
      // 子节点
      children,
    } = this.props;
    const { currentTime } = this.state;
    // 合并以后的容器类名
    const containerClassName = classnames(styles.container, className);

    return (
      <div className={containerClassName} style={{ backgroundImage: `url(http://data.jingan-china.cn/v2/big-platform/fire-control/gov/new_bg.png)`, ...style}}>
        <div className={styles.header} style={{ backgroundImage: `url(http://data.jingan-china.cn/v2/big-platform/safety/com/title12.png)` }}>
          <div className={styles.headerTitle}>{autoSpace ? title.split('').join(' ') : title}</div>
          <div className={styles.headerTime} style={timeStyle}>{currentTime}</div>
          {extra && <div className={styles.headerExtra} style={extraStyle}>{extra}</div>}
        </div>
        <div className={styles.content}>
          {children}
        </div>
      </div>
    );
  }
}
