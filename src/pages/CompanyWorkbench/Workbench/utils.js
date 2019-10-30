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

export const TabList1 = {
  id: 1,
  icon1: RealTimeMonitoring,
  icon2: HistoryMonitoring,
  icon3: StorageTankArea,
  name1: '储罐区（个）',
  name2: '报警罐区（个)',
  name3: '正常罐区（个)',
};

export const TabList2 = {
  id: 1,
  icon1: RealTimeMonitoring,
  icon2: HistoryMonitoring,
  icon3: StorageTank,
  name1: '储罐（个）',
  name2: '报警储罐（个)',
  name3: '正常储罐（个)',
};

export const TabList3 = {
  id: 1,
  icon1: RealTimeMonitoring,
  icon2: HistoryMonitoring,
  icon3: ReservoirArea,
  name1: '库区（个）',
  name2: '报警库区（个)',
  name3: '正常库区（个)',
};

export const TabList4 = {
  id: 1,
  icon1: RealTimeMonitoring,
  icon2: HistoryMonitoring,
  icon3: Warehouse,
  name1: '库房（个）',
  name2: '报警库房（个)',
  name3: '正常库房（个)',
};

export const TabList5 = {
  id: 1,
  icon1: RealTimeMonitoring,
  icon2: HistoryMonitoring,
  icon3: ProcessUnits,
  name1: '生产装置（套）',
  name2: '报警装置（套)',
  name3: '正常装置（套)',
};

export const TabList6 = {
  id: 1,
  icon1: RealTimeMonitoring,
  icon2: HistoryMonitoring,
  icon3: Gasometer,
  name1: '气柜（套）',
  name2: '报警气柜（套)',
  name3: '正常气柜（套)',
};

export const TabList7 = {
  id: 1,
  icon1: RealTimeMonitoring,
  icon2: HistoryMonitoring,
  icon3: HighRiskProcess,
  name1: '高危工艺（套）',
  name2: '报警工艺（套)',
  name3: '正常工艺（套)',
};

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
