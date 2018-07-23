import React from 'react';
import { connect } from 'dva';
// import { Spin } from 'antd';
// import styles from '../../index.less';

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

    menuHandled = false;
    menuData = [];

    render() {
      const { user: { currentUser: { permissionCodes: codes } }, ...rest } = this.props;
      // console.log(this.props);

      // menuHandled防止重复生成menuData，因为这里只需要在初始化时生成一次
      if (!this.menuHandled && codes.length) {
        this.menuHandled = true;
        this.menuData = filterMenus(MenuData, codes, codeMap);
      }

      // const menuHandled = this.menuHandled;
      const menuData = this.menuData;
      // console.log(menuData);

      // console.log(menuData);

      // if (!menuHandled) {
      //   return <Spin size="large" className={styles.globalSpin} />;
      // } else {
      //   return <WrappedComponent {...rest} menuData={menuData} authorityFn={generateAuthFn(codes)} />;
      // }

      return <WrappedComponent {...rest} menuData={menuData} authorityFn={generateAuthFn(codes, codeMap, pathArray)} />;
    }
  }

  return AppMenuInner;
};
