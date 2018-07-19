module.exports = [
  // user
  {
    path: '/user',
    component: './layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: '/User/Login' },
      { path: '/user/register', component: './User/Register' },
      { path: '/user/register-result', component: './User/RegisterResult' },
    ],
  },
  // app
  {
    path: '/',
    component: './layouts/LoadingPage',
    routes: [
      // baseInfo
      { path: '/', redirect: '/base-info/company/list' },
      {
        path: '/base-info',
        name: 'baseInfo',
        icon: 'dashboard',
        routes: [
          {
            path: '/base-info/company',
            name: 'company',
            hideChildren: true,
            routes: [
              {
                path: '/base-info/company',
                name: 'company',
                redirect: '/base-info/company/list',
              },
              {
                path: '/base-info/company/list',
                name: 'list',
                component: './BaseInfo/Company/CompanyList',
              },
              {
                path: '/base-info/company/add',
                name: 'add',
                component: './BaseInfo/Company/CompanyEdit',
              },
              {
                path: '/base-info/company/edit/:id',
                name: 'edit',
                component: './BaseInfo/Company/CompanyEdit',
              },
              {
                path: '/base-info/company/detail/:id',
                name: 'detail',
                component: './BaseInfo/Company/CompanyDetail',
              },
            ],
          },
        ],
      },
      // FireControl
      {
        path: '/fire-control',
        icon: 'dashboard',
        name: 'fireControl',
        routes: [
          {
            path: '/fire-control/contract',
            name: 'contract',
            hideChildren: true,
            routes: [
              {
                path: '/fire-control/contract',
                redirect: '/fire-control/contract/list',
              },
              {
                path: '/fire-control/contract/list',
                name: 'list',
                component: './FireControl/Contract/ContractList',
              },
              {
                path: '/fire-control/contract/add',
                name: 'add',
                component: './FireControl/Contract/ContractHandler',
              },
              {
                path: '/fire-control/contract/edit/:id',
                name: 'edit',
                component: './FireControl/Contract/ContractHandler',
              },
              {
                path: '/fire-control/contract/detail/:id',
                name: 'detail',
                component: './FireControl/Contract/ContractDetail',
              },
            ],
          },
          {
            path: '/fire-control/user-transmission-device',
            name: 'userTransmissionDevice',
            hideChildren: true,
            routes: [
              {
                path: '/fire-control/user-transmission-device',
                name: 'userTransmissionDevice',
                redirect: '/fire-control/user-transmission-device/list',
              },
              {
                path: '/fire-control/user-transmission-device/list',
                name: 'list',
                component: './FireControl/UserTransmissionDevice/UserTransmissionDevice',
              },
              {
                path: '/fire-control/user-transmission-device/:companyId/detail',
                name: 'deviceDetail',
                component: './FireControl/UserTransmissionDevice/UserTransmissionDeviceDetail',
              },
              {
                path:
                  '/fire-control/user-transmission-device/:companyId/import-point-position/:hostId',
                name: 'importPointPosition',
                component: './FireControl/UserTransmissionDevice/ImportPointPosition',
              },
            ],
          },
          {
            path: '/fire-control/maintenance-company',
            name: 'maintenanceCompany',
            hideChildren: true,
            routes: [
              {
                path: '/fire-control/maintenance-company',
                name: 'maintenanceCompany',
                redirect: '/fire-control/maintenance-company/list',
              },
              {
                path: '/fire-control/maintenance-company/list',
                name: 'list',
                component: './FireControl/MaintenanceCompany/MaintenanceCompanyList',
              },
              {
                path: '/fire-control/maintenance-company/add',
                name: 'add',
                component: './FireControl/MaintenanceCompany/MaintenanceCompanyAdd',
              },
              {
                path: '/fire-control/maintenance-company/edit/:id',
                name: 'edit',
                component: './FireControl/MaintenanceCompany/MaintenanceCompanyEdit',
              },
              {
                path: '/fire-control/maintenance-company/detail/:id',
                name: 'detail',
                component: './FireControl/MaintenanceCompany/MaintenanceCompanyDetail',
              },
            ],
          },
        ],
      },

      // RoleAuthorization
      {
        path: '/role-authorization',
        name: 'roleAuthorization',
        icon: 'table',
        routes: [
          {
            path: '/role-authorization/account-management',
            name: 'account',
            hideChildren: true,
            routes: [
              {
                path: '/role-authorization/account-management',
                name: 'account',
                redirect: '/role-authorization/account-management/list',
              },
              {
                path: '/role-authorization/account-management/list',
                name: 'list',
                component: './RoleAuthorization/AccountManagement/AccountManagementList',
              },
              {
                path: '/role-authorization/account-management/add',
                name: 'add',
                component: './RoleAuthorization/AccountManagement/AccountManagementAdd',
              },
              {
                path: '/role-authorization/account-management/edit/:id',
                name: 'edit',
                component: './RoleAuthorization/AccountManagement/AccountManagementEdit',
              },
              {
                path: '/role-authorization/account-management/detail/:id',
                name: 'detail',
                component: './RoleAuthorization/AccountManagement/AccountManagementDetail',
              },
            ],
          },
        ],
      },
      {
        name: 'exception',
        icon: 'warning',
        path: '/exception',
        hideInMenu: true,
        routes: [
          // exception
          { path: '/exception/403', name: 'not-permission', component: './Exception/403' },
          { path: '/exception/404', name: 'not-find', component: './Exception/404' },
          { path: '/exception/500', name: 'server-error', component: './Exception/500' },
          {
            path: '/exception/trigger',
            name: 'trigger',
            hideInMenu: true,
            component: './Exception/triggerException',
          },
        ],
      },
      // dynamicMonitoring
      {
        path: '/dynamic-monitoring',
        icon: 'dashboard',
        name: 'dynamicMonitoring',
        routes: [
          {
            path: '/dynamic-monitoring/fire-alarm',
            name: 'fireAlarm',
            hideChildren: true,
            routes: [
              {
                path: '/dynamic-monitoring/fire-alarm',
                name: 'fireAlarm',
                redirect: '/dynamic-monitoring/fire-alarm/index',
              },
              {
                path: '/dynamic-monitoring/fire-alarm/index',
                name: 'index',
                component: './DynamicMonitoring/FireAlarm/index',
              },
              {
                path: '/dynamic-monitoring/fire-alarm/company/:companyId',
                name: 'companyDetail',
                component: './DynamicMonitoring/FireAlarm/CompanyDetail',
              },
              // { path: '/fire-alarm/company/detail/:companyId/:detailId', name: 'alarmDetail', component: './DynamicMonitoring/FireAlarm/FireAlarmDetail' },
            ],
          },
        ],
      },
    ],
  },
];
