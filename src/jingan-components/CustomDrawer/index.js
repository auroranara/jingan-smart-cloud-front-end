import React from 'react';
import { Drawer, Icon } from 'antd';
import classNames from 'classnames';
import CustomSection from '@/jingan-components/CustomSection';
// 引入样式文件
import styles from './index.less';

/**
 * 内置Section组件的抽屉
 */
export default function CustomDrawer({
  // 抽屉相关参数
  className,
  title,
  onClose,
  closable,
  // Section相关参数
  sectionProps: {
    className: sectionClassName,
    style: sectionStyle,
    ...sectionProps
  }={},
  children,
  ...drawerProps
}) {
  return (
    <Drawer
      closable={false}
      width="512"
      onClose={onClose}
      className={classNames(styles.container, className)}
      {...drawerProps}
    >
      <CustomSection
        title={title}
        style={{ fontSize: '1em', ...sectionStyle }}
        action={<Icon type="close" className={styles.closeButton} onClick={onClose} />}
        contentClassName={styles.sectionContent}
        {...sectionProps}
      >
        {children}
      </CustomSection>
    </Drawer>
  );
}