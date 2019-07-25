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
      // 如果title里用的是margin，需要加上，现在用的是padding，无需加上，并且加了之后，在多层滚动时，会有一像素偏差的问题，会覆盖里面的上面或下面的border
      // 为了兼容旧代码还是保留，但在多层滚动中将其覆盖掉了
      overflow: 'hidden',
      height: '100%',
      backfaceVisibility: 'hidden',
      WebkitBackfaceVisibility: 'hidden',
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
          <h3 className={styles.title} style={{ backgroundImage: `url(${titleBg})` }}>
            <span className={styles.dot} style={{ backgroundImage: `url(${titleDot})` }} />
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
