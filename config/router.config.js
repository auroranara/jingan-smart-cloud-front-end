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
        code: 'baseInfo',
        name: 'baseInfo',
        icon: 'dashboard',
        routes: [
          {
            path: '/base-info/company',
            code: 'baseInfo.company',
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
                code: 'baseInfo.company.listView',
                name: 'list',
                component: './BaseInfo/Company/CompanyList',
              },
              {
                path: '/base-info/company/add',
                code: 'baseInfo.company.add',
                name: 'add',
                component: './BaseInfo/Company/CompanyEdit',
              },
              {
                path: '/base-info/company/edit/:id',
                code: 'baseInfo.company.edit',
                name: 'edit',
                component: './BaseInfo/Company/CompanyEdit',
              },
              {
                path: '/base-info/company/detail/:id',
                code: 'baseInfo.company.view',
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
        code: 'fireControl',
        icon: 'dashboard',
        name: 'fireControl',
        routes: [
          {
            path: '/fire-control/contract',
            code: 'fireControl.contract',
            name: 'contract',
            hideChildren: true,
            routes: [
              {
                path: '/fire-control/contract',
                redirect: '/fire-control/contract/list',
              },
              {
                path: '/fire-control/contract/list',
                code: 'fireControl.contract.listView',
                name: 'list',
                component: './FireControl/Contract/ContractList',
              },
              {
                path: '/fire-control/contract/add',
                code: 'fireControl.contract.edit',
                name: 'add',
                component: './FireControl/Contract/ContractHandler',
              },
              {
                path: '/fire-control/contract/edit/:id',
                code: 'fireControl.contract.edit',
                name: 'edit',
                component: './FireControl/Contract/ContractHandler',
              },
              {
                path: '/fire-control/contract/detail/:id',
                code: 'fireControl.contract.view',
                name: 'detail',
                component: './FireControl/Contract/ContractDetail',
              },
            ],
          },
          {
            path: '/fire-control/user-transmission-device',
            code: 'fireControl.userTransmissionDevice',
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
                code: 'fireControl.userTransmissionDevice.listView',
                name: 'list',
                component: './FireControl/UserTransmissionDevice/UserTransmissionDevice',
              },
              {
                path: '/fire-control/user-transmission-device/:companyId/detail',
                code: 'fireControl.userTransmissionDevice.view',
                name: 'deviceDetail',
                component: './FireControl/UserTransmissionDevice/UserTransmissionDeviceDetail',
              },
              {
                path:
                  '/fire-control/user-transmission-device/:companyId/import-point-position/:hostId',
                code: 'fireControl.userTransmissionDevice.host.importPointPosition',
                name: 'importPointPosition',
                component: './FireControl/UserTransmissionDevice/ImportPointPosition',
              },
            ],
          },
          {
            path: '/fire-control/maintenance-company',
            code: 'fireControl.maintenanceCompany',
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
                code: 'fireControl.maintenanceCompany.listView',
                name: 'list',
                component: './FireControl/MaintenanceCompany/MaintenanceCompanyList',
              },
              {
                path: '/fire-control/maintenance-company/add',
                code: 'fireControl.maintenanceCompany.add',
                name: 'add',
                component: './FireControl/MaintenanceCompany/MaintenanceCompanyAdd',
              },
              {
                path: '/fire-control/maintenance-company/edit/:id',
                code: 'fireControl.maintenanceCompany.edit',
                name: 'edit',
                component: './FireControl/MaintenanceCompany/MaintenanceCompanyEdit',
              },
              {
                path: '/fire-control/maintenance-company/detail/:id',
                code: 'fireControl.maintenanceCompany.view',
                name: 'detail',
                component: './FireControl/MaintenanceCompany/MaintenanceCompanyDetail',
              },
              {
                path: '/fire-control/maintenance-company/serviceList/:id',
                code: 'fireControl.maintenanceCompany.serviceListView',
                name: 'serviceList',
                component: './FireControl/MaintenanceCompany/ServiceUnitList',
              },
            ],
          },
        ],
      },

      // RoleAuthorization
      {
        path: '/role-authorization',
        code: 'roleAuthorization',
        name: 'roleAuthorization',
        icon: 'table',
        routes: [
          {
            path: '/role-authorization/account-management',
            code: 'roleAuthorization.accountManagement',
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
                code: 'roleAuthorization.accountManagement.listView',
                name: 'list',
                component: './RoleAuthorization/AccountManagement/AccountManagementList',
              },
              {
                path: '/role-authorization/account-management/add',
                code: 'roleAuthorization.accountManagement.add',
                name: 'add',
                component: './RoleAuthorization/AccountManagement/AccountManagementAdd',
              },
              {
                path: '/role-authorization/account-management/edit/:id',
                code: 'roleAuthorization.accountManagement.edit',
                name: 'edit',
                component: './RoleAuthorization/AccountManagement/AccountManagementEdit',
              },
              {
                path: '/role-authorization/account-management/detail/:id',
                code: 'roleAuthorization.accountManagement.view',
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
        code: 'dynamicMonitoring',
        icon: 'dashboard',
        name: 'dynamicMonitoring',
        routes: [
          {
            path: '/dynamic-monitoring/fire-alarm',
            code: 'dynamicMonitoring.fireAlarm',
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
                code: 'dynamicMonitoring.fireAlarm.listView',
                name: 'index',
                component: './DynamicMonitoring/FireAlarm/index',
              },
              {
                path: '/dynamic-monitoring/fire-alarm/company/:companyId',
                code: 'dynamicMonitoring.fireAlarm.comanyDetailView',
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
