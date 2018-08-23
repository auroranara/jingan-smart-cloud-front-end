import React, { PureComponent } from 'react';

import styles from './FcSection.less';

// const bgColor = '#0FF';
// const borderColor = '#0FF';

const boxShadow = '0 0 1.1em rgba(9, 103, 211, 0.9) inset';

export default class FcSection extends PureComponent {
  render() {
    const { title, children = null, style = {}, isBack=false, ...restProps } = this.props;
    const newStyle = {
      padding: '0 15px',
      overflow: 'hidden',
      height: '100%',
      backfaceVisibility: 'hidden',
      boxShadow,
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
            </h3>
          ) : null}
         {children}
      </div>
    );
  }
}
