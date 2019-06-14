import React, { PureComponent } from 'react';
import classNames from 'classnames';
// 引入样式文件
import styles from './index.less';

/**
 * 自定义tabs组件
 */
export default class CustomTabs extends PureComponent {
  FIELDNAMES = {
    key: 'key',
    value: 'value',
  }

  handleClick = (e) => {
    const { onClick } = this.props;
    const key = e.currentTarget.getAttribute('data-key');
    onClick && onClick(key);
  }

  render() {
    const {
      className,
      style,
      data,
      fieldNames,
      activeKey,
    } = this.props;
    const { key, value } = { ...this.FIELDNAMES, ...fieldNames };

    return (
      <div
        className={classNames(styles.tabList, className)}
        style={style}
      >
        {Array.isArray(data) && data.map(({ [key]: k, [value]: v }) => (
          <div
            className={classNames(styles.tab, activeKey === k ? styles.active : undefined)}
            key={k}
            data-key={k}
            onClick={this.handleClick}
          >
            {v}
          </div>
        ))}
      </div>
    );
  }
}
