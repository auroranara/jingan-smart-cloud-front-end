import React, { Component } from 'react';
import ThreeInOnePage from '@/templates/ThreeInOnePage';
import AsyncSelect from '@/jingan-components/AsyncSelect';
import { isNumber } from '@/utils/utils';
import { BREADCRUMB_LIST, URL_PREFIX, TYPES } from '../List';
import styles from './index.less';

const MAPPER = {
  namespace: 'licensePlateRecognitionSystem',
  detail: 'deviceDetail',
  getDetail: 'getDeviceDetail',
  add: 'addDevice',
  edit: 'editDevice',
};
const MAPPER2 = {
  namespace: 'licensePlateRecognitionSystem',
  list: 'channelList',
  getList: 'getChannelList',
};

export default class DeviceOther extends Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.match.params.unitId !== this.props.match.params.unitId;
  }

  initialize = ({ channelId, channelName, name, ip, type, number }) => ({
    channel: channelId ? { key: channelId, label: channelName } : undefined,
    name: name || undefined,
    ip: ip || undefined,
    type: isNumber(type) ? `${type}` : undefined,
    number: number || undefined,
  });

  transform = ({ unitId, channel, ...payload }) => {
    return {
      unitId, // 这里接接口的时候重点关注一下
      channelId: channel && channel.key,
      ...payload,
    };
  };

  getBreadcrumbList = ({ isUnit, unitId, title }) =>
    BREADCRUMB_LIST.concat(
      [
        !isUnit && { title: '单位设备信息', name: '单位设备信息', href: `${URL_PREFIX}/list` },
        {
          title: '设备信息',
          name: '设备信息',
          href: isUnit ? `${URL_PREFIX}/list` : `${URL_PREFIX}/${unitId}/list`,
        },
        { title, name: title },
      ].filter(v => v)
    );

  getFields = () => [
    {
      id: 'channel',
      label: '所属通道',
      required: true,
      component: AsyncSelect,
      props: {
        mapper: MAPPER2,
        placeholder: '请选择所属通道',
      },
      options: {
        rules: [
          {
            type: 'object',
            required: true,
            message: '所属通道不能为空',
          },
        ],
      },
    },
    {
      id: 'name',
      label: '设备名称',
      required: true,
      component: 'Input',
    },
    {
      id: 'ip',
      label: 'IP',
      required: true,
      component: 'Input',
    },
    {
      id: 'type',
      label: '设备类型',
      required: true,
      component: 'Select',
      props: {
        list: TYPES,
      },
    },
    {
      id: 'number',
      label: '设备序列号',
      required: true,
      component: 'Input',
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
