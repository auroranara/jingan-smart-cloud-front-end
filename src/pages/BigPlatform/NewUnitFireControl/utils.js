export function vaguePhone(phone, phoneVisible) {
  const newPhone =
    phoneVisible || !phone ? phone : `${phone}`.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
  return newPhone;
}
