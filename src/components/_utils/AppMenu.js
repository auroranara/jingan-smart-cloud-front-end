import React from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import styles from '../../index.less';

import pathToRegexp from 'path-to-regexp';
import config from '../../../config/config';
// import codeMap from './codeMap';

// 将router.config.js配置转化成路由，源码中的函数，并未改动
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

// 将menus数组中不存在的路径过滤掉，使其再菜单中不显示
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

// 根据formatter之后的路由来生成一个path -> code, code -> path的映射对象
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

// 高阶函数，最后的返回值是个函数，来判断当前路径是否在menus中，即当前用户是否有访问权限，因为Authorized组件的authority属性要求传入的值是个函数
function generateAuthFn(menus) {
  return pathname => () => {
    // exception页面无需拦截
    if (pathname.toLowerCase().includes('exception'))
      return true;
    const hasPath = menus.includes(codeMap[getPath(pathname, pathArray)]);
    // console.log('menus', menus);
    // console.log(getPath(pathname, pathArray), codeMap[getPath(pathname, pathArray)], 'hasPath', hasPath);
    return hasPath;
  };
}

// 找到路径数组中与当前pathname匹配的路径path，如 company/1 => company/:id
function getPath(pathname, pathArray) {
  for (let path of pathArray) {
    const pathRegexp = pathToRegexp(path);
    const isMatch = pathRegexp.test(pathname);
    // console.log('isMatch', isMatch);
    if (isMatch)
      return path;
  }
}

const menuData = config['routes'];
const MenuData = formatter(menuData[1].routes);
let codeMap = {};
getCodeMap(MenuData, codeMap);

// console.log('codeMap', codeMap);

// codeMap的路径键值数组，过滤了code，即路由配置中的所有路径
const pathArray = Object.keys(codeMap).filter(path => path.includes('/'));
// console.log('pathArray', pathArray);

export { codeMap, pathArray, getPath };

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
      // console.log(this.props);

      // menuHandled防止重复生成menuData，因为这里只需要在初始化时生成一次
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
