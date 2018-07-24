import React from 'react';
import { connect } from 'dva';
import { Spin } from 'antd';
import styles from '../../index.less';

import config from '../../../config/config';
import { formatter, getCodeMap, filterMenus, generateAuthFn } from '../../utils/customAuth';
// import codeMap from './codeMap';

const menuData = config['routes'];
const MenuData = formatter(menuData[1].routes);
let codeMap = {};
getCodeMap(MenuData, codeMap);

// console.log('codeMap', codeMap);

// codeMap的路径键值数组，过滤了code，即路由配置中的所有路径
const pathArray = Object.keys(codeMap).filter(path => path.includes('/'));
// console.log('pathArray', pathArray);

export { codeMap, pathArray };

export default function AppMenu(WrappedComponent) {
  @connect(({ user }) => ({ user }))
  class AppMenuInner extends React.Component {
    // componentDidMount() {
      // const { user: { currentUser: { permissionCodes: codes } } } = this.props;
      // if (!codes.length) {
      //   this.props.dispatch({ type: 'global/fetchMenus' });
      // }
    // }

    /* 当前组件注销时，情况user.currentUser内的codes数组，不然当用户重新登陆但并未刷新时
     * store.user.currentUser中原来的数据会污染新角色的数据，造成菜单渲染为原角色菜单，但是每次redirect会重新渲染整个页面，
     * 从而引起AppMenu ummount，造成每次redirect时候会有一次codes为空数组，从而有个403一闪而过
     * 所以，在login out的时候将store.user.currentUser.permissionCodes置空
     */
    // componentWillUnmount() {
    //   console.log('AppMenu unmount');
    //   const { dispatch } = this.props;
    //   dispatch({ type: 'user/saveCurrentUser', payload: { permissionCodes: [] } });
    // }

    menuHandled = false;
    menuData = [];

    render() {
      // store.user.currentUser初始值是空对象，所以当没有请求到currentUser时，permissionCodes(codes)是undefined
      // 请求返回的permissionCodes(codes)是个数组，可能是空数组
      const { user: { currentUser: { permissionCodes: codes } }, ...rest } = this.props;
      // console.log(this.props);

      // 判断currentUser是否已加载，因为currentUser得渲染BasicLayout才会发起请求，所以需要往下传到BasicLayout中处理
      const currentUserLoaded = !!codes;

      // menuHandled防止重复处理menuData，当未handle时且codes已经获取时处理一次
      if (!this.menuHandled && currentUserLoaded) {
        this.menuHandled = true;
        this.menuData = filterMenus(MenuData, codes, codeMap);
      }

      const menuData = this.menuData;
      // console.log(menuData);

      // if (!codes) {
      //   return <Spin size="large" className={styles.globalSpin} />;
      // } else {
      //   return <WrappedComponent {...rest} menuData={menuData} authorityFn={generateAuthFn(codes, codeMap, pathArray)} />;
      // }

      return <WrappedComponent {...rest} menuData={menuData} authorityFn={generateAuthFn(codes, codeMap, pathArray)} currentUserLoaded={currentUserLoaded} />;
    }
  }

  return AppMenuInner;
};
