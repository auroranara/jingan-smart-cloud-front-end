const LOCATION_LABELS = ['Province', 'City', 'District', 'Town', 'Address'];
export function getAddress(item) {
  return LOCATION_LABELS.reduce((prev, next) => `${prev}${item[`practical${next}`] || ''}`, '');
}
