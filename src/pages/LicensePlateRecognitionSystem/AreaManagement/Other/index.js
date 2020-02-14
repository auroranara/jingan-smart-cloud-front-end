import React, { Component } from 'react';
import ThreeInOnePage from '@/templates/ThreeInOnePage';
import AsyncSelect from '@/jingan-components/AsyncSelect';
import { isNumber } from '@/utils/utils';
import { BREADCRUMB_LIST, URL_PREFIX, TYPES } from '../List';
import styles from './index.less';

const MAPPER = {
  namespace: 'licensePlateRecognitionSystem',
  detail: 'areaDetail',
  getDetail: 'getAreaDetail',
  add: 'addArea',
  edit: 'editArea',
};
const MAPPER2 = {
  namespace: 'licensePlateRecognitionSystem',
  list: 'parkList',
  getList: 'getParkList',
};
const MAPPER3 = {
  // 这里需要排除自己
  namespace: 'licensePlateRecognitionSystem',
  list: 'areaList',
  getList: 'getAreaList',
};

export default class AreaOther extends Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.match.params.unitId !== this.props.match.params.unitId;
  }

  initialize = ({ parkId, parkName, name, parentId, parentName, type }) => ({
    park: parkId ? { key: parkId, label: parkName } : undefined,
    name: name || undefined,
    parent: parentId ? { key: parentId, label: parentName } : undefined,
    type: isNumber(type) ? `${type}` : undefined,
  });

  transform = ({ unitId, park, parent, ...payload }) => {
    return {
      unitId, // 这里接接口的时候重点关注一下
      parkId: park && park.key,
      parentId: parent && parent.key,
      ...payload,
    };
  };

  getBreadcrumbList = ({ isUnit, unitId, title }) =>
    BREADCRUMB_LIST.concat(
      [
        !isUnit && { title: '单位区域信息', name: '单位区域信息', href: `${URL_PREFIX}/list` },
        {
          title: '区域信息',
          name: '区域信息',
          href: isUnit ? `${URL_PREFIX}/list` : `${URL_PREFIX}/${unitId}/list`,
        },
        { title, name: title },
      ].filter(v => v)
    );

  getFields = () => [
    {
      id: 'park',
      label: '所在车场',
      required: true,
      component: AsyncSelect,
      props: {
        mapper: MAPPER2,
        placeholder: '请选择所在车场',
      },
      options: {
        rules: [
          {
            type: 'object',
            required: true,
            message: '所在车场不能为空',
          },
        ],
      },
    },
    {
      id: 'name',
      label: '区域名称',
      required: true,
      component: 'Input',
    },
    {
      id: 'parent',
      label: '父区域',
      component: AsyncSelect,
      props: {
        mapper: MAPPER3,
        placeholder: '请选择父区域',
      },
    },
    {
      id: 'type',
      label: '区域类型',
      required: true,
      component: 'Select',
      props: {
        list: TYPES,
      },
    },
  ];

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
