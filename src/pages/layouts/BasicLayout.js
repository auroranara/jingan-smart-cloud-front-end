import React from 'react';
import { Layout, BackTop } from 'antd';
import DocumentTitle from 'react-document-title';
import memoizeOne from 'memoize-one';
import { connect } from 'dva';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import pathToRegexp from 'path-to-regexp';
import { formatMessage } from 'umi/locale';
import SiderMenu from '../../components/SiderMenu';
import Authorized from '../../utils/Authorized';
import SettingDarwer from '../../components/SettingDarwer';
import logo from '../../assets/logo.svg';
import Footer from './Footer';
import Header from './Header';
import Context from './MenuContext';

import Exception403 from '../Exception/403';
import Exception404 from '../Exception/404';
import { pathArray } from '../../components/_utils/AppMenu';
import { getPath } from '../../utils/customAuth';

const { Content } = Layout;
const { check } = Authorized;

/**
 * 获取面包屑映射
 * @param {Object} menuData 菜单配置
 */
const getBreadcrumbNameMap = memoizeOne(meun => {
  const routerMap = {};
  const mergeMeunAndRouter = meunData => {
    meunData.forEach(meunItem => {
      if (meunItem.children) {
        mergeMeunAndRouter(meunItem.children);
      }
      // Reduce memory usage
      routerMap[meunItem.path] = meunItem;
    });
  };
  mergeMeunAndRouter(meun);
  return routerMap;
});

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
  state = {
    rendering: true,
  };
  constructor(props) {
    super(props);
    const { menuData } = this.props;
    this.getPageTitle = memoizeOne(this.getPageTitle);
    this.breadcrumbNameMap = getBreadcrumbNameMap(menuData);
  }
  getContext() {
    const { location } = this.props;
    return {
      location,
      breadcrumbNameMap: this.breadcrumbNameMap,
    };
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
      return 'Ant Design Pro';
    }
    const message = formatMessage({
      id: currRouterData.locale || currRouterData.name,
      defaultMessage: currRouterData.name,
    });
    return `${message} - Ant Design Pro`;
  };

  getLayoutStyle = () => {
    const { fixSiderbar, collapsed, layout } = this.props;
    if (fixSiderbar && layout !== 'topmenu') {
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
  componentDidMount() {
    this.renderRef = requestAnimationFrame(() => {
      this.setState({
        rendering: false,
      });
    });
  }
  componentWillUnmount() {
    cancelAnimationFrame(this.renderRef);
  }
  render() {
    const {
      authorityFn,
      isMobile,
      silderTheme,
      layout: PropsLayout,
      children,
      location: { pathname },
    } = this.props;

    console.log('basicLayout', pathname, authorityFn(pathname)());

    const isTop = PropsLayout === 'topmenu';
    // authority对应的函数返回值是true时，包含两种情况，即当前用户无权限403和网页不存在404，所以得在这里做一下判断
    // 当由router.config.js中配置生成的路径数组中不包含当前pathname时，则路径对应的页面不存在，剩下的情况就是用户无权限访问当前路径对应的页面
    const noMatch = getPath(pathname, pathArray) ? <Exception403 /> : <Exception404 />;
    const layout = (
      <Layout>
        {isTop && !isMobile ? null : (
          <SiderMenu
            logo={logo}
            Authorized={Authorized}
            theme={silderTheme}
            onCollapse={this.handleMenuCollapse}
            {...this.props}
          />
        )}
        <Layout style={this.getLayoutStyle()}>
          <Header handleMenuCollapse={this.handleMenuCollapse} logo={logo} {...this.props} />
          {/* <Content style={this.getContentStyle()}>{children}</Content> */}
          <Content style={this.getContentStyle()}>
            <Authorized authority={authorityFn(pathname)} noMatch={noMatch}>{children}</Authorized>
          </Content>
          <Footer />
        </Layout>
      </Layout>
    );
    return (
      <React.Fragment>
        <DocumentTitle title={this.getPageTitle(pathname)}>
          <ContainerQuery query={query}>
            {params => (
              <Context.Provider value={this.getContext()}>
                <div className={classNames(params)}>{layout}</div>
              </Context.Provider>
            )}
          </ContainerQuery>
        </DocumentTitle>
        {this.state.rendering ? null : <SettingDarwer />}
      </React.Fragment>
    );
  }
}

export default connect(({ global, setting }) => ({
  collapsed: global.collapsed,
  layout: setting.layout,
  ...setting,
}))(BasicLayout);
