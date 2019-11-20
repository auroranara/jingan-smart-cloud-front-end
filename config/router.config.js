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
    // {
    //   path: '/demo',
    //   component: './Demo',
    // },
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
            env === 'nanxiao' ? '/fire-control/maintenance-company' : '/company-workbench/view',
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
        // {
        //   path: '/company-workbench',
        //   code: 'companyWorkbench',
        //   name: 'companyWorkbench',
        //   icon: 'bar-chart',
        //   hideInMenu: true,
        //   routes: [
        //     {
        //       path: '/company-workbench/workbench',
        //       code: 'companyWorkbench.workbench',
        //       name: 'workbench',
        //       hideChildrenInMenu: true,
        //       routes: [
        //         {
        //           path: '/company-workbench/workbench',
        //           name: 'list',
        //           redirect: '/company-workbench/workbench/list',
        //         },
        //         {
        //           path: '/company-workbench/workbench/list',
        //           code: 'companyWorkbench.workbench.listView',
        //           name: 'list',
        //           component: './CompanyWorkbench/Workbench/WorkbenchList',
        //         },
        //       ],
        //     },
        {
          path: '/company-workbench',
          code: 'companyWorkbench',
          name: 'companyWorkbench',
          icon: 'bar-chart',
          systemType: [0],
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
        // base info
        {
          path: '/base-info',
          code: 'baseInfo',
          name: 'baseInfo',
          icon: 'file-text',
          systemType: [0],
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
                // 单位分部
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
            /* 建筑物信息 */
            {
              name: 'buildingsInfo',
              path: '/base-info/buildings-info',
              code: 'baseInfo.buildingsInfo',
              hideChildrenInMenu: true,
              routes: [
                {
                  name: 'list',
                  path: '/base-info/buildings-info',
                  redirect: '/base-info/buildings-info/list',
                },
                {
                  name: 'list',
                  code: 'baseInfo.buildingsInfo.listView',
                  path: '/base-info/buildings-info/list',
                  component: './BaseInfo/BuildingsInfo/CompanyList',
                },
                {
                  name: 'view',
                  code: 'baseInfo.buildingsInfo.view',
                  path: '/base-info/buildings-info/detail/:id',
                  component: './BaseInfo/BuildingsInfo/CompanyBuildingInfo/BuildingInfoList',
                },
                {
                  name: 'add',
                  code: 'baseInfo.buildingsInfo.add',
                  path: '/base-info/buildings-info/add',
                  component: './BaseInfo/BuildingsInfo/CompanyBuildingInfo/BuildingInfoEdit',
                },
                {
                  name: 'edit',
                  code: 'baseInfo.buildingsInfo.edit',
                  path: '/base-info/buildings-info/edit/:id',
                  component: './BaseInfo/BuildingsInfo/CompanyBuildingInfo/BuildingInfoEdit',
                },
                {
                  name: 'floorList',
                  code: 'baseInfo.buildingsInfo.floorListView',
                  path: '/base-info/buildings-info/floor/list/:id',
                  component: './BaseInfo/BuildingsInfo/FloorManagement/FloorManagementList',
                },
                {
                  name: 'floorAdd',
                  code: 'baseInfo.buildingsInfo.floorAdd',
                  path: '/base-info/buildings-info/floor/add',
                  component: './BaseInfo/BuildingsInfo/FloorManagement/FloorManagementEdit',
                },
                {
                  name: 'floorEdit',
                  code: 'baseInfo.buildingsInfo.floorEdit',
                  path: '/base-info/buildings-info/floor/edit/:id',
                  component: './BaseInfo/BuildingsInfo/FloorManagement/FloorManagementEdit',
                },
                {
                  name: 'floorDetail',
                  code: 'baseInfo.buildingsInfo.floorView',
                  path: '/base-info/buildings-info/floor/detail/:id',
                  component: './BaseInfo/BuildingsInfo/FloorManagement/FloorManagementDetail',
                },
              ],
            },
            // 家庭档案
            // {
            //   name: 'familyFile',
            //   code: 'baseInfo.personnelManagement',
            //   path: '/base-info/family-file',
            //   hideChildrenInMenu: true,
            //   // hideInMenu: env !== 'fire',
            //   routes: [
            //     {
            //       name: 'list',
            //       path: '/base-info/family-file',
            //       redirect: '/base-info/family-file/list',
            //     },
            //     {
            //       name: 'list',
            //       code: 'baseInfo.personnelManagement.listView',
            //       path: '/base-info/family-file/list',
            //       component: './BaseInfo/PersonnelManagement',
            //     },
            //     {
            //       name: 'add',
            //       code: 'baseInfo.personnelManagement.add',
            //       path: '/base-info/family-file/add',
            //       component: './BaseInfo/PersonnelManagement/PersonnelEdit',
            //     },
            //     {
            //       name: 'edit',
            //       code: 'baseInfo.personnelManagement.edit',
            //       path: '/base-info/family-file/edit/:id',
            //       component: './BaseInfo/PersonnelManagement/PersonnelEdit',
            //     },
            //     {
            //       name: 'detail',
            //       code: 'baseInfo.personnelManagement.view',
            //       path: '/base-info/family-file/detail/:id',
            //       component: './BaseInfo/PersonnelManagement/PersonnelDetail',
            //     },
            //   ],
            // },
            // 库房管理
            {
              path: '/base-info/storehouse',
              code: 'baseInfo.storehouse',
              name: 'storehouse',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/base-info/storehouse',
                  name: 'storehouse',
                  redirect: '/base-info/storehouse/list',
                },
                {
                  path: '/base-info/storehouse/list',
                  code: 'baseInfo.storehouse.listView',
                  name: 'list',
                  component: './BaseInfo/Storehouse/List/index',
                },
                {
                  path: '/base-info/storehouse/add',
                  code: 'baseInfo.storehouse.add',
                  name: 'add',
                  component: './BaseInfo/Storehouse/Handler/index',
                },
                {
                  path: '/base-info/storehouse/edit/:id',
                  code: 'baseInfo.storehouse.edit',
                  name: 'edit',
                  component: './BaseInfo/Storehouse/Handler/index',
                },
                {
                  path: '/base-info/storehouse/detail/:id',
                  code: 'baseInfo.storehouse.detail',
                  name: 'detail',
                  component: './BaseInfo/Storehouse/Detail/index',
                },
              ],
            },
            // 物料信息
            {
              path: '/base-info/materials',
              code: 'baseInfo.materials',
              name: 'materials',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/base-info/materials',
                  name: 'materials',
                  redirect: '/base-info/materials/list',
                },
                {
                  path: '/base-info/materials/list',
                  code: 'baseInfo.materials.listView',
                  name: 'list',
                  component: './BaseInfo/Materials/List/index',
                },
                {
                  path: '/base-info/materials/add',
                  code: 'baseInfo.materials.add',
                  name: 'add',
                  component: './BaseInfo/Materials/Handler/index',
                },
                {
                  path: '/base-info/materials/edit/:id',
                  code: 'baseInfo.materials.edit',
                  name: 'edit',
                  component: './BaseInfo/Materials/Handler/index',
                },
                {
                  path: '/base-info/materials/detail/:id',
                  code: 'baseInfo.materials.detail',
                  name: 'detail',
                  component: './BaseInfo/Materials/Detail/index',
                },
              ],
            },
            // 高危工艺流程
            {
              path: '/base-info/high-risk-process',
              code: 'baseInfo.highRiskProcess',
              name: 'highRiskProcess',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/base-info/high-risk-process',
                  name: 'highRiskProcess',
                  redirect: '/base-info/high-risk-process/list',
                },
                {
                  path: '/base-info/high-risk-process/list',
                  code: 'baseInfo.highRiskProcess.listView',
                  name: 'list',
                  component: './BaseInfo/HighRiskProcess/List/index',
                },
                {
                  path: '/base-info/high-risk-process/add',
                  code: 'baseInfo.highRiskProcess.add',
                  name: 'add',
                  component: './BaseInfo/HighRiskProcess/Handler/index',
                },
                {
                  path: '/base-info/high-risk-process/edit/:id',
                  code: 'baseInfo.highRiskProcess.edit',
                  name: 'edit',
                  component: './BaseInfo/HighRiskProcess/Handler/index',
                },
                {
                  path: '/base-info/high-risk-process/detail/:id',
                  code: 'baseInfo.highRiskProcess.detail',
                  name: 'detail',
                  component: './BaseInfo/HighRiskProcess/Detail/index',
                },
              ],
            },
            // 特种设备管理
            {
              path: '/base-info/special-equipment',
              code: 'baseInfo.specialEquipment',
              name: 'specialEquipment',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/base-info/special-equipment',
                  name: 'specialEquipment',
                  redirect: '/base-info/special-equipment/list',
                },
                {
                  path: '/base-info/special-equipment/list',
                  code: 'baseInfo.specialEquipment.listView',
                  name: 'list',
                  component: './BaseInfo/SpecialEquipment/List/index',
                },
                {
                  path: '/base-info/special-equipment/add',
                  code: 'baseInfo.specialEquipment.add',
                  name: 'add',
                  component: './BaseInfo/SpecialEquipment/Handler/index',
                },
                {
                  path: '/base-info/special-equipment/edit/:id',
                  code: 'baseInfo.specialEquipment.edit',
                  name: 'edit',
                  component: './BaseInfo/SpecialEquipment/Handler/index',
                },
                {
                  path: '/base-info/special-equipment/detail/:id',
                  code: 'baseInfo.specialEquipment.detail',
                  name: 'detail',
                  component: './BaseInfo/SpecialEquipment/Detail/index',
                },
              ],
            },
            // 特种作业操作证人员
            {
              name: 'specialoPerationPermit',
              code: 'baseInfo.specialoPerationPermit',
              path: '/base-info/specialo-peration-permit',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/base-info/specialo-peration-permit',
                  name: 'specialoPerationPermit',
                  redirect: '/base-info/specialo-peration-permit/list',
                },
                {
                  path: '/base-info/specialo-peration-permit/list',
                  name: 'list',
                  code: 'baseInfo.specialoPerationPermit.listView',
                  component: './BaseInfo/SpecialoPerationPermit/List',
                },
                {
                  path: '/base-info/specialo-peration-permit/add',
                  name: 'add',
                  code: 'baseInfo.specialoPerationPermit.add',
                  component: './BaseInfo/SpecialoPerationPermit/Handle',
                },
                {
                  path: '/base-info/specialo-peration-permit/edit/:id',
                  name: 'edit',
                  code: 'baseInfo.specialoPerationPermit.edit',
                  component: './BaseInfo/SpecialoPerationPermit/Handle',
                },
              ],
            },
            // 特种设备作业人员
            {
              name: 'specialEquipmentOperators',
              code: 'baseInfo.specialEquipmentOperators',
              path: '/base-info/special-equipment-operators',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/base-info/special-equipment-operators',
                  name: 'specialEquipmentOperators',
                  redirect: '/base-info/special-equipment-operators/list',
                },
                {
                  path: '/base-info/special-equipment-operators/list',
                  name: 'list',
                  code: 'baseInfo.specialEquipmentOperators.listView',
                  component: './BaseInfo/SpecialEquipmentOperators/List',
                },
                {
                  path: '/base-info/special-equipment-operators/add',
                  name: 'add',
                  code: 'baseInfo.specialEquipmentOperators.add',
                  component: './BaseInfo/SpecialEquipmentOperators/Handle',
                },
                {
                  path: '/base-info/special-equipment-operators/edit/:id',
                  name: 'edit',
                  code: 'baseInfo.specialEquipmentOperators.edit',
                  component: './BaseInfo/SpecialEquipmentOperators/Handle',
                },
              ],
            },
            // 危化品企业安全许可证
            {
              name: 'dangerChemicalsPermit',
              code: 'baseInfo.dangerChemicalsPermit',
              path: '/base-info/danger-chemicals-permit',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/base-info/danger-chemicals-permit',
                  name: 'dangerChemicalsPermit',
                  redirect: '/base-info/danger-chemicals-permit/list',
                },
                {
                  path: '/base-info/danger-chemicals-permit/list',
                  name: 'list',
                  code: 'baseInfo.dangerChemicalsPermit.listView',
                  component: './BaseInfo/DangerChemicalsPermit/List',
                },
                {
                  path: '/base-info/danger-chemicals-permit/add',
                  name: 'add',
                  code: 'baseInfo.dangerChemicalsPermit.add',
                  component: './BaseInfo/DangerChemicalsPermit/Handle',
                },
                {
                  path: '/base-info/danger-chemicals-permit/edit/:id',
                  name: 'edit',
                  code: 'baseInfo.dangerChemicalsPermit.edit',
                  component: './BaseInfo/DangerChemicalsPermit/Handle',
                },
              ],
            },
            // 重大危险源
            {
              name: 'majorHazard',
              code: 'baseInfo.majorHazard',
              path: '/base-info/major-hazard',
              hideChildrenInMenu: true,
              routes: [
                {
                  name: 'list',
                  path: '/base-info/major-hazard',
                  redirect: '/base-info/major-hazard/list',
                },
                {
                  name: 'list',
                  code: 'baseInfo.majorHazard.listView',
                  path: '/base-info/major-hazard/list',
                  component: './BaseInfo/MajorHazard/MajorHazardList',
                },
                {
                  name: 'add',
                  code: 'baseInfo.majorHazard.add',
                  path: '/base-info/major-hazard/add',
                  component: './BaseInfo/MajorHazard/MajorHazardEdit',
                },
                {
                  name: 'edit',
                  code: 'baseInfo.majorHazard.edit',
                  path: '/base-info/major-hazard/edit/:id',
                  component: './BaseInfo/MajorHazard/MajorHazardEdit',
                },
              ],
            },
            // 储罐区管理
            {
              name: 'storageAreaManagement',
              code: 'baseInfo.storageAreaManagement',
              path: '/base-info/storage-area-management',
              hideChildrenInMenu: true,
              routes: [
                {
                  name: 'list',
                  path: '/base-info/storage-area-management',
                  redirect: '/base-info/storage-area-management/list',
                },
                {
                  name: 'list',
                  code: 'baseInfo.storageAreaManagement.listView',
                  path: '/base-info/storage-area-management/list',
                  component: './BaseInfo/StorageAreaManagement/index',
                },
                {
                  name: 'add',
                  code: 'baseInfo.storageAreaManagement.add',
                  path: '/base-info/storage-area-management/add',
                  component: './BaseInfo/StorageAreaManagement/Edit',
                },
                {
                  name: 'edit',
                  code: 'baseInfo.storageAreaManagement.edit',
                  path: '/base-info/storage-area-management/edit/:id',
                  component: './BaseInfo/StorageAreaManagement/Edit',
                },
                {
                  name: 'detail',
                  code: 'baseInfo.storageAreaManagement.detail',
                  path: '/base-info/storage-area-management/detail/:id',
                  component: './BaseInfo/StorageAreaManagement/Detail',
                },
              ],
            },
            // 储罐管理
            {
              name: 'storageManagement',
              code: 'baseInfo.storageManagement',
              path: '/base-info/storage-management',
              hideChildrenInMenu: true,
              routes: [
                {
                  name: 'list',
                  path: '/base-info/storage-management',
                  redirect: '/base-info/storage-management/list',
                },
                {
                  name: 'list',
                  code: 'baseInfo.storageManagement.listView',
                  path: '/base-info/storage-management/list',
                  component: './BaseInfo/StorageManagement/StorageList',
                },
                {
                  name: 'add',
                  code: 'baseInfo.storageAreaManagement.add',
                  path: '/base-info/storage-management/add',
                  component: './BaseInfo/StorageManagement/StorageEdit',
                },
              ],
            },
            // 库区管理
            {
              name: 'reservoirRegionManagement',
              code: 'baseInfo.reservoirRegionManagement',
              path: '/base-info/reservoir-region-management',
              hideChildrenInMenu: true,
              routes: [
                {
                  name: 'list',
                  path: '/base-info/reservoir-region-management',
                  redirect: '/base-info/reservoir-region-management/list',
                },
                {
                  name: 'list',
                  code: 'baseInfo.reservoirRegionManagement.listView',
                  path: '/base-info/reservoir-region-management/list',
                  component: './BaseInfo/ReservoirRegionManagement/ReservoirRegionList',
                },
                {
                  name: 'add',
                  code: 'baseInfo.reservoirRegionManagement.add',
                  path: '/base-info/reservoir-region-management/add',
                  component: './BaseInfo/ReservoirRegionManagement/ReservoirRegionEdit',
                },
                {
                  name: 'edit',
                  code: 'baseInfo.reservoirRegionManagement.edit',
                  path: '/base-info/reservoir-region-management/edit/:id',
                  component: './BaseInfo/ReservoirRegionManagement/ReservoirRegionEdit',
                },
              ],
            },
            // 工业产品生产许可证
            {
              name: 'industrialProductLicence',
              code: 'baseInfo.industrialProductLicence',
              path: '/base-info/industrial-product-licence',
              hideChildrenInMenu: true,
              routes: [
                {
                  name: 'list',
                  path: '/base-info/industrial-product-licence',
                  redirect: '/base-info/industrial-product-licence/list',
                },
                {
                  name: 'list',
                  code: 'baseInfo.industrialProductLicence.listView',
                  path: '/base-info/industrial-product-licence/list',
                  component: './BaseInfo/IndustrialProductLicence/index',
                },
                {
                  name: 'add',
                  code: 'baseInfo.industrialProductLicence.add',
                  path: '/base-info/industrial-product-licence/add',
                  component: './BaseInfo/IndustrialProductLicence/edit',
                },
                {
                  name: 'edit',
                  code: 'baseInfo.industrialProductLicence.edit',
                  path: '/base-info/industrial-product-licence/edit/:id',
                  component: './BaseInfo/IndustrialProductLicence/edit',
                },
              ],
            },
            // 注册安全工程师管理
            {
              name: 'registeredEngineerManagement',
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
            // 三同时审批记录
            {
              name: 'threeSimultaneity',
              code: 'baseInfo.threeSimultaneity',
              path: '/base-info/three-simultaneity',
              hideChildrenInMenu: true,
              routes: [
                {
                  name: 'list',
                  path: '/base-info/three-simultaneity',
                  redirect: '/base-info/three-simultaneity/list',
                },
                {
                  name: 'list',
                  code: 'baseInfo.threeSimultaneity.listView',
                  path: '/base-info/three-simultaneity/list',
                  component: './BaseInfo/ThreeSimu/TableList',
                },
                {
                  name: 'view',
                  code: 'baseInfo.threeSimultaneity.view',
                  path: '/base-info/three-simultaneity/detail/:id',
                  component: './BaseInfo/ThreeSimu/Edit',
                },
                {
                  name: 'add',
                  code: 'baseInfo.threeSimultaneity.add',
                  path: '/base-info/three-simultaneity/add',
                  component: './BaseInfo/ThreeSimu/Edit',
                },
                {
                  name: 'edit',
                  code: 'baseInfo.threeSimultaneity.edit',
                  path: '/base-info/three-simultaneity/edit/:id',
                  component: './BaseInfo/ThreeSimu/Edit',
                },
              ],
            },
            // 气柜管理
            {
              path: '/base-info/gasometer',
              code: 'baseInfo.gasometer',
              name: 'gasometer',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/base-info/gasometer',
                  redirect: '/base-info/gasometer/list',
                },
                {
                  path: '/base-info/gasometer/list',
                  name: 'list',
                  code: 'baseInfo.gasometer.list',
                  component: './BaseInfo/Gasometer/List',
                },
                {
                  path: '/base-info/gasometer/add',
                  name: 'add',
                  code: 'baseInfo.gasometer.add',
                  component: './BaseInfo/Gasometer/Other',
                },
                {
                  path: '/base-info/gasometer/edit/:id',
                  name: 'edit',
                  code: 'baseInfo.gasometer.edit',
                  component: './BaseInfo/Gasometer/Other',
                },
                {
                  path: '/base-info/gasometer/detail/:id',
                  name: 'detail',
                  code: 'baseInfo.gasometer.detail',
                  component: './BaseInfo/Gasometer/Other',
                },
              ],
            },
            // 安全设施
            {
              name: 'safetyFacilities',
              code: 'baseInfo.safetyFacilities',
              path: '/base-info/safety-facilities',
              hideChildrenInMenu: true,
              routes: [
                {
                  name: 'list',
                  path: '/base-info/safety-facilities',
                  redirect: '/base-info/safety-facilities/list',
                },
                {
                  name: 'list',
                  code: 'baseInfo.safetyFacilities.list',
                  path: '/base-info/safety-facilities/list',
                  component: './BaseInfo/SafetyFacilities/TableList',
                },
                {
                  name: 'view',
                  code: 'baseInfo.safetyFacilities.view',
                  path: '/base-info/safety-facilities/view/:id',
                  component: './BaseInfo/SafetyFacilities/Edit',
                },
                {
                  name: 'add',
                  code: 'baseInfo.safetyFacilities.add',
                  path: '/base-info/safety-facilities/add',
                  component: './BaseInfo/SafetyFacilities/Edit',
                },
                {
                  name: 'edit',
                  code: 'baseInfo.safetyFacilities.edit',
                  path: '/base-info/safety-facilities/edit/:id',
                  component: './BaseInfo/SafetyFacilities/Edit',
                },
              ],
            },
          ],
        },

        // 风险管控
        {
          path: '/risk-control',
          code: 'riskControl',
          icon: 'audit',
          name: 'riskControl',
          systemType: [1],
          routes: [
            /** 风险点管理*/
            {
              path: '/risk-control/risk-point-manage',
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
            /** 企业网格点管理*/
            {
              path: '/risk-control/grid-point-manage',
              code: 'riskControl.gridPointManage',
              name: 'gridPointManage',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/risk-control/grid-point-manage',
                  name: 'gridPointManage',
                  redirect: '/risk-control/grid-point-manage/index',
                },
                {
                  path: '/risk-control/grid-point-manage/index',
                  code: 'riskControl.gridPointManage.listView',
                  name: 'listView',
                  component: './RiskControl/ComapnyGridManage/index',
                },
                {
                  path: '/risk-control/grid-point-manage/grid-point-List/:id',
                  code: 'riskControl.gridPointManage.view',
                  name: 'view',
                  component: './RiskControl/ComapnyGridManage/GridPointList',
                },
                {
                  path: '/risk-control/grid-point-manage/grid-point-add',
                  code: 'riskControl.gridPointManage.add',
                  name: 'add',
                  component: './RiskControl/ComapnyGridManage/GridPointEdit',
                },
                {
                  path: '/risk-control/grid-point-manage/grid-point-edit/:id',
                  code: 'riskControl.gridPointManage.edit',
                  name: 'edit',
                  component: './RiskControl/ComapnyGridManage/GridPointEdit',
                },
                {
                  path: '/risk-control/grid-point-manage/grid-point-detail/:id',
                  code: 'riskControl.gridPointManage.detailView',
                  name: 'detailView',
                  component: './RiskControl/ComapnyGridManage/GridPointDetail',
                },
              ],
            },
          ],
        },

        // 两单信息管理
        {
          path: '/two-information-management',
          code: 'twoInformationManagement',
          icon: 'unordered-list',
          name: 'twoInformationManagement',
          systemType: [1],
          routes: [
            // 危险（有害）因素排查辨识清单
            {
              name: 'dangerFactorsList',
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
            // 安全风险分级管控清单
            {
              name: 'safetyRiskList',
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
        // fire control 消防维保
        {
          path: '/fire-control',
          code: 'fireControl',
          icon: 'tool',
          name: 'fireControl',
          systemType: [0],
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

        // role authorization 角色权限
        {
          path: '/role-authorization',
          code: 'roleAuthorization',
          name: 'roleAuthorization',
          icon: 'user',
          systemType: [0],
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
              path: '/role-authorization/commonRole',
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
              path: '/role-authorization/userRole',
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
        // {
        //   path: '/dynamic-monitoring',
        //   code: 'dynamicMonitoring',
        //   icon: 'dashboard',
        //   name: 'dynamicMonitoring',
        //   routes: [
        //     {
        //       path: '/dynamic-monitoring/fire-alarm',
        //       code: 'dynamicMonitoring.fireAlarm',
        //       name: 'fireAlarm',
        //       hideChildrenInMenu: true,
        //       routes: [
        //         {
        //           path: '/dynamic-monitoring/fire-alarm',
        //           name: 'fireAlarm',
        //           redirect: '/dynamic-monitoring/fire-alarm/index',
        //         },
        //         {
        //           path: '/dynamic-monitoring/fire-alarm/index',
        //           code: 'dynamicMonitoring.fireAlarm.listView',
        //           name: 'index',
        //           component: './DynamicMonitoring/FireAlarm/index',
        //         },
        //         {
        //           path: '/dynamic-monitoring/fire-alarm/company/:companyId',
        //           code: 'dynamicMonitoring.fireAlarm.comanyDetailView',
        //           name: 'companyDetail',
        //           component: './DynamicMonitoring/FireAlarm/CompanyDetail',
        //         },
        //         {
        //           path: '/dynamic-monitoring/fire-alarm/history-record/:companyId',
        //           name: 'historyRecord',
        //           code: 'dynamicMonitoring.fireAlarm.historyRecordView',
        //           component: './DynamicMonitoring/FireAlarm/HistoryRecord',
        //         },
        //         // { path: '/dynamic-monitoring/fire-alarm/company/detail/:companyId/:detailId', name: 'alarmDetail', component: './DynamicMonitoring/FireAlarm/FireAlarmDetail' },
        //       ],
        //     },
        //   ],
        // },

        // data analysis 数据分析
        {
          path: '/data-analysis',
          code: 'dataAnalysis',
          name: 'dataAnalysis',
          icon: 'experiment',
          systemType: [0],
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
                  component: './DataAnalysis/IOT/DataAnalysisList',
                },
                {
                  path: '/data-analysis/IOT-abnormal-data/electricity/:id/count/:count',
                  code: 'dataAnalysis.IOTAbnormalData.electricity',
                  name: 'electricity',
                  component: './DataAnalysis/IOT/Electricity',
                },
                {
                  path: '/data-analysis/IOT-abnormal-data/toxic-gas/:id/count/:count',
                  code: 'dataAnalysis.IOTAbnormalData.toxicGas',
                  name: 'toxicGas',
                  component: './DataAnalysis/IOT/ToxicGas',
                },
                {
                  path: '/data-analysis/IOT-abnormal-data/waste-water/:id/count/:count',
                  code: 'dataAnalysis.IOTAbnormalData.wasteWater',
                  name: 'wasteWater',
                  component: './DataAnalysis/IOT/WasteWater',
                },
                {
                  path: '/data-analysis/IOT-abnormal-data/waste-gas/:id/count/:count',
                  code: 'dataAnalysis.IOTAbnormalData.wasteGas',
                  name: 'wasteGas',
                  component: './DataAnalysis/IOT/WasteGas',
                },
                {
                  path: '/data-analysis/IOT-abnormal-data/storage-tank/:id/count/:count',
                  code: 'dataAnalysis.IOTAbnormalData.storageTank',
                  name: 'storageTank',
                  component: './DataAnalysis/IOT/StorageTank',
                },
                {
                  path: '/data-analysis/IOT-abnormal-data/smoke-detector/:id/count/:count',
                  code: 'dataAnalysis.IOTAbnormalData.smokeDetector',
                  name: 'smokeDetector',
                  component: './DataAnalysis/IOT/SmokeDetector',
                },
                {
                  path: '/data-analysis/IOT-abnormal-data/humiture/:id/count/:count',
                  code: 'dataAnalysis.IOTAbnormalData.humiture',
                  name: 'humiture',
                  component: './DataAnalysis/IOT/Humiture',
                },
                {
                  path: '/data-analysis/IOT-abnormal-data/water/:id/count/:count',
                  code: 'dataAnalysis.IOTAbnormalData.water',
                  name: 'water',
                  component: './DataAnalysis/IOT/Water',
                },
                {
                  path: '/data-analysis/IOT-abnormal-data/fire-alarm/company/:companyId',
                  code: 'dataAnalysis.IOTAbnormalData.fireDetailView',
                  name: 'companyDetail',
                  component: './DynamicMonitoring/FireAlarm/CompanyDetail',
                },
                {
                  path: '/data-analysis/IOT-abnormal-data/fire-alarm/history-record/:companyId',
                  name: 'historyRecord',
                  code: 'dataAnalysis.IOTAbnormalData.fireHistoryRecordView',
                  component: './DynamicMonitoring/FireAlarm/HistoryRecord',
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
            // 隐患统计报表
            {
              path: '/data-analysis/hidden-danger-count-report',
              code: 'dataAnalysis.hiddenDangerCountReport',
              name: 'hiddenDangerCountReport',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/data-analysis/hidden-danger-count-report',
                  name: 'hiddenDangerCountReport',
                  redirect: '/data-analysis/hidden-danger-count-report/list',
                },
                {
                  path: '/data-analysis/hidden-danger-count-report/list',
                  code: 'dataAnalysis.hiddenDangerCountReport.view',
                  name: 'list',
                  component: './DataAnalysis/HiddenDangerCountReport/CompanyList',
                },
                {
                  path: '/data-analysis/hidden-danger-count-report/detail',
                  code: 'dataAnalysis.hiddenDangerCountReport.view',
                  name: 'detail',
                  component: './DataAnalysis/HiddenDangerCountReport/HiddenDangerCountReport',
                },
              ],
            },
            // 企业自查报表
            {
              path: '/data-analysis/company-report',
              code: 'dataAnalysis.companyReport',
              name: 'companyReport',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/data-analysis/company-report',
                  name: 'companyReport',
                  redirect: '/data-analysis/company-report/list',
                },
                {
                  path: '/data-analysis/company-report/list',
                  code: 'dataAnalysis.companyReport.view',
                  name: 'list',
                  component: './DataAnalysis/CompanyReport/CompanyReportList',
                },
                {
                  path: '/data-analysis/company-report/detail/:id',
                  code: 'dataAnalysis.companyReport.view',
                  name: 'detail',
                  component: './DataAnalysis/CompanyReport/CompanyReportDetail',
                },
                {
                  path: '/data-analysis/company-report/checkDetail/:id',
                  code: 'dataAnalysis.companyReport.view',
                  name: 'detail',
                  component: './DataAnalysis/HiddenDangerReport/HiddenDangerReportDetail',
                },
              ],
            },
            // 维保检查报表
            {
              path: '/data-analysis/maintenance-report',
              code: 'dataAnalysis.maintenanceReport',
              name: 'maintenanceReport',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/data-analysis/maintenance-report',
                  name: 'maintenanceReport',
                  redirect: '/data-analysis/maintenance-report/list',
                },
                {
                  path: '/data-analysis/maintenance-report/list',
                  code: 'dataAnalysis.maintenanceReport.view',
                  name: 'list',
                  component: './DataAnalysis/MaintenanceReport/MaintenanceReportList',
                },
                {
                  path: '/data-analysis/maintenance-report/detail/:id',
                  code: 'dataAnalysis.maintenanceReport.view',
                  name: 'detail',
                  component: './DataAnalysis/MaintenanceReport/MaintenanceReportDetail',
                },
                {
                  path: '/data-analysis/maintenance-report/maintenanCheckDetail/:id',
                  code: 'dataAnalysis.maintenanceReport.view',
                  name: 'detail',
                  component: './DataAnalysis/HiddenDangerReport/HiddenDangerReportDetail',
                },
              ],
            },
            // 政府监督报表
            {
              path: '/data-analysis/goverment-report',
              code: 'dataAnalysis.govermentReport',
              name: 'govermentReport',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/data-analysis/goverment-report',
                  name: 'govermentReport',
                  redirect: '/data-analysis/goverment-report/list',
                },
                {
                  path: '/data-analysis/goverment-report/list',
                  code: 'dataAnalysis.govermentReport.view',
                  name: 'list',
                  component: './DataAnalysis/GovermentReport/GovermentReportList',
                },
                {
                  path: '/data-analysis/goverment-report/detail/:id',
                  code: 'dataAnalysis.govermentReport.view',
                  name: 'detail',
                  component: './DataAnalysis/GovermentReport/GovermentReportDetail',
                },
                {
                  path: '/data-analysis/goverment-report/govermentCheckDetail/:id',
                  code: 'dataAnalysis.govermentReport.view',
                  name: 'detail',
                  component: './DataAnalysis/HiddenDangerReport/HiddenDangerReportDetail',
                },
              ],
            },
            // 危险作业管理
            {
              path: '/data-analysis/work-approval-report',
              code: 'dataAnalysis.workApprovalReport',
              name: 'workApprovalReport',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/data-analysis/work-approval-report',
                  name: 'workApprovalReport',
                  redirect: '/data-analysis/work-approval-report/list',
                },
                {
                  path: '/data-analysis/work-approval-report/list',
                  code: 'dataAnalysis.workApprovalReport.listView',
                  name: 'list',
                  component: './DataAnalysis/WorkApprovalReport/CompanyList',
                },
                {
                  path: '/data-analysis/work-approval-report/company/:companyId/:type',
                  name: 'workApprovalList',
                  code: 'dataAnalysis.workApprovalReport.workApprovalList',
                  component: './DataAnalysis/WorkApprovalReport/WorkApprovalList',
                },
                {
                  path: '/data-analysis/work-approval-report/company/:companyId/:type/detail/:id',
                  name: 'detail',
                  code: 'dataAnalysis.workApprovalReport.detail',
                  component: './DataAnalysis/WorkApprovalReport/WorkApprovalDetail',
                },
              ],
            },
          ],
        },

        // device management 设备管理
        {
          path: '/device-management',
          code: 'deviceManagement',
          icon: 'laptop',
          name: 'deviceManagement',
          systemType: [2],
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
                {
                  path:
                    '/device-management/user-transmission-device/:companyId/point-managament/:hostId',
                  code: 'deviceManagement.userTransmissionDevice.pointManagement.listView',
                  name: 'pointManagement',
                  component: './DeviceManagement/UserTransmissionDevice/PointManagement',
                },
              ],
            },
            // 视频
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
                // { path: '/dynamic-monitoring/fire-alarm/company/detail/:companyId/:detailId', name: 'alarmDetail', component: './DynamicMonitoring/FireAlarm/FireAlarmDetail' },
              ],
            },
            // 设备关联传感
            {
              path: '/device-management/associate-sensor',
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
            // 传感器管理
            {
              path: '/device-management/sensor',
              code: 'deviceManagement.sensor',
              name: 'sensor',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/device-management/sensor',
                  name: 'sensor',
                  redirect: '/device-management/sensor/list',
                },
                {
                  path: '/device-management/sensor/list',
                  name: 'listView',
                  code: 'deviceManagement.sensor.listView',
                  component: './DeviceManagement/Sensor/SensorList',
                },
                {
                  path: '/device-management/sensor/add',
                  name: 'add',
                  code: 'deviceManagement.sensor.add',
                  component: './DeviceManagement/Sensor/AddSensor',
                },
                {
                  path: '/device-management/sensor/edit/:id',
                  name: 'edit',
                  code: 'deviceManagement.sensor.edit',
                  component: './DeviceManagement/Sensor/AddSensor',
                },
              ],
            },
            // 传感器型号
            {
              path: '/device-management/sensor-model',
              code: 'deviceManagement.sensorModel',
              name: 'sensorModel',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/device-management/sensor-model',
                  name: 'sensorModel',
                  redirect: '/device-management/sensor-model/list',
                },
                {
                  path: '/device-management/sensor-model/list',
                  name: 'listView',
                  code: 'deviceManagement.sensorModel.listView',
                  component: './DeviceManagement/SensorModel/SensorModelList',
                },
                {
                  path: '/device-management/sensor-model/model/:modelId',
                  name: 'modelParameter',
                  code: 'deviceManagement.sensorModel.model.listView',
                  component: './DeviceManagement/SensorModel/ModelParameterList',
                },
              ],
            },
            // 网关
            {
              path: '/device-management/gateway',
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
            // 监测类型
            {
              path: '/device-management/monitoring-type',
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
            // 设备类型
            {
              path: '/device-management/device-type',
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
            // 品牌
            {
              path: '/device-management/brand',
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
            // 标签库
            {
              path: '/device-management/tag-library',
              name: 'tagLibrary',
              code: 'deviceManagement.tagLibrary',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/device-management/tag-library',
                  name: 'tagLibrary',
                  redirect: '/device-management/tag-library/list',
                },
                {
                  path: '/device-management/tag-library/list',
                  code: 'deviceManagement.tagLibrary.listView',
                  name: 'listView',
                  component: './DeviceManagement/TagLibrary',
                },
              ],
            },
            // 传感器（新）
            {
              path: '/device-management/new-sensor',
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
                // 实时数据
                {
                  path: '/device-management/new-sensor/real-time-data/:id',
                  name: 'realTimeData',
                  code: 'deviceManagement.newSensor.realTimeData',
                  component: './DeviceManagement/NewSensor/RealTimeData',
                },
              ],
            },
            // 单位数据处理设备
            {
              path: '/device-management/data-processing',
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
                // 设备列表
                {
                  path: '/device-management/data-processing/list/:type',
                  name: 'deviceList',
                  code: 'deviceManagement.dataProcessing.device.list',
                  component: './DeviceManagement/DataProcessingEquipment/EquipmentList',
                },
                // 新增设备
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
          ],
        },

        // video surveillance 视频监控
        {
          path: '/video-surveillance',
          code: 'videoSurveillance',
          icon: 'video-camera',
          name: 'videoSurveillance',
          systemType: [2],
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
            {
              path: '/video-surveillance/government-video-permission',
              code: 'videoSurveillance.governmentVideoPermission',
              name: 'governmentVideoPermission',
              hideChildrenInMenu: true,
              routes: [
                {
                  path: '/video-surveillance/government-video-permission',
                  name: 'governmentVideoPermission',
                  redirect: '/video-surveillance/government-video-permission/list',
                },
                {
                  path: '/video-surveillance/government-video-permission/list',
                  code: 'videoSurveillance.governmentVideoPermission.listView',
                  name: 'list',
                  component:
                    './VideoSurveillance/GovernmentVideoPermission/GovernmentVideoPermissionList',
                },
                {
                  path: '/video-surveillance/government-video-permission/edit/:companyId',
                  code: 'videoSurveillance.governmentVideoPermission.edit',
                  name: 'edit',
                  component:
                    './VideoSurveillance/GovernmentVideoPermission/GovernmentVideoPermissionEdit',
                },
                {
                  path: '/video-surveillance/government-video-permission/add',
                  code: 'videoSurveillance.governmentVideoPermission.add',
                  name: 'add',
                  component:
                    './VideoSurveillance/GovernmentVideoPermission/GovernmentVideoPermissionEdit',
                },
              ],
            },
          ],
        },

        // 系统管理
        {
          path: '/system-management',
          code: 'systemManagement',
          name: 'systemManagement',
          icon: 'setting',
          systemType: [0],
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
                {
                  path: '/system-management/page-authority/sort',
                  code: 'systemManagement.pageAuthority.edit',
                  name: 'sort',
                  component: './SystemManagement/PageAuthority/PageAuthoritySort',
                },
              ],
            },
            {
              path: '/system-management/app-authority',
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

        // 执法检查
        {
          path: '/law-enforcement',
          code: 'lawEnforcement',
          icon: 'project',
          name: 'lawEnforcement',
          systemType: [0],
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

        // 教育培训
        {
          name: 'training',
          icon: 'read',
          code: 'training',
          path: '/training',
          systemType: [3],
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
            // 培训计划
            {
              name: 'trainingProgram',
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
        // 人员定位
        {
          name: 'personnelPosition',
          path: '/personnel-position',
          icon: 'environment',
          code: 'personnelPosition',
          systemType: [3],
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
            // {
            //   name: 'buildingsInfo',
            //   path: '/personnel-position/buildings-info',
            //   code: 'personnelPosition.buildingsInfo',
            //   hideChildrenInMenu: true,
            //   routes: [
            //     {
            //       name: 'list',
            //       path: '/personnel-position/buildings-info',
            //       redirect: '/personnel-position/buildings-info/list',
            //     },
            //     {
            //       name: 'list',
            //       code: 'personnelPosition.buildingsInfo.listView',
            //       path: '/personnel-position/buildings-info/list',
            //       component: './PersonnelPosition/BuildingsInfo/CompanyList',
            //     },
            //     {
            //       name: 'view',
            //       code: 'personnelPosition.buildingsInfo.view',
            //       path: '/personnel-position/buildings-info/detail/:id',
            //       component:
            //         './PersonnelPosition/BuildingsInfo/CompanyBuildingInfo/BuildingInfoList',
            //     },
            //     {
            //       name: 'add',
            //       code: 'personnelPosition.buildingsInfo.add',
            //       path: '/personnel-position/buildings-info/add',
            //       component:
            //         './PersonnelPosition/BuildingsInfo/CompanyBuildingInfo/BuildingInfoEdit',
            //     },
            //     {
            //       name: 'edit',
            //       code: 'personnelPosition.buildingsInfo.edit',
            //       path: '/personnel-position/buildings-info/edit/:id',
            //       component:
            //         './PersonnelPosition/BuildingsInfo/CompanyBuildingInfo/BuildingInfoEdit',
            //     },
            //     {
            //       name: 'floorList',
            //       code: 'personnelPosition.buildingsInfo.floorListView',
            //       path: '/personnel-position/buildings-info/floor/list/:id',
            //       component:
            //         './PersonnelPosition/BuildingsInfo/FloorManagement/FloorManagementList',
            //     },
            //     {
            //       name: 'floorAdd',
            //       code: 'personnelPosition.buildingsInfo.floorAdd',
            //       path: '/personnel-position/buildings-info/floor/add',
            //       component:
            //         './PersonnelPosition/BuildingsInfo/FloorManagement/FloorManagementEdit',
            //     },
            //     {
            //       name: 'floorEdit',
            //       code: 'personnelPosition.buildingsInfo.floorEdit',
            //       path: '/personnel-position/buildings-info/floor/edit/:id',
            //       component:
            //         './PersonnelPosition/BuildingsInfo/FloorManagement/FloorManagementEdit',
            //     },
            //     {
            //       name: 'floorDetail',
            //       code: 'personnelPosition.buildingsInfo.floorView',
            //       path: '/personnel-position/buildings-info/floor/detail/:id',
            //       component:
            //         './PersonnelPosition/BuildingsInfo/FloorManagement/FloorManagementDetail',
            //     },
            //   ],
            // },
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
                  path: '/personnel-position/beacon-management/company/:companyId',
                  component: './PersonnelPosition/BeaconManagement/CompanyBeacon',
                },
                {
                  name: 'add',
                  code: 'personnelPosition.beaconManagement.add',
                  path: '/personnel-position/beacon-management/company/:companyId/beacon/add',
                  component: './PersonnelPosition/BeaconManagement/BeaconHandler',
                },
                {
                  name: 'edit',
                  code: 'personnelPosition.beaconManagement.edit',
                  path: '/personnel-position/beacon-management/company/:companyId/beacon/edit/:id',
                  component: './PersonnelPosition/BeaconManagement/BeaconHandler',
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
                  name: 'companyList',
                  path: '/personnel-position/tag-management',
                  redirect: '/personnel-position/tag-management/companies',
                },
                {
                  name: 'companyList',
                  path: '/personnel-position/tag-management/companies',
                  code: 'personnelPosition.tagManagement.companyList',
                  component: './PersonnelPosition/TagManagement/index',
                },
                {
                  name: 'list',
                  path: '/personnel-position/tag-management/company/:companyId',
                  code: 'personnelPosition.tagManagement.listView',
                  component: './PersonnelPosition/TagManagement/TagManagementList',
                },
                {
                  name: 'add',
                  path: '/personnel-position/tag-management/add/:companyId',
                  code: 'personnelPosition.tagManagement.add',
                  component: './PersonnelPosition/TagManagement/TagManagementAdd',
                },
                {
                  name: 'edit',
                  path: '/personnel-position/tag-management/edit/:companyId/:id',
                  code: 'personnelPosition.tagManagement.edit',
                  component: './PersonnelPosition/TagManagement/TagManagementAdd',
                },
                {
                  name: 'detail',
                  path: '/personnel-position/tag-management/detail',
                  code: 'personnelPosition.tagManagement.view',
                  component: './PersonnelPosition/TagManagement/TagManagementDetail',
                },
                {
                  name: 'import',
                  path: '/personnel-position/tag-management/import/:companyId',
                  code: 'personnelPosition.tagManagement.import',
                  component: './PersonnelPosition/TagManagement/ImportTag',
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
            {
              name: 'map',
              path: '/personnel-position/map-management',
              code: 'personnelPosition.mapManagement',
              hideChildrenInMenu: true,
              routes: [
                {
                  name: 'list',
                  path: '/personnel-position/map-management',
                  redirect: '/personnel-position/map-management/list',
                },
                {
                  name: 'list',
                  path: '/personnel-position/map-management/list',
                  code: 'personnelPosition.mapManagement.listView',
                  component: './PersonnelPosition/Map/MapManagementList',
                },
                {
                  name: 'companyMap',
                  path: '/personnel-position/map-management/company-map/:companyId',
                  code: 'personnelPosition.mapManagement.companyMap',
                  component: './PersonnelPosition/Map/CompanyMap',
                },
                {
                  name: 'associateMap',
                  path: '/personnel-position/map-management/associate-map/:id',
                  code: 'personnelPosition.mapManagement.associateMap',
                  component: './PersonnelPosition/Map/AssociateMap',
                },
                {
                  name: 'add',
                  path: '/personnel-position/map-management/company-map/:companyId/add',
                  code: 'personnelPosition.mapManagement.add',
                  component: './PersonnelPosition/Map/AddMap',
                },
                {
                  name: 'edit',
                  path: '/personnel-position/map-management/company-map/:companyId/edit/:id',
                  code: 'personnelPosition.mapManagement.edit',
                  component: './PersonnelPosition/Map/AddMap',
                },
              ],
            },
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
        // 安防管理
        {
          path: '/security-manage',
          code: 'securityManage',
          icon: 'file-protect',
          name: 'securityManage',
          systemType: [3],
          routes: [
            {
              path: '/security-manage/entrance-and-exit-monitor',
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

        // 人员在岗在位管理系统
        {
          path: '/personnel-management',
          code: 'personnelManagement',
          icon: 'team',
          name: 'personnelManagement',
          systemType: [3],
          routes: [
            // 人员基本信息
            {
              path: '/personnel-management/personnel-info',
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
            // 车辆基本信息
            {
              path: '/personnel-management/vehicle-info',
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
            // 卡口信息
            {
              path: '/personnel-management/check-point',
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

        // 安全生产知识库
        {
          path: '/safety-knowledge-base',
          code: 'safetyKnowledgeBase',
          icon: 'book',
          name: 'safetyKnowledgeBase',
          systemType: [0],
          routes: [
            // 化学品安全说明书
            {
              path: '/safety-knowledge-base/msds',
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
            // 典型事故案例
            {
              path: '/safety-knowledge-base/typical-accident-case',
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
            // 安全制度管理
            {
              name: 'safetySystem',
              code: 'safetyKnowledgeBase.safetySystem',
              path: '/safety-knowledge-base/safety-system',
              hideChildrenInMenu: true,
              routes: [
                {
                  name: 'list',
                  path: '/safety-knowledge-base/safety-system',
                  redirect: '/safety-knowledge-base/safety-system/list',
                },
                {
                  name: 'list',
                  code: 'safetyKnowledgeBase.safetySystem.list',
                  path: '/safety-knowledge-base/safety-system/list',
                  component: './SafetyKnowledgeBase/SafetySystem/TableList',
                },
                {
                  name: 'view',
                  code: 'safetyKnowledgeBase.safetySystem.view',
                  path: '/safety-knowledge-base/safety-system/view/:id',
                  component: './SafetyKnowledgeBase/SafetySystem/Edit',
                },
                {
                  name: 'add',
                  code: 'safetyKnowledgeBase.safetySystem.add',
                  path: '/safety-knowledge-base/safety-system/add',
                  component: './SafetyKnowledgeBase/SafetySystem/Edit',
                },
                {
                  name: 'edit',
                  code: 'safetyKnowledgeBase.safetySystem.edit',
                  path: '/safety-knowledge-base/safety-system/edit/:id',
                  component: './SafetyKnowledgeBase/SafetySystem/Edit',
                },
                // {
                //   "name": "history",
                //   "code": "safetyKnowledgeBase.safetySystem.view",
                //   "path": "/safety-knowledge-base/safety-system/history",
                //   "component": "./SafetyKnowledgeBase/SafetySystem/History",
                // },
              ],
            },
          ],
        },

        // 应急管理
        {
          path: '/emergency-management',
          code: 'emergencyManagement',
          icon: 'alert',
          name: 'emergencyManagement',
          systemType: [2],
          routes: [
            {
              path: '/emergency-management',
              redirect: '/emergency-management/emergency-plan/list',
            },
            // 应急预案
            {
              path: '/emergency-management/emergency-plan',
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
            // 应急装备
            {
              path: '/emergency-management/emergency-equipment',
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
            // 应急物资
            {
              path: '/emergency-management/emergency-supplies',
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
            // 应急演练计划
            {
              path: '/emergency-management/emergency-drill',
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
            // 应急演练评估
            {
              path: '/emergency-management/emergency-estimate',
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
            // 应急演练过程
            {
              name: 'emergencyProcess',
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
        // 任务管理
        // {
        //   name: 'taskManagement',
        //   path: '/task-management',
        //   icon: 'tablet',
        //   code: 'taskManagement',
        //   hideInMenu: false,
        //   routes: [
        //     // 专项检查
        //     {
        //       name: 'specialExamination',
        //       path: '/task-management/special-examination',
        //       code: 'taskManagement.specialExamination',
        //       hideChildrenInMenu: true,
        //       routes: [
        //         {
        //           path: '/task-management/special-examination',
        //           redirect: '/task-management/special-examination/list',
        //         },
        //         {
        //           name: 'list',
        //           code: 'taskManagement.specialExamination.list',
        //           path: '/task-management/special-examination/list',
        //           component: './TaskManagement/SpecialExamination/List',
        //         },
        //         // {
        //         //   name: 'detail',
        //         //   code: 'taskManagement.specialExamination.detail',
        //         //   path: '/task-management/special-examination/detail/:id',
        //         //   component: './TaskManagement/SpecialExamination/Other',
        //         // },
        //         // {
        //         //   name: 'add',
        //         //   code: 'taskManagement.specialExamination.add',
        //         //   path: '/task-management/special-examination/add',
        //         //   component: './TaskManagement/SpecialExamination/Other',
        //         // },
        //         // {
        //         //   name: 'edit',
        //         //   code: 'taskManagement.specialExamination.edit',
        //         //   path: '/task-management/special-examination/edit:id',
        //         //   component: './TaskManagement/SpecialExamination/Other',
        //         // },
        //       ],
        //     },
        //   ],
        // },

        // 公告管理
        {
          path: '/announcement-management',
          code: 'announcementManagement',
          icon: 'solution',
          name: 'announcementManagement',
          systemType: [0],
          routes: [
            {
              name: 'promise', // 安全承诺公告
              code: 'announcementManagement.promise',
              path: '/announcement-management/promise',
              hideChildrenInMenu: true,
              routes: [
                {
                  name: 'list',
                  path: '/announcement-management/promise',
                  redirect: '/announcement-management/promise/list',
                },
                {
                  name: 'list',
                  code: 'announcementManagement.promise.list',
                  path: '/announcement-management/promise/list',
                  component: './AnnouncementManagement/Promise/TableList',
                },
                {
                  name: 'view',
                  code: 'announcementManagement.promise.view',
                  path: '/announcement-management/promise/view/:id',
                  component: './AnnouncementManagement/Promise/Edit',
                },
                {
                  name: 'add',
                  code: 'announcementManagement.promise.add',
                  path: '/announcement-management/promise/add',
                  component: './AnnouncementManagement/Promise/Edit',
                },
                {
                  name: 'edit',
                  code: 'announcementManagement.promise.edit',
                  path: '/announcement-management/promise/edit/:id',
                  component: './AnnouncementManagement/Promise/Edit',
                },
              ],
            },
            {
              name: 'announcement', // 信息发布
              code: 'announcementManagement.announcement',
              path: '/announcement-management/announcement',
              hideChildrenInMenu: true,
              routes: [
                {
                  name: 'list',
                  path: '/announcement-management/announcement',
                  redirect: '/announcement-management/announcement/list',
                },
                {
                  name: 'list',
                  code: 'announcementManagement.announcement.list',
                  path: '/announcement-management/announcement/list',
                  component: './AnnouncementManagement/Announcement/TableList',
                },
                {
                  name: 'view',
                  code: 'announcementManagement.announcement.view',
                  path: '/announcement-management/announcement/view/:id',
                  component: './AnnouncementManagement/Announcement/Edit',
                },
                {
                  name: 'add',
                  code: 'announcementManagement.announcement.add',
                  path: '/announcement-management/announcement/add',
                  component: './AnnouncementManagement/Announcement/Edit',
                },
                {
                  name: 'edit',
                  code: 'announcementManagement.announcement.edit',
                  path: '/announcement-management/announcement/edit/:id',
                  component: './AnnouncementManagement/Announcement/Edit',
                },
              ],
            },
          ],
        },

        // 事故管理
        {
          path: '/accident-management',
          code: 'accidentManagement',
          icon: 'fire',
          name: 'accidentManagement',
          systemType: [2],
          routes: [
            {
              name: 'quickReport',
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
              name: 'accidentReport',
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

        // 三卡信息管理
        {
          path: '/cards-info',
          code: 'cardsInfo',
          icon: 'profile',
          name: 'cardsInfo',
          systemType: [1],
          routes: [
            {
              name: 'commitmentCard',
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
              name: 'knowCard',
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
              name: 'emergencyCard',
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
        // 物联网监测
        {
          path: '/iot',
          code: 'iot',
          name: 'iot',
          icon: 'wifi',
          systemType: [2],
          routes: [
            // 重大危险源监测
            {
              path: '/iot/major-hazard',
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
          ],
        },
      ],
    },
  ];
};
