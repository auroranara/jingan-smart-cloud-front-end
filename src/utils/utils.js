import moment from 'moment';
import React from 'react';
import CryptoJS from 'crypto-js';
import { parse, stringify } from 'qs';
import router from 'umi/router';

export function fixedZero (val) {
  return val * 1 < 10 ? `0${val}` : val;
}

// 根据code生成chart 默认26个大写字母
export function initChars (start = 65, end = 91) {
  var list = [];
  for (var i = start; i < end; i++) {
    list.push(String.fromCharCode(i));
  }
  return list;
}

export function getTimeDistance (type) {
  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;

  if (type === 'today') {
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return [moment(now), moment(now.getTime() + (oneDay - 1000))];
  }

  if (type === 'week') {
    let day = now.getDay();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    if (day === 0) {
      day = 6;
    } else {
      day -= 1;
    }

    const beginTime = now.getTime() - day * oneDay;

    return [moment(beginTime), moment(beginTime + (7 * oneDay - 1000))];
  }

  if (type === 'month') {
    const year = now.getFullYear();
    const month = now.getMonth();
    const nextDate = moment(now).add(1, 'months');
    const nextYear = nextDate.year();
    const nextMonth = nextDate.month();

    return [
      moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`),
      moment(moment(`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`).valueOf() - 1000),
    ];
  }

  if (type === 'year') {
    const year = now.getFullYear();

    return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)];
  }
}

export function getPlainNode (nodeList, parentPath = '') {
  const arr = [];
  nodeList.forEach(node => {
    const item = node;
    item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
    item.exact = true;
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path));
    } else {
      if (item.children && item.component) {
        item.exact = false;
      }
      arr.push(item);
    }
  });
  return arr;
}

function accMul (arg1, arg2) {
  let m = 0;
  const s1 = arg1.toString();
  const s2 = arg2.toString();
  m += s1.split('.').length > 1 ? s1.split('.')[1].length : 0;
  m += s2.split('.').length > 1 ? s2.split('.')[1].length : 0;
  return (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) / 10 ** m;
}

export function digitUppercase (n) {
  const fraction = ['角', '分'];
  const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  const unit = [['元', '万', '亿'], ['', '拾', '佰', '仟', '万']];
  let num = Math.abs(n);
  let s = '';
  fraction.forEach((item, index) => {
    s += (digit[Math.floor(accMul(num, 10 * 10 ** index)) % 10] + item).replace(/零./, '');
  });
  s = s || '整';
  num = Math.floor(num);
  for (let i = 0; i < unit[0].length && num > 0; i += 1) {
    let p = '';
    for (let j = 0; j < unit[1].length && num > 0; j += 1) {
      p = digit[num % 10] + unit[1][j] + p;
      num = Math.floor(num / 10);
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
  }

  return s
    .replace(/(零.)*零元/, '元')
    .replace(/(零.)+/g, '零')
    .replace(/^整$/, '零元整');
}

function getRelation (str1, str2) {
  if (str1 === str2) {
    console.warn('Two path are equal!'); // eslint-disable-line
  }
  const arr1 = str1.split('/');
  const arr2 = str2.split('/');
  if (arr2.every((item, index) => item === arr1[index])) {
    return 1;
  } else if (arr1.every((item, index) => item === arr2[index])) {
    return 2;
  }
  return 3;
}

function getRenderArr (routes) {
  let renderArr = [];
  renderArr.push(routes[0]);
  for (let i = 1; i < routes.length; i += 1) {
    let isAdd = false;
    // 是否包含
    isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3);
    // 去重
    renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1);
    if (isAdd) {
      renderArr.push(routes[i]);
    }
  }
  return renderArr;
}

/**
 * Get router routing configuration
 * { path:{name,...param}}=>Array<{name,path ...param}>
 * @param {string} path
 * @param {routerData} routerData
 */
export function getRoutes (path, routerData) {
  let routes = Object.keys(routerData).filter(
    routePath => routePath.indexOf(path) === 0 && routePath !== path
  );
  // Replace path to '' eg. path='user' /user/name => name
  routes = routes.map(item => item.replace(path, ''));
  // Get the route to be rendered to remove the deep rendering
  const renderArr = getRenderArr(routes);
  // Conversion and stitching parameters
  const renderRoutes = renderArr.map(item => {
    const exact = !routes.some(route => route !== item && getRelation(route, item) === 1);
    return {
      exact,
      ...routerData[`${path}${item}`],
      key: `${path}${item}`,
      path: `${path}${item}`,
    };
  });
  return renderRoutes;
}

export function getPageQuery () {
  return parse(window.location.href.split('?')[1]);
  // const arr = window.location.href.split('?')
  // return parse(arr[arr.length - 1]);
}

export function getQueryPath (path = '', query = {}) {
  const search = stringify(query);
  if (search.length) {
    return `${path}?${search}`;
  }
  return path;
}

/* eslint no-useless-escape:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/g;

export function isUrl (path) {
  return reg.test(path);
}

export function formatWan (val) {
  const v = val * 1;
  if (!v || isNaN(v)) return '';

  let result = val;
  if (val > 10000) {
    result = Math.floor(val / 10000);
    result = (
      <span>
        {result}
        <span
          styles={{
            position: 'relative',
            top: -2,
            fontSize: 14,
            fontStyle: 'normal',
            lineHeight: 20,
            marginLeft: 2,
          }}
        >
          万
        </span>
      </span>
    );
  }
  return result;
}
// AES加密
// http://jser.io/2014/08/19/how-to-use-aes-in-crypto-js-to-encrypt-and-decrypt
// https://github.com/brix/crypto-js
export function aesEncrypt (password, key = 'Bar12345Bar87690', iv = 'RandomInitVector') {
  const C = CryptoJS;
  const ciphertext = C.AES.encrypt(password, C.enc.Utf8.parse(key), {
    mode: C.mode.CBC,
    padding: C.pad.Pkcs7,
    iv: C.enc.Utf8.parse(iv),
  });
  return ciphertext.toString();
}

/**
 * 是否是数组
 * @param {Any} value 要判断的变量
 * @return {Boolean} true是数组，false不是数组
 */
export function isArray (value) {
  return Object.prototype.toString.call(value) === '[object Array]';
}

/**
 * 是否是对象
 * @param {Any} value 要判断的变量
 * @return {Boolean} true是对象，false不是对象
 */
export function isObject (value) {
  return Object.prototype.toString.call(value) === '[object Object]';
}

/**
 * 是否是函数
 * @param {Any} value 要判断的变量
 * @return {Boolean} true是函数，false不是函数
 */
export function isFunction (value) {
  return Object.prototype.toString.call(value) === '[object Function]';
}

/**
 * 是否是字符串
 * @param {Any} value 要判断的变量
 * @return {Boolean} true是字符串，false不是字符串
 */
export function isString (value) {
  return Object.prototype.toString.call(value) === '[object String]';
}

/**
 * 是否是移动端
 * @return {Boolean} true是移动端，false不是移动端
 */
export function isMobile () {
  return /Android|iPhone|SymbianOS|Windows Phone|iPad|iPod/.test(window.navigator.userAgent);
}

/**
 * 是否是除了ipad以外的移动端
 * @return {Boolean} true是移动端，false不是移动端
 */
export function isMobileExcludeIpad () {
  return /Android|iPhone|SymbianOS|Windows Phone|iPod/.test(window.navigator.userAgent);
}

/**
 * 是否是ios
 * @return {Boolean} true是ios，false不是ios
 */
export function isIOS () {
  return /iPhone|iPad|iPod/.test(window.navigator.userAgent);
}

/**
 * 是否是android
 * @return {Boolean} true是android，false不是android
 */
export function isAndroid () {
  return /Android/.test(window.navigator.userAgent);
}

/**
 * dispatch转换函数
 */
export function mapMutations (instance, { namespace, types }) {
  const { dispatch } = instance.props;
  if (isObject(types)) {
    for (const [key, value] of Object.entries(types)) {
      instance[key] = (payload, callback, ...restProps) => {
        dispatch({
          type: `${namespace}/${value}`,
          payload,
          callback,
          ...restProps,
        });
      };
    }
  } else if (isArray(types)) {
    for (const type of types) {
      instance[type] = (payload, callback, ...restProps) => {
        dispatch({
          type: `${namespace}/${type}`,
          payload,
          callback,
          ...restProps,
        });
      };
    }
  }
}

/**
 * 返回列表中第一个视频
 * @param {Array} tree
 */
export function findFirstVideo (tree) {
  // type不存在为视频
  if (tree.length === 0) return {};
  const first = tree[0];
  if (!first.type) {
    return first;
  } else if (first.list && first.list.length > 0) {
    return findFirstVideo(first.list);
  }
}

/**
 * 生成枚举类型
 */
export function generateEnum (obj) {
  return Object.entries(obj).reduce((result, [key, value]) => {
    result[(result[key] = value)] = key;
    return result;
  }, {});
}

/**
 * 获取映射字段
 */
export function getMappedFields (values, fieldNames) {
  return Object.entries(fieldNames).reduce((result, [key, value]) => {
    if (typeof value === 'function') {
      result = { ...result, ...value(values) };
    } else {
      result[value] = values[key];
    }
    return result;
  }, {});
}

/**
 * 获取分页数量
 */
export function getPageSize () {
  return JSON.parse(localStorage.getItem('PAGE_SIZE') || '10');
}

/**
 * 设置分页数量
 */
export function setPageSize (pageSize) {
  localStorage.setItem('PAGE_SIZE', JSON.stringify(pageSize));
}

/**
 * 获取modal中分页数量
 */
export function getModalPageSize () {
  return JSON.parse(localStorage.getItem('MODAL_PAGE_SIZE') || '5');
}

/**
 * 设置modal中分页数量
 */
export function setModalPageSize (pageSize) {
  localStorage.setItem('MODAL_PAGE_SIZE', JSON.stringify(pageSize));
}

/**
 * 判断是否为数值类型
 */
export function isNumber (value) {
  return !Number.isNaN(Number.parseFloat(value));
}

/**
 * 保留2位有效数字
 */

export function toFixed (value, digit = 2) {
  return Number.parseFloat(value.toFixed(digit));
}

export function genGoBack (props, path) {
  return function () {
    const { match: { params: { id } } } = props;
    if (id) // 详情或编辑
      window.close();
    else // 新增
      router.push(path);
  };
}

export function round (num, x = 0) { return Number(`${Math.round(`${num}e${x}`)}e-${x}`) }
