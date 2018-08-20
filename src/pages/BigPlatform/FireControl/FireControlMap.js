import React, { PureComponent } from 'react';
// import { Map as GDMap, Marker, InfoWindow } from 'react-amap';

export default class AlarmSection extends PureComponent {
  state = {
    scrollNodeTop: 0,
    label: {
      longitude: 120.366011,
      latitude: 31.544389,
    },
    infoWindowShow: false,
    infoWindow: {
      company_name: '',
      level: '',
      address: '',
    },
    areaHeight: 0,
    pieHeight: 0,
    center: [120.366011, 31.544389],
    zoom: 13,
    // 右侧显示
    communityCom: true, // 社区接入单位数
    comIn: false, // 接入单位统计
    keyCom: false, // 重点单位统计
    fullStaff: false, // 专职人员统计
    overHd: false, // 已超期隐患
    hdCom: false, // 隐患单位统计
    comInfo: false, // 企业信息
    companyId: '',
  };

  render() {
    return <div>ma12312313131p</div>;
  }
}
