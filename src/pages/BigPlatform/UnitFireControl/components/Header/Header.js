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
    title: PropTypes.string.isRequired,
    extraContent: PropTypes.string,
  }

  /**
   * props默认值
   */
  static defaultProps = {
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
    const { title, style, className, extraContent } = this.props;

    return (
      <div className={`${styles.header} ${className}`} style={style}>
        <div className={styles.headerTitle}>{title.split('').join(' ')}</div>
        <div className={styles.headerTime}><CurrentTime /></div>
        {extraContent && <div className={styles.extraContent}>{extraContent}</div>}
      </div>
    );
  }
}
