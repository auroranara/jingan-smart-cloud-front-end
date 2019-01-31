import {
  // 获取系统配置列表
  fetchSystemConfiguration,
  // 添加系统配置
  addSystemConfiguration,
  // 编辑系统配置
  editSystemConfiguration,
  // 删除系统配置
  deleteSystemConfiguration,
  // 系统配置选择企业时获取企业列表
  fetchSysCompanies,
} from '../services/personnelPosition/systemConfiguration';
import {
  // 获取信标企业列表
  fetchBeaconCompanyList,
  // 获取信标列表
  fetchBeaconList,
  // 新增信标
  addBeacon,
  // 编辑信标
  editBeacon,
  // 删除信标
  deleteBeacon,
} from '../services/personnelPosition/beaconManagement';
import {
  // 获取标签列表
  fetchTagList,
  // 改变标签状态、领卡
  changeTag,
  // 获取未领卡人员列表
  fetchEmployees,
  // 新增标签卡
  addTag,
  // 编辑标签卡
  editTag,
  // 标签中获取企业列表
  fetchTagCompanies,
} from '../services/personnelPosition/tagManagement';
import {
  // 获取建筑列表
  fetchBuildings,
  // 获取楼层列表
  fetchFloors,
  // 获取地图企业列表
  fetchMapCompanies,
  // 获取地图列表
  fetchMaps,
  // 新增地图
  addMap,
  editMap,
  // 选择地图时获取地图列表
  fetchMapForSelect,
  // 获取地图详情
  fetchMapDetail,
  // 删除地图
  deleteMap,
} from '@/services/personnelPosition/mapManagement';
import { getCompanyList } from '@/services/examinationPaper.js';
import {
  // 区域公司列表
  selectAreaCompanys,
  // 区域树
  getTree,
  // 区域列表
  // areaInfoForPage,
  // 新增区域
  addArea,
  // 编辑区域
  editArea,
  // 删除区域
  deleteArea,
} from '../services/personnelPosition/sectionManagement';

function delEmptyChildren(tree) {
  tree.forEach(item => {
    if (item.hasOwnProperty('children')) {
      if (Array.isArray(item.children) && item.children.length) delEmptyChildren(item.children);
      else delete item.children;
    }
  });
}

export default {
  namespace: 'personnelPosition',
  state: {
    // 系统配置
    systemConfiguration: {
      list: [],     // 系统配置列表
      pagination: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
      },
      isLast: true, // 是否加载结束
    },
    // 信标管理
    beaconManagement: {
      list: [], // 信标企业列表
      pagination: {
        pageNum: 1,
        pageSize: 18,
        total: 0,
      },
      isLast: true,
      beaconList: [], // 信标列表
      beaconPagination: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
      beaconIsLast: true,
    },
    /* 标签管理 */
    tag: {
      list: [],
      pagination: {
        total: 0,
        pageNum: 1,
        pageSize: 10,
      },
      isLast: true,
      detail: {}, // 详情
      personnelList: [], // 持卡人
      searchInfo: {},
    },
    companyList: {
      // 企业列表
      list: [],
      pagination: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
    },
    // 标签-企业
    tagCompany: {
      list: [],
      pagination: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
    },
    map: {
      buildings: [], // 建筑列表
      floors: [], // 楼层列表
      mapCompanies: [], // 地图企业列表
      pagination: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
      isLast: true,
      maps: [],   // 地图列表
      mapPagination: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
      mapIsLast: true,
      detail: {},  // 地图详情
    },
    // 系统配置企业列表
    sysCompany: {
      // 企业列表
      list: [],
      pagination: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
    },
    // 选择地图获取的地图列表
    mapsForSelect: [],
    sectionManagement: {
      list: [],
      pagination: {
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
      isLast: true,
      sectionTree: [],
    },
  },
  effects: {
    // 获取系统配置列表
    *fetchSystemConfiguration({ payload, callback }, { call, put }) {
      const response = yield call(fetchSystemConfiguration, payload);
      if (response && response.code === 200) {
        yield put({
          type: 'saveSystemConfiguration',
          payload: response.data,
        });
        if (callback) callback(response.data.list);
      }
    },
    // 添加系统配置
    *addSystemConfiguration({ payload, success, error }, { call }) {
      const response = yield call(addSystemConfiguration, payload);
      if (response && response.code === 200) {
        if (success) success();
      } else if (error) error();
    },
    // 编辑系统配置
    *editSystemConfiguration({ payload, success, error }, { call }) {
      const response = yield call(editSystemConfiguration, payload);
      if (response && response.code === 200) {
        if (success) success();
      } else if (error) error();
    },
    // 删除系统配置
    *deleteSystemConfiguration({ payload, success, error }, { call }) {
      const response = yield call(deleteSystemConfiguration, payload);
      if (response && response.code === 200) {
        if (success) success();
      } else if (error) error();
    },
    // 获取企业列表
    *fetchCompanyList({ payload, callback }, { call, put }) {
      const response = yield call(getCompanyList, payload);
      if (response && response.code === 200) {
        yield put({
          type: 'saveCompanyList',
          payload: response.data,
        });
        if (callback) callback();
      }
    },
    // 获取信标企业列表
    *fetchBeaconCompanyList({ payload, callback }, { call, put }) {
      const response = yield call(fetchBeaconCompanyList, payload);
      if (response && response.code === 200) {
        yield put({
          type: 'saveBeaconCompanyList',
          payload: response.data,
        });
        if (callback) callback();
      }
    },
    // 获取信标列表
    *fetchBeaconList({ payload, callback }, { call, put }) {
      const response = yield call(fetchBeaconList, payload);
      if (response && response.code === 200) {
        yield put({
          type: 'saveBeaconList',
          payload: response.data,
        });
        if (callback) callback();
      }
    },
    // 新增信标
    *addBeacon({ payload, success, error }, { call }) {
      const response = yield call(addBeacon, payload);
      if (response && response.code === 200) {
        if (success) success();
      } else if (error) error(response.msg);
    },
    // 编辑信标
    *editBeacon({ payload, success, error }, { call }) {
      const response = yield call(editBeacon, payload);
      if (response && response.code === 200) {
        if (success) success();
      } else if (error) error(response.msg);
    },
    // 删除信标
    *deleteBeacon({ payload, success, error }, { call }) {
      const response = yield call(deleteBeacon, payload);
      if (response && response.code === 200) {
        if (success) success();
      } else if (error) error();
    },
    // 获取标签列表
    *fetchTagList({ payload }, { call, put }) {
      const response = yield call(fetchTagList, payload);
      if (response && response.code === 200) {
        yield put({
          type: 'saveTagLst',
          payload: response.data,
        });
      }
    },
    // 改变标签状态、领卡
    *changeTag({ payload, success, error }, { call }) {
      const response = yield call(changeTag, payload);
      if (response && response.code === 200) {
        if (success) success();
      } else if (error) error();
    },
    // 获取标签详情
    *fetchTagDetail({ payload, callback }, { call, put }) {
      const response = yield call(fetchTagList, payload);
      if (response && response.code === 200) {
        yield put({
          type: 'saveTagDetail',
          payload: response.data.list[0],
        });
        if (callback) callback(response.data.list[0]);
      }
    },
    // 获取未领卡人员列表
    *fetchEmployees({ payload, callback }, { call, put }) {
      const response = yield call(fetchEmployees, payload);
      if (response && response.code === 200) {
        yield put({
          type: 'saveEmployees',
          payload: response.data.list,
        });
        if (callback) callback(response.data.list);
      }
    },
    // 新增标签卡
    *addTag({ payload, success, error }, { call }) {
      const response = yield call(addTag, payload);
      if (response && response.code === 200) {
        if (success) success();
      } else if (error) error();
    },
    // 编辑标签卡
    *editTag({ payload, success, error }, { call }) {
      const response = yield call(editTag, payload);
      if (response && response.code === 200) {
        if (success) success();
      } else if (error) error();
    },
    // 获取建筑列表
    *fetchBuildings({ payload }, { call, put }) {
      const response = yield call(fetchBuildings, payload);
      if (response && response.code === 200) {
        yield put({
          type: 'saveBuildings',
          payload: response.data.list,
        });
      }
    },
    // 获取地图企业列表
    *fetchMapCompanies({ payload }, { call, put }) {
      const response = yield call(fetchMapCompanies, payload);
      if (response && response.code === 200) {
        yield put({
          type: 'saveMapCompanies',
          payload: response.data,
        });
      }
    },
    // 获取企业下的地图列表
    *fetchMaps({ payload, callback }, { call, put }) {
      const response = yield call(fetchMaps, payload);
      if (response && response.code === 200) {
        yield put({
          type: 'saveMaps',
          payload: response.data,
        });
        if (callback) callback(response.data.list)
      }
    },
    // 获取楼层列表
    *fetchFloors({ payload }, { call, put }) {
      const response = yield call(fetchFloors, payload);
      if (response && response.code === 200) {
        yield put({
          type: 'saveFloors',
          payload: response.data.list,
        });
      }
    },
    // 标签获取企业列表
    *fetchTagCompanies({ payload, callback }, { call, put }) {
      const response = yield call(fetchTagCompanies, payload);
      if (response && response.code === 200) {
        yield put({
          type: 'saveTagCompanies',
          payload: response.data,
        });
        if (callback) callback();
      }
    },
    // 系统配置选择企业时获取企业列表
    *fetchSysCompanies({ payload, callback }, { call, put }) {
      const response = yield call(fetchSysCompanies, payload);
      if (response && response.code === 200) {
        yield put({
          type: 'saveSysCompanies',
          payload: response.data,
        });
        if (callback) callback();
      }
    },
    // 区域公司列表
    *fetchAreaCompanys({ payload, success, error }, { call, put }) {
      const response = yield call(selectAreaCompanys, payload);
      if (response.code === 200) {
        yield put({
          type: 'selectAreaCompanys',
          payload: response.data,
        });
        if (success) {
          success(response.data);
        }
      } else if (error) {
        error();
      }
    },
    // 区域树
    *fetchAreaTree({ payload, success, error }, { call, put }) {
      const response = yield call(getTree, payload);
      if (response.code === 200) {
        yield put({
          type: 'getAreaTree',
          payload: response.data || { list: [] },
        });
        if (success) {
          success(response.data);
        }
      } else if (error) {
        error();
      }
    },
    // 新增区域
    *addArea({ payload, success, error }, { call, put }) {
      const response = yield call(addArea, payload);
      if (response.code === 200) {
        if (success) {
          success(response.data);
        }
      } else if (error) {
        error();
      }
    },
    // 编辑区域
    *editArea({ payload, success, error }, { call, put }) {
      const response = yield call(editArea, payload);
      if (response.code === 200) {
        if (success) {
          success(response.data);
        }
      } else if (error) {
        error();
      }
    },
    // 删除区域
    *deleteArea({ payload, success, error }, { call, put }) {
      const response = yield call(deleteArea, payload);
      if (response.code === 200) {
        if (success) {
          success(response.data);
        }
      } else if (error) {
        error();
      }
    },
    // 新增地图
    *addMap({ payload, success, error }, { call }) {
      const response = yield call(addMap, payload)
      if (response && response.code === 200) {
        if (success) success()
      } else if (error) error()
    },
    // 编辑地图
    *editMap({ payload, success, error }, { call }) {
      const response = yield call(editMap, payload)
      if (response && response.code === 200) {
        if (success) success()
      } else if (error) error()
    },
    // 选择地图获取的地图列表
    *fetchMapForSelect({ payload, callback }, { call, put }) {
      const response = yield call(fetchMapForSelect, payload)
      if (response && response.code === 200) {
        yield put({
          type: 'saveMapForSelect',
          payload: response.data.list,
        })
        if (callback) callback(response.data.list)
      }
    },
    // 获取地图详情
    *fetchMapDetail({ payload, callback }, { call, put }) {
      const response = yield call(fetchMapDetail, payload)
      if (response && response.code === 200) {
        yield put({
          type: 'saveMapDetail',
          payload: response.data,
        })
        if (callback) callback(response.data)
      }
    },
    // 删除地图
    *deleteMap({ payload, success, error }, { call }) {
      const response = yield call(deleteMap, payload)
      if (response && response.code === 200) {
        if (success) success()
      } else if (error) error()
    },
  },
  reducers: {
    saveSystemConfiguration(state, { payload: {
      list = [],
      pagination,
      pagination: { pageNum, pageSize, total },
    } }) {
      return {
        ...state,
        systemConfiguration: {
          ...state.systemConfiguration,
          list,
          pagination,
          isLast: pageNum * pageSize >= total,
        },
      };
    },
    saveCompanyList(state, { payload }) {
      return {
        ...state,
        companyList: payload,
      };
    },
    saveBeaconCompanyList(
      state,
      {
        payload: {
          list = [],
          pagination,
          pagination: { pageNum, pageSize, total },
        },
      }
    ) {
      if (pageNum === 1) {
        return {
          ...state,
          beaconManagement: {
            ...state.beaconManagement,
            list,
            pagination,
            isLast: pageNum * pageSize >= total,
          },
        };
      } else {
        return {
          ...state,
          beaconManagement: {
            ...state.beaconManagement,
            list: [...state.beaconManagement.list, ...list],
            pagination,
            isLast: pageNum * pageSize >= total,
          },
        };
      }
    },
    saveBeaconList(state, { payload: {
      list = [],
      pagination,
      pagination: { pageNum, pageSize, total },
    } }) {
      return {
        ...state,
        beaconManagement: {
          ...state.beaconManagement,
          beaconList: list,
          beaconPagination: pagination,
          beaconIsLast: pageNum * pageSize >= total,
        },
      }
    },
    saveTagLst(state, { payload: {
      list,
      pagination,
      pagination: { pageNum, pageSize, total },
    } }) {
      return {
        ...state,
        tag: {
          ...state.tag,
          list: pageNum === 1 ? list : [...state.tag.list, ...list],
          pagination,
          isLast: pageNum * pageSize >= total,
        },
      }
    },
    saveTagDetail(state, { payload }) {
      return {
        ...state,
        tag: {
          ...state.tag,
          detail: payload,
        },
      }
    },
    saveEmployees(state, { payload = [] }) {
      return {
        ...state,
        tag: {
          ...state.tag,
          personnelList: payload,
        },
      }
    },
    // 保存标签页面搜索栏信息
    saveTagSearchInfo(state, { payload }) {
      return {
        ...state,
        tag: {
          ...state.tag,
          searchInfo: payload,
        },
      }
    },
    saveBuildings(state, { payload = [] }) {
      return {
        ...state,
        map: {
          ...state.map,
          buildings: payload,
        },
      }
    },
    saveMapCompanies(state, { payload: { list = [], pagination = {} } }) {
      const { pageNum = 1, pageSize = 10, total = 0 } = pagination
      return {
        ...state,
        map: {
          ...state.map,
          mapCompanies: pageNum === 1 ? list : [...state.map.mapCompanies, ...list],
          pagination,
          isLast: pageNum * pageSize >= total,
        },
      }
    },
    saveMaps(state, { payload: { list = [], pagination = {} } = {} }) {
      const { pageNum = 1, pageSize = 10, total = 0 } = pagination
      return {
        ...state,
        map: {
          ...state.map,
          maps: list,
          mapPagination: pagination,
          mapIsLast: pageNum * pageSize >= total,
        },
      }
    },
    saveFloors(state, { payload }) {
      return {
        ...state,
        map: {
          ...state.map,
          floors: payload,
        },
      };
    },
    saveTagCompanies(
      state,
      {
        payload: { list = [], pagination = {} },
      }
    ) {
      return {
        ...state,
        tagCompany: {
          ...state.tagCompany,
          list,
          pagination,
        },
      };
    },
    saveSysCompanies(state, { payload }) {
      return {
        ...state,
        sysCompany: payload,
      };
    },
    selectAreaCompanys(
      state,
      {
        payload: {
          list = [],
          pagination,
          pagination: { pageNum, pageSize, total },
        },
      }
    ) {
      if (pageNum === 1) {
        return {
          ...state,
          sectionManagement: {
            ...state.sectionManagement,
            list,
            pagination,
            isLast: pageNum * pageSize >= total,
          },
        };
      } else {
        return {
          ...state,
          sectionManagement: {
            ...state.sectionManagement,
            list: [...state.sectionManagement.list, ...list],
            pagination,
            isLast: pageNum * pageSize >= total,
          },
        };
      }
    },
    getAreaTree(state, { payload }) {
      delEmptyChildren(payload.list);
      return {
        ...state,
        sectionManagement: {
          ...state.sectionManagement,
          sectionTree: payload.list,
        },
      };
    },
    saveMapForSelect(state, { payload = [] }) {
      return {
        ...state,
        mapsForSelect: payload,
      }
    },
    saveMapDetail(state, { payload = {} }) {
      return {
        ...state,
        map: {
          ...state.map,
          detail: payload,
        },
      }
    },
  },
};
