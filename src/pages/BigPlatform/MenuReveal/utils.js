export const SRC_MAP = {
  'gasBaseInfo.reservoirRegionManagement': 'reservoir', // code => name
  'deviceManagement.monitoringDevice': 'equipment',
  'menu.securityManage.videoIdentity': 'videoMonitor',
};

export function setBlocks(setting, routes) {
  const routerList = routes[routes.length - 1].routes;
  // console.log(routerList);
  routerList.forEach(function({ name, systemType }) {
    if (systemType !== undefined && systemType > -1)
      setting[systemType].blocks.push(name);
  });
}
