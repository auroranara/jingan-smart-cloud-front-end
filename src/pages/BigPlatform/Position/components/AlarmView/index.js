import React, { PureComponent } from 'react';
import Section from '@/pages/BigPlatform/NewUnitFireControl/Section';
// 引入样式文件
import styles from './index.less';

/**
 * description: 报警查看
 * author: sunkai
 * date: 2018年12月26日
 */
export default class AlarmView extends PureComponent {
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
      // 容器类名
      className,
      // 容器样式
      style,
      model,
    } = this.props;

    return (
      <Section
        className={className?`${styles.container} ${className}`:styles.container}
        style={style}
        title="报警查看"
      >
        123
      </Section>
    );
  }
}
