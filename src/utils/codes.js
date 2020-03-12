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
        add: 'deviceManagement.userTransmissionDevice.pointManagement.add',
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
    monitoringType: {
      listView: 'deviceManagement.monitoringType.listView',
      add: 'deviceManagement.monitoringType.add',
      edit: 'deviceManagement.monitoringType.edit',
      delete: 'deviceManagement.monitoringType.delete',
    },
    deviceType: {
      listView: 'deviceManagement.deviceType.listView',
      edit: 'deviceManagement.deviceType.edit',
    },
    brand: {
      listView: 'deviceManagement.brand.listView',
      add: 'deviceManagement.brand.add',
      edit: 'deviceManagement.brand.edit',
      delete: 'deviceManagement.brand.delete',
      model: {
        listView: 'deviceManagement.brand.model.listView',
        add: 'deviceManagement.brand.model.add',
        edit: 'deviceManagement.brand.model.edit',
        delete: 'deviceManagement.brand.model.delete',
        deployParameter: 'deviceManagement.brand.model.deployParameter',
      },
    },
    tagLibrary: {
      listView: 'deviceManagement.tagLibrary.listView',
      add: 'deviceManagement.tagLibrary.add',
      edit: 'deviceManagement.tagLibrary.edit',
      delete: 'deviceManagement.tagLibrary.delete',
    },
    newSensor: {
      listView: 'deviceManagement.newSensor.listView',
      add: 'deviceManagement.newSensor.add',
      edit: 'deviceManagement.newSensor.edit',
      delete: 'deviceManagement.newSensor.delete',
      realTimeData: 'deviceManagement.newSensor.realTimeData',
    },
    // 数据处理设备
    dataProcessing: {
      listView: 'deviceManagement.dataProcessing.companyList',
      addEquipmentType: 'deviceManagement.dataProcessing.addEquipmentType',
      editEquipmentType: 'deviceManagement.dataProcessing.editEquipmentType',
      device: {
        listView: 'deviceManagement.dataProcessing.device.list',
        add: 'deviceManagement.dataProcessing.device.add',
        edit: 'deviceManagement.dataProcessing.device.edit',
        delete: 'deviceManagement.dataProcessing.device.delete',
        bindSensor: 'deviceManagement.dataProcessing.device.bindSensor',
        unbindSensor: 'deviceManagement.dataProcessing.device.unbindSensor',
      },
    },
    // 网关
    gateway: {
      listView: 'deviceManagement.gateway.list',
      add: 'deviceManagement.gateway.add',
      edit: 'deviceManagement.gateway.edit',
      delete: 'deviceManagement.gateway.delete',
      detail: 'deviceManagement.gateway.detail',
    },
    // 监测设备
    monitoringDevice: {
      listView: 'deviceManagement.monitoringDevice.listView',
      add: 'deviceManagement.monitoringDevice.add',
      edit: 'deviceManagement.monitoringDevice.edit',
      delete: 'deviceManagement.monitoringDevice.delete',
      bindSensor: 'deviceManagement.monitoringDevice.bindSensor',
      unbindSensor: 'deviceManagement.monitoringDevice.unbindSensor',
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
      electricity: 'companyIot.IOTAbnormalData.electricity',
      'toxic-gas': 'companyIot.IOTAbnormalData.toxicGas',
      'waste-water': 'companyIot.IOTAbnormalData.wasteWater',
      'waste-gas': 'companyIot.IOTAbnormalData.wasteGas',
      'storage-tank': 'companyIot.IOTAbnormalData.storageTank',
      'smoke-detector': 'companyIot.IOTAbnormalData.smokeDetector',
      humiture: 'companyIot.IOTAbnormalData.humiture',
      fire: 'companyIot.IOTAbnormalData.fireDetailView',
      history: 'companyIot.IOTAbnormalData.fireHistoryRecordView',
      water: 'companyIot.IOTAbnormalData.water',
    },
    MaintenanceRecord: {
      view: 'dataAnalysis.maintenanceRecord.view',
    },
    workApprovalReport: {
      listView: 'operationSafety.workApprovalReport.listView',
      workApprovalList: 'operationSafety.workApprovalReport.workApprovalList',
      detail: 'operationSafety.workApprovalReport.detail',
    },
  },
  lawEnforcement: {
    laws: {
      listView: 'safetyProductionRegulation.laws.listView',
      add: 'safetyProductionRegulation.laws.add',
      edit: 'safetyProductionRegulation.laws.edit',
      detail: 'safetyProductionRegulation.laws.view',
      delete: 'safetyProductionRegulation.laws.delete',
    },
    illegal: {
      listView: 'lawEnforcement.illegal.listView',
      add: 'lawEnforcement.illegal.add',
      edit: 'lawEnforcement.illegal.edit',
      detail: 'lawEnforcement.illegal.view',
      delete: 'lawEnforcement.illegal.delete',
    },
  },
  keyPart: {
    list: 'safetyRiskControl.keyPart.listView',
    add: 'safetyRiskControl.keyPart.add',
    edit: 'safetyRiskControl.keyPart.edit',
    delete: 'safetyRiskControl.keyPart.delete',
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
    fourColorImage: {
      listView: 'riskControl.fourColorImage.listView',
      view: 'riskControl.fourColorImage.view',
      add: 'riskControl.fourColorImage.add',
      edit: 'riskControl.fourColorImage.edit',
      delete: 'riskControl.fourColorImage.delete',
    },
    changeWarning: { evaluate: 'riskControl.changeWarning.evaluate' },
    changeManagement: {
      view: 'riskControl.changeManagement.view',
      approve: 'riskControl.changeManagement.approve',
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
    checkPoint: {
      list: 'personnelManagement.checkPoint.listView',
      add: 'personnelManagement.checkPoint.add',
      view: 'personnelManagement.checkPoint.view',
      edit: 'personnelManagement.checkPoint.edit',
      delete: 'personnelManagement.checkPoint.delete',
    },
  },

  // 应急管理
  emergencyManagement: {
    emergencyEquipment: {
      listView: 'emergencyManagement.emergencyEquipment.listView',
      add: 'emergencyManagement.emergencyEquipment.add',
      edit: 'emergencyManagement.emergencyEquipment.edit',
      detail: 'emergencyManagement.emergencyEquipment.detail',
      delete: 'emergencyManagement.emergencyEquipment.delete',
      checkList: 'emergencyManagement.emergencyEquipment.checkList',
      checkAdd: 'emergencyManagement.emergencyEquipment.checkAdd',
      checkEdit: 'emergencyManagement.emergencyEquipment.checkEdit',
      checkDetail: 'emergencyManagement.emergencyEquipment.checkDetail',
      checkDelete: 'emergencyManagement.emergencyEquipment.checkDelete',
      maintList: 'emergencyManagement.emergencyEquipment.maintList',
      maintAdd: 'emergencyManagement.emergencyEquipment.maintAdd',
      maintEdit: 'emergencyManagement.emergencyEquipment.maintEdit',
      maintDetail: 'emergencyManagement.emergencyEquipment.maintDetail',
      maintDelete: 'emergencyManagement.emergencyEquipment.maintDelete',
    },
    emergencySupplies: {
      listView: 'emergencyManagement.emergencySupplies.listView',
      add: 'emergencyManagement.emergencySupplies.add',
      edit: 'emergencyManagement.emergencySupplies.edit',
      detail: 'emergencyManagement.emergencySupplies.detail',
      delete: 'emergencyManagement.emergencySupplies.delete',
      checkList: 'emergencyManagement.emergencySupplies.checkList',
      checkAdd: 'emergencyManagement.emergencySupplies.checkAdd',
      checkEdit: 'emergencyManagement.emergencySupplies.checkEdit',
      checkDetail: 'emergencyManagement.emergencySupplies.checkDetail',
      checkDelete: 'emergencyManagement.emergencySupplies.checkDelete',
      maintList: 'emergencyManagement.emergencySupplies.maintList',
      maintAdd: 'emergencyManagement.emergencySupplies.maintAdd',
      maintEdit: 'emergencyManagement.emergencySupplies.maintEdit',
      maintDetail: 'emergencyManagement.emergencySupplies.maintDetail',
      maintDelete: 'emergencyManagement.emergencySupplies.maintDelete',
    },
    emergencyDrill: {
      listView: 'emergencyManagement.emergencyDrill.listView',
      add: 'emergencyManagement.emergencyDrill.add',
      edit: 'emergencyManagement.emergencyDrill.edit',
      detail: 'emergencyManagement.emergencyDrill.detail',
      delete: 'emergencyManagement.emergencyDrill.delete',
    },
    emergencyEstimate: {
      listView: 'emergencyManagement.emergencyEstimate.listView',
      add: 'emergencyManagement.emergencyEstimate.add',
      edit: 'emergencyManagement.emergencyEstimate.edit',
      detail: 'emergencyManagement.emergencyEstimate.detail',
      delete: 'emergencyManagement.emergencyEstimate.delete',
    },
    emergencyProcess: {
      listView: 'emergencyManagement.emergencyProcess.list',
      add: 'emergencyManagement.emergencyProcess.add',
      edit: 'emergencyManagement.emergencyProcess.edit',
      detail: 'emergencyManagement.emergencyProcess.view',
      delete: 'emergencyManagement.emergencyProcess.delete',
    },
    // 应急队伍
    emergencyTeam: {
      list: 'emergencyManagement.emergencyTeam.list',
      add: 'emergencyManagement.emergencyTeam.add',
      edit: 'emergencyManagement.emergencyTeam.edit',
      view: 'emergencyManagement.emergencyTeam.view',
      delete: 'emergencyManagement.emergencyTeam.delete',
      teamPersonList: 'emergencyManagement.emergencyTeam.teamPersonList',
      addTeamPerson: 'emergencyManagement.emergencyTeam.addTeamPerson',
      editTeamPerson: 'emergencyManagement.emergencyTeam.editTeamPerson',
      deleteTeamPerson: 'emergencyManagement.emergencyTeam.deleteTeamPerson',
    },
  },

  baseInfo: {
    // 库房管理
    storehouse: {
      listView: 'majorHazardInfo.storehouse.listView',
      add: 'majorHazardInfo.storehouse.add',
      edit: 'majorHazardInfo.storehouse.edit',
      detail: 'majorHazardInfo.storehouse.detail',
      delete: 'majorHazardInfo.storehouse.delete',
      bindSensor: 'majorHazardInfo.storehouse.bindSensor',
      unbindSensor: 'majorHazardInfo.storehouse.unbindSensor',
    },
    // 物料信息
    materials: {
      listView: 'majorHazardInfo.materials.listView',
      add: 'majorHazardInfo.materials.add',
      edit: 'majorHazardInfo.materials.edit',
      detail: 'majorHazardInfo.materials.detail',
      delete: 'majorHazardInfo.materials.delete',
    },
    // 高危工艺流程
    highRiskProcess: {
      listView: 'majorHazardInfo.highRiskProcess.listView',
      add: 'majorHazardInfo.highRiskProcess.add',
      edit: 'majorHazardInfo.highRiskProcess.edit',
      detail: 'majorHazardInfo.highRiskProcess.detail',
      delete: 'majorHazardInfo.highRiskProcess.delete',
      bind: 'majorHazardInfo.highRiskProcess.bind',
      unbind: 'majorHazardInfo.highRiskProcess.unbind',
    },
    // 特种设备管理
    specialEquipment: {
      listView: 'facilityManagement.specialEquipment.listView',
      add: 'facilityManagement.specialEquipment.add',
      edit: 'facilityManagement.specialEquipment.edit',
      detail: 'facilityManagement.specialEquipment.detail',
      delete: 'facilityManagement.specialEquipment.delete',
      inspection: 'facilityManagement.specialEquipment.inspectionReport',
    },

    // 库区管理
    reservoirRegionManagement: {
      list: 'majorHazardInfo.reservoirRegionManagement.listView',
      add: 'majorHazardInfo.reservoirRegionManagement.add',
      edit: 'majorHazardInfo.reservoirRegionManagement.edit',
      delete: 'majorHazardInfo.reservoirRegionManagement.delete',
      bindSensor: 'majorHazardInfo.reservoirRegionManagement.bindSensor',
      unbindSensor: 'majorHazardInfo.reservoirRegionManagement.unbindSensor',
    },
    // 重大危险源
    // majorHazard: {
    //   list: 'baseInfo.majorHazard.listView',
    //   add: 'baseInfo.majorHazard.add',
    //   edit: 'baseInfo.majorHazard.edit',
    //   delete: 'baseInfo.majorHazard.delete',
    // },

    // 工业产品生产许可证
    industrialProductLicence: {
      list: 'unitLicense.industrialProductLicence.listView',
      add: 'unitLicense.industrialProductLicence.add',
      edit: 'unitLicense.industrialProductLicence.edit',
      delete: 'unitLicense.industrialProductLicence.delete',
    },
    // 注册安全工程师管理
    registeredEngineerManagement: {
      list: 'baseInfo.registeredEngineerManagement.listView',
      add: 'baseInfo.registeredEngineerManagement.add',
      edit: 'baseInfo.registeredEngineerManagement.edit',
      delete: 'baseInfo.registeredEngineerManagement.delete',
    },
    // 危化品企业安全许可证
    dangerChemicalsPermit: {
      list: 'unitLicense.dangerChemicalsPermit.listView',
      add: 'unitLicense.dangerChemicalsPermit.add',
      edit: 'unitLicense.dangerChemicalsPermit.edit',
      delete: 'unitLicense.dangerChemicalsPermit.delete',
    },
    // 储罐区管理
    storageAreaManagement: {
      listView: 'majorHazardInfo.storageAreaManagement.listView',
      add: 'majorHazardInfo.storageAreaManagement.add',
      edit: 'majorHazardInfo.storageAreaManagement.edit',
      detail: 'majorHazardInfo.storageAreaManagement.detail',
      delete: 'majorHazardInfo.storageAreaManagement.delete',
      bind: 'majorHazardInfo.storageAreaManagement.bind',
      unbind: 'majorHazardInfo.storageAreaManagement.unbind',
    },
    // 安全设施
    safetyFacilities: {
      list: 'facilityManagement.safetyFacilities.list',
      view: 'facilityManagement.safetyFacilities.view',
      add: 'facilityManagement.safetyFacilities.add',
      edit: 'facilityManagement.safetyFacilities.edit',
      delete: 'facilityManagement.safetyFacilities.delete',
      report: 'facilityManagement.safetyFacilities.report',
    },
    // 储罐管理
    storageManagement: {
      list: 'majorHazardInfo.storageManagement.listView',
      add: 'majorHazardInfo.storageManagement.add',
      edit: 'majorHazardInfo.storageManagement.edit',
      delete: 'majorHazardInfo.storageManagement.delete',
      bind: 'majorHazardInfo.storageManagement.bind',
      unbind: 'majorHazardInfo.storageManagement.unbind',
    },
    // 特种作业操作证人员
    specialOperationPermit: {
      list: 'operationSafety.specialOperationPermit.listView',
      add: 'operationSafety.specialOperationPermit.add',
      edit: 'operationSafety.specialOperationPermit.edit',
      delete: 'operationSafety.specialOperationPermit.delete',
    },
    // 特种设备作业人员
    specialEquipmentOperators: {
      list: 'operationSafety.specialEquipmentOperators.listView',
      add: 'operationSafety.specialEquipmentOperators.add',
      edit: 'operationSafety.specialEquipmentOperators.edit',
      delete: 'operationSafety.specialEquipmentOperators.delete',
    },

    // 生产装置
    productionEquipments: {
      list: 'majorHazardInfo.productionEquipments.listView',
      add: 'majorHazardInfo.productionEquipments.add',
      edit: 'majorHazardInfo.productionEquipments.edit',
      delete: 'majorHazardInfo.productionEquipments.delete',
      bindSensor: 'majorHazardInfo.productionEquipments.bindSensor',
      unbindSensor: 'majorHazardInfo.productionEquipments.unbindSensor',
    },

    // 周边环境信息
    surroundingEnvironmentInfo: {
      list: 'majorHazardInfo.surroundingEnvironmentInfo.listView',
      view: 'majorHazardInfo.surroundingEnvironmentInfo.view',
      add: 'majorHazardInfo.surroundingEnvironmentInfo.add',
      edit: 'majorHazardInfo.surroundingEnvironmentInfo.edit',
      delete: 'majorHazardInfo.surroundingEnvironmentInfo.delete',
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
    msds: {
      view: 'safetyKnowledgeBase.msds.view',
      add: 'safetyKnowledgeBase.msds.add',
      edit: 'safetyKnowledgeBase.msds.edit',
      delete: 'safetyKnowledgeBase.msds.delete',
    },
  },

  // 两单信息管理
  twoInformManagement: {
    dangerFactorsList: {
      list: 'twoInformationManagement.dangerFactorsList.list',
      view: 'twoInformationManagement.dangerFactorsList.view',
      delete: 'twoInformationManagement.dangerFactorsList.delete',
      import: 'twoInformationManagement.dangerFactorsList.import',
      export: 'twoInformationManagement.dangerFactorsList.export',
    },
    safetyRiskList: {
      list: 'twoInformationManagement.safetyRiskList.list',
      view: 'twoInformationManagement.safetyRiskList.view',
      delete: 'twoInformationManagement.safetyRiskList.delete',
      import: 'twoInformationManagement.safetyRiskList.import',
      export: 'twoInformationManagement.safetyRiskList.export',
    },
  },

  // 公告管理
  announcementManagement: {
    // 安全承诺公告
    promise: {
      add: 'safetyRiskControl.promise.add',
      list: 'safetyRiskControl.promise.list',
      view: 'safetyRiskControl.promise.view',
      delete: 'safetyRiskControl.promise.delete',
      edit: 'safetyRiskControl.promise.edit',
    },
  },

  majorHazardInfo: {
    // 重大危险源
    majorHazard: {
      list: 'majorHazardInfo.majorHazard.listView',
      add: 'majorHazardInfo.majorHazard.add',
      edit: 'majorHazardInfo.majorHazard.edit',
      delete: 'majorHazardInfo.majorHazard.delete',
      view: 'majorHazardInfo.majorHazard.view',
    },
  },

  // 目标责任管理
  targetResponsibility: {
    // 安全生产指标
    indexManagement: {
      list: 'targetResponsibility.indexManagement.listView',
      add: 'targetResponsibility.indexManagement.add',
      edit: 'targetResponsibility.indexManagement.edit',
      delete: 'targetResponsibility.indexManagement.delete',
    },
    // 目标责任制定实施
    targetSetting: {
      list: 'targetResponsibility.targetSetting.listView',
      view: 'targetResponsibility.targetSetting.view',
      add: 'targetResponsibility.targetSetting.add',
      edit: 'targetResponsibility.targetSetting.edit',
      delete: 'targetResponsibility.targetSetting.delete',
      result: 'targetResponsibility.targetSetting.result',
    },
    // 报表
    targetAnalysis: {
      listView: 'targetResponsibility.targetAnalysis.listView',
      view: 'targetResponsibility.targetAnalysis.view',
    },
  },

  // 隐患排查治理
  hiddenDangerControl: {
    // 隐患标准管理数据库
    dangerStandardDatabase: {
      list: 'hiddenDangerControl.dangerStandardDatabase.listView',
      add: 'hiddenDangerControl.dangerStandardDatabase.add',
      edit: 'hiddenDangerControl.dangerStandardDatabase.edit',
      delete: 'hiddenDangerControl.dangerStandardDatabase.delete',
      process: 'hiddenDangerControl.dangerStandardDatabase.process',
    },
  },
  // 设备设施管理
  facilityManagement: {
    // 三同时审批记录
    threeSimultaneity: {
      list: 'facilityManagement.threeSimultaneity.listView',
      add: 'facilityManagement.threeSimultaneity.add',
      edit: 'facilityManagement.threeSimultaneity.edit',
      delete: 'facilityManagement.threeSimultaneity.delete',
    },
  },
  cardsInfo: {
    // 承诺卡
    commitmentCard: {
      list: 'cardsInfo.commitmentCard.list',
      view: 'cardsInfo.commitmentCard.view',
      add: 'cardsInfo.commitmentCard.add',
      edit: 'cardsInfo.commitmentCard.edit',
      delete: 'cardsInfo.commitmentCard.delete',
    },
    // 应急卡
    emergencyCard: {
      list: 'cardsInfo.emergencyCard.list',
      view: 'cardsInfo.emergencyCard.view',
      add: 'cardsInfo.emergencyCard.add',
      edit: 'cardsInfo.emergencyCard.edit',
      delete: 'cardsInfo.emergencyCard.delete',
    },
    // 应知卡
    knowCard: {
      list: 'cardsInfo.knowCard.list',
      view: 'cardsInfo.knowCard.view',
      add: 'cardsInfo.knowCard.add',
      edit: 'cardsInfo.knowCard.edit',
      delete: 'cardsInfo.knowCard.delete',
    },
  },
  // 实名制认证系统
  realNameCertification: {
    // 人员管理
    personnelManagement: {
      list: 'realNameCertification.personnelManagement.listView',
      add: 'realNameCertification.personnelManagement.add',
      edit: 'realNameCertification.personnelManagement.edit',
      delete: 'realNameCertification.personnelManagement.delete',
    },
    // 授权管理
    authorization: {
      list: 'realNameCertification.authorization.listView',
      view: 'realNameCertification.authorization.view',
      add: 'realNameCertification.authorization.add',
      edit: 'realNameCertification.authorization.edit',
      delete: 'realNameCertification.authorization.delete',
    },
  },
  // 操作规程
  operatingProcedures: {
    list: 'safetyProductionRegulation.operatingProcedures.listView',
    view: 'safetyProductionRegulation.operatingProcedures.view',
    add: 'safetyProductionRegulation.operatingProcedures.add',
    edit: 'safetyProductionRegulation.operatingProcedures.edit',
    review: 'safetyProductionRegulation.operatingProcedures.review',
    publish: 'safetyProductionRegulation.operatingProcedures.publish',
  },
  // 检查表维护
  checkListMaintenance: {
    list: 'safetyProductionRegulation.checkListMaintenance.listView',
    view: 'safetyProductionRegulation.checkListMaintenance.view',
    add: 'safetyProductionRegulation.checkListMaintenance.add',
    edit: 'safetyProductionRegulation.checkListMaintenance.edit',
    review: 'safetyProductionRegulation.checkListMaintenance.review',
    publish: 'safetyProductionRegulation.checkListMaintenance.publish',
  },
};
