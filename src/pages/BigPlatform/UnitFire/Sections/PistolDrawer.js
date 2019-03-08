import React, { PureComponent } from 'react';
import WaterDrawer from '../components/WaterDrawer';
import pistolAbnormal from '../images/pistol-abnormal.png';
import pistolNormal from '../images/pistol-normal.png';

export default class PistolDrawer extends PureComponent {
  render() {
    const { visible, onClose } = this.props;
    const dataList = Array(7)
      .fill(true)
      .map((item, index) => {
        return {
          name: `水箱${index + 1}`,
          id: Math.floor(Math.random() * 666666666).toString(),
          location: `${index + 1}号楼`,
          value: 2 * Math.random().toFixed(2),
          unit: 'MPa',
          range: [2, 4],
          status: Math.floor(2 * Math.random()),
        };
      });
    return (
      <WaterDrawer
        title={'自动喷淋系统'}
        visible={visible}
        dataSet={{
          subTitle: '自动喷淋',
          abnormal: 2,
          normal: 18,
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
