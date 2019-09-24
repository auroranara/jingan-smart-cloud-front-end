export const TYPE_MAPPER = v => ({
  1: '文本预案类',
})[v];
export const VERSION_TYPE_MAPPER = v => ({
  1: '创建',
  2: '修订',
})[v];
export const VERSION_MAPPER = v => `V${v}`;
export const LEVEL_CODE_MAPPER = v => ({
  66000: '66000 企业级应急预案',
})[v];
export const SPAN = {
  sm: 16,
  xs: 24,
};
export const LABEL_COL = { span: 6 }
export const BUTTON_WRAPPER_SPAN = {
  sm: 24,
  xs: 24,
};
export const DEFAULT_RECORD_STATUS = '0';
