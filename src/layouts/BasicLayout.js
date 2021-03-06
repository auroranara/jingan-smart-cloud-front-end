import React from 'react';
import { Layout, ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import DocumentTitle from 'react-document-title';
import isEqual from 'lodash/isEqual';
import memoizeOne from 'memoize-one';
import { connect } from 'dva';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import pathToRegexp from 'path-to-regexp';
import { enquireScreen, unenquireScreen } from 'enquire-js';
import { formatMessage } from 'umi/locale';
import SiderMenu from '@/components/SiderMenu';
import Authorized from '@/utils/Authorized';
import { filterBigPlatform, getSystemType } from '@/utils/customAuth';
import config from './../../config/config';
import router from 'umi/router';

import Footer from './Footer';
import Header from './Header';
import Context from './MenuContext';

import Link from 'umi/link';
import Exception from '@/components/Exception';
import { Spin, BackTop } from 'antd';

import AppMenu from 'components/_utils/AppMenu';
import styles from '../index.less';
import { getRedirectPath } from '@/pages/RoleAuthorization/AccountManagement/utils';

const { Content } = Layout;
const { check } = Authorized;
const { projectShortName, logo } = global.PROJECT_CONFIG;

const INIT_ROUTE = '/menu-reveal';
const SYSTEMS = [
  '企业生产全流程管理系统',
  '重大危险源监测预警系统',
  '可燃有毒气体监测预警系统',
  '安全风险分区管理系统',
  '人员在岗在位管理系统',
];
SYSTEMS[-1] = '工作台';

// Conversion router to menu.
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

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
    maxWidth: 1599,
  },
  'screen-xxl': {
    minWidth: 1600,
  },
};

class BasicLayout extends React.PureComponent {
  constructor(props) {
    super(props);
    this.getPageTitle = memoizeOne(this.getPageTitle);
    this.getBreadcrumbNameMap = memoizeOne(this.getBreadcrumbNameMap, isEqual);
    this.breadcrumbNameMap = this.getBreadcrumbNameMap();
  }

  state = {
    rendering: true,
    isMobile: false,
    menuBigPlatform: [], // 驾驶舱列表
  };

  componentDidMount() {
    const {
      dispatch,
      location: { pathname },
      route,
    } = this.props;
    const menuAll = JSON.parse(JSON.stringify(config['routes']));

    this.setMenuSystemType();
    dispatch({ type: 'user/fetchGrids' });
    dispatch({
      type: 'user/fetchCurrent',
      callback: (data, login) => {
        const { user } = this.props;

        // const { userMessage, gridList, unitType, unitId } = data;
        const { logined } = login;
        // const code = userMessage && userMessage[0] ? userMessage[0].code : undefined;
        // const grid = gridList && gridList[0] ? gridList[0].value : 'index';
        // const path = code ? getRedirectPath(code, unitType, unitId, grid) : INIT_ROUTE;
        const path = INIT_ROUTE;
        // console.log(logined, path);
        if (logined && path) {
          // router.push(path);
          dispatch({ type: 'login/saveLogined', payload: false }); // 跳转过后，重置logined，不然刷新还会跳转
        }

        // 驾驶舱路由、系统路由
        const configBigPlatform = menuAll.find(item => item.path === '/big-platform');
        const menuBigPlatform = filterBigPlatform(configBigPlatform.routes, user);
        this.setState({ menuBigPlatform });
      },
    });
    dispatch({
      type: 'setting/getSetting',
    });
    this.renderRef = requestAnimationFrame(() => {
      this.setState({
        rendering: false,
      });
    });
    this.enquireHandler = enquireScreen(mobile => {
      const { isMobile } = this.state;
      if (isMobile !== mobile) {
        this.setState({
          isMobile: mobile,
        });
      }
    });
  }

  componentDidUpdate(prevProps) {
    const {
      location: { pathname: prevPathname },
    } = prevProps;
    const {
      location: { pathname },
    } = this.props;

    if (prevPathname !== pathname && !pathname.includes('exception'))
      // 跳到exception页面保持原来的菜单类型
      this.setMenuSystemType();
    this.breadcrumbNameMap = this.getBreadcrumbNameMap();
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.renderRef);
    unenquireScreen(this.enquireHandler);
  }

  setMenuSystemType() {
    const {
      dispatch,
      location: { pathname },
      route,
    } = this.props;
    dispatch({ type: 'user/saveSystemType', payload: getSystemType(pathname, route) });
  }

  getContext() {
    const { location } = this.props;
    return {
      location,
      breadcrumbNameMap: this.breadcrumbNameMap,
    };
  }

  getMenuData() {
    const {
      route: { routes },
    } = this.props;
    return formatter(routes);
  }

  /**
   * 获取面包屑映射
   * @param {Object} menuData 菜单配置
   */
  getBreadcrumbNameMap() {
    const routerMap = {};
    const mergeMenuAndRouter = data => {
      data.forEach(menuItem => {
        if (menuItem.children) {
          mergeMenuAndRouter(menuItem.children);
        }
        // Reduce memory usage
        routerMap[menuItem.path] = menuItem;
      });
    };
    mergeMenuAndRouter(this.getMenuData());
    return routerMap;
  }

  getPageTitle = pathname => {
    let currRouterData = null;
    // match params path
    Object.keys(this.breadcrumbNameMap).forEach(key => {
      if (pathToRegexp(key).test(pathname)) {
        currRouterData = this.breadcrumbNameMap[key];
      }
    });
    if (!currRouterData) {
      return projectShortName;
    }
    const message = formatMessage({
      id: currRouterData.locale || currRouterData.name,
      defaultMessage: currRouterData.name,
    });
    return `${message} - ${projectShortName}`;
  };

  getLayoutStyle = () => {
    const { fixSiderbar, collapsed, layout } = this.props;
    const { isMobile } = this.state;
    if (fixSiderbar && layout !== 'topmenu' && !isMobile) {
      return {
        paddingLeft: collapsed ? '80px' : '256px',
      };
    }
    return null;
  };

  getContentStyle = () => {
    const { fixedHeader } = this.props;
    return {
      margin: '24px 24px 0',
      paddingTop: fixedHeader ? 64 : 0,
    };
  };

  getBashRedirect = () => {
    // According to the url parameter to redirect
    // 这里是重定向的,重定向到 url 的 redirect 参数所示地址
    const urlParams = new URL(window.location.href);

    const redirect = urlParams.searchParams.get('redirect');
    // Remove the parameters in the url
    if (redirect) {
      urlParams.searchParams.delete('redirect');
      window.history.replaceState(null, 'redirect', urlParams.href);
    } else {
      const { routerData } = this.props;
      // get the first authorized route path in routerData
      const authorizedPath = Object.keys(routerData).find(
        item => check(routerData[item].authority, item) && item !== '/'
      );
      return authorizedPath;
    }
    return redirect;
  };

  handleMenuCollapse = collapsed => {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed,
    });
  };

  render() {
    const {
      layout: PropsLayout,
      children,
      location: { pathname },
      authorityFn,
      currentUserLoaded,
      user: { systemType },
    } = this.props;
    const { /*rendering,*/ isMobile, menuBigPlatform } = this.state;
    const isTop = PropsLayout === 'topmenu';
    const menuData = this.getMenuData();

    // console.log('basic layout', authorityFn(pathname)());

    const page403 = (
      <Exception
        type="403"
        desc={formatMessage({ id: 'app.exception.description.403' })}
        linkElement={Link}
        backText={formatMessage({ id: 'app.exception.back' })}
      />
    );

    const layout = (
      <Layout hasSider={!isTop || isMobile}>
        {isTop && !isMobile ? null : (
          <SiderMenu
            logo={logo}
            Authorized={Authorized}
            theme="dark"
            onCollapse={this.handleMenuCollapse}
            // 被this.props中传入的menuData覆盖了
            menuData={menuData}
            isMobile={isMobile}
            projectShortName={SYSTEMS[systemType]}
            {...this.props}
          />
        )}
        <Layout
          style={{
            ...this.getLayoutStyle(),
            minHeight: '100vh',
          }}
        >
          <Header
            menuData={menuData}
            handleMenuCollapse={this.handleMenuCollapse}
            logo={logo}
            isMobile={isMobile}
            menuBigPlatform={menuBigPlatform}
            {...this.props}
          />
          {/* <Content style={this.getContentStyle()}>{children}</Content> */}
          <Content style={this.getContentStyle()}>
            {currentUserLoaded ? (
              <Authorized authority={authorityFn(pathname)} noMatch={page403}>
                {children}
              </Authorized>
            ) : (
              <Spin size="large" className={styles.globalSpin} />
            )}
            <BackTop />
          </Content>
          <Footer />
        </Layout>
      </Layout>
    );
    return (
      <React.Fragment>
        <ConfigProvider locale={zhCN}>
          <DocumentTitle title={this.getPageTitle(pathname)}>
            <ContainerQuery query={query}>
              {params => (
                <Context.Provider value={this.getContext()}>
                  <div className={classNames(params)}>{layout}</div>
                </Context.Provider>
              )}
            </ContainerQuery>
          </DocumentTitle>
        </ConfigProvider>
      </React.Fragment>
    );
  }
}

export default connect(({ global, setting }) => ({
  collapsed: global.collapsed,
  layout: setting.layout,
  ...setting,
}))(AppMenu(BasicLayout));
