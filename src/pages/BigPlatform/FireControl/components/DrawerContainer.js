import React, { PureComponent } from 'react';
import Drawer from '';

import styles from './DrawerContainer.less';

export default class DrawerContainer extends PureComponent {
  render() {
    const { title, visible } = this.props;

    return (
      <Drawer
        visible={visible}
        placement="left"
        style={{ backgroundColor: 'transparent', padding: 0, width: 1000 }}
      >
        <div className={styles.container}>
          <h3>
            <span className={styles.rect} />
            {title}
          </h3>
        </div>
      </Drawer>
    );
  }
}
