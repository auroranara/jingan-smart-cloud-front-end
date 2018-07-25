import React, { PureComponent } from 'react';
import { Layout } from 'antd';
import pathToRegexp from 'path-to-regexp';
import { Link } from 'dva/router';
import styles from './index.less';
import BaseMenu, { getMenuMatches } from './BaseMenu';
import { urlToList } from '../_utils/pathTools';

const { Sider } = Layout;

/**
 * 获得菜单子节点
 * @memberof SiderMenu
 */
const getDefaultCollapsedSubMenus = props => {
  const {
    location: { pathname },
    flatMenuKeys,
  } = props;
  // console.log(props);
  return urlToList(pathname)
    .map(item => {
      return getMenuMatches(flatMenuKeys, item)[0];
    })
    .filter(item => item);
};

/**
 * Recursively flatten the data
 * [{path:string},{path:string}] => {path,path2}
 * @param  menu
 */
export const getFlatMenuKeys = menu =>
  menu.reduce((keys, item) => {
    keys.push(item.path);
    if (item.children) {
      return keys.concat(getFlatMenuKeys(item.children));
    }
    return keys;
  }, []);

/**
 * Find all matched menu keys based on paths
 * @param  flatMenuKeys: [/abc, /abc/:id, /abc/:id/info]
 * @param  paths: [/abc, /abc/11, /abc/11/info]
 */
export const getMenuMatchKeys = (flatMenuKeys, paths) =>
  paths.reduce(
    (matchKeys, path) =>
      matchKeys.concat(flatMenuKeys.filter(item => pathToRegexp(item).test(path))),
    []
  );

export default class SiderMenu extends PureComponent {
  constructor(props) {
    super(props);
    // this.flatMenuKeys = getFlatMenuKeys(props.menuData);
    this.state = {
      openKeys: getDefaultCollapsedSubMenus(props),
    };
  }

  static getDerivedStateFromProps(props, state) {
    const { pathname } = state;
    if (props.location.pathname !== pathname) {
      return {
        pathname: props.location.pathname,
        openKeys: getDefaultCollapsedSubMenus(props),
      };
    }
    return null;
  }
  isMainMenu = key => {
    const { menuData } = this.props;
    return menuData.some(item => {
      if (key) {
        return item.key === key || item.path === key;
      }
      return false;
    });
  };
  handleOpenChange = openKeys => {
    const moreThanOne = openKeys.filter(openKey => this.isMainMenu(openKey)).length > 1;
    this.setState({
      openKeys: moreThanOne ? [openKeys.pop()] : [...openKeys],
    });
  };
  render() {
    const { logo, collapsed, onCollapse, fixSiderbar, theme } = this.props;
    // console.log('siderMenu.js', this.props, Date.now());
    const { openKeys } = this.state;
    // 若openKeys为空数组，则更新一下它的值(当然第一次render返回还是空数组，当menuData不为空数组时，更新后为新的值)，若不是空数组即用原来的值
    const defaultProps = collapsed ? {} : { openKeys: openKeys.length ? openKeys : getDefaultCollapsedSubMenus(this.props) };
    return (
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        breakpoint="lg"
        onCollapse={onCollapse}
        width={256}
        className={`${styles.sider} ${fixSiderbar ? styles.fixSiderbar : ''} ${
          theme === 'light' ? styles.light : ''
        }`}
      >
        <div className={styles.logo} key="logo" id="logo">
          <Link to="/">
            <img src={logo} alt="logo" />
            <h1> 晶安智慧云 </h1>
          </Link>
        </div>
        <BaseMenu
          {...this.props}
          key="Menu"
          mode="inline"
          handleOpenChange={this.handleOpenChange}
          onOpenChange={this.handleOpenChange}
          style={{ padding: '16px 0', width: '100%' }}
          {...defaultProps}
        />
      </Sider>
    );
  }
}
