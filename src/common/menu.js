import { isUrl } from '../utils/utils';

// TODO: authority
const menuData = [
  {
    name: '一企一档',
    icon: 'form',
    path: 'baseInfo',
    children: [
      {
        name: '单位管理',
        path: 'company/list',
      },
    ],
  },
  {
    name: '消防维保',
    icon: 'table',
    path: 'fire-control',
    children: [
      {
        name: '维保公司',
        path: 'maintenance-company/list',
      },
      {
        name: '用户传输装置',
        path: 'user-transmission-device/list',
      },
      {
        name: '维保合同管理',
        path: 'contract/list',
      },
    ],
  },
  {
    name: '动态监测',
    icon: 'dashboard',
    path: 'fire-alarm',
    children: [
      {
        name: '火灾自动报警系统',
        path: 'index',
      },
    ],
  },
  {
    name: '角色权限',
    icon: 'table',
    path: 'role-authorization',
    children: [
      {
        name: '账号管理',
        path: 'account-management/list',
      },
    ],
  },
  {
    name: '账户',
    icon: 'user',
    path: 'user',
    authority: 'guest',
    children: [
      {
        name: 'login',
        path: 'login',
      },
      {
        name: 'register',
        path: 'register',
      },
      {
        name: 'register-result',
        path: 'register-result',
      },
    ],
  },
  {
    name: 'exception',
    icon: 'warning',
    path: 'exception',
    children: [
      {
        name: 'not-permission',
        path: '403',
      },
      {
        name: 'not-find',
        path: '404',
      },
      {
        name: 'server-error',
        path: '500',
      },
      {
        name: 'trigger',
        path: 'trigger',
        hideInMenu: true,
      },
    ],
  },
  {
    name: 'account',
    icon: 'user',
    path: 'account',
    children: [
      {
        name: 'center',
        path: 'center',
      },
      {
        name: 'settings',
        path: 'settings',
      },
      {
        name: 'personalInfo',
        icon: 'user',
        path: 'personalInfo',
      },
    ],
  },
];

function formatter(data, parentPath = '/', parentAuthority, parentName) {
  return data.map(item => {
    let { path } = item;
    const id = parentName ? `${parentName}.${item.name}` : `menu.${item.name}`;

    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      locale: id,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority, id);
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);
