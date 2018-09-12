import React, { PureComponent } from 'react';
// import { Icon } from 'antd';

import styles from './SectionWrapper.less';

class SectionWrapper extends PureComponent {
  render() {
    const { title, children = null, style = {} } = this.props;

    return (
      <div className={styles.sectionWrapper} style={style}>
        <div className={styles.sectionWrapperIn}>
          {title ? (
            <div className={styles.sectionTitle}>
              <span className={styles.titleBlock} />
              {title}
            </div>
          ) : null}
          <div className={styles.sectionMain}>{children}</div>
        </div>
      </div>
    );
  }
}
export default SectionWrapper;
