module.exports = [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: '/User/Login' },
      { path: '/user/redirect-login', component: '/User/RedirectLogin' },
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
  //big platform
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
        path: '/big-platform/fire-control/company/:unitId',
        component: './BigPlatform/UnitFireControl/UnitFireControl',
      },
      {
        path: '/big-platform/monitor/company/:companyId',
        component: './BigPlatform/Monitor/Company',
      },
    ],
  },
  //404
  {
    path: '/404',
    component: './404',
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    /* 权限组件，当渲染该路径时渲染Authorized组件，而BasicLayout为其children，在该组件中判断权限，
     * 若没权限，则渲染noMatch对应的组件，一般会选择一个403页面(整个页面渲染为403)，若想显示菜单栏则只能单独再引入一个BasicLayout，将403页面放在里面，
     * 若有权限，则渲染children，即BasicLayout组件
     */
    // Routes: ['src/pages/Authorized'],
    routes: [
      { path: '/', redirect: '/dashboard/view' },
      {
        path: '/dashboard',
        icon: 'home',
        code: 'dashboard',
        name: 'dashboard',
        hideChildrenInMenuInMenu: true,
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
      {
        path: '/grid',
        code: 'grid',
        name: 'grid',
        hideInMenu: true,
        routes: [
          {
            path: '/grid',
            redirect: '/grid/:id/map',
          },
          {
            path: '/grid/:id/map',
            code: 'grid.map',
            name: 'view',
            component: './Grid/Map',
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
        icon: 'file-text',
        routes: [
          {
            path: '/base-info/company',
            code: 'baseInfo.company',
            name: 'company',
            hideChildrenInMenu: true,
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
            hideChildrenInMenu: true,
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
            hideChildrenInMenu: true,
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
                component: './FireControl/MaintenanceCompany/MaintenanceCompanyHandler',
              },
              {
                path: '/fire-control/maintenance-company/edit/:id',
                code: 'fireControl.maintenanceCompany.edit',
                name: 'edit',
                component: './FireControl/MaintenanceCompany/MaintenanceCompanyHandler',
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
              {
                path: '/fire-control/maintenance-company/serviceList/:id/detail/:companyId',
                code: 'fireControl.maintenanceCompany.serviceUnitView',
                name: 'serviceDetail',
                component: './FireControl/MaintenanceCompany/ServiceDetail',
              },
            ],
          },
          {
            path: '/fire-control/test-info',
            code: 'fireControl.testInfo',
            name: 'testInfo',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/fire-control/test-info',
                name: 'testInfo',
                redirect: '/fire-control/test-info/list',
              },
              {
                path: '/fire-control/test-info/list',
                code: 'fireControl.testInfo.view',
                name: 'list',
                component: './FireControl/TestInfo/TestList',
              },
              {
                path: '/fire-control/test-info/detail/:id',
                code: 'fireControl.testInfo.view',
                name: 'detail',
                component: './FireControl/TestInfo/TestDetail',
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
            hideChildrenInMenu: true,
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
            hideChildrenInMenu: true,
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
      // exception
      // {
      //   name: 'exception',
      //   icon: 'warning',
      //   path: '/exception',
      //   hideInMenu: true,
      //   routes: [
      //     { path: '/exception/403', name: 'not-permission', component: './Exception/403' },
      //     { path: '/exception/404', name: 'not-find', component: './Exception/404' },
      //     { path: '/exception/500', name: 'server-error', component: './Exception/500' },
      //     {
      //       path: '/exception/trigger',
      //       name: 'trigger',
      //       hideInMenu: true,
      //       component: './Exception/triggerException',
      //     },
      //   ],
      // },
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
            hideChildrenInMenu: true,
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

      // data analysis
      {
        path: '/data-analysis',
        code: 'dataAnalysis',
        name: 'dataAnalysis',
        icon: 'experiment',
        // component: './DataAnalysis/DataAnalysisLayout',
        routes: [
          {
            path: '/data-analysis/IOT-abnormal-data',
            code: 'dataAnalysis.IOTAbnormalData',
            name: 'IOTAbnormalData',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/data-analysis/IOT-abnormal-data',
                name: 'IOTAbnormalData',
                redirect: '/data-analysis/IOT-abnormal-data/list',
              },
              {
                path: '/data-analysis/IOT-abnormal-data/list',
                code: 'dataAnalysis.IOTAbnormalData.listView',
                name: 'list',
                component: './DataAnalysis/DataAnalysisList',
              },
              {
                path: '/data-analysis/IOT-abnormal-data/electricity/:id/count/:count',
                code: 'dataAnalysis.IOTAbnormalData.electricity',
                name: 'electricity',
                component: './DataAnalysis/Electricity',
              },
              {
                path: '/data-analysis/IOT-abnormal-data/toxic-gas/:id/count/:count',
                code: 'dataAnalysis.IOTAbnormalData.toxicGas',
                name: 'toxicGas',
                component: './DataAnalysis/ToxicGas',
              },
              {
                path: '/data-analysis/IOT-abnormal-data/waste-water/:id/count/:count',
                code: 'dataAnalysis.IOTAbnormalData.wasteWater',
                name: 'wasteWater',
                component: './DataAnalysis/WasteWater',
              },
              {
                path: '/data-analysis/IOT-abnormal-data/waste-gas/:id/count/:count',
                code: 'dataAnalysis.IOTAbnormalData.wasteGas',
                name: 'wasteGas',
                component: './DataAnalysis/WasteGas',
              },
              {
                path: '/data-analysis/IOT-abnormal-data/storage-tank/:id/count/:count',
                code: 'dataAnalysis.IOTAbnormalData.storageTank',
                name: 'storageTank',
                component: './DataAnalysis/StorageTank',
              },
            ],
          },
          {
            path: '/data-analysis/maintenance-record',
            code: 'dataAnalysis.maintenanceRecord',
            name: 'maintenanceRecord',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/data-analysis/maintenance-record',
                name: 'maintenanceRecord',
                redirect: '/data-analysis/maintenance-record/list',
              },
              {
                path: '/data-analysis/maintenance-record/list',
                code: 'dataAnalysis.maintenanceRecord.view',
                name: 'listView',
                component: './DataAnalysis/MaintenanceRecord/MaintenanceRecordList',
              },
              {
                path: '/data-analysis/maintenance-record/detail/:id',
                code: 'dataAnalysis.maintenanceRecord.view',
                name: 'detail',
                component: './DataAnalysis/MaintenanceRecord/MaintenanceRecordDetail',
              },
            ],
          },
          {
            path: '/data-analysis/repair-record',
            code: 'dataAnalysis.repairRecord',
            name: 'repairRecord',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/data-analysis/repair-record',
                name: 'repairRecord',
                redirect: '/data-analysis/repair-record/list',
              },
              {
                path: '/data-analysis/repair-record/list',
                code: 'dataAnalysis.repairRecord.view',
                name: 'list',
                component: './DataAnalysis/RepairRecord/RepairRecordList',
              },
              {
                path: '/data-analysis/repair-record/detail/:id',
                code: 'dataAnalysis.repairRecord.view',
                name: 'detail',
                component: './DataAnalysis/RepairRecord/RepairRecordDetail',
              },
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
            hideChildrenInMenu: true,
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
              {
                path: '/device-management/user-transmission-device/add',
                code: 'deviceManagement.userTransmissionDevice.add',
                name: 'add',
                component: './DeviceManagement/UserTransmissionDevice/TransmissionDeviceAdd',
              },
            ],
          },
          // 视频监控
          {
            path: '/device-management/video-monitor',
            code: 'deviceManagement.videoMonitor',
            name: 'videoMonitor',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/device-management/video-monitor',
                name: 'videoMonitor',
                redirect: '/device-management/video-monitor/list',
              },
              {
                path: '/device-management/video-monitor/list',
                code: 'deviceManagement.videoMonitor.listView',
                name: 'listView',
                component: './DeviceManagement/VideoMonitor/VideoMonitorList',
              },
              {
                path: '/device-management/video-monitor/add',
                code: 'deviceManagement.videoMonitor.add',
                name: 'add',
                component: './DeviceManagement/VideoMonitor/VideoMonitorEdit',
              },
              {
                path: '/device-management/video-monitor/edit/:id',
                code: 'deviceManagement.videoMonitor.edit',
                name: 'edit',
                component: './DeviceManagement/VideoMonitor/VideoMonitorEdit',
              },
              {
                path: '/device-management/video-monitor/video-equipment/:companyId',
                code: 'deviceManagement.videoMonitor.view',
                name: 'view',
                component: './DeviceManagement/VideoMonitor/VideoEquipmentList',
              },
              {
                path: '/device-management/video-monitor/:companyId/detail/:id',
                code: 'deviceManagement.videoMonitor.view',
                name: 'detail',
                component: './DeviceManagement/VideoMonitor/VideoMonitorDetail',
              },
              // { path: '/dynamic-monitoring/fire-alarm/company/detail/:companyId/:detailId', name: 'alarmDetail', component: './DynamicMonitoring/FireAlarm/FireAlarmDetail' },
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
            hideChildrenInMenu: true,
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
            hideChildrenInMenu: true,
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
            hideChildrenInMenu: true,
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
            hideChildrenInMenu: true,
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
          {
            path: '/system-management/page-authority',
            code: 'systemManagement.pageAuthority',
            name: 'pageAuthority',
            hideChildrenInMenu: true,
            routes: [
              {
                path: '/system-management/page-authority',
                name: 'pageAuthority',
                redirect: '/system-management/page-authority/index',
              },
              {
                path: '/system-management/page-authority/index',
                code: 'systemManagement.pageAuthority.view',
                name: 'view',
                component: './SystemManagement/PageAuthority/PageAuthority',
              },
              {
                path: '/system-management/page-authority/add-or-edit/:id',
                code: 'systemManagement.pageAuthority.edit',
                name: 'edit',
                component: './SystemManagement/PageAuthority/PageAuthorityAddOrEdit',
              },
            ],
          },
        ],
      },
      // {
      //   path: '/database-input',
      //   code: 'databaseInput',
      //   name: 'databaseInput',
      //   icon: 'database',
      //   hideInMenu: true,
      //   routes: [
      //     {
      //       path: '/database-input/pageAuthority',
      //       code: 'databaseInput.pageAuthority',
      //       name: 'pageAuthority',
      //       hideChildrenInMenu: true,
      //       routes: [
      //         {
      //           path: '/database-input/pageAuthority',
      //           name: 'pageAuthority',
      //           redirect: '/database-input/pageAuthority/index',
      //         },
      //         {
      //           path: '/database-input/pageAuthority/index',
      //           code: 'databaseInput.pageAuthority.view',
      //           name: 'view',
      //           component: './DatabaseInput/PageAuthority',
      //         },
      //         {
      //           path: '/database-input/pageAuthority/addOrEdit/:id',
      //           code: 'databaseInput.pageAuthority.edit',
      //           name: 'edit',
      //           component: './DatabaseInput/PageAuthorityAddOrEdit',
      //         },
      //       ],
      //     },
      //   ],
      // },
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
