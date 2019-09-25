import { connect } from 'dva';
import CustomPage from '@/jingan-components/CustomPage';
import CompanySelect from '@/jingan-components/CompanySelect';

const SPAN = {
  sm: 16,
  xs: 24,
};
const LABEL_COL = { span: 6 }

export default connect(({
  common,
  user,
  loading,
}) => ({
  detail: common.detail,
  user,
  loading: loading.effects['common/getDetail'],
}), (dispatch) => ({
  getDetail(payload, callback) {
    dispatch({
      type: 'common/getDetail',
      payload,
      callback,
    });
  },
  setDetail(payload, callback) {
    dispatch({
      type: 'common/setDetail',
      payload,
      callback,
    });
  },
}), (stateProps, dispatchProps, ownProps) => ({ // 可以通过stateProps直接访问model
  ...ownProps,
  ...stateProps,
  ...dispatchProps,
  listPath: '/emergency-management/emergency-plan/list',
  editPath: '/emergency-management/emergency-plan/edit',
  getTitle(type) {
    return ({ add: '新增', detail: '详情', edit: '编辑' })[type];
  },
  getBreadcrumbList(title, listPath) {
    return [
      {
        title: '首页',
        name: '首页',
        href: '/',
      },
      {
        title: '应急管理',
        name: '应急管理',
      },
      {
        title: '应急预案',
        name: '应急预案',
        href: listPath,
      },
      {
        title,
        name: title,
      },
    ];
  },
  getFields(type, detail, values) {
    const { companyId, companyName } = detail || {};
    const isNotDetail = type === 'detail';
    return [
      {
        id: 'companyName',
        label: '单位名称',
        span: SPAN,
        labelCol: LABEL_COL,
        render: () => isNotDetail ? <CompanySelect /> : <span>{companyName}</span>,
        options: {
          initialValue: companyId && { key: companyId, label: companyName },
          rules: [
            {
              required: true,
              message: '单位名称不能为空',
              transform: value => value && value.label,
            },
          ],
        },
      },
    ];
  },
  enableEdit(detail) {
    console.log(detail);
    const { user: { permissionCodes } } = stateProps;
    const hasEditAuthority = permissionCodes.includes('emergencyManagement.emergencyPlan.edit');
    return hasEditAuthority;
  },
}))(CustomPage);
