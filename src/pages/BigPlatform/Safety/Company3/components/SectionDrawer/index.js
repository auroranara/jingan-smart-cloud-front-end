import React from 'react';
import { Drawer, Icon } from 'antd';
import classNames from 'classnames';
import Section from '../Section';
// 引入样式文件
import styles from './index.less';

/**
 * 内置Section组件的抽屉
 */
export default function SectionDrawer({
  // 抽屉相关参数
  drawerProps: {
    className,
    title,
    onClose,
    ...drawerProps
  }={},
  // Section相关参数
  sectionProps={},
  children,
}) {
  return (
    <Drawer
      closable={false}
      width="512"
      onClose={onClose}
      className={classNames(styles.container, className)}
      {...drawerProps}
    >
      <Section
        title={title}
        action={<Icon type="close" className={styles.closeButton} onClick={onClose} />}
        className={styles.sectionContainer}
        contentClassName={styles.sectionContent}
        {...sectionProps}
      >
        {children}
      </Section>
    </Drawer>
  );
}
