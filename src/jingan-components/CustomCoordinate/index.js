import React, { Component } from 'react';
import { Modal } from 'antd';
import CustomThumbnail from '@/jingan-components/CustomThumbnail';
import styles from './index.less';

// 定位
export default class CustomCoordinate extends Component {
  /**
   * 显示坐标点
   */
  handleClick = e => {
    const { onClick } = this.props;
    const { clientX, clientY } = e;
    const { left, top, width, height } = e.target.getBoundingClientRect();
    onClick && onClick({
      xNum: (clientX - left) / width,
      yNum: (clientY - top) / height,
    });
  };

  render() {
    const {
      // 图片地址
      urls,
      position,
      onClick,
      onChange,
      ratio='75%',
      index,
      pageSize,
      disabled,
      footer,
      ...restProps
    } = this.props;

    return (
      urls.length > 0 && (
        <Modal
          centered
          {...restProps}
          footer={disabled ? null: footer}
        >
          <div
            className={styles.pictureWrapper}
            style={{
              paddingBottom: ratio,
              marginBottom: disabled ? 0 : undefined,
            }}
          >
            <div
              className={styles.picture}
              style={{
                backgroundImage: `url(${urls[index].webUrl})`,
                cursor: disabled ? 'auto' : undefined,
              }}
              onClick={disabled ? undefined : this.handleClick}
            />
            {position && position.xNum && position.yNum && (
              <div
                className={styles.point}
                style={{
                  left: `${position.xNum * 100}%`,
                  top: `${position.yNum * 100}%`,
                }}
              />
            )}
          </div>
          {!disabled && (
            <CustomThumbnail
              ratio={ratio}
              urls={urls}
              onChange={onChange}
              index={index}
              pageSize={pageSize}
            />
          )}
        </Modal>
      )
    );
  }
}
