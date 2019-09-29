import React, { Component } from 'react';
import { Icon, Tooltip } from 'antd';
import classNames from 'classnames';
import styles from './index.less';

/**
 * 缩略图
 */
export default class CustomThumbnail extends Component {
  render() {
    const {
      // 高除以宽得到的百分比
      ratio='75%',
      urls=[],
      pageSize=4,
      index,
      onChange,
    } = this.props;
    // 是否是第一个
    const isFirst = index <= 0;
    // 是否是最后一个
    const isLast = index >= urls.length - 1;
    let left;
    if (urls.length <= pageSize || index < pageSize / 2) {
      left = 0;
    } else if (index >= urls.length - pageSize / 2 - 1) {
      left = urls.length - pageSize;
    } else {
      left = index - 1;
    }

    return (
      <div className={styles.container}>
        <Tooltip title={isFirst ? '没有上一张' : '上一张'}>
          <Icon
            type="left"
            className={classNames(styles.leftArrow, isFirst ? styles.disable : styles.enable)}
            onClick={isFirst ? undefined : () => onChange(index - 1)}
          />
        </Tooltip>
        <div className={styles.wrapper}>
          <div className={styles.list} style={{ width: `${urls.length / pageSize * 100}%`, left: `${left * 1 / urls.length * -100}%` }}>
            {urls.map(({ id, webUrl }, i) => {
              const isSelected = index === i;
              return (
                <div key={id || i} className={styles.itemWrapper} style={{ width: `${1 / urls.length * 100}%` }}>
                  <div
                    className={styles.item}
                    style={{
                      paddingBottom: ratio,
                      backgroundImage: `url(${webUrl})`,
                      borderColor: isSelected ? '#0967D3' : undefined,
                      cursor: isSelected ? 'auto' : undefined,
                    }}
                    onClick={isSelected ? undefined : () => onChange(i)}
                  />
                </div>
              );
            })}
          </div>
        </div>
        <Tooltip title={isLast ? '没有下一张' : '下一张'}>
          <Icon
            type="right"
            className={classNames(styles.rightArrow, isLast ? styles.disable : styles.enable)}
            onClick={isLast ? undefined : () => onChange(index + 1)}
          />
        </Tooltip>
      </div>
    );
  }
}
