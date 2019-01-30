module.exports = env => {
  return [
    // user
    {
      path: '/user',
      // component: '../layouts/UserLayout',
      routes: [
        { path: '/user', redirect: '/user/login' },
        { path: '/user/login', component: './User/NanXiaoLogin' },
        { path: '/user/redirect-login', component: './User/RedirectLogin' },
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
    // 南消
    {
      path: '/nanxiao',
      routes: [
        { path: '/nanxiao', redirect: '/nanxiao/user/login' },
        {
          path: '/nanxiao/user/login',
          component: './User/NanXiaoLogin',
        },
        {
          path: '/nanxiao/download',
          component: './User/NanXiaoDownload',
        },
      ],
    },
    // 利民
    {
      path: '/limin',
      routes: [
        { path: '/limin', redirect: '/limin/user/login' },
        {
          path: '/limin/user/login',
          component: './User/LiMinLogin',
        },
        {
          path: '/limin/download',
          component: './User/LiMinDownload',
        },
      ],
    },
    //big platform
    {
      path: '/big-platform',
      routes: [
        { path: '/big-platform', redirect: '/big-platform/safety/government/index' },
        {
          path: '/big-platform/safety/government/:gridId',
          component: './BigPlatform/Safety/Government',
        },
        {
          path: '/big-platform/safety/company/:companyId',
          component: './BigPlatform/Safety/Company2',
        },
        {
          path: '/big-platform/fire-control/government/:gridId',
          component: './BigPlatform/FireControl/Government',
        },
        {
          path: '/big-platform/new-fire-control/government/:gridId',
          component: './BigPlatform/NewFireControl/Government',
        },
        {
          path: '/big-platform/fire-control/company/:unitId',
          component: './BigPlatform/UnitFireControl/UnitFireControl',
        },
        {
          path: '/big-platform/fire-control/new-company/:unitId',
          component: './BigPlatform/NewUnitFireControl',
        },
        {
          path: '/big-platform/monitor/company/:companyId',
          component: './BigPlatform/Monitor/Company',
        },
        {
          path: '/big-platform/video',
          component: './BigPlatform/Video',
        },
        {
          path: '/big-platform/position/:companyId',
          component: './BigPlatform/Position/RealTime',
        },
        {
          path: '/big-platform/position/:companyId/history/:id',
          component: './BigPlatform/Position/History',
        },
        {
          path: '/big-platform/electricity-monitor/:gridId',
          component: './BigPlatform/ElectricityMonitor',
        },
      ],
    },

    // {
    //   path: '/demo',
    //   component: './Demo',
    // },
    // 档案分析报告
    {
      path: '/training/myFile/analysisReport/:id',
      code: 'training.myFile.view',
      name: 'myAnalysis',
      component: './Training/MyFile/AnalysisReport',
    },
    {
      path: '/training/myFile/synthesisReport',
      code: 'training.myFile.view',
      name: 'mySynthesis',
      component: './Training/MyFile/SynthesisReport',
    },
    {
      path: '/training/generalFile/examFileReport/:id',
      code: 'training.generalFile.view',
      name: 'examReport',
      component: './Training/GeneralFile/ExamFile/ExamFileReport',
    },
    {
      path: '/training/generalFile/myFile/analysisReport/:id',
      code: 'training.generalFile.view',
      name: 'myAnalysis',
      component: './Training/GeneralFile/MyFile/AnalysisReport',
    },
    {
      path: '/training/generalFile/myFile/synthesisReport',
      code: 'training.generalFile.view',
      name: 'mySynthesis',
      component: './Training/GeneralFile/MyFile/SynthesisReport',
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
        {
          path: '/',
          redirect: env === 'nanxiao' ? '/fire-control/maintenance-company' : '/dashboard/view',
        }, // '/dashboard/view'
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
            // {
            //   path: '/fire-control/test-info',
            //   code: 'fireControl.testInfo',
            //   name: 'testInfo',
            //   hideChildrenInMenu: true,
            //   routes: [
            //     {
            //       path: '/fire-control/test-info',
            //       name: 'testInfo',
            //       redirect: '/fire-control/test-info/list',
            //     },
            //     {
            //       path: '/fire-control/test-info/list',
            //       code: 'fireControl.testInfo.view',
            //       name: 'list',
            //       component: './FireControl/TestInfo/TestList',
            //     },
            //     {
            //       path: '/fire-control/test-info/detail/:id',
            //       code: 'fireControl.testInfo.view',
            //       name: 'detail',
            //       component: './FireControl/TestInfo/TestDetail',
            //     },
            //   ],
            // },
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
                {
                  path: '/data-analysis/IOT-abnormal-data/smoke-detector/:id/count/:count',
                  code: 'dataAnalysis.IOTAbnormalData.smokeDetector',
                  name: 'smokeDetector',
                  component: './DataAnalysis/SmokeDetector',
                },
              ],
            },
            {
              path: '/data-analysis/test-info',
              code: 'dataAnalysis.testInfo',
              name: 'testInfo',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/data-analysis/test-info',
                  name: 'testInfo',
                  redirect: '/data-analysis/test-info/list',
                },
                {
                  path: '/data-analysis/test-info/list',
                  code: 'dataAnalysis.testInfo.view',
                  name: 'list',
                  component: './DataAnalysis/TestInfo/TestList',
                },
                {
                  path: '/data-analysis/test-info/detail/:id',
                  code: 'dataAnalysis.testInfo.view',
                  name: 'detail',
                  component: './DataAnalysis/TestInfo/TestDetail',
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
            {
              path: '/data-analysis/hidden-danger-report',
              code: 'dataAnalysis.hiddenDangerReport',
              name: 'hiddenDangerReport',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/data-analysis/hidden-danger-report',
                  name: 'hiddenDangerReport',
                  redirect: '/data-analysis/hidden-danger-report/list',
                },
                {
                  path: '/data-analysis/hidden-danger-report/list',
                  code: 'dataAnalysis.hiddenDangerReport.view',
                  name: 'list',
                  component: './DataAnalysis/HiddenDangerReport/HiddenDangerReportList',
                },
                {
                  path: '/data-analysis/hidden-danger-report/detail/:id',
                  code: 'dataAnalysis.hiddenDangerReport.view',
                  name: 'detail',
                  component: './DataAnalysis/HiddenDangerReport/HiddenDangerReportDetail',
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
                  component:
                    './DeviceManagement/UserTransmissionDevice/UserTransmissionDeviceDetail',
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

        // 执行检查
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
          path: '/law-enforcement',
          code: 'lawEnforcement',
          icon: 'project',
          name: 'lawEnforcement',
          routes: [
            // laws
            {
              path: '/law-enforcement/laws',
              code: 'lawEnforcement.laws',
              name: 'laws',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/law-enforcement/laws',
                  name: 'laws',
                  redirect: '/law-enforcement/laws/list',
                },
                {
                  path: '/law-enforcement/laws/list',
                  code: 'lawEnforcement.laws.listView',
                  name: 'listView',
                  component: './LawEnforcement/Laws/LawDatabaseList',
                },
                {
                  path: '/law-enforcement/laws/add',
                  code: 'lawEnforcement.laws.add',
                  name: 'add',
                  component: './LawEnforcement/Laws/LawDatabaseEdit',
                },
                {
                  path: '/law-enforcement/laws/edit/:id',
                  code: 'lawEnforcement.laws.edit',
                  name: 'edit',
                  component: './LawEnforcement/Laws/LawDatabaseEdit',
                },
                {
                  path: '/law-enforcement/laws/detail/:id',
                  code: 'lawEnforcement.laws.view',
                  name: 'view',
                  component: './LawEnforcement/Laws/LawDatabaseDetail',
                },
              ],
            },
            // illegal
            {
              path: '/law-enforcement/illegal',
              code: 'lawEnforcement.illegal',
              name: 'illegal',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/law-enforcement/illegal',
                  name: 'illegal',
                  redirect: '/law-enforcement/illegal/list',
                },
                {
                  path: '/law-enforcement/illegal/list',
                  code: 'lawEnforcement.illegal.listView',
                  name: 'listView',
                  component: './LawEnforcement/Illegal/IllegalDatabaseList',
                },
                {
                  path: '/law-enforcement/illegal/add',
                  code: 'lawEnforcement.illegal.add',
                  name: 'add',
                  component: './LawEnforcement/Illegal/IllegalDatabaseEdit',
                },
                {
                  path: '/law-enforcement/illegal/edit/:id',
                  code: 'lawEnforcement.illegal.edit',
                  name: 'edit',
                  component: './LawEnforcement/Illegal/IllegalDatabaseEdit',
                },
                {
                  path: '/law-enforcement/illegal/detail/:id',
                  code: 'lawEnforcement.illegal.view',
                  name: 'view',
                  component: './LawEnforcement/Illegal/IllegalDatabaseDetail',
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
        {
          name: 'training',
          icon: 'read',
          code: 'training',
          path: '/training',
          hideInMenu: false,
          routes: [
            {
              name: 'knowledgeSys',
              path: '/training/knowledgeSys',
              code: 'training.points',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/training/knowledgeSys',
                  code: 'training.knowledgeSys.view',
                  name: 'KnowledgeSys',
                  component: './Training/KnowledgeSys/KnowledgeSys',
                },
              ],
            },
            {
              name: 'library',
              path: '/training/library',
              code: 'training.library',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/training/library',
                  name: 'library',
                  redirect: '/training/library/questions/list',
                },
                {
                  path: '/training/library/:type/list',
                  code: 'training.library.listView',
                  name: 'list',
                  component: './Training/Library/LibraryLayout',
                },
                {
                  path: '/training/library/questions/add',
                  code: 'training.library.add',
                  name: 'questionsAdd',
                  component: './Training/Library/Questions/QuestionsAdd',
                },
                {
                  path: '/training/library/questions/edit/:id',
                  code: 'training.library.edit',
                  name: 'questionsEdit',
                  component: './Training/Library/Questions/QuestionsAdd',
                },
                {
                  path: '/training/library/article/add',
                  code: 'training.library.add',
                  name: 'articleAdd',
                  component: './Training/Library/Article/ArticleAdd',
                },
                {
                  path: '/training/library/article/edit/:id',
                  code: 'training.library.edit',
                  name: 'articleEdit',
                  component: './Training/Library/Article/ArticleAdd',
                },
                {
                  path: '/training/library/courseware/add',
                  code: 'training.library.add',
                  name: 'coursewareAdd',
                  component: './Training/Library/Courseware/CoursewareAdd',
                },
                {
                  path: '/training/library/courseware/edit/:id',
                  code: 'training.library.edit',
                  name: 'coursewareEdit',
                  component: './Training/Library/Courseware/CoursewareAdd',
                },
              ],
            },
            // 学习管理
            {
              name: 'learning',
              path: '/training/learning',
              code: 'training.learning',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/training/learning',
                  name: 'list',
                  redirect: '/training/learning/article/list',
                },
                {
                  path: '/training/learning/:type/list',
                  code: 'training.learning.view',
                  name: 'list',
                  component: './Training/Learning/LearningLayout',
                },
                {
                  path: '/training/learning/article/detail/:id',
                  code: 'training.learning.view',
                  name: 'article',
                  component: './Training/Learning/Article/ArticleDeatil',
                },
                {
                  path: '/training/learning/courseware/detail/:id',
                  code: 'training.learning.view',
                  name: 'courseware',
                  component: './Training/Learning/Courseware/CoursewareDetail',
                },
              ],
            },
            {
              name: 'examinationPaper',
              path: '/training/examination-paper',
              code: 'training.examinationPaper',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/training/examination-paper',
                  name: 'examinationPaper',
                  redirect: '/training/examination-paper/list',
                },
                {
                  path: '/training/examination-paper/list',
                  code: 'training.examinationPaper.listView',
                  name: 'list',
                  component: './Training/ExaminationPaper/List',
                },
                {
                  path: '/training/examination-paper/detail/:id',
                  code: 'training.examinationPaper.view',
                  name: 'view',
                  component: './Training/ExaminationPaper/Detail',
                },
                {
                  path: '/training/examination-paper/add',
                  code: 'training.examinationPaper.add',
                  name: 'add',
                  component: './Training/ExaminationPaper/Handler',
                },
                {
                  path: '/training/examination-paper/edit/:id',
                  code: 'training.examinationPaper.edit',
                  name: 'edit',
                  component: './Training/ExaminationPaper/Handler',
                },
                {
                  path: '/training/examination-paper/preview/:id',
                  code: 'training.examinationPaper.view',
                  name: 'view',
                  component: './Training/ExaminationPaper/Preview',
                },
              ],
            },
            {
              name: 'mission',
              path: '/training/mission',
              code: 'training.mission',
              hideChildrenInMenu: true,
              routes: [
                {
                  name: 'mission',
                  path: '/training/mission',
                  redirect: '/training/mission/list',
                },
                {
                  name: 'list',
                  path: '/training/mission/list',
                  code: 'training.mission.listView',
                  component: './Training/Mission/ExaminationMissionList',
                },
                {
                  name: 'add',
                  path: '/training/mission/add',
                  code: 'training.mission.add',
                  component: './Training/Mission/ExaminationMissionAdd',
                },
                {
                  name: 'edit',
                  path: '/training/mission/edit/:id',
                  code: 'training.mission.edit',
                  component: './Training/Mission/ExaminationMissionAdd',
                },
                {
                  name: 'detail',
                  path: '/training/mission/view/:id',
                  code: 'training.mission.view',
                  component: './Training/Mission/ExaminationMissionDetail',
                },
              ],
            },
            {
              name: 'myExam',
              path: '/training/my-exam',
              code: 'training.myExam',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/training/my-exam',
                  name: 'myExam',
                  redirect: '/training/my-exam/list',
                },
                {
                  path: '/training/my-exam/list',
                  code: 'training.myExam.listView',
                  name: 'list',
                  component: './Training/MyExam/ExamList',
                },
                {
                  path: '/training/my-exam/examing/:id',
                  code: 'training.myExam.listView',
                  name: 'examing',
                  component: './Training/MyExam/Examing',
                },
                {
                  path: '/training/my-exam/result/:id',
                  code: 'training.myExam.listView',
                  name: 'result',
                  component: './Training/MyExam/Result',
                },
              ],
            },
            // 我的档案
            {
              name: 'myFile',
              path: '/training/myFile',
              code: 'training.myFile',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/training/myFile',
                  name: 'myFile',
                  redirect: '/training/myFile/myFileList',
                },
                {
                  path: '/training/myFile/myFileList',
                  code: 'training.myFile.view',
                  name: 'myFile',
                  component: './Training/MyFile/MyFileList',
                },
                {
                  path: '/training/myFile/myAnalysis/:id',
                  code: 'training.myFile.view',
                  name: 'myAnalysis',
                  component: './Training/MyFile/MyAnalysis',
                },
                {
                  path: '/training/myFile/mySynthesis',
                  code: 'training.myFile.view',
                  name: 'mySynthesis',
                  component: './Training/MyFile/MySynthesis',
                },
              ],
            },
            // 综合档案
            {
              name: 'generalFile',
              path: '/training/generalFile',
              code: 'training.generalFile',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/training/generalFile',
                  name: 'list',
                  redirect: '/training/generalFile/examFile/list',
                },
                {
                  path: '/training/generalFile/:type/list',
                  code: 'training.generalFile.view',
                  name: 'list',
                  component: './Training/GeneralFile/GeneralFileLayout',
                },
                {
                  path: '/training/generalFile/examDetailList/:id',
                  code: 'training.generalFile.view',
                  name: 'examDetailList',
                  component: './Training/GeneralFile/ExamFile/ExamDetailList',
                },
                {
                  path: '/training/generalFile/examReport/:id',
                  code: 'training.generalFile.view',
                  name: 'examReport',
                  component: './Training/GeneralFile/ExamFile/ExamReport',
                },
                /**综合档案-我的档案 */
                {
                  path: '/training/generalFile/myFile/myFileList',
                  code: 'training.generalFile.view',
                  name: 'personFile',
                  component: './Training/GeneralFile/MyFile/MyFileList',
                },
                {
                  path: '/training/generalFile/myFile/myAnalysis/:id',
                  code: 'training.generalFile.view',
                  name: 'myAnalysis',
                  component: './Training/GeneralFile/MyFile/MyAnalysis',
                },
                {
                  path: '/training/generalFile/myFile/mySynthesis',
                  code: 'training.generalFile.view',
                  name: 'mySynthesis',
                  component: './Training/GeneralFile/MyFile/MySynthesis',
                },
              ],
            },
          ],
        },
        // 人员定位
        {
          name: 'personnelPosition',
          path: '/personnel-position',
          icon: 'environment',
          code: 'personnelPosition',
          hideInMenu: false,
          routes: [
            /* 系统配置 */
            {
              name: 'systemConfiguration',
              path: '/personnel-position/system-configuration',
              code: 'personnelPosition.systemConfiguration',
              hideChildrenInMenu: true,
              routes: [
                {
                  name: 'list',
                  path: '/personnel-position/system-configuration',
                  redirect: '/personnel-position/system-configuration/list',
                },
                {
                  name: 'list',
                  code: 'personnelPosition.systemConfiguration.listView',
                  path: '/personnel-position/system-configuration/list',
                  component: './PersonnelPosition/SystemConfiguration/SystemConfigurationList',
                },
              ],
            },
            /* 建筑物信息 */
            {
              name: 'buildingsInfo',
              path: '/personnel-position/buildings-info',
              code: 'personnelPosition.buildingsInfo',
              hideChildrenInMenu: true,
              routes: [
                {
                  name: 'list',
                  path: '/personnel-position/buildings-info',
                  redirect: '/personnel-position/buildings-info/list',
                },
                {
                  name: 'list',
                  code: 'personnelPosition.buildingsInfo.listView',
                  path: '/personnel-position/buildings-info/list',
                  component: './PersonnelPosition/BuildingsInfo/CompanyList',
                },
                {
                  name: 'view',
                  code: 'personnelPosition.buildingsInfo.view',
                  path: '/personnel-position/buildings-info/detail/:id',
                  component:
                    './PersonnelPosition/BuildingsInfo/CompanyBuildingInfo/BuildingInfoList',
                },
                {
                  name: 'add',
                  code: 'personnelPosition.buildingsInfo.add',
                  path: '/personnel-position/buildings-info/add',
                  component:
                    './PersonnelPosition/BuildingsInfo/CompanyBuildingInfo/BuildingInfoEdit',
                },
                {
                  name: 'edit',
                  code: 'personnelPosition.buildingsInfo.edit',
                  path: '/personnel-position/buildings-info/edit/:id',
                  component:
                    './PersonnelPosition/BuildingsInfo/CompanyBuildingInfo/BuildingInfoEdit',
                },
                {
                  name: 'floorList',
                  code: 'personnelPosition.buildingsInfo.floorListView',
                  path: '/personnel-position/buildings-info/floor/list/:id',
                  component:
                    './PersonnelPosition/BuildingsInfo/FloorManagement/FloorManagementList',
                },
                {
                  name: 'floorAdd',
                  code: 'personnelPosition.buildingsInfo.floorAdd',
                  path: '/personnel-position/buildings-info/floor/add',
                  component:
                    './PersonnelPosition/BuildingsInfo/FloorManagement/FloorManagementEdit',
                },
                {
                  name: 'floorEdit',
                  code: 'personnelPosition.buildingsInfo.floorEdit',
                  path: '/personnel-position/buildings-info/floor/edit/:id',
                  component:
                    './PersonnelPosition/BuildingsInfo/FloorManagement/FloorManagementEdit',
                },
                {
                  name: 'floorDetail',
                  code: 'personnelPosition.buildingsInfo.floorView',
                  path: '/personnel-position/buildings-info/floor/detail/:id',
                  component:
                    './PersonnelPosition/BuildingsInfo/FloorManagement/FloorManagementDetail',
                },
              ],
            },
            /* 信标管理 */
            {
              name: 'beaconManagement',
              path: '/personnel-position/beacon-management',
              code: 'personnelPosition.beaconManagement',
              hideChildrenInMenu: true,
              routes: [
                {
                  name: 'companies',
                  path: '/personnel-position/beacon-management',
                  redirect: '/personnel-position/beacon-management/companies',
                },
                {
                  name: 'companies',
                  code: 'personnelPosition.beaconManagement.listView',
                  path: '/personnel-position/beacon-management/companies',
                  component: './PersonnelPosition/BeaconManagement/index',
                },
                {
                  name: 'companyBeacon',
                  code: 'personnelPosition.beaconManagement.companyBeacon',
                  path: '/personnel-position/beacon-management/company/:id',
                  component: './PersonnelPosition/BeaconManagement/CompanyBeacon',
                },
              ],
            },
            /* 标签管理 */
            {
              name: 'tagManagement',
              path: '/personnel-position/tag-management',
              code: 'personnelPosition.tagManagement',
              hideChildrenInMenu: true,
              routes: [
                {
                  name: 'list',
                  path: '/personnel-position/tag-management',
                  redirect: '/personnel-position/tag-management/list',
                },
                {
                  name: 'list',
                  path: '/personnel-position/tag-management/list',
                  code: 'personnelPosition.tagManagement.listView',
                  component: './PersonnelPosition/TagManagement/TagManagementList',
                },
                {
                  name: 'add',
                  path: '/personnel-position/tag-management/add',
                  code: 'personnelPosition.tagManagement.add',
                  component: './PersonnelPosition/TagManagement/TagManagementAdd',
                },
                {
                  name: 'edit',
                  path: '/personnel-position/tag-management/edit/:id',
                  code: 'personnelPosition.tagManagement.edit',
                  component: './PersonnelPosition/TagManagement/TagManagementAdd',
                },
                {
                  name: 'detail',
                  path: '/personnel-position/tag-management/detail',
                  code: 'personnelPosition.tagManagement.view',
                  component: './PersonnelPosition/TagManagement/TagManagementDetail',
                },
              ],
            },
            // 报警管理
            {
              name: 'alarmManagement',
              path: '/personnel-position/alarm-management',
              code: 'personnelPosition.alarmManagement',
              hideChildrenInMenu: true,
              routes: [
                {
                  name: 'index',
                  path: '/personnel-position/alarm-management',
                  redirect: '/personnel-position/alarm-management/index',
                },
                {
                  name: 'index',
                  path: '/personnel-position/alarm-management/index',
                  code: 'personnelPosition.alarmManagement.companyListView',
                  component: './PersonnelPosition/AlarmManagement/CompanyList',
                },
                {
                  name: 'alarmList',
                  path: '/personnel-position/alarm-management/list/:companyId',
                  code: 'personnelPosition.alarmManagement.alarmListView',
                  component: './PersonnelPosition/AlarmManagement/AlarmList',
                },
                {
                  name: 'add',
                  path: '/personnel-position/alarm-management/add/:companyId',
                  code: 'personnelPosition.alarmManagement.add',
                  component: './PersonnelPosition/AlarmManagement/AlarmAddOrEdit',
                },
                {
                  name: 'edit',
                  path: '/personnel-position/alarm-management/edit/:companyId/:alarmId',
                  code: 'personnelPosition.alarmManagement.edit',
                  component: './PersonnelPosition/AlarmManagement/AlarmAddOrEdit',
                },
                {
                  name: 'detail',
                  path: '/personnel-position/alarm-management/detail/:companyId/:alarmId',
                  code: 'personnelPosition.alarmManagement.view',
                  component: './PersonnelPosition/AlarmManagement/AlarmDetail',
                },
              ],
            },
            /* 地图管理 */
            // {
            //   name: 'map',
            //   path: '/personnel-position/map-management',
            //   code: 'personnelPosition.mapManagement',
            //   hideChildrenInMenu: true,
            //   routes: [
            //     {
            //       name: 'list',
            //       path: '/personnel-position/map-management',
            //       redirect: '/personnel-position/map-management/list',
            //     },
            //     {
            //       name: 'list',
            //       path: '/personnel-position/map-management/list',
            //       code: 'personnelPosition.mapManagement.listView',
            //       component: './PersonnelPosition/Map/MapManagementList',
            //     },
            //     {
            //       name: 'companyMap',
            //       path: '/personnel-position/map-management/company-map/:id',
            //       code: 'personnelPosition.mapManagement.companyMap',
            //       component: './PersonnelPosition/Map/CompanyMap',
            //     },
            //   ],
            // },
            /* 区域管理 */
            {
              name: 'sectionManagement',
              path: '/personnel-position/section-management',
              code: 'personnelPosition.sectionManagement',
              hideChildrenInMenu: true,
              routes: [
                {
                  name: 'companies',
                  path: '/personnel-position/section-management',
                  redirect: '/personnel-position/section-management/companies',
                },
                {
                  name: 'companies',
                  code: 'personnelPosition.sectionManagement.companies',
                  path: '/personnel-position/section-management/companies',
                  component: './PersonnelPosition/SectionManagement/index',
                },
                {
                  name: 'list',
                  code: 'personnelPosition.sectionManagement.listView',
                  path: '/personnel-position/section-management/company/:id',
                  component: './PersonnelPosition/SectionManagement/CompanySections',
                },
                {
                  name: 'zoning',
                  code: 'personnelPosition.sectionManagement.divide',
                  path: '/personnel-position/section-management/company/:companyId/zoning/:id',
                  component: './PersonnelPosition/SectionManagement/Zoning',
                },
              ],
            },
          ],
        },
      ],
    },
  ];
};
