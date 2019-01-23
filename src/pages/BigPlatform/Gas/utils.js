// function rand(n, m) {
//   return Math.floor(Math.random() * (m - n)) + n;
// }

// function isOverHalf(n = 0.5) {
//   return Math.random() > n;
// }

// function getRandNum() {
//   return isOverHalf() ? 0 : rand(1, 10);
// }

export function genCardsInfo(list = []) {
  console.log('genCardsInfo1', list);
  return list.map(
    ({
      company_id,
      company_name,
      address,
      principal_name,
      principal_phone,
      count,
      normal,
      unnormal,
      faultNum,
      outContact,
    }) => {
      // const [normal, unnormal, faultNum, outContact] = [...Array(4).keys()].map(i => getRandNum());
      return {
        company_id,
        company_name,
        address: address,
        principal_name: principal_name,
        principal_phone: principal_phone,
        unnormal,
        faultNum,
        outContact,
        normal,
        count,
      };
    }
  );
}

export function sortCardList(list) {
  const newList = Array.from(list);
  newList.sort((item, item1) => {
    const compare = item1.count - item.count;
    if (compare) return compare;
    return item.company_name.localeCompare(item1.company_name, 'zh-Hans-CN', {
      sensitivity: 'accent',
    });
  });

  return newList;
}

export function sortList(list, prop) {
  list.sort((item, item1) => {
    return item1[prop] - item[prop];
  });
}

const UNIT_SETS = ['alarmUnit', 'earlyWarningUnit', 'normalUnit'];

export function getAlarmUnits(unitSet) {
  const uSet = unitSet || {};
  return UNIT_SETS.reduce((prev, next) => {
    prev[next] = Array.isArray(uSet[next]) ? uSet[next].length : 0;
    return prev;
  }, {});
}
