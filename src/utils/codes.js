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
  },
  role: {
    list: 'roleAuthorization.role.listView',
    detail: 'roleAuthorization.role.view',
    add: 'roleAuthorization.role.add',
    edit: 'roleAuthorization.role.edit',
    delete: 'roleAuthorization.role.delete',
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
    },
    MaintenanceRecord: {
      view: 'dataAnalysis.maintenanceRecord.view',
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
    // 建筑物信息
    buildingsInfo: {
      list: 'personnelPosition.buildingsInfo.listView',
      view: 'personnelPosition.buildingsInfo.view',
      add: 'personnelPosition.buildingsInfo.add',
      edit: 'personnelPosition.buildingsInfo.edit',
      delete: 'personnelPosition.buildingsInfo.delete',
      // 楼层
      floorListView: 'personnelPosition.buildingsInfo.floorListView',
      floorAdd: 'personnelPosition.buildingsInfo.floorAdd',
      floorEdit: 'personnelPosition.buildingsInfo.floorEdit',
      floorView: 'personnelPosition.buildingsInfo.floorView',
      floorDelete: 'personnelPosition.buildingsInfo.floorDelete',
    },
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
};
