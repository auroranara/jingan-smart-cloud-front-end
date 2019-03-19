import { getList, getLatest, getTree, getPeople, getCards } from '../services/position';

// 格式化树
function formatTree(list, parentName='', parentMapId, parentIds=[], result={}) {
  return list.reduce((result, {
    companyMapPhoto,
    mapPhoto,
    range,
    id,
    name,
    parentId,
    companyMap,
    mapId,
    children,
  }) => {
    const fullName = `${parentName}${name}`;
    if (!result.url) {
      result.url = JSON.parse(companyMapPhoto).url;
    }
    const childIds = [];
    let isBuilding = false;
    if (children) {
      formatTree(children, fullName, mapId, parentIds.concat(id), result);
      children.forEach(({ id, mapId: childMapId }) => {
        childIds.push(id);
        if (childMapId !== mapId) {
          isBuilding = true;
        }
      });
    }
    result[id] = {
      ...(JSON.parse(range)),
      url: JSON.parse(mapPhoto).url,
      id,
      name,
      fullName,
      parentId,
      parentIds,
      companyMap,
      mapId,
      children: childIds,
      isBuilding,
      isFloor: parentMapId ? parentMapId !== mapId : false,
    };
    return result;
  }, result);
};
// 格式化位置数据
function formatData(list) {
  return list.map(({
    id,
    xarea,
    yarea,
    zarea,
    intime,
    uptime,
    areaId,
    xpx: lng,
    ypx: lat,
    cardType,
    userName,
    vistorName,
    locationStatusHistoryList,
  }, index) => {
    const isAlarm = locationStatusHistoryList && locationStatusHistoryList.length > 0;
    return {
      id,
      xarea,
      yarea,
      zarea,
      intime,
      // 当前时间节点的离开时间和下个时间节点的进入时间相等时，就将当前时间节点的离开时间提前1s，为了确保两个时间节点之间有1s的移动动画
      uptime: list[index+1] && list[index+1].intime === uptime? Math.max(uptime-1000, intime) : uptime,
      areaId,
      latlng: { lng, lat },
      isVistor: +cardType === 1,
      userName,
      vistorName,
      isAlarm,
      options: { color: isAlarm ? '#ff4848' : '#00ffff' },
      locationStatusHistoryList,
    };
  });
}

function cloneTreeList(list) {
  return list.map(({ id, name, children }) => {
    const cloned = { title: name, value: id, key: id };
    if (children && children.length)
      cloned.children = cloneTreeList(children);
    return cloned;
  });
}

function getSelectTree(list) {
    return Array.isArray(list) ? cloneTreeList(list) : [];
}

function getHisotryIdMap(list, idType) {
  const isCardId = +idType;
  return list.reduce((prev, next) => {
    let id = next[isCardId ? 'cardId' : 'userId'];
    // 依据cardId，且cardId不存在，直接忽略，实际这种情况不存在
    if (!id && isCardId)
      return prev;
    // 依据userId，未绑定的普通卡和所有临时卡没有userId，根据卡的类型，正式卡都显示为未领，临时卡根据是否有名字，分为名字和访客
    if (!id && !isCardId) {
      const isVisitor = +next.cardType;
      const { visitorName } = next;
      if (!isVisitor){
        id = 'not_bound';
        next = { ...next, userId: 'not_bound', userName: '未领' };
      // 临时卡添加userName是为了下面按名字排序
      } else if(visitorName) {
        id = visitorName;
        next = { ...next, userId: visitorName, userName: visitorName };
      }
      else {
        id = 'visitor';
        next = { ...next, userId: 'visitor', visitorName: '访客', userName: '访客' };
      }
    }

    if (id in prev)
      prev[id].push(next);
    else
      prev[id] = [next];

    return prev;
  }, {});
}

export default {
  namespace: 'position',

  state: {
    data: {
      // 当前选中时间段内涉及的区域
      areaDataHistories: [],
      // 当前选中时间段内涉及的人员位置
      locationDataHistories: [],
    },
    // areaDataMap: {},
    areaDataList: [],
    historyIdMap: {},
    tree: {},
    originalTree: [],
    people: [],
    cards: [],
    sectionTree: [],
  },

  effects: {
    // 获取最新的一条数据
    *fetchLatest({ payload, callback }, { call, put }) {
      const response = yield call(getLatest, payload);
      callback && callback(response);
    },
    // 获取选中数据
    *fetchData({ payload, callback }, { call, put }) {
      const idType = payload.idType;
      delete payload.idType;
      const response = yield call(getList, payload);
      let areaDataList = [];
      if (response.code === 200) {
        const { areaDataHistories, locationDataHistories } = response.data;
        const originHistoryIdMap = getHisotryIdMap(locationDataHistories, idType);
        const historyIdMap = Object.entries(originHistoryIdMap).reduce((prev, next) => {
          const [id, ids] = next;
          prev[id] = formatData(Array.from(ids));
          return prev;
        }, {});
        // const areaDataMap = getHisotryIdMap(areaDataHistories, idType);
        // areaDataList = Object.values(areaDataMap);
        areaDataList = areaDataHistories;
        const sortFn = +idType
          ? (a, b) => a.cardCode - b.cardCode
          : (a, b) => a.userName.localeCompare(b.userName, 'zh-Hans-CN', {sensitivity: 'accent'});
        areaDataList.sort(sortFn);
        yield put({
          type: 'save',
          payload: {
            data: {
              areaDataHistories,
              locationDataHistories: formatData(locationDataHistories),
            },
            // areaDataMap,
            areaDataList,
            historyIdMap,
          },
        });
      }
      if (callback) {
        callback(response, areaDataList);
      }
    },
    // 获取区域树
    *fetchTree({ payload, callback }, { call, put }) {
      const response = yield call(getTree, payload);
      if (response.code === 200) {
        yield put({
          type: 'save',
          payload: {
            tree: formatTree(response.data.list),
            originalTree: response.data.list,
            sectionTree: getSelectTree(response.data.list),
          }});
      }
      if (callback) {
        callback(response);
      }
    },
    // 获取人员列表
    *fetchPeople({ payload, callback }, { call, put }) {
      const response = yield call(getPeople, payload);
      const { code, data={} } = response || {};
      if (code === 200) {
        const { list } = data || {};
        const people = list || [];
        people.sort((a, b) => a.user_name.localeCompare(b.user_name, 'zh-Hans-CN', {sensitivity: 'accent'}));
        yield put({ type: 'save', payload: { people } });
        callback && callback(people);
      }
    },
    // 获取卡片列表
    *fetchCards({ payload, callback }, { call, put }) {
      const response = yield call(getCards, payload);
      const { code, data={} } = response || {};
      if (code === 200) {
        const { list } = data || {};
        const cards = list || [];
        cards.sort((c1, c2) => c1.code - c2.code);
        yield put({ type: 'save', payload: { cards } });
        callback && callback(cards);
      }
    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
