import locale from '@/locales/zh-CN';

export const modelName = 'pointLabel';
export const listName = 'list';
export const detailName = 'detail';
export const listApi = 'pointLabel/getList';
export const detailApi = 'pointLabel/getDetail';
export const addApi = 'pointLabel/add';
export const editApi = 'pointLabel/edit';
export const deleteApi = 'pointLabel/delete';
export const detailCode = 'riskControl.pointLabel.detail';
export const addCode = 'riskControl.pointLabel.add';
export const editCode = 'riskControl.pointLabel.edit';
export const deleteCode = 'riskControl.pointLabel.delete';
export const listPath = '/risk-control/point-label/list';
export const detailPath = '/risk-control/point-label/detail';
export const addPath = '/risk-control/point-label/add';
export const editPath = '/risk-control/point-label/edit';
export const parentLocale = locale['menu.riskControl'];
export const listLocale = locale['menu.riskControl.pointLabel.list'];
export const detailLocale = locale['menu.riskControl.pointLabel.detail'];
export const addLocale = locale['menu.riskControl.pointLabel.add'];
export const editLocale = locale['menu.riskControl.pointLabel.edit'];
export const typeList = [
    { key: '1', value: '1', label: '监督点', title: '监督点' },
    { key: '2', value: '2', label: '风险点', title: '风险点' },
];
export const statusList = [
    { key: '1', value: '1', label: '已绑定', title: '已绑定' },
    { key: '0', value: '0', label: '未绑定', title: '未绑定' },
];
