import React, { PureComponent } from 'react';
import { Icon } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import debounce from 'lodash-decorators/debounce';
import { isArray } from '@/utils/utils';
// 引入样式文件
import styles from './index.less';

/**
 * description: 自定义滚动容器
 * author: sunkai
 * date: 2019年01月04日
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
   * 修改滚动条颜色
   */
  renderThumb({ style, ...props }) {
    const thumbStyle = {
      backgroundColor: `rgba(9, 103, 211, 0.5)`,
      borderRadius: '10px',
    };
    return (
      <div
        style={{ ...style, ...thumbStyle }}
        {...props}
      />
    );
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
      // 是否开启自动滚动
      autoScroll,

    } = this.props;

    return (
      <div className={`${styles.container} ${className}`} style={style}>
        <Scrollbars style={{ flex: '1' }} renderThumbHorizontal={this.renderThumb} renderThumbVertical={this.renderThumb}>
        </Scrollbars>
      </div>
    );
  }
}
