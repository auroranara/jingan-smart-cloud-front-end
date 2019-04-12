import React, { PureComponent } from 'react';
import WaterDrawer from '../components/WaterDrawer';
import pistolAbnormal from '../images/pistol-abnormal.png';
import pistolNormal from '../images/pistol-normal.png';

export default class PistolDrawer extends PureComponent {
  render() {
    const {
      visible,
      onClose,
      data: { '102': list = [] },
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
        title={'喷淋系统'}
        visible={visible}
        dataSet={{
          subTitle: '喷淋',
          abnormal,
          normal,
          abnormalImg: pistolAbnormal,
          normalImg: pistolNormal,
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
