/* 单位类型： 1.安全重点单位 2.一般单位 3.消防重点单位 4.消防安全重点单位
 * 消防重点单位 && 安监重点单位 -> 单位类型
 * 0 && 0 -> 2
 * 0 && 1 -> 1
 * 1 && 0 -> 3
 * 1 && 1 -> 4
 */

export function getCompanyType(hostType, safetyType) {
  const host = Number(hostType);
  const safety = Number(safetyType);

  if (host && safety) return 4;
  if (host && !safety) return 3;
  if (!host && safety) return 1;
  return 2;
}

// 单位类型 -> [消防重点单位， 安监重点单位]
export function getImportantTypes(companyType) {
  const type = Number(companyType);

  switch (type) {
    case 1:
      return ['0', '1'];
    case 2:
      return ['0', '0'];
    case 3:
      return ['1', '0'];
    case 4:
      return ['1', '1'];
    default:
      return ['0', '0'];
  }
}

export function getNewCompanyType(companyType, hostType, safetyType) {
  const importantTypes = getImportantTypes(companyType);
  return getCompanyType(hostType || importantTypes[0], safetyType || importantTypes[1]);
}

const MAX_WIDTH = 240;
const MAX_HEIGHT = 320;
export function getImageSize(src, callback, [maxWidth = MAX_WIDTH, maxHeight = MAX_HEIGHT]) {
  if (!src) {
    console.log(src);
    return;
  }

  const img = new Image();
  img.src = src;
  img.onload = e => {
    const { width, height } = e.target;
    const isSatisfied = width <= maxWidth && height <= maxHeight;
    callback(isSatisfied);
  };
}

export function getFileList(list) {
  if (!Array.isArray(list)) return [];

  return list.map(file => {
    if (!file.url && file.response) {
      const {
        data: {
          list: [{ webUrl, dbUrl }],
        },
      } = file.response;
      file.url = webUrl;
      file.dbUrl = dbUrl;
    }
    return file;
  });
}

const defaultImgUrl = 'http://data.jingan-china.cn/static/images/';
export const PhotoStyles = [
  {
    value: '1',
    name: '校园风格',
    urls: [`${defaultImgUrl}school_bg.png`, `${defaultImgUrl}school.png`],
  },
  {
    value: '2',
    name: '工厂风格',
    urls: [`${defaultImgUrl}factory_bg.png`, `${defaultImgUrl}factory.png`],
  },
  {
    value: '3',
    name: '加油站风格',
    urls: [`${defaultImgUrl}gas_station.png_bg.png`, `${defaultImgUrl}gas_station.png`],
  },
  {
    value: '4',
    name: '医院风格',
    urls: [`${defaultImgUrl}hospital_bg.png`, `${defaultImgUrl}hospital.png`],
  },
];
