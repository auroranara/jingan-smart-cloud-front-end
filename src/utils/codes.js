export default {
  role: {
    list: 'roleAuthorization.role.listView',
    detail: 'roleAuthorization.role.view',
    add: 'roleAuthorization.role.add',
    edit: 'roleAuthorization.role.edit',
    delete: 'roleAuthorization.role.delete',
  },
  account: {
    edit: 'roleAuthorization.accountManagement.edit',
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
  },
  videoSurveillance: {
    hikVideoTree: {
      detail: 'videoSurveillance.hikVideoTree.detailView',
      play: 'videoSurveillance.hikVideoTree.play',
    },
  },
  company: {
    list: 'baseInfo.company.listView',
    detail: 'baseInfo.company.view',
    add: 'baseInfo.company.add',
    edit: 'baseInfo.company.edit',
    delete: 'baseInfo.company.delete',
    department: {
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
  map: {
    index: 'videoSurveillance.map.view',
  },
};
