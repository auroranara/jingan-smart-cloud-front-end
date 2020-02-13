import React, { Component } from 'react';
import ThreeInOnePage from '@/templates/ThreeInOnePage';
import ProvinceSelect from './components/ProvinceSelect';
import CitySelect from './components/CitySelect';
import { isNumber } from '@/utils/utils';
import { BREADCRUMB_LIST, URL_PREFIX, STATUSES } from '../List';
import styles from './index.less';

const MAPPER = {
  namespace: 'licensePlateRecognitionSystem',
  detail: 'parkDetail',
  getDetail: 'getParkDetail',
  add: 'addPark',
  edit: 'editPark',
};

export default class ParkOther extends Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.match.params.unitId !== this.props.match.params.unitId;
  }

  setProvinceSelectReference = provinceSelect => {
    this.provinceSelect = provinceSelect && provinceSelect.getWrappedInstance();
  };

  initialize = ({ 车场名称, 车场联系人, 联系电话, 车场状态, 车场所在省份, 车场所在城市 }) => ({
    车场名称: 车场名称 || undefined,
    车场联系人: 车场联系人 || undefined,
    联系电话: 联系电话 || undefined,
    车场状态: isNumber(车场状态) ? `${车场状态}` : undefined,
    车场所在省份: 车场所在省份 || undefined,
    车场所在城市: 车场所在城市 || undefined,
  });

  transform = ({ unitId, ...payload }) => {
    return {
      unitId, // 这里接接口的时候重点关注一下
      ...payload,
    };
  };

  getBreadcrumbList = ({ isUnit, unitId, title }) =>
    BREADCRUMB_LIST.concat(
      [
        !isUnit && { title: '单位车场信息', name: '单位车场信息', href: `${URL_PREFIX}/list` },
        {
          title: '车场信息',
          name: '车场信息',
          href: isUnit ? `${URL_PREFIX}/list` : `${URL_PREFIX}/${unitId}/list`,
        },
        { title, name: title },
      ].filter(v => v)
    );

  getFields = ({ 车场所在省份 }) => [
    {
      id: '车场名称',
      label: '车场名称',
      required: true,
      component: 'Input',
    },
    {
      id: '车场联系人',
      label: '车场联系人',
      component: 'Input',
    },
    {
      id: '联系电话',
      label: '联系电话',
      component: 'Input',
    },
    {
      id: '车场状态',
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
    {
      id: '车场所在省份',
      label: '车场所在省份',
      required: true,
      refreshEnable: true,
      component: ProvinceSelect,
      props: {
        ref: this.setProvinceSelectReference,
      },
    },
    {
      id: '车场所在城市',
      label: '车场所在城市',
      required: true,
      component: CitySelect,
      props: {
        cityIds: 车场所在省份,
        focus: this.handleFocus,
      },
    },
  ];

  handleFocus = () => {
    this.provinceSelect && this.provinceSelect.focus();
  };

  render() {
    const { route, location, match } = this.props;
    const props = {
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
