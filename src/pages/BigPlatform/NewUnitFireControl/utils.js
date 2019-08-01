export function getMsgIcon(type, list) {
  const target = list.find(({ types }) => types.includes(+type));
  if (target)
    return target.icon;
}

export function vaguePhone(phone, phoneVisible) {
  const newPhone =
    phoneVisible || !phone ? phone : `${phone}`.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
  return newPhone;
}
