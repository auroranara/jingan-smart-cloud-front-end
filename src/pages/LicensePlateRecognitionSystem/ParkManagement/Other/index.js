import React, { Component } from 'react';
import ThreeInOnePage from '@/templates/ThreeInOnePage';
import AsyncSelect from '@/jingan-components/AsyncSelect';
import { isNumber } from '@/utils/utils';
import { connect } from 'dva';
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
const FIELDNAMES = {
  key: 'id',
  value: 'userName',
};
const MAPPER2 = {
  namespace: 'common',
  list: 'personList',
  getList: 'getPersonList',
};

@connect(({ user }) => ({
  user,
}))
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

  shouldComponentUpdate(nextProps) {
    return (
      nextProps.match.params.unitId !== this.props.match.params.unitId ||
      nextProps.match.params.id !== this.props.match.params.id
    );
  }

  setPageReference = page => {
    this.page = page && page.getWrappedInstance();
  };

  initialize = ({ parkId, parkName, managerId, managerName, managerPhone, parkStatus }) => ({
    parkId: parkId || undefined,
    parkName: parkName || undefined,
    manager: managerId ? { key: managerId, label: managerName } : undefined,
    managerPhone: managerPhone || undefined,
    parkStatus: isNumber(parkStatus) ? `${parkStatus}` : undefined,
  });

  transform = ({ unitId, manager, ...payload }) => {
    return {
      companyId: unitId,
      managerId: manager && manager.key,
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

  getFields = ({ unitId, isDetail, isEdit }) => [
    ...(isDetail || isEdit
      ? [
          {
            id: 'parkId',
            label: '车场ID',
            component: 'Text',
          },
        ]
      : []),
    {
      id: 'parkName',
      label: '车场名称',
      required: true,
      component: 'Input',
    },
    {
      id: 'manager',
      label: '车场联系人',
      component: AsyncSelect,
      props: {
        fieldNames: FIELDNAMES,
        mapper: MAPPER2,
        params: {
          unitId,
        },
        placeholder: '请选择车场联系人',
        onSelect: this.handleManagerSelect,
      },
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

  handleManagerSelect = value => {
    const { phoneNumber } = value || {};
    this.page &&
      this.page.form &&
      this.page.form.setFieldsValue({
        managerPhone: phoneNumber ? `${phoneNumber}` : undefined,
      });
  };

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
      error: 1,
      ref: this.setPageReference,
      route,
      location,
      match,
    };

    return <ThreeInOnePage {...props} />;
  }
}
