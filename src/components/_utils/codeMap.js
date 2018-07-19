const pathMap = {
  '/base-info': 'baseInfo',
  '/base-info/company': 'baseInfo.company',
  '/base-info/company/list': 'baseInfo.company.list',
  '/base-info/company/add': 'baseInfo.company.add',
  '/base-info/company/edit/:id': 'baseInfo.company.edit',
  '/base-info/company/detail/:id': 'baseInfo.company.view',
  '/fire-control': 'fireControl',
  '/fire-control/contract': 'fireControl.contract',
  '/fire-control/contract/list': 'fireControl.contract.listView',
  '/fire-control/contract/add': 'fireControl.contract.add',
  '/fire-control/contract/edit/:id': 'fireControl.contract.edit',
  '/fire-control/contract/detail/:id': 'fireControl.contract.view',
  '/fire-control/user-transmission-device': 'fireControl.userTransmissionDevice',
  '/fire-control/user-transmission-device/list': 'fireControl.userTransmissionDevice.listView',
  '/fire-control/user-transmission-device/:companyId/detail': 'fireControl.userTransmissionDevice.view',
  '/fire-control/user-transmission-device/:companyId/import-point-position/:hostId': 'fireControl.userTransmissionDevice.host.importPointPosition',
};

function mapReverse(m) {
  const result = {};
  Object.entries(m).forEach(([key, value]) => {
    result[key] = value;
    result[value] = key;
  });
  return result;
}

const codeMap = mapReverse(pathMap);

export default codeMap;
