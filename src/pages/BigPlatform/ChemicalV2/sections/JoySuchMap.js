import React, { PureComponent, Fragment } from 'react';
import { Map as GDMap, InfoWindow, Marker, Polygon } from 'react-amap';
import classnames from 'classnames';
import moment from 'moment';
import { connect } from 'dva';
import NewVideoPlay from '@/pages/BigPlatform/NewFireControl/section/NewVideoPlay';
import TruckModal from '../components/TruckModal';
import { MINUTE_FORMAT, TYPES, WORKING_STATUSES } from '@/pages/DataAnalysis/WorkingBill/config';
import { isPointInPolygon } from '@/utils/map';
import styles from './Map.less';

import monitor from '../imgs/monitor.png';
import riskPoint from '../imgs/risk-point.png';
import video from '../imgs/video.png';
import mapDot from '@/pages/BigPlatform/NewFireControl/img/mapDot.png';
import monitorActive from '../imgs/monitor-active.png';
import monitorGray from '../imgs/monitor-gray.png';
import riskPointActive from '../imgs/risk-point-active.png';
import riskPointGray from '../imgs/risk-point-gray.png';
import videoActive from '../imgs/video-active.png';
import videoGray from '../imgs/video-gray.png';
import position from '../imgs/position.png';
import monitorAlarm from '../imgs/monitor-alarm.png';
import specialEquipment from '../imgs/special-equipment.png';
import specialEquipmentActive from '../imgs/special-equipment-active.png';
import specialEquipmentGray from '../imgs/special-equipment-gray.png';
import iconTips from '../imgs/icon-tips.png';
import iconCar from '../imgs/icon-car.png';
import iconFace from '../imgs/icon-face.png';
import workBill from '../imgs/work-bill.png';
import workBillActive from '../imgs/work-bill-active.png';
import workBillGray from '../imgs/work-bill-gray.png';
import workBillAlarm from '../imgs/work-bill-alarm.png';
import positionActive from '../imgs/position-active.png';
import positionGray from '../imgs/position-gray.png';
import helmet1 from '../imgs/helmet-1.png';
import helmet2 from '../imgs/helmet-2.png';
import helmet3 from '../imgs/helmet-3.png';
import helmet4 from '../imgs/helmet-4.png';
import helmet5 from '../imgs/helmet-5.png';
import helmet6 from '../imgs/helmet-6.png';
import helmetAlarm1 from '../imgs/helmet-alarm-1.png';
import helmetAlarm2 from '../imgs/helmet-alarm-2.png';
import helmetAlarm3 from '../imgs/helmet-alarm-3.png';
import helmetAlarm4 from '../imgs/helmet-alarm-4.png';
import helmetAlarm5 from '../imgs/helmet-alarm-5.png';
import helmetAlarm6 from '../imgs/helmet-alarm-6.png';
import imgNoAvatar from '@/pages/BigPlatform/Gas/imgs/camera-bg.png';
import jobType from '../imgs/job-type.png';

const mockData = [
  {
    latitude: 31.545964158887074,
    yMillimeter: 19000,
    locationType: 1,
    buildId: '202343',
    floorNo: 'Floor1',
    timestampMillisecond: 1592459848208,
    xMillimeter: 52000,
    userId: '505e9bad279511eab68d7cd30aeb74c6',
    mac: '1918E001FAE3',
    longitude: 120.36140601261161,
    status: 2,
    hgFaceInfo: {
      id: 'rbyr7a_v_8sbgkwq',
      remarks: null,
      ids: null,
      idList: null,
      companyId: '99rz446zt9fet_lr',
      name: 'lm',
      sex: '0',
      ethnic: null,
      certificateType: null,
      certificateNumber: null,
      birthday: null,
      location: null,
      address: null,
      telephone: null,
      email: null,
      personType: '1',
      personCompany: null,
      duty: null,
      workType: null,
      education: null,
      major: null,
      icnumber: '12123',
      entranceNumber: '1918E001FAE3',
      photo: '',
      educationCertificate: '',
      guid: null,
      employeeId: 'c755f4f3b06a11ea982700163e15b4dc',
      workerNumber: null,
      iconID: null,
      partId: null,
      partName: null,
      companyJob: null,
      companyJobName: null,
      status: null,
      labelId: 'qrqa4e_9dblfpmbr',
      isSN: null,
      photoDetails: null,
      educationCertificateDetails: null,
      companyName: null,
      gridIdList: null,
      companyBasicInfo: null,
      hgAuthorizationManage: null,
      authorizationMessage: null,
    },
  },
  {
    latitude: 31.54599011116575,
    yMillimeter: 19000,
    locationType: 1,
    buildId: '202343',
    floorNo: 'Floor1',
    timestampMillisecond: 1592459848208,
    xMillimeter: 52000,
    userId: '505e9bad279511eab68d7cd30aeb74c6',
    mac: '1918E001FAE3',
    longitude: 120.36142360805042,
    status: 2,
    hgFaceInfo: {
      id: 'rbyr7a_v_8sbgkwq1',
      remarks: null,
      ids: null,
      idList: null,
      companyId: '99rz446zt9fet_lr',
      name: 'aaaa',
      sex: '0',
      ethnic: null,
      certificateType: null,
      certificateNumber: null,
      birthday: null,
      location: null,
      address: null,
      telephone: null,
      email: null,
      personType: '1',
      personCompany: null,
      duty: null,
      workType: null,
      education: null,
      major: null,
      icnumber: '12123',
      entranceNumber: 'zzzzzzzzzzz',
      photo: '',
      educationCertificate: '',
      guid: null,
      employeeId: 'c755f4f3b06a11ea982700163e15b4dc',
      workerNumber: null,
      iconID: null,
      partId: null,
      partName: null,
      companyJob: null,
      companyJobName: null,
      status: null,
      labelId: 'qrqa4e_9dblfpmbr',
      isSN: null,
      photoDetails: null,
      educationCertificateDetails: null,
      companyName: null,
      gridIdList: null,
      companyBasicInfo: null,
      hgAuthorizationManage: null,
      authorizationMessage: null,
    },
  },
  {
    latitude: 31.54596264128945,
    yMillimeter: 19000,
    locationType: 1,
    buildId: '202343',
    floorNo: 'Floor1',
    timestampMillisecond: 1592459848208,
    xMillimeter: 52000,
    userId: '505e9bad279511eab68d7cd30aeb74c6',
    mac: '1918E001FAE3',
    longitude: 120.36140810929106,
    status: 2,
    hgFaceInfo: {
      id: 'rbyr7a_v_8sbgkwq2',
      remarks: null,
      ids: null,
      idList: null,
      companyId: '99rz446zt9fet_lr',
      name: 'bbb',
      sex: '0',
      ethnic: null,
      certificateType: null,
      certificateNumber: null,
      birthday: null,
      location: null,
      address: null,
      telephone: null,
      email: null,
      personType: '1',
      personCompany: null,
      duty: null,
      workType: null,
      education: null,
      major: null,
      icnumber: '12123',
      entranceNumber: 'ccccccccccc',
      photo: '',
      educationCertificate: '',
      guid: null,
      employeeId: 'c755f4f3b06a11ea982700163e15b4dc',
      workerNumber: null,
      iconID: null,
      partId: null,
      partName: null,
      companyJob: null,
      companyJobName: null,
      status: null,
      labelId: 'qrqa4e_9dblfpmbr',
      isSN: null,
      photoDetails: null,
      educationCertificateDetails: null,
      companyName: null,
      gridIdList: null,
      companyBasicInfo: null,
      hgAuthorizationManage: null,
      authorizationMessage: null,
    },
  },
  {
    latitude: 31.545964867960592,
    yMillimeter: 19000,
    locationType: 1,
    buildId: '202343',
    floorNo: 'Floor1',
    timestampMillisecond: 1592459848208,
    xMillimeter: 52000,
    userId: '505e9bad279511eab68d7cd30aeb74c6',
    mac: '1918E001FAE3',
    longitude: 120.3613941235298,
    status: 2,
    hgFaceInfo: {
      id: 'rbyr7a_v_8sbgkwq3',
      remarks: null,
      ids: null,
      idList: null,
      companyId: '99rz446zt9fet_lr',
      name: 'cccc',
      sex: '0',
      ethnic: null,
      certificateType: null,
      certificateNumber: null,
      birthday: null,
      location: null,
      address: null,
      telephone: null,
      email: null,
      personType: '1',
      personCompany: null,
      duty: null,
      workType: null,
      education: null,
      major: null,
      icnumber: '12123',
      entranceNumber: 'sssssssssss',
      photo: '',
      educationCertificate: '',
      guid: null,
      employeeId: 'c755f4f3b06a11ea982700163e15b4dc',
      workerNumber: null,
      iconID: null,
      partId: null,
      partName: null,
      companyJob: null,
      companyJobName: null,
      status: null,
      labelId: 'qrqa4e_9dblfpmbr',
      isSN: null,
      photoDetails: null,
      educationCertificateDetails: null,
      companyName: null,
      gridIdList: null,
      companyBasicInfo: null,
      hgAuthorizationManage: null,
      authorizationMessage: null,
    },
  },
  {
    latitude: 31.546056228302405,
    yMillimeter: 19000,
    locationType: 1,
    buildId: '202343',
    floorNo: 'Floor1',
    timestampMillisecond: 1592459848208,
    xMillimeter: 52000,
    userId: '505e9bad279511eab68d7cd30aeb74c6',
    mac: '1918E001FAE3',
    longitude: 120.36137511023651,
    status: 2,
    hgFaceInfo: {
      id: 'rbyr7a_v_8sbgkwq4',
      remarks: null,
      ids: null,
      idList: null,
      companyId: '99rz446zt9fet_lr',
      name: 'dddd',
      sex: '0',
      ethnic: null,
      certificateType: null,
      certificateNumber: null,
      birthday: null,
      location: null,
      address: null,
      telephone: null,
      email: null,
      personType: '1',
      personCompany: null,
      duty: null,
      workType: null,
      education: null,
      major: null,
      icnumber: '12123',
      entranceNumber: 'aaaaaa',
      photo: '',
      educationCertificate: '',
      guid: null,
      employeeId: 'c755f4f3b06a11ea982700163e15b4dc',
      workerNumber: null,
      iconID: null,
      partId: null,
      partName: null,
      companyJob: null,
      companyJobName: null,
      status: null,
      labelId: 'qrqa4e_9dblfpmbr',
      isSN: null,
      photoDetails: null,
      educationCertificateDetails: null,
      companyName: null,
      gridIdList: null,
      companyBasicInfo: null,
      hgAuthorizationManage: null,
      authorizationMessage: null,
    },
  },
];

const Distance = 9.82986525e-10;
const isNear = (a, b) => {
  const x = a.x - b.x;
  const y = a.y - b.y;
  return x * x + y * y < Distance;
};

// 风险等级1红 2橙 3黄 4蓝
const COLORS = [
  'rgba(254, 0, 3, 0.5)',
  'rgba(236, 106, 52, 0.5)',
  'rgba(236, 242, 65, 0.5)',
  'rgba(20, 35, 196, 0.5)',
];
const StrokeColor = [
  'rgba(254, 0, 3, 1)',
  'rgba(236, 106, 52, 1)',
  'rgba(236, 242, 65, 1)',
  'rgba(20, 35, 196, 1)',
];
let map;
let tool;
let popInfoWindow;
const controls = [
  { label: '风险点', icon: riskPointGray, activeIcon: riskPointActive, markerIcon: riskPoint },
  { label: '视频监控', icon: videoGray, activeIcon: videoActive, markerIcon: video },
  {
    label: '监测设备',
    icon: monitorGray,
    activeIcon: monitorActive,
    markerIcon: monitor,
    alarmIcon: monitorAlarm,
  },
  {
    label: '特种设备',
    icon: specialEquipmentGray,
    activeIcon: specialEquipmentActive,
    markerIcon: specialEquipment,
  },
  {
    label: '人员定位',
    icon: positionGray,
    activeIcon: positionActive,
    markerIcon: helmet1,
  },
  {
    label: '作业票',
    icon: workBillGray,
    activeIcon: workBillActive,
    markerIcon: workBill,
    alarmIcon: workBillAlarm,
  },
];
const paststatusVal = {
  0: '',
  1: '检验即将到期',
  2: '检验已过期',
  null: '',
};
function getColorVal(status) {
  switch (+status) {
    case 0:
      return 'rgba(0, 0, 0, 0.65)';
    case 1:
      return 'rgb(250, 173, 20)';
    case 2:
      return '#f5222d';
    default:
      return;
  }
}
const FourColors = [
  {
    color: '#FE0003',
    label: '重大风险',
  },
  {
    color: '#EC6A34',
    label: '较大风险',
  },
  {
    color: '#ECF241',
    label: '一般风险',
  },
  {
    color: '#1423C4',
    label: '低风险',
  },
];
const filterMarkerList = markerList => {
  return markerList.filter(({ pointFixInfoList }) => {
    if (pointFixInfoList && pointFixInfoList.length > 0) {
      const [{ isShow }] = pointFixInfoList;
      if (+isShow) return true;
    }
    return false;
  });
};

const mapChangeObj = map => {
  let obj = {};
  for (let [k, v] of map) {
    obj[k] = v;
  }
  return obj;
};

@connect(
  ({
    map,
    chemical,
    alarmWorkOrder,
    user,
    specialEquipment,
    emergencyManagement,
    changeWarning,
    licensePlateRecognitionSystem,
    workingBill,
  }) => ({
    map,
    chemical,
    alarmWorkOrder,
    user,
    specialEquipment,
    emergencyManagement,
    changeWarning,
    licensePlateRecognitionSystem,
    workingBill,
  })
)
export default class Map extends PureComponent {
  state = {
    gdMapVisible: false,
    visibles: [true, false, false, false, false, false],
    videoVisible: false,
    videoList: [],
    keyId: undefined,
    truckModalVisible: false,
  };

  ids = [];
  fourColorPolygons = []; // 四色图polygons
  polygonLayers = [];
  markerArray = [];
  markerLayers = [];
  lastTime = 0;
  jumpEquipIds = [];
  jumpFireIds = [];
  workBillMarkers = []; // 作业票markers
  workBillPolygons = []; // 作业票polygons
  positionMarkers = []; // 人员定位markers
  positionLabelMarkers = []; // 人员定位labels

  /* eslint-disable*/
  componentDidMount() {
    // this.initMap();
    const { companyId } = this.props;
    this.fetchMap();
    const { onRef } = this.props;
    onRef && onRef(this);
    this.fetchDict({ type: 'specialEquipment' });
    this.fetchOnDuty({ companyId });
    // cacheHandleFocusPositionFn(this.handleFocusPosition);
  }

  fetchMap = () => {
    const { mapInfo } = this.props;
    this.initMap({ ...mapInfo }, () => {
      this.fetchMapAreaList();
      [
        'chemical/fetchRiskPoint',
        'chemical/fetchVideoList',
        'chemical/fetchMonitorEquipment',
        'specialEquipment/fetchSpecialEquipList',
      ].map((type, index) => {
        this.fetchPonits(type, index);
        return null;
      });
      this.fetchPonits('chemical/fetchFireDevice', 2);
      this.renderPosition();
      this.renderWorkingBill();

      setTimeout(() => {
        this.markerArray[0].image = positionGray;
        this.markerArray[0].floorId = 3;
      }, 8000);
    });
  };

  renderPosition = () => {
    // 人员定位
    const { dispatch, companyId } = this.props;
    dispatch({
      type: 'chemical/getLocation',
      payload: { companyId },
      callback: res => {
        const { visibles } = this.state;
        const iconType = 4;
        mockData.map(item => {
          // res.data.list.map((item, index) => {
          const {
            latitude,
            longitude,
            status,
            floorNo,
            hgFaceInfo: { id, name, iconID },
          } = item;
          // status 0 运动、1 报警、2 休眠
          const floorId = +floorNo.split('Floor')[1];
          const position = new jsmap.JSPoint(longitude, latitude, 0);
          const position2 = new jsmap.JSPoint(longitude, latitude, 5);
          const url = [helmet1, helmet2, helmet3, helmet4, helmet5, helmet6][
            iconID ? iconID - 1 : 0
          ];
          const alarmUrl = [
            helmetAlarm1,
            helmetAlarm2,
            helmetAlarm3,
            helmetAlarm4,
            helmetAlarm5,
            helmetAlarm6,
          ][iconID ? iconID - 1 : 0];
          // if (+status === 2) {
          //   const alarmUrl = [helmetAlarm1, helmetAlarm2, helmetAlarm3, helmetAlarm4, helmetAlarm5, helmetAlarm6][
          //     iconID ? iconID - 1 : 0
          //   ];
          //   const alarm = this.addMarkers({
          //     image: alarmUrl, //图片路径
          //     position,
          //     floorId, //楼
          //     properties: { ...item, iconType },
          //     show: visibles[iconType],
          //     width: 80,
          //     height: 80,
          //     offset: jsmap.JSControlPosition.LEFT_TOP,
          //   });
          // }
          const marker = this.addMarkers({
            image: +status === 1 ? alarmUrl : url, //图片路径
            position,
            floorId, //楼
            properties: { ...item, iconType },
            show: visibles[iconType],
            width: +status === 1 ? 80 : 50,
            height: +status === 1 ? 80 : 50,
          });
          this.positionMarkers.push(marker);
          const labelMarker = this.renderLabelMarker({
            id,
            text: name,
            position: position2,
            floorId,
            properties: item,
            show: visibles[iconType],
          });
          this.positionLabelMarkers.push(labelMarker);
          return null;
        });
      },
    });
  };

  renderPosition2 = () => {
    // 人员定位
    const { dispatch, companyId } = this.props;
    dispatch({
      type: 'chemical/fetchMonitorEquipment',
      payload: { companyId, pageNum: 1, pageSize: 0 },
      callback: res => {
        const { visibles } = this.state;
        const iconType = 4;
        filterMarkerList(res.data.list).map((item, index) => {
          const { groupId, xnum, ynum, znum } = item.pointFixInfoList[0];
          const position = tool.MercatorToWGS84(new jsmap.JSPoint(+xnum, +ynum, 0));
          const position2 = tool.MercatorToWGS84(new jsmap.JSPoint(+xnum, +ynum, 5));
          let url = controls[iconType].markerIcon;
          const marker = this.addMarkers({
            image: url, //图片路径
            position,
            floorId: +groupId, //楼
            properties: { ...item, iconType },
            show: visibles[iconType],
          });
          this.renderLabelMarker({
            text: `name${index}`,
            position: position2,
            floorId: +groupId,
            properties: item,
          });
          return null;
        });
      },
    });
  };

  renderLabelMarker = (markerProps = {}) => {
    const labelMarker = new jsmap.JSLabelMarker({
      // id: 'selectedMarker', //id
      position: new jsmap.JSPoint(0, 0, 0),
      text: '',
      floorId: 1,
      font: 'normal 12px 微软雅黑',
      color: '#000',
      labelStyle: jsmap.JSLabelStyle.FILL,
      // offset: jsmap.JSControlPosition.RIGHT_TOP,
      offset: jsmap.JSControlPosition.CENTER_TOP,
      // offset: new jsmap.JSPoint(0, 100, 0),
      showBackground: true,
      backgroundColor: '#fff',
      depthTest: false,
      ...markerProps,
      show: undefined,
      callback: node => {
        node.show = !!markerProps.show;
      }, //回调
    });
    map.addMarker(labelMarker);
    return labelMarker;
  };

  renderWorkingBill = () => {
    // 作业票
    const { dispatch, companyId } = this.props;
    const iconType = 5;
    dispatch({
      type: 'workingBill/getList',
      payload: {
        companyId,
        pageNum: 1,
        pageSize: 0,
        // approveStatus: 2,
        // startWorkingDate: moment().format('YYYY-MM-DD 00:00'),
        // endWorkingDate: moment().format('YYYY-MM-DD 23:59'),
      },
      callback: (success, { list }) => {
        if (!success) return;
        list.map(item => {
          const { mapAddress } = item;
          const { visibles } = this.state;
          if (!mapAddress || !JSON.parse(mapAddress).length) return;
          const points = JSON.parse(mapAddress).map(p =>
            tool.MercatorToWGS84(new jsmap.JSPoint(+p.x, +p.y, 0))
          );
          const { floorId, x, y, z } = points[0];
          const polygonMarker = this.addPolygon({
            floorId: +floorId,
            position: points,
            color: COLORS[3],
            strokeColor: StrokeColor[3],
            polygonProps: { ...item, polygonType: 2 }, // polygonType 1 四色图， 2 作业票
            show: visibles[iconType],
          });
          this.workBillPolygons.push(polygonMarker);

          const marker = this.addMarkers({
            image: workBill, //图片路径
            position: new jsmap.JSPoint(+x, +y, 0),
            floorId: +floorId, //楼
            properties: { ...item, iconType },
            show: visibles[iconType],
          });
          this.workBillMarkers.push(marker);
        });
      },
    });
  };

  fetchDict = (payload, success, error) => {
    const { dispatch } = this.props;
    dispatch({ type: 'emergencyManagement/fetchDicts', payload, success, error });
  };

  fetchOnDuty = (payload, callback) => {
    const { dispatch } = this.props;
    dispatch({ type: 'chemical/fetchOnDuty', payload, callback });
  };

  // 获取区域列表
  fetchMapAreaList = () => {
    const { dispatch, companyId } = this.props;
    dispatch({
      type: 'map/fetchMapAreaList',
      payload: { companyId, pageNum: 1, pageSize: 0 },
      callback: ({ list }) => {
        list.map(polygon => {
          const { zoneLevel, coordinateList, groupId, modelIds } = polygon;
          const points = coordinateList.map(item =>
            tool.MercatorToWGS84(new jsmap.JSPoint(+item.x, +item.y, 0))
          );
          const polygonMarker = this.addPolygon({
            floorId: +groupId,
            position: points,
            color: COLORS[zoneLevel - 1],
            strokeColor: StrokeColor[zoneLevel - 1],
            polygonProps: { ...polygon, polygonType: 1 },
          });
          return null;
        });
        // 变更预警管理
        this.handleChangeWarning();
      },
    });
  };

  // 变更预警管理
  handleChangeWarning = () => {
    const { dispatch, companyId } = this.props;
    dispatch({
      type: 'chemical/fetchWarningNewList',
      payload: { companyId, pageNum: 1, pageSize: 0, status: 0 },
      callback: response => {
        const { code, data } = response || {};
        if (!(code === 200 && data && data.list)) return;
        const warningList = data.list;
        this.removeMarkersByType(-1);
        this.fourColorPolygons.map(polygon => {
          const properties = polygon.getProperties();
          const coordinateList = properties.get('coordinateList');
          const id = properties.get('id');
          const floorId = +properties.get('groupId');
          if (JSON.stringify(warningList).indexOf(id) < 0) {
            if (popInfoWindow) {
              // 关闭风险变更的提示
              const {
                options_: { zoneId },
              } = popInfoWindow;
              if (id === zoneId) popInfoWindow.show = false;
            }
            return null;
          }
          this.addMarkers({
            image: iconTips, //图片路径
            position: new jsmap.JSPoint(+coordinateList[0].x, +coordinateList[0].y, 0),
            floorId, //楼
            properties: { zoneId: id, iconType: -1 },
            width: 25,
            height: 25,
            offset: jsmap.JSControlPosition.CENTER,
          });
          return null;
        });
      },
    });
  };

  // 添加/替换特种设备图标及信息
  handleAddSpecialEquipment = info => {
    const { id } = info;
    this.removeMarkerById(id);
    this.renderPoints([info], 3);
  };

  renderPoints = (pointsInfo, iconType) => {
    // if (!pointsInfo.length) return;
    const { visibles } = this.state;
    filterMarkerList(pointsInfo).map(item => {
      const { warnStatus, status, deviceCode, pointCountMap, id } = item;
      const { groupId, xnum, ynum, znum } = item.pointFixInfoList[0];
      const position = tool.MercatorToWGS84(new jsmap.JSPoint(+xnum, +ynum, 0));
      if (iconType === 1 && +status !== 1) return null; // 筛选掉禁用的视频
      let url = controls[iconType].markerIcon;
      if (iconType === 2) {
        if (deviceCode || deviceCode === 0) {
          // 消防主机
          const { fire_state } = pointCountMap || {};
          if (+fire_state > 0) url = controls[iconType].alarmIcon;
          else controls[iconType].markerIcon;
        } else if (warnStatus === -1) url = controls[iconType].alarmIcon;
      }
      const marker = this.addMarkers({
        image: url, //图片路径
        position,
        floorId: +groupId, //楼
        properties: { ...item, iconType },
        show: visibles[iconType],
      });
      return null;
    });
  };

  // 获取点位信息
  fetchPonits = (type, iconType, payload = {}, isUpdate = false) => {
    if (!type) return null;
    const { dispatch, companyId } = this.props;
    dispatch({
      type,
      payload: { companyId, pageNum: 1, pageSize: 0, ...payload },
      callback: res => {
        console.log('pointsInfo', filterMarkerList(res.data.list));
        if (isUpdate) this.removeMarkersByType(iconType);
        this.renderPoints(res.data.list, iconType);
      },
    });
  };

  handleJumpChangeWarning = () => {
    window.open(`${window.publicPath}#/risk-control/change-warning/list`, `_blank`);
  };

  // 初始化地图定位
  initMap = (
    { appName, key, mapId, defaultMapScaleLevel, theme, mapScaleLevelRangeList, defaultViewMode },
    fun
  ) => {
    if (!key || !mapId) return;
    const mapOptions = {
      mapType: jsmap.JSMapType.MAP_PSEUDO_3D,
      container: 'mapContainer',
      token: key,
      mapServerURL: './data/map',
      backgroundColor: 'transparent',
    };
    map = new jsmap.JSMap(mapOptions);
    map.openMapById(mapId);
    console.log('map', map);
    tool = new jsmap.JSMapCoordTool(map);

    // 地图加载完成事件
    map.on('loadComplete', () => {
      if (!map) return;
      this.loadBtnFloorCtrl();
      // 四色图
      fun && fun();
    });

    // 地图点击事件
    map.on('mapClickNode', event => {
      const {
        handleClickRiskPoint,
        setDrawerVisible,
        handleShowAreaDrawer,
        handleClickMonitorIcon,
        handleClickFireMonitor,
      } = this.props;
      const clickedObj = event;
      console.log('clickedObj', clickedObj);
      if (!clickedObj || !clickedObj.nodeType) return;
      const {
        nodeType,
        floorId,
        eventInfo: { coord },
      } = clickedObj;
      if (nodeType === jsmap.JSNodeType.POLYGON_MARKER) {
        // 点击区域
        const { visibles } = this.state;
        // 作业票 return
        if (visibles[5]) return;
        const { id } = clickedObj;
        handleShowAreaDrawer(id);
      }
      if (nodeType === jsmap.JSNodeType.IMAGE_MARKER) {
        // 点击图标
        const { properties, node } = clickedObj;
        const iconType = properties.get('iconType');
        const markerProps = mapChangeObj(properties);
        const position = new jsmap.JSPoint(node.x, node.y, 0);
        switch (iconType) {
          case 0:
            // 风险点
            const itemId = properties.get('itemId');
            const status = properties.get('status');
            handleClickRiskPoint(itemId, status);
            break;
          case 1:
            // 视频监控
            const keyId = properties.get('keyId');
            this.handleShowVideo(keyId);
            break;
          case 2:
            // 监测设备
            const deviceCode = properties.get('deviceCode');
            if (deviceCode || deviceCode === 0) {
              // 消防主机
              handleClickFireMonitor(markerProps);
            } else {
              // 监测设备
              this.handleClickMonitorEquip(markerProps.id);
            }
            break;
          case 3:
            // 特种设备
            this.handleShowSpecialInfo(markerProps, floorId, tool.MercatorToWGS84(position));
            break;
          case 4:
            // 人员定位
            this.handleClickPosition(markerProps, floorId, tool.MercatorToWGS84(position));
            break;
          case 5:
            // 作业票
            this.handleShowWorkBillInfo(markerProps, floorId, tool.MercatorToWGS84(position));
            break;
          case -1:
            // 变更预警
            const { zoneId } = markerProps;
            this.handleShowChangeWarning(zoneId, floorId, tool.MercatorToWGS84(position));
            break;
          default:
            console.log('iconType', iconType);
            break;
        }
      }
      if (nodeType === jsmap.JSNodeType.LABEL_MARKER) {
        const { properties, node } = clickedObj;
        const iconType = properties.get('iconType');
        const markerProps = mapChangeObj(properties);
        const position = new jsmap.JSPoint(node.x, node.y, 0);
        // 人员定位
        this.handleClickPosition(markerProps, floorId, position);
      }
    });
  };

  handleUpdatePosition = ({ floorNo, latitude, longitude, status, userId }) => {
    const {
      chemical: { locations = [] },
    } = this.props;
    const { visibles } = this.state;
    const iconType = 4;
    const point = new jsmap.JSPoint(longitude, latitude, 0);
    const focus = this.positionMarkers.find(item => {
      const { entranceNumber } = item.getProperties().get('hgFaceInfo');
      return entranceNumber === userId;
    });
    if (!focus) return;
    const label = this.positionLabelMarkers.find(item => {
      const { entranceNumber } = item.getProperties().get('hgFaceInfo');
      return entranceNumber === userId;
    });
    if (
      floorId === focus.floorId &&
      longitude === focus.position.x &&
      latitude === focus.position.y
    ) {
      // 位置没改return
      return;
    }
    if (visibles[5] && !visibles[4]) {
      // 显示作业票， 不显示人员定位时， 移动到作业票区域内人员也要显示
      const isInPolygon = !this.workBillPolygons.every(
        polygon => !isPointInPolygon(point, polygon.position)
      );
      if (isInPolygon) {
        focus.show = true;
        label.show = true;
      } else {
        focus.show = false;
        label.show = false;
      }
    }
    const floorId = +floorNo.split('Floor')[1];
    if (floorId === focus.floorId) {
      focus.moveTo(point);
      label.moveTo(new jsmap.JSPoint(longitude, latitude, 5));
      popInfoWindow.moveTo(point);
    } else {
      const properties = mapChangeObj(focus.getProperties());
      map.removeMarker(focus);
      map.removeMarker(label);
      this.positionMarkers = this.positionMarkers.filter(item => item => {
        const { entranceNumber } = item.getProperties().get('hgFaceInfo');
        return entranceNumber !== userId;
      });
      this.positionLabelMarkers = this.positionLabelMarkers.filter(item => item => {
        const { entranceNumber } = item.getProperties().get('hgFaceInfo');
        return entranceNumber !== userId;
      });
      const marker = this.addMarkers({
        image: +status === 1 ? alarmUrl : url, //图片路径
        position: new jsmap.JSPoint(longitude, latitude, 0),
        floorId, //楼
        properties,
        show: visibles[iconType],
        width: +status === 1 ? 80 : 50,
        height: +status === 1 ? 80 : 50,
      });
      this.positionMarkers.push(marker);
      const labelMarker = this.renderLabelMarker({
        id,
        text: properties.hgFaceInfo.name,
        position: new jsmap.JSPoint(longitude, latitude, 5),
        floorId,
        properties,
        show: visibles[iconType],
      });
      this.positionLabelMarkers.push(labelMarker);
      if (popInfoWindow) {
        map.removeMarker(popInfoWindow);
        popInfoWindow = null;
      }
    }
  };

  handleOneKeyAlarm = socketProps => {
    const { event, mac } = socketProps;
    // event   alarm  cancel_alarm
    // mac    sn号
    if (event === 'alarm') console.log('socketProps', socketProps);
  };

  // 点击人员定位事件
  handleClickPosition = (markerProps, floorId, position) => {
    this.handleFocusPosition(markerProps.hgFaceInfo.entranceNumber);
    this.handleShowPersonList(position);
    // this.handleShowPositionInfo(markerProps, floorId, tool.MercatorToWGS84(position));
  };

  // 点击监测设备重新获取信息 重绘点位 显示详情内容
  handleClickMonitorEquip = equipmentId => {
    const { dispatch, handleClickMonitorIcon } = this.props;
    dispatch({
      type: 'alarmWorkOrder/getDeviceDetail',
      payload: { id: equipmentId },
      callback: (success, deviceDetail) => {
        if (success) {
          this.removeMarkerById(equipmentId);
          this.renderPoints([deviceDetail], 2);
          handleClickMonitorIcon(deviceDetail);
        }
      },
    });
  };

  // 点击focus到焦点
  handleFocusPosition = snId => {
    const {
      chemical: { locations = [] },
    } = this.props;
    const focus = this.positionMarkers.find(item => {
      const { entranceNumber } = item.getProperties().get('hgFaceInfo');
      return entranceNumber === snId;
    });

    if (focus) {
      map.flyToMarker(focus);
      this.handleShowPositionInfo(
        mapChangeObj(focus.getProperties()),
        focus.floorId,
        focus.position
      );
    }
  };

  // 显示附近人员列表
  handleShowPersonList = position => {
    const {
      chemical: { locations = [] },
      handleProductionOpen,
    } = this.props;
    const filteredList = mockData.filter(item => {
      const { longitude, latitude } = item;
      return isNear({ x: longitude, y: latitude }, position);
    });
    handleProductionOpen('position', filteredList);
  };

  // 变更预警
  handleShowChangeWarning = (zoneId, floorId, position) => {
    const { companyId } = this.props;
    if (popInfoWindow) {
      map.removeMarker(popInfoWindow);
      popInfoWindow = null;
    }
    const content = `<div style="line-height: 24px;font-size: 14px;padding: 10px 15px;height: 100%;border: 1px solid #f83329;border-radius: 5px;min-width: 400px;color: #fff;">
          <div style="font-size: 16px;">
            <span style="display: inline-block;width: 20px;height: 20px;margin-right: 5px;position: relative;top: 4px;background: url(${iconTips}) center center / 100% 100% no-repeat;"></span>
            风险变更预警
          </div>
          <div style="padding-left: 30px;">此区域有变更，请对该区域重新进行风险评价。</div>
          <div style="text-align: right;color: #0ff;">
            <span style="cursor: pointer;" onclick="window.open('${
              window.publicPath
            }#/risk-control/change-warning/list?companyId=${companyId}&status=0&zoneId=${zoneId}','_blank');">查看详情>></span></div>
        </div>`;
    popInfoWindow = new jsmap.JSPopInfoMarker({
      id: 'popInfoWindow',
      floorId: map.focusFloorId,
      content,
      position,
      properties: { zoneId },
      showCloseButton: true,
    });
    map.addMarker(popInfoWindow);
  };

  handleShowSpecialInfo = (info, floorId, position) => {
    const {
      emergencyManagement: { specialEquipment = [] },
    } = this.props;
    const { brand, equipName, factoryNumber, contact, endDate, category, paststatus, id } = info;
    const pastColor = getColorVal(paststatus);
    const paststatusStr = paststatusVal[paststatus]
      ? `<span style="font-size: 12px;color: ${pastColor};border: 1px solid ${pastColor};padding: 0 8px;border-radius: 10px;margin-left: 25px;">${
          paststatusVal[paststatus]
        }</span>`
      : '';
    let treeData = specialEquipment;
    const string = category
      .split(',')
      .map(id => {
        const val = treeData.find(item => item.id === id) || {};
        treeData = val.children || [];
        return val.label;
      })
      .join('>');
    const noData = '--';
    const content = `<div class="specContainer">
      <div class="specTitle">特种设备${paststatusStr}</div>
      <div class="specWrapper specOver">
        <div class="specLabel">分类：</div>
        <div class="specValue">${string || noData}</div>
        <div class="specTip">
          <span class="specTrigle"></span>
          ${string || noData}
        </div>
      </div>
      <div class="specWrapper">
        <div class="specLabel">品牌：</div>
        <div class="specValue">${brand || noData}</div>
      </div>
      <div class="specWrapper">
        <div class="specLabel">设备名称：</div>
        <div class="specValue">${equipName || noData}</div>
      </div>
      <div class="specWrapper">
        <div class="specLabel">出厂编号：</div>
        <div class="specValue">${factoryNumber || noData}</div>
      </div>
      <div class="specWrapper">
        <div class="specLabel">联系人：</div>
        <div class="specValue">${contact || noData}</div>
      </div>
      <div class="specWrapper">
        <div class="specLabel">检验有效期至：</div>
        <div class="specValue">${endDate ? moment(endDate).format('YYYY年MM月DD日') : noData}</div>
      </div>
      <div class="specFile" onclick="window.open('${
        window.publicPath
      }#/facility-management/special-equipment/inspection-report/${id}','_blank');">查看检验报告>></div>
    </div>
    <style>
      .specContainer {
        position: relative;
        line-height: 24px;
        color: #fff;
        font-size: 14px;
        padding: 10px 15px;
        height: 100%;
        border: 1px solid rgba(0,255,255,0.3);
        border-radius: 5px;
        min-width: 450px;
      }
      .specTitle {
        font-size: 16px;
        line-height: 32px;
      }
      .specOver {
        position: relative;
      }
      .specTip {
        display: none;
        position: absolute;
        width: calc(100% - 11em);
        left: 7em;
        background: #116fda;
        z-index: 6;
        padding: 6px 12px;
        border-radius: 5px;
        top: 28px;
      }
      .specTrigle {
        position: absolute;
        top: -16px;
        left: 15px;
        width: 0;
        height:0;
        display: inline-block;
        border-style: solid;
        border-width: 10px;
        border-color: #116fda transparent transparent;
        width: 0px;
        height: 0px;
        transform: rotate(180deg);
      }
      .specOver:hover .specTip {
        display: block;
      }
      .specLabel {
        color: #979495;
        display: inline-block;
        width: 7em;
        white-space: nowrap;
        vertical-align: middle;
      }
      .specValue {
        display: inline-block;
        width: calc(100% - 7.5em);
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        vertical-align: middle;
      }
      .specFile {
        color: #0ff;
        position: absolute;
        bottom: 10px;
        right: 15px;
        cursor: pointer;
      }
    </style>`;
    if (popInfoWindow) {
      map.removeMarker(popInfoWindow);
      popInfoWindow = null;
    }
    popInfoWindow = new jsmap.JSPopInfoMarker({
      id: 'popInfoWindow',
      floorId: map.focusFloorId,
      content,
      position,
      // marginTop: 0,
      properties: info,
      showCloseButton: true,
    });
    map.addMarker(popInfoWindow);
  };

  handleShowWorkBillInfo = (info, floorId, position) => {
    const {
      billCode,
      billType,
      workingStatus,
      applyUserName,
      applyDepartmentName,
      workingEndDate,
      workingStartDate,
      id,
    } = info;
    const noData = '--';
    const content = `<div class="specContainer">
        <div class="specTitle">作业票</div>
        <div class="specWrapper">
          <div class="specLabel">作业证名称：</div>
          <div class="specValue">${(TYPES.find(item => +item.key === +billType) || {}).value ||
            noData}</div>
        </div>
        <div class="specWrapper">
          <div class="specLabel">作业证编号：</div>
          <div class="specValue">${billCode || noData}</div>
        </div>
        <div class="specWrapper">
          <div class="specLabel">申请人：</div>
          <div class="specValue">${applyUserName || noData}</div>
        </div>
        <div class="specWrapper">
          <div class="specLabel">申请部门：</div>
          <div class="specValue">${applyDepartmentName || noData}</div>
        </div>
        <div class="specWrapper">
          <div class="specLabel">作业时间：</div>
          <div class="specValue">${moment(workingStartDate).format(MINUTE_FORMAT)} ~ ${moment(
      workingEndDate
    ).format(MINUTE_FORMAT)}</div>
        </div>
        <div class="specWrapper">
          <div class="specLabel">作业状态：</div>
          <div class="specValue">${(
            WORKING_STATUSES.find(item => +item.key === +workingStatus) || {}
          ).value || noData}</div>
        </div>
        <div class="specFile" onclick="window.open('${
          window.publicPath
        }#/operation-safety/working-bill/${billType}/detail/${id}','_blank');">详情>></div>
      </div>
      <style>
        .specContainer {
          position: relative;
          line-height: 24px;
          color: #fff;
          font-size: 14px;
          padding: 10px 15px;
          height: 100%;
          border: 1px solid rgba(0,255,255,0.3);
          border-radius: 5px;
          min-width: 450px
        }
        .specTitle {
          font-size: 16px;
          line-height: 32px;
        }
        .specLabel {
          color: #979495;
          display: inline-block;
          width: 7em;
          white-space: nowrap;
          vertical-align: middle;
        }
        .specValue {
          display: inline-block;
          width: calc(100% - 7.5em);
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          vertical-align: middle;
        }
        .specFile {
          color: #0ff;
          position: absolute;
          bottom: 10px;
          right: 15px;
          cursor: pointer;
        }
      </style>`;
    if (popInfoWindow) {
      map.removeMarker(popInfoWindow);
      popInfoWindow = null;
    }
    popInfoWindow = new jsmap.JSPopInfoMarker({
      id: 'popInfoWindow',
      floorId: map.focusFloorId,
      content,
      position,
      // marginTop: 0,
      properties: info,
      showCloseButton: true,
    });
    map.addMarker(popInfoWindow);
  };

  handleShowPositionInfo = (info, floorId, position) => {
    const {
      hgFaceInfo: { id, name, sex, entranceNumber, icnumber, companyJobName, photoDetails = [] },
    } = info;
    const photo = (photoDetails || [])[0] || {};
    const avatar = photo.webUrl || imgNoAvatar;
    const noData = '--';
    const content = `
      <div class="specContainer">
        <div class="top">
          <div class="left"><img src="${avatar}" alt="avatar" style="width: ${
      photo.webUrl ? '100%' : '70%'
    }" /></div>
          <div class="right">
            <div class="specTitle">${name}</div>
            <div class="specWrapper">
              <div class="specLabel">性别：</div>
              <div class="specValue">${['男', '女'][+sex] || noData}</div>
            </div>
            <div class="specWrapper">
            <div class="specLabel">SN：</div>
              <div class="specValue">${entranceNumber || noData}</div>
            </div>
            <div class="specWrapper">
              <div class="specLabel">人员类型：</div>
              <div class="specValue">${companyJobName || noData}</div>
            </div>
            <div class="specWrapper">
              <div class="specLabel">区域：</div>
              <div class="specValue">${noData}</div>
            </div>
            <div class="specWrapper">
              <div class="specLabel">门禁卡号：</div>
              <div class="specValue">${icnumber || noData}</div>
            </div>
          </div>
        </div>
        <div class="bottom">
          <div class="trackBtn" onclick="window.open('${
            window.publicPath
          }#/personnel-position/track/index?trackSn=${entranceNumber}','_blank');">跟踪</div>
        </div>
      </div>

      <style>
        .specContainer {
          position: relative;
          line-height: 24px;
          color: #fff;
          font-size: 14px;
          padding: 10px 15px;
          height: 100%;
          border: 1px solid rgba(0,255,255,0.3);
          border-radius: 5px;
          min-width: 450px;
        }
        .top {
          display: flex;
        }
        .bottom {
          text-align: center;
          margin-top: 5px;
        }
        .trackBtn {
          background-color: #1470D7;
          padding: 6px 12px;
          border-radius: 5px;
          width: 60px;
          margin: 0 auto;
          cursor: pointer;
        }
        .trackBtn:hover {
          opacity: 0.8;
        }
        .left {
          width: 120px;
          background-color: rgba(0, 30, 56, 0.45);
          display: inline-block;
          text-align: center;
          border: 1px solid #1A5E8E;
          margin-right: 15px;
        }
        .right {
          flex: 1;
        }
        .left img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
        .specTitle {
          font-size: 16px;
          line-height: 32px;
        }
        .specLabel {
          color: #979495;
          display: inline-block;
          width: 5em;
          white-space: nowrap;
          vertical-align: middle;
        }
        .specValue {
          display: inline-block;
          width: calc(100% - 7.5em);
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          vertical-align: middle;
        }
      </style>`;
    if (popInfoWindow) {
      map.removeMarker(popInfoWindow);
      popInfoWindow = null;
    }
    popInfoWindow = new jsmap.JSPopInfoMarker({
      id: 'popInfoWindow',
      floorId: map.focusFloorId,
      content,
      position,
      // marginTop: 0,
      properties: info,
      showCloseButton: true,
    });
    map.addMarker(popInfoWindow);
  };

  //加载按钮型楼层切换控件
  loadBtnFloorCtrl = () => {
    const {
      user: {
        currentUser: { permissionCodes },
      },
    } = this.props;
    const floorControl = new jsmap.JSFloorControl({
      position: jsmap.JSControlPosition.LEFT_TOP, //控件在容器中的位置             ??????
      showBtnCount: 6, //默认显示楼层的个数 TODO
      allLayers: false, //初始是否是多层显示，默认单层显示
      needAllLayerBtn: true, // 是否显示多层/单层切换按钮
      offset: {
        x: 0,
        y: permissionCodes.includes('dashboard.personnelPositioningView') ? 45 : -5,
      }, //位置 x,y 的偏移量
    });
    map.addControl(floorControl);
  };

  removeMarkersByType = iconType => {
    if (!map) return;
    map.removeMarkerByFilter(jsmap.JSMarkerType.IMAGE_MARKER, `iconType == ${iconType}`);
  };

  removeMarkerById = equipmentId => {
    if (!map) return;
    map.removeMarkerByFilter(jsmap.JSMarkerType.IMAGE_MARKER, `id == '${equipmentId}'`);
    return null;
  };

  // 监测设备状态变化
  handleUpdateMap = (equipmentId, statusType) => {
    if (!map || !this.markerArray.length) return;
    const { dispatch, companyId } = this.props;
    dispatch({
      type: 'alarmWorkOrder/getDeviceDetail',
      payload: { id: equipmentId },
      callback: (success, deviceDetail) => {
        if (success) {
          const { warnStatus } = deviceDetail;
          this.removeMarkerById(equipmentId);
          if (statusType === -1) {
            if (this.jumpEquipIds.indexOf(equipmentId) < 0) this.jumpEquipIds.push(equipmentId);
          } else if (statusType === 1 && warnStatus !== -1) {
            this.jumpEquipIds = this.jumpEquipIds.filter(ids => ids !== equipmentId);
          }
          this.renderPoints([deviceDetail], 2);
        }
      },
    });
  };

  handleUpdateFire = (equipmentId, statusType, fixType) => {
    if (equipmentId && +statusType === -1 && +fixType === 5) {
      // 火警
      if (this.jumpFireIds.indexOf(equipmentId) < 0) this.jumpFireIds.push(equipmentId);
    }
    const { dispatch, companyId } = this.props;
    dispatch({
      type: 'chemical/fetchFireDevice',
      payload: { companyId, pageNum: 1, pageSize: 0 },
      callback: res => {
        const pointsInfo = filterMarkerList(res.data.list);
        pointsInfo.map(item => {
          const { pointCountMap } = item;
          const { fire_state } = pointCountMap || {};
          this.removeMarkerById(item.id);
          this.renderPoints([item], 2);
          if (!fire_state) this.jumpFireIds = this.jumpFireIds.filter(ids => ids !== item.id);
        });
      },
    });
    return null;
  };

  addMarkers = (markerProps = {}) => {
    const imageMarker = new jsmap.JSImageMarker({
      // id: 'selectedMarker', //id
      image: monitor, //图片路径
      position: new jsmap.JSPoint(0, 0, 0), //坐标位置
      width: 50, //尺寸-宽
      height: 50, //尺寸-高
      floorId: 1, //楼层 id
      offset: jsmap.JSControlPosition.RIGHT_BOTTOM, //偏移位置
      depthTest: false, //是否开启深度检测
      ...markerProps,
      show: undefined, // ??????????
      callback: node => {
        node.show = markerProps.show === undefined ? true : !!markerProps.show;
      }, //回调
    });
    map.addMarker(imageMarker);
    this.markerArray.push(imageMarker);
    return imageMarker;
  };

  addPolygon = ({
    // floorId,
    position,
    // color,
    // strokeColor,
    polygonProps = {},
    show = true,
    ...restProps
  }) => {
    const polygonMarker = new jsmap.JSPolygonMarker({
      id: polygonProps.id,
      position,
      floorId: 1,
      // color,
      // strokeColor: strokeColor,
      properties: polygonProps,
      strokeWidth: 2, //边线宽度
      depthTest: false, //是否开启深度检测
      callback: marker => {
        marker.show = show;
      },
      ...restProps,
    });
    this.fourColorPolygons.push(polygonMarker);
    map.addMarker(polygonMarker);
    return polygonMarker;
  };
  /* eslint-disable*/

  handleClickMap = () => {
    this.setState({ gdMapVisible: false });
    this.initMap();
  };

  // 跳转到人员定位
  handlePosition = () => {
    const { companyId } = this.props;
    window.open(`${window.publicPath}#/big-platform/personnel-position/${companyId}`, `_blank`);
  };

  // 切换图标是否显示
  handleClickControl = index => {
    const { visibles } = this.state;
    const copy = [...visibles];
    copy[index] = !visibles[index];
    this.setState({ visibles: copy });
    map.setMarkerVisibleByFilter(
      jsmap.JSMarkerType.IMAGE_MARKER,
      copy[index],
      properties => +properties.get('iconType') === index
    );
  };

  // 作业票是否显示
  handleToggleWorkBill = () => {
    const iconType = 5;
    const { visibles } = this.state;
    const visible = visibles[iconType];
    map.setMarkerVisibleByFilter(jsmap.JSMarkerType.POLYGON_MARKER, !visible, `polygonType == 2`);
    map.setMarkerVisibleByFilter(
      jsmap.JSMarkerType.IMAGE_MARKER,
      !visible,
      properties => +properties.get('iconType') === iconType
    );

    // 四色图与作业票互斥
    map.setMarkerVisibleByFilter(jsmap.JSMarkerType.POLYGON_MARKER, visible, `polygonType == 1`);

    const copy = [...visibles];
    copy[iconType] = !visible;
    this.setState({ visibles: copy });

    if (!visibles[4]) {
      if (!visible) {
        // 显示作业票， 不显示人员定位， 仅显示作业票区域内的人员
        this.handleShowPositionInWorkBill();
      } else {
        // 不显示作业票， 不显示人员定位
        this.positionMarkers.map(item => {
          item.show = false;
          return null;
        });
        this.positionLabelMarkers.map(item => {
          item.show = false;
          return null;
        });
      }
    }
  };

  handleTogglePosition = () => {
    const { handleParentChange } = this.props;
    const iconType = 4;
    const { visibles } = this.state;
    const visible = visibles[iconType];
    const copy = [...visibles];
    copy[iconType] = !visible;
    this.setState({ visibles: copy });
    // map.setMarkerVisibleByFilter(
    //   jsmap.JSMarkerType.IMAGE_MARKER,
    //   !visible,
    //   properties => +properties.get('iconType') === iconType
    // );
    // map.setMarkerVisibleByFilter(jsmap.JSMarkerType.LABEL_MARKER, !visible, properties => true);
    handleParentChange({ showDistribution: !visible });

    if (visibles[5]) {
      if (visible) {
        this.handleShowPositionInWorkBill();
      } else {
        this.positionMarkers.map(item => {
          item.show = true;
          return null;
        });
        this.positionLabelMarkers.map(item => {
          item.show = true;
          return null;
        });
      }
    } else {
      this.positionMarkers.map(item => {
        item.show = !visible;
        return null;
      });
      this.positionLabelMarkers.map(item => {
        item.show = !visible;
        return null;
      });
    }
  };

  handleShowPositionInWorkBill = () => {
    this.positionMarkers.map(item => {
      const point = item.position;
      const isInPolygon = !this.workBillPolygons.every(
        polygon => !isPointInPolygon(point, polygon.position)
      );
      if (isInPolygon) item.show = true;
      else item.show = false;
      return null;
    });
    this.positionLabelMarkers.map(item => {
      const point = item.position;
      const isInPolygon = !this.workBillPolygons.every(
        polygon => !isPointInPolygon(point, polygon.position)
      );
      if (isInPolygon) item.show = true;
      else item.show = false;
      return null;
    });
  };

  handleShowVideo = keyId => {
    this.setState({ videoVisible: true, keyId });
  };

  handleShowTruckModal = () => {
    this.fetchCountByParkId();
    this.fetchPresenceRecordList();
    // this.fetchAbnormalRecordList();
    this.setState({ truckModalVisible: true });
  };

  handleCloseTruckModal = () => {
    this.setState({ truckModalVisible: false });
  };

  // 车辆统计
  fetchCountByParkId = () => {
    const { companyId, dispatch } = this.props;
    dispatch({ type: 'chemical/fetchCountByParkId', payload: { companyId } });
  };

  // 出入记录
  fetchPresenceRecordList = () => {
    const { companyId, dispatch } = this.props;
    dispatch({
      type: 'chemical/fetchInOutRecord',
      payload: {
        companyId,
        pageNum: 1,
        pageSize: 50,
        startTime: moment().format('YYYY-MM-DD 00:00:00'),
        endTime: moment().format('YYYY-MM-DD 23:59:59'),
        today: 1,
      },
    });
  };

  // 异常抬杆记录
  fetchAbnormalRecordList = () => {
    const { companyId, dispatch } = this.props;
    dispatch({
      type: 'licensePlateRecognitionSystem/getAbnormalRecordList',
      payload: {
        companyId,
        pageNum: 1,
        pageSize: 50,
        startTime: moment().format('YYYY-MM-DD 00:00:00'),
        endTime: moment().format('YYYY-MM-DD 23:59:59'),
        today: 1,
      },
    });
  };

  handleIdentification = () => {
    window.open(
      `${
        window.publicPath
      }#/real-name-certification/identification-record/list?startTime=${moment().format(
        'YYYY-MM-DD 00:00:00'
      )}&endTime=${moment().format('YYYY-MM-DD 23:59:59')}`,
      `_blank`
    );
  };

  render() {
    const { gdMapVisible, visibles, videoVisible, keyId, truckModalVisible } = this.state;
    const {
      chemical: {
        videoList,
        onDuty: { recSuccess = 0, inCount = 0, outCount = 0 },
        truckCount,
        inOutRecordList,
        riskPoint,
        monitorEquipment,
        locations,
      },
      specialEquipment: { list: specialEquipmentList },
      user: {
        currentUser: { permissionCodes },
      },
      licensePlateRecognitionSystem: { abnormalRecordList },
      workingBill: {
        list: { list: workBillList = [] },
      },
    } = this.props;
    const presentCar = inCount - outCount >= 0 ? inCount - outCount : 0;
    const controlDataList = [
      filterMarkerList(riskPoint),
      filterMarkerList(videoList).filter(({ status }) => status && +status === 1),
      filterMarkerList(monitorEquipment),
      filterMarkerList(specialEquipmentList),
      locations,
      workBillList.filter(item => item.mapAddress && JSON.parse(item.mapAddress).length),
    ];
    const controlDataLength = controlDataList.filter(list => list.length > 0).length;

    return (
      <Fragment>
        <div className={styles.container} id="mapContainer">
          <div
            className={styles.controlContainer}
            style={{
              left: `calc(50% - ${0.5 *
                (120 * controlDataLength + 20 * (controlDataLength - 1))}px)`,
            }}
          >
            {controls.map((item, index) => {
              const { label, icon, activeIcon } = item;
              const itemStyles = classnames(styles.controlItem, {
                [styles.active]: visibles[index],
              });
              if (controlDataList[index].length === 0) return null;
              return (
                <Fragment>
                  <div
                    className={itemStyles}
                    key={index}
                    onClick={() => {
                      if (index === 5) {
                        this.handleToggleWorkBill();
                      } else if (index === 4) {
                        this.handleTogglePosition();
                      } else this.handleClickControl(index);
                    }}
                  >
                    <span
                      className={styles.icon}
                      style={{
                        background: `url(${
                          visibles[index] ? activeIcon : icon
                        }) center center / auto 100% no-repeat`,
                      }}
                    />
                    {label}
                  </div>
                  {/* <div className={itemStyles}>
                    <span
                      className={styles.icon}
                      style={{
                        background: `url(${jobType}) center center / auto 100% no-repeat`,
                      }}
                    />
                    {label}
                  </div> */}
                </Fragment>
              );
            })}
          </div>
          {!visibles[5] && (
            <div className={styles.joySuchFour}>
              {FourColors.map((item, index) => {
                const { label, color } = item;
                return (
                  <div className={styles.fourColorsWrapper} key={index}>
                    <span className={styles.rect} style={{ backgroundColor: color }} />
                    {label}
                  </div>
                );
              })}
            </div>
          )}

          <div className={styles.extraContainer}>
            <div
              className={styles.extraWrapper}
              style={{
                background: `url(${iconCar}) 7px 6px / 24px auto no-repeat #033069`,
                cursor: +presentCar ? 'pointer' : 'default',
              }}
              onClick={+presentCar ? this.handleShowTruckModal : undefined}
            >
              <div>
                车辆识别
                <span className={styles.extra}>（当前）</span>
              </div>
              <div>
                在场车辆
                <span className={styles.value}>{presentCar}</span>
              </div>
            </div>

            <div
              className={styles.extraWrapper}
              style={{
                background: `url(${iconFace}) 7px 6px / 24px auto no-repeat #033069`,
                cursor: +recSuccess ? 'pointer' : 'default',
              }}
              onClick={+recSuccess ? this.handleIdentification : undefined}
            >
              <div>
                人脸识别
                <span className={styles.extra}>（今日）</span>
              </div>
              <div>
                对比成功
                <span className={styles.value}>{recSuccess}</span>
              </div>
            </div>
          </div>

          {permissionCodes.includes('dashboard.personnelPositioningView') && (
            <div
              className={styles.positionBtn}
              style={{
                background: `url(${position}) center center / auto 80% no-repeat #fff`,
              }}
              onClick={this.handlePosition}
            />
          )}
          <NewVideoPlay
            showList={true}
            videoList={videoList
              .map(item => ({ ...item, key_id: item.keyId }))
              .filter(({ status }) => status && +status === 1)}
            visible={videoVisible}
            keyId={keyId} // keyId
            handleVideoClose={() => this.setState({ videoVisible: false })}
            isTree={false}
          />
        </div>
        <TruckModal
          visible={truckModalVisible}
          onCancel={this.handleCloseTruckModal}
          data={{ top: inOutRecordList, left: truckCount, right: abnormalRecordList.list }}
        />
      </Fragment>
    );
  }
}
