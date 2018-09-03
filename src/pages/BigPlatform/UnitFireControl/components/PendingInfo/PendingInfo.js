import React, { PureComponent } from 'react';
import styles from './PendingInfo.less';

/**
 * 待处理列表项
 */
const PendingItem = ({ id, type }) => {
  return (
    <div key={id} className={styles.pendingItem}>

    </div>
  );
};

/**
 * 待处理信息
 */
export default class App extends PureComponent {
  /**
   * 组件内部状态
   */
  state = {

  }

  /**
   * 挂载后声明周期函数
   */
  componentDidMount() {

  }

  /**
   * 渲染函数
   */
  render() {
    // 从props中获取列表数据
    const {  } = this.props;

    return (
      <div className={styles.container}>
        123
      </div>
    );
  }
}
