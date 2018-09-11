import React, { PureComponent } from 'react';

import styles from './ExSection.less';

export default class ExSection extends PureComponent {
  render() {
    const { title, children = null, style = {}, ...restProps } = this.props;
    const newStyle = {
      padding: '0 15px',
      overflow: 'hidden',
      height: '100%',
      backfaceVisibility: 'hidden',
      boxShadow: '0 0 1.1em rgba(200, 70, 70, 0.9) inset',
      background: 'rgba(9,103,211,0.1)',
      ...style,
    };
    return (
      <div style={newStyle} {...restProps}>
        {title ? (
          <h3 className={styles.title}>
            <span className={styles.dot} />
            {title}
          </h3>
        ) : null}
        {children}
      </div>
    );
  }
}
