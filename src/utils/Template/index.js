import React, { PureComponent } from 'react';
// 引入样式文件
import styles from './index.less';

/**
 * description: 模板
 * author: sunkai
 * date: 2018年12月13日
 */
export default class Template extends PureComponent {
  // 组件内仓库
  state = {

  }

  /**
   * 挂载后
   */
  componentDidMount() {

  }

  /**
   * 更新后
   */
  componentDidUpdate() {

  }

  /**
   * 销毁前
   */
  componentWillUnmount() {

  }

  /**
   * 渲染
   */
  render() {
    const {
      model,
    } = this.props;

    return (
      <div className={styles.container}>
        123
      </div>
    );
  }
}
