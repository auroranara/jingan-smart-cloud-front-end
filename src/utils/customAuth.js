import pathToRegexp from 'path-to-regexp';
import { Link } from 'react-router-dom';
import { message, Button } from 'antd';

// import styles from './customAutho.less';

// 为了防止从store.user.currentUser.permissionCodes获取的codes是个undefined
export function hasAuthority(code, codes = []) {
  // console.log(code, codes);
  return codes.includes(code);
}

export function getDisabled(code, codes) {
  return !hasAuthority(code, codes);
}

export const ERROR_MSG = '您没有进行当前操作的权限';

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

// 将menus数组中不存在的路径过滤掉，使其再菜单中不显示，codes=[]也是为了防止从store.user.currentUser.permissionCodes获取的是undefined
export function filterMenus(MenuData, codes = [], codeMap) {
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
  // console.log('codes', codes);
  // console.log('codeMap', codeMap);
  // console.log('pathArray', pathArray);
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

export function authWrapper(WrappedComponent) {
  return function (props) {
    // console.log(props);
    // 将需要的属性分离出来
    const { code, codes, hasAuth, errMsg, children = null, ...restProps } = props;
    // 将无权限时需要改变的属性：超链接，样式，onClick等剥离出来
    const { href, to, onClick, style = {}, ...disabledRestProps } = restProps;

    let authorized;
    // 如果自定义disabled，则不通过hasAuthority(code, codes)判断是否有权限
    if (hasAuth !== undefined)
      authorized = hasAuth;
    else
      authorized = hasAuthority(code, codes);

    // console.log(authorized);

    if (authorized)
      // 若有权限，则原样返回组件
      return <WrappedComponent {...restProps}>{children}</WrappedComponent>;
    // 没权限，则将上述剥离出来的属性丢弃或重新处理
    return (
      <WrappedComponent
        {...disabledRestProps}
        to=""
        disabled
        style={{ ...style, color: 'rgba(0,0,0,0.25)', cursor: 'not-allowed', pointerEvents: 'auto' }}
        onClick={(ev) => {
          if (errMsg)
            message.warn(errMsg);
          ev.preventDefault();
        }}
      >
        {children}
      </WrappedComponent>
    );
  };
}

// 组件中需要多传入code, codes, 如果要message提示，还需传入errMsg，需要自己判断权限，传入hasAuth
export const AuthA = authWrapper('a');

export const AuthSpan = authWrapper('span');

export const AuthLink = authWrapper(Link);

export function AuthButton({ code, codes, ...restProps }) {
  return <Button {...restProps} disabled={getDisabled(code, codes)} />;
}

/* 六种传参方式
 * f(code, codes)
 * f(code, codes, msg)
 * f(code, codes, callback)
 * f(code, codes, callback, args)
 * f(code, codes, callback, msg)
 * f(code, codes, callback, args, msg)
 */
// export function getOnClick(code, codes, callbackOrMsg, argsOrMsg, msg) {
//   const callbackOrMsgType = typeof callbackOrMsg;
//   const argsOrMsgType = typeof argsOrMsg;
//   const isArray = Array.isArray(argsOrMsg);
//   const msgType = typeof msg;
//   // console.log(code,'callbackOrMsgType', callbackOrMsgType,'argsOrMsgType', argsOrMsgType, 'isArray', isArray, 'msgType', msgType);

//   // getOnClick(code, codes)
//   if (callbackOrMsgType === 'undefined') {
//     return getOnClickInner(code, codes, undefined, undefined, undefined);
//   }
//   // getOnClick(code, codes, msg)
//   else if (callbackOrMsgType === 'string') {
//     // console.log('f(code, codes, msg)')
//     return getOnClickInner(code, codes, undefined, undefined, callbackOrMsg);
//   }
//   // getOnClick(code, codes, callback)
//   else if (callbackOrMsgType === 'function' && argsOrMsgType === 'undefined') {
//     // console.log('f(code, codes, callback)');
//     return getOnClickInner(code, codes, callbackOrMsg, []);
//   }
//   // getOnClick(code, codes, callback, args)
//   else if (callbackOrMsgType === 'function' && isArray) {
//     // console.log('f(code, codes, callback, args)');
//     return getOnClickInner(code, codes, callbackOrMsg, argsOrMsg);
//   }
//   // getOnClick(code, codes, callback, msg)
//   else if (callbackOrMsgType === 'function' && argsOrMsgType === 'string') {
//     // console.log('f(code, codes, callback, msg)');
//     return getOnClickInner(code, codes, callbackOrMsg, [], msg);
//   }
//   // getOnClick(code, codes, callback, args, msg)
//   else if (callbackOrMsgType === 'function' && isArray && msgType === 'string') {
//     // console.log('f(code, codes, callback, args, msg)');
//     return getOnClickInner(code, codes, callbackOrMsg, argsOrMsg, msg);
//   }
//   else
//     console.warn('Arguments in getOnClick function in customAuth.js is wrong');
// }

// export function getOnClickInner(code, codes = [], callback, args, msg) {
//   return ev => {
//     if (hasAuthority(code, codes)) {
//       if (callback && Array.isArray(args)) {
//         callback(...args);
//       }
//       return;
//     }

//     if (msg)
//       message.error(msg);

//     ev.preventDefault();
//   }
// }
