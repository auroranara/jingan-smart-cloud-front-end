import pathToRegexp from 'path-to-regexp';
import { getMenuData } from './menu';

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

export const getRouterData = () => {
  const routerConfig = {
    '/': {
      name: 'Ant-Design-Pro',
    },
    '/Dashboard/Analysis': {
      name: '分析页',
    },
    '/Dashboard/Monitor': {},
    '/Dashboard/Workplace': {},
    '/Forms/BasicForm': {},
    '/Forms/StepForm': {},
    '/Forms/StepForm/Step1': {
      name: '分步表单（填写转账信息）',
    },
    '/Forms/StepForm/Step2': {
      name: '分步表单（确认转账信息）',
    },
    '/Forms/StepForm/Step3': {
      name: '分步表单（完成）',
    },
    '/Forms/AdvancedForm': {},
    '/List/TableList': {},
    '/List/BasicList': {},
    '/List/CardList': {},
    '/List': {},
    '/List/Search/Projects': {},
    '/List/Search/Applications': {},
    '/List/Search/Articles': {},
    '/Profile/BasicProfile': {},
    '/Profile/AdvancedProfile': {},
    '/Result/success': {},
    '/Result/Error': {},
    '/Exception/403': {},
    '/Exception/404': {},
    '/Exception/500': {},
    '/Exception/triggerException': {},
    '/User': {},
    '/User/Login': {},
    '/User/Register': {},
    '/User/RegisterResult': {},
    // '/': {
    //   component: dynamicWrapper(app, ['user', 'login', 'setting'], () =>
    //     import('../layouts/LoadingPage')
    //   ),
    // },
    // /* 企业列表 */
    // '/base-info/company-list': {
    //   component: dynamicWrapper(app, ['company'], () =>
    //     import('../pages/BaseInfo/Company/CompanyList')
    //   ),
    // },
    // /* 企业详情 */
    // '/base-info/company/detail/:id': {
    //   component: dynamicWrapper(app, ['company'], () =>
    //     import('../pages/BaseInfo/Company/CompanyDetail')
    //   ),
    // },
    // /* 企业添加 */
    // '/base-info/company/add': {
    //   component: dynamicWrapper(app, ['company'], () =>
    //     import('../pages/BaseInfo/Company/CompanyEdit')
    //   ),
    // },
    // /* 企业修改 */
    // '/base-info/company/edit/:id': {
    //   component: dynamicWrapper(app, ['company'], () =>
    //     import('../pages/BaseInfo/Company/CompanyEdit')
    //   ),
    // },
    // '/fire-control/maintenance-company/list': {
    //   component: dynamicWrapper(app, ['maintenanceCompany'], () =>
    //     import('../pages/FireControl/MaintenanceCompany/MaintenanceCompanyList.js')
    //   ),
    // },
    // // 新增维保公司
    // '/fire-control/maintenance-company/add': {
    //   component: dynamicWrapper(app, ['maintenanceCompany', 'company'], () =>
    //     import('../pages/FireControl/MaintenanceCompany/MaintenanceCompanyAdd.js')
    //   ),
    // },
    // // 查看维保公司详情
    // '/fire-control/maintenance-company/detail/:id': {
    //   component: dynamicWrapper(app, ['maintenanceCompany'], () =>
    //     import('../pages/FireControl/MaintenanceCompany/MaintenanceCompanyDetail.js')
    //   ),
    // },
    // // 修改维保公司信息
    // '/fire-control/maintenance-company/edit/:id': {
    //   component: dynamicWrapper(app, ['maintenanceCompany', 'company'], () =>
    //     import('../pages/FireControl/MaintenanceCompany/MaintenanceCompanyEdit.js')
    //   ),
    // },
    // '/fire-control/user-transmission-device/list': {
    //   name: '用户传输装置',
    //   component: dynamicWrapper(app, ['transmission'], () =>
    //     import('../pages/FireControl/UserTransmissionDevice.js')
    //   ),
    // },
    // '/fire-control/user-transmission-device-detail/:companyId/detail': {
    //   name: '查看详情',
    //   component: dynamicWrapper(app, ['transmission'], () =>
    //     import('../pages/FireControl/UserTransmissionDeviceDetail.js')
    //   ),
    // },
    // '/fire-control/user-transmission-device-detail/:companyId/import-point-position/:hostId': {
    //   name: '导入点位数据',
    //   component: dynamicWrapper(app, ['pointPosition'], () =>
    //     import('../pages/FireControl/ImportPointPosition.js')
    //   ),
    // },
    // '/fire-alarm/index': {
    //   name: '火灾自动报警系统',
    //   component: dynamicWrapper(app, ['fireAlarm'], () => import('../pages/FireAlarm/index')),
    // },
    // '/fire-alarm/company/:companyId': {
    //   name: '单位页面',
    //   component: dynamicWrapper(app, ['fireAlarm'], () =>
    //     import('../pages/FireAlarm/AutoFireAlarm')
    //   ),
    // },
    // '/fire-alarm/company/detail/:companyId/:detailId': {
    //   name: '详情信息',
    //   component: dynamicWrapper(app, ['fireAlarm'], () =>
    //     import('../pages/FireAlarm/FireAlarmDetail')
    //   ),
    // },
    // // 账号管理列表
    // '/role-authorization/account-management/list': {
    //   component: dynamicWrapper(app, ['account'], () =>
    //     import('../pages/RoleAuthorization/AccountManagement/AccountManagementList.js')
    //   ),
    // },
    // // 新增账号
    // '/role-authorization/account-management/add': {
    //   component: dynamicWrapper(app, ['account'], () =>
    //     import('../pages/RoleAuthorization/AccountManagement/AccountManagementAdd.js')
    //   ),
    // },
    // // 编辑账号
    // '/role-authorization/account-management/edit/:id': {
    //   component: dynamicWrapper(app, ['account'], () =>
    //     import('../pages/RoleAuthorization/AccountManagement/AccountManagementEdit.js')
    //   ),
    // },
    // // 查看账号
    // '/role-authorization/account-management/detail/:id': {
    //   component: dynamicWrapper(app, ['account'], () =>
    //     import('../pages/RoleAuthorization/AccountManagement/AccountManagementDetail.js')
    //   ),
    // },
    // '/form/step-form/confirm': {
    //   name: '分步表单（确认转账信息）',
    //   component: dynamicWrapper(app, ['form'], () => import('../pages/Forms/StepForm/Step2')),
    // },
    // '/form/step-form/result': {
    //   name: '分步表单（完成）',
    //   component: dynamicWrapper(app, ['form'], () => import('../pages/Forms/StepForm/Step3')),
    // },
    // '/form/advanced-form': {
    //   component: dynamicWrapper(app, ['form'], () => import('../pages/Forms/AdvancedForm')),
    // },
    // '/list/table-list': {
    //   component: dynamicWrapper(app, ['rule'], () => import('../pages/List/TableList')),
    // },
    // '/list/basic-list': {
    //   component: dynamicWrapper(app, ['list'], () => import('../pages/List/BasicList')),
    // },
    // '/list/card-list': {
    //   component: dynamicWrapper(app, ['list'], () => import('../pages/List/CardList')),
    // },
    // '/list/search': {
    //   component: dynamicWrapper(app, ['list'], () => import('../pages/List/List')),
    // },
    // '/list/search/projects': {
    //   component: dynamicWrapper(app, ['list'], () => import('../pages/List/Projects')),
    // },
    // '/list/search/applications': {
    //   component: dynamicWrapper(app, ['list'], () => import('../pages/List/Applications')),
    // },
    // '/list/search/articles': {
    //   component: dynamicWrapper(app, ['list'], () => import('../pages/List/Articles')),
    // },
    // '/profile/basic': {
    //   component: dynamicWrapper(app, ['profile'], () => import('../pages/Profile/BasicProfile')),
    // },
    // '/profile/advanced': {
    //   component: dynamicWrapper(app, ['profile'], () => import('../pages/Profile/AdvancedProfile')),
    // },
    // '/result/success': {
    //   component: dynamicWrapper(app, [], () => import('../pages/Result/Success')),
    // },
    // '/result/fail': {
    //   component: dynamicWrapper(app, [], () => import('../pages/Result/Error')),
    // },
    // '/exception/403': {
    //   component: dynamicWrapper(app, [], () => import('../pages/Exception/403')),
    // },
    // '/exception/404': {
    //   component: dynamicWrapper(app, [], () => import('../pages/Exception/404')),
    // },
    // '/exception/500': {
    //   component: dynamicWrapper(app, [], () => import('../pages/Exception/500')),
    // },
    // '/exception/trigger': {
    //   component: dynamicWrapper(app, ['error'], () =>
    //     import('../pages/Exception/triggerException')
    //   ),
    // },
    // '/user': {
    //   component: dynamicWrapper(app, [], () => import('../layouts/UserLayout')),
    // },
    // '/user/login': {
    //   component: dynamicWrapper(app, ['login'], () => import('../pages/User/Login')),
    // },
    // '/user/register': {
    //   component: dynamicWrapper(app, ['register'], () => import('../pages/User/Register')),
    // },
    // '/user/register-result': {
    //   component: dynamicWrapper(app, [], () => import('../pages/User/RegisterResult')),
    // },
    // '/account/center': {
    //   component: dynamicWrapper(app, ['list', 'user', 'project'], () =>
    //     import('../pages/Account/Center/Center')
    //   ),
    // },
    // '/account/center/articles': {
    //   component: dynamicWrapper(app, [], () => import('../pages/Account/Center/Articles')),
    // },
    // '/account/center/applications': {
    //   component: dynamicWrapper(app, [], () => import('../pages/Account/Center/Applications')),
    // },
    // '/account/center/projects': {
    //   component: dynamicWrapper(app, [], () => import('../pages/Account/Center/Projects')),
    // },
    // '/account/settings': {
    //   component: dynamicWrapper(app, ['geographic'], () =>
    //     import('../pages/Account/Settings/Info')
    //   ),
    // },
    // '/account/settings/base': {
    //   component: dynamicWrapper(app, ['geographic'], () =>
    //     import('../pages/Account/Settings/BaseView')
    //   ),
    // },
    // '/account/settings/security': {
    //   component: dynamicWrapper(app, ['geographic'], () =>
    //     import('../pages/Account/Settings/SecurityView')
    //   ),
    // },
    // '/account/settings/binding': {
    //   component: dynamicWrapper(app, ['geographic'], () =>
    //     import('../pages/Account/Settings/BindingView')
    //   ),
    // },
    // '/account/settings/notification': {
    //   component: dynamicWrapper(app, ['geographic'], () =>
    //     import('../pages/Account/Settings/NotificationView')
    //   ),
    // },
    // /* 维保合同列表 */
    // '/fire-control/contract/list': {
    //   component: dynamicWrapper(app, ['contract'], () => import('../pages/Contract/ContractList')),
    // },
    // /* 查看维保合同详情 */
    // '/fire-control/contract/detail/:id': {
    //   component: dynamicWrapper(app, ['contract'], () =>
    //     import('../pages/Contract/ContractDetail')
    //   ),
    // },
    // /* 新增维保合同 */
    // '/fire-control/contract/add': {
    //   component: dynamicWrapper(app, ['contract'], () =>
    //     import('../pages/Contract/ContractHandler')
    //   ),
    // },
    // /* 编辑维保合同 */
    // '/fire-control/contract/edit/:id': {
    //   component: dynamicWrapper(app, ['contract'], () =>
    //     import('../pages/Contract/ContractHandler')
    //   ),
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
    };
    routerData[path] = router;
  });

  return routerData;
};
