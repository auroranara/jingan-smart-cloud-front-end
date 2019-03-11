import React, { PureComponent } from 'react';
import WaterDrawer from '../components/WaterDrawer';
import pondAbnormal from '../images/pond-abnormal.png';
import pondNormal from '../images/pond-normal.png';

export default class PondDrawer extends PureComponent {
  render() {
    const { visible, onClose, cameraList } = this.props;
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
        title={'水池/水箱'}
        visible={visible}
        dataSet={{
          subTitle: '水池/水箱',
          abnormal: 2,
          normal: 18,
          abnormalImg: pondAbnormal,
          normalImg: pondNormal,
          valName: '水位',
          dataList,
          useGauge: false,
        }}
        cameraList={cameraList}
        onClose={() => {
          onClose();
        }}
      />
    );
  }
}
