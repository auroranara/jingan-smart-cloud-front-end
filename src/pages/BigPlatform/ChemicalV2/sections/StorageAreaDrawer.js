import React, { PureComponent, Fragment } from 'react';
import { Row, Col } from 'antd';
import SectionDrawer from '@/pages/BigPlatform/Safety/Company3/components/SectionDrawer';
import moment from 'moment';
// 引入样式文件
import styles from './StorageAreaDrawer.less';

export default class StorageAreaDrawer extends PureComponent {
  state = {};

  render() {
    const { visible, onClose } = this.props;

    return (
      <SectionDrawer
        drawerProps={{
          title: '罐区监测',
          visible,
          onClose,
        }}
      >
        <div className={styles.top}>
          <div>
            <span className={styles.label}>罐区名称：</span>
            溶剂罐区
          </div>
          <div>
            <span className={styles.label}>存储物资：</span>
            甲醛、乙炔、一氧化碳
          </div>
          <div className={styles.video} />
        </div>
      </SectionDrawer>
    );
  }
}
