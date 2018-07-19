const MENUS = ['baseInfo', 'baseInfo.companyList', 'baseInfo.companyList.listView'];

export function getMenus(req, res) {
  if (res && res.json)
    res.json(MENUS);
  return MENUS;
}

export default { getMenus };
