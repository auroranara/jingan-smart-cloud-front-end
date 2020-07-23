export const NAMESPACE = 'LS';
export const LIST_NAME = 'list';
export const DETAIL_NAME = 'detail';
export const LIST_API = `${NAMESPACE}/getList`;
export const DETAIL_API = `${NAMESPACE}/getDetail`;
export const ADD_API = `${NAMESPACE}/add`;
export const EDIT_API = `${NAMESPACE}/edit`;
export const DELETE_API = `${NAMESPACE}/delete`;
export const DETAIL_CODE = `riskControl.${NAMESPACE}.detail`;
export const ADD_CODE = `riskControl.${NAMESPACE}.add`;
export const EDIT_CODE = `riskControl.${NAMESPACE}.edit`;
export const DELETE_CODE = `riskControl.${NAMESPACE}.delete`;
export const LIST_PATH = `/risk-control/${NAMESPACE}/list`;
export const DETAIL_PATH = `/risk-control/${NAMESPACE}/detail`;
export const ADD_PATH = `/risk-control/${NAMESPACE}/add`;
export const EDIT_PATH = `/risk-control/${NAMESPACE}/edit`;
export const LEVEL_MAP = {
  1: {
    color: 'red',
    label: '红',
  },
  2: {
    color: 'orange',
    label: '橙',
  },
  3: {
    color: 'yellow',
    label: '黄',
  },
  4: {
    color: 'blue',
    label: '蓝',
  },
};
