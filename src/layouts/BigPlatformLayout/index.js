import React, { PureComponent } from 'react';
import classNames from 'classnames';
import moment from 'moment';
import styles from './index.less';

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
      // 时间和extra到两边的距离
      gutter=24,
    } = this.props;
    const { currentTime } = this.state;
    // 合并以后的容器类名
    const containerClassName = classNames(styles.container, className);

    return (
      <div className={containerClassName} style={style}>
        <div className={styles.header}>
          <div className={styles.headerTitle}>{autoSpace ? title.split('').join(' ') : title}</div>
          <div className={styles.headerTime} style={{ paddingRight: gutter }}>{currentTime}</div>
          {extra && <div className={styles.headerExtra} style={{ paddingLeft: gutter }}>{extra}</div>}
        </div>
        <div className={styles.content}>
          {children}
        </div>
      </div>
    );
  }
}
