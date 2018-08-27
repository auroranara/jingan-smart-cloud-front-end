import React, { PureComponent } from 'react';
import { Icon } from 'antd';

import styles from './FcSection.less';

export default class FcSection extends PureComponent {
  render() {
    const { title, backTitle, handleRotate=null, children=null, style={}, isBack=false, ...restProps } = this.props;
    const newStyle = {
      padding: '0 15px',
      overflow: 'hidden',
      height: '100%',
      backfaceVisibility: 'hidden',
      boxShadow: '0 0 1.1em rgba(9, 103, 211, 0.9) inset',
      background: 'rgba(9,103,211,0.1)',
      transform: isBack ? 'rotateY(180deg)' : 'translateY(-100%)',
      ...style,
    }

    return (
      <div style={newStyle} {...restProps}>
        {title
          ? (
            <h3 className={styles.title}>
              <span className={styles.dot}></span>
              {title}
              {backTitle && <span className={styles.back} onClick={handleRotate}>{backTitle}<Icon type="double-right" style={{ marginLeft: 3 }} /></span>}
            </h3>
          ) : null}
         {children}
      </div>
    );
  }
}
