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
      {
        path: '/user/activation',
        name: 'activation',
        key: 'activation',
        component: './User/Activation',
        routes: [
          {
            path: '/user/activation',
            redirect: '/user/activation/verification',
          },
          {
            path: '/user/activation/verification',
            component: './User/Activation/Verification',
          },
          {
            path: '/user/activation/set-password',
            component: './User/Activation/SetPassword',
          },
          {
            path: '/user/activation/result',
            component: './User/Activation/Result',
          },
        ],
      },
      {
        path: '/user/forget-password',
        name: 'forgetPassword',
        key: 'forgetPassword',
        component: './User/Activation',
        routes: [
          {
            path: '/user/forget-password',
            redirect: '/user/forget-password/verification',
          },
          {
            path: '/user/forget-password/verification',
            component: './User/Activation/Verification',
          },
          {
            path: '/user/forget-password/set-password',
            component: './User/Activation/SetPassword',
          },
          {
            path: '/user/forget-password/result',
            component: './User/Activation/Result',
          },
        ],
      },
    ],
  },
  {
    path: '/big-platform',
    routes: [
      { path: '/big-platform', redirect: '/big-platform/safety/government' },
      { path: '/big-platform/safety/government', component: './BigPlatform/Safety/Government' },
      {
        path: '/big-platform/safety/company/:companyId',
        component: './BigPlatform/Safety/Company',
      },
      {
        path: '/big-platform/fire-control/government',
        component: './BigPlatform/FireControl/Government',
      },
      {
        path: '/big-platform/fire-control/unit/:unitId',
        component: './BigPlatform/UnitFireControl/UnitFireControl',
      },
    ],
  },
  // app
  {
    path: '/',
    component: './layouts/LoadingPage',
    routes: [
      { path: '/', redirect: '/dashboard/view' },
      {
        path: '/dashboard',
        icon: 'home',
        code: 'dashboard',
        name: 'dashboard',
        hideChildren: true,
        routes: [
          {
            path: '/dashboard',
            redirect: '/dashboard/view',
          },
          {
            path: '/dashboard/view',
            code: 'dashboard.view',
            name: 'view',
            component: './Dashboard/Dashboard',
          },
        ],
      },
      // account
      {
        path: '/account',
        code: 'account',
        name: 'account',
        hideInMenu: true,
        routes: [
          {
            path: '/account/change-password',
            name: 'changePassword',
            code: 'account.changePassword',
            component: './Account/ChangePassword',
          },
          {
            path: '/account/personal-info/:id',
            name: 'personalInfo',
            code: 'account.personalInfo.view',
            component: './Account/PersonalInfo',
          },
        ],
      },

      // base info
      {
        path: '/base-info',
        code: 'baseInfo',
        name: 'baseInfo',
        icon: 'database',
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
              {
                path: '/base-info/company/department/list/:id',
                code: 'baseInfo.company.department.listView',
                name: 'department',
                component: './BaseInfo/Company/DepartmentList',
              },
            ],
          },
        ],
      },

      // fire control
      {
        path: '/fire-control',
        code: 'fireControl',
        icon: 'tool',
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
                code: 'fireControl.contract.add',
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

      // role authorization
      {
        path: '/role-authorization',
        code: 'roleAuthorization',
        name: 'roleAuthorization',
        icon: 'user',
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
                component: './RoleAuthorization/AccountManagement/AccountManagementEdit',
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
              {
                path: '/role-authorization/account-management/associated-unit/add/:id',
                code: 'roleAuthorization.accountManagement.associatedUnit.add',
                name: 'addAssociatedUnit',
                component: './RoleAuthorization/AccountManagement/AssociatedUnit',
              },
              {
                path: '/role-authorization/account-management/associated-unit/edit/:userId',
                code: 'roleAuthorization.accountManagement.associatedUnit.edit',
                name: 'editAssociatedUnit',
                component: './RoleAuthorization/AccountManagement/AssociatedUnit',
              },
            ],
          },
          {
            path: '/role-authorization/role',
            code: 'roleAuthorization.role',
            name: 'role',
            hideChildren: true,
            routes: [
              {
                path: '/role-authorization/role',
                redirect: 'list',
              },
              {
                path: '/role-authorization/role/list',
                name: 'list',
                code: 'roleAuthorization.role.listView',
                component: './RoleAuthorization/Role/RoleList',
              },
              {
                path: '/role-authorization/role/detail/:id',
                name: 'detail',
                code: 'roleAuthorization.role.view',
                component: './RoleAuthorization/Role/RoleDetail',
              },
              {
                path: '/role-authorization/role/add',
                name: 'add',
                code: 'roleAuthorization.role.add',
                component: './RoleAuthorization/Role/RoleHandler',
              },
              {
                path: '/role-authorization/role/edit/:id',
                name: 'edit',
                code: 'roleAuthorization.role.edit',
                component: './RoleAuthorization/Role/RoleHandler',
              },
            ],
          },
        ],
      },

      // dynamic monitoring
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
              {
                path: '/dynamic-monitoring/fire-alarm/history-record/:companyId',
                name: 'historyRecord',
                code: 'dynamicMonitoring.fireAlarm.historyRecordView',
                component: './DynamicMonitoring/FireAlarm/HistoryRecord',
              },
              // { path: '/dynamic-monitoring/fire-alarm/company/detail/:companyId/:detailId', name: 'alarmDetail', component: './DynamicMonitoring/FireAlarm/FireAlarmDetail' },
            ],
          },
        ],
      },

      // device management
      {
        path: '/device-management',
        code: 'deviceManagement',
        icon: 'laptop',
        name: 'deviceManagement',
        routes: [
          {
            path: '/device-management/user-transmission-device',
            code: 'deviceManagement.userTransmissionDevice',
            name: 'userTransmissionDevice',
            hideChildren: true,
            routes: [
              {
                path: '/device-management/user-transmission-device',
                name: 'userTransmissionDevice',
                redirect: '/device-management/user-transmission-device/list',
              },
              {
                path: '/device-management/user-transmission-device/list',
                code: 'deviceManagement.userTransmissionDevice.listView',
                name: 'list',
                component: './DeviceManagement/UserTransmissionDevice/UserTransmissionDevice',
              },
              {
                path: '/device-management/user-transmission-device/:companyId/detail',
                code: 'deviceManagement.userTransmissionDevice.view',
                name: 'deviceDetail',
                component: './DeviceManagement/UserTransmissionDevice/UserTransmissionDeviceDetail',
              },
              {
                path:
                  '/device-management/user-transmission-device/:companyId/import-point-position/:hostId',
                code: 'deviceManagement.userTransmissionDevice.host.importPointPosition',
                name: 'importPointPosition',
                component: './DeviceManagement/UserTransmissionDevice/ImportPointPosition',
              },
            ],
          },
        ],
      },

      // video surveillance
      {
        path: '/video-surveillance',
        code: 'videoSurveillance',
        icon: 'video-camera',
        name: 'videoSurveillance',
        // hideInMenu: true,
        routes: [
          {
            path: '/video-surveillance/map',
            code: 'videoSurveillance.map',
            name: 'map',
            hideChildren: true,
            routes: [
              {
                path: '/video-surveillance/map',
                name: 'map',
                redirect: '/video-surveillance/map/index',
              },
              {
                path: '/video-surveillance/map/index',
                code: 'videoSurveillance.map.view',
                name: 'index',
                component: './VideoSurveillance/Map/Map',
              },
            ],
          },
          {
            path: '/video-surveillance/hik-video-tree',
            code: 'videoSurveillance.hikVideoTree',
            name: 'hikVideoTree',
            hideChildren: true,
            routes: [
              {
                path: '/video-surveillance/hik-video-tree',
                name: 'hikVideoTree',
                redirect: '/video-surveillance/hik-video-tree/videoList',
              },
              {
                path: '/video-surveillance/hik-video-tree/videoList',
                code: 'videoSurveillance.hikVideoTree.listView',
                name: 'videoList',
                component: './VideoSurveillance/HikVideoTree/VideoList',
              },
              {
                path: '/video-surveillance/hik-video-tree/video-detail/:id',
                code: 'videoSurveillance.hikVideoTree.listView',
                name: 'videoDetail',
                component: './VideoSurveillance/HikVideoTree/VideoDetail',
              },
            ],
          },
          {
            path: '/video-surveillance/video-permission',
            code: 'videoSurveillance.videoPermission',
            name: 'videoPermission',
            hideChildren: true,
            routes: [
              {
                path: '/video-surveillance/video-permission',
                name: 'videoPermission',
                redirect: '/video-surveillance/video-permission/list',
              },
              {
                path: '/video-surveillance/video-permission/list',
                code: 'videoSurveillance.videoPermission.listView',
                name: 'list',
                component: './VideoSurveillance/VideoPermission/VideoPermissionList',
              },
              {
                path: '/video-surveillance/video-permission/edit/:companyId',
                code: 'videoSurveillance.videoPermission.edit',
                name: 'edit',
                component: './VideoSurveillance/VideoPermission/VideoPermissionEdit',
              },
              {
                path: '/video-surveillance/video-permission/add',
                code: 'videoSurveillance.videoPermission.add',
                name: 'add',
                component: './VideoSurveillance/VideoPermission/VideoPermissionEdit',
              },
            ],
          },
        ],
      },
      {
        path: '/system-management',
        code: 'systemManagement',
        name: 'systemManagement',
        icon: 'setting',
        hideInMenu: false,
        routes: [
          {
            path: '/system-management/app-management',
            code: 'systemManagement.appManagement',
            name: 'appManagement',
            hideChildren: true,
            routes: [
              {
                path: '/system-management/app-management',
                name: 'appManagement',
                redirect: '/system-management/app-management/list',
              },
              {
                path: '/system-management/app-management/list',
                code: 'systemManagement.appManagement.listView',
                name: 'list',
                component: './SystemManagement/AppManagement/AppManagementList',
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
    ],
  },
];
