import React, { PureComponent } from 'react';
import { Icon } from 'antd';

import styles from './FcSection.less';
import titleBg from '../img/title_bg.png';
import titleDot from '../img/title_dot.png';

export default class FcSection extends PureComponent {
  render() {
    const {
      title,
      backTitle,
      handleBack = null,
      children = null,
      style = {},
      isBack = false,
      ...restProps
    } = this.props;
    const newStyle = {
      padding: '0 15px',
      overflow: 'hidden',
      height: '100%',
      backfaceVisibility: 'hidden',
      WebkitBackfaceVisibility: 'hidden',
      // boxShadow: '0 0 1.1em rgba(9, 103, 211, 0.9) inset',
      // background: 'rgba(9,103,211,0.1)',
      boxShadow: 'rgba(0, 0, 0, 0.6) 5px 5px 10px',
      background: 'rgb(3,48,105)',
      border: '1px solid rgb(2,252,250)',
      transform: isBack ? 'rotateY(180deg)' : 'translateY(-100%)',
      ...style,
    };

    return (
      <div style={newStyle} {...restProps}>
        {title ? (
          // <h3 className={styles.title}>
          //   <span className={styles.dot} />
          <h3
            className={styles.title}
            style={{ backgroundImage: `url(${titleBg})` }}
          >
            <span
              className={styles.dot}
              style={{ backgroundImage: `url(${titleDot})` }}
            />
            {title}
            {backTitle && (
              <span className={styles.back} onClick={handleBack}>
                {backTitle}
                <Icon type="double-right" style={{ marginLeft: 3 }} />
              </span>
            )}
          </h3>
        ) : null}
        {children}
      </div>
    );
  }
}
