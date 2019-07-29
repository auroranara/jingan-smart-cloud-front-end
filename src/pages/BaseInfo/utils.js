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

  if (host && safety)
    return 4;
  if (host && !safety)
    return 3;
  if (!host && safety)
    return 1;
  return 2;
}

// 单位类型 -> [消防重点单位， 安监重点单位]
export function getImportantTypes(companyType) {
  const type = Number(companyType);

  switch(type) {
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

const MAX_WIDTH = 240;
const MAX_HEIGHT = 320;
export function getImageSize(src, callback) {
  if (!src) {
    console.log(src);
    return;
  }

  const img = new Image();
  img.src = src;
  img.onload = e => {
    const { width, height } = e.target;
    const isSatisfied = width <= MAX_WIDTH && height <= MAX_HEIGHT;
    callback(isSatisfied);
  };
}

export function getFileList(list) {
  if (!Array.isArray(list))
    return [];

  return list.map(file => {
    if (!file.url && file.response) {
      const { data: { list: [{ webUrl, dbUrl }] } } = file.response;
      file.url = webUrl;
      file.dbUrl = dbUrl;
    }
    return file;
  });
}
