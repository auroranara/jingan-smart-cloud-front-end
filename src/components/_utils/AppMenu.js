import React from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import styles from '../../index.less';

import config from '../../../config/config';
import codeMap from './codeMap';

const originMenuData = config['routes'];

function formatter(data, parentPath = '', parentAuthority, parentName) {
  return data.map(item => {
    let locale = 'menu';
    if (parentName && item.name) {
      locale = `${parentName}.${item.name}`;
    } else if (item.name) {
      locale = `menu.${item.name}`;
    } else if (parentName) {
      locale = parentName;
    }
    const result = {
      ...item,
      locale,
      authority: item.authority || parentAuthority,
    };
    if (item.routes) {
      const children = formatter(item.routes, `${parentPath}${item.path}/`, item.authority, locale);
      // Reduce memory usage
      result.children = children;
    }
    delete result.routes;
    return result;
  });
}

function filterMenus(MenuData, menus) {
  return [];
}

function handleMenus(menuData, menus) {
  const MenuData = formatter(menuData[1].routes);
  return filterMenus(MenuData, menus);
}

export default function AppMenu(WrappedComponent) {
  @connect(({ global }) => ({ global }))
  class AppMenuInner extends React.Component {
    componentDidMount() {
      const { global: { menus } } = this.props;
      if (!menus.length) {
        this.props.dispatch({ type: 'global/fetchMenus' });
      }
    }

    menuHandled = false;
    menuData = [];

    render() {
      const { global: { menus }, ...rest } = this.props;
      if (!this.menuHandled) {
        this.menuHandled = true;
        this.menuData = handleMenus(originMenuData, menus);
      }

      const menuHandled = this.menuHandled;
      const menuData = this.menuData;

      if (menuHandled) {
        return <Spin size="large" className={styles.globalSpin} />;
      } else {
        return <WrappedComponent {...rest} menuData={menuData} />;
      }
    }
  }

  return AppMenuInner;
};
