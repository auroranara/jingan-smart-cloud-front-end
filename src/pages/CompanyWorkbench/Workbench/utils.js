import moment from 'moment';

import RealTimeMonitoring from './image/realTimeMonitoring.png';
import HistoryMonitoring from './image/historyMonitoring.png';
import StorageTankArea from './image/storageTankArea.png';
import StorageTank from './image/storageTank.png';
import HighRiskProcess from './image/HighRiskProcess.png';
import ProcessUnits from './image/processUnits.png';
import ReservoirArea from './image/reservoirArea.png';
import Warehouse from './image/warehouse.png';
import Gasometer from './image/gasometer.png';
import SpecialEquipment from './image/specialEquipment.png';
import SpecialEquipmentPerson from './image/specialEquipmentPerson.png';
import SpecialEquipmentOperation from './image/specialEquipmentOperation.png';
import ProductWork from './image/productWork.png';
import RiskPoint from './image/riskPoint.png';
import CurrentDanger from './image/currentDanger.png';
import Materical from './image/materical.png';
import Technonlogy from './image/technonlogy.png';
import MajorDanger from './image/majorDanger.png';
import AlarmIcon from './image/alarmIcon.png';
import NormalIcon from './image/normalIcon.png';
import Manoeuvre from './image/manoeuvre.png';
import DateIcon from './image/date.png';
import Location from './image/location.png';
import Execute from './image/execute.png';
import Money from './image/money.png';
import AlarmTime from './image/alarmTime.png';
import FininshRate from './image/fininshRate.png';

export {
  ProductWork,
  RiskPoint,
  CurrentDanger,
  Materical,
  Technonlogy,
  MajorDanger,
  AlarmIcon,
  NormalIcon,
  Manoeuvre,
  DateIcon,
  Location,
  Execute,
  Money,
  AlarmTime,
  FininshRate,
};

const TANK_AREA_REAL_TIME_URL = '/iot/major-hazard/tank-area/real-time/index';
const TANK_AREA_HISTORY_URL = '/iot/major-hazard/tank-area/history/index';

export function getRealUrl(i) {
  switch (i) {
    case 1:
      return TANK_AREA_REAL_TIME_URL;
    default:
      return;
  }
}

export function getHistoryUrl(i) {
  switch (i) {
    case 1:
      return TANK_AREA_HISTORY_URL;
    default:
      return;
  }
}

export function getValueDate(i) {
  switch (i) {
    case 1:
      return [moment('2019-11-04'), moment('2019-11-10')];
    case 2:
      return [moment('2019-11-01'), moment('2019-11-30')];
    case 3:
      return [moment('2019-10-01'), moment('2019-12-31')];
    case 4:
      return [moment('2019-01-01'), moment('2019-12-31')];
    default:
      return;
  }
}

export const TabList = [
  {
    id: 1,
    icon1: RealTimeMonitoring,
    icon2: HistoryMonitoring,
    icon3: StorageTankArea,
    name1: '储罐区（个）',
    name2: '报警罐区（个)',
    name3: '正常罐区（个)',
  },
  {
    id: 2,
    icon1: RealTimeMonitoring,
    icon2: HistoryMonitoring,
    icon3: StorageTank,
    name1: '储罐（个）',
    name2: '报警储罐（个)',
    name3: '正常储罐（个)',
  },
  {
    id: 3,
    icon1: RealTimeMonitoring,
    icon2: HistoryMonitoring,
    icon3: ReservoirArea,
    name1: '库区（个）',
    name2: '报警库区（个)',
    name3: '正常库区（个)',
  },
  {
    id: 4,
    icon1: RealTimeMonitoring,
    icon2: HistoryMonitoring,
    icon3: Warehouse,
    name1: '库房（个）',
    name2: '报警库房（个)',
    name3: '正常库房（个)',
  },
  {
    id: 5,
    icon1: RealTimeMonitoring,
    icon2: HistoryMonitoring,
    icon3: HighRiskProcess,
    name1: '高危工艺（套）',
    name2: '报警工艺（套)',
    name3: '正常工艺（套)',
  },
  {
    id: 6,
    icon1: RealTimeMonitoring,
    icon2: HistoryMonitoring,
    icon3: ProcessUnits,
    name1: '生产装置（套）',
    name2: '报警装置（套)',
    name3: '正常装置（套)',
  },
  {
    id: 7,
    icon1: RealTimeMonitoring,
    icon2: HistoryMonitoring,
    icon3: Gasometer,
    name1: '气柜（套）',
    name2: '报警气柜（套)',
    name3: '正常气柜（套)',
  },
];

export const SpecialEquipmentList = [
  {
    id: 1,
    icon: SpecialEquipment,
    name: '特种设备',
    total: 100,
    percentNumOne: '10%',
    percentNumTwo: '20%',
    percentNumThree: '70%',
    dataOne: [90, 10],
    dataTwo: [80, 20],
    dataThree: [30, 70],
    colorOne: '#1890ff',
    color: '#99d5fe',
  },
  {
    id: 2,
    icon: SpecialEquipmentPerson,
    name: '特种设备操作人员证',
    total: 100,
    percentNumOne: '10%',
    percentNumTwo: '20%',
    percentNumThree: '70%',
    dataOne: [90, 10],
    dataTwo: [80, 20],
    dataThree: [30, 70],
    colorOne: '#1890ff',
    color: '#99d5fe',
  },
  {
    id: 3,
    icon: SpecialEquipmentOperation,
    name: '特种作业操作证',
    total: 100,
    percentNumOne: '10%',
    percentNumTwo: '20%',
    percentNumThree: '70%',
    dataOne: [90, 10],
    dataTwo: [80, 20],
    dataThree: [30, 70],
    colorOne: '#1890ff',
    color: '#99d5fe',
  },
];

export const executeList = [
  {
    id: 1,
    executeName: '********（演练名称)',
    content: '特别重大煤矿事故综合现场演练',
    status: '待执行',
    date: '2019.10.01',
    money: '10.000元',
    area: '东厂区停车场',
  },
  {
    id: 2,
    executeName: '********（演练名称)',
    content: '特别重大煤矿事故综合现场演练',
    status: '待执行',
    date: '2019.10.01',
    money: '10.000元',
    area: '东厂区dsadadsd停车场',
  },
];
