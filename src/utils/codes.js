export default {
  dashboard: {
    safety: 'dashboard.safetyView',
    fireControl: 'dashboard.fireControlView',
    dynamicMonitor: 'dashboard.dynamicMonitorView',
    personnelPosition: 'dashboard.personnelPositioningView',
    electricityMonitor: 'dashboard.electricityMonitorView',
    gas: 'dashboard.gasView',
    fireMaintenance: 'dashboard.fireMaintenanceView',
    smoke: 'dashboard.smokeView',
    operation: 'dashboard.operationView',
    threedgis: 'dashboard.threedgis',
    gasStation: 'dashboard.gasStation',
  },
  role: {
    list: 'roleAuthorization.role.listView',
    detail: 'roleAuthorization.role.view',
    add: 'roleAuthorization.role.add',
    edit: 'roleAuthorization.role.edit',
    delete: 'roleAuthorization.role.delete',
  },
  commonRole: {
    list: 'roleAuthorization.commonRole.listView',
    detail: 'roleAuthorization.commonRole.view',
    add: 'roleAuthorization.commonRole.add',
    edit: 'roleAuthorization.commonRole.edit',
    delete: 'roleAuthorization.commonRole.delete',
  },
  userRole: {
    list: 'roleAuthorization.userRole.listView',
    detail: 'roleAuthorization.userRole.view',
    add: 'roleAuthorization.userRole.add',
    edit: 'roleAuthorization.userRole.edit',
    delete: 'roleAuthorization.userRole.delete',
  },
  account: {
    edit: 'roleAuthorization.accountManagement.edit',
    detail: 'roleAuthorization.accountManagement.view',
    add: 'roleAuthorization.accountManagement.add',
    reset: 'roleAuthorization.accountManagement.reset',
    addAssociatedUnit: 'roleAuthorization.accountManagement.associatedUnit.add',
    editAssociatedUnit: 'roleAuthorization.accountManagement.associatedUnit.edit',
    bindAssociatedUnit: 'roleAuthorization.accountManagement.associatedUnit.bind',
  },
  deviceManagement: {
    transmission: {
      detail: 'deviceManagement.userTransmissionDevice.view',
      add: 'deviceManagement.userTransmissionDevice.add',
      update: 'deviceManagement.userTransmissionDevice.edit',
      delete: 'deviceManagement.userTransmissionDevice.delete',
      host: {
        add: 'deviceManagement.userTransmissionDevice.host.add',
        update: 'deviceManagement.userTransmissionDevice.host.edit',
        delete: 'deviceManagement.userTransmissionDevice.host.delete',
        import: 'deviceManagement.userTransmissionDevice.host.importPointPosition',
      },
      point: {
        listView: 'deviceManagement.userTransmissionDevice.pointManagement.listView',
        edit: 'deviceManagement.userTransmissionDevice.pointManagement.edit',
        delete: 'deviceManagement.userTransmissionDevice.pointManagement.delete',
      },
    },
    videoMonitor: {
      listView: 'deviceManagement.videoMonitor.listView',
      add: 'deviceManagement.videoMonitor.add',
      edit: 'deviceManagement.videoMonitor.edit',
      view: 'deviceManagement.videoMonitor.view',
      associate: 'deviceManagement.videoMonitor.associate',
      addAssociate: 'deviceManagement.videoMonitor.addAssociate',
      unBindBeacon: 'deviceManagement.videoMonitor.unBindBeacon',
      delete: 'deviceManagement.videoMonitor.delete',
    },
    associateSensor: {
      listView: 'deviceManagement.associateSensor.listView',
      addCompany: 'deviceManagement.associateSensor.addCompany',
      waterSystem: {
        listView: 'deviceManagement.associateSensor.waterSystem.listView',
        add: 'deviceManagement.associateSensor.waterSystem.add',
        delete: 'deviceManagement.associateSensor.waterSystem.delete',
        edit: 'deviceManagement.associateSensor.waterSystem.edit',
        bindSensor: 'deviceManagement.associateSensor.waterSystem.bindSensor',
        unbindSensor: 'deviceManagement.associateSensor.waterSystem.unbindSensor',
      },
      temperatureAndHumidity: {
        listView: 'deviceManagement.associateSensor.temperatureAndHumidity.listView',
        add: 'deviceManagement.associateSensor.temperatureAndHumidity.add',
        delete: 'deviceManagement.associateSensor.temperatureAndHumidity.delete',
        edit: 'deviceManagement.associateSensor.temperatureAndHumidity.edit',
        bindSensor: 'deviceManagement.associateSensor.temperatureAndHumidity.bindSensor',
        unbindSensor: 'deviceManagement.associateSensor.temperatureAndHumidity.unbindSensor',
      },
    },
    sensor: {
      listView: 'deviceManagement.sensor.listView',
      add: 'deviceManagement.sensor.add',
      edit: 'deviceManagement.sensor.edit',
      delete: 'deviceManagement.sensor.delete',
    },
    sensorModel: {
      listView: 'deviceManagement.sensorModel.listView',
      add: 'deviceManagement.sensorModel.add',
      edit: 'deviceManagement.sensorModel.edit',
      copy: 'deviceManagement.sensorModel.copy',
      delete: 'deviceManagement.sensorModel.delete',
      model: {
        listView: 'deviceManagement.sensorModel.model.listView',
        add: 'deviceManagement.sensorModel.model.add',
        edit: 'deviceManagement.sensorModel.model.edit',
        delete: 'deviceManagement.sensorModel.model.delete',
        alarmStrategy: 'deviceManagement.sensorModel.model.alarmStrategy',
      },
    },
  },
  videoSurveillance: {
    hikVideoTree: {
      detail: 'videoSurveillance.hikVideoTree.detailView',
      play: 'videoSurveillance.hikVideoTree.play',
    },
    videoPermission: {
      edit: 'videoSurveillance.videoPermission.edit',
      add: 'videoSurveillance.videoPermission.add',
    },
    governmentVideoPermission: {
      edit: 'videoSurveillance.governmentVideoPermission.edit',
      add: 'videoSurveillance.governmentVideoPermission.add',
    },
  },
  company: {
    list: 'baseInfo.company.listView',
    detail: 'baseInfo.company.view',
    add: 'baseInfo.company.add',
    edit: 'baseInfo.company.edit',
    delete: 'baseInfo.company.delete',
    department: {
      list: 'baseInfo.company.department.listView',
      add: 'baseInfo.company.department.add',
      delete: 'baseInfo.company.department.delete',
      edit: 'baseInfo.company.department.edit',
    },
    division: {
      list: 'baseInfo.company.division.listView',
      add: 'baseInfo.company.division.add',
      delete: 'baseInfo.company.division.delete',
      edit: 'baseInfo.company.division.edit',
      detail: 'baseInfo.company.division.view',
    },
    // 建筑物信息
    buildingsInfo: {
      list: 'baseInfo.buildingsInfo.listView',
      view: 'baseInfo.buildingsInfo.view',
      add: 'baseInfo.buildingsInfo.add',
      edit: 'baseInfo.buildingsInfo.edit',
      delete: 'baseInfo.buildingsInfo.delete',
      // 楼层
      floorListView: 'baseInfo.buildingsInfo.floorListView',
      floorAdd: 'baseInfo.buildingsInfo.floorAdd',
      floorEdit: 'baseInfo.buildingsInfo.floorEdit',
      floorView: 'baseInfo.buildingsInfo.floorView',
      floorDelete: 'baseInfo.buildingsInfo.floorDelete',
    },
  },
  // 个人备案
  familyFile: {
    list: 'baseInfo.personnelManagement.listView',
    add: 'baseInfo.personnelManagement.add',
    edit: 'baseInfo.personnelManagement.edit',
    delete: 'baseInfo.personnelManagement.delete',
    detail: 'baseInfo.personnelManagement.view',
  },
  contract: {
    list: 'fireControl.contract.listView',
    detail: 'fireControl.contract.view',
    add: 'fireControl.contract.add',
    edit: 'fireControl.contract.edit',
    delete: 'fireControl.contract.delete',
  },
  maintenanceCompany: {
    add: 'fireControl.maintenanceCompany.add',
    detail: 'fireControl.maintenanceCompany.view',
    edit: 'fireControl.maintenanceCompany.edit',
    serviceDetail: 'fireControl.maintenanceCompany.serviceListView',
  },
  dynamicMonitoring: {
    comanyDetailView: 'dynamicMonitoring.fireAlarm.comanyDetailView',
    historyRecordView: 'dynamicMonitoring.fireAlarm.historyRecordView',
  },
  map: {
    index: 'videoSurveillance.map.view',
  },
  dataAnalysis: {
    IOTAbnormalData: {
      electricity: 'dataAnalysis.IOTAbnormalData.electricity',
      'toxic-gas': 'dataAnalysis.IOTAbnormalData.toxicGas',
      'waste-water': 'dataAnalysis.IOTAbnormalData.wasteWater',
      'waste-gas': 'dataAnalysis.IOTAbnormalData.wasteGas',
      'storage-tank': 'dataAnalysis.IOTAbnormalData.storageTank',
      'smoke-detector': 'dataAnalysis.IOTAbnormalData.smokeDetector',
      humiture: 'dataAnalysis.IOTAbnormalData.humiture',
      fire: 'dataAnalysis.IOTAbnormalData.fireDetailView',
      history: 'dataAnalysis.IOTAbnormalData.fireHistoryRecordView',
      water: 'dataAnalysis.IOTAbnormalData.water',
    },
    MaintenanceRecord: {
      view: 'dataAnalysis.maintenanceRecord.view',
    },
    workApprovalReport: {
      listView: 'dataAnalysis.workApprovalReport.listView',
      workApprovalList: 'dataAnalysis.workApprovalReport.workApprovalList',
      detail: 'dataAnalysis.workApprovalReport.detail',
    },
  },
  lawEnforcement: {
    laws: {
      listView: 'lawEnforcement.laws.listView',
      add: 'lawEnforcement.laws.add',
      edit: 'lawEnforcement.laws.edit',
      detail: 'lawEnforcement.laws.view',
      delete: 'lawEnforcement.laws.delete',
    },
    illegal: {
      listView: 'lawEnforcement.illegal.listView',
      add: 'lawEnforcement.illegal.add',
      edit: 'lawEnforcement.illegal.edit',
      detail: 'lawEnforcement.illegal.view',
      delete: 'lawEnforcement.illegal.delete',
    },
  },
  training: {
    examinationPaper: {
      list: 'training.examinationPaper.listView',
      add: 'training.examinationPaper.add',
      edit: 'training.examinationPaper.edit',
      detail: 'training.examinationPaper.view',
      delete: 'training.examinationPaper.delete',
    },
    library: {
      list: 'training.library.listView',
      add: 'training.library.add',
      edit: 'training.library.edit',
      delete: 'training.library.delete',
    },
    points: {
      view: 'training.points.view',
      add: 'training.points.add',
      edit: 'training.points.edit',
      delete: 'training.points.delete',
    },
  },
  personnelPosition: {
    // 系统配置
    systemConfiguration: {
      list: 'personnelPosition.systemConfiguration.listView',
      add: 'personnelPosition.systemConfiguration.add',
      edit: 'personnelPosition.systemConfiguration.edit',
      delete: 'personnelPosition.systemConfiguration.delete',
    },
    // // 建筑物信息
    // buildingsInfo: {
    //   list: 'personnelPosition.buildingsInfo.listView',
    //   view: 'personnelPosition.buildingsInfo.view',
    //   add: 'personnelPosition.buildingsInfo.add',
    //   edit: 'personnelPosition.buildingsInfo.edit',
    //   delete: 'personnelPosition.buildingsInfo.delete',
    //   // 楼层
    //   floorListView: 'personnelPosition.buildingsInfo.floorListView',
    //   floorAdd: 'personnelPosition.buildingsInfo.floorAdd',
    //   floorEdit: 'personnelPosition.buildingsInfo.floorEdit',
    //   floorView: 'personnelPosition.buildingsInfo.floorView',
    //   floorDelete: 'personnelPosition.buildingsInfo.floorDelete',
    // },
    // 信标管理
    beaconManagement: {
      list: 'personnelPosition.beaconManagement.listView',
      companyBeacon: 'personnelPosition.beaconManagement.companyBeacon',
      add: 'personnelPosition.beaconManagement.add',
      edit: 'personnelPosition.beaconManagement.edit',
      delete: 'personnelPosition.beaconManagement.delete',
      viewMap: 'personnelPosition.beaconManagement.viewMap',
    },
    // 标签管理
    tag: {
      companyList: 'personnelPosition.tagManagement.companyList',
      list: 'personnelPosition.tagManagement.listView',
      add: 'personnelPosition.tagManagement.add',
      edit: 'personnelPosition.tagManagement.edit',
      delete: 'personnelPosition.tagManagement.delete',
      detail: 'personnelPosition.tagManagement.view',
      import: 'personnelPosition.tagManagement.import',
    },
    // 地图管理
    map: {
      list: 'personnelPosition.mapManagement.listView',
      companyMap: 'personnelPosition.mapManagement.companyMap',
      add: 'personnelPosition.mapManagement.add',
      edit: 'personnelPosition.mapManagement.edit',
      delete: 'personnelPosition.mapManagement.delete',
      associateBeacon: 'personnelPosition.mapManagement.associateBeacon',
      associateMap: 'personnelPosition.mapManagement.associateMap',
    },
    // 区域管理
    sectionManagement: {
      companies: 'personnelPosition.sectionManagement.companies',
      list: 'personnelPosition.sectionManagement.listView',
      add: 'personnelPosition.sectionManagement.add',
      edit: 'personnelPosition.sectionManagement.edit',
      delete: 'personnelPosition.sectionManagement.delete',
      divide: 'personnelPosition.sectionManagement.divide',
    },
    // 报警策略
    alarmManagement: {
      companyList: 'personnelPosition.alarmManagement.companyListView',
      alarmList: 'personnelPosition.alarmManagement.alarmListView',
      add: 'personnelPosition.alarmManagement.add',
      edit: 'personnelPosition.alarmManagement.edit',
      delete: 'personnelPosition.alarmManagement.delete',
      view: 'personnelPosition.alarmManagement.view',
    },
  },
  /** 风险管控 */
  riskControl: {
    // 风险点管理
    riskPointManage: {
      listView: 'riskControl.riskPointManage.listView',
      view: 'riskControl.riskPointManage.view',
      add: 'riskControl.riskPointManage.add',
      edit: 'riskControl.riskPointManage.edit',
      delete: 'riskControl.riskPointManage.delete',
      riskAssessmentView: 'riskControl.riskPointManage.riskAssessmentView',
      riskCardView: 'riskControl.riskPointManage.riskCardView',
    },
    // 风险点管理
    gridPointManage: {
      listView: 'riskControl.gridPointManage.listView',
      view: 'riskControl.gridPointManage.view',
      add: 'riskControl.gridPointManage.add',
      edit: 'riskControl.gridPointManage.edit',
      delete: 'riskControl.gridPointManage.delete',
      detailView: 'riskControl.gridPointManage.detailView',
    },
  },

  /** 安防管理 */
  securityManage: {
    entranceAndExitMonitor: {
      listView: 'securityManage.entranceAndExitMonitor.listView',
      addCompany: 'securityManage.entranceAndExitMonitor.addCompany',
      faceDatabaseView: 'securityManage.entranceAndExitMonitor.faceDatabaseView',
      cameraView: 'securityManage.entranceAndExitMonitor.cameraView',
      monitorPointView: 'securityManage.entranceAndExitMonitor.monitorPointView',
      alarmRecordView: 'securityManage.entranceAndExitMonitor.alarmRecordView',
    },
  },

  /** 人员在岗在位管理系统 */
  personnelManagement: {
    personnelInfo: {
      listView: 'personnelManagement.personnelInfo.listView',
      addCompany: 'personnelManagement.personnelInfo.addCompany',
      view: 'personnelManagement.personnelInfo.view',
      add: 'personnelManagement.personnelInfo.add',
      edit: 'personnelManagement.personnelInfo.edit',
      detail: 'personnelManagement.personnelInfo.detail',
      delete: 'personnelManagement.personnelInfo.delete',
    },
    vehicleInfo: {
      listView: 'personnelManagement.vehicleInfo.listView',
      addCompany: 'personnelManagement.vehicleInfo.addCompany',
      view: 'personnelManagement.vehicleInfo.view',
      add: 'personnelManagement.vehicleInfo.add',
      edit: 'personnelManagement.vehicleInfo.edit',
      detail: 'personnelManagement.vehicleInfo.detail',
      delete: 'personnelManagement.vehicleInfo.delete',
    },
  },

  // 应急管理
  emergencyManagement: {
    emergencyEquipment: {
      listView: 'emergencyManagement.emergencyEquipment.listView',
      add: 'emergencyManagement.emergencyEquipment.add',
      edit: 'emergencyManagement.emergencyEquipment.edit',
      detail: 'emergencyManagement.emergencyEquipment.detail',
    },
    emergencySupplies: {
      listView: 'emergencyManagement.emergencySupplies.listView',
      add: 'emergencyManagement.emergencySupplies.add',
      edit: 'emergencyManagement.emergencySupplies.edit',
      detail: 'emergencyManagement.emergencySupplies.detail',
    },
    emergencyDrill: {
      listView: 'emergencyManagement.emergencyDrill.listView',
      add: 'emergencyManagement.emergencyDrill.add',
      edit: 'emergencyManagement.emergencyDrill.edit',
      detail: 'emergencyManagement.emergencyDrill.detail',
    },
  },

  baseInfo: {
    // 库房管理
    storehouse: {
      listView: 'baseInfo.storehouse.listView',
      add: 'baseInfo.storehouse.add',
      edit: 'baseInfo.storehouse.edit',
      detail: 'baseInfo.storehouse.detail',
      delete: 'baseInfo.storehouse.delete',
    },
    // 物料信息
    materials: {
      listView: 'baseInfo.materials.listView',
      add: 'baseInfo.materials.add',
      edit: 'baseInfo.materials.edit',
      detail: 'baseInfo.materials.detail',
      delete: 'baseInfo.materials.delete',
    },
    // 高危工艺流程
    highRiskProcess: {
      listView: 'baseInfo.highRiskProcess.listView',
      add: 'baseInfo.highRiskProcess.add',
      edit: 'baseInfo.highRiskProcess.edit',
      detail: 'baseInfo.highRiskProcess.detail',
    },
    // 特种设备管理
    specialEquipment: {
      listView: 'baseInfo.specialEquipment.listView',
      add: 'baseInfo.specialEquipment.add',
      edit: 'baseInfo.specialEquipment.edit',
      detail: 'baseInfo.specialEquipment.detail',
    },

    // 库区管理
    reservoirRegionManagement: {
      list: 'baseInfo.reservoirRegionManagement.listView',
      add: 'baseInfo.reservoirRegionManagement.add',
      edit: 'baseInfo.reservoirRegionManagement.edit',
      delete: 'baseInfo.reservoirRegionManagement.delete',
    },
    // 重大危险源
    majorHazard: {
      list: 'baseInfo.majorHazard.listView',
      add: 'baseInfo.majorHazard.add',
      edit: 'baseInfo.majorHazard.edit',
      delete: 'baseInfo.majorHazard.delete',
    },

    // 工业产品生产许可证
    industrialProductLicence: {
      list: 'baseInfo.industrialProductLicence.listView',
      add: 'baseInfo.industrialProductLicence.add',
      edit: 'baseInfo.industrialProductLicence.edit',
      delete: 'baseInfo.industrialProductLicence.delete',
    },
    // 注册安全工程师管理
    registeredEngineerManagement: {
      list: 'baseInfo.registeredEngineerManagement.listView',
      add: 'baseInfo.registeredEngineerManagement.add',
      edit: 'baseInfo.registeredEngineerManagement.edit',
      delete: 'baseInfo.registeredEngineerManagement.delete',
    },
    // 危险化学品企业安全许可证
    dangerChemicalsPermit: {
      list: 'baseInfo.dangerChemicalsPermit.listView',
      add: 'baseInfo.dangerChemicalsPermit.add',
      edit: 'baseInfo.dangerChemicalsPermit.edit',
      delete: 'baseInfo.dangerChemicalsPermit.delete',
    },
  },
  safetyKnowledgeBase: {
    // 典型事故案例
    typicalAccidentCase: {
      listView: 'safetyKnowledgeBase.typicalAccidentCase.listView',
      add: 'safetyKnowledgeBase.typicalAccidentCase.add',
      edit: 'safetyKnowledgeBase.typicalAccidentCase.edit',
      delete: 'safetyKnowledgeBase.typicalAccidentCase.delete',
    },
  },
};
