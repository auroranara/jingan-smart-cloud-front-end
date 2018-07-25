// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority() {
  let authority = localStorage.getItem('antd-pro-authority');
  if (authority) {
    if (authority.includes('[')) {
      authority = JSON.parse(authority);
    } else {
      authority = [authority];
    }
  } else {
    // TODO: 没有权限不使用admin
    authority = ['admin'];
  }
  return authority;
}

export function setAuthority(authority) {
  return localStorage.setItem('antd-pro-authority', JSON.stringify(authority));
}

export function getToken() {
  return localStorage.getItem('JA-Token') || '';
}

export function setToken(authority) {
  return localStorage.setItem('JA-Token', authority || '');
}
