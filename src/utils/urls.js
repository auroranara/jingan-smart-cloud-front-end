export default {
  home: '/',
  role: {
    list: '/role-authorization/role/list/',
    detail: '/role-authorization/role/detail/',
    add: '/role-authorization/role/add/',
    edit: '/role-authorization/role/edit/',
  },
  company: {
    list: '/base-info/company/list/',
    detail: '/base-info/company/detail/',
    add: '/base-info/company/add/',
    edit: '/base-info/company/edit/',
    department: {
      list: '/base-info/company/department/list/',
    },
  },
  baseInfo: {
    specialoPerationPermit: {
      list: '/operation-safety/special-operation-permit/list',
      add: '/operation-safety/specialo-peration-permit/add',
      edit: '/operation-safety/specialo-peration-permit/edit/',
    },
    specialEquipmentOperators: {
      list: '/operation-safety/special-equipment-operators/list',
      add: '/operation-safety/special-equipment-operators/add',
      edit: '/operation-safety/special-equipment-operators/edit/',
    },
    dangerChemicalsPermit: {
      list: '/unit-license/danger-chemicals-permit/list',
      add: '/unit-license/danger-chemicals-permit/add',
      edit: '/unit-license/danger-chemicals-permit/edit/',
    },
  },
  familyFile: {
    list: '/base-info/family-file/list',
    add: '/base-info/family-file/add',
    edit: '/base-info/family-file/edit/',
    detail: '/base-info/family-file/detail/',
  },
  contract: {
    list: '/fire-control/contract/list/',
    detail: '/fire-control/contract/detail/',
    add: '/fire-control/contract/add/',
    edit: '/fire-control/contract/edit/',
  },
  map: {
    index: '/video-surveillance/map/index/',
  },
  maintenance: {
    list: '/fire-control/maintenance-company/list',
    detail: '/fire-control/maintenance-company/detail/',
    add: '/fire-control/maintenance-company/add',
    edit: '/fire-control/maintenance-company/edit/',
    serviceList: '/fire-control/maintenance-company/serviceList/',
  },
  hiddenDangerReport: {
    list: '/control-measures-follow-up/hidden-danger-report/list',
    detail: '/control-measures-follow-up/hidden-danger-report/detail/',
  },
  hiddenDangerCountReport: {
    list: '/control-measures-follow-up/hidden-danger-count-report/list',
  },
  examinationPaper: {
    list: '/training/examination-paper/list',
    detail: '/training/examination-paper/detail/',
    add: '/training/examination-paper/add',
    edit: '/training/examination-paper/edit/',
    preview: '/training/examination-paper/preview/',
  },
  exception: {
    500: '/exception/500/',
    403: '/exception/403/',
    404: '/exception/404/',
  },
};
