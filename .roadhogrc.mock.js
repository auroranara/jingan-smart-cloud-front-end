import mockjs from 'mockjs';
import { getRule, postRule } from './mock/rule';
import { getActivities, getNotice, getFakeList, postFakeList, getFakeCaptcha } from './mock/api';
import { getFakeChartData } from './mock/chart';
import { getProfileBasicData } from './mock/profile';
import { getProfileAdvancedData } from './mock/profile';
import { getNotices } from './mock/notices';
<<<<<<< HEAD
=======
import { format, delay } from 'roadhog-api-doc';
>>>>>>> init
import { getProvince, getCity } from './mock/geographic';

import { deviceResponse, deviceDetailResponse } from './mock/transmission';

// 是否禁用代理
const noProxy = process.env.NO_PROXY === 'true';
const hosts = {
  mock: '118.126.110.115:3001/mock/28',
  lm: '192.168.10.2', // 吕旻
  gjm: '192.168.10.55', // 顾家铭
  szq: '192.168.10.56', //孙启政
  test: '192.168.10.67:9080', // 内网
};

// 代码中会兼容本地 service mock 以及部署站点的静态数据
const initProxy = key => {
  const host = hosts[key];
  return {
    // 支持值为 Object 和 Array
    'GET /acloud_new/v2/(.*)': `http://${host}/acloud_new/v2/`,
    'POST /acloud_new/v2/(.*)': `http://${host}/acloud_new/v2/`,
    'PUT /acloud_new/v2/(.*)': `http://${host}/acloud_new/v2/`,
    'DELETE /acloud_new/v2/(.*)': `http://${host}/acloud_new/v2/`,

  'GET /acloud_new/v2/(.*)': 'http://118.126.110.115:3001/mock/28/acloud_new/v2/',
  'POST /acloud_new/v2/(.*)': 'http://118.126.110.115:3001/mock/28/acloud_new/v2/',
  'PUT /acloud_new/v2/(.*)': 'http://118.126.110.115:3001/mock/28/acloud_new/v2/',
  'DELETE /acloud_new/v2/(.*)': 'http://118.126.110.115:3001/mock/28/acloud_new/v2/',

  // 'GET /acloud_new/v2/(.*)': 'http://192.168.10.56/acloud_new/v2/',
  // 'POST /acloud_new/v2/(.*)': 'http://192.168.10.56/acloud_new/v2/',
  // 'PUT /acloud_new/v2/(.*)': 'http://192.168.10.56/acloud_new/v2/',
  // 'DELETE /acloud_new/v2/(.*)': 'http://192.168.10.56/acloud_new/v2/',

  // 吕旻
  // 'GET /acloud_new/v2/(.*)': 'http://192.168.10.2/acloud_new/v2/',
  // 'POST /acloud_new/v2/(.*)': 'http://192.168.10.2/acloud_new/v2/',
  // 'PUT /acloud_new/v2/(.*)': 'http://192.168.10.2/acloud_new/v2/',
  // 'DELETE /acloud_new/v2/(.*)': 'http://192.168.10.2/acloud_new/v2/',

  // 'GET /acloud_new/v2/(.*)': 'http://192.168.10.55/acloud_new/v2/',
  // 'POST /acloud_new/v2/(.*)': 'http://192.168.10.55/acloud_new/v2/',
  // 'PUT /acloud_new/v2/(.*)': 'http://192.168.10.55/acloud_new/v2/',
  // 'DELETE /acloud_new/v2/(.*)': 'http://192.168.10.55/acloud_new/v2/',

  'GET /api/currentUser': {
    $desc: '获取当前用户接口',
    $params: {
      pageSize: {
        desc: '分页',
        exp: 2,
      },
      {
        key: '2',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
      },
      {
        key: '3',
        name: 'Joe Black',
        age: 32,
        address: 'Sidney No. 1 Lake Park',
      },
    ],
    'GET /api/project/notice': getNotice,
    'GET /api/activities': getActivities,
    'GET /api/rule': getRule,
    'POST /api/rule': {
      $params: {
        pageSize: {
          desc: '分页',
          exp: 2,
        },
      },
      $body: postRule,
    },
    'POST /api/forms': (req, res) => {
      res.send({ message: 'Ok' });
    },
    'GET /api/tags': mockjs.mock({
      'list|100': [{ name: '@city', 'value|1-100': 150, 'type|0-2': 1 }],
    }),
    'GET /api/fake_list': getFakeList,
    'POST /api/fake_list': postFakeList,
    'GET /api/transmission_device_list': deviceResponse,
    'GET /api/transmission_device_detail': deviceDetailResponse,
    'GET /api/fake_chart_data': getFakeChartData,
    'GET /api/profile/basic': getProfileBasicData,
    'GET /api/profile/advanced': getProfileAdvancedData,
    'POST /api/login/account': (req, res) => {
      const { password, userName, type } = req.body;
      if (password === '888888' && userName === 'admin') {
        res.send({
          status: 'ok',
          type,
          currentAuthority: 'admin',
        });
        return;
      }
      if (password === '123456' && userName === 'user') {
        res.send({
          status: 'ok',
          type,
          currentAuthority: 'user',
        });
        return;
      }
      res.send({
        status: 'error',
        type,
        currentAuthority: 'guest',
      });
    },
    'POST /api/register': (req, res) => {
      res.send({ status: 'ok', currentAuthority: 'user' });
    },
    'GET /api/notices': getNotices,
    'GET /api/500': (req, res) => {
      res.status(500).send({
        timestamp: 1513932555104,
        status: 500,
        error: 'error',
        message: 'error',
        path: '/base/category/list',
      });
    },
    'GET /api/404': (req, res) => {
      res.status(404).send({
        timestamp: 1513932643431,
        status: 404,
        error: 'Not Found',
        message: 'No message available',
        path: '/base/category/list/2121212',
      });
    },
    'GET /api/403': (req, res) => {
      res.status(403).send({
        timestamp: 1513932555104,
        status: 403,
        error: 'Unauthorized',
        message: 'Unauthorized',
        path: '/base/category/list',
      });
    },
    'GET /api/401': (req, res) => {
      res.status(401).send({
        timestamp: 1513932555104,
        status: 401,
        error: 'Unauthorized',
        message: 'Unauthorized',
        path: '/base/category/list',
      });
    },
    'GET /api/geographic/province': getProvince,
    'GET /api/geographic/city/:province': getCity,
    'GET /api/captcha': getFakeCaptcha,
  };
};

const hosts = {
  lm: '192.168.10.2', // 吕旻
  gjm: '192.168.10.55', // 顾家铭
  sqz: '192.168.10.56', //孙启政
  test: '192.168.10.67:9080', // 内网
};

const key = 'sqz';
// const key = 'test';

export default (noProxy ? {} : delay(initProxy(key), 1000));
