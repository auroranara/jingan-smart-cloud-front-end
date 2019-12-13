import {
  getList,
  getDetail,
  getDeviceDetail,
  getMonitorTrend,
} from '@/services/alarmWorkOrder';
import fileDownload from 'js-file-download';
import moment from 'moment';

export default {
  namespace: 'alarmWorkOrder',

  state: {
    list: {},
    detail: {},
    deviceDetail: {},
    monitorTrend: [],
  },

  effects: {
    // 获取列表
    *getList({ payload, callback }, { call, put }) {
      // const response = yield call(getList, payload);
      const response = {
        code: 200,
        data: {
          list: [
            {
              id: 1,
              companyName: '无锡晶安智慧科技有限公司',
              monitorTypeName: '可燃气体监测',
              monitorEquipmentName: '科力安可燃气体88',
              areaLocation: '7号罐附近',
              monitorObject: '甲烷罐区',
              status: 1,
              isReal: 1,
              elapsedTime: 60,
              elapsedTimeUnit: 'min',
              fileList: [{ webUrl: 'http://data.jingan-china.cn/hello/gsafe/hidden_danger/191028-150401-1zdg.png' }],
              description: '罐区存在安全隐患',
              count: 3,
              createTime: '2019-12-13 08:55:49',
            },
          ],
          pagination: {
            total: 1,
            ...payload,
          },
        },
      };
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const list = data;
        yield put({
          type: 'save',
          payload: {
            list,
          },
        });
        callback && callback(true, list);
      } else {
        callback && callback(false, msg);
      }
    },
    // 获取详情
    *getDetail({ payload, callback }, { call, put }) {
      // const response = yield call(getDetail, payload);
      const response = {
        code: 200,
        data:
          {
            id: 1,
            companyName: '无锡晶安智慧科技有限公司',
            monitorTypeName: '可燃气体监测',
            monitorEquipmentName: '科力安可燃气体88',
            areaLocation: '7号罐附近',
            monitorObject: '甲烷罐区',
            status: 1,
            isReal: 1,
            elapsedTime: 60,
            elapsedTimeUnit: 'min',
            createTime: '2019-12-13 08:55:49',
            fileList: [{ webUrl: 'http://data.jingan-china.cn/hello/gsafe/hidden_danger/191028-150401-1zdg.png' }],
            description: '罐区存在安全隐患',
            // videoList: [
            //       {
            //           "device_id":"111",
            //           "company_id":"DccBRhlrSiu9gMV7fmvizw",
            //           "inherit_nvr":0,
            //           "key_id":"111",
            //           "rtsp_address":"111",
            //           "isInspection":"0",
            //           "photo":"deviceId[111]keyId[111]非法，不能为空/有空格/中文",
            //           "nvr":"ndll4s4uy537rv1m",
            //           "x_fire":"0.751",
            //           "fix_img_id":"vpawiw6avqvvkebn",
            //           "plug_flow_equipment":"",
            //           "company_name":"无锡晶安智慧科技有限公司",
            //           "name":"111111",
            //           "y_fire":"0.816",
            //           "fix_fire_id":"eua17823vls7wwf3",
            //           "connect_type":1,
            //           "id":"xcb82x3lww8ls7ed",
            //           "create_date":1564536937853,
            //           "status":1,
            //       },
            //       {
            //           "device_id":"12313",
            //           "company_id":"DccBRhlrSiu9gMV7fmvizw",
            //           "key_id":"21312",
            //           "company_name":"无锡晶安智慧科技有限公司",
            //           "name":"312",
            //           "isInspection":"0",
            //           "photo":"deviceId[12313]keyId[21312]非法，不能为空/有空格/中文",
            //           "fix_fire_id":"eua17823vls7wwf3",
            //           "id":"a8s9gh29dks2l8hc",
            //           "create_date":1562035589380,
            //           "status":1,
            //           "fix_img_id":"vpawiw6avqvvkebn",
            //       },
            //       {
            //           "building_id":"bgax388wd7eucs77",
            //           "building_name":"乙磷铝厂房",
            //           "device_id":"12er_11",
            //           "company_id":"DccBRhlrSiu9gMV7fmvizw",
            //           "key_id":"12er_11",
            //           "rtsp_address":"32423",
            //           "isInspection":"1",
            //           "photo":"推流设备没有登记到系统中[12er_11]",
            //           "x_fire":"0.273",
            //           "y_num":"0.720",
            //           "company_name":"无锡晶安智慧科技有限公司",
            //           "name":"1213",
            //           "x_num":"0.748",
            //           "y_fire":"0.929",
            //           "fix_fire_id":"eua17823vls7wwf3",
            //           "id":"0Vgal9GcR5W63fiYnCJo2w",
            //           "create_date":1539054319470,
            //           "status":1,
            //       },
            //       {
            //           "device_id":"1qw_123",
            //           "company_id":"DccBRhlrSiu9gMV7fmvizw",
            //           "key_id":"1qw_123",
            //           "rtsp_address":"234532",
            //           "isInspection":"1",
            //           "photo":"推流设备没有登记到系统中[1qw_123]",
            //           "fix_img_id":"vpawiw6avqvvkebn",
            //           "y_num":"0.936",
            //           "company_name":"无锡晶安智慧科技有限公司",
            //           "name":"12",
            //           "x_num":"0.302",
            //           "id":"LfnLcUceTiyIlXgQiTbowQ",
            //           "create_date":1539054572897,
            //           "status":1,
            //       },
            //       {
            //           "building_id":"o_daq93fqgfotow5",
            //           "building_name":"储罐区1号楼",
            //           "device_id":"1qw_123",
            //           "company_id":"DccBRhlrSiu9gMV7fmvizw",
            //           "key_id":"1qw_123",
            //           "rtsp_address":"42342",
            //           "isInspection":"1",
            //           "fix_img_id":"esiMnDiBSQKY2Hfmy8FWww",
            //           "floor_name":"2层",
            //           "y_num":"0.836",
            //           "company_name":"无锡晶安智慧科技有限公司",
            //           "name":"12314",
            //           "x_num":"0.406",
            //           "floor_id":"lhcxau5mhfs3pzr2",
            //           "id":"Is_Z_1oAS9io3E2Q4CiNtQ",
            //           "create_date":1539054529910,
            //           "status":1,
            //       },
            //       {
            //           "device_id":"23_111d",
            //           "company_id":"DccBRhlrSiu9gMV7fmvizw",
            //           "key_id":"23_111d",
            //           "photo_address":"2423",
            //           "rtsp_address":"23423",
            //           "isInspection":"0",
            //           "x_fire":"0.453",
            //           "fix_img_id":"vpawiw6avqvvkebn",
            //           "y_num":"0.406",
            //           "company_name":"无锡晶安智慧科技有限公司",
            //           "name":"32234",
            //           "x_num":"0.744",
            //           "y_fire":"0.573",
            //           "fix_fire_id":"cnk6sx9btntapeaz",
            //           "id":"urcgz32s7_e6zirn",
            //           "create_date":1547447668817,
            //           "status":1,
            //       },
            //       {
            //           "device_id":"433_111s",
            //           "company_id":"DccBRhlrSiu9gMV7fmvizw",
            //           "key_id":"433_111s",
            //           "photo_address":"23423",
            //           "rtsp_address":"23423",
            //           "isInspection":"0",
            //           "fix_img_id":"luq7ph_iueoxqlz9",
            //           "y_num":"0.613",
            //           "company_name":"无锡晶安智慧科技有限公司",
            //           "name":"2342",
            //           "x_num":"0.855",
            //           "id":"ys4b8_4x8urzshby",
            //           "create_date":1547195925687,
            //           "status":1,
            //       },
            //       {
            //           "building_id":"bgax388wd7eucs77",
            //           "building_name":"乙磷铝厂房",
            //           "device_id":"5678",
            //           "company_id":"DccBRhlrSiu9gMV7fmvizw",
            //           "inherit_nvr":1,
            //           "key_id":"56789",
            //           "photo_address":"http:www.baidu1.com",
            //           "rtsp_address":"http:www.baidu.com",
            //           "isInspection":"0",
            //           "nvr":"",
            //           "floor_name":"1",
            //           "plug_flow_equipment":"807wa51nvd_reb1m",
            //           "company_name":"无锡晶安智慧科技有限公司",
            //           "name":"测试视频A",
            //           "floor_id":"wx96c_1gup_hwch7",
            //           "connect_type":1,
            //           "id":"aur14x1dw_sylo_v",
            //           "status":1,
            //       },
            //       {
            //           "device_id":"678",
            //           "company_id":"DccBRhlrSiu9gMV7fmvizw",
            //           "inherit_nvr":0,
            //           "key_id":"6786",
            //           "photo_address":"6867",
            //           "rtsp_address":"86786",
            //           "isInspection":"0",
            //           "nvr":"ndll4s4uy537rv1m",
            //           "x_fire":"0.651",
            //           "fix_img_id":"vpawiw6avqvvkebn",
            //           "y_num":"0.666",
            //           "plug_flow_equipment":"",
            //           "company_name":"无锡晶安智慧科技有限公司",
            //           "name":"8678678",
            //           "x_num":"0.828",
            //           "y_fire":"0.729",
            //           "fix_fire_id":"eua17823vls7wwf3",
            //           "connect_type":1,
            //           "id":"w79jr791rf85_63v",
            //           "create_date":1564537077240,
            //           "status":1,
            //       },
            //       {
            //           "device_id":"7897",
            //           "company_id":"DccBRhlrSiu9gMV7fmvizw",
            //           "key_id":"7897",
            //           "photo_address":"78978",
            //           "rtsp_address":"78976",
            //           "isInspection":"0",
            //           "fix_img_id":"vpawiw6avqvvkebn",
            //           "company_name":"无锡晶安智慧科技有限公司",
            //           "name":"9789",
            //           "fix_fire_id":"eua17823vls7wwf3",
            //           "id":"i0hexh30xspo1wxp",
            //           "create_date":1564536742577,
            //           "status":1,
            //       },
            //       {
            //           "device_id":"ee45_44",
            //           "company_id":"DccBRhlrSiu9gMV7fmvizw",
            //           "key_id":"ee45_44",
            //           "photo_address":"ee45_44",
            //           "rtsp_address":"ee45_44",
            //           "isInspection":"0",
            //           "fix_img_id":"lcZk9TXhTJSZBndHzd2LDQ",
            //           "y_num":"0.531",
            //           "company_name":"无锡晶安智慧科技有限公司",
            //           "name":"ee45_44",
            //           "x_num":"0.406",
            //           "id":"pvn32h7xc73m4mva",
            //           "create_date":1540448813403,
            //           "status":1,
            //       },
            //       {
            //           "building_id":"o_daq93fqgfotow5",
            //           "building_name":"储罐区1号楼",
            //           "device_id":"jingan_zhihui",
            //           "company_id":"DccBRhlrSiu9gMV7fmvizw",
            //           "key_id":"240ch233_f1",
            //           "photo_address":"",
            //           "rtsp_address":"rtsp://admin:12345@192.168.16.249:554/h264/ch6/sub/av_stream",
            //           "isInspection":"1",
            //           "x_fire":"0.513",
            //           "fix_img_id":"vpawiw6avqvvkebn",
            //           "floor_name":"1层",
            //           "y_num":"0.360",
            //           "company_name":"无锡晶安智慧科技有限公司",
            //           "name":"1",
            //           "x_num":"0.349",
            //           "y_fire":"0.554",
            //           "fix_fire_id":"eua17823vls7wwf3",
            //           "floor_id":"ernuei68db6pad8c",
            //           "id":"H_X8GPOHT_2mlG71kblk1w",
            //           "create_date":1537943399197,
            //           "status":1,
            //       },
            //       {
            //           "device_id":"jingan_zhihui",
            //           "company_id":"DccBRhlrSiu9gMV7fmvizw",
            //           "key_id":"faceCamera",
            //           "rtsp_address":"rtsp://admin:jingan123@192.168.10.98:554/Streaming/Channels/101?transportmode=unicast",
            //           "company_name":"无锡晶安智慧科技有限公司",
            //           "name":"人脸相机",
            //           "x_num":"",
            //           "isInspection":"0",
            //           "id":"963tum37gy3pgl4q",
            //           "create_date":1567490921020,
            //           "status":1,
            //       },
            //   ],
          },
      };
      const { code, data, msg } = response || {};
      if (code === 200 && data) {
        const detail = data;
        yield put({
          type: 'save',
          payload: {
            detail,
          },
        });
        callback && callback(true, detail);
      } else {
        callback && callback(false, msg);
      }
    },
    // 获取详情
    *getDeviceDetail({ payload, callback }, { call, put }) {
      // const response = yield call(getDeviceDetail, payload);
      const response = {
        code: 200,
        data:
          {
            id: 1,
            companyName: '无锡晶安智慧科技有限公司',
            monitorTypeName: '可燃气体监测',
            monitorEquipmentName: '科力安可燃气体88',
            areaLocation: '7号罐附近',
            monitorObject: '甲烷罐区',
            status: 1,
            isReal: 1,
            elapsedTime: 60,
            elapsedTimeUnit: 'min',
            createTime: '2019-12-13 08:55:49',
            fileList: [{ webUrl: 'http://data.jingan-china.cn/hello/gsafe/hidden_danger/191028-150401-1zdg.png' }],
            description: '罐区存在安全隐患',
          },
      };
      const { code, data, msg } = response || {};
      if (code === 200 && data) {
        const deviceDetail = data;
        yield put({
          type: 'save',
          payload: {
            deviceDetail,
          },
        });
        callback && callback(true, deviceDetail);
      } else {
        callback && callback(false, msg);
      }
    },
    // 获取监测趋势
    *getMonitorTrend({ payload, callback }, { call, put }) {
      // const response = yield call(getMonitorTrend, payload);
      const response = {
        code: 200,
        data: {
          list: [
            {
              id: '1',
              name: '可燃气体浓度',
              unit: '%LEL',
              normalUpper: 15,
              largeUpper: 25,
              maxValue: 100,
              minValue: 0,
              history: [
                {
                  time: +moment('2019-12-13 00:00:00'),
                  value: Math.floor(Math.random() * 15),
                },
                {
                  time: +moment('2019-12-13 00:20:00') + Math.floor(Math.random() * 1200000),
                  value: Math.floor(Math.random() * 15),
                },
                {
                  time: +moment('2019-12-13 00:50:00') + Math.floor(Math.random() * 1200000),
                  value: Math.floor(Math.random() * 15),
                },
                {
                  time: +moment('2019-12-13 01:20:00') + Math.floor(Math.random() * 1200000),
                  value: Math.floor(Math.random() * 15),
                },
                {
                  time: +moment('2019-12-13 01:50:00') + Math.floor(Math.random() * 1200000),
                  value: Math.floor(Math.random() * 15),
                },
                {
                  time: +moment('2019-12-13 02:20:00') + Math.floor(Math.random() * 1200000),
                  value: Math.floor(Math.random() * 15),
                },
                {
                  time: +moment('2019-12-13 02:50:00') + Math.floor(Math.random() * 1200000),
                  value: Math.floor(Math.random() * 15),
                },
                {
                  time: +moment('2019-12-13 03:20:00') + Math.floor(Math.random() * 1200000),
                  value: Math.floor(Math.random() * 15),
                },
                {
                  time: +moment('2019-12-13 03:50:00') + Math.floor(Math.random() * 1200000),
                  value: Math.floor(Math.random() * 15),
                },
                {
                  time: +moment('2019-12-13 04:20:00') + Math.floor(Math.random() * 1200000),
                  value: Math.floor(Math.random() * 15),
                },
                {
                  time: +moment('2019-12-13 04:50:00') + Math.floor(Math.random() * 1200000),
                  value: Math.floor(Math.random() * 15),
                },
                {
                  time: +moment('2019-12-13 05:20:00') + Math.floor(Math.random() * 1200000),
                  value: Math.floor(Math.random() * 15),
                },
                {
                  time: +moment('2019-12-13 05:50:00') + Math.floor(Math.random() * 1200000),
                  value: Math.floor(Math.random() * 15),
                },
                {
                  time: +moment('2019-12-13 06:20:00') + Math.floor(Math.random() * 1200000),
                  value: Math.floor(Math.random() * 15),
                },
                {
                  time: +moment('2019-12-13 06:50:00') + Math.floor(Math.random() * 1200000),
                  value: Math.floor(Math.random() * 15),
                },
                {
                  time: +moment('2019-12-13 08:11:11'),
                  value: 24,
                },
                {
                  time: +moment('2019-12-13 08:50:00') + Math.floor(Math.random() * 1200000),
                  value: 16 + Math.floor(Math.random() * 9),
                },
                {
                  time: +moment('2019-12-13 09:20:00') + Math.floor(Math.random() * 1200000),
                  value: 16 + Math.floor(Math.random() * 9),
                },
                {
                  time: +moment('2019-12-13 09:50:00') + Math.floor(Math.random() * 1200000),
                  value: 16 + Math.floor(Math.random() * 9),
                },
                {
                  time: +moment('2019-12-13 10:20:00') + Math.floor(Math.random() * 1200000),
                  value: 16 + Math.floor(Math.random() * 9),
                },
                {
                  time: +moment('2019-12-13 10:50:00') + Math.floor(Math.random() * 1200000),
                  value: 16 + Math.floor(Math.random() * 9),
                },
                {
                  time: +moment('2019-12-13 11:20:00') + Math.floor(Math.random() * 1200000),
                  value: 16 + Math.floor(Math.random() * 9),
                },
                {
                  time: +moment('2019-12-13 11:50:00') + Math.floor(Math.random() * 1200000),
                  value: 16 + Math.floor(Math.random() * 9),
                },
              ],
            },
          ],
        },
      }
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const monitorTrend = data.list;
        yield put({
          type: 'save',
          payload: {
            monitorTrend,
          },
        });
        callback && callback(true, monitorTrend);
      } else {
        callback && callback(false, msg);
      }
    },
    // 导出
    *exportList({ payload }, { call }) {
      // const blob = yield call(exportList, payload);
      const blob = '';
      fileDownload(blob, `报警工单_${moment().format('YYYYMMDD')}.xlsx`);
    },
  },

  reducers: {
    save: (state, { payload }) => ({ ...state, ...payload }),
  },
}
