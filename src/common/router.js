import { createElement } from 'react';
import dynamic from 'dva/dynamic';
import pathToRegexp from 'path-to-regexp';
import { getMenuData } from './menu';

let routerDataCache;

const modelNotExisted = (app, model) =>
  // eslint-disable-next-line
  !app._models.some(({ namespace }) => {
    return namespace === model.substring(model.lastIndexOf('/') + 1);
  });

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => {
  // () => require('module')
  // transformed by babel-plugin-dynamic-import-node-sync
  if (component.toString().indexOf('.then(') < 0) {
    models.forEach(model => {
      if (modelNotExisted(app, model)) {
        // eslint-disable-next-line
        app.model(require(`../models/${model}`).default);
      }
    });
    return props => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return createElement(component().default, {
        ...props,
        routerData: routerDataCache,
      });
    };
  }
  // () => import('module')
  return dynamic({
    app,
    models: () =>
      models.filter(model => modelNotExisted(app, model)).map(m => import(`../models/${m}.js`)),
    // add routerData prop
    component: () => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return component().then(raw => {
        const Component = raw.default || raw;
        return props =>
          createElement(Component, {
            ...props,
            routerData: routerDataCache,
          });
      });
    },
  });
};

function getFlatMenuData(menus) {
  let keys = {};
  menus.forEach(item => {
    if (item.children) {
      keys[item.path] = { ...item };
      keys = { ...keys, ...getFlatMenuData(item.children) };
    } else {
      keys[item.path] = { ...item };
    }
  });
  return keys;
}

export const getRouterData = app => {
  const routerConfig = {
    '/': {
      component: dynamicWrapper(app, ['user', 'login', 'setting'], () =>
        import('../layouts/LoadingPage')
      ),
    },
    '/dashboard/analysis': {
      component: dynamicWrapper(app, ['chart'], () => import('../routes/Dashboard/Analysis')),
    },
    '/dashboard/monitor': {
      component: dynamicWrapper(app, ['monitor'], () => import('../routes/Dashboard/Monitor')),
    },
    '/dashboard/workplace': {
      component: dynamicWrapper(app, ['user', 'project', 'activities', 'chart'], () =>
        import('../routes/Dashboard/Workplace')
      ),
      // hideInBreadcrumb: true,
      // name: '工作台',
      // authority: 'admin',
    },
    /* 企业列表 */
    '/base-info/company-list': {
      component: dynamicWrapper(app, ['company'], () =>
        import('../routes/BaseInfo/Company/CompanyList')
      ),
    },
    /* 企业详情 */
    '/base-info/company/detail/:id': {
      component: dynamicWrapper(app, ['company'], () =>
        import('../routes/BaseInfo/Company/CompanyDetail')
      ),
    },
    /* 企业添加 */
    '/base-info/company/add': {
      component: dynamicWrapper(app, ['company'], () =>
        import('../routes/BaseInfo/Company/CompanyAdd')
      ),
    },
    /* 企业修改 */
    '/base-info/company/edit/:id': {
      component: dynamicWrapper(app, ['company'], () =>
        import('../routes/BaseInfo/Company/CompanyEdit')
      ),
    },
    // 维保公司
    '/fire-control/maintenance-company/list': {
      component: dynamicWrapper(app, ['maintenanceCompany'], () =>
        import('../routes/FireControl/MaintenanceCompany/MaintenanceCompanyList.js')
      ),
    },
    // 新增维保公司
    '/fire-control/maintenance-company/add': {
      component: dynamicWrapper(app, ['maintenanceCompany', 'company'], () =>
        import('../routes/FireControl/MaintenanceCompany/MaintenanceCompanyAdd.js')
      ),
    },
    // 查看维保公司详情
    '/fire-control/maintenance-company/detail/:id': {
      component: dynamicWrapper(app, ['maintenanceCompany'], () =>
        import('../routes/FireControl/MaintenanceCompany/MaintenanceCompanyDetail.js')
      ),
    },
    // 修改维保公司信息
    '/fire-control/maintenance-company/edit/:id': {
      component: dynamicWrapper(app, ['maintenanceCompany', 'company'], () =>
        import('../routes/FireControl/MaintenanceCompany/MaintenanceCompanyEdit.js')
      ),
    },
    '/fire-control/user-transmission-device': {
      name: '用户传输装置',
      component: dynamicWrapper(app, ['transmission'], () =>
        import('../routes/FireControl/UserTransmissionDevice.js')
      ),
    },
    '/fire-control/user-transmission-device-detail/:id': {
      name: '查看详情',
      component: dynamicWrapper(app, ['transmission'], () =>
        import('../routes/FireControl/UserTransmissionDeviceDetail.js')
      ),
    },
    '/form/step-form/confirm': {
      name: '分步表单（确认转账信息）',
      component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/StepForm/Step2')),
    },
    '/form/step-form/result': {
      name: '分步表单（完成）',
      component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/StepForm/Step3')),
    },
    '/form/advanced-form': {
      component: dynamicWrapper(app, ['form'], () => import('../routes/Forms/AdvancedForm')),
    },
    '/list/table-list': {
      component: dynamicWrapper(app, ['rule'], () => import('../routes/List/TableList')),
    },
    '/list/basic-list': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/List/BasicList')),
    },
    '/list/card-list': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/List/CardList')),
    },
    '/list/search': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/List/List')),
    },
    '/list/search/projects': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/List/Projects')),
    },
    '/list/search/applications': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/List/Applications')),
    },
    '/list/search/articles': {
      component: dynamicWrapper(app, ['list'], () => import('../routes/List/Articles')),
    },
    '/profile/basic': {
      component: dynamicWrapper(app, ['profile'], () => import('../routes/Profile/BasicProfile')),
    },
    '/profile/advanced': {
      component: dynamicWrapper(app, ['profile'], () =>
        import('../routes/Profile/AdvancedProfile')
      ),
    },
    '/result/success': {
      component: dynamicWrapper(app, [], () => import('../routes/Result/Success')),
    },
    '/result/fail': {
      component: dynamicWrapper(app, [], () => import('../routes/Result/Error')),
    },
    '/exception/403': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/403')),
    },
    '/exception/404': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/404')),
    },
    '/exception/500': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/500')),
    },
    '/exception/trigger': {
      component: dynamicWrapper(app, ['error'], () =>
        import('../routes/Exception/triggerException')
      ),
    },
    '/user': {
      component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
    },
    '/user/login': {
      component: dynamicWrapper(app, ['login'], () => import('../routes/User/Login')),
    },
    '/user/register': {
      component: dynamicWrapper(app, ['register'], () => import('../routes/User/Register')),
    },
    '/user/register-result': {
      component: dynamicWrapper(app, [], () => import('../routes/User/RegisterResult')),
    },
    '/account/center': {
      component: dynamicWrapper(app, ['list', 'user', 'project'], () =>
        import('../routes/Account/Center/Center')
      ),
    },
    '/account/center/articles': {
      component: dynamicWrapper(app, [], () => import('../routes/Account/Center/Articles')),
    },
    '/account/center/applications': {
      component: dynamicWrapper(app, [], () => import('../routes/Account/Center/Applications')),
    },
    '/account/center/projects': {
      component: dynamicWrapper(app, [], () => import('../routes/Account/Center/Projects')),
    },
    '/account/settings': {
      component: dynamicWrapper(app, ['geographic'], () =>
        import('../routes/Account/Settings/Info')
      ),
    },
    '/account/settings/base': {
      component: dynamicWrapper(app, ['geographic'], () =>
        import('../routes/Account/Settings/BaseView')
      ),
    },
    '/account/settings/security': {
      component: dynamicWrapper(app, ['geographic'], () =>
        import('../routes/Account/Settings/SecurityView')
      ),
    },
    '/account/settings/binding': {
      component: dynamicWrapper(app, ['geographic'], () =>
        import('../routes/Account/Settings/BindingView')
      ),
    },
    '/account/settings/notification': {
      component: dynamicWrapper(app, ['geographic'], () =>
        import('../routes/Account/Settings/NotificationView')
      ),
    },
    // '/user/:id': {
    //   component: dynamicWrapper(app, [], () => import('../routes/User/SomeComponent')),
    // },
  };
  // Get name from ./menu.js or just set it in the router data.
  const menuData = getFlatMenuData(getMenuData());

  // Route configuration data
  // eg. {name,authority ...routerConfig }
  const routerData = {};
  // The route matches the menu
  Object.keys(routerConfig).forEach(path => {
    // Regular match item name
    // eg.  router /user/:id === /user/chen
    const pathRegexp = pathToRegexp(path);
    const menuKey = Object.keys(menuData).find(key => pathRegexp.test(`${key}`));
    let menuItem = {};
    // If menuKey is not empty
    if (menuKey) {
      menuItem = menuData[menuKey];
    }
    let router = routerConfig[path];
    // If you need to configure complex parameter routing,
    // https://github.com/ant-design/ant-design-pro-site/blob/master/docs/router-and-nav.md#%E5%B8%A6%E5%8F%82%E6%95%B0%E7%9A%84%E8%B7%AF%E7%94%B1%E8%8F%9C%E5%8D%95
    // eg . /list/:type/user/info/:id
    router = {
      ...router,
      name: router.name || menuItem.name,
      authority: router.authority || menuItem.authority,
      hideInBreadcrumb: router.hideInBreadcrumb || menuItem.hideInBreadcrumb,
    };
    routerData[path] = router;
  });
  return routerData;
};
