import React from 'react';
import { connect } from 'dva';
import _ from 'lodash';

import config from '../../../config/config';
import { formatter, getCodeMap, filterMenus, generateAuthFn } from '@/utils/customAuth';

const menuData = config['routes'];
const MenuData = formatter(_.last(menuData).routes);
const codeMap = {};
const pathArray = []
getCodeMap(MenuData, codeMap, pathArray);

// console.log('codeMap', codeMap);

// codeMap的路径键值数组，过滤了code，即路由配置中的所有路径，这种获取path路径数组的方法已废弃，因为当不同path对应相同code时，会有path被覆盖
// const pathArray = Object.keys(codeMap).filter(path => path.includes('/'));
// console.log('pathArray', pathArray);

// export { codeMap, pathArray };

export default function AppMenu(WrappedComponent) {
  @connect(({ user }) => ({ user }))
  class AppMenuInner extends React.Component {
    state = { menuData: [] };

    componentDidMount() {
      console.log('did mount');
    }

    componentDidUpdate(prevProps, prevState) {
      const {
        user: {
          currentUser: { permissionCodes: prevCodes },
          systemType: prevSystemType,
        },
      } = prevProps;
      const {
        user: {
          currentUser: { permissionCodes: codes },
          systemType,
        },
      } = this.props;
      if (prevCodes !== codes || prevSystemType !== systemType) {
        const menuData = filterMenus(MenuData, codes, codeMap, systemType);
        // const menuData = filterMenus(MenuData, codes, codeMap, systemType).filter(({ path, children }) => path === '/' || children.length); // 筛选掉children为0的节点
        this.setState({ menuData });
      }
    }

    render() {
      // store.user.currentUser初始值是空对象，所以当没有请求到currentUser时，permissionCodes(codes)是undefined
      // 请求返回的permissionCodes(codes)是个数组，可能是空数组
      const {
        user: { currentUser: { permissionCodes: codes } },
      } = this.props;
      const { menuData } = this.state;

      console.log(menuData);
      // 判断currentUser是否已加载，因为currentUser得渲染BasicLayout才会发起请求，所以需要往下传到BasicLayout中处理
      const currentUserLoaded = !!codes;

      return (
        <WrappedComponent
          {...this.props}
          menuData={menuData} // 也可放在basic layout中处理
          authorityFn={generateAuthFn(codes, codeMap, pathArray, ['company-workbench'])}
          currentUserLoaded={currentUserLoaded}
        />
      );
    }
  }

  return AppMenuInner;
}
