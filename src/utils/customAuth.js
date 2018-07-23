import pathToRegexp from 'path-to-regexp';
import { message } from 'antd';

// const emptyFn = () => { };

export function hasAuthority(code, codes) {
  return codes.includes(code);
}

export function getDisabled(code, codes) {
  return !hasAuthority(code, codes);
}

export const ERROR_MSG = '您没有进行当前操作的权限';

// 不传回调函数只传msg或传不带参数的回调函数
export function getOnClick(code, codes, callbackOrMsg, msg) {
  // 不传回调函数只传msg
  if (typeof callbackOrMsg === 'string')
    return getOnClickByArg(code, codes, undefined, undefined, callbackOrMsg);
  // 传入无参的回调函数，msg可传可不传
  return getOnClickByArg(code, codes, callbackOrMsg, [], msg);
}

/* 传带参数的回调函数，只有一个参数且不是数组时，可以直接传，或者可以将参数放入数组中
 * 注意特殊的是当只有一个参数，且参数为数组时，为了不与上述的传参方式冲突，必须将数组参数放入数组中，如f([0,1]) -> getOnClickByArg(code, codes, f, [[0,1]])
 * 否则若getOnClickByArg(code, menus, f, [0,1])这么传时，会f(...[0,1])这么调用函数
 */
export function getOnClickByArg(code, codes, callback, args, msg) {
  return ev => {
    if (hasAuthority(code, codes)) {
      if (callback && Array.isArray(args))
        callback(...args);
      else if (callback)
        callback(args);
      return;
    }

    if (msg)
      message.error(msg);

    ev.preventDefault();
  }
}

// 将router.config.js配置转化成路由，源码中的函数，并未改动
export function formatter(data, parentPath = '', parentAuthority, parentName) {
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
export function filterMenus(MenuData, codes, codeMap) {
  const menuData = [];
  for (let m of MenuData) {
    const { path, children } = m;
    // console.log('m', m, 'code', codeMap[path], menus.includes(codeMap[path]));
    const menu = { ...m };
    if (path !== '/' && !codes.includes(codeMap[path]))
      continue;

    if (children)
      menu.children = filterMenus(children, codes, codeMap);

    menuData.push(menu);
  }

  return menuData;
}

// 根据formatter之后的路由来生成一个path -> code, code -> path的映射对象
export function getCodeMap(menuData, result) {
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
export function generateAuthFn(codes, codeMap, pathArray) {
  return pathname => () => {
    // exception页面无需拦截
    if (pathname.toLowerCase().includes('exception'))
      return true;

    // 为了防止出现 codeMap[undefined]的情况，所以要判断下path是否存在，不存在则是pathname对应页面不存在，直接返回false
    const path = getPath(pathname, pathArray);
    if (!path)
      return false;

    const hasPath = codes.includes(codeMap[path]);
    // console.log('codes', codes);
    // console.log(getPath(pathname, pathArray), codeMap[getPath(pathname, pathArray)], 'hasPath', hasPath);
    return hasPath;
  };
}

// 找到路径数组中与当前pathname匹配的路径path，如 company/1 => company/:id，不存在匹配的path，默认返回undefined，这也意味着pathname对应的页面不存在
export function getPath(pathname, pathArray) {
  for (let path of pathArray) {
    const pathRegexp = pathToRegexp(path);
    const isMatch = pathRegexp.test(pathname);
    // console.log('isMatch', isMatch);
    if (isMatch)
      return path;
  }
}
