import React, { PureComponent } from 'react';
import WaterDrawer from '../components/WaterDrawer';
import hydrantAbnormal from '../images/hydrant-abnormal.png';
import hydrantNormal from '../images/hydrant-normal.png';

export default class HydrantDrawer extends PureComponent {
  render() {
    const {
      visible,
      onClose,
      data: { '101': list = [] },
    } = this.props;
    const dataList = list.map(item => {
      const { deviceDataList } = item;
      if (!deviceDataList.length) return null;
      const { deviceId, deviceName, area, location, videoList } = item;
      const [
        {
          value,
          status,
          deviceParamsInfo: { minValue, maxValue, normalUpper, normalLower },
          unit,
        },
      ] = deviceDataList;
      return {
        name: deviceName,
        id: deviceId,
        location: area + location,
        value,
        unit,
        isLost: +status < 0,
        range: [minValue || 0, maxValue || (value ? 2 * value : 5)],
        normalRange: [normalLower, normalUpper],
        status: +status,
        videoList,
      };
    });
    const normal = dataList.filter(item => item && item.status === 0).length;
    const abnormal = dataList.filter(item => item).length - normal;
    return (
      <WaterDrawer
        title={'消火栓系统'}
        visible={visible}
        dataSet={{
          subTitle: '消火栓',
          abnormal,
          normal,
          abnormalImg: hydrantAbnormal,
          normalImg: hydrantNormal,
          valName: '压力',
          dataList,
          useGauge: true,
        }}
        onClose={() => {
          onClose();
        }}
      />
    );
  }
}
