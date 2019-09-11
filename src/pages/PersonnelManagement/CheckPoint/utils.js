export const CARDS = ['单双色控制卡', '多彩控制卡', '全彩控制卡'];
export const TABS = ['卡口点位', '卡口设备', '显示屏'];
export const TAB_LIST = TABS.map((tab, index) => ({ key: index.toString(), tab }));
export const FORMITEM_LAYOUT = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};

const LOCATION_LABELS = ['Province', 'City', 'District', 'Town', 'Address'];
export function getAddress(item) {
  return LOCATION_LABELS.reduce((prev, next) => `${prev}${item[`practical${next}`] || ''}`, '');
}

export function clearSpace(e) {
  return e.target.value.replace(/\s/g, '');
}

export function getFieldDecConfig(msg, required=true) {
  return {
    getValueFromEvent: clearSpace,
    validateTrigger: 'onBlur',
    rules: [{ required, whitespace: true, message: msg }],
  };
}
