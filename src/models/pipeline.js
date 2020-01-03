import { getMediumList, getList, getDetail, add, edit, remove } from '@/services/pipeline';

const item = {
  id: 1,
  monitorEquipmentCount: 1,
  companyId: 'DccBRhlrSiu9gMV7fmvizw',
  companyName: '无锡晶安智慧科技有限公司',
  time: '2020-01-03',
  unifiedCode: '1',
  name: '1',
  number: '1',
  ability: '1',
  length: '1',
  material: '1',
  method: '1',
  isPress: '1',
  status: '0',
  isRisk: '1',
  pressLevel: '1',
  press: '1',
  medium: {
    id: 'cb8ehg6tbnx4b7ks',
    remarks: null,
    companyId: 'DccBRhlrSiu9gMV7fmvizw',
    type: '1',
    unifiedCode: 'WL201089789',
    dangerChemcataSn: '11',
    materialForm: '3',
    superviseChemicals: '0',
    msds: '0_box871unc17u_d',
    annualConsumption: null,
    annualConsumptionUnit: null,
    maxStoreDay: null,
    maxStoreDayUnit: null,
    actualReserves: '2',
    actualReservesUnit: 't',
    annualThroughput: '21',
    annualThroughputUnit: 't',
    reservesLocation: '存储场所测试',
    highRiskStorefacil: '0',
    majorHazard: null,
    dangerId: null,
    technologyId: null,
    keySupervisionProcess: '1',
    keySupervision: '4',
    highRiskChemicals: '1',
    highlyToxicChem: '0',
    safetyMeasures:
      '物料安全措施测试一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十',
    emergencyMeasure:
      '物料应急处置措施测试一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十一二三四五六七八九十',
    easyMakePoison: '0',
    easyMakeExplode: '0',
    companyName: '无锡晶安智慧科技有限公司',
    gridIdList: null,
    chineName: '3,4-二甲苯酚',
    casNo: '95-65-8',
    riskCateg: '0',
    dangerSources: null,
    middelDangerTechnologies: null,
    finalDangerTechnologies: [
      {
        id: 'mtsyx15cv28bb7e8',
        remarks: null,
        companyId: 'DccBRhlrSiu9gMV7fmvizw',
        unifiedCode: '12111541',
        processName: '工艺12111541',
        reactionType: '撒旦撒',
        middleId: 'wwffddgdgdg',
        finalId: 'wwffddgdgdg',
        keyMonitoringUnit: '撒打算',
        dangerousCharacter: '阿斯顿撒旦',
        basicControlRequire: '啊啊啊',
        iskeySupervisionProcess: '1',
        keySupervisionProcess: '0',
        operationNumber: '12',
        certificatesNum: '11',
        technicalSource: '鬼地方高浮雕发',
        designUnit: '反反复复',
        processBrief: '飒飒打撒',
        qualificationGrade: '都是对的',
        autoControl: '对的对的',
        sis: '的地方',
        sisLevel: '1',
        qualifGradeDescription: '阿斯顿撒',
        safetyValve: '啊是大飒飒',
        flowChartControlPoint: 'hwnw4p8owmgee7z1',
        equipmentList: '',
        equipmentLayout: '',
        companyName: null,
        gridIdList: null,
        flowChartControlPointDetails: null,
        equipmentListDetails: null,
        equipmentLayoutDetails: null,
        middleList: null,
        finalList: null,
      },
      {
        id: 'ucehw72cz_r9idne',
        remarks: null,
        companyId: 'ceo6b51w869ueie2',
        unifiedCode: '12121356',
        processName: '阿松大12121356',
        reactionType: '撒旦撒',
        middleId: 'qcxh0x5paiucfhnn',
        finalId: 'qcxh0x5paiucfhnn',
        keyMonitoringUnit: '阿斯顿撒',
        dangerousCharacter: '撒打算',
        basicControlRequire: '阿斯顿撒',
        iskeySupervisionProcess: '1',
        keySupervisionProcess: '0',
        operationNumber: '123',
        certificatesNum: '122',
        technicalSource: '阿松大',
        designUnit: '阿斯顿撒',
        processBrief: '阿斯顿撒',
        qualificationGrade: '啊实打实',
        autoControl: '啊实打实',
        sis: '啊实打实的',
        sisLevel: '4',
        qualifGradeDescription: '阿斯顿撒啊',
        safetyValve: '啊实打实水水',
        flowChartControlPoint: '',
        equipmentList: '',
        equipmentLayout: '',
        companyName: null,
        gridIdList: null,
        flowChartControlPointDetails: null,
        equipmentListDetails: null,
        equipmentLayoutDetails: null,
        middleList: null,
        finalList: null,
      },
    ],
  },
};

export default {
  namespace: 'pipeline',

  state: {
    list: {},
    detail: {},
    mediumList: {},
  },

  effects: {
    // 获取介质列表
    *getMediumList({ payload, callback }, { call, put }) {
      const response = yield call(getMediumList, payload);
      const { code, data, msg } = response || {};
      if (code === 200 && data && data.list) {
        const mediumList = data;
        yield put({
          type: 'save',
          payload: {
            mediumList,
          },
        });
        callback && callback(true, mediumList);
      } else {
        callback && callback(false, msg);
      }
    },
    // 获取列表
    *getList({ payload, callback }, { call, put }) {
      // const response = yield call(getList, payload);
      console.log(payload);
      const response = {
        code: 200,
        data: {
          list: [item],
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
      console.log(payload);
      const response = {
        code: 200,
        data: item,
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
    // 新增
    *add({ payload, callback }, { call }) {
      // const response = yield call(add, payload);
      console.log(payload);
      const response = { code: 200 };
      const { code, msg } = response || {};
      callback && callback(code === 200, msg);
    },
    // 编辑
    *edit({ payload, callback }, { call }) {
      // const response = yield call(edit, payload);
      console.log(payload);
      const response = { code: 200 };
      const { code, msg } = response || {};
      callback && callback(code === 200, msg);
    },
    // 删除
    *remove({ payload, callback }, { call }) {
      // const response = yield call(remove, payload);
      console.log(payload);
      const response = { code: 200 };
      const { code, msg } = response || {};
      callback && callback(code === 200, msg);
    },
  },

  reducers: {
    save: (state, { payload }) => ({ ...state, ...payload }),
  },
};
