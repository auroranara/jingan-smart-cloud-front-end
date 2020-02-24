export const SRC_MAP = {
  'gasBaseInfo.reservoirRegionManagement': 'reservoir', // code => name
  'deviceManagement.monitoringDevice': 'equipment',
  'securityManage.videoIdentity': 'videoMonitor',
  'licensePlateRecognitionSystem.report': 'recognitionReport',
};

export function setBlocks(setting, routes) {
  const routerList = routes[routes.length - 1].routes;
  // console.log(routerList);
  routerList.forEach(function({ name, systemType }) {
    if (systemType !== undefined && systemType > -1)
      setting[systemType].blocks.push(name);
  });
}

export function setMenuSys(blockClassification, menuSysAll) {
  blockClassification.forEach((b, index) => {
    const { blocks } = b;
    b.index = index;
    b.menuSys = menuSysAll.filter(item => blocks.includes(item.name));
  });
}
