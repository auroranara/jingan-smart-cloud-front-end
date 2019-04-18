export function getUnitTypeLabel(type, types) {
  if (!types || !types.length || !type)
    return;
  const target = types.find(({ id }) => type === id);
  if (!target)
    return;
  return target.label;
}
