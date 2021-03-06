module.exports = env => {
  return [
    // user
    {
      path: '/user',
      // component: '../layouts/UserLayout',
      routes: [
        { path: '/user', redirect: '/user/login' },
        { path: '/user/login', component: './User/Login' },
        { path: '/user/download', component: './User/Download' },
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
    //big platform
    {
      path: '/big-platform',
      component: '../layouts/BigPlatformAuthLayout',
      routes: [
        { path: '/big-platform', redirect: '/big-platform/safety/government/index' },
        {
          path: '/big-platform/chemical/:unitId',
          code: 'dashboard.chemical',
          name: 'chemical',
          component: './BigPlatform/ChemicalV2',
        },
        {
          path: '/big-platform/safety/government/:gridId',
          code: 'dashboard.safetyView',
          name: 'governmentSafety',
          component: './BigPlatform/Safety/Government',
        },
        {
          path: '/big-platform/safety/company/:companyId',
          code: 'dashboard.safetyView',
          name: 'companySafety',
          component: './BigPlatform/Safety/Company3',
        },
        // {
        //   path: '/big-platform/fire-control/government/:gridId',
        //   component: './BigPlatform/FireControl/Government',
        // },
        {
          path: '/big-platform/new-fire-control/government/:gridId',
          code: 'dashboard.fireControlView',
          name: 'newFireControl',
          component: './BigPlatform/NewFireControl/Government',
        },
        // {
        //   path: '/big-platform/fire-control/company/:unitId',
        //   component: './BigPlatform/UnitFireControl/UnitFireControl',
        // },
        {
          path: '/big-platform/fire-control/company/:unitId',
          code: 'dashboard.fireControlView',
          name: 'fireControl',
          component: './BigPlatform/UnitFire/UnitFireControl',
        },
        {
          path: '/big-platform/fire-control/new-company/:unitId',
          code: 'dashboard.fireMaintenanceView',
          name: 'fireMaintenance',
          component: './BigPlatform/NewUnitFireControl',
        },
        {
          path: '/big-platform/monitor/company/:companyId',
          code: 'dashboard.dynamicMonitorView',
          name: 'dynamicMonitor',
          component: './BigPlatform/Monitor/Company',
        },
        // {
        //   path: '/big-platform/video',
        //   component: './BigPlatform/Video',
        // },
        {
          path: '/big-platform/position/:companyId',
          code: 'dashboard.personnelPositioningView',
          name: 'personnelPositioning',
          component: './BigPlatform/Position/index',
        },
        // {
        //   path: '/big-platform/position/:companyId/history/:id',
        //   component: './BigPlatform/Position/History',
        // },
        {
          path: '/big-platform/electricity-monitor/:gridId',
          code: 'dashboard.electricityMonitorView',
          name: 'electricityMonitor',
          component: './BigPlatform/ElectricityMonitor',
        },
        {
          path: '/big-platform/gas/:gridId',
          code: 'dashboard.gasView',
          name: 'gas',
          component: './BigPlatform/Gas',
        },
        {
          path: '/big-platform/smoke/:gridId',
          code: 'dashboard.smokeView',
          name: 'smoke',
          component: './BigPlatform/Smoke',
        },
        {
          path: '/big-platform/operation',
          code: 'dashboard.operationView',
          name: 'operation',
          component: './BigPlatform/Operation',
        },
        {
          path: '/big-platform/3d-gis',
          code: 'dashboard.threedgis',
          name: 'threedgis',
          component: './BigPlatform/Threedgis',
        },
        {
          path: '/big-platform/gas-station/:unitId',
          code: 'dashboard.gasStation',
          name: 'gasStation',
          component: './BigPlatform/GasStation',
        },
      ],
    },
    // 档案分析报告
    // TODO 由于iframe原因
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
    // 风险告知卡
    // TODO 由于iframe原因
    {
      path: '/risk-control/risk-point-manage/card-printer-content/:id',
      code: 'riskControl.riskPointManage.view',
      name: 'riskCardPinter',
      component: './RiskControl/RiskPointManage/PrinterContent',
    },
    // 菜单展示
    {
      path: '/menu-reveal',
      name: 'menuReveal',
      // code: 'dashboard.menuReveal',
      // component: './BigPlatform/MenuReveal/NewMenu',
      routes: [
        {
          path: '/menu-reveal',
          redirect: '/menu-reveal/system',
        },
        {
          path: '/menu-reveal/system',
          name: 'system',
          component: './BigPlatform/MenuReveal/System',
        },
        { path: '/menu-reveal/menus', name: 'menus', component: './BigPlatform/MenuReveal/Menus' },
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
        {
          path: '/',
          // redirect: env === 'nanxiao' ? '/fire-control/maintenance-company' : '/dashboard/view',
          redirect: env === 'nanxiao' ? '/fire-control/maintenance-company' : '/menu-reveal',
        }, // '/dashboard/view'
        // 首页
        {
          path: '/dashboard',
          icon: 'home',
          code: 'dashboard',
          name: 'dashboard',
          hideInMenu: true,
          hideChildrenInMenu: true,
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

        // 工作台（企业）
        {
          path: '/company-workbench',
          code: 'companyWorkbench',
          name: 'companyWorkbench',
          icon: 'bar-chart',
          hideInMenu: true,
          routes: [
            {
              path: '/company-workbench',
              redirect: '/company-workbench/view',
            },
            {
              path: '/company-workbench/view',
              code: 'companyWorkbench.view',
              name: 'view',
              component: './CompanyWorkbench/Workbench/WorkbenchList',
            },
          ],
        },
        {
          name: 'exception',
          icon: 'warning',
          path: '/exception',
          hideInMenu: true,
          routes: [
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
          path: '/system-management', // 系统管理
          code: 'systemManagement',
          name: 'systemManagement',
          icon: 'setting',
          systemType: -1,
          hideInMenu: false,
          routes: [
            {
              path: '/system-management/app-management', // 手机软件管理
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
              path: '/system-management/page-authority', // 页面权限配置
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
                {
                  path: '/system-management/page-authority/sort',
                  code: 'systemManagement.pageAuthority.edit',
                  name: 'sort',
                  component: './SystemManagement/PageAuthority/PageAuthoritySort',
                },
              ],
            },
            {
              path: '/system-management/app-authority', // APP权限配置
              code: 'systemManagement.appAuthority',
              name: 'appAuthority',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/system-management/app-authority',
                  name: 'appAuthority',
                  redirect: '/system-management/app-authority/index',
                },
                {
                  path: '/system-management/app-authority/index',
                  code: 'systemManagement.appAuthority.view',
                  name: 'view',
                  component: './SystemManagement/AppAuthority/AppAuthority',
                },
                {
                  path: '/system-management/app-authority/add-or-edit/:id',
                  code: 'systemManagement.appAuthority.edit',
                  name: 'edit',
                  component: './SystemManagement/AppAuthority/AppAuthorityAddOrEdit',
                },
              ],
            },
          ],
        },

        {
          path: '/role-authorization', // 角色权限
          code: 'roleAuthorization',
          name: 'roleAuthorization',
          icon: 'user',
          systemType: -1,
          routes: [
            {
              path: '/role-authorization/account-management', // 账号管理
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
                  path: '/role-authorization/account-management/add', // 新增账号基本信息和第一个关联单位
                  code: 'roleAuthorization.accountManagement.add',
                  name: 'add',
                  component: './RoleAuthorization/AccountManagement/AccountManagementEdit',
                },
                {
                  path: '/role-authorization/account-management/edit/:id', // 编辑账号基本信息
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
                  path: '/role-authorization/account-management/associated-unit/add/:id', // 新增关联单位
                  code: 'roleAuthorization.accountManagement.associatedUnit.add',
                  name: 'addAssociatedUnit',
                  component: './RoleAuthorization/AccountManagement/AssociatedUnit',
                },
                {
                  path: '/role-authorization/account-management/associated-unit/edit/:userId', // 编辑关联单位
                  code: 'roleAuthorization.accountManagement.associatedUnit.edit',
                  name: 'editAssociatedUnit',
                  component: './RoleAuthorization/AccountManagement/AssociatedUnit',
                },
              ],
            },
            {
              path: '/role-authorization/role', // 系统角色
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
                  component: './RoleAuthorization/SystemRole/SystemRoleList',
                },
                {
                  path: '/role-authorization/role/detail/:id',
                  name: 'detail',
                  code: 'roleAuthorization.role.view',
                  component: './RoleAuthorization/SystemRole/SystemRoleDetail',
                },
                {
                  path: '/role-authorization/role/add',
                  name: 'add',
                  code: 'roleAuthorization.role.add',
                  component: './RoleAuthorization/SystemRole/SystemRoleHandler',
                },
                {
                  path: '/role-authorization/role/edit/:id',
                  name: 'edit',
                  code: 'roleAuthorization.role.edit',
                  component: './RoleAuthorization/SystemRole/SystemRoleHandler',
                },
              ],
            },
            {
              path: '/role-authorization/commonRole', // 公共角色
              code: 'roleAuthorization.commonRole',
              name: 'commonRole',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/role-authorization/commonRole',
                  redirect: 'list',
                },
                {
                  path: '/role-authorization/commonRole/list',
                  name: 'list',
                  code: 'roleAuthorization.commonRole.listView',
                  component: './RoleAuthorization/CommonRole/CommonRoleList',
                },
                {
                  path: '/role-authorization/commonRole/detail/:id',
                  name: 'detail',
                  code: 'roleAuthorization.commonRole.view',
                  component: './RoleAuthorization/CommonRole/CommonRoleDetail',
                },
                {
                  path: '/role-authorization/commonRole/add',
                  name: 'add',
                  code: 'roleAuthorization.commonRole.add',
                  component: './RoleAuthorization/CommonRole/CommonRoleHandler',
                },
                {
                  path: '/role-authorization/commonRole/edit/:id',
                  name: 'edit',
                  code: 'roleAuthorization.commonRole.edit',
                  component: './RoleAuthorization/CommonRole/CommonRoleHandler',
                },
              ],
            },
            {
              path: '/role-authorization/userRole', // 用户角色
              code: 'roleAuthorization.userRole',
              name: 'userRole',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/role-authorization/userRole',
                  redirect: 'list',
                },
                {
                  path: '/role-authorization/userRole/list',
                  name: 'list',
                  code: 'roleAuthorization.userRole.listView',
                  component: './RoleAuthorization/UserRole/UserRoleList',
                },
                {
                  path: '/role-authorization/userRole/detail/:id',
                  name: 'detail',
                  code: 'roleAuthorization.userRole.view',
                  component: './RoleAuthorization/UserRole/UserRoleDetail',
                },
                {
                  path: '/role-authorization/userRole/add',
                  name: 'add',
                  code: 'roleAuthorization.userRole.add',
                  component: './RoleAuthorization/UserRole/UserRoleHandler',
                },
                {
                  path: '/role-authorization/userRole/edit/:id',
                  name: 'edit',
                  code: 'roleAuthorization.userRole.edit',
                  component: './RoleAuthorization/UserRole/UserRoleHandler',
                },
              ],
            },
          ],
        },

        // 重大危险源监测预警系统
        {
          path: '/base-info-management', // 基本信息管理
          code: 'baseInfoManagement',
          name: 'baseInfoManagement',
          icon: 'file-text',
          systemType: 0,
          routes: [
            {
              path: '/base-info-management/company', // 单位管理
              code: 'baseInfoManagement.company',
              name: 'company',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/base-info-management/company',
                  name: 'company',
                  redirect: '/base-info-management/company/list',
                },
                {
                  path: '/base-info-management/company/list',
                  code: 'baseInfoManagement.company.listView',
                  name: 'list',
                  component: './BaseInfo/Company/CompanyList',
                },
                {
                  path: '/base-info-management/company/add',
                  code: 'baseInfoManagement.company.add',
                  name: 'add',
                  component: './BaseInfo/Company/CompanyEdit',
                },
                {
                  path: '/base-info-management/company/edit/:id',
                  code: 'baseInfoManagement.company.edit',
                  name: 'edit',
                  component: './BaseInfo/Company/CompanyEdit',
                },
                {
                  path: '/base-info-management/company/detail/:id',
                  code: 'baseInfoManagement.company.view',
                  name: 'detail',
                  component: './BaseInfo/Company/CompanyDetail',
                },
                {
                  path: '/base-info-management/company/department/list/:id',
                  code: 'baseInfoManagement.company.department.listView',
                  name: 'department',
                  component: './BaseInfo/Company/DepartmentList',
                },
                {
                  path: '/base-info-management/company/division/list/:id',
                  code: 'baseInfoManagement.company.division.listView',
                  name: 'divisionList',
                  component: './BaseInfo/Company/UnitDivision/UnitDivisionList',
                },
                {
                  path: '/base-info-management/company/division/add',
                  code: 'baseInfoManagement.company.division.add',
                  name: 'divisionAdd',
                  component: './BaseInfo/Company/UnitDivision/UnitDivisionEdit',
                },
                {
                  path: '/base-info-management/company/division/edit/:id',
                  code: 'baseInfoManagement.company.division.edit',
                  name: 'divisionEdit',
                  component: './BaseInfo/Company/UnitDivision/UnitDivisionEdit',
                },
                {
                  path: '/base-info-management/company/division/detail/:id',
                  code: 'baseInfoManagement.company.division.view',
                  name: 'divisionDetail',
                  component: './BaseInfo/Company/UnitDivision/UnitDivisionDetail',
                },
              ],
            },
            {
              name: 'buildingsInfo', // 建筑物管理
              path: '/base-info-management/buildings-info',
              code: 'baseInfoManagement.buildingsInfo',
              hideChildrenInMenu: true,
              routes: [
                {
                  name: 'list',
                  path: '/base-info-management/buildings-info',
                  redirect: '/base-info-management/buildings-info/list',
                },
                {
                  name: 'list',
                  code: 'baseInfoManagement.buildingsInfo.listView',
                  path: '/base-info-management/buildings-info/list',
                  component: './BaseInfo/BuildingsInfo/CompanyList',
                },
                {
                  name: 'view',
                  code: 'baseInfoManagement.buildingsInfo.view',
                  path: '/base-info-management/buildings-info/detail/:id',
                  component: './BaseInfo/BuildingsInfo/CompanyBuildingInfo/BuildingInfoList',
                },
                {
                  name: 'add',
                  code: 'baseInfoManagement.buildingsInfo.add',
                  path: '/base-info-management/buildings-info/add',
                  component: './BaseInfo/BuildingsInfo/CompanyBuildingInfo/BuildingInfoEdit',
                },
                {
                  name: 'edit',
                  code: 'baseInfoManagement.buildingsInfo.edit',
                  path: '/base-info-management/buildings-info/edit/:id',
                  component: './BaseInfo/BuildingsInfo/CompanyBuildingInfo/BuildingInfoEdit',
                },
                {
                  name: 'floorList',
                  code: 'baseInfoManagement.buildingsInfo.floorListView',
                  path: '/base-info-management/buildings-info/floor/list/:id',
                  component: './BaseInfo/BuildingsInfo/FloorManagement/FloorManagementList',
                },
                {
                  name: 'floorAdd',
                  code: 'baseInfoManagement.buildingsInfo.floorAdd',
                  path: '/base-info-management/buildings-info/floor/add',
                  component: './BaseInfo/BuildingsInfo/FloorManagement/FloorManagementEdit',
                },
                {
                  name: 'floorEdit',
                  code: 'baseInfoManagement.buildingsInfo.floorEdit',
                  path: '/base-info-management/buildings-info/floor/edit/:id',
                  component: './BaseInfo/BuildingsInfo/FloorManagement/FloorManagementEdit',
                },
                {
                  name: 'floorDetail',
                  code: 'baseInfoManagement.buildingsInfo.floorView',
                  path: '/base-info-management/buildings-info/floor/detail/:id',
                  component: './BaseInfo/BuildingsInfo/FloorManagement/FloorManagementDetail',
                },
              ],
            },
          ],
        },

        {
          path: '/major-hazard-info', // 基本信息
          code: 'majorHazardInfo',
          name: 'majorHazardInfo',
          icon: 'fire',
          systemType: 0,
          routes: [
            {
              name: 'majorHazard', // 重大危险源管理
              code: 'majorHazardInfo.majorHazard',
              path: '/major-hazard-info/major-hazard',
              hideChildrenInMenu: true,
              routes: [
                {
                  name: 'list',
                  path: '/major-hazard-info/major-hazard',
                  redirect: '/major-hazard-info/major-hazard/list',
                },
                {
                  name: 'list',
                  code: 'majorHazardInfo.majorHazard.listView',
                  path: '/major-hazard-info/major-hazard/list',
                  component: './BaseInfo/MajorHazard/MajorHazardList',
                },
                {
                  name: 'add',
                  code: 'majorHazardInfo.majorHazard.add',
                  path: '/major-hazard-info/major-hazard/add',
                  component: './BaseInfo/MajorHazard/MajorHazardEdit',
                },
                {
                  name: 'edit',
                  code: 'majorHazardInfo.majorHazard.edit',
                  path: '/major-hazard-info/major-hazard/edit/:id',
                  component: './BaseInfo/MajorHazard/MajorHazardEdit',
                },
              ],
            },
            {
              path: '/major-hazard-info/materials', // 物料信息
              code: 'majorHazardInfo.materials',
              name: 'materials',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/major-hazard-info/materials',
                  name: 'materials',
                  redirect: '/major-hazard-info/materials/list',
                },
                {
                  path: '/major-hazard-info/materials/list',
                  code: 'majorHazardInfo.materials.listView',
                  name: 'list',
                  component: './BaseInfo/Materials/List/index',
                },
                {
                  path: '/major-hazard-info/materials/add',
                  code: 'majorHazardInfo.materials.add',
                  name: 'add',
                  component: './BaseInfo/Materials/Handler/index',
                },
                {
                  path: '/major-hazard-info/materials/edit/:id',
                  code: 'majorHazardInfo.materials.edit',
                  name: 'edit',
                  component: './BaseInfo/Materials/Handler/index',
                },
                {
                  path: '/major-hazard-info/materials/detail/:id',
                  code: 'majorHazardInfo.materials.detail',
                  name: 'detail',
                  component: './BaseInfo/Materials/Detail/index',
                },
              ],
            },
            {
              name: 'storageAreaManagement', // 储罐区管理
              code: 'majorHazardInfo.storageAreaManagement',
              path: '/major-hazard-info/storage-area-management',
              hideChildrenInMenu: true,
              routes: [
                {
                  name: 'list',
                  path: '/major-hazard-info/storage-area-management',
                  redirect: '/major-hazard-info/storage-area-management/list',
                },
                {
                  name: 'list',
                  code: 'majorHazardInfo.storageAreaManagement.listView',
                  path: '/major-hazard-info/storage-area-management/list',
                  component: './BaseInfo/StorageAreaManagement/index',
                },
                {
                  name: 'add',
                  code: 'majorHazardInfo.storageAreaManagement.add',
                  path: '/major-hazard-info/storage-area-management/add',
                  component: './BaseInfo/StorageAreaManagement/Edit',
                },
                {
                  name: 'edit',
                  code: 'majorHazardInfo.storageAreaManagement.edit',
                  path: '/major-hazard-info/storage-area-management/edit/:id',
                  component: './BaseInfo/StorageAreaManagement/Edit',
                },
                {
                  name: 'detail',
                  code: 'majorHazardInfo.storageAreaManagement.detail',
                  path: '/major-hazard-info/storage-area-management/detail/:id',
                  component: './BaseInfo/StorageAreaManagement/Detail',
                },
              ],
            },
            {
              name: 'storageManagement', // 储罐管理
              code: 'majorHazardInfo.storageManagement',
              path: '/major-hazard-info/storage-management',
              hideChildrenInMenu: true,
              routes: [
                {
                  name: 'list',
                  path: '/major-hazard-info/storage-management',
                  redirect: '/major-hazard-info/storage-management/list',
                },
                {
                  name: 'list',
                  code: 'majorHazardInfo.storageManagement.listView',
                  path: '/major-hazard-info/storage-management/list',
                  component: './BaseInfo/StorageManagement/StorageList',
                },
                {
                  name: 'add',
                  code: 'majorHazardInfo.storageAreaManagement.add',
                  path: '/major-hazard-info/storage-management/add',
                  component: './BaseInfo/StorageManagement/StorageEdit',
                },
                {
                  name: 'edit',
                  code: 'majorHazardInfo.storageAreaManagement.edit',
                  path: '/major-hazard-info/storage-management/edit/:id',
                  component: './BaseInfo/StorageManagement/StorageEdit',
                },
              ],
            },
            {
              name: 'reservoirRegionManagement', // 库区管理
              code: 'majorHazardInfo.reservoirRegionManagement',
              path: '/major-hazard-info/reservoir-region-management',
              hideChildrenInMenu: true,
              routes: [
                {
                  name: 'list',
                  path: '/major-hazard-info/reservoir-region-management',
                  redirect: '/major-hazard-info/reservoir-region-management/list',
                },
                {
                  name: 'list',
                  code: 'majorHazardInfo.reservoirRegionManagement.listView',
                  path: '/major-hazard-info/reservoir-region-management/list',
                  component: './BaseInfo/ReservoirRegionManagement/ReservoirRegionList',
                },
                {
                  name: 'add',
                  code: 'majorHazardInfo.reservoirRegionManagement.add',
                  path: '/major-hazard-info/reservoir-region-management/add',
                  component: './BaseInfo/ReservoirRegionManagement/ReservoirRegionEdit',
                },
                {
                  name: 'edit',
                  code: 'majorHazardInfo.reservoirRegionManagement.edit',
                  path: '/major-hazard-info/reservoir-region-management/edit/:id',
                  component: './BaseInfo/ReservoirRegionManagement/ReservoirRegionEdit',
                },
              ],
            },
            {
              path: '/major-hazard-info/storehouse', // 库房管理
              code: 'majorHazardInfo.storehouse',
              name: 'storehouse',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/major-hazard-info/storehouse',
                  name: 'storehouse',
                  redirect: '/major-hazard-info/storehouse/list',
                },
                {
                  path: '/major-hazard-info/storehouse/list',
                  code: 'majorHazardInfo.storehouse.listView',
                  name: 'list',
                  component: './BaseInfo/Storehouse/List/index',
                },
                {
                  path: '/major-hazard-info/storehouse/add',
                  code: 'majorHazardInfo.storehouse.add',
                  name: 'add',
                  component: './BaseInfo/Storehouse/Handler/index',
                },
                {
                  path: '/major-hazard-info/storehouse/edit/:id',
                  code: 'majorHazardInfo.storehouse.edit',
                  name: 'edit',
                  component: './BaseInfo/Storehouse/Handler/index',
                },
                {
                  path: '/major-hazard-info/storehouse/detail/:id',
                  code: 'majorHazardInfo.storehouse.detail',
                  name: 'detail',
                  component: './BaseInfo/Storehouse/Detail/index',
                },
              ],
            },
            {
              path: '/major-hazard-info/gasometer', // 气柜管理
              code: 'majorHazardInfo.gasometer',
              name: 'gasometer',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/major-hazard-info/gasometer',
                  redirect: '/major-hazard-info/gasometer/list',
                },
                {
                  path: '/major-hazard-info/gasometer/list',
                  name: 'list',
                  code: 'majorHazardInfo.gasometer.list',
                  component: './BaseInfo/Gasometer/List',
                },
                {
                  path: '/major-hazard-info/gasometer/add',
                  name: 'add',
                  code: 'majorHazardInfo.gasometer.add',
                  component: './BaseInfo/Gasometer/Other',
                },
                {
                  path: '/major-hazard-info/gasometer/edit/:id',
                  name: 'edit',
                  code: 'majorHazardInfo.gasometer.edit',
                  component: './BaseInfo/Gasometer/Other',
                },
                {
                  path: '/major-hazard-info/gasometer/detail/:id',
                  name: 'detail',
                  code: 'majorHazardInfo.gasometer.detail',
                  component: './BaseInfo/Gasometer/Other',
                },
              ],
            },
            {
              path: '/major-hazard-info/high-risk-process', // 高危工艺流程
              code: 'majorHazardInfo.highRiskProcess',
              name: 'highRiskProcess',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/major-hazard-info/high-risk-process',
                  name: 'highRiskProcess',
                  redirect: '/major-hazard-info/high-risk-process/list',
                },
                {
                  path: '/major-hazard-info/high-risk-process/list',
                  code: 'majorHazardInfo.highRiskProcess.listView',
                  name: 'list',
                  component: './BaseInfo/HighRiskProcess/List/index',
                },
                {
                  path: '/major-hazard-info/high-risk-process/add',
                  code: 'majorHazardInfo.highRiskProcess.add',
                  name: 'add',
                  component: './BaseInfo/HighRiskProcess/Handler/index',
                },
                {
                  path: '/major-hazard-info/high-risk-process/edit/:id',
                  code: 'majorHazardInfo.highRiskProcess.edit',
                  name: 'edit',
                  component: './BaseInfo/HighRiskProcess/Handler/index',
                },
                {
                  path: '/major-hazard-info/high-risk-process/detail/:id',
                  code: 'majorHazardInfo.highRiskProcess.detail',
                  name: 'detail',
                  component: './BaseInfo/HighRiskProcess/Detail/index',
                },
              ],
            },
          ],
        },

        {
          path: '/device-management', // 物联设备管理
          code: 'deviceManagement',
          icon: 'laptop',
          name: 'deviceManagement',
          systemType: 0,
          routes: [
            {
              name: 'safetyFacilities', // 安全设施
              code: 'deviceManagement.safetyFacilities',
              path: '/device-management/safety-facilities',
              hideChildrenInMenu: true,
              routes: [
                {
                  name: 'list',
                  path: '/device-management/safety-facilities',
                  redirect: '/device-management/safety-facilities/list',
                },
                {
                  name: 'list',
                  code: 'deviceManagement.safetyFacilities.list',
                  path: '/device-management/safety-facilities/list',
                  component: './BaseInfo/SafetyFacilities/TableList',
                },
                {
                  name: 'view',
                  code: 'deviceManagement.safetyFacilities.view',
                  path: '/device-management/safety-facilities/view/:id',
                  component: './BaseInfo/SafetyFacilities/Edit',
                },
                {
                  name: 'add',
                  code: 'deviceManagement.safetyFacilities.add',
                  path: '/device-management/safety-facilities/add',
                  component: './BaseInfo/SafetyFacilities/Edit',
                },
                {
                  name: 'edit',
                  code: 'deviceManagement.safetyFacilities.edit',
                  path: '/device-management/safety-facilities/edit/:id',
                  component: './BaseInfo/SafetyFacilities/Edit',
                },
              ],
            },
            {
              path: '/device-management/video-monitor', // 监控摄像头
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
                {
                  path: '/device-management/video-monitor/associate/:type/:id',
                  code: 'deviceManagement.videoMonitor.associate',
                  name: 'associate',
                  component: './DeviceManagement/VideoMonitor/AssociateDevice',
                },
                {
                  path: '/device-management/video-monitor/associate/:id/add/:type',
                  code: 'deviceManagement.videoMonitor.addAssociate',
                  name: 'addAssociate',
                  component: './DeviceManagement/VideoMonitor/AddAssociate',
                },
              ],
            },
            {
              path: '/device-management/gateway', // 网关设备管理
              code: 'deviceManagement.gateway',
              name: 'gateway',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/device-management/gateway',
                  name: 'list',
                  redirect: '/device-management/gateway/list',
                },
                {
                  path: '/device-management/gateway/list',
                  name: 'list',
                  code: 'deviceManagement.gateway.list',
                  component: './DeviceManagement/Gateway/List',
                },
                {
                  path: '/device-management/gateway/:type/:id?',
                  name: 'list',
                  code: 'deviceManagement.gateway.list',
                  component: './DeviceManagement/Gateway/Other',
                },
              ],
            },
            {
              path: '/device-management/data-processing', // 数据处理设备
              name: 'dataProcessing',
              code: 'deviceManagement.dataProcessing',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/device-management/data-processing',
                  name: 'dataProcessing',
                  redirect: '/device-management/data-processing/list',
                },
                {
                  path: '/device-management/data-processing/list',
                  name: 'listView',
                  code: 'deviceManagement.dataProcessing.companyList',
                  component: './DeviceManagement/DataProcessingEquipment/CompanyList',
                },
                {
                  path: '/device-management/data-processing/add',
                  name: 'addEquipmentType',
                  code: 'deviceManagement.dataProcessing.addEquipmentType',
                  component: './DeviceManagement/DataProcessingEquipment/AddEquipmentType',
                },
                {
                  path: '/device-management/data-processing/edit/:id',
                  name: 'editEquipmentType',
                  code: 'deviceManagement.dataProcessing.editEquipmentType',
                  component: './DeviceManagement/DataProcessingEquipment/AddEquipmentType',
                },
                {
                  path: '/device-management/data-processing/list/:type',
                  name: 'deviceList',
                  code: 'deviceManagement.dataProcessing.device.list',
                  component: './DeviceManagement/DataProcessingEquipment/EquipmentList',
                },
                {
                  path: '/device-management/data-processing/:type/add',
                  name: 'addDevice',
                  code: 'deviceManagement.dataProcessing.device.add',
                  component: './DeviceManagement/DataProcessingEquipment/AddEquipment',
                },
                {
                  path: '/device-management/data-processing/:type/edit/:id',
                  name: 'editDevice',
                  code: 'deviceManagement.dataProcessing.device.edit',
                  component: './DeviceManagement/DataProcessingEquipment/AddEquipment',
                },
              ],
            },
            {
              path: '/device-management/brand', // 型号报警阈值设置(品牌管理)
              code: 'deviceManagement.brand',
              name: 'brand',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/device-management/brand',
                  name: 'brand',
                  redirect: '/device-management/brand/list',
                },
                {
                  path: '/device-management/brand/list',
                  name: 'listView',
                  code: 'deviceManagement.brand.listView',
                  component: './DeviceManagement/Brand',
                },
                {
                  path: '/device-management/brand/:brandId/model',
                  name: 'model',
                  code: 'deviceManagement.brand.model.listView',
                  component: './DeviceManagement/Brand/ModelList',
                },
                {
                  path: '/device-management/brand/:brandId/model/:modelId/parameter',
                  name: 'deployParameter',
                  code: 'deviceManagement.brand.model.deployParameter',
                  component: './DeviceManagement/Brand/DeployParameter',
                },
              ],
            },
            {
              path: '/device-management/new-sensor', // 传感器管理
              name: 'newSensor',
              code: 'deviceManagement.newSensor',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/device-management/new-sensor',
                  name: 'newSensor',
                  redirect: '/device-management/new-sensor/list',
                },
                {
                  path: '/device-management/new-sensor/list',
                  name: 'list',
                  code: 'deviceManagement.newSensor.listView',
                  component: './DeviceManagement/NewSensor',
                },
                {
                  path: '/device-management/new-sensor/add',
                  name: 'add',
                  code: 'deviceManagement.newSensor.add',
                  component: './DeviceManagement/NewSensor/AddSensor',
                },
                {
                  path: '/device-management/new-sensor/edit/:id',
                  name: 'edit',
                  code: 'deviceManagement.newSensor.edit',
                  component: './DeviceManagement/NewSensor/AddSensor',
                },
                {
                  path: '/device-management/new-sensor/real-time-data/:id',
                  name: 'realTimeData',
                  code: 'deviceManagement.newSensor.realTimeData',
                  component: './DeviceManagement/NewSensor/RealTimeData',
                },
              ],
            },
            {
              path: '/device-management/monitoring-type', // 监测类型管理
              code: 'deviceManagement.monitoringType',
              name: 'monitoringType',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/device-management/monitoring-type',
                  name: 'monitoringType',
                  redirect: '/device-management/monitoring-type/list',
                },
                {
                  path: '/device-management/monitoring-type/list',
                  name: 'listView',
                  code: 'deviceManagement.monitoringType.listView',
                  component: './DeviceManagement/MonitoringType',
                },
              ],
            },
            {
              path: '/device-management/device-type', // 设备类型管理
              code: 'deviceManagement.deviceType',
              name: 'deviceType',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/device-management/device-type',
                  name: 'deviceType',
                  redirect: '/device-management/device-type/list',
                },
                {
                  path: '/device-management/device-type/list',
                  code: 'deviceManagement.deviceType.listView',
                  name: 'listView',
                  component: './DeviceManagement/DeviceType',
                },
              ],
            },
            {
              path: '/device-management/monitoring-device', // 监测设备管理
              name: 'monitoringDevice',
              code: 'deviceManagement.monitoringDevice',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/device-management/monitoring-device',
                  name: 'monitoringDevice',
                  redirect: '/device-management/monitoring-device/list',
                },
                {
                  path: '/device-management/monitoring-device/list',
                  name: 'list',
                  code: 'deviceManagement.monitoringDevice.listView',
                  component: './DeviceManagement/MonitoringDevice/index',
                },
                {
                  path: '/device-management/monitoring-device/add',
                  name: 'add',
                  code: 'deviceManagement.monitoringDevice.add',
                  component: './DeviceManagement/MonitoringDevice/AddMonitoringDevice',
                },
                {
                  path: '/device-management/monitoring-device/edit/:id',
                  name: 'edit',
                  code: 'deviceManagement.monitoringDevice.edit',
                  component: './DeviceManagement/MonitoringDevice/AddMonitoringDevice',
                },
              ],
            },
            {
              path: '/device-management/user-transmission-device', // 用户传输装置
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
                {
                  path:
                    '/device-management/user-transmission-device/:companyId/point-managament/:hostId',
                  code: 'deviceManagement.userTransmissionDevice.pointManagement.listView',
                  name: 'pointManagement',
                  component: './DeviceManagement/UserTransmissionDevice/PointManagement',
                },
              ],
            },
            {
              path: '/device-management/associate-sensor', // 虚拟设备 设备关联传感
              code: 'deviceManagement.associateSensor',
              name: 'associateSensor',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/device-management/associate-sensor',
                  name: 'associateSensor',
                  redirect: '/device-management/associate-sensor/list',
                },
                {
                  path: '/device-management/associate-sensor/list',
                  name: 'listView',
                  code: 'deviceManagement.associateSensor.listView',
                  component: './DeviceManagement/AssociateSensor/SensorCompanyList',
                },
                {
                  path: '/device-management/associate-sensor/company/:companyId/water-system',
                  name: 'waterSystem',
                  code: 'deviceManagement.associateSensor.waterSystem',
                  component: './DeviceManagement/AssociateSensor/WaterSystem',
                },
                {
                  path:
                    '/device-management/associate-sensor/company/:companyId/temperature-and-humidity',
                  name: 'temperatureAndHumidity',
                  code: 'deviceManagement.associateSensor.temperatureAndHumidity',
                  component: './DeviceManagement/AssociateSensor/TemperatureAndHumidity',
                },
              ],
            },
          ],
        },

        {
          path: '/iot', // 物联网监测
          code: 'iot',
          name: 'iot',
          icon: 'wifi',
          systemType: 0,
          routes: [
            {
              path: '/iot/major-hazard', // 重大危险源监测
              code: 'iot.majorHazard',
              name: 'majorHazard',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/iot/major-hazard',
                  redirect: '/iot/major-hazard/index',
                },
                {
                  path: '/iot/major-hazard/index',
                  code: 'iot.majorHazard.index',
                  name: 'index',
                  component: './IoT/MajorHazard',
                },
                {
                  path: '/iot/major-hazard/tank-area',
                  code: 'iot.majorHazard.tankArea',
                  name: 'tankArea',
                  routes: [
                    {
                      path: '/iot/major-hazard/tank-area',
                      redirect: '/iot/major-hazard/tank-area/real-time',
                    },
                    {
                      path: '/iot/major-hazard/tank-area/real-time',
                      code: 'iot.majorHazard.tankArea.realTime',
                      name: 'realTime',
                      component: './IoT/MajorHazard/TankArea/RealTime',
                    },
                    {
                      path: '/iot/major-hazard/tank-area/detail/:id',
                      code: 'iot.majorHazard.tankArea.detail',
                      name: 'detail',
                      component: './IoT/MajorHazard/TankArea/Detail',
                    },
                  ],
                },
                {
                  path: '/iot/major-hazard/tank',
                  code: 'iot.majorHazard.tank',
                  name: 'tank',
                  routes: [
                    {
                      path: '/iot/major-hazard/tank',
                      redirect: '/iot/major-hazard/tank/real-time',
                    },
                    {
                      path: '/iot/major-hazard/tank/real-time',
                      code: 'iot.majorHazard.tank.realTime',
                      name: 'realTime',
                      component: './IoT/MajorHazard/Tank/RealTime',
                    },
                    {
                      path: '/iot/major-hazard/tank/detail/:id',
                      code: 'iot.majorHazard.tank.detail',
                      name: 'detail',
                      component: './IoT/MajorHazard/Tank/Detail',
                    },
                  ],
                },
                {
                  path: '/iot/major-hazard/storage-area',
                  code: 'iot.majorHazard.storageArea',
                  name: 'storageArea',
                  routes: [
                    {
                      path: '/iot/major-hazard/storage-area',
                      redirect: '/iot/major-hazard/storage-area/real-time',
                    },
                    {
                      path: '/iot/major-hazard/storage-area/real-time',
                      code: 'iot.majorHazard.storageArea.realTime',
                      name: 'realTime',
                      component: './IoT/MajorHazard/StorageArea/RealTime',
                    },
                    {
                      path: '/iot/major-hazard/storage-area/detail/:id',
                      code: 'iot.majorHazard.storageArea.detail',
                      name: 'detail',
                      component: './IoT/MajorHazard/StorageArea/Detail',
                    },
                  ],
                },
                {
                  path: '/iot/major-hazard/storage-house',
                  code: 'iot.majorHazard.storageHouse',
                  name: 'storageHouse',
                  routes: [
                    {
                      path: '/iot/major-hazard/storage-house',
                      redirect: '/iot/major-hazard/storage-house/real-time',
                    },
                    {
                      path: '/iot/major-hazard/storage-house/real-time',
                      code: 'iot.majorHazard.storageHouse.realTime',
                      name: 'realTime',
                      component: './IoT/MajorHazard/StorageHouse/RealTime',
                    },
                    {
                      path: '/iot/major-hazard/storage-house/detail/:id',
                      code: 'iot.majorHazard.storageHouse.detail',
                      name: 'detail',
                      component: './IoT/MajorHazard/StorageHouse/Detail',
                    },
                  ],
                },
              ],
            },
            {
              path: '/iot/IOT-abnormal-data', // IOT数据分析
              code: 'iot.IOTAbnormalData',
              name: 'IOTAbnormalData',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/iot/IOT-abnormal-data',
                  name: 'IOTAbnormalData',
                  redirect: '/iot/IOT-abnormal-data/list',
                },
                {
                  path: '/iot/IOT-abnormal-data/list',
                  code: 'iot.IOTAbnormalData.listView',
                  name: 'list',
                  component: './DataAnalysis/IOT/DataAnalysisList',
                },
                {
                  path: '/iot/IOT-abnormal-data/electricity/:id/count/:count',
                  code: 'iot.IOTAbnormalData.electricity',
                  name: 'electricity',
                  component: './DataAnalysis/IOT/Electricity',
                },
                {
                  path: '/iot/IOT-abnormal-data/toxic-gas/:id/count/:count',
                  code: 'iot.IOTAbnormalData.toxicGas',
                  name: 'toxicGas',
                  component: './DataAnalysis/IOT/ToxicGas',
                },
                {
                  path: '/iot/IOT-abnormal-data/waste-water/:id/count/:count',
                  code: 'iot.IOTAbnormalData.wasteWater',
                  name: 'wasteWater',
                  component: './DataAnalysis/IOT/WasteWater',
                },
                {
                  path: '/iot/IOT-abnormal-data/waste-gas/:id/count/:count',
                  code: 'iot.IOTAbnormalData.wasteGas',
                  name: 'wasteGas',
                  component: './DataAnalysis/IOT/WasteGas',
                },
                {
                  path: '/iot/IOT-abnormal-data/storage-tank/:id/count/:count',
                  code: 'iot.IOTAbnormalData.storageTank',
                  name: 'storageTank',
                  component: './DataAnalysis/IOT/StorageTank',
                },
                {
                  path: '/iot/IOT-abnormal-data/smoke-detector/:id/count/:count',
                  code: 'iot.IOTAbnormalData.smokeDetector',
                  name: 'smokeDetector',
                  component: './DataAnalysis/IOT/SmokeDetector',
                },
                {
                  path: '/iot/IOT-abnormal-data/humiture/:id/count/:count',
                  code: 'iot.IOTAbnormalData.humiture',
                  name: 'humiture',
                  component: './DataAnalysis/IOT/Humiture',
                },
                {
                  path: '/iot/IOT-abnormal-data/water/:id/count/:count',
                  code: 'iot.IOTAbnormalData.water',
                  name: 'water',
                  component: './DataAnalysis/IOT/Water',
                },
                {
                  path: '/iot/IOT-abnormal-data/fire-alarm/company/:companyId',
                  code: 'iot.IOTAbnormalData.fireDetailView',
                  name: 'companyDetail',
                  component: './DynamicMonitoring/FireAlarm/CompanyDetail',
                },
                {
                  path: '/iot/IOT-abnormal-data/fire-alarm/history-record/:companyId',
                  name: 'historyRecord',
                  code: 'iot.IOTAbnormalData.fireHistoryRecordView',
                  component: './DynamicMonitoring/FireAlarm/HistoryRecord',
                },
              ],
            },
            {
              name: 'alarmWorkOrder', // 报警工单管理
              code: 'iot.alarmWorkOrder',
              path: '/iot/alarm-work-order',
              developing: true,
              hideChildrenInMenu: true,
              routes: [],
            },
            {
              name: 'alarmMessage', // 报警消息
              code: 'iot.alarmMessage',
              path: '/iot/alarm-message',
              component: './IoT/AlarmMessage',
            },
          ],
        },

        {
          path: '/emergency-resource-management', // 应急资源管理
          code: 'emergencyResourceManagement',
          icon: 'snippets',
          name: 'emergencyResourceManagement',
          systemType: 0,
          routes: [
            {
              path: '/emergency-resource-management',
              redirect: '/emergency-resource-management/emergency-plan/list',
            },
            {
              path: '/emergency-resource-management/emergency-plan', // 应急预案
              code: 'emergencyResourceManagement.emergencyPlan',
              name: 'emergencyPlan',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/emergency-resource-management/emergency-plan',
                  redirect: '/emergency-resource-management/emergency-plan/list',
                },
                {
                  path: '/emergency-resource-management/emergency-plan/list',
                  name: 'list',
                  code: 'emergencyResourceManagement.emergencyPlan.list',
                  component: './EmergencyManagement/EmergencyPlan/EmergencyPlanList',
                },
                {
                  path: '/emergency-resource-management/emergency-plan/add',
                  name: 'add',
                  code: 'emergencyResourceManagement.emergencyPlan.add',
                  component: './EmergencyManagement/EmergencyPlan/EmergencyPlanHandler',
                },
                {
                  path: '/emergency-resource-management/emergency-plan/edit/:id',
                  name: 'edit',
                  code: 'emergencyResourceManagement.emergencyPlan.edit',
                  component: './EmergencyManagement/EmergencyPlan/EmergencyPlanHandler',
                },
                {
                  path: '/emergency-resource-management/emergency-plan/detail/:id',
                  name: 'detail',
                  code: 'emergencyResourceManagement.emergencyPlan.detail',
                  component: './EmergencyManagement/EmergencyPlan/EmergencyPlanDetail',
                },
              ],
            },
            {
              path: '/emergency-resource-management/emergency-equipment', // 应急装备
              code: 'emergencyResourceManagement.emergencyEquipment',
              name: 'emergencyEquipment',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/emergency-resource-management/emergency-equipment',
                  name: 'emergencyEquipment',
                  redirect: '/emergency-resource-management/emergency-equipment/list',
                },
                {
                  path: '/emergency-resource-management/emergency-equipment/list',
                  code: 'emergencyResourceManagement.emergencyEquipment.listView',
                  name: 'list',
                  component: './EmergencyManagement/EmergencyEquipment/List/index',
                },
                {
                  path: '/emergency-resource-management/emergency-equipment/add',
                  code: 'emergencyResourceManagement.emergencyEquipment.add',
                  name: 'add',
                  component: './EmergencyManagement/EmergencyEquipment/Handler/index',
                },
                {
                  path: '/emergency-resource-management/emergency-equipment/edit/:id',
                  code: 'emergencyResourceManagement.emergencyEquipment.edit',
                  name: 'edit',
                  component: './EmergencyManagement/EmergencyEquipment/Handler/index',
                },
                {
                  path: '/emergency-resource-management/emergency-equipment/detail/:id',
                  code: 'emergencyResourceManagement.emergencyEquipment.detail',
                  name: 'detail',
                  component: './EmergencyManagement/EmergencyEquipment/Detail/index',
                },
              ],
            },
            {
              path: '/emergency-resource-management/emergency-supplies', // 应急物资
              code: 'emergencyResourceManagement.emergencySupplies',
              name: 'emergencySupplies',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/emergency-resource-management/emergency-supplies',
                  name: 'emergencySupplies',
                  redirect: '/emergency-resource-management/emergency-supplies/list',
                },
                {
                  path: '/emergency-resource-management/emergency-supplies/list',
                  code: 'emergencyResourceManagement.emergencySupplies.listView',
                  name: 'list',
                  component: './EmergencyManagement/EmergencySupplies/List/index',
                },
                {
                  path: '/emergency-resource-management/emergency-supplies/add',
                  code: 'emergencyResourceManagement.emergencySupplies.add',
                  name: 'add',
                  component: './EmergencyManagement/EmergencySupplies/Handler/index',
                },
                {
                  path: '/emergency-resource-management/emergency-supplies/edit/:id',
                  code: 'emergencyResourceManagement.emergencySupplies.edit',
                  name: 'edit',
                  component: './EmergencyManagement/EmergencySupplies/Handler/index',
                },
                {
                  path: '/emergency-resource-management/emergency-supplies/detail/:id',
                  code: 'emergencyResourceManagement.emergencySupplies.detail',
                  name: 'detail',
                  component: './EmergencyManagement/EmergencySupplies/Detail/index',
                },
              ],
            },
            {
              path: '/emergency-resource-management/emergency-drill', // 应急演练计划
              code: 'emergencyResourceManagement.emergencyDrill',
              name: 'emergencyDrill',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/emergency-resource-management/emergency-drill',
                  name: 'emergencyDrill',
                  redirect: '/emergency-resource-management/emergency-drill/list',
                },
                {
                  path: '/emergency-resource-management/emergency-drill/list',
                  code: 'emergencyResourceManagement.emergencyDrill.listView',
                  name: 'list',
                  component: './EmergencyManagement/EmergencyDrill/List/index',
                },
                {
                  path: '/emergency-resource-management/emergency-drill/add',
                  code: 'emergencyResourceManagement.emergencyDrill.add',
                  name: 'add',
                  component: './EmergencyManagement/EmergencyDrill/Handler/index',
                },
                {
                  path: '/emergency-resource-management/emergency-drill/edit/:id',
                  code: 'emergencyResourceManagement.emergencyDrill.edit',
                  name: 'edit',
                  component: './EmergencyManagement/EmergencyDrill/Handler/index',
                },
                {
                  path: '/emergency-resource-management/emergency-drill/detail/:id',
                  code: 'emergencyResourceManagement.emergencyDrill.detail',
                  name: 'detail',
                  component: './EmergencyManagement/EmergencyDrill/Detail/index',
                },
              ],
            },
            {
              name: 'emergencyProcess', // 应急演练过程
              code: 'emergencyResourceManagement.emergencyProcess',
              path: '/emergency-resource-management/emergency-process',
              hideChildrenInMenu: true,
              routes: [
                {
                  name: 'list',
                  path: '/emergency-resource-management/emergency-process',
                  redirect: '/emergency-resource-management/emergency-process/list',
                },
                {
                  name: 'list',
                  code: 'emergencyResourceManagement.emergencyProcess.list',
                  path: '/emergency-resource-management/emergency-process/list',
                  component: './EmergencyManagement/EmergencyProcess/TableList',
                },
                {
                  name: 'view',
                  code: 'emergencyResourceManagement.emergencyProcess.view',
                  path: '/emergency-resource-management/emergency-process/view/:id',
                  component: './EmergencyManagement/EmergencyProcess/Edit',
                },
                {
                  name: 'add',
                  code: 'emergencyResourceManagement.emergencyProcess.add',
                  path: '/emergency-resource-management/emergency-process/add',
                  component: './EmergencyManagement/EmergencyProcess/Edit',
                },
                {
                  name: 'edit',
                  code: 'emergencyResourceManagement.emergencyProcess.edit',
                  path: '/emergency-resource-management/emergency-process/edit/:id',
                  component: './EmergencyManagement/EmergencyProcess/Edit',
                },
              ],
            },
            {
              path: '/emergency-resource-management/emergency-estimate', // 应急演练评估
              code: 'emergencyResourceManagement.emergencyEstimate',
              name: 'emergencyEstimate',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/emergency-resource-management/emergency-estimate',
                  name: 'emergencyEstimate',
                  redirect: '/emergency-resource-management/emergency-estimate/list',
                },
                {
                  path: '/emergency-resource-management/emergency-estimate/list',
                  code: 'emergencyResourceManagement.emergencyEstimate.listView',
                  name: 'list',
                  component: './EmergencyManagement/EmergencyEstimate/List/index',
                },
                {
                  path: '/emergency-resource-management/emergency-estimate/add',
                  code: 'emergencyResourceManagement.emergencyEstimate.add',
                  name: 'add',
                  component: './EmergencyManagement/EmergencyEstimate/Handler/index',
                },
                {
                  path: '/emergency-resource-management/emergency-estimate/edit/:id',
                  code: 'emergencyResourceManagement.emergencyEstimate.edit',
                  name: 'edit',
                  component: './EmergencyManagement/EmergencyEstimate/Handler/index',
                },
                {
                  path: '/emergency-resource-management/emergency-estimate/detail/:id',
                  code: 'emergencyResourceManagement.emergencyEstimate.detail',
                  name: 'detail',
                  component: './EmergencyManagement/EmergencyEstimate/Detail/index',
                },
              ],
            },
          ],
        },

        {
          path: '/safety-knowledge-base', // 安全生产知识库
          code: 'safetyKnowledgeBase',
          icon: 'database',
          name: 'safetyKnowledgeBase',
          systemType: 0,
          routes: [
            {
              path: '/safety-knowledge-base/msds', // 化学品安全说明书
              code: 'safetyKnowledgeBase.msds',
              name: 'msds',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/safety-knowledge-base/msds',
                  name: 'msds',
                  redirect: '/safety-knowledge-base/msds/list',
                },
                {
                  path: '/safety-knowledge-base/msds/list',
                  code: 'safetyKnowledgeBase.msds.listView',
                  name: 'list',
                  component: './SafetyKnowledgeBase/MSDS/MList',
                },
                {
                  path: '/safety-knowledge-base/msds/add',
                  code: 'safetyKnowledgeBase.msds.add',
                  name: 'add',
                  component: './SafetyKnowledgeBase/MSDS/MEdit',
                },
                {
                  path: '/safety-knowledge-base/msds/detail/:id',
                  code: 'safetyKnowledgeBase.msds.view',
                  name: 'view',
                  component: './SafetyKnowledgeBase/MSDS/MEdit',
                },
                {
                  path: '/safety-knowledge-base/msds/edit/:id',
                  code: 'safetyKnowledgeBase.msds.edit',
                  name: 'edit',
                  component: './SafetyKnowledgeBase/MSDS/MEdit',
                },
              ],
            },
            {
              path: '/safety-knowledge-base/typical-accident-case', // 典型事故案例
              code: 'safetyKnowledgeBase.typicalAccidentCase',
              name: 'typicalAccidentCase',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/safety-knowledge-base/typical-accident-case',
                  name: 'typicalAccidentCase',
                  redirect: '/safety-knowledge-base/typical-accident-case/list',
                },
                {
                  path: '/safety-knowledge-base/typical-accident-case/list',
                  code: 'safetyKnowledgeBase.typicalAccidentCase.listView',
                  name: 'list',
                  component: './SafetyKnowledgeBase/TypicalAccidentCase/TList',
                },
                {
                  path: '/safety-knowledge-base/typical-accident-case/add',
                  code: 'safetyKnowledgeBase.typicalAccidentCase.add',
                  name: 'add',
                  component: './SafetyKnowledgeBase/TypicalAccidentCase/TEdit',
                },
                {
                  path: '/safety-knowledge-base/typical-accident-case/edit/:id',
                  code: 'safetyKnowledgeBase.typicalAccidentCase.edit',
                  name: 'edit',
                  component: './SafetyKnowledgeBase/TypicalAccidentCase/TEdit',
                },
              ],
            },
            {
              path: '/safety-knowledge-base/laws', // 安全生产法律法规
              code: 'safetyKnowledgeBase.laws',
              name: 'laws',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/safety-knowledge-base/laws',
                  name: 'laws',
                  redirect: '/safety-knowledge-base/laws/list',
                },
                {
                  path: '/safety-knowledge-base/laws/list',
                  code: 'safetyKnowledgeBase.laws.listView',
                  name: 'listView',
                  component: './LawEnforcement/Laws/LawDatabaseList',
                },
                {
                  path: '/safety-knowledge-base/laws/add',
                  code: 'safetyKnowledgeBase.laws.add',
                  name: 'add',
                  component: './LawEnforcement/Laws/LawDatabaseEdit',
                },
                {
                  path: '/safety-knowledge-base/laws/edit/:id',
                  code: 'safetyKnowledgeBase.laws.edit',
                  name: 'edit',
                  component: './LawEnforcement/Laws/LawDatabaseEdit',
                },
                {
                  path: '/safety-knowledge-base/laws/detail/:id',
                  code: 'safetyKnowledgeBase.laws.view',
                  name: 'view',
                  component: './LawEnforcement/Laws/LawDatabaseDetail',
                },
              ],
            },
          ],
        },

        // 可燃有毒气体监测预警系统
        {
          path: '/gas-base-info', // 生产存储单元基础信息
          code: 'gasBaseInfo',
          icon: 'file-text',
          name: 'gasBaseInfo',
          systemType: 1,
          routes: [
            {
              name: 'storageAreaManagement', // 储罐区管理
              code: 'gasBaseInfo.storageAreaManagement',
              path: '/gas-base-info/storage-area-management',
              hideChildrenInMenu: true,
              routes: [
                {
                  name: 'list',
                  path: '/gas-base-info/storage-area-management',
                  redirect: '/gas-base-info/storage-area-management/list',
                },
                {
                  name: 'list',
                  code: 'gasBaseInfo.storageAreaManagement.listView',
                  path: '/gas-base-info/storage-area-management/list',
                  component: './BaseInfo/StorageAreaManagement/index',
                },
                {
                  name: 'add',
                  code: 'gasBaseInfo.storageAreaManagement.add',
                  path: '/gas-base-info/storage-area-management/add',
                  component: './BaseInfo/StorageAreaManagement/Edit',
                },
                {
                  name: 'edit',
                  code: 'gasBaseInfo.storageAreaManagement.edit',
                  path: '/gas-base-info/storage-area-management/edit/:id',
                  component: './BaseInfo/StorageAreaManagement/Edit',
                },
                {
                  name: 'detail',
                  code: 'gasBaseInfo.storageAreaManagement.detail',
                  path: '/gas-base-info/storage-area-management/detail/:id',
                  component: './BaseInfo/StorageAreaManagement/Detail',
                },
              ],
            },
            {
              name: 'reservoirRegionManagement', // 库区管理
              code: 'gasBaseInfo.reservoirRegionManagement',
              path: '/gas-base-info/reservoir-region-management',
              hideChildrenInMenu: true,
              routes: [
                {
                  name: 'list',
                  path: '/gas-base-info/reservoir-region-management',
                  redirect: '/gas-base-info/reservoir-region-management/list',
                },
                {
                  name: 'list',
                  code: 'gasBaseInfo.reservoirRegionManagement.listView',
                  path: '/gas-base-info/reservoir-region-management/list',
                  component: './BaseInfo/ReservoirRegionManagement/ReservoirRegionList',
                },
                {
                  name: 'add',
                  code: 'gasBaseInfo.reservoirRegionManagement.add',
                  path: '/gas-base-info/reservoir-region-management/add',
                  component: './BaseInfo/ReservoirRegionManagement/ReservoirRegionEdit',
                },
                {
                  name: 'edit',
                  code: 'gasBaseInfo.reservoirRegionManagement.edit',
                  path: '/gas-base-info/reservoir-region-management/edit/:id',
                  component: './BaseInfo/ReservoirRegionManagement/ReservoirRegionEdit',
                },
              ],
            },
          ],
        },

        {
          path: '/gas-device-management', // 监测设备管理(物联网设备管理)
          code: 'gasDeviceManagement',
          icon: 'laptop',
          name: 'gasDeviceManagement',
          systemType: 1,
          routes: [
            {
              path: '/gas-device-management/video-monitor', // 监控摄像头
              code: 'gasDeviceManagement.videoMonitor',
              name: 'videoMonitor',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/gas-device-management/video-monitor',
                  name: 'videoMonitor',
                  redirect: '/gas-device-management/video-monitor/list',
                },
                {
                  path: '/gas-device-management/video-monitor/list',
                  code: 'gasDeviceManagement.videoMonitor.listView',
                  name: 'listView',
                  component: './DeviceManagement/VideoMonitor/VideoMonitorList',
                },
                {
                  path: '/gas-device-management/video-monitor/add',
                  code: 'gasDeviceManagement.videoMonitor.add',
                  name: 'add',
                  component: './DeviceManagement/VideoMonitor/VideoMonitorEdit',
                },
                {
                  path: '/gas-device-management/video-monitor/edit/:id',
                  code: 'gasDeviceManagement.videoMonitor.edit',
                  name: 'edit',
                  component: './DeviceManagement/VideoMonitor/VideoMonitorEdit',
                },
                {
                  path: '/gas-device-management/video-monitor/video-equipment/:companyId',
                  code: 'gasDeviceManagement.videoMonitor.view',
                  name: 'view',
                  component: './DeviceManagement/VideoMonitor/VideoEquipmentList',
                },
                {
                  path: '/gas-device-management/video-monitor/:companyId/detail/:id',
                  code: 'gasDeviceManagement.videoMonitor.view',
                  name: 'detail',
                  component: './DeviceManagement/VideoMonitor/VideoMonitorDetail',
                },
                {
                  path: '/gas-device-management/video-monitor/associate/:type/:id',
                  code: 'gasDeviceManagement.videoMonitor.associate',
                  name: 'associate',
                  component: './DeviceManagement/VideoMonitor/AssociateDevice',
                },
                {
                  path: '/gas-device-management/video-monitor/associate/:id/add/:type',
                  code: 'gasDeviceManagement.videoMonitor.addAssociate',
                  name: 'addAssociate',
                  component: './DeviceManagement/VideoMonitor/AddAssociate',
                },
              ],
            },
            {
              path: '/gas-device-management/gateway', // 网关设备管理
              code: 'gasDeviceManagement.gateway',
              name: 'gateway',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/gas-device-management/gateway',
                  name: 'list',
                  redirect: '/gas-device-management/gateway/list',
                },
                {
                  path: '/gas-device-management/gateway/list',
                  name: 'list',
                  code: 'gasDeviceManagement.gateway.list',
                  component: './DeviceManagement/Gateway/List',
                },
                {
                  path: '/gas-device-management/gateway/:type/:id?',
                  name: 'list',
                  code: 'gasDeviceManagement.gateway.list',
                  component: './DeviceManagement/Gateway/Other',
                },
              ],
            },
            {
              path: '/gas-device-management/data-processing', // 数据处理设备
              name: 'dataProcessing',
              code: 'gasDeviceManagement.dataProcessing',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/gas-device-management/data-processing',
                  name: 'dataProcessing',
                  redirect: '/gas-device-management/data-processing/list',
                },
                {
                  path: '/gas-device-management/data-processing/list',
                  name: 'listView',
                  code: 'gasDeviceManagement.dataProcessing.companyList',
                  component: './DeviceManagement/DataProcessingEquipment/CompanyList',
                },
                {
                  path: '/gas-device-management/data-processing/add',
                  name: 'addEquipmentType',
                  code: 'gasDeviceManagement.dataProcessing.addEquipmentType',
                  component: './DeviceManagement/DataProcessingEquipment/AddEquipmentType',
                },
                {
                  path: '/gas-device-management/data-processing/edit/:id',
                  name: 'editEquipmentType',
                  code: 'gasDeviceManagement.dataProcessing.editEquipmentType',
                  component: './DeviceManagement/DataProcessingEquipment/AddEquipmentType',
                },
                {
                  path: '/gas-device-management/data-processing/list/:type',
                  name: 'deviceList',
                  code: 'gasDeviceManagement.dataProcessing.device.list',
                  component: './DeviceManagement/DataProcessingEquipment/EquipmentList',
                },
                {
                  path: '/gas-device-management/data-processing/:type/add',
                  name: 'addDevice',
                  code: 'gasDeviceManagement.dataProcessing.device.add',
                  component: './DeviceManagement/DataProcessingEquipment/AddEquipment',
                },
                {
                  path: '/gas-device-management/data-processing/:type/edit/:id',
                  name: 'editDevice',
                  code: 'gasDeviceManagement.dataProcessing.device.edit',
                  component: './DeviceManagement/DataProcessingEquipment/AddEquipment',
                },
              ],
            },
            {
              path: '/gas-device-management/brand', // 型号报警阈值设置(品牌管理)
              code: 'gasDeviceManagement.brand',
              name: 'brand',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/gas-device-management/brand',
                  name: 'brand',
                  redirect: '/gas-device-management/brand/list',
                },
                {
                  path: '/gas-device-management/brand/list',
                  name: 'listView',
                  code: 'gasDeviceManagement.brand.listView',
                  component: './DeviceManagement/Brand',
                },
                {
                  path: '/gas-device-management/brand/:brandId/model',
                  name: 'model',
                  code: 'gasDeviceManagement.brand.model.listView',
                  component: './DeviceManagement/Brand/ModelList',
                },
                {
                  path: '/gas-device-management/brand/:brandId/model/:modelId/parameter',
                  name: 'deployParameter',
                  code: 'gasDeviceManagement.brand.model.deployParameter',
                  component: './DeviceManagement/Brand/DeployParameter',
                },
              ],
            },
            {
              path: '/gas-device-management/new-sensor', // 传感器管理
              name: 'newSensor',
              code: 'gasDeviceManagement.newSensor',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/gas-device-management/new-sensor',
                  name: 'newSensor',
                  redirect: '/gas-device-management/new-sensor/list',
                },
                {
                  path: '/gas-device-management/new-sensor/list',
                  name: 'list',
                  code: 'gasDeviceManagement.newSensor.listView',
                  component: './DeviceManagement/NewSensor',
                },
                {
                  path: '/gas-device-management/new-sensor/add',
                  name: 'add',
                  code: 'gasDeviceManagement.newSensor.add',
                  component: './DeviceManagement/NewSensor/AddSensor',
                },
                {
                  path: '/gas-device-management/new-sensor/edit/:id',
                  name: 'edit',
                  code: 'gasDeviceManagement.newSensor.edit',
                  component: './DeviceManagement/NewSensor/AddSensor',
                },
                {
                  path: '/gas-device-management/new-sensor/real-time-data/:id',
                  name: 'realTimeData',
                  code: 'gasDeviceManagement.newSensor.realTimeData',
                  component: './DeviceManagement/NewSensor/RealTimeData',
                },
              ],
            },
          ],
        },

        {
          path: '/gas-iot', // 气体监测报警(物联网监测)
          code: 'gasIot',
          name: 'gasIot',
          icon: 'wifi',
          systemType: 1,
          routes: [
            {
              name: 'alarmWorkOrder', // 可燃有毒气体报警工单
              code: 'gasIot.alarmWorkOrder',
              path: '/gas-iot/alarm-work-order',
              developing: true,
              hideChildrenInMenu: true,
              routes: [],
            },
            {
              name: 'alarmMessage', // 可燃有毒气体报警消息
              code: 'gasIot.alarmMessage',
              path: '/gas-iot/alarm-message',
              developing: true,
              hideChildrenInMenu: true,
              routes: [],
            },
            {
              path: '/gas-iot/IOT-abnormal-data', // IOT数据分析
              code: 'gasIot.IOTAbnormalData',
              name: 'IOTAbnormalData',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/gas-iot/IOT-abnormal-data',
                  name: 'IOTAbnormalData',
                  redirect: '/gas-iot/IOT-abnormal-data/list',
                },
                {
                  path: '/gas-iot/IOT-abnormal-data/list',
                  code: 'gasIot.IOTAbnormalData.listView',
                  name: 'list',
                  component: './DataAnalysis/IOT/DataAnalysisList',
                },
                {
                  path: '/gas-iot/IOT-abnormal-data/electricity/:id/count/:count',
                  code: 'gasIot.IOTAbnormalData.electricity',
                  name: 'electricity',
                  component: './DataAnalysis/IOT/Electricity',
                },
                {
                  path: '/gas-iot/IOT-abnormal-data/toxic-gas/:id/count/:count',
                  code: 'gasIot.IOTAbnormalData.toxicGas',
                  name: 'toxicGas',
                  component: './DataAnalysis/IOT/ToxicGas',
                },
                {
                  path: '/gas-iot/IOT-abnormal-data/waste-water/:id/count/:count',
                  code: 'gasIot.IOTAbnormalData.wasteWater',
                  name: 'wasteWater',
                  component: './DataAnalysis/IOT/WasteWater',
                },
                {
                  path: '/gas-iot/IOT-abnormal-data/waste-gas/:id/count/:count',
                  code: 'gasIot.IOTAbnormalData.wasteGas',
                  name: 'wasteGas',
                  component: './DataAnalysis/IOT/WasteGas',
                },
                {
                  path: '/gas-iot/IOT-abnormal-data/storage-tank/:id/count/:count',
                  code: 'gasIot.IOTAbnormalData.storageTank',
                  name: 'storageTank',
                  component: './DataAnalysis/IOT/StorageTank',
                },
                {
                  path: '/gas-iot/IOT-abnormal-data/smoke-detector/:id/count/:count',
                  code: 'gasIot.IOTAbnormalData.smokeDetector',
                  name: 'smokeDetector',
                  component: './DataAnalysis/IOT/SmokeDetector',
                },
                {
                  path: '/gas-iot/IOT-abnormal-data/humiture/:id/count/:count',
                  code: 'gasIot.IOTAbnormalData.humiture',
                  name: 'humiture',
                  component: './DataAnalysis/IOT/Humiture',
                },
                {
                  path: '/gas-iot/IOT-abnormal-data/water/:id/count/:count',
                  code: 'gasIot.IOTAbnormalData.water',
                  name: 'water',
                  component: './DataAnalysis/IOT/Water',
                },
                {
                  path: '/gas-iot/IOT-abnormal-data/fire-alarm/company/:companyId',
                  code: 'gasIot.IOTAbnormalData.fireDetailView',
                  name: 'companyDetail',
                  component: './DynamicMonitoring/FireAlarm/CompanyDetail',
                },
                {
                  path: '/gas-iot/IOT-abnormal-data/fire-alarm/history-record/:companyId',
                  name: 'historyRecord',
                  code: 'gasIot.IOTAbnormalData.fireHistoryRecordView',
                  component: './DynamicMonitoring/FireAlarm/HistoryRecord',
                },
              ],
            },
            {
              name: 'realtimeMonitor', // 可燃有毒气体实时监测
              code: 'gasIot.realtimeMonitor',
              path: '/gas-iot/realtime-monitor',
              developing: true,
              hideChildrenInMenu: true,
              routes: [],
            },
            {
              name: 'monitorReport', // 可燃有毒气体监测报表
              code: 'gasIot.monitorReport',
              path: '/gas-iot/monitor-report',
              component: './IoT/MajorHazard/Gas/History',
            },
          ],
        },

        // 企业安全风险分区管理系统
        {
          path: '/risk-control', // 风险分级管控
          code: 'riskControl',
          icon: 'control',
          name: 'riskControl',
          systemType: 2,
          routes: [
            {
              path: '/risk-control/risk-point-manage', // 风险点管理
              code: 'riskControl.riskPointManage',
              name: 'riskPointManage',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/risk-control/risk-point-manage',
                  name: 'riskPointManage',
                  redirect: '/risk-control/risk-point-manage/index',
                },
                {
                  path: '/risk-control/risk-point-manage/index',
                  code: 'riskControl.riskPointManage.listView',
                  name: 'listView',
                  component: './RiskControl/RiskPointManage/index',
                },
                {
                  path: '/risk-control/risk-point-manage/risk-point-List/:id',
                  code: 'riskControl.riskPointManage.view',
                  name: 'view',
                  component: './RiskControl/RiskPointManage/RiskPointList',
                },
                {
                  path: '/risk-control/risk-point-manage/:type/list/:id',
                  code: 'riskControl.riskPointManage.view',
                  name: 'view',
                  component: './RiskControl/RiskPointManage/RiskPointList',
                },
                {
                  path: '/risk-control/risk-point-manage/risk-point-add',
                  code: 'riskControl.riskPointManage.add',
                  name: 'add',
                  component: './RiskControl/RiskPointManage/RiskPointEdit',
                },
                {
                  path: '/risk-control/risk-point-manage/risk-point-edit/:id',
                  code: 'riskControl.riskPointManage.edit',
                  name: 'edit',
                  component: './RiskControl/RiskPointManage/RiskPointEdit',
                },
                {
                  path: '/risk-control/risk-point-manage/risk-card-list/:id',
                  code: 'riskControl.riskPointManage.view',
                  name: 'riskCard',
                  component: './RiskControl/RiskPointManage/RiskCard',
                },
                {
                  path: '/risk-control/risk-point-manage/risk-card-add',
                  code: 'riskControl.riskPointManage.view',
                  name: 'riskCardAdd',
                  component: './RiskControl/RiskPointManage/RiskCardEdit',
                },
                {
                  path: '/risk-control/risk-point-manage/risk-card-edit/:id',
                  code: 'riskControl.riskPointManage.view',
                  name: 'riskCardEdit',
                  component: './RiskControl/RiskPointManage/RiskCardEdit',
                },
                {
                  path: '/risk-control/risk-point-manage/risk-card-printer/:id',
                  code: 'riskControl.riskPointManage.view',
                  name: 'riskCardPinter',
                  component: './RiskControl/RiskPointManage/RiskCardPrinter',
                },
              ],
            },
            {
              name: 'fourColorImage', // 风险四色图管理
              code: 'riskControl.fourColorImage',
              path: '/risk-control/four-color-image',
              developing: true,
              hideChildrenInMenu: true,
              routes: [],
            },
            {
              name: 'upgradeWarning', // 风险升级预警信息
              code: 'riskControl.upgradeWarning',
              path: '/risk-control/upgrade-warning',
              developing: true,
              hideChildrenInMenu: true,
              routes: [],
            },
            {
              name: 'reevaluateWarning', // 复评预警管理
              code: 'riskControl.reevaluateWarning',
              path: '/risk-control/reevaluate-warning',
              developing: true,
              hideChildrenInMenu: true,
              routes: [],
            },
            {
              name: 'changeWarning', // 变更预警管理
              code: 'riskControl.changeWarning',
              path: '/risk-control/change-warning',
              developing: true,
              hideChildrenInMenu: true,
              routes: [],
            },
          ],
        },

        {
          path: '/control-measures-follow-up', // 管控措施跟进信息管理
          code: 'controlMeasuresFollowUp',
          name: 'controlMeasuresFollowUp',
          icon: 'select',
          systemType: 2,
          routes: [
            {
              path: '/control-measures-follow-up/company-report', // 企业风险点自查报表
              code: 'controlMeasuresFollowUp.companyReport',
              name: 'companyReport',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/control-measures-follow-up/company-report',
                  name: 'companyReport',
                  redirect: '/control-measures-follow-up/company-report/list',
                },
                {
                  path: '/control-measures-follow-up/company-report/list',
                  code: 'controlMeasuresFollowUp.companyReport.view',
                  name: 'list',
                  component: './DataAnalysis/CompanyReport/CompanyReportList',
                },
                {
                  path: '/control-measures-follow-up/company-report/detail/:id',
                  code: 'controlMeasuresFollowUp.companyReport.view',
                  name: 'detail',
                  component: './DataAnalysis/CompanyReport/CompanyReportDetail',
                },
                {
                  path: '/control-measures-follow-up/company-report/checkDetail/:id',
                  code: 'controlMeasuresFollowUp.companyReport.view',
                  name: 'detail',
                  component: './DataAnalysis/HiddenDangerReport/HiddenDangerReportDetail',
                },
              ],
            },
            {
              path: '/control-measures-follow-up/hidden-danger-report', // 隐患排查报表
              code: 'controlMeasuresFollowUp.hiddenDangerReport',
              name: 'hiddenDangerReport',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/control-measures-follow-up/hidden-danger-report',
                  name: 'hiddenDangerReport',
                  redirect: '/control-measures-follow-up/hidden-danger-report/list',
                },
                {
                  path: '/control-measures-follow-up/hidden-danger-report/list',
                  code: 'controlMeasuresFollowUp.hiddenDangerReport.view',
                  name: 'list',
                  component: './DataAnalysis/HiddenDangerReport/HiddenDangerReportList',
                },
                {
                  path: '/control-measures-follow-up/hidden-danger-report/detail/:id',
                  code: 'controlMeasuresFollowUp.hiddenDangerReport.view',
                  name: 'detail',
                  component: './DataAnalysis/HiddenDangerReport/HiddenDangerReportDetail',
                },
              ],
            },
            {
              path: '/control-measures-follow-up/hidden-danger-count-report', // 隐患统计报表
              code: 'controlMeasuresFollowUp.hiddenDangerCountReport',
              name: 'hiddenDangerCountReport',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/control-measures-follow-up/hidden-danger-count-report',
                  name: 'hiddenDangerCountReport',
                  redirect: '/control-measures-follow-up/hidden-danger-count-report/list',
                },
                {
                  path: '/control-measures-follow-up/hidden-danger-count-report/list',
                  code: 'controlMeasuresFollowUp.hiddenDangerCountReport.view',
                  name: 'list',
                  component: './DataAnalysis/HiddenDangerCountReport/CompanyList',
                },
                {
                  path: '/control-measures-follow-up/hidden-danger-count-report/detail',
                  code: 'controlMeasuresFollowUp.hiddenDangerCountReport.view',
                  name: 'detail',
                  component: './DataAnalysis/HiddenDangerCountReport/HiddenDangerCountReport',
                },
              ],
            },
          ],
        },

        {
          path: '/two-information-management', // 两单信息管理
          code: 'twoInformationManagement',
          icon: 'bell',
          name: 'twoInformationManagement',
          systemType: 2,
          routes: [
            {
              name: 'dangerFactorsList', // 危险（有害）因素排查辨识清单
              code: 'twoInformationManagement.dangerFactorsList',
              path: '/two-information-management/danger-factors-list',
              hideChildrenInMenu: true,
              routes: [
                {
                  name: 'list',
                  path: '/two-information-management/danger-factors-list',
                  redirect: '/two-information-management/danger-factors-list/list',
                },
                {
                  name: 'list',
                  code: 'twoInformationManagement.dangerFactorsList.list',
                  path: '/two-information-management/danger-factors-list/list',
                  component: './TwoInformationManagement/DangerFactorsList/TableList',
                },
                {
                  name: 'view',
                  code: 'twoInformationManagement.dangerFactorsList.view',
                  path: '/two-information-management/danger-factors-list/view/:id',
                  component: './TwoInformationManagement/DangerFactorsList/Edit',
                },
                {
                  name: 'add',
                  code: 'twoInformationManagement.dangerFactorsList.add',
                  path: '/two-information-management/danger-factors-list/add',
                  component: './TwoInformationManagement/DangerFactorsList/Edit',
                },
                {
                  name: 'edit',
                  code: 'twoInformationManagement.dangerFactorsList.edit',
                  path: '/two-information-management/danger-factors-list/edit/:id',
                  component: './TwoInformationManagement/DangerFactorsList/Edit',
                },
              ],
            },
            {
              name: 'safetyRiskList', // 安全风险分级管控清单
              code: 'twoInformationManagement.safetyRiskList',
              path: '/two-information-management/safety-risk-list',
              hideChildrenInMenu: true,
              routes: [
                {
                  name: 'list',
                  path: '/two-information-management/safety-risk-list',
                  redirect: '/two-information-management/safety-risk-list/list',
                },
                {
                  name: 'list',
                  code: 'twoInformationManagement.safetyRiskList.list',
                  path: '/two-information-management/safety-risk-list/list',
                  component: './TwoInformationManagement/SafetyRiskList/TableList',
                },
                {
                  name: 'view',
                  code: 'twoInformationManagement.safetyRiskList.view',
                  path: '/two-information-management/safety-risk-list/view/:id',
                  component: './TwoInformationManagement/SafetyRiskList/Edit',
                },
                {
                  name: 'add',
                  code: 'twoInformationManagement.safetyRiskList.add',
                  path: '/two-information-management/safety-risk-list/add',
                  component: './TwoInformationManagement/SafetyRiskList/Edit',
                },
                {
                  name: 'edit',
                  code: 'twoInformationManagement.safetyRiskList.edit',
                  path: '/two-information-management/safety-risk-list/edit/:id',
                  component: './TwoInformationManagement/SafetyRiskList/Edit',
                },
              ],
            },
          ],
        },

        {
          path: '/cards-info', // 三卡信息管理
          code: 'cardsInfo',
          icon: 'idcard',
          name: 'cardsInfo',
          systemType: 2,
          routes: [
            {
              name: 'commitmentCard', // 承诺卡
              code: 'cardsInfo.commitmentCard',
              path: '/cards-info/commitment-card',
              hideChildrenInMenu: true,
              routes: [
                {
                  name: 'list',
                  path: '/cards-info/commitment-card',
                  redirect: '/cards-info/commitment-card/list',
                },
                {
                  name: 'list',
                  code: 'cardsInfo.commitmentCard.list',
                  path: '/cards-info/commitment-card/list',
                  component: './CardsInfo/CommitmentCard/TableList',
                },
                {
                  name: 'view',
                  code: 'cardsInfo.commitmentCard.view',
                  path: '/cards-info/commitment-card/view/:id',
                  component: './CardsInfo/CommitmentCard/Edit',
                },
                {
                  name: 'add',
                  code: 'cardsInfo.commitmentCard.add',
                  path: '/cards-info/commitment-card/add',
                  component: './CardsInfo/CommitmentCard/Edit',
                },
                {
                  name: 'edit',
                  code: 'cardsInfo.commitmentCard.edit',
                  path: '/cards-info/commitment-card/edit/:id',
                  component: './CardsInfo/CommitmentCard/Edit',
                },
              ],
            },
            {
              name: 'knowCard', // 告知卡
              code: 'cardsInfo.knowCard',
              path: '/cards-info/know-card',
              hideChildrenInMenu: true,
              routes: [
                {
                  name: 'list',
                  path: '/cards-info/know-card',
                  redirect: '/cards-info/know-card/list',
                },
                {
                  name: 'list',
                  code: 'cardsInfo.knowCard.list',
                  path: '/cards-info/know-card/list',
                  component: './CardsInfo/KnowCard/TableList',
                },
                {
                  name: 'view',
                  code: 'cardsInfo.knowCard.view',
                  path: '/cards-info/know-card/view/:id',
                  component: './CardsInfo/KnowCard/Edit',
                },
                {
                  name: 'add',
                  code: 'cardsInfo.knowCard.add',
                  path: '/cards-info/know-card/add',
                  component: './CardsInfo/KnowCard/Edit',
                },
                {
                  name: 'edit',
                  code: 'cardsInfo.knowCard.edit',
                  path: '/cards-info/know-card/edit/:id',
                  component: './CardsInfo/KnowCard/Edit',
                },
              ],
            },
            {
              name: 'emergencyCard', // 应急卡
              code: 'cardsInfo.emergencyCard',
              path: '/cards-info/emergency-card',
              hideChildrenInMenu: true,
              routes: [
                {
                  name: 'list',
                  path: '/cards-info/emergency-card',
                  redirect: '/cards-info/emergency-card/list',
                },
                {
                  name: 'list',
                  code: 'cardsInfo.emergencyCard.list',
                  path: '/cards-info/emergency-card/list',
                  component: './CardsInfo/EmergencyCard/TableList',
                },
                {
                  name: 'view',
                  code: 'cardsInfo.emergencyCard.view',
                  path: '/cards-info/emergency-card/view/:id',
                  component: './CardsInfo/EmergencyCard/Edit',
                },
                {
                  name: 'add',
                  code: 'cardsInfo.emergencyCard.add',
                  path: '/cards-info/emergency-card/add',
                  component: './CardsInfo/EmergencyCard/Edit',
                },
                {
                  name: 'edit',
                  code: 'cardsInfo.emergencyCard.edit',
                  path: '/cards-info/emergency-card/edit/:id',
                  component: './CardsInfo/EmergencyCard/Edit',
                },
              ],
            },
          ],
        },

        // 生产人员在岗在位系统
        {
          path: '/personnel-management', // (在岗在位系统)基本信息
          code: 'personnelManagement',
          icon: 'file-text',
          name: 'personnelManagement',
          systemType: 3,
          routes: [
            {
              path: '/personnel-management/personnel-info', // 人员基本信息
              code: 'personnelManagement.personnelInfo',
              name: 'personnelInfo',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/personnel-management/personnel-info',
                  name: 'personnelInfo',
                  redirect: '/personnel-management/personnel-info/company-list',
                },
                {
                  path: '/personnel-management/personnel-info/company-list',
                  code: 'personnelManagement.personnelInfo.listView',
                  name: 'companyList',
                  component: './PersonnelManagement/PersonnelInfo/CompanyList',
                },
                {
                  path: '/personnel-management/personnel-info/personnel-list/:id',
                  code: 'personnelManagement.personnelInfo.view',
                  name: 'personnelList',
                  component: './PersonnelManagement/PersonnelInfo/PersonnelList',
                },
                {
                  path: '/personnel-management/personnel-info/personnel-add',
                  code: 'personnelManagement.personnelInfo.add',
                  name: 'personnelAdd',
                  component: './PersonnelManagement/PersonnelInfo/PersonnelEdit',
                },
                {
                  path: '/personnel-management/personnel-info/personnel-edit/:id',
                  code: 'personnelManagement.personnelInfo.edit',
                  name: 'personnelEdit',
                  component: './PersonnelManagement/PersonnelInfo/PersonnelEdit',
                },
                {
                  path: '/personnel-management/personnel-info/personnel-detail/:id',
                  code: 'personnelManagement.personnelInfo.detail',
                  name: 'personnelDetail',
                  component: './PersonnelManagement/PersonnelInfo/PersonnelDetail',
                },
              ],
            },
            {
              path: '/personnel-management/vehicle-info', // 车辆基本信息
              code: 'personnelManagement.vehicleInfo',
              name: 'vehicleInfo',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/personnel-management/vehicle-info',
                  name: 'vehicleInfo',
                  redirect: '/personnel-management/vehicle-info/company-list',
                },
                {
                  path: '/personnel-management/vehicle-info/company-list',
                  code: 'personnelManagement.vehicleInfo.listView',
                  name: 'companyList',
                  component: './PersonnelManagement/VehicleInfo/CompanyList',
                },
                {
                  path: '/personnel-management/vehicle-info/vehicle-list/:id',
                  code: 'personnelManagement.vehicleInfo.view',
                  name: 'vehicleList',
                  component: './PersonnelManagement/VehicleInfo/VehicleList',
                },
                {
                  path: '/personnel-management/vehicle-info/vehicle-add',
                  code: 'personnelManagement.vehicleInfo.add',
                  name: 'vehicleAdd',
                  component: './PersonnelManagement/VehicleInfo/VehicleEdit',
                },
                {
                  path: '/personnel-management/vehicle-info/vehicle-edit/:id',
                  code: 'personnelManagement.vehicleInfo.edit',
                  name: 'vehicleEdit',
                  component: './PersonnelManagement/VehicleInfo/VehicleEdit',
                },
                {
                  path: '/personnel-management/vehicle-info/vehicle-detail/:id',
                  code: 'personnelManagement.vehicleInfo.detail',
                  name: 'vehicleDetail',
                  component: './PersonnelManagement/VehicleInfo/VehicleDetail',
                },
              ],
            },
            {
              path: '/personnel-management/check-point', // 卡口信息
              code: 'personnelManagement.checkPoint',
              name: 'checkPoint',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/personnel-management/check-point',
                  name: 'checkPoint',
                  redirect: '/personnel-management/check-point/company-list',
                },
                {
                  path: '/personnel-management/check-point/company-list',
                  code: 'personnelManagement.checkPoint.companyListView',
                  name: 'companyList',
                  component: './PersonnelManagement/CheckPoint/CompanyList',
                },
                {
                  path: '/personnel-management/check-point/list/:companyId/:tabIndex',
                  code: 'personnelManagement.checkPoint.listView',
                  name: 'list',
                  component: './PersonnelManagement/CheckPoint/CheckList',
                },
                {
                  path: '/personnel-management/check-point/add/:companyId/:tabIndex',
                  code: 'personnelManagement.checkPoint.add',
                  name: 'add',
                  component: './PersonnelManagement/CheckPoint/CheckEdit',
                },
                {
                  path: '/personnel-management/check-point/detail/:companyId/:tabIndex/:id',
                  code: 'personnelManagement.checkPoint.view',
                  name: 'detail',
                  component: './PersonnelManagement/CheckPoint/CheckEdit',
                },
                {
                  path: '/personnel-management/check-point/edit/:companyId/:tabIndex/:id',
                  code: 'personnelManagement.checkPoint.add',
                  name: 'edit',
                  component: './PersonnelManagement/CheckPoint/CheckEdit',
                },
              ],
            },
          ],
        },

        {
          path: '/personnel-position', // 人员定位
          name: 'personnelPosition',
          icon: 'environment',
          code: 'personnelPosition',
          systemType: 3,
          hideInMenu: false,
          routes: [
            {
              name: 'monitor', // 定位监控
              path: '/personnel-position/monitor',
              code: 'personnelPosition.monitor',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/personnel-position/monitor',
                  redirect: '/personnel-position/monitor/index',
                },
                {
                  name: 'index',
                  code: 'personnelPosition.monitor.view',
                  path: '/personnel-position/monitor/index',
                  component: './PersonnelPositionNew/Monitor/index',
                },
              ],
            },
            {
              name: 'track', // 目标跟踪
              path: '/personnel-position/track',
              code: 'personnelPosition.track',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/personnel-position/track',
                  redirect: '/personnel-position/track/index',
                },
                {
                  name: 'index',
                  code: 'personnelPosition.track.view',
                  path: '/personnel-position/track/index',
                  component: './PersonnelPositionNew/Track/index',
                },
              ],
            },
            {
              name: 'analysis', // 行为分析
              path: '/personnel-position/analysis',
              code: 'personnelPosition.analysis',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/personnel-position/analysis',
                  redirect: '/personnel-position/analysis/index',
                },
                {
                  name: 'index',
                  code: 'personnelPosition.analysis.view',
                  path: '/personnel-position/analysis/index',
                  component: './PersonnelPositionNew/Analysis/index',
                },
              ],
            },
            {
              name: 'alarm', // 报警查看
              path: '/personnel-position/alarm',
              code: 'personnelPosition.alarm',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/personnel-position/alarm',
                  redirect: '/personnel-position/alarm/index',
                },
                {
                  name: 'index',
                  code: 'personnelPosition.alarm.view',
                  path: '/personnel-position/alarm/index',
                  component: './PersonnelPositionNew/Alarm/index',
                },
              ],
            },
            {
              name: 'report', // 报表统计
              path: '/personnel-position/report',
              code: 'personnelPosition.report',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/personnel-position/report',
                  redirect: '/personnel-position/report/index',
                },
                {
                  name: 'index',
                  code: 'personnelPosition.report.view',
                  path: '/personnel-position/report/index',
                  component: './PersonnelPositionNew/Report/index',
                },
              ],
            },
            {
              name: 'section', // 区域安全
              path: '/personnel-position/section',
              code: 'personnelPosition.section',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/personnel-position/section',
                  redirect: '/personnel-position/section/index',
                },
                {
                  name: 'index',
                  code: 'personnelPosition.section.view',
                  path: '/personnel-position/section/index',
                  component: './PersonnelPositionNew/Section/index',
                },
              ],
            },
            {
              name: 'personnel', // 人员管理
              path: '/personnel-position/personnel',
              code: 'personnelPosition.personnel',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/personnel-position/personnel',
                  redirect: '/personnel-position/personnel/index',
                },
                {
                  name: 'index',
                  code: 'personnelPosition.personnel.view',
                  path: '/personnel-position/personnel/index',
                  component: './PersonnelPositionNew/Personnel/index',
                },
              ],
            },
            {
              name: 'equipment', // 设备管理
              path: '/personnel-position/equipment',
              code: 'personnelPosition.equipment',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/personnel-position/equipment',
                  redirect: '/personnel-position/equipment/index',
                },
                {
                  name: 'index',
                  code: 'personnelPosition.equipment.view',
                  path: '/personnel-position/equipment/index',
                  component: './PersonnelPositionNew/Equipment/index',
                },
              ],
            },
            {
              name: 'map', // 地图管理
              path: '/personnel-position/map',
              code: 'personnelPosition.map',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/personnel-position/map',
                  redirect: '/personnel-position/map/index',
                },
                {
                  name: 'index',
                  code: 'personnelPosition.map.view',
                  path: '/personnel-position/map/index',
                  component: './PersonnelPositionNew/Map/index',
                },
              ],
            },
            {
              name: 'system', // 系统设置
              path: '/personnel-position/system',
              code: 'personnelPosition.system',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/personnel-position/system',
                  redirect: '/personnel-position/system/index',
                },
                {
                  name: 'index',
                  code: 'personnelPosition.system.view',
                  path: '/personnel-position/system/index',
                  component: './PersonnelPositionNew/System/index',
                },
              ],
            },
            // {
            //   name: 'beaconManagement', // 信标管理
            //   path: '/personnel-position/beacon-management',
            //   code: 'personnelPosition.beaconManagement',
            //   hideChildrenInMenu: true,
            //   routes: [
            //     {
            //       name: 'companies',
            //       path: '/personnel-position/beacon-management',
            //       redirect: '/personnel-position/beacon-management/companies',
            //     },
            //     {
            //       name: 'companies',
            //       code: 'personnelPosition.beaconManagement.listView',
            //       path: '/personnel-position/beacon-management/companies',
            //       component: './PersonnelPosition/BeaconManagement/index',
            //     },
            //     {
            //       name: 'companyBeacon',
            //       code: 'personnelPosition.beaconManagement.companyBeacon',
            //       path: '/personnel-position/beacon-management/company/:companyId',
            //       component: './PersonnelPosition/BeaconManagement/CompanyBeacon',
            //     },
            //     {
            //       name: 'add',
            //       code: 'personnelPosition.beaconManagement.add',
            //       path: '/personnel-position/beacon-management/company/:companyId/beacon/add',
            //       component: './PersonnelPosition/BeaconManagement/BeaconHandler',
            //     },
            //     {
            //       name: 'edit',
            //       code: 'personnelPosition.beaconManagement.edit',
            //       path: '/personnel-position/beacon-management/company/:companyId/beacon/edit/:id',
            //       component: './PersonnelPosition/BeaconManagement/BeaconHandler',
            //     },
            //   ],
            // },
            // {
            //   name: 'tagManagement', // 标签管理
            //   path: '/personnel-position/tag-management',
            //   code: 'personnelPosition.tagManagement',
            //   hideChildrenInMenu: true,
            //   routes: [
            //     {
            //       name: 'companyList',
            //       path: '/personnel-position/tag-management',
            //       redirect: '/personnel-position/tag-management/companies',
            //     },
            //     {
            //       name: 'companyList',
            //       path: '/personnel-position/tag-management/companies',
            //       code: 'personnelPosition.tagManagement.companyList',
            //       component: './PersonnelPosition/TagManagement/index',
            //     },
            //     {
            //       name: 'list',
            //       path: '/personnel-position/tag-management/company/:companyId',
            //       code: 'personnelPosition.tagManagement.listView',
            //       component: './PersonnelPosition/TagManagement/TagManagementList',
            //     },
            //     {
            //       name: 'add',
            //       path: '/personnel-position/tag-management/add/:companyId',
            //       code: 'personnelPosition.tagManagement.add',
            //       component: './PersonnelPosition/TagManagement/TagManagementAdd',
            //     },
            //     {
            //       name: 'edit',
            //       path: '/personnel-position/tag-management/edit/:companyId/:id',
            //       code: 'personnelPosition.tagManagement.edit',
            //       component: './PersonnelPosition/TagManagement/TagManagementAdd',
            //     },
            //     {
            //       name: 'detail',
            //       path: '/personnel-position/tag-management/detail',
            //       code: 'personnelPosition.tagManagement.view',
            //       component: './PersonnelPosition/TagManagement/TagManagementDetail',
            //     },
            //     {
            //       name: 'import',
            //       path: '/personnel-position/tag-management/import/:companyId',
            //       code: 'personnelPosition.tagManagement.import',
            //       component: './PersonnelPosition/TagManagement/ImportTag',
            //     },
            //   ],
            // },
            // {
            //   name: 'alarmManagement', // 报警管理
            //   path: '/personnel-position/alarm-management',
            //   code: 'personnelPosition.alarmManagement',
            //   hideChildrenInMenu: true,
            //   routes: [
            //     {
            //       name: 'index',
            //       path: '/personnel-position/alarm-management',
            //       redirect: '/personnel-position/alarm-management/index',
            //     },
            //     {
            //       name: 'index',
            //       path: '/personnel-position/alarm-management/index',
            //       code: 'personnelPosition.alarmManagement.companyListView',
            //       component: './PersonnelPosition/AlarmManagement/CompanyList',
            //     },
            //     {
            //       name: 'alarmList',
            //       path: '/personnel-position/alarm-management/list/:companyId',
            //       code: 'personnelPosition.alarmManagement.alarmListView',
            //       component: './PersonnelPosition/AlarmManagement/AlarmList',
            //     },
            //     {
            //       name: 'add',
            //       path: '/personnel-position/alarm-management/add/:companyId',
            //       code: 'personnelPosition.alarmManagement.add',
            //       component: './PersonnelPosition/AlarmManagement/AlarmAddOrEdit',
            //     },
            //     {
            //       name: 'edit',
            //       path: '/personnel-position/alarm-management/edit/:companyId/:alarmId',
            //       code: 'personnelPosition.alarmManagement.edit',
            //       component: './PersonnelPosition/AlarmManagement/AlarmAddOrEdit',
            //     },
            //     {
            //       name: 'detail',
            //       path: '/personnel-position/alarm-management/detail/:companyId/:alarmId',
            //       code: 'personnelPosition.alarmManagement.view',
            //       component: './PersonnelPosition/AlarmManagement/AlarmDetail',
            //     },
            //   ],
            // },
            // {
            //   name: 'map',
            //   path: '/personnel-position/map-management', // 地图管理
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
            //       path: '/personnel-position/map-management/company-map/:companyId',
            //       code: 'personnelPosition.mapManagement.companyMap',
            //       component: './PersonnelPosition/Map/CompanyMap',
            //     },
            //     {
            //       name: 'associateMap',
            //       path: '/personnel-position/map-management/associate-map/:id',
            //       code: 'personnelPosition.mapManagement.associateMap',
            //       component: './PersonnelPosition/Map/AssociateMap',
            //     },
            //     {
            //       name: 'add',
            //       path: '/personnel-position/map-management/company-map/:companyId/add',
            //       code: 'personnelPosition.mapManagement.add',
            //       component: './PersonnelPosition/Map/AddMap',
            //     },
            //     {
            //       name: 'edit',
            //       path: '/personnel-position/map-management/company-map/:companyId/edit/:id',
            //       code: 'personnelPosition.mapManagement.edit',
            //       component: './PersonnelPosition/Map/AddMap',
            //     },
            //   ],
            // },
            // {
            //   name: 'sectionManagement', // 区域管理
            //   path: '/personnel-position/section-management',
            //   code: 'personnelPosition.sectionManagement',
            //   hideChildrenInMenu: true,
            //   routes: [
            //     {
            //       name: 'companies',
            //       path: '/personnel-position/section-management',
            //       redirect: '/personnel-position/section-management/companies',
            //     },
            //     {
            //       name: 'companies',
            //       code: 'personnelPosition.sectionManagement.companies',
            //       path: '/personnel-position/section-management/companies',
            //       component: './PersonnelPosition/SectionManagement/index',
            //     },
            //     {
            //       name: 'list',
            //       code: 'personnelPosition.sectionManagement.listView',
            //       path: '/personnel-position/section-management/company/:id',
            //       component: './PersonnelPosition/SectionManagement/CompanySections',
            //     },
            //     {
            //       name: 'zoning',
            //       code: 'personnelPosition.sectionManagement.divide',
            //       path: '/personnel-position/section-management/company/:companyId/zoning/:id',
            //       component: './PersonnelPosition/SectionManagement/Zoning',
            //     },
            //   ],
            // },
          ],
        },

        {
          path: '/security-manage', // 安防管理
          code: 'securityManage',
          icon: 'security-scan',
          name: 'securityManage',
          systemType: 3,
          routes: [
            {
              path: '/security-manage/entrance-and-exit-monitor', // 出入口监测
              code: 'securityManage.entranceAndExitMonitor',
              name: 'entranceAndExitMonitor',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/security-manage/entrance-and-exit-monitor',
                  name: 'entranceAndExitMonitor',
                  redirect: '/security-manage/entrance-and-exit-monitor/company-list',
                },
                {
                  path: '/security-manage/entrance-and-exit-monitor/company-list',
                  code: 'securityManage.entranceAndExitMonitor.listView',
                  name: 'companyList',
                  component: './SecurityManage/EntranceAndExitMonitor/CompanyList',
                },
                {
                  path: '/security-manage/entrance-and-exit-monitor/face-database/:id',
                  code: 'securityManage.entranceAndExitMonitor.faceDatabaseView',
                  name: 'faceDatabase',
                  component: './SecurityManage/EntranceAndExitMonitor/FaceDatabase',
                },
                {
                  path: '/security-manage/entrance-and-exit-monitor/face-recognition-camera/:id',
                  code: 'securityManage.entranceAndExitMonitor.cameraView',
                  name: 'faceRecognitionCamera',
                  component:
                    './SecurityManage/EntranceAndExitMonitor/FaceRecognitionCamera/CameraList',
                },
                {
                  path: '/security-manage/entrance-and-exit-monitor/camera-add',
                  code: 'securityManage.entranceAndExitMonitor.cameraView',
                  name: 'cameraAdd',
                  component:
                    './SecurityManage/EntranceAndExitMonitor/FaceRecognitionCamera/CameraEdit',
                },
                {
                  path: '/security-manage/entrance-and-exit-monitor/camera-edit/:id',
                  code: 'securityManage.entranceAndExitMonitor.cameraView',
                  name: 'cameraEdit',
                  component:
                    './SecurityManage/EntranceAndExitMonitor/FaceRecognitionCamera/CameraEdit',
                },
                {
                  path: '/security-manage/entrance-and-exit-monitor/camera-detail/:id',
                  code: 'securityManage.entranceAndExitMonitor.cameraView',
                  name: 'cameraDetail',
                  component:
                    './SecurityManage/EntranceAndExitMonitor/FaceRecognitionCamera/CameraDetail',
                },
                {
                  path: '/security-manage/entrance-and-exit-monitor/monitoring-points-list/:id',
                  code: 'securityManage.entranceAndExitMonitor.monitorPointView',
                  name: 'monitoringPoints',
                  component:
                    './SecurityManage/EntranceAndExitMonitor/MonitoringPoints/MonitorPointsList',
                },
                {
                  path: '/security-manage/entrance-and-exit-monitor/monitoring-points-detail/:id',
                  code: 'securityManage.entranceAndExitMonitor.monitorPointView',
                  name: 'monitoringPointsDetail',
                  component:
                    './SecurityManage/EntranceAndExitMonitor/MonitoringPoints/MonitorPointsDetail',
                },
                {
                  path: '/security-manage/entrance-and-exit-monitor/monitoring-points-add',
                  code: 'securityManage.entranceAndExitMonitor.monitorPointView',
                  name: 'monitoringPointsAdd',
                  component:
                    './SecurityManage/EntranceAndExitMonitor/MonitoringPoints/MonitorPointsEdit',
                },
                {
                  path: '/security-manage/entrance-and-exit-monitor/monitoring-points-edit/:id',
                  code: 'securityManage.entranceAndExitMonitor.monitorPointView',
                  name: 'monitoringPointsEdit',
                  component:
                    './SecurityManage/EntranceAndExitMonitor/MonitoringPoints/MonitorPointsEdit',
                },
                {
                  path: '/security-manage/entrance-and-exit-monitor/alarm-record/:id',
                  code: 'securityManage.entranceAndExitMonitor.alarmRecordView',
                  name: 'alarmRecord',
                  component: './SecurityManage/EntranceAndExitMonitor/AlarmRecord',
                },
              ],
            },
          ],
        },

        {
          path: '/safety-training', // 人员安全培训
          name: 'safetyTraining',
          icon: 'read',
          code: 'safetyTraining',
          systemType: 3,
          hideInMenu: false,
          routes: [
            {
              name: 'trainingProgram', // 安全生产培训计划
              path: '/safety-training/training-program',
              code: 'safetyTraining.trainingProgram',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/safety-training/training-program',
                  name: 'list',
                  redirect: '/safety-training/training-program/list',
                },
                {
                  path: '/safety-training/training-program/list',
                  code: 'safetyTraining.trainingProgram.list',
                  name: 'list',
                  component: './Training/TrainingProgram/List',
                },
                {
                  path: '/safety-training/training-program/:type/:id?',
                  code: 'safetyTraining.trainingProgram.list',
                  name: 'list',
                  component: './Training/TrainingProgram/Other',
                },
              ],
            },
            {
              name: 'knowledgeSys', // 知识体系管理
              path: '/safety-training/knowledgeSys',
              code: 'safetyTraining.points',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/safety-training/knowledgeSys',
                  code: 'safetyTraining.knowledgeSys.view',
                  name: 'KnowledgeSys',
                  component: './Training/KnowledgeSys/KnowledgeSys',
                },
              ],
            },
            {
              name: 'library', // 资源管理
              path: '/safety-training/library',
              code: 'safetyTraining.library',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/safety-training/library',
                  name: 'library',
                  redirect: '/safety-training/library/questions/list',
                },
                {
                  path: '/safety-training/library/:type/list',
                  code: 'safetyTraining.library.listView',
                  name: 'list',
                  component: './Training/Library/LibraryLayout',
                },
                {
                  path: '/safety-training/library/questions/add',
                  code: 'safetyTraining.library.add',
                  name: 'questionsAdd',
                  component: './Training/Library/Questions/QuestionsAdd',
                },
                {
                  path: '/safety-training/library/questions/edit/:id',
                  code: 'safetyTraining.library.edit',
                  name: 'questionsEdit',
                  component: './Training/Library/Questions/QuestionsAdd',
                },
                {
                  path: '/safety-training/library/article/add',
                  code: 'safetyTraining.library.add',
                  name: 'articleAdd',
                  component: './Training/Library/Article/ArticleAdd',
                },
                {
                  path: '/safety-training/library/article/edit/:id',
                  code: 'safetyTraining.library.edit',
                  name: 'articleEdit',
                  component: './Training/Library/Article/ArticleAdd',
                },
                {
                  path: '/safety-training/library/courseware/add',
                  code: 'safetyTraining.library.add',
                  name: 'coursewareAdd',
                  component: './Training/Library/Courseware/CoursewareAdd',
                },
                {
                  path: '/safety-training/library/courseware/edit/:id',
                  code: 'safetyTraining.library.edit',
                  name: 'coursewareEdit',
                  component: './Training/Library/Courseware/CoursewareAdd',
                },
              ],
            },
            {
              name: 'learning', // 学习管理
              path: '/safety-training/learning',
              code: 'safetyTraining.learning',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/safety-training/learning',
                  name: 'list',
                  redirect: '/safety-training/learning/article/list',
                },
                {
                  path: '/safety-training/learning/:type/list',
                  code: 'safetyTraining.learning.view',
                  name: 'list',
                  component: './Training/Learning/LearningLayout',
                },
                {
                  path: '/safety-training/learning/article/detail/:id',
                  code: 'safetyTraining.learning.view',
                  name: 'article',
                  component: './Training/Learning/Article/ArticleDeatil',
                },
                {
                  path: '/safety-training/learning/courseware/detail/:id',
                  code: 'safetyTraining.learning.view',
                  name: 'courseware',
                  component: './Training/Learning/Courseware/CoursewareDetail',
                },
              ],
            },
            {
              name: 'examinationPaper', // 试卷管理
              path: '/safety-training/examination-paper',
              code: 'safetyTraining.examinationPaper',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/safety-training/examination-paper',
                  name: 'examinationPaper',
                  redirect: '/safety-training/examination-paper/list',
                },
                {
                  path: '/safety-training/examination-paper/list',
                  code: 'safetyTraining.examinationPaper.listView',
                  name: 'list',
                  component: './Training/ExaminationPaper/List',
                },
                {
                  path: '/safety-training/examination-paper/detail/:id',
                  code: 'safetyTraining.examinationPaper.view',
                  name: 'view',
                  component: './Training/ExaminationPaper/Detail',
                },
                {
                  path: '/safety-training/examination-paper/add',
                  code: 'safetyTraining.examinationPaper.add',
                  name: 'add',
                  component: './Training/ExaminationPaper/Handler',
                },
                {
                  path: '/safety-training/examination-paper/edit/:id',
                  code: 'safetyTraining.examinationPaper.edit',
                  name: 'edit',
                  component: './Training/ExaminationPaper/Handler',
                },
                {
                  path: '/safety-training/examination-paper/preview/:id',
                  code: 'safetyTraining.examinationPaper.view',
                  name: 'view',
                  component: './Training/ExaminationPaper/Preview',
                },
              ],
            },
            {
              name: 'mission', // 考试任务
              path: '/safety-training/mission',
              code: 'safetyTraining.mission',
              hideChildrenInMenu: true,
              routes: [
                {
                  name: 'mission',
                  path: '/safety-training/mission',
                  redirect: '/safety-training/mission/list',
                },
                {
                  name: 'list',
                  path: '/safety-training/mission/list',
                  code: 'safetyTraining.mission.listView',
                  component: './Training/Mission/ExaminationMissionList',
                },
                {
                  name: 'add',
                  path: '/safety-training/mission/add',
                  code: 'safetyTraining.mission.add',
                  component: './Training/Mission/ExaminationMissionAdd',
                },
                {
                  name: 'edit',
                  path: '/safety-training/mission/edit/:id',
                  code: 'safetyTraining.mission.edit',
                  component: './Training/Mission/ExaminationMissionAdd',
                },
                {
                  name: 'detail',
                  path: '/safety-training/mission/view/:id',
                  code: 'safetyTraining.mission.view',
                  component: './Training/Mission/ExaminationMissionDetail',
                },
              ],
            },
            {
              name: 'myExam', // 我的考试
              path: '/safety-training/my-exam',
              code: 'safetyTraining.myExam',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/safety-training/my-exam',
                  name: 'myExam',
                  redirect: '/safety-training/my-exam/list',
                },
                {
                  path: '/safety-training/my-exam/list',
                  code: 'safetyTraining.myExam.listView',
                  name: 'list',
                  component: './Training/MyExam/ExamList',
                },
                {
                  path: '/safety-training/my-exam/examing/:id',
                  code: 'safetyTraining.myExam.listView',
                  name: 'examing',
                  component: './Training/MyExam/Examing',
                },
                {
                  path: '/safety-training/my-exam/result/:id',
                  code: 'safetyTraining.myExam.listView',
                  name: 'result',
                  component: './Training/MyExam/Result',
                },
              ],
            },
            {
              name: 'myFile', // 我的档案
              path: '/safety-training/myFile',
              code: 'safetyTraining.myFile',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/safety-training/myFile',
                  name: 'myFile',
                  redirect: '/safety-training/myFile/myFileList',
                },
                {
                  path: '/safety-training/myFile/myFileList',
                  code: 'safetyTraining.myFile.view',
                  name: 'myFile',
                  component: './Training/MyFile/MyFileList',
                },
                {
                  path: '/safety-training/myFile/myAnalysis/:id',
                  code: 'safetyTraining.myFile.view',
                  name: 'myAnalysis',
                  component: './Training/MyFile/MyAnalysis',
                },
                {
                  path: '/safety-training/myFile/mySynthesis',
                  code: 'safetyTraining.myFile.view',
                  name: 'mySynthesis',
                  component: './Training/MyFile/MySynthesis',
                },
              ],
            },
            {
              name: 'generalFile', // 综合档案
              path: '/safety-training/generalFile',
              code: 'safetyTraining.generalFile',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/safety-training/generalFile',
                  name: 'list',
                  redirect: '/safety-training/generalFile/examFile/list',
                },
                {
                  path: '/safety-training/generalFile/:type/list',
                  code: 'safetyTraining.generalFile.view',
                  name: 'list',
                  component: './Training/GeneralFile/GeneralFileLayout',
                },
                {
                  path: '/safety-training/generalFile/examDetailList/:id',
                  code: 'safetyTraining.generalFile.view',
                  name: 'examDetailList',
                  component: './Training/GeneralFile/ExamFile/ExamDetailList',
                },
                {
                  path: '/safety-training/generalFile/examReport/:id',
                  code: 'safetyTraining.generalFile.view',
                  name: 'examReport',
                  component: './Training/GeneralFile/ExamFile/ExamReport',
                },
                {
                  path: '/safety-training/generalFile/myFile/myFileList',
                  code: 'safetyTraining.generalFile.view',
                  name: 'personFile',
                  component: './Training/GeneralFile/MyFile/MyFileList',
                },
                {
                  path: '/safety-training/generalFile/myFile/myAnalysis/:id',
                  code: 'safetyTraining.generalFile.view',
                  name: 'myAnalysis',
                  component: './Training/GeneralFile/MyFile/MyAnalysis',
                },
                {
                  path: '/safety-training/generalFile/myFile/mySynthesis',
                  code: 'safetyTraining.generalFile.view',
                  name: 'mySynthesis',
                  component: './Training/GeneralFile/MyFile/MySynthesis',
                },
              ],
            },
          ],
        },

        // 企业生产全流程管理系统
        {
          path: '/base-info', // 基础数据管理
          code: 'baseInfo',
          name: 'baseInfo',
          icon: 'file-text',
          systemType: 4,
          routes: [
            {
              path: '/base-info/company', // 单位管理
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
                {
                  path: '/base-info/company/division/list/:id',
                  code: 'baseInfo.company.division.listView',
                  name: 'divisionList',
                  component: './BaseInfo/Company/UnitDivision/UnitDivisionList',
                },
                {
                  path: '/base-info/company/division/add',
                  code: 'baseInfo.company.division.add',
                  name: 'divisionAdd',
                  component: './BaseInfo/Company/UnitDivision/UnitDivisionEdit',
                },
                {
                  path: '/base-info/company/division/edit/:id',
                  code: 'baseInfo.company.division.edit',
                  name: 'divisionEdit',
                  component: './BaseInfo/Company/UnitDivision/UnitDivisionEdit',
                },
                {
                  path: '/base-info/company/division/detail/:id',
                  code: 'baseInfo.company.division.view',
                  name: 'divisionDetail',
                  component: './BaseInfo/Company/UnitDivision/UnitDivisionDetail',
                },
              ],
            },
            {
              name: 'registeredEngineerManagement', // 注册安全工程师管理
              code: 'baseInfo.registeredEngineerManagement',
              path: '/base-info/registered-engineer-management',
              hideChildrenInMenu: true,
              routes: [
                {
                  name: 'list',
                  path: '/base-info/registered-engineer-management',
                  redirect: '/base-info/registered-engineer-management/list',
                },
                {
                  name: 'list',
                  code: 'baseInfo.registeredEngineerManagement.listView',
                  path: '/base-info/registered-engineer-management/list',
                  component: './BaseInfo/RegisteredEngineerManagement/index',
                },
                {
                  name: 'add',
                  code: 'baseInfo.registeredEngineerManagement.add',
                  path: '/base-info/registered-engineer-management/add',
                  component: './BaseInfo/RegisteredEngineerManagement/Handle',
                },
                {
                  name: 'edit',
                  code: 'baseInfo.registeredEngineerManagement.edit',
                  path: '/base-info/registered-engineer-management/edit/:id',
                  component: './BaseInfo/RegisteredEngineerManagement/Handle',
                },
              ],
            },
          ],
        },

        {
          path: '/unit-license', // 单位证照管理
          code: 'unitLicense',
          name: 'unitLicense',
          icon: 'picture',
          systemType: 4,
          routes: [
            {
              name: 'industrialProductLicence', // 工业产品生产许可证
              code: 'unitLicense.industrialProductLicence',
              path: '/unit-license/industrial-product-licence',
              hideChildrenInMenu: true,
              routes: [
                {
                  name: 'list',
                  path: '/unit-license/industrial-product-licence',
                  redirect: '/unit-license/industrial-product-licence/list',
                },
                {
                  name: 'list',
                  code: 'unitLicense.industrialProductLicence.listView',
                  path: '/unit-license/industrial-product-licence/list',
                  component: './BaseInfo/IndustrialProductLicence/index',
                },
                {
                  name: 'add',
                  code: 'unitLicense.industrialProductLicence.add',
                  path: '/unit-license/industrial-product-licence/add',
                  component: './BaseInfo/IndustrialProductLicence/edit',
                },
                {
                  name: 'edit',
                  code: 'unitLicense.industrialProductLicence.edit',
                  path: '/unit-license/industrial-product-licence/edit/:id',
                  component: './BaseInfo/IndustrialProductLicence/edit',
                },
              ],
            },
            {
              name: 'dangerChemicalsPermit', // 危化品企业安全许可证
              code: 'unitLicense.dangerChemicalsPermit',
              path: '/unit-license/danger-chemicals-permit',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/unit-license/danger-chemicals-permit',
                  name: 'dangerChemicalsPermit',
                  redirect: '/unit-license/danger-chemicals-permit/list',
                },
                {
                  path: '/unit-license/danger-chemicals-permit/list',
                  name: 'list',
                  code: 'unitLicense.dangerChemicalsPermit.listView',
                  component: './BaseInfo/DangerChemicalsPermit/List',
                },
                {
                  path: '/unit-license/danger-chemicals-permit/add',
                  name: 'add',
                  code: 'unitLicense.dangerChemicalsPermit.add',
                  component: './BaseInfo/DangerChemicalsPermit/Handle',
                },
                {
                  path: '/unit-license/danger-chemicals-permit/edit/:id',
                  name: 'edit',
                  code: 'unitLicense.dangerChemicalsPermit.edit',
                  component: './BaseInfo/DangerChemicalsPermit/Handle',
                },
              ],
            },
          ],
        },

        {
          path: '/facility-management', // 设备设施管理
          code: 'facilityManagement',
          name: 'facilityManagement',
          icon: 'laptop',
          systemType: 4,
          routes: [
            {
              name: 'threeSimultaneity', // 三同时审批记录
              code: 'facilityManagement.threeSimultaneity',
              path: '/facility-management/three-simultaneity',
              hideChildrenInMenu: true,
              routes: [
                {
                  name: 'list',
                  path: '/facility-management/three-simultaneity',
                  redirect: '/facility-management/three-simultaneity/list',
                },
                {
                  name: 'list',
                  code: 'facilityManagement.threeSimultaneity.listView',
                  path: '/facility-management/three-simultaneity/list',
                  component: './BaseInfo/ThreeSimu/TableList',
                },
                {
                  name: 'view',
                  code: 'facilityManagement.threeSimultaneity.view',
                  path: '/facility-management/three-simultaneity/detail/:id',
                  component: './BaseInfo/ThreeSimu/Edit',
                },
                {
                  name: 'add',
                  code: 'facilityManagement.threeSimultaneity.add',
                  path: '/facility-management/three-simultaneity/add',
                  component: './BaseInfo/ThreeSimu/Edit',
                },
                {
                  name: 'edit',
                  code: 'facilityManagement.threeSimultaneity.edit',
                  path: '/facility-management/three-simultaneity/edit/:id',
                  component: './BaseInfo/ThreeSimu/Edit',
                },
              ],
            },
            {
              path: '/facility-management/special-equipment', // 特种设备管理
              code: 'facilityManagement.specialEquipment',
              name: 'specialEquipment',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/facility-management/special-equipment',
                  name: 'specialEquipment',
                  redirect: '/facility-management/special-equipment/list',
                },
                {
                  path: '/facility-management/special-equipment/list',
                  code: 'facilityManagement.specialEquipment.listView',
                  name: 'list',
                  component: './BaseInfo/SpecialEquipment/List/index',
                },
                {
                  path: '/facility-management/special-equipment/add',
                  code: 'facilityManagement.specialEquipment.add',
                  name: 'add',
                  component: './BaseInfo/SpecialEquipment/Handler/index',
                },
                {
                  path: '/facility-management/special-equipment/edit/:id',
                  code: 'facilityManagement.specialEquipment.edit',
                  name: 'edit',
                  component: './BaseInfo/SpecialEquipment/Handler/index',
                },
                {
                  path: '/facility-management/special-equipment/detail/:id',
                  code: 'facilityManagement.specialEquipment.detail',
                  name: 'detail',
                  component: './BaseInfo/SpecialEquipment/Detail/index',
                },
              ],
            },
            {
              name: 'safetyFacilities', // 安全设施
              code: 'facilityManagement.safetyFacilities',
              path: '/facility-management/safety-facilities',
              hideChildrenInMenu: true,
              routes: [
                {
                  name: 'list',
                  path: '/facility-management/safety-facilities',
                  redirect: '/facility-management/safety-facilities/list',
                },
                {
                  name: 'list',
                  code: 'facilityManagement.safetyFacilities.list',
                  path: '/facility-management/safety-facilities/list',
                  component: './BaseInfo/SafetyFacilities/TableList',
                },
                {
                  name: 'view',
                  code: 'facilityManagement.safetyFacilities.view',
                  path: '/facility-management/safety-facilities/view/:id',
                  component: './BaseInfo/SafetyFacilities/Edit',
                },
                {
                  name: 'add',
                  code: 'facilityManagement.safetyFacilities.add',
                  path: '/facility-management/safety-facilities/add',
                  component: './BaseInfo/SafetyFacilities/Edit',
                },
                {
                  name: 'edit',
                  code: 'facilityManagement.safetyFacilities.edit',
                  path: '/facility-management/safety-facilities/edit/:id',
                  component: './BaseInfo/SafetyFacilities/Edit',
                },
              ],
            },
            {
              name: 'operationRecord', // 设备设施运维记录
              code: 'facilityManagement.operationRecord',
              path: '/facility-management/operation-record',
              developing: true,
              hideChildrenInMenu: true,
              routes: [],
            },
          ],
        },

        {
          path: '/target-responsibility', // 目标责任管理
          code: 'targetResponsibility',
          name: 'targetResponsibility',
          icon: 'flag',
          systemType: 4,
          // developing: true,
          routes: [
            {
              name: 'indexManagement', // 安全生产指标管理
              code: 'targetResponsibility.indexManagement',
              path: '/target-responsibility/index-management',
              hideChildrenInMenu: true,
              routes: [
                {
                  name: 'list',
                  path: '/target-responsibility/index-management',
                  redirect: '/target-responsibility/index-management/index',
                },
                {
                  name: 'list',
                  code: 'targetResponsibility.indexManagement.list',
                  path: '/target-responsibility/index-management/index',
                  component: './TargetResponsibility/IndexManagement/index',
                },
              ],
            },
            {
              name: 'targetSetting', // 目标责任制定实施
              code: 'targetResponsibility.targetSetting',
              path: '/target-responsibility/target-setting',
              hideChildrenInMenu: true,
              routes: [
                {
                  name: 'list',
                  path: '/target-responsibility/target-setting',
                  redirect: '/target-responsibility/target-setting/index',
                },
                {
                  name: 'list',
                  code: 'targetResponsibility.targetSetting.list',
                  path: '/target-responsibility/target-setting/index',
                  component: './TargetResponsibility/TargetSetting/index',
                },
                {
                  name: 'add',
                  code: 'targetResponsibility.targetSetting.add',
                  path: '/target-responsibility/target-setting/add',
                  component: './TargetResponsibility/TargetSetting/Edit',
                },
                {
                  name: 'edit',
                  code: 'targetResponsibility.targetSetting.edit',
                  path: '/target-responsibility/target-setting/edit/:id',
                  component: './TargetResponsibility/TargetSetting/Edit',
                },
                {
                  name: 'detail',
                  code: 'targetResponsibility.targetSetting.edit',
                  path: '/target-responsibility/target-setting/detail/:id',
                  component: './TargetResponsibility/TargetSetting/Edit',
                },
                {
                  name: 'checkDetail',
                  code: 'targetResponsibility.targetSetting.result',
                  path: '/target-responsibility/target-setting/check-detail/:id',
                  component: './TargetResponsibility/TargetSetting/CheckDetail',
                },
              ],
            },
            {
              name: 'targetAnalysis', // 目标责任分析报表
              code: 'targetResponsibility.targetAnalysis',
              path: '/target-responsibility/target-analysis',
              developing: true,
              hideChildrenInMenu: true,
              routes: [],
            },
          ],
        },

        {
          path: '/safety-production-regulation', // 安全生产制度法规
          code: 'safetyProductionRegulation',
          name: 'safetyProductionRegulation',
          icon: 'block',
          systemType: 4,
          routes: [
            {
              name: 'safetySystem', // 安全制度管理
              code: 'safetyProductionRegulation.safetySystem',
              path: '/safety-production-regulation/safety-system',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/safety-production-regulation/safety-system',
                  redirect: '/safety-production-regulation/safety-system/list',
                },
                {
                  name: 'list',
                  code: 'safetyProductionRegulation.safetySystem.list',
                  path: '/safety-production-regulation/safety-system/list',
                  component: './SafetyKnowledgeBase/SafetySystem/List',
                },
                {
                  name: 'detail',
                  code: 'safetyProductionRegulation.safetySystem.view',
                  path: '/safety-production-regulation/safety-system/detail/:id',
                  component: './SafetyKnowledgeBase/SafetySystem/Other',
                },
                {
                  name: 'add',
                  code: 'safetyProductionRegulation.safetySystem.add',
                  path: '/safety-production-regulation/safety-system/add',
                  component: './SafetyKnowledgeBase/SafetySystem/Other',
                },
                {
                  name: 'edit',
                  code: 'safetyProductionRegulation.safetySystem.edit',
                  path: '/safety-production-regulation/safety-system/edit/:id',
                  component: './SafetyKnowledgeBase/SafetySystem/Other',
                },
              ],
            },
            {
              path: '/safety-production-regulation/laws', // 安全生产法律法规
              code: 'safetyProductionRegulation.laws',
              name: 'laws',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/safety-production-regulation/laws',
                  name: 'laws',
                  redirect: '/safety-production-regulation/laws/list',
                },
                {
                  path: '/safety-production-regulation/laws/list',
                  code: 'safetyProductionRegulation.laws.listView',
                  name: 'listView',
                  component: './LawEnforcement/Laws/LawDatabaseList',
                },
                {
                  path: '/safety-production-regulation/laws/add',
                  code: 'safetyProductionRegulation.laws.add',
                  name: 'add',
                  component: './LawEnforcement/Laws/LawDatabaseEdit',
                },
                {
                  path: '/safety-production-regulation/laws/edit/:id',
                  code: 'safetyProductionRegulation.laws.edit',
                  name: 'edit',
                  component: './LawEnforcement/Laws/LawDatabaseEdit',
                },
                {
                  path: '/safety-production-regulation/laws/detail/:id',
                  code: 'safetyProductionRegulation.laws.view',
                  name: 'view',
                  component: './LawEnforcement/Laws/LawDatabaseDetail',
                },
              ],
            },
          ],
        },

        {
          path: '/training', // 教育培训
          name: 'training',
          icon: 'read',
          code: 'training',
          systemType: 4,
          hideInMenu: false,
          routes: [
            {
              name: 'trainingProgram', // 安全生产培训计划
              path: '/training/training-program',
              code: 'training.trainingProgram',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/training/training-program',
                  name: 'list',
                  redirect: '/training/training-program/list',
                },
                {
                  path: '/training/training-program/list',
                  code: 'training.trainingProgram.list',
                  name: 'list',
                  component: './Training/TrainingProgram/List',
                },
                {
                  path: '/training/training-program/:type/:id?',
                  code: 'training.trainingProgram.list',
                  name: 'list',
                  component: './Training/TrainingProgram/Other',
                },
              ],
            },
            {
              name: 'knowledgeSys', // 知识体系管理
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
              name: 'library', // 资源管理
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
            {
              name: 'learning', // 学习管理
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
              name: 'examinationPaper', // 试卷管理
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
              name: 'mission', // 考试任务
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
              name: 'myExam', // 我的考试
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
            {
              name: 'myFile', // 我的档案
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
            {
              name: 'generalFile', // 综合档案
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

        {
          path: '/safety-risk-control', // 安全风险管控
          code: 'safetyRiskControl',
          icon: 'control',
          name: 'safetyRiskControl',
          systemType: 4,
          routes: [
            {
              path: '/safety-risk-control/risk-grading', // 风险辨识分级(风险点管理子集)
              code: 'safetyRiskControl.riskGrading',
              name: 'riskGrading',
              developing: true,
              hideChildrenInMenu: true,
              routes: [],
            },
            {
              name: 'promise', // 风险研判与承诺公告
              code: 'safetyRiskControl.promise',
              path: '/safety-risk-control/promise',
              hideChildrenInMenu: true,
              routes: [
                {
                  name: 'list',
                  path: '/safety-risk-control/promise',
                  redirect: '/safety-risk-control/promise/list',
                },
                {
                  name: 'list',
                  code: 'safetyRiskControl.promise.list',
                  path: '/safety-risk-control/promise/list',
                  component: './AnnouncementManagement/Promise/TableList',
                },
                {
                  name: 'view',
                  code: 'safetyRiskControl.promise.view',
                  path: '/safety-risk-control/promise/view/:id',
                  component: './AnnouncementManagement/Promise/Edit',
                },
                {
                  name: 'add',
                  code: 'safetyRiskControl.promise.add',
                  path: '/safety-risk-control/promise/add',
                  component: './AnnouncementManagement/Promise/Edit',
                },
                {
                  name: 'edit',
                  code: 'safetyRiskControl.promise.edit',
                  path: '/safety-risk-control/promise/edit/:id',
                  component: './AnnouncementManagement/Promise/Edit',
                },
              ],
            },
          ],
        },

        {
          path: '/hidden-danger-control', // 隐患排查治理
          code: 'hiddenDangerControl',
          name: 'hiddenDangerControl',
          icon: 'thunderbolt',
          systemType: 4,
          routes: [
            {
              name: 'dangerStandardDatabase', // 隐患标准管理数据库
              code: 'hiddenDangerControl.dangerStandardDatabase',
              path: '/hidden-danger-control/danger-standard-database',
              developing: true,
              hideChildrenInMenu: true,
              routes: [],
            },
            {
              path: '/hidden-danger-control/hidden-danger-plan', // 隐患排查计划(风险点管理子集)
              code: 'hiddenDangerControl.hiddenDangerPlan',
              name: 'hiddenDangerPlan',
              developing: true,
              hideChildrenInMenu: true,
              routes: [],
            },
            {
              path: '/hidden-danger-control/hidden-danger-report', // 隐患排查报表
              code: 'hiddenDangerControl.hiddenDangerReport',
              name: 'hiddenDangerReport',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/hidden-danger-control/hidden-danger-report',
                  name: 'hiddenDangerReport',
                  redirect: '/hidden-danger-control/hidden-danger-report/list',
                },
                {
                  path: '/hidden-danger-control/hidden-danger-report/list',
                  code: 'hiddenDangerControl.hiddenDangerReport.view',
                  name: 'list',
                  component: './DataAnalysis/HiddenDangerReport/HiddenDangerReportList',
                },
                {
                  path: '/hidden-danger-control/hidden-danger-report/detail/:id',
                  code: 'hiddenDangerControl.hiddenDangerReport.view',
                  name: 'detail',
                  component: './DataAnalysis/HiddenDangerReport/HiddenDangerReportDetail',
                },
              ],
            },
          ],
        },

        {
          path: '/operation-safety', // 作业安全管理
          code: 'operationSafety',
          name: 'operationSafety',
          icon: 'team',
          systemType: 4,
          routes: [
            {
              name: 'postInfo', // 岗位信息
              code: 'operationSafety.postInfo',
              path: '/operation-safety/post-info',
              developing: true,
              hideChildrenInMenu: true,
              routes: [],
            },
            {
              name: 'specialOperationPermit', // 特种作业操作证人员
              code: 'operationSafety.specialOperationPermit',
              path: '/operation-safety/special-operation-permit',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/operation-safety/special-operation-permit',
                  name: 'specialOperationPermit',
                  redirect: '/operation-safety/special-operation-permit/list',
                },
                {
                  path: '/operation-safety/special-operation-permit/list',
                  name: 'list',
                  code: 'operationSafety.specialOperationPermit.listView',
                  component: './BaseInfo/SpecialOperationPermit/List',
                },
                {
                  path: '/operation-safety/special-operation-permit/add',
                  name: 'add',
                  code: 'operationSafety.specialOperationPermit.add',
                  component: './BaseInfo/SpecialOperationPermit/Handle',
                },
                {
                  path: '/operation-safety/special-operation-permit/edit/:id',
                  name: 'edit',
                  code: 'operationSafety.specialOperationPermit.edit',
                  component: './BaseInfo/SpecialOperationPermit/Handle',
                },
              ],
            },
            {
              name: 'specialEquipmentOperators', // 特种设备作业人员
              code: 'operationSafety.specialEquipmentOperators',
              path: '/operation-safety/special-equipment-operators',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/operation-safety/special-equipment-operators',
                  name: 'specialEquipmentOperators',
                  redirect: '/operation-safety/special-equipment-operators/list',
                },
                {
                  path: '/operation-safety/special-equipment-operators/list',
                  name: 'list',
                  code: 'operationSafety.specialEquipmentOperators.listView',
                  component: './BaseInfo/SpecialEquipmentOperators/List',
                },
                {
                  path: '/operation-safety/special-equipment-operators/add',
                  name: 'add',
                  code: 'operationSafety.specialEquipmentOperators.add',
                  component: './BaseInfo/SpecialEquipmentOperators/Handle',
                },
                {
                  path: '/operation-safety/special-equipment-operators/edit/:id',
                  name: 'edit',
                  code: 'operationSafety.specialEquipmentOperators.edit',
                  component: './BaseInfo/SpecialEquipmentOperators/Handle',
                },
              ],
            },
            {
              path: '/operation-safety/work-approval-report', // 作业许可管理(危险作业管理)
              code: 'operationSafety.workApprovalReport',
              name: 'workApprovalReport',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/operation-safety/work-approval-report',
                  name: 'workApprovalReport',
                  redirect: '/operation-safety/work-approval-report/list',
                },
                {
                  path: '/operation-safety/work-approval-report/list',
                  code: 'operationSafety.workApprovalReport.listView',
                  name: 'list',
                  component: './DataAnalysis/WorkApprovalReport/CompanyList',
                },
                {
                  path: '/operation-safety/work-approval-report/company/:companyId/:type',
                  name: 'workApprovalList',
                  code: 'operationSafety.workApprovalReport.workApprovalList',
                  component: './DataAnalysis/WorkApprovalReport/WorkApprovalList',
                },
                {
                  path:
                    '/operation-safety/work-approval-report/company/:companyId/:type/detail/:id',
                  name: 'detail',
                  code: 'operationSafety.workApprovalReport.detail',
                  component: './DataAnalysis/WorkApprovalReport/WorkApprovalDetail',
                },
              ],
            },
          ],
        },

        {
          path: '/major-hazard-monitor', // 重大危险源监控管理
          code: 'majorHazardMonitor',
          icon: 'fire',
          name: 'majorHazardMonitor',
          developing: true,
          systemType: 4,
          routes: [
            {
              name: 'alarm', // 报警管理功能
              code: 'majorHazardMonitor.alarm',
              path: '/major-hazard-monitor/alarm',
              developing: true,
              hideChildrenInMenu: true,
              routes: [],
            },
            {
              name: 'interlock', // 联锁管理功能
              code: 'majorHazardMonitor.interlock',
              path: '/major-hazard-monitor/interlock',
              developing: true,
              hideChildrenInMenu: true,
              routes: [],
            },
          ],
        },

        {
          path: '/emergency-management', // 应急管理
          code: 'emergencyManagement',
          icon: 'snippets',
          name: 'emergencyManagement',
          systemType: 4,
          routes: [
            {
              path: '/emergency-management',
              redirect: '/emergency-management/emergency-plan/list',
            },
            {
              path: '/emergency-management/emergency-plan', // 应急预案
              code: 'emergencyManagement.emergencyPlan',
              name: 'emergencyPlan',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/emergency-management/emergency-plan',
                  redirect: '/emergency-management/emergency-plan/list',
                },
                {
                  path: '/emergency-management/emergency-plan/list',
                  name: 'list',
                  code: 'emergencyManagement.emergencyPlan.list',
                  component: './EmergencyManagement/EmergencyPlan/EmergencyPlanList',
                },
                {
                  path: '/emergency-management/emergency-plan/add',
                  name: 'add',
                  code: 'emergencyManagement.emergencyPlan.add',
                  component: './EmergencyManagement/EmergencyPlan/EmergencyPlanHandler',
                },
                {
                  path: '/emergency-management/emergency-plan/edit/:id',
                  name: 'edit',
                  code: 'emergencyManagement.emergencyPlan.edit',
                  component: './EmergencyManagement/EmergencyPlan/EmergencyPlanHandler',
                },
                {
                  path: '/emergency-management/emergency-plan/detail/:id',
                  name: 'detail',
                  code: 'emergencyManagement.emergencyPlan.detail',
                  component: './EmergencyManagement/EmergencyPlan/EmergencyPlanDetail',
                },
              ],
            },
            {
              path: '/emergency-management/emergency-equipment', // 应急装备
              code: 'emergencyManagement.emergencyEquipment',
              name: 'emergencyEquipment',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/emergency-management/emergency-equipment',
                  name: 'emergencyEquipment',
                  redirect: '/emergency-management/emergency-equipment/list',
                },
                {
                  path: '/emergency-management/emergency-equipment/list',
                  code: 'emergencyManagement.emergencyEquipment.listView',
                  name: 'list',
                  component: './EmergencyManagement/EmergencyEquipment/List/index',
                },
                {
                  path: '/emergency-management/emergency-equipment/add',
                  code: 'emergencyManagement.emergencyEquipment.add',
                  name: 'add',
                  component: './EmergencyManagement/EmergencyEquipment/Handler/index',
                },
                {
                  path: '/emergency-management/emergency-equipment/edit/:id',
                  code: 'emergencyManagement.emergencyEquipment.edit',
                  name: 'edit',
                  component: './EmergencyManagement/EmergencyEquipment/Handler/index',
                },
                {
                  path: '/emergency-management/emergency-equipment/detail/:id',
                  code: 'emergencyManagement.emergencyEquipment.detail',
                  name: 'detail',
                  component: './EmergencyManagement/EmergencyEquipment/Detail/index',
                },
              ],
            },
            {
              path: '/emergency-management/emergency-supplies', // 应急物资
              code: 'emergencyManagement.emergencySupplies',
              name: 'emergencySupplies',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/emergency-management/emergency-supplies',
                  name: 'emergencySupplies',
                  redirect: '/emergency-management/emergency-supplies/list',
                },
                {
                  path: '/emergency-management/emergency-supplies/list',
                  code: 'emergencyManagement.emergencySupplies.listView',
                  name: 'list',
                  component: './EmergencyManagement/EmergencySupplies/List/index',
                },
                {
                  path: '/emergency-management/emergency-supplies/add',
                  code: 'emergencyManagement.emergencySupplies.add',
                  name: 'add',
                  component: './EmergencyManagement/EmergencySupplies/Handler/index',
                },
                {
                  path: '/emergency-management/emergency-supplies/edit/:id',
                  code: 'emergencyManagement.emergencySupplies.edit',
                  name: 'edit',
                  component: './EmergencyManagement/EmergencySupplies/Handler/index',
                },
                {
                  path: '/emergency-management/emergency-supplies/detail/:id',
                  code: 'emergencyManagement.emergencySupplies.detail',
                  name: 'detail',
                  component: './EmergencyManagement/EmergencySupplies/Detail/index',
                },
              ],
            },
            {
              path: '/emergency-management/emergency-drill', // 应急演练计划
              code: 'emergencyManagement.emergencyDrill',
              name: 'emergencyDrill',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/emergency-management/emergency-drill',
                  name: 'emergencyDrill',
                  redirect: '/emergency-management/emergency-drill/list',
                },
                {
                  path: '/emergency-management/emergency-drill/list',
                  code: 'emergencyManagement.emergencyDrill.listView',
                  name: 'list',
                  component: './EmergencyManagement/EmergencyDrill/List/index',
                },
                {
                  path: '/emergency-management/emergency-drill/add',
                  code: 'emergencyManagement.emergencyDrill.add',
                  name: 'add',
                  component: './EmergencyManagement/EmergencyDrill/Handler/index',
                },
                {
                  path: '/emergency-management/emergency-drill/edit/:id',
                  code: 'emergencyManagement.emergencyDrill.edit',
                  name: 'edit',
                  component: './EmergencyManagement/EmergencyDrill/Handler/index',
                },
                {
                  path: '/emergency-management/emergency-drill/detail/:id',
                  code: 'emergencyManagement.emergencyDrill.detail',
                  name: 'detail',
                  component: './EmergencyManagement/EmergencyDrill/Detail/index',
                },
              ],
            },
            {
              name: 'emergencyProcess', // 应急演练过程
              code: 'emergencyManagement.emergencyProcess',
              path: '/emergency-management/emergency-process',
              hideChildrenInMenu: true,
              routes: [
                {
                  name: 'list',
                  path: '/emergency-management/emergency-process',
                  redirect: '/emergency-management/emergency-process/list',
                },
                {
                  name: 'list',
                  code: 'emergencyManagement.emergencyProcess.list',
                  path: '/emergency-management/emergency-process/list',
                  component: './EmergencyManagement/EmergencyProcess/TableList',
                },
                {
                  name: 'view',
                  code: 'emergencyManagement.emergencyProcess.view',
                  path: '/emergency-management/emergency-process/view/:id',
                  component: './EmergencyManagement/EmergencyProcess/Edit',
                },
                {
                  name: 'add',
                  code: 'emergencyManagement.emergencyProcess.add',
                  path: '/emergency-management/emergency-process/add',
                  component: './EmergencyManagement/EmergencyProcess/Edit',
                },
                {
                  name: 'edit',
                  code: 'emergencyManagement.emergencyProcess.edit',
                  path: '/emergency-management/emergency-process/edit/:id',
                  component: './EmergencyManagement/EmergencyProcess/Edit',
                },
              ],
            },
            {
              path: '/emergency-management/emergency-estimate', // 应急演练评估
              code: 'emergencyManagement.emergencyEstimate',
              name: 'emergencyEstimate',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/emergency-management/emergency-estimate',
                  name: 'emergencyEstimate',
                  redirect: '/emergency-management/emergency-estimate/list',
                },
                {
                  path: '/emergency-management/emergency-estimate/list',
                  code: 'emergencyManagement.emergencyEstimate.listView',
                  name: 'list',
                  component: './EmergencyManagement/EmergencyEstimate/List/index',
                },
                {
                  path: '/emergency-management/emergency-estimate/add',
                  code: 'emergencyManagement.emergencyEstimate.add',
                  name: 'add',
                  component: './EmergencyManagement/EmergencyEstimate/Handler/index',
                },
                {
                  path: '/emergency-management/emergency-estimate/edit/:id',
                  code: 'emergencyManagement.emergencyEstimate.edit',
                  name: 'edit',
                  component: './EmergencyManagement/EmergencyEstimate/Handler/index',
                },
                {
                  path: '/emergency-management/emergency-estimate/detail/:id',
                  code: 'emergencyManagement.emergencyEstimate.detail',
                  name: 'detail',
                  component: './EmergencyManagement/EmergencyEstimate/Detail/index',
                },
              ],
            },
          ],
        },

        {
          path: '/accident-management', // 事故管理
          code: 'accidentManagement',
          icon: 'bg-colors',
          name: 'accidentManagement',
          systemType: 4,
          routes: [
            {
              name: 'quickReport', // 事故快报
              code: 'accidentManagement.quickReport',
              path: '/accident-management/quick-report',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/accident-management/quick-report',
                  redirect: '/accident-management/quick-report/list',
                },
                {
                  name: 'list',
                  code: 'accidentManagement.quickReport.list',
                  path: '/accident-management/quick-report/list',
                  component: './AccidentManagement/QuickReport/List',
                },
                {
                  name: 'detail',
                  code: 'accidentManagement.quickReport.view',
                  path: '/accident-management/quick-report/detail/:id',
                  component: './AccidentManagement/QuickReport/Other',
                },
                {
                  name: 'add',
                  code: 'accidentManagement.quickReport.add',
                  path: '/accident-management/quick-report/add',
                  component: './AccidentManagement/QuickReport/Other',
                },
                {
                  name: 'edit',
                  code: 'accidentManagement.quickReport.edit',
                  path: '/accident-management/quick-report/edit/:id',
                  component: './AccidentManagement/QuickReport/Other',
                },
              ],
            },
            {
              name: 'accidentReport', // 事故报告
              code: 'accidentManagement.accidentReport',
              path: '/accident-management/accident-report',
              hideChildrenInMenu: true,
              routes: [
                {
                  name: 'list',
                  path: '/accident-management/accident-report',
                  redirect: '/accident-management/accident-report/list',
                },
                {
                  name: 'list',
                  code: 'accidentManagement.accidentReport.list',
                  path: '/accident-management/accident-report/list',
                  component: './AccidentManagement/AccidentReport/List',
                },
                {
                  name: 'detail',
                  code: 'accidentManagement.accidentReport.view',
                  path: '/accident-management/accident-report/detail/:id',
                  component: './AccidentManagement/AccidentReport/Other',
                },
                {
                  name: 'add',
                  code: 'accidentManagement.accidentReport.add',
                  path: '/accident-management/accident-report/add',
                  component: './AccidentManagement/AccidentReport/Other',
                },
                {
                  name: 'edit',
                  code: 'accidentManagement.accidentReport.edit',
                  path: '/accident-management/accident-report/edit/:id',
                  component: './AccidentManagement/AccidentReport/Other',
                },
              ],
            },
          ],
        },
        {
          path: '/change-management', // 变更管理
          code: 'changeManagement',
          icon: 'tag',
          name: 'changeManagement',
          systemType: 4,
          developing: true,
          routes: [
            {
              name: 'changeLog', // 变更日志
              code: 'changeManagement.changeLog',
              path: '/change-management/change-log',
              developing: true,
              hideChildrenInMenu: true,
              routes: [],
            },
          ],
        },
      ],
    },
  ];
};
