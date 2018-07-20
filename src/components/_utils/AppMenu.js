import React from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import styles from '../../index.less';

import config from '../../../config/config';
// import codeMap from './codeMap';

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
  const menuData = [];
  for (let m of MenuData) {
    const { path, children } = m;
    // console.log('m', m, 'code', codeMap[path], menus.includes(codeMap[path]));
    const menu = { ...m };
    if (path !== '/' && !menus.includes(codeMap[path]))
      continue;

    if (children)
      menu.children = filterMenus(children, menus);

    menuData.push(menu);
  }

  return menuData;
}

function getCodeMap(menuData, result) {
  for (let m of menuData) {
    const { path, code, locale, children } = m;

    if (path === '/' || result[path])
      continue;

    if (code) {
      result[path] = code;
      result[code] = path;
    } else if(locale) {
      // locle = 'menu.fuck.me',去掉 'menu.'
      const loc = locale.slice(5);
      result[path] = loc;
      result[loc] = path;
    }

    if (children)
      getCodeMap(children, result);
  }
}

function generateAuthFn(menus) {
  return path => () => {
    if (path.toLowerCase().includes('exception'))
      return true;
    return menus.includes(codeMap[path]);
  };
}

const menuData = config['routes'];
const MenuData = formatter(menuData[1].routes);
let codeMap = {};
getCodeMap(MenuData, codeMap)

// console.log('codeMap', codeMap);

// codeMap的键值数组，即所有路径及code
const pathArray = Object.keys(codeMap);
export { codeMap, pathArray };

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
      if (!this.menuHandled && menus.length) {
        this.menuHandled = true;
        this.menuData = filterMenus(MenuData, menus);
      }

      const menuHandled = this.menuHandled;
      const menuData = this.menuData;

      // console.log(menuData);

      if (!menuHandled) {
        return <Spin size="large" className={styles.globalSpin} />;
      } else {
        return <WrappedComponent {...rest} menuData={menuData} authorityFn={generateAuthFn(menus)} />;
      }
    }
  }

  return AppMenuInner;
};
