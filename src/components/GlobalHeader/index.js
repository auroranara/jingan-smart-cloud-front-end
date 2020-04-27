import React, { PureComponent } from 'react';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import { Dropdown, Menu } from 'antd';
import Link from 'umi/link';
import Debounce from 'lodash-decorators/debounce';
import styles from './index.less';
import RightContent from './RightContent';
import router from 'umi/router';
// 在zh-CN.js文件中找到对应文案
import { formatMessage } from 'umi/locale';

export default class GlobalHeader extends PureComponent {
  constructor(props) {
    super(props)
    this.menuBigPlatformDom = null; // 驾驶舱下拉容器dom
  }
  componentWillUnmount() {
    this.triggerResizeEvent.cancel();
  }
  /* eslint-disable*/
  @Debounce(600)
  triggerResizeEvent() {
    // eslint-disable-line
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }
  toggle = () => {
    const { collapsed, onCollapse } = this.props;
    onCollapse(!collapsed);
    this.triggerResizeEvent();
  };
  render() {
    const { collapsed, isMobile, logo, menuBigPlatform, clickBigPlatformMenu } = this.props;
    const menu = (
      <Menu selectedKeys={[]} onClick={clickBigPlatformMenu}>
        {menuBigPlatform && menuBigPlatform.length ? menuBigPlatform.map(item => (
          <Menu.Item key={item.name}>{formatMessage({ id: item.locale })}</Menu.Item>
        )) : null}
      </Menu>
    );
    const dropdown = menuBigPlatform && menuBigPlatform.length ? (
      <div className={styles.menuItem} ref={ref => { this.menuBigPlatformDom = ref }}>
        <Dropdown overlay={menu} getPopupContainer={() => this.menuBigPlatformDom}>
          <span>驾驶舱</span>
        </Dropdown>
      </div>
    ) : null;
    return (
      <div className={styles.header}>
        {isMobile && (
          <Link to="/" className={styles.logo} key="logo">
            <img src={logo} alt="logo" width="32" />
          </Link>
        )}
        <LegacyIcon
          className={styles.trigger}
          type={collapsed ? 'menu-unfold' : 'menu-fold'}
          onClick={this.toggle}
        />
        {/* <div className={styles.menuItem}><span onClick={() => router.push('/company-workbench/view')}>工作台</span></div> */}
        <div className={styles.menuItem}><span onClick={() => router.push('/role-authorization/account-management')}>工作台</span></div>
        <div className={styles.menuItem}><span onClick={() => router.push('/menu-reveal')}>系统菜单</span></div>
        {dropdown}
        <RightContent {...this.props} />
      </div>
    );
  }
}
