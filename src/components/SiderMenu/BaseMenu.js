import React, { PureComponent } from 'react';
import { Menu, Icon } from 'antd';
import { Link } from 'dva/router';
import pathToRegexp from 'path-to-regexp';
import { urlToList } from '../_utils/pathTools';
import styles from './index.less';

const { SubMenu } = Menu;

// Allow menu.js config icon as string or ReactNode
//   icon: 'setting',
//   icon: 'http://demo.com/icon.png',
//   icon: <Icon type="setting" />,
const getIcon = icon => {
  if (typeof icon === 'string' && icon.indexOf('http') === 0) {
    return <img src={icon} alt="icon" className={styles.icon} />;
  }
  if (typeof icon === 'string') {
    return <Icon type={icon} />;
  }
  return icon;
};

export const getMenuMatches = (flatMenuKeys, path) => {
  return flatMenuKeys.filter(item => {
    return pathToRegexp(item).test(path);
  });
};

export default class BaseMenu extends PureComponent {
  constructor(props) {
    super(props);
    this.flatMenuKeys = this.getFlatMenuKeys(props.menuData);
  }
<<<<<<< HEAD

=======
>>>>>>> init
  /**
   * Recursively flatten the data
   * [{path:string},{path:string}] => {path,path2}
   * @param  menus
   */
  getFlatMenuKeys(menus) {
    let keys = [];
    menus.forEach(item => {
      if (item.children) {
        keys = keys.concat(this.getFlatMenuKeys(item.children));
      }
      keys.push(item.path);
    });
    return keys;
  }
<<<<<<< HEAD

=======
>>>>>>> init
  /**
   * 获得菜单子节点
   * @memberof SiderMenu
   */
  getNavMenuItems = menusData => {
    if (!menusData) {
      return [];
    }
    return menusData
      .filter(item => item.name && !item.hideInMenu)
      .map(item => {
        // make dom
        const ItemDom = this.getSubMenuOrItem(item);
        return this.checkPermissionItem(item.authority, ItemDom);
      })
      .filter(item => item);
  };
<<<<<<< HEAD

=======
>>>>>>> init
  // Get the currently selected menu
  getSelectedMenuKeys = () => {
    const {
      location: { pathname },
    } = this.props;
    return urlToList(pathname).map(itemPath => getMenuMatches(this.flatMenuKeys, itemPath).pop());
  };
<<<<<<< HEAD

=======
>>>>>>> init
  /**
   * get SubMenu or Item
   */
  getSubMenuOrItem = item => {
    if (item.children && item.children.some(child => child.name)) {
      return (
        <SubMenu
          title={
            item.icon ? (
              <span>
                {getIcon(item.icon)}
                <span>{item.name}</span>
              </span>
            ) : (
              item.name
            )
          }
          key={item.path}
        >
          {this.getNavMenuItems(item.children)}
        </SubMenu>
      );
    } else {
      return <Menu.Item key={item.path}>{this.getMenuItemPath(item)}</Menu.Item>;
    }
  };
<<<<<<< HEAD

=======
>>>>>>> init
  /**
   * 判断是否是http链接.返回 Link 或 a
   * Judge whether it is http link.return a or Link
   * @memberof SiderMenu
   */
  getMenuItemPath = item => {
    const itemPath = this.conversionPath(item.path);
    const icon = getIcon(item.icon);
    const { target, name } = item;
    // Is it a http link
    if (/^https?:\/\//.test(itemPath)) {
      return (
        <a href={itemPath} target={target}>
          {icon}
          <span>{name}</span>
        </a>
      );
    }
<<<<<<< HEAD
    const { location, isMobile, onCollapse } = this.props;
=======
>>>>>>> init
    return (
      <Link
        to={itemPath}
        target={target}
<<<<<<< HEAD
        replace={itemPath === location.pathname}
        onClick={
          isMobile
            ? () => {
                onCollapse(true);
=======
        replace={itemPath === this.props.location.pathname}
        onClick={
          this.props.isMobile
            ? () => {
                this.props.onCollapse(true);
>>>>>>> init
              }
            : undefined
        }
      >
        {icon}
        <span>{name}</span>
      </Link>
    );
  };
<<<<<<< HEAD

  // permission to check
  checkPermissionItem = (authority, ItemDom) => {
    const { Authorized } = this.props;
    if (Authorized && Authorized.check) {
      const { check } = Authorized;
=======
  // permission to check
  checkPermissionItem = (authority, ItemDom) => {
    if (this.props.Authorized && this.props.Authorized.check) {
      const { check } = this.props.Authorized;
>>>>>>> init
      return check(authority, ItemDom);
    }
    return ItemDom;
  };
<<<<<<< HEAD

=======
>>>>>>> init
  conversionPath = path => {
    if (path && path.indexOf('http') === 0) {
      return path;
    } else {
      return `/${path || ''}`.replace(/\/+/g, '/');
    }
  };
<<<<<<< HEAD

=======
>>>>>>> init
  render() {
    const { openKeys, theme, mode } = this.props;
    // if pathname can't match, use the nearest parent's key
    let selectedKeys = this.getSelectedMenuKeys();
    if (!selectedKeys.length && openKeys) {
      selectedKeys = [openKeys[openKeys.length - 1]];
    }
    let props = {};
    if (openKeys) {
      props = {
        openKeys,
      };
    }
<<<<<<< HEAD
    const { handleOpenChange, style, menuData } = this.props;
=======
>>>>>>> init
    return (
      <Menu
        key="Menu"
        mode={mode}
        theme={theme}
<<<<<<< HEAD
        onOpenChange={handleOpenChange}
        selectedKeys={selectedKeys}
        style={style}
        {...props}
      >
        {this.getNavMenuItems(menuData)}
=======
        onOpenChange={this.props.handleOpenChange}
        selectedKeys={selectedKeys}
        style={this.props.style}
        {...props}
      >
        {this.getNavMenuItems(this.props.menuData)}
>>>>>>> init
      </Menu>
    );
  }
}
