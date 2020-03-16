import React, { Component } from 'react';
import ThreeInOnePage from '@/templates/ThreeInOnePage';
import VehicleSelect from './components/VehicleSelect';
import TransportCompanyInfo from './components/TransportCompanyInfo';
import { connect } from 'dva';
import router from 'umi/router';
import { BREADCRUMB_LIST } from '../List';
import styles from './index.less';

const MAPPER = {
  namespace: 'licensePlateRecognitionSystem',
  detail: 'ElectronicWaybillDetail',
  getDetail: 'getElectronicWaybillDetail',
  add: 'addElectronicWaybill',
  edit: 'editElectronicWaybill',
};

@connect(({ user }) => ({
  user,
}))
export default class ElectronicWaybillOther extends Component {
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

  initialize = ({
    waybillCode,
    goods,
    consignmentCompanyName,
    emergencyMeasures,
    note,
    fileList,
    carId,
    transitCompanyName,
    ownerType,
    carNumber,
    driver,
    driverTel,
    driverPhotoList,
    supercargo,
    supercargoTel,
    supercargoPhotoList,
  }) => ({
    waybillCode: waybillCode || undefined,
    goods: goods || undefined,
    consignmentCompanyName: consignmentCompanyName || undefined,
    emergencyMeasures: emergencyMeasures || undefined,
    note: note || undefined,
    fileList: fileList || [],
    vehicle:
      {
        id: carId,
        ownerCompanyName: transitCompanyName,
        ownerType,
        carNumber,
        driver,
        driverTel,
        driverPhotoList,
        supercargo,
        supercargoTel,
        supercargoPhotoList,
      } || undefined,
    transportCompany:
      {
        id: carId,
        ownerCompanyName: transitCompanyName,
        ownerType,
        carNumber,
        driver,
        driverTel,
        driverPhotoList,
        supercargo,
        supercargoTel,
        supercargoPhotoList,
      } || undefined,
  });

  transform = ({ unitId, vehicle, transportCompany, ...payload }) => {
    return {
      companyId: unitId,
      carId: vehicle.id,
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

  getFields = ({ unitId }) => [
    {
      id: 'waybillCode',
      label: '运单编号',
      required: true,
      component: 'Input',
      props: {
        maxLength: 100,
      },
    },
    {
      id: 'vehicle',
      label: '承运车辆',
      required: true,
      component: VehicleSelect,
      props: {
        onChange: this.handleChange,
        unitId,
      },
      options: {
        rules: [{ required: true, type: 'object', message: '承运车辆不能为空' }],
      },
    },
    {
      id: 'transportCompany',
      label: '运输公司名称',
      component: TransportCompanyInfo,
    },
    {
      id: 'goods',
      label: '运输货物',
      component: 'TextArea',
      props: {
        maxLength: 500,
      },
    },
    {
      id: 'consignmentCompanyName',
      label: '托运公司名称',
      component: 'Input',
      props: {
        maxLength: 100,
      },
    },
    {
      id: 'emergencyMeasures',
      label: '应急处置措施',
      component: 'TextArea',
    },
    {
      id: 'note',
      label: '运输注意事项',
      component: 'TextArea',
    },
    {
      id: 'fileList',
      label: '纸质电子运单附件',
      component: 'CustomUpload',
    },
  ];

  handleChange = value => {
    this.page &&
      this.page.form &&
      this.page.form.setFieldsValue({
        transportCompany: value,
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
