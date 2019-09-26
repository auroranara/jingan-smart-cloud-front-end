export function getList(data, prop='list') {
  return data && Array.isArray(data[prop]) ? data[prop] : [];
}
