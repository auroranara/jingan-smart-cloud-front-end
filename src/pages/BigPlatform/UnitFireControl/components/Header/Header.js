import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import CurrentTime from '../../../Safety/Components/Timer';
import styles from './Header.less';

/**
 * 大屏头部
 */
export default class App extends PureComponent {
  /**
   * props类型检测
   */
  static propTypes = {
    title: PropTypes.string,
    extraContent: PropTypes.string,
  }

  /**
   * props默认值
   */
  static defaultProps = {
    title: '',
    extraContent: '',
  }

  // /**
  //  * 组件挂载后
  //  */
  // componentDidMount() {

  // }

  // /**
  //  * 组件销毁前
  //  */
  // componentWillUnmount() {

  // }

  /**
   * 渲染函数
   */
  render() {
    // 从props中获取标题
    const { title, extraContent, style, className } = this.props;
    const headerClassName = className ? `${styles.header} ${className}` : styles.header;

    return (
      <div className={headerClassName} style={style}>
        <div className={styles.headerTitle}>{title.split('').join(' ')}</div>
        <div className={styles.headerTime}><CurrentTime /></div>
        {extraContent && <div className={styles.extraContent}>{extraContent}</div>}
      </div>
    );
  }
}
