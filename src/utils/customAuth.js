import { message } from 'antd';

export function getDisabled(code, menus) {
  return !menus.includes(code);
}

const ERROR_MSG = '您没有进行当前操作的权限';

export function getOnClick(code, menus, msg = ERROR_MSG) {
  return ev => {
    if (!getDisabled(code, menus))
      return;

    message.error(msg);
    ev.preventDefault();
  }
}
