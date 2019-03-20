import React, { PureComponent } from 'react';
import WaterDrawer from '../components/WaterDrawer';
import pondAbnormal from '../images/pond-abnormal.png';
import pondNormal from '../images/pond-normal.png';
import pondLost from '../images/pond-lost.png';

export default class PondDrawer extends PureComponent {
  render() {
    const {
      visible,
      onClose,
      data: { '103': list = [] },
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
        title={'水池/水箱'}
        visible={visible}
        dataSet={{
          subTitle: '水池/水箱',
          abnormal,
          normal,
          abnormalImg: pondAbnormal,
          normalImg: pondNormal,
          lostImg: pondLost,
          valName: '水位',
          dataList,
          useGauge: false,
        }}
        onClose={() => {
          onClose();
        }}
      />
    );
  }
}
