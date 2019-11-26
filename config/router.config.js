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
          component: './BigPlatform/Chemical',
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
      code: 'dashboard.menuReveal',
      component: './BigPlatform/MenuReveal/NewMenu',
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
          redirect:
            env === 'nanxiao' ? '/fire-control/maintenance-company' : '/menu-reveal',
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
          systemType: 0,
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

        // 企业生产全流程管理系统
        {
          path: '/base-info', // 基础数据管理
          code: 'baseInfo',
          name: 'baseInfo',
          icon: 'file-text',
          systemType: 0,
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
          ],
        },

        {
          path: '/unit-license', // 单位证照管理
          code: 'unitLicense',
          name: 'unitLicense',
          icon: 'file-text',
          systemType: 0,
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
          path: '/personnel-license', // 人员证照管理
          code: 'personnelLicense',
          name: 'personnelLicense',
          icon: 'file-text',
          systemType: 0,
          routes: [
            {
              name: 'registeredEngineerManagement', // 注册安全工程师管理
              code: 'personnelLicense.registeredEngineerManagement',
              path: '/personnel-license/registered-engineer-management',
              hideChildrenInMenu: true,
              routes: [
                {
                  name: 'list',
                  path: '/personnel-license/registered-engineer-management',
                  redirect: '/personnel-license/registered-engineer-management/list',
                },
                {
                  name: 'list',
                  code: 'personnelLicense.registeredEngineerManagement.listView',
                  path: '/personnel-license/registered-engineer-management/list',
                  component: './BaseInfo/RegisteredEngineerManagement/index',
                },
                {
                  name: 'add',
                  code: 'personnelLicense.registeredEngineerManagement.add',
                  path: '/personnel-license/registered-engineer-management/add',
                  component: './BaseInfo/RegisteredEngineerManagement/Handle',
                },
                {
                  name: 'edit',
                  code: 'personnelLicense.registeredEngineerManagement.edit',
                  path: '/personnel-license/registered-engineer-management/edit/:id',
                  component: './BaseInfo/RegisteredEngineerManagement/Handle',
                },
              ],
            },
            {
              name: 'specialoPerationPermit', // 特种作业操作证人员
              code: 'personnelLicense.specialoPerationPermit',
              path: '/personnel-license/specialo-peration-permit',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/personnel-license/specialo-peration-permit',
                  name: 'specialoPerationPermit',
                  redirect: '/personnel-license/specialo-peration-permit/list',
                },
                {
                  path: '/personnel-license/specialo-peration-permit/list',
                  name: 'list',
                  code: 'personnelLicense.specialoPerationPermit.listView',
                  component: './BaseInfo/SpecialoPerationPermit/List',
                },
                {
                  path: '/personnel-license/specialo-peration-permit/add',
                  name: 'add',
                  code: 'personnelLicense.specialoPerationPermit.add',
                  component: './BaseInfo/SpecialoPerationPermit/Handle',
                },
                {
                  path: '/personnel-license/specialo-peration-permit/edit/:id',
                  name: 'edit',
                  code: 'personnelLicense.specialoPerationPermit.edit',
                  component: './BaseInfo/SpecialoPerationPermit/Handle',
                },
              ],
            },
            {
              name: 'specialEquipmentOperators', // 特种设备作业人员
              code: 'personnelLicense.specialEquipmentOperators',
              path: '/personnel-license/special-equipment-operators',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/personnel-license/special-equipment-operators',
                  name: 'specialEquipmentOperators',
                  redirect: '/personnel-license/special-equipment-operators/list',
                },
                {
                  path: '/personnel-license/special-equipment-operators/list',
                  name: 'list',
                  code: 'personnelLicense.specialEquipmentOperators.listView',
                  component: './BaseInfo/SpecialEquipmentOperators/List',
                },
                {
                  path: '/personnel-license/special-equipment-operators/add',
                  name: 'add',
                  code: 'personnelLicense.specialEquipmentOperators.add',
                  component: './BaseInfo/SpecialEquipmentOperators/Handle',
                },
                {
                  path: '/personnel-license/special-equipment-operators/edit/:id',
                  name: 'edit',
                  code: 'personnelLicense.specialEquipmentOperators.edit',
                  component: './BaseInfo/SpecialEquipmentOperators/Handle',
                },
              ],
            },
          ],
        },

        {
          path: '/facility-management', // 设备设施管理
          code: 'facilityManagement',
          name: 'facilityManagement',
          icon: 'file-text',
          systemType: 0,
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
          ],
        },

        {
          path: '/target-responsibility', // 目标责任管理
          code: 'targetResponsibility',
          name: 'targetResponsibility',
          icon: 'file-text',
          systemType: 0,
          developing: true,
          routes: [
            {
              name: 'targetSetting', // 目标责任制定
              code: 'targetResponsibility.targetSetting',
              path: '/target-responsibility/target-setting',
              hideChildrenInMenu: true,
              routes: [
                {
                  name: 'list',
                  path: '/target-responsibility/target-setting',
                  redirect: '/target-responsibility/target-setting/list',
                },
                {
                  name: 'list',
                  code: 'targetResponsibility.targetSetting.list',
                  path: '/target-responsibility/target-setting/list',
                  // component: './TargetResponsibility/TargetSetting/TableList',
                },
              ],
            },
            {
              name: 'targetAnalysis', // 目标责任分析报表
              code: 'targetResponsibility.targetAnalysis',
              path: '/target-responsibility/target-analysis',
              hideChildrenInMenu: true,
              routes: [
                {
                  name: 'list',
                  path: '/target-responsibility/target-analysis',
                  redirect: '/target-responsibility/target-analysis/list',
                },
                {
                  name: 'list',
                  code: 'targetResponsibility.targetAnalysis.listView',
                  path: '/target-responsibility/target-analysis/list',
                  // component: './TargetResponsibility/TargetAnalysis/TableList',
                },
              ],
            },
          ],
        },

        {
          path: '/safety-production-regulation', // 安全生产制度法规
          code: 'safetyProductionRegulation',
          name: 'safetyProductionRegulation',
          icon: 'file-text',
          systemType: 0,
          routes: [
            {
              name: 'safetySystem', // 安全制度管理
              code: 'safetyProductionRegulation.safetySystem',
              path: '/safety-production-regulation/safety-system',
              hideChildrenInMenu: true,
              routes: [
                {
                  name: 'list',
                  path: '/safety-production-regulation/safety-system',
                  redirect: '/safety-production-regulation/safety-system/list',
                },
                {
                  name: 'list',
                  code: 'safetyProductionRegulation.safetySystem.list',
                  path: '/safety-production-regulation/safety-system/list',
                  component: './SafetyKnowledgeBase/SafetySystem/TableList',
                },
                {
                  name: 'view',
                  code: 'safetyProductionRegulation.safetySystem.view',
                  path: '/safety-production-regulation/safety-system/view/:id',
                  component: './SafetyKnowledgeBase/SafetySystem/Edit',
                },
                {
                  name: 'add',
                  code: 'safetyProductionRegulation.safetySystem.add',
                  path: '/safety-production-regulation/safety-system/add',
                  component: './SafetyKnowledgeBase/SafetySystem/Edit',
                },
                {
                  name: 'edit',
                  code: 'safetyProductionRegulation.safetySystem.edit',
                  path: '/safety-production-regulation/safety-system/edit/:id',
                  component: './SafetyKnowledgeBase/SafetySystem/Edit',
                },
              ],
            },
            {
              path: '/safety-production-regulation/laws', // 法律法规
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
          name: 'training', // 教育培训
          icon: 'read',
          code: 'training',
          path: '/training',
          systemType: 0,
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
            {
              name: 'trainingProgram', // 培训计划
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
          ],
        },

        {
          path: '/hidden-danger-control', // 隐患排查治理
          code: 'hiddenDangerControl',
          name: 'hiddenDangerControl',
          icon: 'file-text',
          systemType: 0,
          routes: [
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
          path: '/emergency-management', // 应急管理
          code: 'emergencyManagement',
          icon: 'alert',
          name: 'emergencyManagement',
          systemType: 2,
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
          ],
        },

        {
          path: '/accident-management', // 事故管理
          code: 'accidentManagement',
          icon: 'fire',
          name: 'accidentManagement',
          systemType: 2,
          routes: [
            {
              name: 'quickReport', // 事故快报
              code: 'accidentManagement.quickReport',
              path: '/accident-management/quick-report',
              hideChildrenInMenu: true,
              routes: [
                {
                  name: 'list',
                  path: '/accident-management/quick-report',
                  redirect: '/accident-management/quick-report/list',
                },
                {
                  name: 'list',
                  code: 'accidentManagement.quickReport.list',
                  path: '/accident-management/quick-report/list',
                  component: './AccidentManagement/QuickReport/TableList',
                },
                {
                  name: 'view',
                  code: 'accidentManagement.quickReport.view',
                  path: '/accident-management/quick-report/view/:id',
                  component: './AccidentManagement/QuickReport/Edit',
                },
                {
                  name: 'add',
                  code: 'accidentManagement.quickReport.add',
                  path: '/accident-management/quick-report/add',
                  component: './AccidentManagement/QuickReport/Edit',
                },
                {
                  name: 'edit',
                  code: 'accidentManagement.quickReport.edit',
                  path: '/accident-management/quick-report/edit/:id',
                  component: './AccidentManagement/QuickReport/Edit',
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
                  component: './AccidentManagement/AccidentReport/TableList',
                },
                {
                  name: 'view',
                  code: 'accidentManagement.accidentReport.view',
                  path: '/accident-management/accident-report/view/:id',
                  component: './AccidentManagement/AccidentReport/Edit',
                },
                {
                  name: 'add',
                  code: 'accidentManagement.accidentReport.add',
                  path: '/accident-management/accident-report/add',
                  component: './AccidentManagement/AccidentReport/Edit',
                },
                {
                  name: 'edit',
                  code: 'accidentManagement.accidentReport.edit',
                  path: '/accident-management/accident-report/edit/:id',
                  component: './AccidentManagement/AccidentReport/Edit',
                },
              ],
            },
          ],
        },

        // 企业安全风险分区管理系统
        {
          path: '/risk-control', // 风险分级管控
          code: 'riskControl',
          icon: 'audit',
          name: 'riskControl',
          systemType: 1,
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
          ],
        },

        {
          path: '/control-measures-follow-up', // 管控措施跟进信息管理
          code: 'controlMeasuresFollowUp',
          name: 'controlMeasuresFollowUp',
          icon: 'file-text',
          systemType: 1,
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
          icon: 'unordered-list',
          name: 'twoInformationManagement',
          systemType: 1,
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
          icon: 'profile',
          name: 'cardsInfo',
          systemType: 1,
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

        // 重大危险源监测预警系统
        {
          path: '/base-info-management', // 基础信息管理
          code: 'baseInfoManagement',
          name: 'baseInfoManagement',
          icon: 'file-text',
          systemType: 2,
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
          path: '/major-hazard-info', // 重大危险源基本信息
          code: 'majorHazardInfo',
          name: 'majorHazardInfo',
          icon: 'file-text',
          systemType: 2,
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
            // 高危工艺流程
            {
              path: '/major-hazard-info/high-risk-process',
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
          systemType: 2,
          routes: [
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
              path: '/device-management/brand', // 品牌管理
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
          ],
        },

        {
          path: '/iot', // 物联网监测
          code: 'iot',
          name: 'iot',
          icon: 'wifi',
          systemType: 2,
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
                      routes: [
                        {
                          path: '/iot/major-hazard/tank-area/real-time',
                          redirect: '/iot/major-hazard/tank-area/real-time/index',
                        },
                        {
                          path: '/iot/major-hazard/tank-area/real-time/index',
                          code: 'iot.majorHazard.tankArea.realTime.index',
                          name: 'index',
                          component: './IoT/MajorHazard/TankArea/RealTime',
                        },
                      ],
                    },
                    {
                      path: '/iot/major-hazard/tank-area/history',
                      code: 'iot.majorHazard.tankArea.history',
                      name: 'history',
                      component: './IoT/MajorHazard/TankArea/History',
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
          ],
        },

        {
          path: '/safety-knowledge-base', // 安全生产知识库
          code: 'safetyKnowledgeBase',
          icon: 'book',
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

      ],
    },
  ];
};
