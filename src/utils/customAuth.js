import React, { PureComponent } from 'react';
import pathToRegexp from 'path-to-regexp';
import { Link } from 'react-router-dom';
import UmiLink from 'umi/link';
import { message, Button, Popconfirm } from 'antd';
import { connect } from 'dva';

// import styles from './customAuth.less';

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
    if (path !== '/' && !codes.includes(codeMap[path])) continue;

    if (children) menu.children = filterMenus(children, codes, codeMap);

    menuData.push(menu);
  }

  return menuData;
}

// 根据formatter之后的路由来生成一个path -> code的映射对象及包含所有路径path的数组
export function getCodeMap(menuData, codeMap, pathArray) {
  for (let m of menuData) {
    const { path, code, locale, children } = m;

    if (path === '/' || codeMap[path]) continue;

    if (code) {
      codeMap[path] = code;
      // 需要考虑不同path对应相同code时，会覆盖的问题，所以直接用一个数组接收所有path更好，因为也用不到code -> path的映射，所以这个也没啥用
      // codeMap[code] = path;
      pathArray.push(path);
      // 当未设置code时，默认使用locale来替代
    } else if (locale) {
      // locle = 'menu.fuck.me',去掉 'menu.'
      const loc = locale.slice(5);
      codeMap[path] = loc;
      // codeMap[loc] = path;
      pathArray.push(path);
    }

    if (children) getCodeMap(children, codeMap, pathArray);
  }
}

// 高阶函数，最后的返回值是个函数，来判断当前路径是否在menus中，即当前用户是否有访问权限，因为Authorized组件的authority属性要求传入的值是个函数
export function generateAuthFn(codes, codeMap, pathArray) {
  // console.log('codes', codes);
  // console.log('codeMap', codeMap);
  // console.log('pathArray', pathArray);
  return pathname => () => {
    // exception页面无需拦截
    if (pathname.toLowerCase().includes('exception')) return true;

    // 为了防止出现 codeMap[undefined]的情况，所以要判断下path是否存在，不存在则是pathname对应页面不存在，直接返回true，umi会自己判断页面是否存在，并渲染对应的404页面
    const path = getPath(pathname, pathArray);
    if (!path) return true;

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
    if (isMatch) return path;
  }
}

export function authWrapper(WrappedComponent) {
  return connect(({ user }) => ({ user }))(function (props) {
    // console.log(props);
    // 将需要的属性分离出来
    const { dispatch, user: { currentUser: { permissionCodes } }, code, codes, hasAuthFn, errMsg, children = null, ...restProps } = props;
    // 将无权限时需要改变的属性：超链接，样式，onClick等剥离出来
    const { href, to, onClick, style = {}, ...disabledRestProps } = restProps;

    let authorized;
    // 如果自己传codes，那么就用自己传入的codes代替从currentUser中获取的permissionCodes，主要是为了方便测试
    const perCodes = codes || permissionCodes;
    // 如果自定义hasAuthFn，即自己判断是否有权限，则不通过hasAuthority(code, codes)判断是否有权限
    // hasAuthFn(code: string, codes: string[]): boolean
    if (hasAuthFn !== undefined && typeof hasAuthFn === 'function') authorized = hasAuthFn(perCodes);
    else authorized = hasAuthority(code, perCodes);

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
        style={{
          ...style,
          color: 'rgba(0,0,0,0.25)',
          cursor: 'not-allowed',
          pointerEvents: 'auto',
          textDecoration: 'none',
        }}
        onClick={ev => {
          if (errMsg) message.warn(errMsg);
          ev.preventDefault();
        }}
      >
        {children}
      </WrappedComponent>
    );
  });
}

// 组件中需要多传入code, 如果要message提示，还需传入errMsg，需要自己判断权限，传入hasAuthFn
// codes可以不传，若传入则会使用传入的codes判断，主要为了方便测试，比如自己传入codes={[]}来disable按钮，或传入对应的code来使按钮显示
export const AuthA = authWrapper('a');

export const AuthSpan = authWrapper('span');

export const AuthDiv = authWrapper('div');

// 包装原生button
export const AuthBtn = authWrapper('button');

export const AuthLink = authWrapper(Link);

export const AuthUmiLink = authWrapper(UmiLink);

// 包装antd组件Button
export const AuthButton = connect(({ user }) => ({ user }))(function (props) {
  const { dispatch, user: { currentUser: { permissionCodes } }, code, codes, ...restProps } = props;
  // 如果自己传codes，那么就用自己传入的codes代替从currentUser中获取的permissionCodes，主要是为了方便测试
  const perCodes = codes || permissionCodes;
  return <Button {...restProps} disabled={getDisabled(code, perCodes)} />;
});

// 图标
@connect(({ user }) => ({ user }))
export class AuthIcon extends PureComponent {
  render() {
    const {
      dispatch, // 单独拎出来过滤掉，不然传入Link会报warning
      to,
      url,
      darkUrl,
      code,
      codes,
      style,
      onClick,
      user: { currentUser: { permissionCodes } },
      ...restProps
    } = this.props;
    const perCodes = codes || permissionCodes;
    const authorized = hasAuthority(code, perCodes);
    // const authorized = true;
    // console.log(darkUrl);
    return (
      <Link
        to={authorized ? to : ''}
        style={{
          ...style,
          backgroundImage: `url(${authorized ? url : darkUrl})`,
          cursor: authorized ? 'pointer' : 'auto',
        }}
        onClick={authorized ? onClick : ev => ev.preventDefault()}
        {...restProps}
      />
    );
  }
}

// 气泡确认框
export const AuthPopConfirm = connect(({ user }) => ({ user }))(function (props) {
  const {
    code,
    onConfirm,
    title,
    okText = '确认',
    cancelText = '取消',
    codes,
    user: { currentUser: { permissionCodes } },
    children,
  } = props
  const perCodes = codes || permissionCodes;
  const auth = hasAuthority(code, perCodes);
  return auth ? (
    <Popconfirm
      title={title}
      onConfirm={onConfirm}
      okText={okText}
      cancelText={cancelText}
    >
      {children}
    </Popconfirm>
  ) : (
      <span style={{ color: 'rgba(0,0,0,0.25)', cursor: 'not-allowed' }}>{children}</span>
    )
})
