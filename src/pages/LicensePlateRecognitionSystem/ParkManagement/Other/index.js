import React, { Component } from 'react';
import ThreeInOnePage from '@/templates/ThreeInOnePage';
import { isNumber } from '@/utils/utils';
import router from 'umi/router';
import { BREADCRUMB_LIST, STATUSES } from '../List';
import styles from './index.less';

const MAPPER = {
  namespace: 'licensePlateRecognitionSystem',
  detail: 'parkDetail',
  getDetail: 'getParkDetail',
  add: 'addPark',
  edit: 'editPark',
};

export default class ParkOther extends Component {
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

  initialize = ({ parkId, parkName, managerName, managerPhone, parkStatus }) => ({
    parkId: parkId || undefined,
    parkName: parkName || undefined,
    managerName: managerName || undefined,
    managerPhone: managerPhone || undefined,
    parkStatus: isNumber(parkStatus) ? `${parkStatus}` : undefined,
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
          title: '单位车场信息',
          name: '单位车场信息',
          href: this.props.route.path.replace(/:unitId.*/, 'list'),
        },
        {
          title: '车场信息',
          name: '车场信息',
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
      id: 'parkId',
      label: '车场ID',
      component: 'Text',
    },
    {
      id: 'parkName',
      label: '车场名称',
      required: true,
      component: 'Input',
    },
    {
      id: 'managerName',
      label: '车场联系人',
      component: 'Input',
    },
    {
      id: 'managerPhone',
      label: '联系电话',
      component: 'Input',
    },
    {
      id: 'parkStatus',
      label: '车场状态',
      required: true,
      component: 'Switch',
      props: {
        list: STATUSES,
      },
      options: {
        initialValue: STATUSES[0].key,
      },
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
      hack: true,
      route,
      location,
      match,
    };

    return <ThreeInOnePage {...props} />;
  }
}
