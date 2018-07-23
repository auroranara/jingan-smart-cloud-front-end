import { message } from 'antd';

// const emptyFn = () => { };

export function hasAuthority(code, codes) {
  return codes.includes(code);
}

export function getDisabled(code, codes) {
  return !hasAuthority(code, codes);
}

const ERROR_MSG = '您没有进行当前操作的权限';

// 不传回调函数只传msg或传不带参数的回调函数
export function getOnClick(code, codes, callbackOrMsg, msg) {
  // 不传回调函数直传msg
  if (typeof callbackOrMsg === 'string')
    return getOnClickByArg(code, codes, undefined, undefined, callbackOrMsg);
  // 传入无参的回调函数，msg可传可不传
  return getOnClickByArg(code, codes, callbackOrMsg, [], msg);
}

/* 传带参数的回调函数，只有一个参数且不是数组时，可以直接传，或者可以将参数放入数组中
 * 注意特殊的是当只有一个参数，且参数为数组时，为了不与上述的传参方式冲突，必须将数组参数放入数组中，如f([0,1]) -> getOnClickByArg(code, codes, f, [[0,1]])
 * 否则若getOnClickByArg(code, menus, f, [0,1])这么传时，会f(...[0,1])这么调用函数
 */
export function getOnClickByArg(code, codes, callback, args, msg = ERROR_MSG) {
  return ev => {
    if (hasAuthority(code, codes)) {
      if (callback && Array.isArray(args))
        callback(...args);
      else if (callback)
        callback(args);
      return;
    }

    message.error(msg);
    ev.preventDefault();
  }
}
