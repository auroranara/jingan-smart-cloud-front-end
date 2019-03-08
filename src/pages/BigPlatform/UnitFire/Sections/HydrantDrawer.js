import React, { PureComponent } from 'react';
import WaterDrawer from '../components/WaterDrawer';
import hydrantAbnormal from '../images/hydrant-abnormal.png';
import hydrantNormal from '../images/hydrant-normal.png';

export default class HydrantDrawer extends PureComponent {
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
          unit: 'm',
          range: [2, 4],
          status: Math.floor(2 * Math.random()),
        };
      });
    return (
      <WaterDrawer
        title={'消火栓系统'}
        visible={visible}
        dataSet={{
          subTitle: '消火栓',
          abnormal: 2,
          normal: 18,
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
