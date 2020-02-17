import React, { Component } from 'react';
import ThreeInOnePage from '@/templates/ThreeInOnePage';
import AsyncSelect from '@/jingan-components/AsyncSelect';
import { isNumber } from '@/utils/utils';
import { BREADCRUMB_LIST, URL_PREFIX, STATUSES, MODES, DIRECTIONS } from '../List';
import styles from './index.less';

const MAPPER = {
  namespace: 'licensePlateRecognitionSystem',
  detail: 'channelDetail',
  getDetail: 'getChannelDetail',
  add: 'addChannel',
  edit: 'editChannel',
};
const MAPPER2 = {
  namespace: 'licensePlateRecognitionSystem',
  list: 'areaList',
  getList: 'getAreaList',
};

export default class ChannelOther extends Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.match.params.unitId !== this.props.match.params.unitId;
  }

  initialize = ({ name, areaId, areaName, status, mode, direction, whitelist }) => ({
    name: name || undefined,
    area: areaId ? { key: areaId, label: areaName } : undefined,
    status: isNumber(status) ? `${status}` : undefined,
    mode: isNumber(mode) ? `${mode}` : undefined,
    direction: isNumber(direction) ? `${direction}` : undefined,
    whitelist: isNumber(whitelist) ? `${whitelist}` : undefined,
  });

  transform = ({ unitId, area, ...payload }) => {
    return {
      unitId, // 这里接接口的时候重点关注一下
      area: area && area.key,
      ...payload,
    };
  };

  getBreadcrumbList = ({ isUnit, unitId, title }) =>
    BREADCRUMB_LIST.concat(
      [
        !isUnit && { title: '单位通道信息', name: '单位通道信息', href: `${URL_PREFIX}/list` },
        {
          title: '通道信息',
          name: '通道信息',
          href: isUnit ? `${URL_PREFIX}/list` : `${URL_PREFIX}/${unitId}/list`,
        },
        { title, name: title },
      ].filter(v => v)
    );

  getFields = () => [
    {
      id: 'area',
      label: '所在区域',
      required: true,
      component: AsyncSelect,
      props: {
        mapper: MAPPER2,
        placeholder: '请选择所在区域',
      },
      options: {
        rules: [
          {
            type: 'object',
            required: true,
            message: '所在区域不能为空',
          },
        ],
      },
    },
    {
      id: 'name',
      label: '通道名称',
      required: true,
      component: 'Input',
    },
    {
      id: 'status',
      label: '通道状态',
      required: true,
      component: 'Switch',
      props: {
        list: STATUSES,
      },
    },
    {
      id: 'mode',
      label: '通道模式',
      required: true,
      component: 'Select',
      props: {
        list: MODES,
      },
    },
    {
      id: 'direction',
      label: '方向',
      required: true,
      component: 'Select',
      props: {
        list: DIRECTIONS,
      },
    },
    {
      id: 'whitelist',
      label: '相机处理白名单',
      required: true,
      component: 'Select',
      props: {
        list: STATUSES,
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
