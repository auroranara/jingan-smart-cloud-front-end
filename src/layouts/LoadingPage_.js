import React, { PureComponent } from 'react';
import { Spin } from 'antd';
import { connect } from 'dva';
import { enquireScreen, unenquireScreen } from 'enquire-js';
import BasicLayout from './BasicLayout';
import routerConfig from '../../../config/router.config';

import AppMenu from '../../components/_utils/AppMenu';

// const menuData = config['routes'];

// Conversion router to menu.
// function formatter(data, parentPath = '', parentAuthority, parentName) {
//   return data.map(item => {
//     let locale = 'menu';
//     if (parentName && item.name) {
//       locale = `${parentName}.${item.name}`;
//     } else if (item.name) {
//       locale = `menu.${item.name}`;
//     } else if (parentName) {
//       locale = parentName;
//     }
//     const result = {
//       ...item,
//       locale,
//       authority: item.authority || parentAuthority,
//     };
//     if (item.routes) {
//       const children = formatter(item.routes, `${parentPath}${item.path}/`, item.authority, locale);
//       // Reduce memory usage
//       result.children = children;
//     }
//     delete result.routes;
//     return result;
//   });
// }
/**
 * 根据菜单取得重定向地址.
 */
// const MenuData = formatter(menuData[1].routes);
// const routerData = routerConfig.routes;
const getRedirectData = MenuData => {
  const redirectData = [];
  const getRedirect = item => {
    if (item && item.children) {
      if (item.children[0] && item.children[0].path) {
        redirectData.push({
          from: `${item.path}`,
          to: `${item.children[0].path}`,
        });
        item.children.forEach(children => {
          getRedirect(children);
        });
      }
    }
  };
  MenuData.forEach(getRedirect);
  return redirectData;
};
// const redirectData = getRedirectData();

class LoadingPage extends PureComponent {
  state = {
    loading: true,
    isMobile: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    this.enquireHandler = enquireScreen(mobile => {
      const { isMobile } = this.state;
      if (isMobile !== mobile) {
        this.setState({
          isMobile: mobile,
        });
      }
    });
    dispatch({
      type: 'user/fetchCurrent',
    });
    this.hideLoading();
    this.initSetting();
  }

  componentWillUnmount() {
    unenquireScreen(this.enquireHandler);
  }

  hideLoading() {
    this.setState({
      loading: false,
    });
  }

  /**
   * get setting from url params
   */
  initSetting() {
    const { dispatch } = this.props;
    dispatch({
      type: 'setting/getSetting',
    });
  }

  render() {
    const { menuData: MenuData } = this.props;
    const redirectData = getRedirectData(MenuData);

    const { loading, isMobile } = this.state;

    if (loading) {
      return (
        <div
          style={{
            width: '100%',
            height: '100%',
            margin: 'auto',
            paddingTop: 50,
            textAlign: 'center',
          }}
        >
          <Spin size="large" />
        </div>
      );
    }
    return (
      <BasicLayout
        isMobile={isMobile}
        menuData={MenuData}
        routerData={routerConfig}
        redirectData={redirectData}
        {...this.props}
      />
    );
  }
}

export default connect()(AppMenu(LoadingPage));
