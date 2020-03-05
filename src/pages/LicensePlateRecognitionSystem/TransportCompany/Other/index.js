import React, { Component } from 'react';
import ThreeInOnePage from '@/templates/ThreeInOnePage';
import { connect } from 'dva';
import router from 'umi/router';
import { BREADCRUMB_LIST } from '../List';
import styles from './index.less';

const MAPPER = {
  namespace: 'licensePlateRecognitionSystem',
  detail: 'transportCompanyDetail',
  getDetail: 'getTransportCompanyDetail',
  add: 'addTransportCompany',
  edit: 'editTransportCompany',
};

@connect(({ user }) => ({
  user,
}))
export default class TransportCompanyOther extends Component {
  componentDidMount() {
    const {
      user: { currentUser: { unitType } = {} },
      match: {
        params: { unitId },
      },
      route: { path },
    } = this.props;
    if (unitType !== 4 && !unitId) {
      router.push(path.replace(/:unitId.*/, 'list'));
    }
  }

  componentDidUpdate() {
    const {
      user: { currentUser: { unitType } = {} },
      match: {
        params: { unitId },
      },
      route: { path },
    } = this.props;
    if (unitType !== 4 && !unitId) {
      router.push(path.replace(/:unitId.*/, 'list'));
    }
  }

  shouldComponentUpdate(nextProps) {
    return (
      nextProps.match.params.unitId !== this.props.match.params.unitId ||
      nextProps.match.params.id !== this.props.match.params.id
    );
  }

  initialize = ({
    transitCompanyName,
    address,
    manager,
    managerTel,
    businessScope,
    companyDesc,
  }) => ({
    transitCompanyName: transitCompanyName || undefined,
    address: address || undefined,
    manager: manager || undefined,
    managerTel: managerTel || undefined,
    businessScope: businessScope || undefined,
    companyDesc: companyDesc || undefined,
  });

  transform = ({ unitId, ...payload }) => {
    return {
      companyId: unitId,
      ...payload,
    };
  };

  getBreadcrumbList = ({ isUnit, title }) =>
    BREADCRUMB_LIST.concat(
      [
        !isUnit && {
          title: '单位运输公司管理',
          name: '单位运输公司管理',
          href: this.props.route.path.replace(/:unitId.*/, 'list'),
        },
        {
          title: '运输公司管理',
          name: '运输公司管理',
          href: this.props.location.pathname.replace(
            new RegExp(`${this.props.route.name}.*`),
            'list'
          ),
        },
        { title, name: title },
      ].filter(v => v)
    );

  getFields = () => [
    {
      id: 'transitCompanyName',
      label: '运输公司名称',
      required: true,
      component: 'Input',
    },
    {
      id: 'address',
      label: '地址',
      component: 'Input',
    },
    {
      id: 'manager',
      label: '联系人',
      component: 'Input',
    },
    {
      id: 'managerTel',
      label: '联系电话',
      component: 'Input',
    },
    {
      id: 'businessScope',
      label: '经营范围',
      component: 'TextArea',
    },
    {
      id: 'companyDesc',
      label: '公司描述',
      component: 'TextArea',
    },
  ];

  render() {
    const {
      route,
      location,
      match,
      match: {
        params: { id },
      },
    } = this.props;
    const props = {
      key: id,
      breadcrumbList: this.getBreadcrumbList,
      fields: this.getFields,
      initialize: this.initialize,
      transform: this.transform,
      mapper: MAPPER,
      route,
      location,
      match,
    };

    return <ThreeInOnePage {...props} />;
  }
}
