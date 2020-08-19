import React, { Fragment } from 'react';
import {
  Spin,
  Input,
  TreeSelect,
  Select,
  DatePicker,
  Button,
  Divider,
  Popconfirm,
  Badge,
  Radio,
} from 'antd';
import PagingSelect from '@/jingan-components/PagingSelect';
import Upload from '@/jingan-components/Form/Upload';
import Link from 'umi/link';
import SafetyMeasures from './components/SafetyMeasures';
import moment from 'moment';
import { stringify } from 'qs';
import {
  dateFormat,
  minuteFormat,
  timeRangePickerPlaceholder,
  getSelectValueFromEvent,
  EmptyText,
  listPageCol,
  hiddenCol,
  timeRangePickerCol,
  Text,
  col,
  getMultipleSelectValueFromEvent,
} from '@/utils';
import { isNumber } from '@/utils/utils';
import locale from '@/locales/zh-CN';
import styles from './config.less';
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const formCol = { span: 8 };
const halfCol = { span: 12 };

export const modelName = 'workingBill2';
export const listName = 'list';
export const detailName = 'detail';
export const mapName = 'map';
export const approveCountName = 'approveCount';
export const pendingApproveCountName = 'pendingApproveCount';
export const workingCountName = 'workingCount';
export const listApi = 'workingBill2/getList';
export const detailApi = 'workingBill2/getDetail';
export const pendingApproveCountApi = 'workingBill2/getPendingApproveCount';
export const workingCountApi = 'workingBill2/getWorkingCount';
export const addApi = 'workingBill2/add';
export const editApi = 'workingBill2/edit';
export const deleteApi = 'workingBill2/delete';
export const approveApi = 'workingBill2/approve';
export const signatureApi = 'workingBill2/getSignature';
export const mapApi = 'workingBill2/getMap';
export const approveCountApi = 'workingBill2/getApproveCount';
export const detailCode = 'operationSafety.workingBill.detail';
export const addCode = 'operationSafety.workingBill.add';
export const editCode = 'operationSafety.workingBill.edit';
export const deleteCode = 'operationSafety.workingBill.delete';
export const approveCode = 'operationSafety.workingBill.approve';
export const listPath = '/operation-safety/working-bill/list';
export const detailPath = '/operation-safety/working-bill/detail';
export const addPath = '/operation-safety/working-bill/add';
export const editPath = '/operation-safety/working-bill/edit';
export const reapplyPath = '/operation-safety/working-bill/reapply';
export const parentLocale = locale['menu.operationSafety'];
export const listLocale = locale['menu.operationSafety.workingBill.list'];
export const detailLocale = locale['menu.operationSafety.workingBill.detail'];
export const addLocale = locale['menu.operationSafety.workingBill.add'];
export const editLocale = locale['menu.operationSafety.workingBill.edit'];
export const reapplyLocale = locale['menu.operationSafety.workingBill.reapply'];
export const typeList = [
  { key: '1', value: '1', label: '动火作业', title: '动火作业' },
  { key: '2', value: '2', label: '受限空间作业', title: '受限空间作业' },
  { key: '4', value: '4', label: '高处作业', title: '高处作业' },
  { key: '5', value: '5', label: '吊装作业', title: '吊装作业' },
  { key: '6', value: '6', label: '临时用电', title: '临时用电' },
  { key: '9', value: '9', label: '设备检修', title: '设备检修' },
  { key: '3', value: '3', label: '盲板抽堵', title: '盲板抽堵' },
  { key: '8', value: '8', label: '断路作业', title: '断路作业' },
  { key: '7', value: '7', label: '动土作业', title: '动土作业' },
];
export const safetyMeasuresMap = {
  [typeList[0].key]: [
    ['动火设备内部构件清理干净，蒸汽吹扫或水洗合格，达到用火条件'],
    ['断开与动火设备相连接的所有管线，加盲板 ? 块', 'blindPlateNum'],
    ['动火点周围的下水井、地漏、地沟、电缆沟等手段进行隔离'],
    ['罐区内动火点同一围堰和防火间距内的油罐不同时进行脱水作业'],
    ['高处作业已采取防火花飞溅措施'],
    ['动火点周围易燃物已清除'],
    ['电焊回路线已接在焊件上，把线未穿过下水井或其他设备搭接'],
    ['乙炔气瓶（直立放置）、氧气瓶与火源间的距离大于10m'],
    [
      '现场配备消防蒸汽带 ? 根，灭火器 ? 台，铁锹 ? 把，石棉布 ? 块',
      'fireSteamBeltNum',
      'extinguisherNum',
      'shovelNum',
      'asbestosClothNum',
    ],
  ],
  [typeList[1].key]: [
    ['对进入受限空间危险性进行分析'],
    ['所有与受限空间有联系的阀门、管线加盲板隔离，列出盲板清单，落实抽堵盲板责任人'],
    ['设备经过置换、吹扫、蒸煮'],
    [
      '设备打开通风孔进行自然通风，温度适宜人员作业；必要时采用强制通风或佩戴空气呼吸器，不能用通氧气或富氧空气的方法补充氧',
    ],
    ['相关设备进行处理，带搅拌机的设备已切断电源，电源开关处加锁或挂“禁止合闸”标志牌，设专人监护'],
    ['检查受限空间内部已具备作业条件，清罐时（无需用/已采用）防爆工具'],
    ['检查受限空间进出口通道，无阻碍人员进出的障碍物'],
    ['分析盛装过可燃有毒液体、气体的受限空间内的可燃、有毒有害气体含量'],
    ['作业人员清楚受限空间内存在的其他危险因素，如内部附件、集渣坑等'],
    [
      '作业监护措施：消防器材 ?、救生绳 ?、气防装备 ?',
      'fireEquipmentNum',
      'lifeLineNum',
      'gasControlEquipmentNum',
    ],
  ],
  [typeList[2].key]: [
    ['作业人员身体条件符合要求'],
    ['作业人员着装符合工作要求'],
    ['作业人员佩戴合格的安全帽'],
    ['作业人员佩戴安全带、安全带高挂低用'],
    ['作业人员携带有工具袋及安全绳'],
    ['作业人员佩戴：A.过滤式防毒面具或口罩，B.空气呼吸器'],
    ['现场搭设的脚手架、防护网、围栏符合安全规定'],
    ['垂直分层作业中间有隔离设施'],
    ['梯子、绳子符合安全规定'],
    ['石棉瓦等轻型棚的承重梁、柱能承重负荷的要求'],
    ['作业人员在石棉瓦等不承重物作业所搭设的承重板稳定牢固'],
    ['采光、夜间作业照明符合作业要求，（需采用并已采用/无需采用）防爆灯'],
    ['30m以上高处作业配备通讯、联络工具'],
  ],
  [typeList[3].key]: [
    [
      '吊装质量大于等于40t的重物和土建工程主体结构；吊装物体虽不足40t，但形状复杂、刚度小、长径比大、精密贵重，作业条件特殊，已编制吊装作业方案，且经设备管理科和安全科审查，报公司安全总监批准',
    ],
    ['指派专人监护，并监守岗位，非作业人员禁止入内'],
    ['作业人员已按规定佩戴防护器具和个体防护用品'],
    ['已与分厂（车间）负责人取得联系，建立联系信号'],
    ['已在吊装现场设置安全警戒标志，无关人员不许进入作业现场'],
    ['夜间作业采用足够的照明'],
    ['室外作业遇到（大雪/暴雨/大雾/六级以上大风），已停止作业'],
    ['检查起重吊装设备、钢丝绳、缆风绳、链条、吊钩等各种机具，保证安全可靠'],
    ['明确分工、坚守岗位，并按规定的联络信号，统一指挥'],
    ['将建筑物、构筑物作为锚点，需经工程处审查核算并批准'],
    ['吊装绳索、缆风绳、拖拉绳等避免同带电线路接触，并保持安全距离'],
    ['人员随同吊装重物或吊装机械升降，应采取可靠的安全措施，并经过现场指挥人员批准'],
    ['利用管道、管架、电杆、机电设备等作吊装锚点，不准吊装'],
    ['悬吊重物下方站人、通行和工作，不准吊装'],
    ['超负荷或重物质量不明，不准吊装'],
    ['斜拉重物、重物埋在地下或重物坚固不牢，绳打结、绳不齐，不准吊装'],
    ['棱角重物没有衬垫措施，不准吊装'],
    ['安全装置失灵，不准吊装'],
    ['用定型起重吊装机械（履带吊车/轮胎吊车/矫式吊车等）进行吊装作业，遵守该定型机械的操作规程'],
    ['作业过程中应先用低高度、短行程试吊'],
    ['作业现场出现危险品泄漏，立即停止作业，撤离人员'],
    ['作业完成后现场杂物已清理'],
    ['吊装作业人员持有法定的有效的证件'],
    [
      '地下通讯电（光）缆、局域网络电（光）缆、排水沟的盖板，承重吊装机械的负重量已确认，保护措施已落实',
    ],
    ['起吊物的质量 ? t，经确认，在吊装机械的承重范围', 'quality'],
    ['在吊装高度的管线、电缆桥架已做好防护措施'],
    ['作业现场围栏、警戒线、警告牌、夜间警示灯已按要求设置'],
    ['作业高度和转臂范围内，无架空线路'],
    ['人员出入口和撤离安全措施已落实：A.指示牌；B.指示灯'],
    ['在爆炸危险生产区域内作业，机动车排气管已装火星熄灭器'],
    ['现场夜间有充足照明：36V、24V、12V防水型灯；36V、24V、12V防爆型灯'],
    ['作业人员已佩戴防护器具'],
  ],
  [typeList[4].key]: [
    ['安装临时线路人员持有电工作业操作证'],
    ['在防爆场所使用的临时电源、元器件和线路达到相应的防爆等级要求'],
    ['临时用电的单项和混用线路采用五线制'],
    ['临时用电线路在装置内不低于2.5m，道路不低于5m'],
    ['临时用电线路架空进线未采用裸线，未在树或脚手架上架设'],
    ['暗管埋设及地下电缆线路设有“走向标志”和“安全标志”，电缆埋深大于0.7m'],
    ['现场临时用配电盘、箱有防雨措施'],
    ['临时用电设施有漏电保护器，移动工具、手持工具“一机一闸一保护”'],
    ['用电设备、线路容量、负荷符合要求'],
  ],
  [typeList[5].key]: [
    ['安装临时线路人员持有电工作业操作证'],
    ['在防爆场所使用的临时电源、元器件和线路达到相应的防爆等级要求'],
    ['临时用电的单项和混用线路采用五线制'],
    ['临时用电线路在装置内不低于2.5m，道路不低于5m'],
    ['临时用电线路架空进线未采用裸线，未在树或脚手架上架设'],
    ['暗管埋设及地下电缆线路设有“走向标志”和“安全标志”，电缆埋深大于0.7m'],
    ['现场临时用配电盘、箱有防雨措施'],
    ['临时用电设施有漏电保护器，移动工具、手持工具“一机一闸一保护”'],
    ['用电设备、线路容量、负荷符合要求'],
  ],
  [typeList[6].key]: [
    ['在有毒介质的管道、设备上作业时，尽可能降低系统压力，作业点应为常压'],
    ['在有毒介质的管道、设备上作业时，作业人员穿戴适合的防护用具'],
    ['易燃易爆场所，作业人员穿防静电工作服、工作鞋；作业时使用防爆灯具和防爆工具'],
    ['易燃易爆场所，距作业地点30m内无其他动火作业'],
    ['在强腐蚀性介质的管道、设备上作业时，作业人员已采取防止酸碱灼伤的措施'],
    ['介质温度较高、可能造成烫伤的情况下，作业人员已采取防烫措施'],
    ['同一管道上不同时进行两处以上的盲板抽堵作业'],
  ],
  [typeList[7].key]: [
    ['作业前，制定交通组织方案（附后），并已通知相关部门或单位'],
    [
      '作业前，在断路的路口和相关道路上设置交通警示标志，在作业区附近设置路栏、道路作业警示灯、导向标等交通警示设施',
    ],
    ['夜间作业设置警示灯'],
  ],
  [typeList[8].key]: [
    ['作业人员作业前已进行了安全教育'],
    ['作业地点处于易燃易爆场所，需要动火时已办理了动火证'],
    ['地下电力电缆已确认保护措施已落实'],
    ['地下通讯电（光）缆，局域网络电（光）缆已确认保护措施已落实'],
    ['地下供排水、消防管线、工艺管线已确认保护措施已落实'],
    ['已按作业方案图规划线和立桩'],
    [
      '动土地点有电线、管道等地下设施，已向作业单位交待并派人监护；作业时轻挖，未使用铁棒、铁镐或抓斗等机械工具',
    ],
    ['作业现场围栏、警戒线、警告牌夜间警示灯已按要求设置'],
    ['已进行放坡处理和固壁支撑'],
    ['人员出入口和撤离安全措施已落实：A.梯子；B.修坡道'],
    ['道路施工作业已报：交通、消防、安全监督部门、应急中心'],
    ['备有可燃气体检测仪、有毒介质检测仪'],
    ['现场夜间有充足照明：A.36V、24V、12V防水型灯；B.36V、24V、12V防爆型灯'],
    ['作业人员已佩戴防护器具'],
    ['动土范围内无障碍物，并已在总图上做标记'],
  ],
};
export const workingStatusList = [
  { key: '1', value: '1', label: '待作业', title: '待作业' },
  { key: '2', value: '2', label: '作业中', title: '作业中' },
  { key: '3', value: '3', label: '完成', title: '完成' },
];
export const workingStatusMap = {
  1: 'warning',
  2: 'processing',
  3: 'success',
};
export const approveStatusList = [
  { key: '1', value: '1', label: '待审批', title: '待审批' },
  { key: '2', value: '2', label: '通过', title: '通过' },
  { key: '3', value: '3', label: '不通过', title: '不通过' },
];
export const approveStatusMap = {
  1: 'warning',
  2: 'success',
  3: 'error',
};
export const planTypeList = [
  { key: '1', value: '1', label: '计划性', title: '计划性' },
  { key: '0', value: '0', label: '非计划性', title: '非计划性' },
];
export const implementationStatusList = [
  { key: '0', value: '0', label: '未实施', title: '未实施' },
  { key: '1', value: '1', label: '已实施', title: '已实施' },
];
export const approveOpinionList = [
  { key: '2', value: '2', label: '通过', title: '通过' },
  { key: '3', value: '3', label: '不通过', title: '不通过' },
];
export const hotWorkLevelList = [
  { key: '1', value: '1', label: '特级危险动火', title: '特级危险动火' },
  { key: '2', value: '2', label: '一级动火', title: '一级动火' },
  { key: '3', value: '3', label: '二级动火', title: '二级动火' },
];
export const highWorkLevelList = [
  { key: '4', value: '4', label: '特级高处作业证', title: '特级高处作业证' },
  { key: '7', value: '7', label: '三级高处作业证', title: '三级高处作业证' },
  { key: '6', value: '6', label: '二级高处作业证', title: '二级高处作业证' },
  { key: '5', value: '5', label: '一级高处作业证', title: '一级高处作业证' },
];
export const hoistingWorkLevelList = [
  { key: '8', value: '8', label: '一级吊装作业', title: '一级吊装作业' },
  { key: '9', value: '9', label: '二级吊装作业', title: '二级吊装作业' },
  { key: '10', value: '10', label: '三级吊装作业', title: '三级吊装作业' },
];
export const blindPlateWorkLevelList = [
  { key: '11', value: '11', label: '装盲板', title: '装盲板' },
  { key: '12', value: '12', label: '拆盲板', title: '拆盲板' },
];
export const companyTypeList = [
  { key: '1', value: '1', label: '本单位', title: '本单位' },
  { key: '2', value: '2', label: '外来单位', title: '外来单位' },
];
export const yesOrNo = [
  { key: '1', value: '1', label: '是', title: '是' },
  { key: '0', value: '0', label: '否', title: '否' },
];
export const getPayloadByQueryMap = {
  [typeList[0].key]: ({
    pageNum,
    pageSize,
    billType,
    company,
    applyUserName,
    applyDepartment,
    billLevel,
    billCode,
    startWorkingDate,
    endWorkingDate,
    workingStatus,
    approveStatus,
    planType,
    implementationStatus,
  }) => ({
    pageNum: pageNum > 0 ? +pageNum : 1,
    pageSize: pageSize > 0 ? +pageSize : 10,
    billType: billType || undefined,
    company: company ? JSON.parse(decodeURIComponent(company)) : undefined,
    applyUserName: applyUserName ? decodeURIComponent(applyUserName) : undefined,
    applyDepartment: applyDepartment ? JSON.parse(decodeURIComponent(applyDepartment)) : undefined,
    billLevel: billLevel || undefined,
    billCode: billCode ? decodeURIComponent(billCode) : undefined,
    range:
      startWorkingDate && endWorkingDate
        ? [moment(+startWorkingDate), moment(+endWorkingDate)]
        : undefined,
    workingStatus: workingStatus || undefined,
    approveStatus: approveStatus || undefined,
    planType: planType || undefined,
    implementationStatus: implementationStatus || undefined,
  }),
  [typeList[1].key]: ({
    pageNum,
    pageSize,
    billType,
    company,
    applyUserName,
    applyDepartment,
    workingProject,
    billCode,
    startWorkingDate,
    endWorkingDate,
    workingStatus,
    approveStatus,
    planType,
    implementationStatus,
  }) => ({
    pageNum: pageNum > 0 ? +pageNum : 1,
    pageSize: pageSize > 0 ? +pageSize : 10,
    billType: billType || undefined,
    company: company ? JSON.parse(decodeURIComponent(company)) : undefined,
    applyUserName: applyUserName ? decodeURIComponent(applyUserName) : undefined,
    applyDepartment: applyDepartment ? JSON.parse(decodeURIComponent(applyDepartment)) : undefined,
    workingProject: workingProject ? decodeURIComponent(workingProject) : undefined,
    billCode: billCode ? decodeURIComponent(billCode) : undefined,
    range:
      startWorkingDate && endWorkingDate
        ? [moment(+startWorkingDate), moment(+endWorkingDate)]
        : undefined,
    workingStatus: workingStatus || undefined,
    approveStatus: approveStatus || undefined,
    planType: planType || undefined,
    implementationStatus: implementationStatus || undefined,
  }),
  [typeList[2].key]: ({
    pageNum,
    pageSize,
    billType,
    company,
    applyUserName,
    applyDepartment,
    billCode,
    billLevel,
    startWorkingDate,
    endWorkingDate,
    workingStatus,
    approveStatus,
    implementationStatus,
  }) => ({
    pageNum: pageNum > 0 ? +pageNum : 1,
    pageSize: pageSize > 0 ? +pageSize : 10,
    billType: billType || undefined,
    company: company ? JSON.parse(decodeURIComponent(company)) : undefined,
    applyUserName: applyUserName ? decodeURIComponent(applyUserName) : undefined,
    applyDepartment: applyDepartment ? JSON.parse(decodeURIComponent(applyDepartment)) : undefined,
    billCode: billCode ? decodeURIComponent(billCode) : undefined,
    billLevel: billLevel || undefined,
    range:
      startWorkingDate && endWorkingDate
        ? [moment(+startWorkingDate), moment(+endWorkingDate)]
        : undefined,
    workingStatus: workingStatus || undefined,
    approveStatus: approveStatus || undefined,
    implementationStatus: implementationStatus || undefined,
  }),
  [typeList[3].key]: ({
    pageNum,
    pageSize,
    billType,
    company,
    applyUserName,
    applyDepartment,
    billCode,
    billLevel,
    startWorkingDate,
    endWorkingDate,
    workingStatus,
    approveStatus,
    implementationStatus,
  }) => ({
    pageNum: pageNum > 0 ? +pageNum : 1,
    pageSize: pageSize > 0 ? +pageSize : 10,
    billType: billType || undefined,
    company: company ? JSON.parse(decodeURIComponent(company)) : undefined,
    applyUserName: applyUserName ? decodeURIComponent(applyUserName) : undefined,
    applyDepartment: applyDepartment ? JSON.parse(decodeURIComponent(applyDepartment)) : undefined,
    billCode: billCode ? decodeURIComponent(billCode) : undefined,
    billLevel: billLevel || undefined,
    range:
      startWorkingDate && endWorkingDate
        ? [moment(+startWorkingDate), moment(+endWorkingDate)]
        : undefined,
    workingStatus: workingStatus || undefined,
    approveStatus: approveStatus || undefined,
    implementationStatus: implementationStatus || undefined,
  }),
  [typeList[4].key]: ({
    pageNum,
    pageSize,
    billType,
    company,
    applyUserName,
    applyDepartment,
    billCode,
    startWorkingDate,
    endWorkingDate,
    planType,
    workingStatus,
    approveStatus,
    implementationStatus,
  }) => ({
    pageNum: pageNum > 0 ? +pageNum : 1,
    pageSize: pageSize > 0 ? +pageSize : 10,
    billType: billType || undefined,
    company: company ? JSON.parse(decodeURIComponent(company)) : undefined,
    applyUserName: applyUserName ? decodeURIComponent(applyUserName) : undefined,
    applyDepartment: applyDepartment ? JSON.parse(decodeURIComponent(applyDepartment)) : undefined,
    billCode: billCode ? decodeURIComponent(billCode) : undefined,
    range:
      startWorkingDate && endWorkingDate
        ? [moment(+startWorkingDate), moment(+endWorkingDate)]
        : undefined,
    planType: planType || undefined,
    workingStatus: workingStatus || undefined,
    approveStatus: approveStatus || undefined,
    implementationStatus: implementationStatus || undefined,
  }),
  [typeList[5].key]: ({
    pageNum,
    pageSize,
    billType,
    company,
    applyUserName,
    applyDepartment,
    billCode,
    workingProject,
    startWorkingDate,
    endWorkingDate,
    planType,
    workingStatus,
    approveStatus,
    implementationStatus,
  }) => ({
    pageNum: pageNum > 0 ? +pageNum : 1,
    pageSize: pageSize > 0 ? +pageSize : 10,
    billType: billType || undefined,
    company: company ? JSON.parse(decodeURIComponent(company)) : undefined,
    applyUserName: applyUserName ? decodeURIComponent(applyUserName) : undefined,
    applyDepartment: applyDepartment ? JSON.parse(decodeURIComponent(applyDepartment)) : undefined,
    billCode: billCode ? decodeURIComponent(billCode) : undefined,
    workingProject: workingProject ? decodeURIComponent(workingProject) : undefined,
    range:
      startWorkingDate && endWorkingDate
        ? [moment(+startWorkingDate), moment(+endWorkingDate)]
        : undefined,
    workingStatus: workingStatus || undefined,
    approveStatus: approveStatus || undefined,
    planType: planType || undefined,
    implementationStatus: implementationStatus || undefined,
  }),
  [typeList[6].key]: ({
    pageNum,
    pageSize,
    billType,
    company,
    applyUserName,
    applyDepartment,
    billCode,
    billLevel,
    startWorkingDate,
    endWorkingDate,
    workingStatus,
    approveStatus,
    planType,
    implementationStatus,
  }) => ({
    pageNum: pageNum > 0 ? +pageNum : 1,
    pageSize: pageSize > 0 ? +pageSize : 10,
    billType: billType || undefined,
    company: company ? JSON.parse(decodeURIComponent(company)) : undefined,
    applyUserName: applyUserName ? decodeURIComponent(applyUserName) : undefined,
    applyDepartment: applyDepartment ? JSON.parse(decodeURIComponent(applyDepartment)) : undefined,
    billCode: billCode ? decodeURIComponent(billCode) : undefined,
    billLevel: billLevel || undefined,
    range:
      startWorkingDate && endWorkingDate
        ? [moment(+startWorkingDate), moment(+endWorkingDate)]
        : undefined,
    workingStatus: workingStatus || undefined,
    approveStatus: approveStatus || undefined,
    planType: planType || undefined,
    implementationStatus: implementationStatus || undefined,
  }),
  [typeList[7].key]: ({
    pageNum,
    pageSize,
    billType,
    company,
    applyUserName,
    applyDepartment,
    billCode,
    startWorkingDate,
    endWorkingDate,
    planType,
    workingStatus,
    approveStatus,
    implementationStatus,
  }) => ({
    pageNum: pageNum > 0 ? +pageNum : 1,
    pageSize: pageSize > 0 ? +pageSize : 10,
    billType: billType || undefined,
    company: company ? JSON.parse(decodeURIComponent(company)) : undefined,
    applyUserName: applyUserName ? decodeURIComponent(applyUserName) : undefined,
    applyDepartment: applyDepartment ? JSON.parse(decodeURIComponent(applyDepartment)) : undefined,
    billCode: billCode ? decodeURIComponent(billCode) : undefined,
    range:
      startWorkingDate && endWorkingDate
        ? [moment(+startWorkingDate), moment(+endWorkingDate)]
        : undefined,
    planType: planType || undefined,
    workingStatus: workingStatus || undefined,
    approveStatus: approveStatus || undefined,
    implementationStatus: implementationStatus || undefined,
  }),
  [typeList[8].key]: ({
    pageNum,
    pageSize,
    billType,
    company,
    applyUserName,
    applyDepartment,
    billCode,
    startWorkingDate,
    endWorkingDate,
    planType,
    workingStatus,
    approveStatus,
    implementationStatus,
  }) => ({
    pageNum: pageNum > 0 ? +pageNum : 1,
    pageSize: pageSize > 0 ? +pageSize : 10,
    billType: billType || undefined,
    company: company ? JSON.parse(decodeURIComponent(company)) : undefined,
    applyUserName: applyUserName ? decodeURIComponent(applyUserName) : undefined,
    applyDepartment: applyDepartment ? JSON.parse(decodeURIComponent(applyDepartment)) : undefined,
    billCode: billCode ? decodeURIComponent(billCode) : undefined,
    range:
      startWorkingDate && endWorkingDate
        ? [moment(+startWorkingDate), moment(+endWorkingDate)]
        : undefined,
    planType: planType || undefined,
    workingStatus: workingStatus || undefined,
    approveStatus: approveStatus || undefined,
    implementationStatus: implementationStatus || undefined,
  }),
};
export const getQueryByPayloadMap = {
  [typeList[0].key]: ({
    company,
    applyUserName,
    applyDepartment,
    billCode,
    range,
    ...rest
  } = {}) => {
    const [startWorkingDate, endWorkingDate] = range || [];
    return {
      ...rest,
      company: company ? encodeURIComponent(JSON.stringify(company)) : undefined,
      applyUserName: applyUserName ? encodeURIComponent(applyUserName) : undefined,
      applyDepartment: applyDepartment
        ? encodeURIComponent(JSON.stringify(applyDepartment))
        : undefined,
      billCode: billCode ? encodeURIComponent(billCode) : undefined,
      startDate: startWorkingDate ? +startWorkingDate : undefined,
      endDate: endWorkingDate ? +endWorkingDate : undefined,
    };
  },
  [typeList[1].key]: ({
    company,
    applyUserName,
    applyDepartment,
    workingProject,
    billCode,
    range,
    ...rest
  } = {}) => {
    const [startWorkingDate, endWorkingDate] = range || [];
    return {
      ...rest,
      company: company ? encodeURIComponent(JSON.stringify(company)) : undefined,
      applyUserName: applyUserName ? encodeURIComponent(applyUserName) : undefined,
      applyDepartment: applyDepartment
        ? encodeURIComponent(JSON.stringify(applyDepartment))
        : undefined,
      workingProject: workingProject ? encodeURIComponent(workingProject) : undefined,
      billCode: billCode ? encodeURIComponent(billCode) : undefined,
      startDate: startWorkingDate ? +startWorkingDate : undefined,
      endDate: endWorkingDate ? +endWorkingDate : undefined,
    };
  },
  [typeList[2].key]: ({
    company,
    applyUserName,
    applyDepartment,
    billCode,
    range,
    ...rest
  } = {}) => {
    const [startWorkingDate, endWorkingDate] = range || [];
    return {
      ...rest,
      company: company ? encodeURIComponent(JSON.stringify(company)) : undefined,
      applyUserName: applyUserName ? encodeURIComponent(applyUserName) : undefined,
      applyDepartment: applyDepartment
        ? encodeURIComponent(JSON.stringify(applyDepartment))
        : undefined,
      billCode: billCode ? encodeURIComponent(billCode) : undefined,
      startDate: startWorkingDate ? +startWorkingDate : undefined,
      endDate: endWorkingDate ? +endWorkingDate : undefined,
    };
  },
  [typeList[3].key]: ({
    company,
    applyUserName,
    applyDepartment,
    billCode,
    range,
    ...rest
  } = {}) => {
    const [startWorkingDate, endWorkingDate] = range || [];
    return {
      ...rest,
      company: company ? encodeURIComponent(JSON.stringify(company)) : undefined,
      applyUserName: applyUserName ? encodeURIComponent(applyUserName) : undefined,
      applyDepartment: applyDepartment
        ? encodeURIComponent(JSON.stringify(applyDepartment))
        : undefined,
      billCode: billCode ? encodeURIComponent(billCode) : undefined,
      startDate: startWorkingDate ? +startWorkingDate : undefined,
      endDate: endWorkingDate ? +endWorkingDate : undefined,
    };
  },
  [typeList[4].key]: ({
    company,
    applyUserName,
    applyDepartment,
    billCode,
    range,
    ...rest
  } = {}) => {
    const [startWorkingDate, endWorkingDate] = range || [];
    return {
      ...rest,
      company: company ? encodeURIComponent(JSON.stringify(company)) : undefined,
      applyUserName: applyUserName ? encodeURIComponent(applyUserName) : undefined,
      applyDepartment: applyDepartment
        ? encodeURIComponent(JSON.stringify(applyDepartment))
        : undefined,
      billCode: billCode ? encodeURIComponent(billCode) : undefined,
      startDate: startWorkingDate ? +startWorkingDate : undefined,
      endDate: endWorkingDate ? +endWorkingDate : undefined,
    };
  },
  [typeList[5].key]: ({
    company,
    applyUserName,
    applyDepartment,
    billCode,
    workingProject,
    range,
    ...rest
  } = {}) => {
    const [startWorkingDate, endWorkingDate] = range || [];
    return {
      ...rest,
      company: company ? encodeURIComponent(JSON.stringify(company)) : undefined,
      applyUserName: applyUserName ? encodeURIComponent(applyUserName) : undefined,
      applyDepartment: applyDepartment
        ? encodeURIComponent(JSON.stringify(applyDepartment))
        : undefined,
      billCode: billCode ? encodeURIComponent(billCode) : undefined,
      workingProject: workingProject ? encodeURIComponent(workingProject) : undefined,
      startDate: startWorkingDate ? +startWorkingDate : undefined,
      endDate: endWorkingDate ? +endWorkingDate : undefined,
    };
  },
  [typeList[6].key]: ({
    company,
    applyUserName,
    applyDepartment,
    billCode,
    range,
    ...rest
  } = {}) => {
    const [startWorkingDate, endWorkingDate] = range || [];
    return {
      ...rest,
      company: company ? encodeURIComponent(JSON.stringify(company)) : undefined,
      applyUserName: applyUserName ? encodeURIComponent(applyUserName) : undefined,
      applyDepartment: applyDepartment
        ? encodeURIComponent(JSON.stringify(applyDepartment))
        : undefined,
      billCode: billCode ? encodeURIComponent(billCode) : undefined,
      startDate: startWorkingDate ? +startWorkingDate : undefined,
      endDate: endWorkingDate ? +endWorkingDate : undefined,
    };
  },
  [typeList[7].key]: ({
    company,
    applyUserName,
    applyDepartment,
    billCode,
    range,
    ...rest
  } = {}) => {
    const [startWorkingDate, endWorkingDate] = range || [];
    return {
      ...rest,
      company: company ? encodeURIComponent(JSON.stringify(company)) : undefined,
      applyUserName: applyUserName ? encodeURIComponent(applyUserName) : undefined,
      applyDepartment: applyDepartment
        ? encodeURIComponent(JSON.stringify(applyDepartment))
        : undefined,
      billCode: billCode ? encodeURIComponent(billCode) : undefined,
      startDate: startWorkingDate ? +startWorkingDate : undefined,
      endDate: endWorkingDate ? +endWorkingDate : undefined,
    };
  },
  [typeList[8].key]: ({
    company,
    applyUserName,
    applyDepartment,
    billCode,
    range,
    ...rest
  } = {}) => {
    const [startWorkingDate, endWorkingDate] = range || [];
    return {
      ...rest,
      company: company ? encodeURIComponent(JSON.stringify(company)) : undefined,
      applyUserName: applyUserName ? encodeURIComponent(applyUserName) : undefined,
      applyDepartment: applyDepartment
        ? encodeURIComponent(JSON.stringify(applyDepartment))
        : undefined,
      billCode: billCode ? encodeURIComponent(billCode) : undefined,
      startDate: startWorkingDate ? +startWorkingDate : undefined,
      endDate: endWorkingDate ? +endWorkingDate : undefined,
    };
  },
};
export const getSearchByPayloadMap = {
  [typeList[0].key]: payload => {
    const query = getQueryByPayloadMap[typeList[0].key](payload);
    const search = stringify(query);
    return search && `?${search}`;
  },
  [typeList[1].key]: payload => {
    const query = getQueryByPayloadMap[typeList[1].key](payload);
    const search = stringify(query);
    return search && `?${search}`;
  },
  [typeList[2].key]: payload => {
    const query = getQueryByPayloadMap[typeList[2].key](payload);
    const search = stringify(query);
    return search && `?${search}`;
  },
  [typeList[3].key]: payload => {
    const query = getQueryByPayloadMap[typeList[3].key](payload);
    const search = stringify(query);
    return search && `?${search}`;
  },
  [typeList[4].key]: payload => {
    const query = getQueryByPayloadMap[typeList[4].key](payload);
    const search = stringify(query);
    return search && `?${search}`;
  },
  [typeList[5].key]: payload => {
    const query = getQueryByPayloadMap[typeList[5].key](payload);
    const search = stringify(query);
    return search && `?${search}`;
  },
  [typeList[6].key]: payload => {
    const query = getQueryByPayloadMap[typeList[6].key](payload);
    const search = stringify(query);
    return search && `?${search}`;
  },
  [typeList[7].key]: payload => {
    const query = getQueryByPayloadMap[typeList[7].key](payload);
    const search = stringify(query);
    return search && `?${search}`;
  },
  [typeList[8].key]: payload => {
    const query = getQueryByPayloadMap[typeList[8].key](payload);
    const search = stringify(query);
    return search && `?${search}`;
  },
};
export const transformPayloadMap = {
  [typeList[0].key]: ({ company, applyDepartment, range, ...rest }) => {
    const [startWorkingDate, endWorkingDate] = range || [];
    return {
      ...rest,
      companyId: company && company.key,
      applyDepartmentId: applyDepartment && applyDepartment.key,
      startWorkingDate: startWorkingDate && startWorkingDate.format(minuteFormat),
      endWorkingDate: endWorkingDate && endWorkingDate.format(minuteFormat),
    };
  },
  [typeList[1].key]: ({ company, applyDepartment, range, ...rest }) => {
    const [startWorkingDate, endWorkingDate] = range || [];
    return {
      ...rest,
      companyId: company && company.key,
      applyDepartmentId: applyDepartment && applyDepartment.key,
      startWorkingDate: startWorkingDate && startWorkingDate.format(minuteFormat),
      endWorkingDate: endWorkingDate && endWorkingDate.format(minuteFormat),
    };
  },
  [typeList[2].key]: ({ company, applyDepartment, range, ...rest }) => {
    const [startWorkingDate, endWorkingDate] = range || [];
    return {
      ...rest,
      companyId: company && company.key,
      applyDepartmentId: applyDepartment && applyDepartment.key,
      startWorkingDate: startWorkingDate && startWorkingDate.format(minuteFormat),
      endWorkingDate: endWorkingDate && endWorkingDate.format(minuteFormat),
    };
  },
  [typeList[3].key]: ({ company, applyDepartment, range, ...rest }) => {
    const [startWorkingDate, endWorkingDate] = range || [];
    return {
      ...rest,
      companyId: company && company.key,
      applyDepartmentId: applyDepartment && applyDepartment.key,
      startWorkingDate: startWorkingDate && startWorkingDate.format(minuteFormat),
      endWorkingDate: endWorkingDate && endWorkingDate.format(minuteFormat),
    };
  },
  [typeList[4].key]: ({ company, applyDepartment, range, ...rest }) => {
    const [startWorkingDate, endWorkingDate] = range || [];
    return {
      ...rest,
      companyId: company && company.key,
      applyDepartmentId: applyDepartment && applyDepartment.key,
      startWorkingDate: startWorkingDate && startWorkingDate.format(minuteFormat),
      endWorkingDate: endWorkingDate && endWorkingDate.format(minuteFormat),
    };
  },
  [typeList[5].key]: ({ company, applyDepartment, range, ...rest }) => {
    const [startWorkingDate, endWorkingDate] = range || [];
    return {
      ...rest,
      companyId: company && company.key,
      applyDepartmentId: applyDepartment && applyDepartment.key,
      startWorkingDate: startWorkingDate && startWorkingDate.format(minuteFormat),
      endWorkingDate: endWorkingDate && endWorkingDate.format(minuteFormat),
    };
  },
  [typeList[6].key]: ({ company, applyDepartment, range, ...rest }) => {
    const [startWorkingDate, endWorkingDate] = range || [];
    return {
      ...rest,
      companyId: company && company.key,
      applyDepartmentId: applyDepartment && applyDepartment.key,
      startWorkingDate: startWorkingDate && startWorkingDate.format(minuteFormat),
      endWorkingDate: endWorkingDate && endWorkingDate.format(minuteFormat),
    };
  },
  [typeList[7].key]: ({ company, applyDepartment, range, ...rest }) => {
    const [startWorkingDate, endWorkingDate] = range || [];
    return {
      ...rest,
      companyId: company && company.key,
      applyDepartmentId: applyDepartment && applyDepartment.key,
      startWorkingDate: startWorkingDate && startWorkingDate.format(minuteFormat),
      endWorkingDate: endWorkingDate && endWorkingDate.format(minuteFormat),
    };
  },
  [typeList[8].key]: ({ company, applyDepartment, range, ...rest }) => {
    const [startWorkingDate, endWorkingDate] = range || [];
    return {
      ...rest,
      companyId: company && company.key,
      applyDepartmentId: applyDepartment && applyDepartment.key,
      startWorkingDate: startWorkingDate && startWorkingDate.format(minuteFormat),
      endWorkingDate: endWorkingDate && endWorkingDate.format(minuteFormat),
    };
  },
};
export const transformValuesMap = {
  [typeList[0].key]: ({ applyUserName, billCode, ...rest }) => ({
    ...rest,
    applyUserName: applyUserName ? applyUserName.trim() : undefined,
    billCode: billCode ? billCode.trim() : undefined,
  }),
  [typeList[1].key]: ({ applyUserName, workingProject, billCode, ...rest }) => ({
    ...rest,
    applyUserName: applyUserName ? applyUserName.trim() : undefined,
    workingProject: workingProject ? workingProject.trim() : undefined,
    billCode: billCode ? billCode.trim() : undefined,
  }),
  [typeList[2].key]: ({ applyUserName, billCode, ...rest }) => ({
    ...rest,
    applyUserName: applyUserName ? applyUserName.trim() : undefined,
    billCode: billCode ? billCode.trim() : undefined,
  }),
  [typeList[3].key]: ({ applyUserName, billCode, ...rest }) => ({
    ...rest,
    applyUserName: applyUserName ? applyUserName.trim() : undefined,
    billCode: billCode ? billCode.trim() : undefined,
  }),
  [typeList[4].key]: ({ applyUserName, billCode, ...rest }) => ({
    ...rest,
    applyUserName: applyUserName ? applyUserName.trim() : undefined,
    billCode: billCode ? billCode.trim() : undefined,
  }),
  [typeList[5].key]: ({ applyUserName, billCode, workingProject, ...rest }) => ({
    ...rest,
    applyUserName: applyUserName ? applyUserName.trim() : undefined,
    billCode: billCode ? billCode.trim() : undefined,
    workingProject: workingProject ? workingProject.trim() : undefined,
  }),
  [typeList[6].key]: ({ applyUserName, billCode, ...rest }) => ({
    ...rest,
    applyUserName: applyUserName ? applyUserName.trim() : undefined,
    billCode: billCode ? billCode.trim() : undefined,
  }),
  [typeList[7].key]: ({ applyUserName, billCode, ...rest }) => ({
    ...rest,
    applyUserName: applyUserName ? applyUserName.trim() : undefined,
    billCode: billCode ? billCode.trim() : undefined,
  }),
  [typeList[8].key]: ({ applyUserName, billCode, ...rest }) => ({
    ...rest,
    applyUserName: applyUserName ? applyUserName.trim() : undefined,
    billCode: billCode ? billCode.trim() : undefined,
  }),
};
export const getListFieldsMap = {
  [typeList[0].key]: ({
    isUnit,
    values,
    form,
    search,
    hasAddAuthority,
    companyList,
    loadingCompanyList,
    setCompanyPayload,
    onCompanySelectChange,
    departmentTree,
    loadingDepartmentTree,
    ranges,
  }) => [
    {
      name: 'company',
      label: '单位名称',
      children: (
        <PagingSelect
          options={companyList.list}
          loading={loadingCompanyList}
          allowClear
          disabled={isUnit}
          hasMore={
            companyList.pagination &&
            companyList.pagination.total >
              companyList.pagination.pageNum * companyList.pagination.pageSize
          }
          onSearch={name => setCompanyPayload(payload => ({ ...payload, pageNum: 1, name }))}
          loadMore={() =>
            setCompanyPayload(payload => ({ ...payload, pageNum: payload.pageNum + 1 }))
          }
          onChange={onCompanySelectChange}
        />
      ),
      getValueFromEvent: getSelectValueFromEvent,
      col: !isUnit
        ? {
            xxl: { span: 6, order: 0 },
            xl: { span: 8, order: 0 },
            lg: { span: 12, order: 0 },
            md: { span: 12, order: 0 },
            sm: { span: 24, order: 0 },
            xs: { span: 24, order: 0 },
          }
        : hiddenCol,
    },
    {
      name: 'applyUserName',
      label: '申请人',
      children: <Input placeholder="请输入" maxLength={50} allowClear />,
      col: !isUnit
        ? {
            xxl: { span: 6, order: 1 },
            xl: { span: 8, order: 1 },
            lg: { span: 12, order: 1 },
            md: { span: 12, order: 1 },
            sm: { span: 24, order: 1 },
            xs: { span: 24, order: 1 },
          }
        : listPageCol,
    },
    {
      name: 'applyDepartment',
      label: '申请部门',
      children: (
        <TreeSelect
          placeholder="请选择"
          treeData={values.company ? departmentTree : []}
          labelInValue
          notFoundContent={loadingDepartmentTree ? <Spin size="small" /> : undefined}
          showSearch
          treeNodeFilterProp="title"
          allowClear
        />
      ),
      getValueFromEvent: getSelectValueFromEvent,
      col: !isUnit
        ? {
            xxl: { span: 6, order: 2 },
            xl: { span: 8, order: 2 },
            lg: { span: 12, order: 2 },
            md: { span: 12, order: 2 },
            sm: { span: 24, order: 2 },
            xs: { span: 24, order: 2 },
          }
        : listPageCol,
    },
    {
      name: 'billLevel',
      label: '作业证类型',
      children: <Select placeholder="请选择" options={hotWorkLevelList} allowClear />,
      col: !isUnit
        ? {
            xxl: { span: 6, order: 3 },
            xl: { span: 8, order: 3 },
            lg: { span: 12, order: 3 },
            md: { span: 12, order: 3 },
            sm: { span: 24, order: 3 },
            xs: { span: 24, order: 3 },
          }
        : listPageCol,
    },
    {
      name: 'billCode',
      label: '作业证编号',
      children: <Input placeholder="请输入" maxLength={50} allowClear />,
      col: !isUnit
        ? {
            xxl: { span: 6, order: 4 },
            xl: { span: 8, order: 5 },
            lg: { span: 12, order: 5 },
            md: { span: 12, order: 5 },
            sm: { span: 24, order: 4 },
            xs: { span: 24, order: 4 },
          }
        : listPageCol,
    },
    {
      name: 'range',
      label: '作业时间',
      children: (
        <RangePicker
          className={styles.rangePicker}
          placeholder={timeRangePickerPlaceholder}
          format={minuteFormat}
          showTime
          separator="~"
          ranges={ranges}
          allowClear
        />
      ),
      col: !isUnit
        ? {
            xxl: { span: 12, order: 5 },
            xl: { span: 16, order: 4 },
            lg: { span: 24, order: 4 },
            md: { span: 24, order: 4 },
            sm: { span: 24, order: 5 },
            xs: { span: 24, order: 5 },
          }
        : timeRangePickerCol,
    },
    {
      name: 'workingStatus',
      label: '作业状态',
      children: <Select placeholder="请选择" options={workingStatusList} allowClear />,
      col: !isUnit
        ? {
            xxl: { span: 6, order: 6 },
            xl: { span: 8, order: 6 },
            lg: { span: 12, order: 6 },
            md: { span: 12, order: 6 },
            sm: { span: 24, order: 6 },
            xs: { span: 24, order: 6 },
          }
        : listPageCol,
    },
    {
      name: 'approveStatus',
      label: '审批状态',
      children: <Select placeholder="请选择" options={approveStatusList} allowClear />,
      col: !isUnit
        ? {
            xxl: { span: 6, order: 7 },
            xl: { span: 8, order: 7 },
            lg: { span: 12, order: 7 },
            md: { span: 12, order: 7 },
            sm: { span: 24, order: 7 },
            xs: { span: 24, order: 7 },
          }
        : listPageCol,
    },
    {
      name: 'planType',
      label: '计划性',
      children: <Select placeholder="请选择" options={planTypeList} allowClear />,
      col: !isUnit
        ? {
            xxl: { span: 6, order: 8 },
            xl: { span: 8, order: 8 },
            lg: { span: 12, order: 8 },
            md: { span: 12, order: 8 },
            sm: { span: 24, order: 8 },
            xs: { span: 24, order: 8 },
          }
        : listPageCol,
    },
    {
      name: 'implementationStatus',
      label: '是否已实施',
      children: <Select placeholder="请选择" options={implementationStatusList} allowClear />,
      col: !isUnit
        ? {
            xxl: { span: 6, order: 9 },
            xl: { span: 8, order: 9 },
            lg: { span: 12, order: 9 },
            md: { span: 12, order: 9 },
            sm: { span: 24, order: 9 },
            xs: { span: 24, order: 9 },
          }
        : listPageCol,
    },
    {
      children: (
        <div className={styles.buttonContainer}>
          <Button type="primary" htmlType="submit">
            查询
          </Button>
          <Button
            onClick={() => {
              form.resetFields();
              form.submit();
            }}
          >
            重置
          </Button>
          <Button type="primary" href={`#${addPath}${search}`} disabled={!hasAddAuthority}>
            新增
          </Button>
        </div>
      ),
      col: !isUnit
        ? {
            xxl: { span: 6, order: 10 },
            xl: { span: 8, order: 10 },
            lg: { span: 12, order: 10 },
            md: { span: 12, order: 10 },
            sm: { span: 24, order: 10 },
            xs: { span: 24, order: 10 },
          }
        : {
            xxl: 12,
            xl: 16,
            lg: 24,
            md: 24,
            sm: 24,
            xs: 24,
          },
    },
  ],
  [typeList[1].key]: ({
    isUnit,
    values,
    form,
    search,
    hasAddAuthority,
    companyList,
    loadingCompanyList,
    setCompanyPayload,
    onCompanySelectChange,
    departmentTree,
    loadingDepartmentTree,
    ranges,
  }) => [
    {
      name: 'company',
      label: '单位名称',
      children: (
        <PagingSelect
          options={companyList.list}
          loading={loadingCompanyList}
          allowClear
          disabled={isUnit}
          hasMore={
            companyList.pagination &&
            companyList.pagination.total >
              companyList.pagination.pageNum * companyList.pagination.pageSize
          }
          onSearch={name => setCompanyPayload(payload => ({ ...payload, pageNum: 1, name }))}
          loadMore={() =>
            setCompanyPayload(payload => ({ ...payload, pageNum: payload.pageNum + 1 }))
          }
          onChange={onCompanySelectChange}
        />
      ),
      getValueFromEvent: getSelectValueFromEvent,
      col: !isUnit
        ? {
            xxl: { span: 6, order: 0 },
            xl: { span: 8, order: 0 },
            lg: { span: 12, order: 0 },
            md: { span: 12, order: 0 },
            sm: { span: 24, order: 0 },
            xs: { span: 24, order: 0 },
          }
        : hiddenCol,
    },
    {
      name: 'applyUserName',
      label: '申请人',
      children: <Input placeholder="请输入" maxLength={50} allowClear />,
      col: !isUnit
        ? {
            xxl: { span: 6, order: 1 },
            xl: { span: 8, order: 1 },
            lg: { span: 12, order: 1 },
            md: { span: 12, order: 1 },
            sm: { span: 24, order: 1 },
            xs: { span: 24, order: 1 },
          }
        : listPageCol,
    },
    {
      name: 'applyDepartment',
      label: '申请部门',
      children: (
        <TreeSelect
          placeholder="请选择"
          treeData={values.company ? departmentTree : []}
          labelInValue
          notFoundContent={loadingDepartmentTree ? <Spin size="small" /> : undefined}
          showSearch
          treeNodeFilterProp="title"
          allowClear
        />
      ),
      getValueFromEvent: getSelectValueFromEvent,
      col: !isUnit
        ? {
            xxl: { span: 6, order: 2 },
            xl: { span: 8, order: 2 },
            lg: { span: 12, order: 2 },
            md: { span: 12, order: 2 },
            sm: { span: 24, order: 2 },
            xs: { span: 24, order: 2 },
          }
        : listPageCol,
    },
    {
      name: 'workingProject',
      label: '受限空间（设备）名称',
      children: <Input placeholder="请输入" maxLength={50} allowClear />,
      col: !isUnit
        ? {
            xxl: { span: 6, order: 3 },
            xl: { span: 8, order: 3 },
            lg: { span: 12, order: 3 },
            md: { span: 12, order: 3 },
            sm: { span: 24, order: 3 },
            xs: { span: 24, order: 3 },
          }
        : listPageCol,
    },
    {
      name: 'billCode',
      label: '作业证编号',
      children: <Input placeholder="请输入" maxLength={50} allowClear />,
      col: !isUnit
        ? {
            xxl: { span: 6, order: 4 },
            xl: { span: 8, order: 5 },
            lg: { span: 12, order: 5 },
            md: { span: 12, order: 5 },
            sm: { span: 24, order: 4 },
            xs: { span: 24, order: 4 },
          }
        : listPageCol,
    },
    {
      name: 'range',
      label: '作业时间',
      children: (
        <RangePicker
          className={styles.rangePicker}
          placeholder={timeRangePickerPlaceholder}
          format={minuteFormat}
          showTime
          separator="~"
          ranges={ranges}
          allowClear
        />
      ),
      col: !isUnit
        ? {
            xxl: { span: 12, order: 5 },
            xl: { span: 16, order: 4 },
            lg: { span: 24, order: 4 },
            md: { span: 24, order: 4 },
            sm: { span: 24, order: 5 },
            xs: { span: 24, order: 5 },
          }
        : timeRangePickerCol,
    },
    {
      name: 'workingStatus',
      label: '作业状态',
      children: <Select placeholder="请选择" options={workingStatusList} allowClear />,
      col: !isUnit
        ? {
            xxl: { span: 6, order: 6 },
            xl: { span: 8, order: 6 },
            lg: { span: 12, order: 6 },
            md: { span: 12, order: 6 },
            sm: { span: 24, order: 6 },
            xs: { span: 24, order: 6 },
          }
        : listPageCol,
    },
    {
      name: 'approveStatus',
      label: '审批状态',
      children: <Select placeholder="请选择" options={approveStatusList} allowClear />,
      col: !isUnit
        ? {
            xxl: { span: 6, order: 7 },
            xl: { span: 8, order: 7 },
            lg: { span: 12, order: 7 },
            md: { span: 12, order: 7 },
            sm: { span: 24, order: 7 },
            xs: { span: 24, order: 7 },
          }
        : listPageCol,
    },
    {
      name: 'planType',
      label: '计划性',
      children: <Select placeholder="请选择" options={planTypeList} allowClear />,
      col: !isUnit
        ? {
            xxl: { span: 6, order: 8 },
            xl: { span: 8, order: 8 },
            lg: { span: 12, order: 8 },
            md: { span: 12, order: 8 },
            sm: { span: 24, order: 8 },
            xs: { span: 24, order: 8 },
          }
        : listPageCol,
    },
    {
      name: 'implementationStatus',
      label: '是否已实施',
      children: <Select placeholder="请选择" options={implementationStatusList} allowClear />,
      col: !isUnit
        ? {
            xxl: { span: 6, order: 9 },
            xl: { span: 8, order: 9 },
            lg: { span: 12, order: 9 },
            md: { span: 12, order: 9 },
            sm: { span: 24, order: 9 },
            xs: { span: 24, order: 9 },
          }
        : listPageCol,
    },
    {
      children: (
        <div className={styles.buttonContainer}>
          <Button type="primary" htmlType="submit">
            查询
          </Button>
          <Button
            onClick={() => {
              form.resetFields();
              form.submit();
            }}
          >
            重置
          </Button>
          <Button type="primary" href={`#${addPath}${search}`} disabled={!hasAddAuthority}>
            新增
          </Button>
        </div>
      ),
      col: !isUnit
        ? {
            xxl: { span: 6, order: 10 },
            xl: { span: 8, order: 10 },
            lg: { span: 12, order: 10 },
            md: { span: 12, order: 10 },
            sm: { span: 24, order: 10 },
            xs: { span: 24, order: 10 },
          }
        : {
            xxl: 12,
            xl: 16,
            lg: 24,
            md: 24,
            sm: 24,
            xs: 24,
          },
    },
  ],
  [typeList[2].key]: ({
    isUnit,
    values,
    form,
    search,
    hasAddAuthority,
    companyList,
    loadingCompanyList,
    setCompanyPayload,
    onCompanySelectChange,
    departmentTree,
    loadingDepartmentTree,
    ranges,
  }) => [
    {
      name: 'company',
      label: '单位名称',
      children: (
        <PagingSelect
          options={companyList.list}
          loading={loadingCompanyList}
          allowClear
          disabled={isUnit}
          hasMore={
            companyList.pagination &&
            companyList.pagination.total >
              companyList.pagination.pageNum * companyList.pagination.pageSize
          }
          onSearch={name => setCompanyPayload(payload => ({ ...payload, pageNum: 1, name }))}
          loadMore={() =>
            setCompanyPayload(payload => ({ ...payload, pageNum: payload.pageNum + 1 }))
          }
          onChange={onCompanySelectChange}
        />
      ),
      getValueFromEvent: getSelectValueFromEvent,
      col: !isUnit
        ? {
            xxl: { span: 6, order: 0 },
            xl: { span: 8, order: 0 },
            lg: { span: 12, order: 0 },
            md: { span: 12, order: 0 },
            sm: { span: 24, order: 0 },
            xs: { span: 24, order: 0 },
          }
        : hiddenCol,
    },
    {
      name: 'applyUserName',
      label: '申请人',
      children: <Input placeholder="请输入" maxLength={50} allowClear />,
      col: !isUnit
        ? {
            xxl: { span: 6, order: 1 },
            xl: { span: 8, order: 1 },
            lg: { span: 12, order: 1 },
            md: { span: 12, order: 1 },
            sm: { span: 24, order: 1 },
            xs: { span: 24, order: 1 },
          }
        : listPageCol,
    },
    {
      name: 'applyDepartment',
      label: '申请部门',
      children: (
        <TreeSelect
          placeholder="请选择"
          treeData={values.company ? departmentTree : []}
          labelInValue
          notFoundContent={loadingDepartmentTree ? <Spin size="small" /> : undefined}
          showSearch
          treeNodeFilterProp="title"
          allowClear
        />
      ),
      getValueFromEvent: getSelectValueFromEvent,
      col: !isUnit
        ? {
            xxl: { span: 6, order: 2 },
            xl: { span: 8, order: 2 },
            lg: { span: 12, order: 2 },
            md: { span: 12, order: 2 },
            sm: { span: 24, order: 2 },
            xs: { span: 24, order: 2 },
          }
        : listPageCol,
    },
    {
      name: 'billCode',
      label: '作业证编号',
      children: <Input placeholder="请输入" maxLength={50} allowClear />,
      col: !isUnit
        ? {
            xxl: { span: 6, order: 3 },
            xl: { span: 8, order: 3 },
            lg: { span: 12, order: 3 },
            md: { span: 12, order: 3 },
            sm: { span: 24, order: 3 },
            xs: { span: 24, order: 3 },
          }
        : listPageCol,
    },
    {
      name: 'billLevel',
      label: '作业证类型',
      children: <Select placeholder="请选择" options={highWorkLevelList} allowClear />,
      col: !isUnit
        ? {
            xxl: { span: 6, order: 4 },
            xl: { span: 8, order: 5 },
            lg: { span: 12, order: 5 },
            md: { span: 12, order: 5 },
            sm: { span: 24, order: 4 },
            xs: { span: 24, order: 4 },
          }
        : listPageCol,
    },
    {
      name: 'range',
      label: '作业时间',
      children: (
        <RangePicker
          className={styles.rangePicker}
          placeholder={timeRangePickerPlaceholder}
          format={minuteFormat}
          showTime
          separator="~"
          ranges={ranges}
          allowClear
        />
      ),
      col: !isUnit
        ? {
            xxl: { span: 12, order: 5 },
            xl: { span: 16, order: 4 },
            lg: { span: 24, order: 4 },
            md: { span: 24, order: 4 },
            sm: { span: 24, order: 5 },
            xs: { span: 24, order: 5 },
          }
        : timeRangePickerCol,
    },
    {
      name: 'workingStatus',
      label: '作业状态',
      children: <Select placeholder="请选择" options={workingStatusList} allowClear />,
      col: !isUnit
        ? {
            xxl: { span: 6, order: 6 },
            xl: { span: 8, order: 6 },
            lg: { span: 12, order: 6 },
            md: { span: 12, order: 6 },
            sm: { span: 24, order: 6 },
            xs: { span: 24, order: 6 },
          }
        : listPageCol,
    },
    {
      name: 'approveStatus',
      label: '审批状态',
      children: <Select placeholder="请选择" options={approveStatusList} allowClear />,
      col: !isUnit
        ? {
            xxl: { span: 6, order: 7 },
            xl: { span: 8, order: 7 },
            lg: { span: 12, order: 7 },
            md: { span: 12, order: 7 },
            sm: { span: 24, order: 7 },
            xs: { span: 24, order: 7 },
          }
        : listPageCol,
    },
    {
      name: 'implementationStatus',
      label: '是否已实施',
      children: <Select placeholder="请选择" options={implementationStatusList} allowClear />,
      col: !isUnit
        ? {
            xxl: { span: 6, order: 9 },
            xl: { span: 8, order: 9 },
            lg: { span: 12, order: 9 },
            md: { span: 12, order: 9 },
            sm: { span: 24, order: 9 },
            xs: { span: 24, order: 9 },
          }
        : listPageCol,
    },
    {
      children: (
        <div className={styles.buttonContainer}>
          <Button type="primary" htmlType="submit">
            查询
          </Button>
          <Button
            onClick={() => {
              form.resetFields();
              form.submit();
            }}
          >
            重置
          </Button>
          <Button type="primary" href={`#${addPath}${search}`} disabled={!hasAddAuthority}>
            新增
          </Button>
        </div>
      ),
      col: !isUnit
        ? {
            xxl: { span: 12, order: 10 },
            xl: { span: 16, order: 10 },
            lg: { span: 24, order: 10 },
            md: { span: 24, order: 10 },
            sm: { span: 24, order: 10 },
            xs: { span: 24, order: 10 },
          }
        : {
            xxl: 18,
            xl: 24,
            lg: 12,
            md: 12,
            sm: 24,
            xs: 24,
          },
    },
  ],
  [typeList[3].key]: ({
    isUnit,
    values,
    form,
    search,
    hasAddAuthority,
    companyList,
    loadingCompanyList,
    setCompanyPayload,
    onCompanySelectChange,
    departmentTree,
    loadingDepartmentTree,
    ranges,
  }) => [
    {
      name: 'company',
      label: '单位名称',
      children: (
        <PagingSelect
          options={companyList.list}
          loading={loadingCompanyList}
          allowClear
          disabled={isUnit}
          hasMore={
            companyList.pagination &&
            companyList.pagination.total >
              companyList.pagination.pageNum * companyList.pagination.pageSize
          }
          onSearch={name => setCompanyPayload(payload => ({ ...payload, pageNum: 1, name }))}
          loadMore={() =>
            setCompanyPayload(payload => ({ ...payload, pageNum: payload.pageNum + 1 }))
          }
          onChange={onCompanySelectChange}
        />
      ),
      getValueFromEvent: getSelectValueFromEvent,
      col: !isUnit
        ? {
            xxl: { span: 6, order: 0 },
            xl: { span: 8, order: 0 },
            lg: { span: 12, order: 0 },
            md: { span: 12, order: 0 },
            sm: { span: 24, order: 0 },
            xs: { span: 24, order: 0 },
          }
        : hiddenCol,
    },
    {
      name: 'applyUserName',
      label: '申请人',
      children: <Input placeholder="请输入" maxLength={50} allowClear />,
      col: !isUnit
        ? {
            xxl: { span: 6, order: 1 },
            xl: { span: 8, order: 1 },
            lg: { span: 12, order: 1 },
            md: { span: 12, order: 1 },
            sm: { span: 24, order: 1 },
            xs: { span: 24, order: 1 },
          }
        : listPageCol,
    },
    {
      name: 'applyDepartment',
      label: '申请部门',
      children: (
        <TreeSelect
          placeholder="请选择"
          treeData={values.company ? departmentTree : []}
          labelInValue
          notFoundContent={loadingDepartmentTree ? <Spin size="small" /> : undefined}
          showSearch
          treeNodeFilterProp="title"
          allowClear
        />
      ),
      getValueFromEvent: getSelectValueFromEvent,
      col: !isUnit
        ? {
            xxl: { span: 6, order: 2 },
            xl: { span: 8, order: 2 },
            lg: { span: 12, order: 2 },
            md: { span: 12, order: 2 },
            sm: { span: 24, order: 2 },
            xs: { span: 24, order: 2 },
          }
        : listPageCol,
    },
    {
      name: 'billCode',
      label: '作业证编号',
      children: <Input placeholder="请输入" maxLength={50} allowClear />,
      col: !isUnit
        ? {
            xxl: { span: 6, order: 3 },
            xl: { span: 8, order: 3 },
            lg: { span: 12, order: 3 },
            md: { span: 12, order: 3 },
            sm: { span: 24, order: 3 },
            xs: { span: 24, order: 3 },
          }
        : listPageCol,
    },
    {
      name: 'billLevel',
      label: '作业证类型',
      children: <Select placeholder="请选择" options={hoistingWorkLevelList} allowClear />,
      col: !isUnit
        ? {
            xxl: { span: 6, order: 4 },
            xl: { span: 8, order: 5 },
            lg: { span: 12, order: 5 },
            md: { span: 12, order: 5 },
            sm: { span: 24, order: 4 },
            xs: { span: 24, order: 4 },
          }
        : listPageCol,
    },
    {
      name: 'range',
      label: '作业时间',
      children: (
        <RangePicker
          className={styles.rangePicker}
          placeholder={timeRangePickerPlaceholder}
          format={minuteFormat}
          showTime
          separator="~"
          ranges={ranges}
          allowClear
        />
      ),
      col: !isUnit
        ? {
            xxl: { span: 12, order: 5 },
            xl: { span: 16, order: 4 },
            lg: { span: 24, order: 4 },
            md: { span: 24, order: 4 },
            sm: { span: 24, order: 5 },
            xs: { span: 24, order: 5 },
          }
        : timeRangePickerCol,
    },
    {
      name: 'workingStatus',
      label: '作业状态',
      children: <Select placeholder="请选择" options={workingStatusList} allowClear />,
      col: !isUnit
        ? {
            xxl: { span: 6, order: 6 },
            xl: { span: 8, order: 6 },
            lg: { span: 12, order: 6 },
            md: { span: 12, order: 6 },
            sm: { span: 24, order: 6 },
            xs: { span: 24, order: 6 },
          }
        : listPageCol,
    },
    {
      name: 'approveStatus',
      label: '审批状态',
      children: <Select placeholder="请选择" options={approveStatusList} allowClear />,
      col: !isUnit
        ? {
            xxl: { span: 6, order: 7 },
            xl: { span: 8, order: 7 },
            lg: { span: 12, order: 7 },
            md: { span: 12, order: 7 },
            sm: { span: 24, order: 7 },
            xs: { span: 24, order: 7 },
          }
        : listPageCol,
    },
    {
      name: 'implementationStatus',
      label: '是否已实施',
      children: <Select placeholder="请选择" options={implementationStatusList} allowClear />,
      col: !isUnit
        ? {
            xxl: { span: 6, order: 9 },
            xl: { span: 8, order: 9 },
            lg: { span: 12, order: 9 },
            md: { span: 12, order: 9 },
            sm: { span: 24, order: 9 },
            xs: { span: 24, order: 9 },
          }
        : listPageCol,
    },
    {
      children: (
        <div className={styles.buttonContainer}>
          <Button type="primary" htmlType="submit">
            查询
          </Button>
          <Button
            onClick={() => {
              form.resetFields();
              form.submit();
            }}
          >
            重置
          </Button>
          <Button type="primary" href={`#${addPath}${search}`} disabled={!hasAddAuthority}>
            新增
          </Button>
        </div>
      ),
      col: !isUnit
        ? {
            xxl: { span: 12, order: 10 },
            xl: { span: 16, order: 10 },
            lg: { span: 24, order: 10 },
            md: { span: 24, order: 10 },
            sm: { span: 24, order: 10 },
            xs: { span: 24, order: 10 },
          }
        : {
            xxl: 18,
            xl: 24,
            lg: 12,
            md: 12,
            sm: 24,
            xs: 24,
          },
    },
  ],
  [typeList[4].key]: ({
    isUnit,
    values,
    form,
    search,
    hasAddAuthority,
    companyList,
    loadingCompanyList,
    setCompanyPayload,
    onCompanySelectChange,
    departmentTree,
    loadingDepartmentTree,
    ranges,
  }) => [
    {
      name: 'company',
      label: '单位名称',
      children: (
        <PagingSelect
          options={companyList.list}
          loading={loadingCompanyList}
          allowClear
          disabled={isUnit}
          hasMore={
            companyList.pagination &&
            companyList.pagination.total >
              companyList.pagination.pageNum * companyList.pagination.pageSize
          }
          onSearch={name => setCompanyPayload(payload => ({ ...payload, pageNum: 1, name }))}
          loadMore={() =>
            setCompanyPayload(payload => ({ ...payload, pageNum: payload.pageNum + 1 }))
          }
          onChange={onCompanySelectChange}
        />
      ),
      getValueFromEvent: getSelectValueFromEvent,
      col: !isUnit ? listPageCol : hiddenCol,
    },
    {
      name: 'applyUserName',
      label: '申请人',
      children: <Input placeholder="请输入" maxLength={50} allowClear />,
      col: !isUnit
        ? listPageCol
        : {
            xxl: { span: 6, order: 1 },
            xl: { span: 8, order: 1 },
            lg: { span: 12, order: 1 },
            md: { span: 12, order: 1 },
            sm: { span: 24, order: 1 },
            xs: { span: 24, order: 1 },
          },
    },
    {
      name: 'applyDepartment',
      label: '申请部门',
      children: (
        <TreeSelect
          placeholder="请选择"
          treeData={values.company ? departmentTree : []}
          labelInValue
          notFoundContent={loadingDepartmentTree ? <Spin size="small" /> : undefined}
          showSearch
          treeNodeFilterProp="title"
          allowClear
        />
      ),
      getValueFromEvent: getSelectValueFromEvent,
      col: !isUnit
        ? listPageCol
        : {
            xxl: { span: 6, order: 2 },
            xl: { span: 8, order: 2 },
            lg: { span: 12, order: 2 },
            md: { span: 12, order: 2 },
            sm: { span: 24, order: 2 },
            xs: { span: 24, order: 2 },
          },
    },
    {
      name: 'billCode',
      label: '作业证编号',
      children: <Input placeholder="请输入" maxLength={50} allowClear />,
      col: !isUnit
        ? listPageCol
        : {
            xxl: { span: 6, order: 4 },
            xl: { span: 8, order: 3 },
            lg: { span: 12, order: 4 },
            md: { span: 12, order: 4 },
            sm: { span: 24, order: 3 },
            xs: { span: 24, order: 3 },
          },
    },
    {
      name: 'range',
      label: '作业时间',
      children: (
        <RangePicker
          className={styles.rangePicker}
          placeholder={timeRangePickerPlaceholder}
          format={minuteFormat}
          showTime
          separator="~"
          ranges={ranges}
          allowClear
        />
      ),
      col: !isUnit
        ? timeRangePickerCol
        : {
            xxl: { span: 12, order: 3 },
            xl: { span: 16, order: 4 },
            lg: { span: 24, order: 3 },
            md: { span: 24, order: 3 },
            sm: { span: 24, order: 4 },
            xs: { span: 24, order: 4 },
          },
    },
    {
      name: 'planType',
      label: '计划性',
      children: <Select placeholder="请选择" options={planTypeList} allowClear />,
      col: !isUnit
        ? listPageCol
        : {
            xxl: { span: 6, order: 5 },
            xl: { span: 8, order: 5 },
            lg: { span: 12, order: 5 },
            md: { span: 12, order: 5 },
            sm: { span: 24, order: 5 },
            xs: { span: 24, order: 5 },
          },
    },
    {
      name: 'workingStatus',
      label: '作业状态',
      children: <Select placeholder="请选择" options={workingStatusList} allowClear />,
      col: !isUnit
        ? listPageCol
        : {
            xxl: { span: 6, order: 6 },
            xl: { span: 8, order: 6 },
            lg: { span: 12, order: 6 },
            md: { span: 12, order: 6 },
            sm: { span: 24, order: 6 },
            xs: { span: 24, order: 6 },
          },
    },
    {
      name: 'approveStatus',
      label: '审批状态',
      children: <Select placeholder="请选择" options={approveStatusList} allowClear />,
      col: !isUnit
        ? listPageCol
        : {
            xxl: { span: 6, order: 7 },
            xl: { span: 8, order: 7 },
            lg: { span: 12, order: 7 },
            md: { span: 12, order: 7 },
            sm: { span: 24, order: 7 },
            xs: { span: 24, order: 7 },
          },
    },
    {
      name: 'implementationStatus',
      label: '是否已实施',
      children: <Select placeholder="请选择" options={implementationStatusList} allowClear />,
      col: !isUnit
        ? listPageCol
        : {
            xxl: { span: 6, order: 8 },
            xl: { span: 8, order: 8 },
            lg: { span: 12, order: 8 },
            md: { span: 12, order: 8 },
            sm: { span: 24, order: 8 },
            xs: { span: 24, order: 8 },
          },
    },
    {
      children: (
        <div className={styles.buttonContainer}>
          <Button type="primary" htmlType="submit">
            查询
          </Button>
          <Button
            onClick={() => {
              form.resetFields();
              form.submit();
            }}
          >
            重置
          </Button>
          <Button type="primary" href={`#${addPath}${search}`} disabled={!hasAddAuthority}>
            新增
          </Button>
        </div>
      ),
      col: !isUnit
        ? {
            xxl: 12,
            xl: 16,
            lg: 24,
            md: 24,
            sm: 24,
            xs: 24,
          }
        : {
            xxl: { span: 18, order: 10 },
            xl: { span: 24, order: 10 },
            lg: { span: 12, order: 10 },
            md: { span: 12, order: 10 },
            sm: { span: 24, order: 10 },
            xs: { span: 24, order: 10 },
          },
    },
  ],
  [typeList[5].key]: ({
    isUnit,
    values,
    form,
    search,
    hasAddAuthority,
    companyList,
    loadingCompanyList,
    setCompanyPayload,
    onCompanySelectChange,
    departmentTree,
    loadingDepartmentTree,
    ranges,
  }) => [
    {
      name: 'company',
      label: '单位名称',
      children: (
        <PagingSelect
          options={companyList.list}
          loading={loadingCompanyList}
          allowClear
          disabled={isUnit}
          hasMore={
            companyList.pagination &&
            companyList.pagination.total >
              companyList.pagination.pageNum * companyList.pagination.pageSize
          }
          onSearch={name => setCompanyPayload(payload => ({ ...payload, pageNum: 1, name }))}
          loadMore={() =>
            setCompanyPayload(payload => ({ ...payload, pageNum: payload.pageNum + 1 }))
          }
          onChange={onCompanySelectChange}
        />
      ),
      getValueFromEvent: getSelectValueFromEvent,
      col: !isUnit
        ? {
            xxl: { span: 6, order: 0 },
            xl: { span: 8, order: 0 },
            lg: { span: 12, order: 0 },
            md: { span: 12, order: 0 },
            sm: { span: 24, order: 0 },
            xs: { span: 24, order: 0 },
          }
        : hiddenCol,
    },
    {
      name: 'applyUserName',
      label: '申请人',
      children: <Input placeholder="请输入" maxLength={50} allowClear />,
      col: !isUnit
        ? {
            xxl: { span: 6, order: 1 },
            xl: { span: 8, order: 1 },
            lg: { span: 12, order: 1 },
            md: { span: 12, order: 1 },
            sm: { span: 24, order: 1 },
            xs: { span: 24, order: 1 },
          }
        : listPageCol,
    },
    {
      name: 'applyDepartment',
      label: '申请部门',
      children: (
        <TreeSelect
          placeholder="请选择"
          treeData={values.company ? departmentTree : []}
          labelInValue
          notFoundContent={loadingDepartmentTree ? <Spin size="small" /> : undefined}
          showSearch
          treeNodeFilterProp="title"
          allowClear
        />
      ),
      getValueFromEvent: getSelectValueFromEvent,
      col: !isUnit
        ? {
            xxl: { span: 6, order: 2 },
            xl: { span: 8, order: 2 },
            lg: { span: 12, order: 2 },
            md: { span: 12, order: 2 },
            sm: { span: 24, order: 2 },
            xs: { span: 24, order: 2 },
          }
        : listPageCol,
    },
    {
      name: 'billCode',
      label: '作业证编号',
      children: <Input placeholder="请输入" maxLength={50} allowClear />,
      col: !isUnit
        ? {
            xxl: { span: 6, order: 3 },
            xl: { span: 8, order: 3 },
            lg: { span: 12, order: 3 },
            md: { span: 12, order: 3 },
            sm: { span: 24, order: 3 },
            xs: { span: 24, order: 3 },
          }
        : listPageCol,
    },
    {
      name: 'workingProject',
      label: '维修项目名称',
      children: <Input placeholder="请输入" maxLength={50} allowClear />,
      col: !isUnit
        ? {
            xxl: { span: 6, order: 4 },
            xl: { span: 8, order: 5 },
            lg: { span: 12, order: 5 },
            md: { span: 12, order: 5 },
            sm: { span: 24, order: 4 },
            xs: { span: 24, order: 4 },
          }
        : listPageCol,
    },
    {
      name: 'range',
      label: '作业时间',
      children: (
        <RangePicker
          className={styles.rangePicker}
          placeholder={timeRangePickerPlaceholder}
          format={minuteFormat}
          showTime
          separator="~"
          ranges={ranges}
          allowClear
        />
      ),
      col: !isUnit
        ? {
            xxl: { span: 12, order: 5 },
            xl: { span: 16, order: 4 },
            lg: { span: 24, order: 4 },
            md: { span: 24, order: 4 },
            sm: { span: 24, order: 5 },
            xs: { span: 24, order: 5 },
          }
        : timeRangePickerCol,
    },
    {
      name: 'planType',
      label: '计划性',
      children: <Select placeholder="请选择" options={planTypeList} allowClear />,
      col: !isUnit
        ? {
            xxl: { span: 6, order: 6 },
            xl: { span: 8, order: 6 },
            lg: { span: 12, order: 6 },
            md: { span: 12, order: 6 },
            sm: { span: 24, order: 6 },
            xs: { span: 24, order: 6 },
          }
        : listPageCol,
    },
    {
      name: 'workingStatus',
      label: '作业状态',
      children: <Select placeholder="请选择" options={workingStatusList} allowClear />,
      col: !isUnit
        ? {
            xxl: { span: 6, order: 7 },
            xl: { span: 8, order: 7 },
            lg: { span: 12, order: 7 },
            md: { span: 12, order: 7 },
            sm: { span: 24, order: 7 },
            xs: { span: 24, order: 7 },
          }
        : listPageCol,
    },
    {
      name: 'approveStatus',
      label: '审批状态',
      children: <Select placeholder="请选择" options={approveStatusList} allowClear />,
      col: !isUnit
        ? {
            xxl: { span: 6, order: 8 },
            xl: { span: 8, order: 8 },
            lg: { span: 12, order: 8 },
            md: { span: 12, order: 8 },
            sm: { span: 24, order: 8 },
            xs: { span: 24, order: 8 },
          }
        : listPageCol,
    },
    {
      name: 'implementationStatus',
      label: '是否已实施',
      children: <Select placeholder="请选择" options={implementationStatusList} allowClear />,
      col: !isUnit
        ? {
            xxl: { span: 6, order: 9 },
            xl: { span: 8, order: 9 },
            lg: { span: 12, order: 9 },
            md: { span: 12, order: 9 },
            sm: { span: 24, order: 9 },
            xs: { span: 24, order: 9 },
          }
        : listPageCol,
    },
    {
      children: (
        <div className={styles.buttonContainer}>
          <Button type="primary" htmlType="submit">
            查询
          </Button>
          <Button
            onClick={() => {
              form.resetFields();
              form.submit();
            }}
          >
            重置
          </Button>
          <Button type="primary" href={`#${addPath}${search}`} disabled={!hasAddAuthority}>
            新增
          </Button>
        </div>
      ),
      col: !isUnit
        ? {
            xxl: { span: 6, order: 10 },
            xl: { span: 8, order: 10 },
            lg: { span: 12, order: 10 },
            md: { span: 12, order: 10 },
            sm: { span: 24, order: 10 },
            xs: { span: 24, order: 10 },
          }
        : {
            xxl: 12,
            xl: 16,
            lg: 24,
            md: 24,
            sm: 24,
            xs: 24,
          },
    },
  ],
  [typeList[6].key]: ({
    isUnit,
    values,
    form,
    search,
    hasAddAuthority,
    companyList,
    loadingCompanyList,
    setCompanyPayload,
    onCompanySelectChange,
    departmentTree,
    loadingDepartmentTree,
    ranges,
  }) => [
    {
      name: 'company',
      label: '单位名称',
      children: (
        <PagingSelect
          options={companyList.list}
          loading={loadingCompanyList}
          allowClear
          disabled={isUnit}
          hasMore={
            companyList.pagination &&
            companyList.pagination.total >
              companyList.pagination.pageNum * companyList.pagination.pageSize
          }
          onSearch={name => setCompanyPayload(payload => ({ ...payload, pageNum: 1, name }))}
          loadMore={() =>
            setCompanyPayload(payload => ({ ...payload, pageNum: payload.pageNum + 1 }))
          }
          onChange={onCompanySelectChange}
        />
      ),
      getValueFromEvent: getSelectValueFromEvent,
      col: !isUnit
        ? {
            xxl: { span: 6, order: 0 },
            xl: { span: 8, order: 0 },
            lg: { span: 12, order: 0 },
            md: { span: 12, order: 0 },
            sm: { span: 24, order: 0 },
            xs: { span: 24, order: 0 },
          }
        : hiddenCol,
    },
    {
      name: 'applyUserName',
      label: '申请人',
      children: <Input placeholder="请输入" maxLength={50} allowClear />,
      col: !isUnit
        ? {
            xxl: { span: 6, order: 1 },
            xl: { span: 8, order: 1 },
            lg: { span: 12, order: 1 },
            md: { span: 12, order: 1 },
            sm: { span: 24, order: 1 },
            xs: { span: 24, order: 1 },
          }
        : listPageCol,
    },
    {
      name: 'applyDepartment',
      label: '申请部门',
      children: (
        <TreeSelect
          placeholder="请选择"
          treeData={values.company ? departmentTree : []}
          labelInValue
          notFoundContent={loadingDepartmentTree ? <Spin size="small" /> : undefined}
          showSearch
          treeNodeFilterProp="title"
          allowClear
        />
      ),
      getValueFromEvent: getSelectValueFromEvent,
      col: !isUnit
        ? {
            xxl: { span: 6, order: 2 },
            xl: { span: 8, order: 2 },
            lg: { span: 12, order: 2 },
            md: { span: 12, order: 2 },
            sm: { span: 24, order: 2 },
            xs: { span: 24, order: 2 },
          }
        : listPageCol,
    },
    {
      name: 'billCode',
      label: '作业证编号',
      children: <Input placeholder="请输入" maxLength={50} allowClear />,
      col: !isUnit
        ? {
            xxl: { span: 6, order: 3 },
            xl: { span: 8, order: 3 },
            lg: { span: 12, order: 3 },
            md: { span: 12, order: 3 },
            sm: { span: 24, order: 3 },
            xs: { span: 24, order: 3 },
          }
        : listPageCol,
    },
    {
      name: 'billLevel',
      label: '盲板作业类型',
      children: <Select placeholder="请选择" options={blindPlateWorkLevelList} allowClear />,
      col: !isUnit
        ? {
            xxl: { span: 6, order: 4 },
            xl: { span: 8, order: 5 },
            lg: { span: 12, order: 5 },
            md: { span: 12, order: 5 },
            sm: { span: 24, order: 4 },
            xs: { span: 24, order: 4 },
          }
        : listPageCol,
    },
    {
      name: 'range',
      label: '作业时间',
      children: (
        <RangePicker
          className={styles.rangePicker}
          placeholder={timeRangePickerPlaceholder}
          format={minuteFormat}
          showTime
          separator="~"
          ranges={ranges}
          allowClear
        />
      ),
      col: !isUnit
        ? {
            xxl: { span: 12, order: 5 },
            xl: { span: 16, order: 4 },
            lg: { span: 24, order: 4 },
            md: { span: 24, order: 4 },
            sm: { span: 24, order: 5 },
            xs: { span: 24, order: 5 },
          }
        : timeRangePickerCol,
    },
    {
      name: 'workingStatus',
      label: '作业状态',
      children: <Select placeholder="请选择" options={workingStatusList} allowClear />,
      col: !isUnit
        ? {
            xxl: { span: 6, order: 6 },
            xl: { span: 8, order: 6 },
            lg: { span: 12, order: 6 },
            md: { span: 12, order: 6 },
            sm: { span: 24, order: 6 },
            xs: { span: 24, order: 6 },
          }
        : listPageCol,
    },
    {
      name: 'approveStatus',
      label: '审批状态',
      children: <Select placeholder="请选择" options={approveStatusList} allowClear />,
      col: !isUnit
        ? {
            xxl: { span: 6, order: 7 },
            xl: { span: 8, order: 7 },
            lg: { span: 12, order: 7 },
            md: { span: 12, order: 7 },
            sm: { span: 24, order: 7 },
            xs: { span: 24, order: 7 },
          }
        : listPageCol,
    },
    {
      name: 'planType',
      label: '计划性',
      children: <Select placeholder="请选择" options={planTypeList} allowClear />,
      col: !isUnit
        ? {
            xxl: { span: 6, order: 8 },
            xl: { span: 8, order: 8 },
            lg: { span: 12, order: 8 },
            md: { span: 12, order: 8 },
            sm: { span: 24, order: 8 },
            xs: { span: 24, order: 8 },
          }
        : listPageCol,
    },
    {
      name: 'implementationStatus',
      label: '是否已实施',
      children: <Select placeholder="请选择" options={implementationStatusList} allowClear />,
      col: !isUnit
        ? {
            xxl: { span: 6, order: 9 },
            xl: { span: 8, order: 9 },
            lg: { span: 12, order: 9 },
            md: { span: 12, order: 9 },
            sm: { span: 24, order: 9 },
            xs: { span: 24, order: 9 },
          }
        : listPageCol,
    },
    {
      children: (
        <div className={styles.buttonContainer}>
          <Button type="primary" htmlType="submit">
            查询
          </Button>
          <Button
            onClick={() => {
              form.resetFields();
              form.submit();
            }}
          >
            重置
          </Button>
          <Button type="primary" href={`#${addPath}${search}`} disabled={!hasAddAuthority}>
            新增
          </Button>
        </div>
      ),
      col: !isUnit
        ? {
            xxl: { span: 6, order: 10 },
            xl: { span: 8, order: 10 },
            lg: { span: 12, order: 10 },
            md: { span: 12, order: 10 },
            sm: { span: 24, order: 10 },
            xs: { span: 24, order: 10 },
          }
        : {
            xxl: 12,
            xl: 16,
            lg: 24,
            md: 24,
            sm: 24,
            xs: 24,
          },
    },
  ],
  [typeList[7].key]: ({
    isUnit,
    values,
    form,
    search,
    hasAddAuthority,
    companyList,
    loadingCompanyList,
    setCompanyPayload,
    onCompanySelectChange,
    departmentTree,
    loadingDepartmentTree,
    ranges,
  }) => [
    {
      name: 'company',
      label: '单位名称',
      children: (
        <PagingSelect
          options={companyList.list}
          loading={loadingCompanyList}
          allowClear
          disabled={isUnit}
          hasMore={
            companyList.pagination &&
            companyList.pagination.total >
              companyList.pagination.pageNum * companyList.pagination.pageSize
          }
          onSearch={name => setCompanyPayload(payload => ({ ...payload, pageNum: 1, name }))}
          loadMore={() =>
            setCompanyPayload(payload => ({ ...payload, pageNum: payload.pageNum + 1 }))
          }
          onChange={onCompanySelectChange}
        />
      ),
      getValueFromEvent: getSelectValueFromEvent,
      col: !isUnit ? listPageCol : hiddenCol,
    },
    {
      name: 'applyUserName',
      label: '申请人',
      children: <Input placeholder="请输入" maxLength={50} allowClear />,
      col: !isUnit
        ? listPageCol
        : {
            xxl: { span: 6, order: 1 },
            xl: { span: 8, order: 1 },
            lg: { span: 12, order: 1 },
            md: { span: 12, order: 1 },
            sm: { span: 24, order: 1 },
            xs: { span: 24, order: 1 },
          },
    },
    {
      name: 'applyDepartment',
      label: '申请部门',
      children: (
        <TreeSelect
          placeholder="请选择"
          treeData={values.company ? departmentTree : []}
          labelInValue
          notFoundContent={loadingDepartmentTree ? <Spin size="small" /> : undefined}
          showSearch
          treeNodeFilterProp="title"
          allowClear
        />
      ),
      getValueFromEvent: getSelectValueFromEvent,
      col: !isUnit
        ? listPageCol
        : {
            xxl: { span: 6, order: 2 },
            xl: { span: 8, order: 2 },
            lg: { span: 12, order: 2 },
            md: { span: 12, order: 2 },
            sm: { span: 24, order: 2 },
            xs: { span: 24, order: 2 },
          },
    },
    {
      name: 'billCode',
      label: '作业证编号',
      children: <Input placeholder="请输入" maxLength={50} allowClear />,
      col: !isUnit
        ? listPageCol
        : {
            xxl: { span: 6, order: 4 },
            xl: { span: 8, order: 3 },
            lg: { span: 12, order: 4 },
            md: { span: 12, order: 4 },
            sm: { span: 24, order: 3 },
            xs: { span: 24, order: 3 },
          },
    },
    {
      name: 'range',
      label: '作业时间',
      children: (
        <RangePicker
          className={styles.rangePicker}
          placeholder={timeRangePickerPlaceholder}
          format={minuteFormat}
          showTime
          separator="~"
          ranges={ranges}
          allowClear
        />
      ),
      col: !isUnit
        ? timeRangePickerCol
        : {
            xxl: { span: 12, order: 3 },
            xl: { span: 16, order: 4 },
            lg: { span: 24, order: 3 },
            md: { span: 24, order: 3 },
            sm: { span: 24, order: 4 },
            xs: { span: 24, order: 4 },
          },
    },
    {
      name: 'planType',
      label: '计划性',
      children: <Select placeholder="请选择" options={planTypeList} allowClear />,
      col: !isUnit
        ? listPageCol
        : {
            xxl: { span: 6, order: 5 },
            xl: { span: 8, order: 5 },
            lg: { span: 12, order: 5 },
            md: { span: 12, order: 5 },
            sm: { span: 24, order: 5 },
            xs: { span: 24, order: 5 },
          },
    },
    {
      name: 'workingStatus',
      label: '作业状态',
      children: <Select placeholder="请选择" options={workingStatusList} allowClear />,
      col: !isUnit
        ? listPageCol
        : {
            xxl: { span: 6, order: 6 },
            xl: { span: 8, order: 6 },
            lg: { span: 12, order: 6 },
            md: { span: 12, order: 6 },
            sm: { span: 24, order: 6 },
            xs: { span: 24, order: 6 },
          },
    },
    {
      name: 'approveStatus',
      label: '审批状态',
      children: <Select placeholder="请选择" options={approveStatusList} allowClear />,
      col: !isUnit
        ? listPageCol
        : {
            xxl: { span: 6, order: 7 },
            xl: { span: 8, order: 7 },
            lg: { span: 12, order: 7 },
            md: { span: 12, order: 7 },
            sm: { span: 24, order: 7 },
            xs: { span: 24, order: 7 },
          },
    },
    {
      name: 'implementationStatus',
      label: '是否已实施',
      children: <Select placeholder="请选择" options={implementationStatusList} allowClear />,
      col: !isUnit
        ? listPageCol
        : {
            xxl: { span: 6, order: 8 },
            xl: { span: 8, order: 8 },
            lg: { span: 12, order: 8 },
            md: { span: 12, order: 8 },
            sm: { span: 24, order: 8 },
            xs: { span: 24, order: 8 },
          },
    },
    {
      children: (
        <div className={styles.buttonContainer}>
          <Button type="primary" htmlType="submit">
            查询
          </Button>
          <Button
            onClick={() => {
              form.resetFields();
              form.submit();
            }}
          >
            重置
          </Button>
          <Button type="primary" href={`#${addPath}${search}`} disabled={!hasAddAuthority}>
            新增
          </Button>
        </div>
      ),
      col: !isUnit
        ? {
            xxl: 12,
            xl: 16,
            lg: 24,
            md: 24,
            sm: 24,
            xs: 24,
          }
        : {
            xxl: { span: 18, order: 10 },
            xl: { span: 24, order: 10 },
            lg: { span: 12, order: 10 },
            md: { span: 12, order: 10 },
            sm: { span: 24, order: 10 },
            xs: { span: 24, order: 10 },
          },
    },
  ],
  [typeList[8].key]: ({
    isUnit,
    values,
    form,
    search,
    hasAddAuthority,
    companyList,
    loadingCompanyList,
    setCompanyPayload,
    onCompanySelectChange,
    departmentTree,
    loadingDepartmentTree,
    ranges,
  }) => [
    {
      name: 'company',
      label: '单位名称',
      children: (
        <PagingSelect
          options={companyList.list}
          loading={loadingCompanyList}
          allowClear
          disabled={isUnit}
          hasMore={
            companyList.pagination &&
            companyList.pagination.total >
              companyList.pagination.pageNum * companyList.pagination.pageSize
          }
          onSearch={name => setCompanyPayload(payload => ({ ...payload, pageNum: 1, name }))}
          loadMore={() =>
            setCompanyPayload(payload => ({ ...payload, pageNum: payload.pageNum + 1 }))
          }
          onChange={onCompanySelectChange}
        />
      ),
      getValueFromEvent: getSelectValueFromEvent,
      col: !isUnit ? listPageCol : hiddenCol,
    },
    {
      name: 'applyUserName',
      label: '申请人',
      children: <Input placeholder="请输入" maxLength={50} allowClear />,
      col: !isUnit
        ? listPageCol
        : {
            xxl: { span: 6, order: 1 },
            xl: { span: 8, order: 1 },
            lg: { span: 12, order: 1 },
            md: { span: 12, order: 1 },
            sm: { span: 24, order: 1 },
            xs: { span: 24, order: 1 },
          },
    },
    {
      name: 'applyDepartment',
      label: '申请部门',
      children: (
        <TreeSelect
          placeholder="请选择"
          treeData={values.company ? departmentTree : []}
          labelInValue
          notFoundContent={loadingDepartmentTree ? <Spin size="small" /> : undefined}
          showSearch
          treeNodeFilterProp="title"
          allowClear
        />
      ),
      getValueFromEvent: getSelectValueFromEvent,
      col: !isUnit
        ? listPageCol
        : {
            xxl: { span: 6, order: 2 },
            xl: { span: 8, order: 2 },
            lg: { span: 12, order: 2 },
            md: { span: 12, order: 2 },
            sm: { span: 24, order: 2 },
            xs: { span: 24, order: 2 },
          },
    },
    {
      name: 'billCode',
      label: '作业证编号',
      children: <Input placeholder="请输入" maxLength={50} allowClear />,
      col: !isUnit
        ? listPageCol
        : {
            xxl: { span: 6, order: 4 },
            xl: { span: 8, order: 3 },
            lg: { span: 12, order: 4 },
            md: { span: 12, order: 4 },
            sm: { span: 24, order: 3 },
            xs: { span: 24, order: 3 },
          },
    },
    {
      name: 'range',
      label: '作业时间',
      children: (
        <RangePicker
          className={styles.rangePicker}
          placeholder={timeRangePickerPlaceholder}
          format={minuteFormat}
          showTime
          separator="~"
          ranges={ranges}
          allowClear
        />
      ),
      col: !isUnit
        ? timeRangePickerCol
        : {
            xxl: { span: 12, order: 3 },
            xl: { span: 16, order: 4 },
            lg: { span: 24, order: 3 },
            md: { span: 24, order: 3 },
            sm: { span: 24, order: 4 },
            xs: { span: 24, order: 4 },
          },
    },
    {
      name: 'planType',
      label: '计划性',
      children: <Select placeholder="请选择" options={planTypeList} allowClear />,
      col: !isUnit
        ? listPageCol
        : {
            xxl: { span: 6, order: 5 },
            xl: { span: 8, order: 5 },
            lg: { span: 12, order: 5 },
            md: { span: 12, order: 5 },
            sm: { span: 24, order: 5 },
            xs: { span: 24, order: 5 },
          },
    },
    {
      name: 'workingStatus',
      label: '作业状态',
      children: <Select placeholder="请选择" options={workingStatusList} allowClear />,
      col: !isUnit
        ? listPageCol
        : {
            xxl: { span: 6, order: 6 },
            xl: { span: 8, order: 6 },
            lg: { span: 12, order: 6 },
            md: { span: 12, order: 6 },
            sm: { span: 24, order: 6 },
            xs: { span: 24, order: 6 },
          },
    },
    {
      name: 'approveStatus',
      label: '审批状态',
      children: <Select placeholder="请选择" options={approveStatusList} allowClear />,
      col: !isUnit
        ? listPageCol
        : {
            xxl: { span: 6, order: 7 },
            xl: { span: 8, order: 7 },
            lg: { span: 12, order: 7 },
            md: { span: 12, order: 7 },
            sm: { span: 24, order: 7 },
            xs: { span: 24, order: 7 },
          },
    },
    {
      name: 'implementationStatus',
      label: '是否已实施',
      children: <Select placeholder="请选择" options={implementationStatusList} allowClear />,
      col: !isUnit
        ? listPageCol
        : {
            xxl: { span: 6, order: 8 },
            xl: { span: 8, order: 8 },
            lg: { span: 12, order: 8 },
            md: { span: 12, order: 8 },
            sm: { span: 24, order: 8 },
            xs: { span: 24, order: 8 },
          },
    },
    {
      children: (
        <div className={styles.buttonContainer}>
          <Button type="primary" htmlType="submit">
            查询
          </Button>
          <Button
            onClick={() => {
              form.resetFields();
              form.submit();
            }}
          >
            重置
          </Button>
          <Button type="primary" href={`#${addPath}${search}`} disabled={!hasAddAuthority}>
            新增
          </Button>
        </div>
      ),
      col: !isUnit
        ? {
            xxl: 12,
            xl: 16,
            lg: 24,
            md: 24,
            sm: 24,
            xs: 24,
          }
        : {
            xxl: { span: 18, order: 10 },
            xl: { span: 24, order: 10 },
            lg: { span: 12, order: 10 },
            md: { span: 12, order: 10 },
            sm: { span: 24, order: 10 },
            xs: { span: 24, order: 10 },
          },
    },
  ],
};
export const getColumnsMap = {
  [typeList[0].key]: ({
    isUnit,
    search,
    hasDetailAuthority,
    hasAddAuthority,
    hasEditAuthority,
    hasDeleteAuthority,
    hasApproveAuthority,
    deleteList,
    setPayload,
    onApproveButtonClick,
  }) => {
    return [
      ...(!isUnit
        ? [
            {
              dataIndex: 'companyName',
              title: '单位名称',
              render: value => value || <EmptyText />,
            },
          ]
        : []),
      {
        dataIndex: 'applyDate',
        title: '申请日期',
        render: value => (value ? moment(value).format(dateFormat) : <EmptyText />),
      },
      {
        dataIndex: 'applyUserName',
        title: '申请人',
        render: value => value || <EmptyText />,
      },
      {
        dataIndex: 'applyDepartmentName',
        title: '申请部门',
        render: value => value || <EmptyText />,
      },
      {
        dataIndex: 'billLevelDesc',
        title: '作业证类型',
        render: value => value || <EmptyText />,
      },
      {
        dataIndex: 'billCode',
        title: '作业证编号',
        render: value => value || <EmptyText />,
      },
      {
        dataIndex: 'workingStartDate',
        title: '作业开始时间',
        render: value => (value ? moment(value).format(minuteFormat) : <EmptyText />),
      },
      {
        dataIndex: 'workingEndDate',
        title: '作业结束时间',
        render: value => (value ? moment(value).format(minuteFormat) : <EmptyText />),
      },
      {
        dataIndex: 'approveStatus',
        title: '审批状态',
        render: (value, { approveStatusDesc }) =>
          value ? (
            <Badge status={approveStatusMap[value]} text={approveStatusDesc} />
          ) : (
            <EmptyText />
          ),
      },
      {
        dataIndex: 'approveTime',
        title: '审批时间',
        render: value => (value ? moment(value).format(minuteFormat) : <EmptyText />),
      },
      {
        dataIndex: 'workingStatus',
        title: '作业状态',
        render: (value, { approveStatus, workingStatusDesc }) =>
          `${approveStatus}` === approveStatusList[1].key && value ? (
            <Badge status={workingStatusMap[value]} text={workingStatusDesc} />
          ) : (
            <EmptyText />
          ),
      },
      {
        dataIndex: 'finishDate',
        title: '完工时间',
        render: value => (value ? moment(value).format(minuteFormat) : <EmptyText />),
      },
      {
        dataIndex: 'planType',
        title: '计划性',
        render: value =>
          (planTypeList.find(item => item.key === `${value}`) || {}).label || <EmptyText />,
      },
      {
        dataIndex: '是否已实施',
        title: '是否已实施',
        render: (_, { approveStatus, workingStatus }) =>
          (`${approveStatus}` === approveStatusList[1].key &&
            (
              implementationStatusList.find(
                item => item.key === `${+(`${workingStatus}` === workingStatusList[2].key)}`
              ) || {}
            ).label) || <EmptyText />,
      },
      {
        dataIndex: '操作',
        title: '操作',
        render: (_, { id, approveStatus, overFlag }) => (
          <Fragment>
            {`${approveStatus}` === approveStatusList[0].key && (
              <Fragment>
                <Link
                  to="/"
                  data-id={id}
                  onClick={onApproveButtonClick}
                  disabled={!hasApproveAuthority}
                >
                  审批
                </Link>
                <Divider type="vertical" />
              </Fragment>
            )}
            <Link to={`${detailPath}/${id}${search}`} disabled={!hasDetailAuthority}>
              查看
            </Link>
            {`${approveStatus}` === approveStatusList[2].key ? (
              !+overFlag && (
                <Fragment>
                  <Divider type="vertical" />
                  <Link to={`${reapplyPath}/${id}${search}`} disabled={!hasAddAuthority}>
                    重新申请
                  </Link>
                </Fragment>
              )
            ) : (
              <Fragment>
                <Divider type="vertical" />
                <Link to={`${editPath}/${id}${search}`} disabled={!hasEditAuthority}>
                  编辑
                </Link>
              </Fragment>
            )}
            {`${approveStatus}` !== approveStatusList[1].key && (
              <Fragment>
                <Divider type="vertical" />
                <Popconfirm
                  title="您确定要删除这条数据吗？"
                  onConfirm={() => {
                    deleteList(
                      {
                        id,
                      },
                      success => {
                        if (success) {
                          setPayload(payload => ({ ...payload }));
                        }
                      }
                    );
                  }}
                  disabled={!hasDeleteAuthority}
                >
                  <Link to="/" disabled={!hasDeleteAuthority}>
                    删除
                  </Link>
                </Popconfirm>
              </Fragment>
            )}
          </Fragment>
        ),
      },
    ];
  },
  [typeList[1].key]: ({
    isUnit,
    search,
    hasDetailAuthority,
    hasAddAuthority,
    hasEditAuthority,
    hasDeleteAuthority,
    hasApproveAuthority,
    deleteList,
    setPayload,
    onApproveButtonClick,
  }) => {
    return [
      ...(!isUnit
        ? [
            {
              dataIndex: 'companyName',
              title: '单位名称',
              render: value => value || <EmptyText />,
            },
          ]
        : []),
      {
        dataIndex: 'applyDate',
        title: '申请日期',
        render: value => (value ? moment(value).format(dateFormat) : <EmptyText />),
      },
      {
        dataIndex: 'applyUserName',
        title: '申请人',
        render: value => value || <EmptyText />,
      },
      {
        dataIndex: 'applyDepartmentName',
        title: '申请部门',
        render: value => value || <EmptyText />,
      },
      {
        dataIndex: 'billCode',
        title: '作业证编号',
        render: value => value || <EmptyText />,
      },
      {
        dataIndex: 'workingProject',
        title: '受限空间（设备）名称',
        render: value => value || <EmptyText />,
      },
      {
        dataIndex: 'workingStartDate',
        title: '作业开始时间',
        render: value => (value ? moment(value).format(minuteFormat) : <EmptyText />),
      },
      {
        dataIndex: 'workingEndDate',
        title: '作业结束时间',
        render: value => (value ? moment(value).format(minuteFormat) : <EmptyText />),
      },
      {
        dataIndex: 'approveStatus',
        title: '审批状态',
        render: (value, { approveStatusDesc }) =>
          value ? (
            <Badge status={approveStatusMap[value]} text={approveStatusDesc} />
          ) : (
            <EmptyText />
          ),
      },
      {
        dataIndex: 'approveTime',
        title: '审批时间',
        render: value => (value ? moment(value).format(minuteFormat) : <EmptyText />),
      },
      {
        dataIndex: 'workingStatus',
        title: '作业状态',
        render: (value, { approveStatus, workingStatusDesc }) =>
          `${approveStatus}` === approveStatusList[1].key && value ? (
            <Badge status={workingStatusMap[value]} text={workingStatusDesc} />
          ) : (
            <EmptyText />
          ),
      },
      {
        dataIndex: 'finishDate',
        title: '完工时间',
        render: value => (value ? moment(value).format(minuteFormat) : <EmptyText />),
      },
      {
        dataIndex: 'planType',
        title: '计划性',
        render: value =>
          (planTypeList.find(item => item.key === `${value}`) || {}).label || <EmptyText />,
      },
      {
        dataIndex: '是否已实施',
        title: '是否已实施',
        render: (_, { approveStatus, workingStatus }) =>
          (`${approveStatus}` === approveStatusList[1].key &&
            (
              implementationStatusList.find(
                item => item.key === `${+(`${workingStatus}` === workingStatusList[2].key)}`
              ) || {}
            ).label) || <EmptyText />,
      },
      {
        dataIndex: '操作',
        title: '操作',
        render: (_, { id, approveStatus, overFlag }) => (
          <Fragment>
            {`${approveStatus}` === approveStatusList[0].key && (
              <Fragment>
                <Link
                  to="/"
                  data-id={id}
                  onClick={onApproveButtonClick}
                  disabled={!hasApproveAuthority}
                >
                  审批
                </Link>
                <Divider type="vertical" />
              </Fragment>
            )}
            <Link to={`${detailPath}/${id}${search}`} disabled={!hasDetailAuthority}>
              查看
            </Link>
            {`${approveStatus}` === approveStatusList[2].key ? (
              !+overFlag && (
                <Fragment>
                  <Divider type="vertical" />
                  <Link to={`${reapplyPath}/${id}${search}`} disabled={!hasAddAuthority}>
                    重新申请
                  </Link>
                </Fragment>
              )
            ) : (
              <Fragment>
                <Divider type="vertical" />
                <Link to={`${editPath}/${id}${search}`} disabled={!hasEditAuthority}>
                  编辑
                </Link>
              </Fragment>
            )}
            {`${approveStatus}` !== approveStatusList[1].key && (
              <Fragment>
                <Divider type="vertical" />
                <Popconfirm
                  title="您确定要删除这条数据吗？"
                  onConfirm={() => {
                    deleteList(
                      {
                        id,
                      },
                      success => {
                        if (success) {
                          setPayload(payload => ({ ...payload }));
                        }
                      }
                    );
                  }}
                  disabled={!hasDeleteAuthority}
                >
                  <Link to="/" disabled={!hasDeleteAuthority}>
                    删除
                  </Link>
                </Popconfirm>
              </Fragment>
            )}
          </Fragment>
        ),
      },
    ];
  },
  [typeList[2].key]: ({
    isUnit,
    search,
    hasDetailAuthority,
    hasAddAuthority,
    hasEditAuthority,
    hasDeleteAuthority,
    hasApproveAuthority,
    deleteList,
    setPayload,
    onApproveButtonClick,
  }) => {
    return [
      ...(!isUnit
        ? [
            {
              dataIndex: 'companyName',
              title: '单位名称',
              render: value => value || <EmptyText />,
            },
          ]
        : []),
      {
        dataIndex: 'applyDate',
        title: '申请日期',
        render: value => (value ? moment(value).format(dateFormat) : <EmptyText />),
      },
      {
        dataIndex: 'applyUserName',
        title: '申请人',
        render: value => value || <EmptyText />,
      },
      {
        dataIndex: 'applyDepartmentName',
        title: '申请部门',
        render: value => value || <EmptyText />,
      },
      {
        dataIndex: 'billCode',
        title: '作业证编号',
        render: value => value || <EmptyText />,
      },
      {
        dataIndex: 'billLevelDesc',
        title: '作业证类型',
        render: value => value || <EmptyText />,
      },
      {
        dataIndex: 'workingStartDate',
        title: '作业开始时间',
        render: value => (value ? moment(value).format(minuteFormat) : <EmptyText />),
      },
      {
        dataIndex: 'workingEndDate',
        title: '作业结束时间',
        render: value => (value ? moment(value).format(minuteFormat) : <EmptyText />),
      },
      {
        dataIndex: 'approveStatus',
        title: '审批状态',
        render: (value, { approveStatusDesc }) =>
          value ? (
            <Badge status={approveStatusMap[value]} text={approveStatusDesc} />
          ) : (
            <EmptyText />
          ),
      },
      {
        dataIndex: 'approveTime',
        title: '审批时间',
        render: value => (value ? moment(value).format(minuteFormat) : <EmptyText />),
      },
      {
        dataIndex: 'workingStatus',
        title: '作业状态',
        render: (value, { approveStatus, workingStatusDesc }) =>
          `${approveStatus}` === approveStatusList[1].key && value ? (
            <Badge status={workingStatusMap[value]} text={workingStatusDesc} />
          ) : (
            <EmptyText />
          ),
      },
      {
        dataIndex: 'finishDate',
        title: '完工时间',
        render: value => (value ? moment(value).format(minuteFormat) : <EmptyText />),
      },
      {
        dataIndex: '是否已实施',
        title: '是否已实施',
        render: (_, { approveStatus, workingStatus }) =>
          (`${approveStatus}` === approveStatusList[1].key &&
            (
              implementationStatusList.find(
                item => item.key === `${+(`${workingStatus}` === workingStatusList[2].key)}`
              ) || {}
            ).label) || <EmptyText />,
      },
      {
        dataIndex: '操作',
        title: '操作',
        render: (_, { id, approveStatus, overFlag }) => (
          <Fragment>
            {`${approveStatus}` === approveStatusList[0].key && (
              <Fragment>
                <Link
                  to="/"
                  data-id={id}
                  onClick={onApproveButtonClick}
                  disabled={!hasApproveAuthority}
                >
                  审批
                </Link>
                <Divider type="vertical" />
              </Fragment>
            )}
            <Link to={`${detailPath}/${id}${search}`} disabled={!hasDetailAuthority}>
              查看
            </Link>
            {`${approveStatus}` === approveStatusList[2].key ? (
              !+overFlag && (
                <Fragment>
                  <Divider type="vertical" />
                  <Link to={`${reapplyPath}/${id}${search}`} disabled={!hasAddAuthority}>
                    重新申请
                  </Link>
                </Fragment>
              )
            ) : (
              <Fragment>
                <Divider type="vertical" />
                <Link to={`${editPath}/${id}${search}`} disabled={!hasEditAuthority}>
                  编辑
                </Link>
              </Fragment>
            )}
            {`${approveStatus}` !== approveStatusList[1].key && (
              <Fragment>
                <Divider type="vertical" />
                <Popconfirm
                  title="您确定要删除这条数据吗？"
                  onConfirm={() => {
                    deleteList(
                      {
                        id,
                      },
                      success => {
                        if (success) {
                          setPayload(payload => ({ ...payload }));
                        }
                      }
                    );
                  }}
                  disabled={!hasDeleteAuthority}
                >
                  <Link to="/" disabled={!hasDeleteAuthority}>
                    删除
                  </Link>
                </Popconfirm>
              </Fragment>
            )}
          </Fragment>
        ),
      },
    ];
  },
  [typeList[3].key]: ({
    isUnit,
    search,
    hasDetailAuthority,
    hasAddAuthority,
    hasEditAuthority,
    hasDeleteAuthority,
    hasApproveAuthority,
    deleteList,
    setPayload,
    onApproveButtonClick,
  }) => {
    return [
      ...(!isUnit
        ? [
            {
              dataIndex: 'companyName',
              title: '单位名称',
              render: value => value || <EmptyText />,
            },
          ]
        : []),
      {
        dataIndex: 'applyDate',
        title: '申请日期',
        render: value => (value ? moment(value).format(dateFormat) : <EmptyText />),
      },
      {
        dataIndex: 'applyUserName',
        title: '申请人',
        render: value => value || <EmptyText />,
      },
      {
        dataIndex: 'applyDepartmentName',
        title: '申请部门',
        render: value => value || <EmptyText />,
      },
      {
        dataIndex: 'billCode',
        title: '作业证编号',
        render: value => value || <EmptyText />,
      },
      {
        dataIndex: 'billLevelDesc',
        title: '作业证类型',
        render: value => value || <EmptyText />,
      },
      {
        dataIndex: 'workingStartDate',
        title: '作业开始时间',
        render: value => (value ? moment(value).format(minuteFormat) : <EmptyText />),
      },
      {
        dataIndex: 'workingEndDate',
        title: '作业结束时间',
        render: value => (value ? moment(value).format(minuteFormat) : <EmptyText />),
      },
      {
        dataIndex: 'approveStatus',
        title: '审批状态',
        render: (value, { approveStatusDesc }) =>
          value ? (
            <Badge status={approveStatusMap[value]} text={approveStatusDesc} />
          ) : (
            <EmptyText />
          ),
      },
      {
        dataIndex: 'approveTime',
        title: '审批时间',
        render: value => (value ? moment(value).format(minuteFormat) : <EmptyText />),
      },
      {
        dataIndex: 'workingStatus',
        title: '作业状态',
        render: (value, { approveStatus, workingStatusDesc }) =>
          `${approveStatus}` === approveStatusList[1].key && value ? (
            <Badge status={workingStatusMap[value]} text={workingStatusDesc} />
          ) : (
            <EmptyText />
          ),
      },
      {
        dataIndex: 'finishDate',
        title: '完工时间',
        render: value => (value ? moment(value).format(minuteFormat) : <EmptyText />),
      },
      {
        dataIndex: '是否已实施',
        title: '是否已实施',
        render: (_, { approveStatus, workingStatus }) =>
          (`${approveStatus}` === approveStatusList[1].key &&
            (
              implementationStatusList.find(
                item => item.key === `${+(`${workingStatus}` === workingStatusList[2].key)}`
              ) || {}
            ).label) || <EmptyText />,
      },
      {
        dataIndex: '操作',
        title: '操作',
        render: (_, { id, approveStatus, overFlag }) => (
          <Fragment>
            {`${approveStatus}` === approveStatusList[0].key && (
              <Fragment>
                <Link
                  to="/"
                  data-id={id}
                  onClick={onApproveButtonClick}
                  disabled={!hasApproveAuthority}
                >
                  审批
                </Link>
                <Divider type="vertical" />
              </Fragment>
            )}
            <Link to={`${detailPath}/${id}${search}`} disabled={!hasDetailAuthority}>
              查看
            </Link>
            {`${approveStatus}` === approveStatusList[2].key ? (
              !+overFlag && (
                <Fragment>
                  <Divider type="vertical" />
                  <Link to={`${reapplyPath}/${id}${search}`} disabled={!hasAddAuthority}>
                    重新申请
                  </Link>
                </Fragment>
              )
            ) : (
              <Fragment>
                <Divider type="vertical" />
                <Link to={`${editPath}/${id}${search}`} disabled={!hasEditAuthority}>
                  编辑
                </Link>
              </Fragment>
            )}
            {`${approveStatus}` !== approveStatusList[1].key && (
              <Fragment>
                <Divider type="vertical" />
                <Popconfirm
                  title="您确定要删除这条数据吗？"
                  onConfirm={() => {
                    deleteList(
                      {
                        id,
                      },
                      success => {
                        if (success) {
                          setPayload(payload => ({ ...payload }));
                        }
                      }
                    );
                  }}
                  disabled={!hasDeleteAuthority}
                >
                  <Link to="/" disabled={!hasDeleteAuthority}>
                    删除
                  </Link>
                </Popconfirm>
              </Fragment>
            )}
          </Fragment>
        ),
      },
    ];
  },
  [typeList[4].key]: ({
    isUnit,
    search,
    hasDetailAuthority,
    hasAddAuthority,
    hasEditAuthority,
    hasDeleteAuthority,
    hasApproveAuthority,
    deleteList,
    setPayload,
    onApproveButtonClick,
  }) => {
    return [
      ...(!isUnit
        ? [
            {
              dataIndex: 'companyName',
              title: '单位名称',
              render: value => value || <EmptyText />,
            },
          ]
        : []),
      {
        dataIndex: 'applyDate',
        title: '申请日期',
        render: value => (value ? moment(value).format(dateFormat) : <EmptyText />),
      },
      {
        dataIndex: 'applyUserName',
        title: '申请人',
        render: value => value || <EmptyText />,
      },
      {
        dataIndex: 'applyDepartmentName',
        title: '申请部门',
        render: value => value || <EmptyText />,
      },
      {
        dataIndex: 'billCode',
        title: '作业证编号',
        render: value => value || <EmptyText />,
      },
      {
        dataIndex: 'workingStartDate',
        title: '作业开始时间',
        render: value => (value ? moment(value).format(minuteFormat) : <EmptyText />),
      },
      {
        dataIndex: 'workingEndDate',
        title: '作业结束时间',
        render: value => (value ? moment(value).format(minuteFormat) : <EmptyText />),
      },
      {
        dataIndex: 'approveStatus',
        title: '审批状态',
        render: (value, { approveStatusDesc }) =>
          value ? (
            <Badge status={approveStatusMap[value]} text={approveStatusDesc} />
          ) : (
            <EmptyText />
          ),
      },
      {
        dataIndex: 'approveTime',
        title: '审批时间',
        render: value => (value ? moment(value).format(minuteFormat) : <EmptyText />),
      },
      {
        dataIndex: 'workingStatus',
        title: '作业状态',
        render: (value, { approveStatus, workingStatusDesc }) =>
          `${approveStatus}` === approveStatusList[1].key && value ? (
            <Badge status={workingStatusMap[value]} text={workingStatusDesc} />
          ) : (
            <EmptyText />
          ),
      },
      {
        dataIndex: 'finishDate',
        title: '完工时间',
        render: value => (value ? moment(value).format(minuteFormat) : <EmptyText />),
      },
      {
        dataIndex: 'planType',
        title: '计划性',
        render: value =>
          (planTypeList.find(item => item.key === `${value}`) || {}).label || <EmptyText />,
      },
      {
        dataIndex: '是否已实施',
        title: '是否已实施',
        render: (_, { approveStatus, workingStatus }) =>
          (`${approveStatus}` === approveStatusList[1].key &&
            (
              implementationStatusList.find(
                item => item.key === `${+(`${workingStatus}` === workingStatusList[2].key)}`
              ) || {}
            ).label) || <EmptyText />,
      },
      {
        dataIndex: '操作',
        title: '操作',
        render: (_, { id, approveStatus, overFlag }) => (
          <Fragment>
            {`${approveStatus}` === approveStatusList[0].key && (
              <Fragment>
                <Link
                  to="/"
                  data-id={id}
                  onClick={onApproveButtonClick}
                  disabled={!hasApproveAuthority}
                >
                  审批
                </Link>
                <Divider type="vertical" />
              </Fragment>
            )}
            <Link to={`${detailPath}/${id}${search}`} disabled={!hasDetailAuthority}>
              查看
            </Link>
            {`${approveStatus}` === approveStatusList[2].key ? (
              !+overFlag && (
                <Fragment>
                  <Divider type="vertical" />
                  <Link to={`${reapplyPath}/${id}${search}`} disabled={!hasAddAuthority}>
                    重新申请
                  </Link>
                </Fragment>
              )
            ) : (
              <Fragment>
                <Divider type="vertical" />
                <Link to={`${editPath}/${id}${search}`} disabled={!hasEditAuthority}>
                  编辑
                </Link>
              </Fragment>
            )}
            {`${approveStatus}` !== approveStatusList[1].key && (
              <Fragment>
                <Divider type="vertical" />
                <Popconfirm
                  title="您确定要删除这条数据吗？"
                  onConfirm={() => {
                    deleteList(
                      {
                        id,
                      },
                      success => {
                        if (success) {
                          setPayload(payload => ({ ...payload }));
                        }
                      }
                    );
                  }}
                  disabled={!hasDeleteAuthority}
                >
                  <Link to="/" disabled={!hasDeleteAuthority}>
                    删除
                  </Link>
                </Popconfirm>
              </Fragment>
            )}
          </Fragment>
        ),
      },
    ];
  },
  [typeList[5].key]: ({
    isUnit,
    search,
    hasDetailAuthority,
    hasAddAuthority,
    hasEditAuthority,
    hasDeleteAuthority,
    hasApproveAuthority,
    deleteList,
    setPayload,
    onApproveButtonClick,
  }) => {
    return [
      ...(!isUnit
        ? [
            {
              dataIndex: 'companyName',
              title: '单位名称',
              render: value => value || <EmptyText />,
            },
          ]
        : []),
      {
        dataIndex: 'applyDate',
        title: '申请日期',
        render: value => (value ? moment(value).format(dateFormat) : <EmptyText />),
      },
      {
        dataIndex: 'applyUserName',
        title: '申请人',
        render: value => value || <EmptyText />,
      },
      {
        dataIndex: 'applyDepartmentName',
        title: '申请部门',
        render: value => value || <EmptyText />,
      },
      {
        dataIndex: 'billCode',
        title: '作业证编号',
        render: value => value || <EmptyText />,
      },
      {
        dataIndex: 'workingProject',
        title: '维修项目名称',
        render: value => value || <EmptyText />,
      },
      {
        dataIndex: 'workingStartDate',
        title: '作业开始时间',
        render: value => (value ? moment(value).format(minuteFormat) : <EmptyText />),
      },
      {
        dataIndex: 'workingEndDate',
        title: '作业结束时间',
        render: value => (value ? moment(value).format(minuteFormat) : <EmptyText />),
      },
      {
        dataIndex: 'approveStatus',
        title: '审批状态',
        render: (value, { approveStatusDesc }) =>
          value ? (
            <Badge status={approveStatusMap[value]} text={approveStatusDesc} />
          ) : (
            <EmptyText />
          ),
      },
      {
        dataIndex: 'approveTime',
        title: '审批时间',
        render: value => (value ? moment(value).format(minuteFormat) : <EmptyText />),
      },
      {
        dataIndex: 'workingStatus',
        title: '作业状态',
        render: (value, { approveStatus, workingStatusDesc }) =>
          `${approveStatus}` === approveStatusList[1].key && value ? (
            <Badge status={workingStatusMap[value]} text={workingStatusDesc} />
          ) : (
            <EmptyText />
          ),
      },
      {
        dataIndex: 'finishDate',
        title: '完工时间',
        render: value => (value ? moment(value).format(minuteFormat) : <EmptyText />),
      },
      {
        dataIndex: 'planType',
        title: '计划性',
        render: value =>
          (planTypeList.find(item => item.key === `${value}`) || {}).label || <EmptyText />,
      },
      {
        dataIndex: '是否已实施',
        title: '是否已实施',
        render: (_, { approveStatus, workingStatus }) =>
          (`${approveStatus}` === approveStatusList[1].key &&
            (
              implementationStatusList.find(
                item => item.key === `${+(`${workingStatus}` === workingStatusList[2].key)}`
              ) || {}
            ).label) || <EmptyText />,
      },
      {
        dataIndex: '操作',
        title: '操作',
        render: (_, { id, approveStatus, overFlag }) => (
          <Fragment>
            {`${approveStatus}` === approveStatusList[0].key && (
              <Fragment>
                <Link
                  to="/"
                  data-id={id}
                  onClick={onApproveButtonClick}
                  disabled={!hasApproveAuthority}
                >
                  审批
                </Link>
                <Divider type="vertical" />
              </Fragment>
            )}
            <Link to={`${detailPath}/${id}${search}`} disabled={!hasDetailAuthority}>
              查看
            </Link>
            {`${approveStatus}` === approveStatusList[2].key ? (
              !+overFlag && (
                <Fragment>
                  <Divider type="vertical" />
                  <Link to={`${reapplyPath}/${id}${search}`} disabled={!hasAddAuthority}>
                    重新申请
                  </Link>
                </Fragment>
              )
            ) : (
              <Fragment>
                <Divider type="vertical" />
                <Link to={`${editPath}/${id}${search}`} disabled={!hasEditAuthority}>
                  编辑
                </Link>
              </Fragment>
            )}
            {`${approveStatus}` !== approveStatusList[1].key && (
              <Fragment>
                <Divider type="vertical" />
                <Popconfirm
                  title="您确定要删除这条数据吗？"
                  onConfirm={() => {
                    deleteList(
                      {
                        id,
                      },
                      success => {
                        if (success) {
                          setPayload(payload => ({ ...payload }));
                        }
                      }
                    );
                  }}
                  disabled={!hasDeleteAuthority}
                >
                  <Link to="/" disabled={!hasDeleteAuthority}>
                    删除
                  </Link>
                </Popconfirm>
              </Fragment>
            )}
          </Fragment>
        ),
      },
    ];
  },
  [typeList[6].key]: ({
    isUnit,
    search,
    hasDetailAuthority,
    hasAddAuthority,
    hasEditAuthority,
    hasDeleteAuthority,
    hasApproveAuthority,
    deleteList,
    setPayload,
    onApproveButtonClick,
  }) => {
    return [
      ...(!isUnit
        ? [
            {
              dataIndex: 'companyName',
              title: '单位名称',
              render: value => value || <EmptyText />,
            },
          ]
        : []),
      {
        dataIndex: 'applyDate',
        title: '申请日期',
        render: value => (value ? moment(value).format(dateFormat) : <EmptyText />),
      },
      {
        dataIndex: 'applyUserName',
        title: '申请人',
        render: value => value || <EmptyText />,
      },
      {
        dataIndex: 'applyDepartmentName',
        title: '申请部门',
        render: value => value || <EmptyText />,
      },
      {
        dataIndex: 'billCode',
        title: '作业证编号',
        render: value => value || <EmptyText />,
      },
      {
        dataIndex: 'billLevelDesc',
        title: '盲板作业类型',
        render: value => value || <EmptyText />,
      },
      {
        dataIndex: 'workingStartDate',
        title: '作业开始时间',
        render: value => (value ? moment(value).format(minuteFormat) : <EmptyText />),
      },
      {
        dataIndex: 'workingEndDate',
        title: '作业结束时间',
        render: value => (value ? moment(value).format(minuteFormat) : <EmptyText />),
      },
      {
        dataIndex: 'approveStatus',
        title: '审批状态',
        render: (value, { approveStatusDesc }) =>
          value ? (
            <Badge status={approveStatusMap[value]} text={approveStatusDesc} />
          ) : (
            <EmptyText />
          ),
      },
      {
        dataIndex: 'approveTime',
        title: '审批时间',
        render: value => (value ? moment(value).format(minuteFormat) : <EmptyText />),
      },
      {
        dataIndex: 'workingStatus',
        title: '作业状态',
        render: (value, { approveStatus, workingStatusDesc }) =>
          `${approveStatus}` === approveStatusList[1].key && value ? (
            <Badge status={workingStatusMap[value]} text={workingStatusDesc} />
          ) : (
            <EmptyText />
          ),
      },
      {
        dataIndex: 'finishDate',
        title: '完工时间',
        render: value => (value ? moment(value).format(minuteFormat) : <EmptyText />),
      },
      {
        dataIndex: 'planType',
        title: '计划性',
        render: value =>
          (planTypeList.find(item => item.key === `${value}`) || {}).label || <EmptyText />,
      },
      {
        dataIndex: '是否已实施',
        title: '是否已实施',
        render: (_, { approveStatus, workingStatus }) =>
          (`${approveStatus}` === approveStatusList[1].key &&
            (
              implementationStatusList.find(
                item => item.key === `${+(`${workingStatus}` === workingStatusList[2].key)}`
              ) || {}
            ).label) || <EmptyText />,
      },
      {
        dataIndex: '操作',
        title: '操作',
        render: (_, { id, approveStatus, overFlag }) => (
          <Fragment>
            {`${approveStatus}` === approveStatusList[0].key && (
              <Fragment>
                <Link
                  to="/"
                  data-id={id}
                  onClick={onApproveButtonClick}
                  disabled={!hasApproveAuthority}
                >
                  审批
                </Link>
                <Divider type="vertical" />
              </Fragment>
            )}
            <Link to={`${detailPath}/${id}${search}`} disabled={!hasDetailAuthority}>
              查看
            </Link>
            {`${approveStatus}` === approveStatusList[2].key ? (
              !+overFlag && (
                <Fragment>
                  <Divider type="vertical" />
                  <Link to={`${reapplyPath}/${id}${search}`} disabled={!hasAddAuthority}>
                    重新申请
                  </Link>
                </Fragment>
              )
            ) : (
              <Fragment>
                <Divider type="vertical" />
                <Link to={`${editPath}/${id}${search}`} disabled={!hasEditAuthority}>
                  编辑
                </Link>
              </Fragment>
            )}
            {`${approveStatus}` !== approveStatusList[1].key && (
              <Fragment>
                <Divider type="vertical" />
                <Popconfirm
                  title="您确定要删除这条数据吗？"
                  onConfirm={() => {
                    deleteList(
                      {
                        id,
                      },
                      success => {
                        if (success) {
                          setPayload(payload => ({ ...payload }));
                        }
                      }
                    );
                  }}
                  disabled={!hasDeleteAuthority}
                >
                  <Link to="/" disabled={!hasDeleteAuthority}>
                    删除
                  </Link>
                </Popconfirm>
              </Fragment>
            )}
          </Fragment>
        ),
      },
    ];
  },
  [typeList[7].key]: ({
    isUnit,
    search,
    hasDetailAuthority,
    hasAddAuthority,
    hasEditAuthority,
    hasDeleteAuthority,
    hasApproveAuthority,
    deleteList,
    setPayload,
    onApproveButtonClick,
  }) => {
    return [
      ...(!isUnit
        ? [
            {
              dataIndex: 'companyName',
              title: '单位名称',
              render: value => value || <EmptyText />,
            },
          ]
        : []),
      {
        dataIndex: 'applyDate',
        title: '申请日期',
        render: value => (value ? moment(value).format(dateFormat) : <EmptyText />),
      },
      {
        dataIndex: 'applyUserName',
        title: '申请人',
        render: value => value || <EmptyText />,
      },
      {
        dataIndex: 'applyDepartmentName',
        title: '申请部门',
        render: value => value || <EmptyText />,
      },
      {
        dataIndex: 'billCode',
        title: '作业证编号',
        render: value => value || <EmptyText />,
      },
      {
        dataIndex: 'workingStartDate',
        title: '作业开始时间',
        render: value => (value ? moment(value).format(minuteFormat) : <EmptyText />),
      },
      {
        dataIndex: 'workingEndDate',
        title: '作业结束时间',
        render: value => (value ? moment(value).format(minuteFormat) : <EmptyText />),
      },
      {
        dataIndex: 'approveStatus',
        title: '审批状态',
        render: (value, { approveStatusDesc }) =>
          value ? (
            <Badge status={approveStatusMap[value]} text={approveStatusDesc} />
          ) : (
            <EmptyText />
          ),
      },
      {
        dataIndex: 'approveTime',
        title: '审批时间',
        render: value => (value ? moment(value).format(minuteFormat) : <EmptyText />),
      },
      {
        dataIndex: 'workingStatus',
        title: '作业状态',
        render: (value, { approveStatus, workingStatusDesc }) =>
          `${approveStatus}` === approveStatusList[1].key && value ? (
            <Badge status={workingStatusMap[value]} text={workingStatusDesc} />
          ) : (
            <EmptyText />
          ),
      },
      {
        dataIndex: 'finishDate',
        title: '完工时间',
        render: value => (value ? moment(value).format(minuteFormat) : <EmptyText />),
      },
      {
        dataIndex: 'planType',
        title: '计划性',
        render: value =>
          (planTypeList.find(item => item.key === `${value}`) || {}).label || <EmptyText />,
      },
      {
        dataIndex: '是否已实施',
        title: '是否已实施',
        render: (_, { approveStatus, workingStatus }) =>
          (`${approveStatus}` === approveStatusList[1].key &&
            (
              implementationStatusList.find(
                item => item.key === `${+(`${workingStatus}` === workingStatusList[2].key)}`
              ) || {}
            ).label) || <EmptyText />,
      },
      {
        dataIndex: '操作',
        title: '操作',
        render: (_, { id, approveStatus, overFlag }) => (
          <Fragment>
            {`${approveStatus}` === approveStatusList[0].key && (
              <Fragment>
                <Link
                  to="/"
                  data-id={id}
                  onClick={onApproveButtonClick}
                  disabled={!hasApproveAuthority}
                >
                  审批
                </Link>
                <Divider type="vertical" />
              </Fragment>
            )}
            <Link to={`${detailPath}/${id}${search}`} disabled={!hasDetailAuthority}>
              查看
            </Link>
            {`${approveStatus}` === approveStatusList[2].key ? (
              !+overFlag && (
                <Fragment>
                  <Divider type="vertical" />
                  <Link to={`${reapplyPath}/${id}${search}`} disabled={!hasAddAuthority}>
                    重新申请
                  </Link>
                </Fragment>
              )
            ) : (
              <Fragment>
                <Divider type="vertical" />
                <Link to={`${editPath}/${id}${search}`} disabled={!hasEditAuthority}>
                  编辑
                </Link>
              </Fragment>
            )}
            {`${approveStatus}` !== approveStatusList[1].key && (
              <Fragment>
                <Divider type="vertical" />
                <Popconfirm
                  title="您确定要删除这条数据吗？"
                  onConfirm={() => {
                    deleteList(
                      {
                        id,
                      },
                      success => {
                        if (success) {
                          setPayload(payload => ({ ...payload }));
                        }
                      }
                    );
                  }}
                  disabled={!hasDeleteAuthority}
                >
                  <Link to="/" disabled={!hasDeleteAuthority}>
                    删除
                  </Link>
                </Popconfirm>
              </Fragment>
            )}
          </Fragment>
        ),
      },
    ];
  },
  [typeList[8].key]: ({
    isUnit,
    search,
    hasDetailAuthority,
    hasAddAuthority,
    hasEditAuthority,
    hasDeleteAuthority,
    hasApproveAuthority,
    deleteList,
    setPayload,
    onApproveButtonClick,
  }) => {
    return [
      ...(!isUnit
        ? [
            {
              dataIndex: 'companyName',
              title: '单位名称',
              render: value => value || <EmptyText />,
            },
          ]
        : []),
      {
        dataIndex: 'applyDate',
        title: '申请日期',
        render: value => (value ? moment(value).format(dateFormat) : <EmptyText />),
      },
      {
        dataIndex: 'applyUserName',
        title: '申请人',
        render: value => value || <EmptyText />,
      },
      {
        dataIndex: 'applyDepartmentName',
        title: '申请部门',
        render: value => value || <EmptyText />,
      },
      {
        dataIndex: 'billCode',
        title: '作业证编号',
        render: value => value || <EmptyText />,
      },
      {
        dataIndex: 'workingStartDate',
        title: '作业开始时间',
        render: value => (value ? moment(value).format(minuteFormat) : <EmptyText />),
      },
      {
        dataIndex: 'workingEndDate',
        title: '作业结束时间',
        render: value => (value ? moment(value).format(minuteFormat) : <EmptyText />),
      },
      {
        dataIndex: 'approveStatus',
        title: '审批状态',
        render: (value, { approveStatusDesc }) =>
          value ? (
            <Badge status={approveStatusMap[value]} text={approveStatusDesc} />
          ) : (
            <EmptyText />
          ),
      },
      {
        dataIndex: 'approveTime',
        title: '审批时间',
        render: value => (value ? moment(value).format(minuteFormat) : <EmptyText />),
      },
      {
        dataIndex: 'workingStatus',
        title: '作业状态',
        render: (value, { approveStatus, workingStatusDesc }) =>
          `${approveStatus}` === approveStatusList[1].key && value ? (
            <Badge status={workingStatusMap[value]} text={workingStatusDesc} />
          ) : (
            <EmptyText />
          ),
      },
      {
        dataIndex: 'finishDate',
        title: '完工时间',
        render: value => (value ? moment(value).format(minuteFormat) : <EmptyText />),
      },
      {
        dataIndex: 'planType',
        title: '计划性',
        render: value =>
          (planTypeList.find(item => item.key === `${value}`) || {}).label || <EmptyText />,
      },
      {
        dataIndex: '是否已实施',
        title: '是否已实施',
        render: (_, { approveStatus, workingStatus }) =>
          (`${approveStatus}` === approveStatusList[1].key &&
            (
              implementationStatusList.find(
                item => item.key === `${+(`${workingStatus}` === workingStatusList[2].key)}`
              ) || {}
            ).label) || <EmptyText />,
      },
      {
        dataIndex: '操作',
        title: '操作',
        render: (_, { id, approveStatus, overFlag }) => (
          <Fragment>
            {`${approveStatus}` === approveStatusList[0].key && (
              <Fragment>
                <Link
                  to="/"
                  data-id={id}
                  onClick={onApproveButtonClick}
                  disabled={!hasApproveAuthority}
                >
                  审批
                </Link>
                <Divider type="vertical" />
              </Fragment>
            )}
            <Link to={`${detailPath}/${id}${search}`} disabled={!hasDetailAuthority}>
              查看
            </Link>
            {`${approveStatus}` === approveStatusList[2].key ? (
              !+overFlag && (
                <Fragment>
                  <Divider type="vertical" />
                  <Link to={`${reapplyPath}/${id}${search}`} disabled={!hasAddAuthority}>
                    重新申请
                  </Link>
                </Fragment>
              )
            ) : (
              <Fragment>
                <Divider type="vertical" />
                <Link to={`${editPath}/${id}${search}`} disabled={!hasEditAuthority}>
                  编辑
                </Link>
              </Fragment>
            )}
            {`${approveStatus}` !== approveStatusList[1].key && (
              <Fragment>
                <Divider type="vertical" />
                <Popconfirm
                  title="您确定要删除这条数据吗？"
                  onConfirm={() => {
                    deleteList(
                      {
                        id,
                      },
                      success => {
                        if (success) {
                          setPayload(payload => ({ ...payload }));
                        }
                      }
                    );
                  }}
                  disabled={!hasDeleteAuthority}
                >
                  <Link to="/" disabled={!hasDeleteAuthority}>
                    删除
                  </Link>
                </Popconfirm>
              </Fragment>
            )}
          </Fragment>
        ),
      },
    ];
  },
};
export const getValuesByDetailMap = {
  [typeList[0].key]: ({
    companyId,
    companyName,
    billType,
    applyUserId,
    applyUserName,
    applyDepartmentId,
    applyDepartmentName,
    applyDate,
    billCode,
    billLevel,
    supervisor,
    supervisorPosition,
    manager,
    workingStartDate,
    workingEndDate,
    workingContent,
    workingWay,
    workingProject,
    workingCompanyType,
    workingCompanyId,
    workingCompanyLabel,
    workingManager,
    workingPersonnelId,
    workingPersonnelName,
    safetyEducator,
    constructionManager,
    planType,
    approveStatus,
    signature,
    workingStatus,
    finishDate,
    riskFactors,
    safetyMeasures,
    certificatesFileList,
    applyFileList,
    isSetWarn,
    mapAddress,
  }) => ({
    company: companyId ? { key: companyId, value: companyId, label: companyName } : undefined,
    billType: billType ? `${billType}` : undefined,
    applyUser: applyUserId
      ? { key: applyUserId, value: applyUserId, label: applyUserName }
      : undefined,
    applyDepartment: applyDepartmentId
      ? { key: applyDepartmentId, value: applyDepartmentId, label: applyDepartmentName }
      : undefined,
    applyDate: applyDate ? moment(applyDate) : undefined,
    billCode: billCode || undefined,
    billLevel: billLevel ? `${billLevel}` : undefined,
    supervisor: supervisor || undefined,
    supervisorPosition: supervisorPosition || undefined,
    manager: manager || undefined,
    range:
      workingStartDate && workingEndDate
        ? [moment(workingStartDate), moment(workingEndDate)]
        : undefined,
    workingContent: workingContent || undefined,
    workingWay: workingWay || undefined,
    workingProject: workingProject || undefined,
    workingCompanyType: workingCompanyType ? `${workingCompanyType}` : undefined,
    workingCompany: workingCompanyId
      ? { key: workingCompanyId, value: workingCompanyId, label: workingCompanyLabel }
      : undefined,
    workingManager: workingManager || undefined,
    workingPersonnel: workingPersonnelId
      ? workingPersonnelId.split(',').map((item, index) => ({
          key: item,
          value: item,
          label: workingPersonnelName[index],
        }))
      : undefined,
    safetyEducator: safetyEducator || undefined,
    constructionManager: constructionManager || undefined,
    planType: isNumber(planType) ? `${planType}` : undefined,
    approveStatus: approveStatus ? `${approveStatus}` : undefined,
    signature: signature || undefined,
    workingStatus: workingStatus ? `${workingStatus}` : undefined,
    finishDate: finishDate ? moment(finishDate) : undefined,
    riskFactors: riskFactors || undefined,
    safetyMeasures: JSON.parse(safetyMeasures) || undefined,
    certificatesFileList: certificatesFileList
      ? certificatesFileList.map((item, index) => ({
          ...item,
          url: item.webUrl,
          status: 'done',
          uid: -index - 1,
          name: item.fileName,
        }))
      : undefined,
    applyFileList: applyFileList
      ? applyFileList.map((item, index) => ({
          ...item,
          url: item.webUrl,
          status: 'done',
          uid: -index - 1,
          name: item.fileName,
        }))
      : undefined,
    isSetWarn: isNumber(isSetWarn) ? `${isSetWarn}` : undefined,
    mapAddress: mapAddress ? JSON.parse(mapAddress) : undefined,
  }),
  [typeList[1].key]: ({
    companyId,
    companyName,
    billType,
    applyUserId,
    applyUserName,
    applyDepartmentId,
    applyDepartmentName,
    applyDate,
    billCode,
    workingProject,
    workingCompanyType,
    workingCompanyName,
    workingDepartment,
    workingDepartmentName,
    constructionManager,
    agent,
    workingPersonnel,
    workingStartDate,
    workingEndDate,
    planType,
    approveStatus,
    signature,
    workingStatus,
    finishDate,
    riskFactors,
    safetyMeasures,
    certificatesFileList,
    applyFileList,
    isSetWarn,
    mapAddress,
  }) => ({
    company: companyId ? { key: companyId, value: companyId, label: companyName } : undefined,
    billType: billType ? `${billType}` : undefined,
    applyUser: applyUserId
      ? { key: applyUserId, value: applyUserId, label: applyUserName }
      : undefined,
    applyDepartment: applyDepartmentId
      ? { key: applyDepartmentId, value: applyDepartmentId, label: applyDepartmentName }
      : undefined,
    applyDate: applyDate ? moment(applyDate) : undefined,
    billCode: billCode || undefined,
    workingProject: workingProject || undefined,
    workingCompanyType: workingCompanyType ? `${workingCompanyType}` : undefined,
    workingCompanyName: workingCompanyName || undefined,
    workingDepartment: workingDepartment
      ? `${workingCompanyType}` === companyTypeList[0].key
        ? { key: workingDepartment, value: workingDepartment, label: workingDepartmentName }
        : workingDepartment
      : undefined,
    constructionManager: constructionManager || undefined,
    agent: agent || undefined,
    workingPersonnel: workingPersonnel ? workingPersonnel.split(',') : undefined,
    range:
      workingStartDate && workingEndDate
        ? [moment(workingStartDate), moment(workingEndDate)]
        : undefined,
    planType: isNumber(planType) ? `${planType}` : undefined,
    approveStatus: approveStatus ? `${approveStatus}` : undefined,
    signature: signature || undefined,
    workingStatus: workingStatus ? `${workingStatus}` : undefined,
    finishDate: finishDate ? moment(finishDate) : undefined,
    riskFactors: riskFactors || undefined,
    safetyMeasures: JSON.parse(safetyMeasures) || undefined,
    certificatesFileList: certificatesFileList
      ? certificatesFileList.map((item, index) => ({
          ...item,
          url: item.webUrl,
          status: 'done',
          uid: -index - 1,
          name: item.fileName,
        }))
      : undefined,
    applyFileList: applyFileList
      ? applyFileList.map((item, index) => ({
          ...item,
          url: item.webUrl,
          status: 'done',
          uid: -index - 1,
          name: item.fileName,
        }))
      : undefined,
    isSetWarn: isNumber(isSetWarn) ? `${isSetWarn}` : undefined,
    mapAddress: mapAddress ? JSON.parse(mapAddress) : undefined,
  }),
  [typeList[2].key]: ({
    companyId,
    companyName,
    billType,
    applyUserId,
    applyUserName,
    applyCompanyName,
    applyDepartmentId,
    applyDepartmentName,
    applyDate,
    billLevel,
    billCode,
    height,
    address,
    agent,
    workingCompanyType,
    workingCompanyId,
    workingCompanyLabel,
    workingManager,
    workingPersonnelId,
    workingPersonnelName,
    supervisor,
    supervisorPosition,
    workingStartDate,
    workingEndDate,
    compilingPerson,
    workingProject,
    safetyEducator,
    approveStatus,
    signature,
    workingStatus,
    finishDate,
    riskFactors,
    safetyMeasures,
    certificatesFileList,
    applyFileList,
    isSetWarn,
    mapAddress,
  }) => ({
    company: companyId ? { key: companyId, value: companyId, label: companyName } : undefined,
    billType: billType ? `${billType}` : undefined,
    applyUser: applyUserId
      ? { key: applyUserId, value: applyUserId, label: applyUserName }
      : undefined,
    applyCompanyName: applyCompanyName || undefined,
    applyDepartment: applyDepartmentId
      ? { key: applyDepartmentId, value: applyDepartmentId, label: applyDepartmentName }
      : undefined,
    applyDate: applyDate ? moment(applyDate) : undefined,
    billLevel: billLevel ? `${billLevel}` : undefined,
    billCode: billCode || undefined,
    height: height || undefined,
    address: address || undefined,
    agent: agent || undefined,
    workingCompanyType: workingCompanyType ? `${workingCompanyType}` : undefined,
    workingCompany: workingCompanyId
      ? { key: workingCompanyId, value: workingCompanyId, label: workingCompanyLabel }
      : undefined,
    workingManager: workingManager || undefined,
    workingPersonnel: workingPersonnelId
      ? workingPersonnelId.split(',').map((item, index) => ({
          key: item,
          value: item,
          label: workingPersonnelName[index],
        }))
      : undefined,
    supervisor: supervisor || undefined,
    supervisorPosition: supervisorPosition || undefined,
    range:
      workingStartDate && workingEndDate
        ? [moment(workingStartDate), moment(workingEndDate)]
        : undefined,
    compilingPerson: compilingPerson || undefined,
    workingProject: workingProject || undefined,
    safetyEducator: safetyEducator || undefined,
    approveStatus: approveStatus ? `${approveStatus}` : undefined,
    signature: signature || undefined,
    workingStatus: workingStatus ? `${workingStatus}` : undefined,
    finishDate: finishDate ? moment(finishDate) : undefined,
    riskFactors: riskFactors || undefined,
    safetyMeasures: JSON.parse(safetyMeasures) || undefined,
    certificatesFileList: certificatesFileList
      ? certificatesFileList.map((item, index) => ({
          ...item,
          url: item.webUrl,
          status: 'done',
          uid: -index - 1,
          name: item.fileName,
        }))
      : undefined,
    applyFileList: applyFileList
      ? applyFileList.map((item, index) => ({
          ...item,
          url: item.webUrl,
          status: 'done',
          uid: -index - 1,
          name: item.fileName,
        }))
      : undefined,
    isSetWarn: isNumber(isSetWarn) ? `${isSetWarn}` : undefined,
    mapAddress: mapAddress ? JSON.parse(mapAddress) : undefined,
  }),
  [typeList[3].key]: ({
    companyId,
    companyName,
    billType,
    applyUserId,
    applyUserName,
    applyCompanyName,
    applyDepartmentId,
    applyDepartmentName,
    applyDate,
    billLevel,
    billCode,
    workingCompanyType,
    workingCompanyId,
    workingCompanyLabel,
    address,
    tool,
    workingContent,
    workingPersonnelId,
    workingPersonnelName,
    workingProject,
    supervisor,
    supervisorPosition,
    workingStartDate,
    workingEndDate,
    compilingPerson,
    safetyEducator,
    manager,
    agent,
    approveStatus,
    signature,
    workingStatus,
    finishDate,
    riskFactors,
    safetyMeasures,
    certificatesFileList,
    applyFileList,
    isSetWarn,
    mapAddress,
  }) => ({
    company: companyId ? { key: companyId, value: companyId, label: companyName } : undefined,
    billType: billType ? `${billType}` : undefined,
    applyUser: applyUserId
      ? { key: applyUserId, value: applyUserId, label: applyUserName }
      : undefined,
    applyCompanyName: applyCompanyName || undefined,
    applyDepartment: applyDepartmentId
      ? { key: applyDepartmentId, value: applyDepartmentId, label: applyDepartmentName }
      : undefined,
    applyDate: applyDate ? moment(applyDate) : undefined,
    billLevel: billLevel ? `${billLevel}` : undefined,
    billCode: billCode || undefined,
    workingCompanyType: workingCompanyType ? `${workingCompanyType}` : undefined,
    workingCompany: workingCompanyId
      ? { key: workingCompanyId, value: workingCompanyId, label: workingCompanyLabel }
      : undefined,
    address: address || undefined,
    tool: tool || undefined,
    workingContent: workingContent || undefined,
    workingPersonnel: workingPersonnelId
      ? workingPersonnelId.split(',').map((item, index) => ({
          key: item,
          value: item,
          label: workingPersonnelName[index],
        }))
      : undefined,
    workingProject: workingProject || undefined,
    supervisor: supervisor || undefined,
    supervisorPosition: supervisorPosition || undefined,
    range:
      workingStartDate && workingEndDate
        ? [moment(workingStartDate), moment(workingEndDate)]
        : undefined,
    compilingPerson: compilingPerson || undefined,
    safetyEducator: safetyEducator || undefined,
    manager: manager || undefined,
    agent: agent || undefined,
    approveStatus: approveStatus ? `${approveStatus}` : undefined,
    signature: signature || undefined,
    workingStatus: workingStatus ? `${workingStatus}` : undefined,
    finishDate: finishDate ? moment(finishDate) : undefined,
    riskFactors: riskFactors || undefined,
    safetyMeasures: JSON.parse(safetyMeasures) || undefined,
    certificatesFileList: certificatesFileList
      ? certificatesFileList.map((item, index) => ({
          ...item,
          url: item.webUrl,
          status: 'done',
          uid: -index - 1,
          name: item.fileName,
        }))
      : undefined,
    applyFileList: applyFileList
      ? applyFileList.map((item, index) => ({
          ...item,
          url: item.webUrl,
          status: 'done',
          uid: -index - 1,
          name: item.fileName,
        }))
      : undefined,
    isSetWarn: isNumber(isSetWarn) ? `${isSetWarn}` : undefined,
    mapAddress: mapAddress ? JSON.parse(mapAddress) : undefined,
  }),
  [typeList[4].key]: ({
    companyId,
    companyName,
    billType,
    applyUserId,
    applyUserName,
    applyCompanyName,
    applyDepartmentId,
    applyDepartmentName,
    applyDate,
    billCode,
    address,
    workingContent,
    workingProject,
    workingStartDate,
    workingEndDate,
    workingCompanyType,
    workingCompanyId,
    workingCompanyLabel,
    workingManager,
    workingPersonnelId,
    workingPersonnelName,
    compilingPerson,
    agent,
    supervisor,
    supervisorPosition,
    planType,
    safetyEducator,
    approveStatus,
    signature,
    workingStatus,
    finishDate,
    riskFactors,
    safetyMeasures,
    certificatesFileList,
    applyFileList,
    isSetWarn,
    mapAddress,
  }) => ({
    company: companyId ? { key: companyId, value: companyId, label: companyName } : undefined,
    billType: billType ? `${billType}` : undefined,
    applyUser: applyUserId
      ? { key: applyUserId, value: applyUserId, label: applyUserName }
      : undefined,
    applyCompanyName: applyCompanyName || undefined,
    applyDepartment: applyDepartmentId
      ? { key: applyDepartmentId, value: applyDepartmentId, label: applyDepartmentName }
      : undefined,
    applyDate: applyDate ? moment(applyDate) : undefined,
    billCode: billCode || undefined,
    address: address || undefined,
    workingContent: workingContent || undefined,
    workingProject: workingProject || undefined,
    range:
      workingStartDate && workingEndDate
        ? [moment(workingStartDate), moment(workingEndDate)]
        : undefined,
    workingCompanyType: workingCompanyType ? `${workingCompanyType}` : undefined,
    workingCompany: workingCompanyId
      ? { key: workingCompanyId, value: workingCompanyId, label: workingCompanyLabel }
      : undefined,
    workingManager: workingManager || undefined,
    workingPersonnel: workingPersonnelId
      ? workingPersonnelId.split(',').map((item, index) => ({
          key: item,
          value: item,
          label: workingPersonnelName[index],
        }))
      : undefined,
    compilingPerson: compilingPerson || undefined,
    agent: agent || undefined,
    supervisor: supervisor || undefined,
    supervisorPosition: supervisorPosition || undefined,
    planType: isNumber(planType) ? `${planType}` : undefined,
    safetyEducator: safetyEducator || undefined,
    approveStatus: approveStatus ? `${approveStatus}` : undefined,
    signature: signature || undefined,
    workingStatus: workingStatus ? `${workingStatus}` : undefined,
    finishDate: finishDate ? moment(finishDate) : undefined,
    riskFactors: riskFactors || undefined,
    safetyMeasures: JSON.parse(safetyMeasures) || undefined,
    certificatesFileList: certificatesFileList
      ? certificatesFileList.map((item, index) => ({
          ...item,
          url: item.webUrl,
          status: 'done',
          uid: -index - 1,
          name: item.fileName,
        }))
      : undefined,
    applyFileList: applyFileList
      ? applyFileList.map((item, index) => ({
          ...item,
          url: item.webUrl,
          status: 'done',
          uid: -index - 1,
          name: item.fileName,
        }))
      : undefined,
    isSetWarn: isNumber(isSetWarn) ? `${isSetWarn}` : undefined,
    mapAddress: mapAddress ? JSON.parse(mapAddress) : undefined,
  }),
  [typeList[5].key]: ({
    companyId,
    companyName,
    billType,
    applyUserId,
    applyUserName,
    applyCompanyName,
    applyDepartmentId,
    applyDepartmentName,
    applyDate,
    billCode,
    manager,
    workingStartDate,
    workingEndDate,
    agent,
    workingCompanyType,
    workingCompanyName,
    workingProject,
    workingManager,
    address,
    workingContent,
    supervisor,
    planType,
    approveStatus,
    signature,
    workingStatus,
    finishDate,
    hazardIdentification,
    riskFactors,
    safetyMeasures,
    certificatesFileList,
    applyFileList,
    isSetWarn,
    mapAddress,
  }) => ({
    company: companyId ? { key: companyId, value: companyId, label: companyName } : undefined,
    billType: billType ? `${billType}` : undefined,
    applyUser: applyUserId
      ? { key: applyUserId, value: applyUserId, label: applyUserName }
      : undefined,
    applyCompanyName: applyCompanyName || undefined,
    applyDepartment: applyDepartmentId
      ? { key: applyDepartmentId, value: applyDepartmentId, label: applyDepartmentName }
      : undefined,
    applyDate: applyDate ? moment(applyDate) : undefined,
    billCode: billCode || undefined,
    manager: manager || undefined,
    range:
      workingStartDate && workingEndDate
        ? [moment(workingStartDate), moment(workingEndDate)]
        : undefined,
    agent: agent || undefined,
    workingCompanyType: workingCompanyType ? `${workingCompanyType}` : undefined,
    workingCompanyName: workingCompanyName || undefined,
    workingProject: workingProject || undefined,
    workingManager: workingManager || undefined,
    address: address || undefined,
    workingContent: workingContent || undefined,
    supervisor: supervisor || undefined,
    planType: isNumber(planType) ? `${planType}` : undefined,
    approveStatus: approveStatus ? `${approveStatus}` : undefined,
    signature: signature || undefined,
    workingStatus: workingStatus ? `${workingStatus}` : undefined,
    finishDate: finishDate ? moment(finishDate) : undefined,
    hazardIdentification: hazardIdentification || undefined,
    riskFactors: riskFactors || undefined,
    safetyMeasures: JSON.parse(safetyMeasures) || undefined,
    certificatesFileList: certificatesFileList
      ? certificatesFileList.map((item, index) => ({
          ...item,
          url: item.webUrl,
          status: 'done',
          uid: -index - 1,
          name: item.fileName,
        }))
      : undefined,
    applyFileList: applyFileList
      ? applyFileList.map((item, index) => ({
          ...item,
          url: item.webUrl,
          status: 'done',
          uid: -index - 1,
          name: item.fileName,
        }))
      : undefined,
    isSetWarn: isNumber(isSetWarn) ? `${isSetWarn}` : undefined,
    mapAddress: mapAddress ? JSON.parse(mapAddress) : undefined,
  }),
  [typeList[6].key]: ({
    companyId,
    companyName,
    billType,
    billLevel,
    applyUserId,
    applyUserName,
    applyCompanyName,
    applyDepartmentId,
    applyDepartmentName,
    applyDate,
    workingStartDate,
    workingEndDate,
    billCode,
    equipmentPipelineName,
    agent,
    supervisor,
    supervisorPosition,
    mainMedium,
    temperature,
    pressure,
    material,
    specs,
    location,
    blindPlateCode,
    constructionManager,
    recoveryDate,
    workingProject,
    compilingPerson,
    safetyEducator,
    planType,
    approveStatus,
    signature,
    workingStatus,
    finishDate,
    hazardIdentification,
    riskFactors,
    safetyMeasures,
    certificatesFileList,
    locationFileList,
    applyFileList,
    isSetWarn,
    mapAddress,
  }) => ({
    company: companyId ? { key: companyId, value: companyId, label: companyName } : undefined,
    billType: billType ? `${billType}` : undefined,
    billLevel: billLevel ? `${billLevel}` : undefined,
    applyUser: applyUserId
      ? { key: applyUserId, value: applyUserId, label: applyUserName }
      : undefined,
    applyCompanyName: applyCompanyName || undefined,
    applyDepartment: applyDepartmentId
      ? { key: applyDepartmentId, value: applyDepartmentId, label: applyDepartmentName }
      : undefined,
    applyDate: applyDate ? moment(applyDate) : undefined,
    range:
      workingStartDate && workingEndDate
        ? [moment(workingStartDate), moment(workingEndDate)]
        : undefined,
    billCode: billCode || undefined,
    equipmentPipelineName: equipmentPipelineName || undefined,
    agent: agent || undefined,
    supervisor: supervisor || undefined,
    supervisorPosition: supervisorPosition || undefined,
    mainMedium: mainMedium || undefined,
    temperature: temperature || undefined,
    pressure: pressure || undefined,
    material: material || undefined,
    specs: specs || undefined,
    location: location || undefined,
    blindPlateCode: blindPlateCode || undefined,
    constructionManager: constructionManager || undefined,
    recoveryDate: recoveryDate ? moment(recoveryDate) : undefined,
    workingProject: workingProject || undefined,
    compilingPerson: compilingPerson || undefined,
    safetyEducator: safetyEducator || undefined,
    planType: isNumber(planType) ? `${planType}` : undefined,
    approveStatus: approveStatus ? `${approveStatus}` : undefined,
    signature: signature || undefined,
    workingStatus: workingStatus ? `${workingStatus}` : undefined,
    finishDate: finishDate ? moment(finishDate) : undefined,
    hazardIdentification: hazardIdentification || undefined,
    riskFactors: riskFactors || undefined,
    safetyMeasures: JSON.parse(safetyMeasures) || undefined,
    certificatesFileList: certificatesFileList
      ? certificatesFileList.map((item, index) => ({
          ...item,
          url: item.webUrl,
          status: 'done',
          uid: -index - 1,
          name: item.fileName,
        }))
      : undefined,
    locationFileList: locationFileList
      ? locationFileList.map((item, index) => ({
          ...item,
          url: item.webUrl,
          status: 'done',
          uid: -index - 1,
          name: item.fileName,
        }))
      : undefined,
    applyFileList: applyFileList
      ? applyFileList.map((item, index) => ({
          ...item,
          url: item.webUrl,
          status: 'done',
          uid: -index - 1,
          name: item.fileName,
        }))
      : undefined,
    isSetWarn: isNumber(isSetWarn) ? `${isSetWarn}` : undefined,
    mapAddress: mapAddress ? JSON.parse(mapAddress) : undefined,
  }),
  [typeList[7].key]: ({
    companyId,
    companyName,
    billType,
    applyUserId,
    applyUserName,
    applyCompanyName,
    applyDepartmentId,
    applyDepartmentName,
    applyDate,
    billCode,
    location,
    address,
    workingContent,
    agent,
    workingProject,
    workingStartDate,
    workingEndDate,
    workingCompanyType,
    workingCompanyName,
    compilingPerson,
    supervisor,
    supervisorPosition,
    safetyEducator,
    planType,
    recoveryDate,
    approveStatus,
    signature,
    workingStatus,
    finishDate,
    hazardIdentification,
    riskFactors,
    safetyMeasures,
    certificatesFileList,
    locationFileList,
    applyFileList,
    isSetWarn,
    mapAddress,
  }) => ({
    company: companyId ? { key: companyId, value: companyId, label: companyName } : undefined,
    billType: billType ? `${billType}` : undefined,
    applyUser: applyUserId
      ? { key: applyUserId, value: applyUserId, label: applyUserName }
      : undefined,
    applyCompanyName: applyCompanyName || undefined,
    applyDepartment: applyDepartmentId
      ? { key: applyDepartmentId, value: applyDepartmentId, label: applyDepartmentName }
      : undefined,
    applyDate: applyDate ? moment(applyDate) : undefined,
    billCode: billCode || undefined,
    location: location || undefined,
    address: address || undefined,
    workingContent: workingContent || undefined,
    agent: agent || undefined,
    workingProject: workingProject || undefined,
    range:
      workingStartDate && workingEndDate
        ? [moment(workingStartDate), moment(workingEndDate)]
        : undefined,
    workingCompanyType: workingCompanyType ? `${workingCompanyType}` : undefined,
    workingCompanyName: workingCompanyName || undefined,
    compilingPerson: compilingPerson || undefined,
    supervisor: supervisor || undefined,
    supervisorPosition: supervisorPosition || undefined,
    safetyEducator: safetyEducator || undefined,
    planType: isNumber(planType) ? `${planType}` : undefined,
    recoveryDate: recoveryDate ? moment(recoveryDate) : undefined,
    approveStatus: approveStatus ? `${approveStatus}` : undefined,
    signature: signature || undefined,
    workingStatus: workingStatus ? `${workingStatus}` : undefined,
    finishDate: finishDate ? moment(finishDate) : undefined,
    hazardIdentification: hazardIdentification || undefined,
    riskFactors: riskFactors || undefined,
    safetyMeasures: JSON.parse(safetyMeasures) || undefined,
    certificatesFileList: certificatesFileList
      ? certificatesFileList.map((item, index) => ({
          ...item,
          url: item.webUrl,
          status: 'done',
          uid: -index - 1,
          name: item.fileName,
        }))
      : undefined,
    locationFileList: locationFileList
      ? locationFileList.map((item, index) => ({
          ...item,
          url: item.webUrl,
          status: 'done',
          uid: -index - 1,
          name: item.fileName,
        }))
      : undefined,
    applyFileList: applyFileList
      ? applyFileList.map((item, index) => ({
          ...item,
          url: item.webUrl,
          status: 'done',
          uid: -index - 1,
          name: item.fileName,
        }))
      : undefined,
    isSetWarn: isNumber(isSetWarn) ? `${isSetWarn}` : undefined,
    mapAddress: mapAddress ? JSON.parse(mapAddress) : undefined,
  }),
  [typeList[8].key]: ({
    companyId,
    companyName,
    billType,
    applyUserId,
    applyUserName,
    applyCompanyName,
    applyDepartmentId,
    applyDepartmentName,
    applyDate,
    billCode,
    address,
    agent,
    workingProject,
    workingStartDate,
    workingEndDate,
    workingCompanyType,
    workingCompanyName,
    workingManager,
    workingPersonnel,
    compilingPerson,
    location,
    workingWay,
    workingContent,
    powerAccessPoint,
    voltage,
    planType,
    supervisor,
    supervisorPosition,
    safetyEducator,
    approveStatus,
    signature,
    workingStatus,
    finishDate,
    hazardIdentification,
    riskFactors,
    safetyMeasures,
    certificatesFileList,
    locationFileList,
    applyFileList,
    isSetWarn,
    mapAddress,
  }) => ({
    company: companyId ? { key: companyId, value: companyId, label: companyName } : undefined,
    billType: billType ? `${billType}` : undefined,
    applyUser: applyUserId
      ? { key: applyUserId, value: applyUserId, label: applyUserName }
      : undefined,
    applyCompanyName: applyCompanyName || undefined,
    applyDepartment: applyDepartmentId
      ? { key: applyDepartmentId, value: applyDepartmentId, label: applyDepartmentName }
      : undefined,
    applyDate: applyDate ? moment(applyDate) : undefined,
    billCode: billCode || undefined,
    address: address || undefined,
    agent: agent || undefined,
    workingProject: workingProject || undefined,
    range:
      workingStartDate && workingEndDate
        ? [moment(workingStartDate), moment(workingEndDate)]
        : undefined,
    workingCompanyType: workingCompanyType ? `${workingCompanyType}` : undefined,
    workingCompanyName: workingCompanyName || undefined,
    workingManager: workingManager || undefined,
    workingPersonnel: workingPersonnel || undefined,
    compilingPerson: compilingPerson || undefined,
    location: location || undefined,
    workingWay: workingWay || undefined,
    workingContent: workingContent || undefined,
    powerAccessPoint: powerAccessPoint || undefined,
    voltage: voltage || undefined,
    planType: isNumber(planType) ? `${planType}` : undefined,
    supervisor: supervisor || undefined,
    supervisorPosition: supervisorPosition || undefined,
    safetyEducator: safetyEducator || undefined,
    approveStatus: approveStatus ? `${approveStatus}` : undefined,
    signature: signature || undefined,
    workingStatus: workingStatus ? `${workingStatus}` : undefined,
    finishDate: finishDate ? moment(finishDate) : undefined,
    hazardIdentification: hazardIdentification || undefined,
    riskFactors: riskFactors || undefined,
    safetyMeasures: JSON.parse(safetyMeasures) || undefined,
    certificatesFileList: certificatesFileList
      ? certificatesFileList.map((item, index) => ({
          ...item,
          url: item.webUrl,
          status: 'done',
          uid: -index - 1,
          name: item.fileName,
        }))
      : undefined,
    locationFileList: locationFileList
      ? locationFileList.map((item, index) => ({
          ...item,
          url: item.webUrl,
          status: 'done',
          uid: -index - 1,
          name: item.fileName,
        }))
      : undefined,
    applyFileList: applyFileList
      ? applyFileList.map((item, index) => ({
          ...item,
          url: item.webUrl,
          status: 'done',
          uid: -index - 1,
          name: item.fileName,
        }))
      : undefined,
    isSetWarn: isNumber(isSetWarn) ? `${isSetWarn}` : undefined,
    mapAddress: mapAddress ? JSON.parse(mapAddress) : undefined,
  }),
};
export const getPayloadByValuesMap = {
  [typeList[0].key]: ({
    company,
    applyUser,
    applyDepartment,
    applyDate,
    billCode,
    supervisor,
    supervisorPosition,
    manager,
    range,
    workingContent,
    workingWay,
    workingProject,
    workingCompany,
    workingManager,
    workingPersonnel,
    safetyEducator,
    constructionManager,
    finishDate,
    safetyMeasures,
    approveStatus,
    signature,
    mapAddress,
    ...rest
  }) => {
    const [workingStartDate, workingEndDate] = range || [];
    return {
      ...rest,
      companyId: company && company.key,
      applyUserId: applyUser && applyUser.key,
      applyDepartmentId: applyDepartment && applyDepartment.key,
      applyDate: applyDate && applyDate.format('YYYY/MM/DD'),
      billCode: billCode && billCode.trim(),
      supervisor: supervisor && supervisor.trim(),
      supervisorPosition: supervisorPosition && supervisorPosition.trim(),
      manager: manager && manager.trim(),
      workingStartDate: workingStartDate && workingStartDate.format('YYYY/MM/DD HH:mm:00'),
      workingEndDate: workingEndDate && workingEndDate.format('YYYY/MM/DD HH:mm:00'),
      workingContent: workingContent && workingContent.trim(),
      workingWay: workingWay && workingWay.trim(),
      workingProject: workingProject && workingProject.trim(),
      workingCompanyId: workingCompany && workingCompany.key,
      workingManager: workingManager && workingManager.trim(),
      workingPersonnelId: workingPersonnel && workingPersonnel.map(item => item.key).join(','),
      safetyEducator: safetyEducator && safetyEducator.trim(),
      constructionManager: constructionManager && constructionManager.trim(),
      finishDate: finishDate && finishDate.format('YYYY/MM/DD HH:mm:00'),
      safetyMeasures: safetyMeasures && JSON.stringify(safetyMeasures),
      mapAddress: mapAddress && JSON.stringify(mapAddress),
    };
  },
  [typeList[1].key]: ({
    company,
    applyUser,
    applyDepartment,
    applyDate,
    billCode,
    workingProject,
    workingCompanyType,
    workingCompanyName,
    workingDepartment,
    constructionManager,
    agent,
    workingPersonnel,
    range,
    finishDate,
    safetyMeasures,
    approveStatus,
    signature,
    mapAddress,
    ...rest
  }) => {
    const [workingStartDate, workingEndDate] = range || [];
    return {
      ...rest,
      companyId: company && company.key,
      applyUserId: applyUser && applyUser.key,
      applyDepartmentId: applyDepartment && applyDepartment.key,
      applyDate: applyDate && applyDate.format('YYYY/MM/DD'),
      billCode: billCode && billCode.trim(),
      workingProject: workingProject && workingProject.trim(),
      workingCompanyType,
      workingCompanyName: workingCompanyName && workingCompanyName.trim(),
      workingDepartment:
        workingDepartment &&
        (workingCompanyType === companyTypeList[0].key
          ? workingDepartment.key
          : workingDepartment.trim()),
      constructionManager: constructionManager && constructionManager.trim(),
      agent: agent && agent.trim(),
      workingPersonnel: workingPersonnel && workingPersonnel.join(','),
      workingStartDate: workingStartDate && workingStartDate.format('YYYY/MM/DD HH:mm:00'),
      workingEndDate: workingEndDate && workingEndDate.format('YYYY/MM/DD HH:mm:00'),
      finishDate: finishDate && finishDate.format('YYYY/MM/DD HH:mm:00'),
      safetyMeasures: safetyMeasures && JSON.stringify(safetyMeasures),
      mapAddress: mapAddress && JSON.stringify(mapAddress),
    };
  },
  [typeList[2].key]: ({
    company,
    applyUser,
    applyCompanyName,
    applyDepartment,
    applyDate,
    billCode,
    height,
    address,
    agent,
    workingCompany,
    workingManager,
    workingPersonnel,
    supervisor,
    supervisorPosition,
    range,
    compilingPerson,
    workingProject,
    safetyEducator,
    finishDate,
    safetyMeasures,
    approveStatus,
    signature,
    mapAddress,
    ...rest
  }) => {
    const [workingStartDate, workingEndDate] = range || [];
    return {
      ...rest,
      companyId: company && company.key,
      applyUserId: applyUser && applyUser.key,
      applyCompanyName: applyCompanyName && applyCompanyName.trim(),
      applyDepartmentId: applyDepartment && applyDepartment.key,
      applyDate: applyDate && applyDate.format('YYYY/MM/DD'),
      billCode: billCode && billCode.trim(),
      height: height && height.trim(),
      address: address && address.trim(),
      agent: agent && agent.trim(),
      workingCompanyId: workingCompany && workingCompany.key,
      workingManager: workingManager && workingManager.trim(),
      workingPersonnelId: workingPersonnel && workingPersonnel.map(item => item.key).join(','),
      supervisor: supervisor && supervisor.trim(),
      supervisorPosition: supervisorPosition && supervisorPosition.trim(),
      workingStartDate: workingStartDate && workingStartDate.format('YYYY/MM/DD HH:mm:00'),
      workingEndDate: workingEndDate && workingEndDate.format('YYYY/MM/DD HH:mm:00'),
      compilingPerson: compilingPerson && compilingPerson.trim(),
      workingProject: workingProject && workingProject.trim(),
      safetyEducator: safetyEducator && safetyEducator.trim(),
      finishDate: finishDate && finishDate.format('YYYY/MM/DD HH:mm:00'),
      safetyMeasures: safetyMeasures && JSON.stringify(safetyMeasures),
      mapAddress: mapAddress && JSON.stringify(mapAddress),
    };
  },
  [typeList[3].key]: ({
    company,
    applyUser,
    applyCompanyName,
    applyDepartment,
    applyDate,
    billCode,
    workingCompany,
    address,
    tool,
    workingContent,
    workingPersonnel,
    workingProject,
    supervisor,
    supervisorPosition,
    range,
    compilingPerson,
    safetyEducator,
    manager,
    agent,
    finishDate,
    safetyMeasures,
    approveStatus,
    signature,
    mapAddress,
    ...rest
  }) => {
    const [workingStartDate, workingEndDate] = range || [];
    return {
      ...rest,
      companyId: company && company.key,
      applyUserId: applyUser && applyUser.key,
      applyCompanyName: applyCompanyName && applyCompanyName.trim(),
      applyDepartmentId: applyDepartment && applyDepartment.key,
      applyDate: applyDate && applyDate.format('YYYY/MM/DD'),
      billCode: billCode && billCode.trim(),
      workingCompanyId: workingCompany && workingCompany.key,
      address: address && address.trim(),
      tool: tool && tool.trim(),
      workingContent: workingContent && workingContent.trim(),
      workingPersonnelId: workingPersonnel && workingPersonnel.map(item => item.key).join(','),
      workingProject: workingProject && workingProject.trim(),
      supervisor: supervisor && supervisor.trim(),
      supervisorPosition: supervisorPosition && supervisorPosition.trim(),
      workingStartDate: workingStartDate && workingStartDate.format('YYYY/MM/DD HH:mm:00'),
      workingEndDate: workingEndDate && workingEndDate.format('YYYY/MM/DD HH:mm:00'),
      compilingPerson: compilingPerson && compilingPerson.trim(),
      safetyEducator: safetyEducator && safetyEducator.trim(),
      manager: manager && manager.trim(),
      agent: agent && agent.trim(),
      finishDate: finishDate && finishDate.format('YYYY/MM/DD HH:mm:00'),
      safetyMeasures: safetyMeasures && JSON.stringify(safetyMeasures),
      mapAddress: mapAddress && JSON.stringify(mapAddress),
    };
  },
  [typeList[4].key]: ({
    company,
    applyUser,
    applyCompanyName,
    applyDepartment,
    applyDate,
    billCode,
    address,
    workingContent,
    workingProject,
    range,
    workingCompany,
    workingManager,
    workingPersonnel,
    compilingPerson,
    agent,
    supervisor,
    supervisorPosition,
    safetyEducator,
    finishDate,
    safetyMeasures,
    approveStatus,
    signature,
    mapAddress,
    ...rest
  }) => {
    const [workingStartDate, workingEndDate] = range || [];
    return {
      ...rest,
      companyId: company && company.key,
      applyUserId: applyUser && applyUser.key,
      applyCompanyName: applyCompanyName && applyCompanyName.trim(),
      applyDepartmentId: applyDepartment && applyDepartment.key,
      applyDate: applyDate && applyDate.format('YYYY/MM/DD'),
      billCode: billCode && billCode.trim(),
      address: address && address.trim(),
      workingContent: workingContent && workingContent.trim(),
      workingProject: workingProject && workingProject.trim(),
      workingStartDate: workingStartDate && workingStartDate.format('YYYY/MM/DD HH:mm:00'),
      workingEndDate: workingEndDate && workingEndDate.format('YYYY/MM/DD HH:mm:00'),
      workingCompanyId: workingCompany && workingCompany.key,
      workingManager: workingManager && workingManager.trim(),
      workingPersonnelId: workingPersonnel && workingPersonnel.map(item => item.key).join(','),
      compilingPerson: compilingPerson && compilingPerson.trim(),
      agent: agent && agent.trim(),
      supervisor: supervisor && supervisor.trim(),
      supervisorPosition: supervisorPosition && supervisorPosition.trim(),
      safetyEducator: safetyEducator && safetyEducator.trim(),
      finishDate: finishDate && finishDate.format('YYYY/MM/DD HH:mm:00'),
      safetyMeasures: safetyMeasures && JSON.stringify(safetyMeasures),
      mapAddress: mapAddress && JSON.stringify(mapAddress),
    };
  },
  [typeList[5].key]: ({
    company,
    applyUser,
    applyCompanyName,
    applyDepartment,
    applyDate,
    billCode,
    manager,
    range,
    agent,
    workingCompanyName,
    workingProject,
    workingManager,
    address,
    workingContent,
    supervisor,
    finishDate,
    hazardIdentification,
    safetyMeasures,
    approveStatus,
    signature,
    mapAddress,
    ...rest
  }) => {
    const [workingStartDate, workingEndDate] = range || [];
    return {
      ...rest,
      companyId: company && company.key,
      applyUserId: applyUser && applyUser.key,
      applyCompanyName: applyCompanyName && applyCompanyName.trim(),
      applyDepartmentId: applyDepartment && applyDepartment.key,
      applyDate: applyDate && applyDate.format('YYYY/MM/DD'),
      billCode: billCode && billCode.trim(),
      manager: manager && manager.trim(),
      workingStartDate: workingStartDate && workingStartDate.format('YYYY/MM/DD HH:mm:00'),
      workingEndDate: workingEndDate && workingEndDate.format('YYYY/MM/DD HH:mm:00'),
      agent: agent && agent.trim(),
      workingCompanyName: workingCompanyName && workingCompanyName.trim(),
      workingProject: workingProject && workingProject.trim(),
      workingManager: workingManager && workingManager.trim(),
      address: address && address.trim(),
      workingContent: workingContent && workingContent.trim(),
      supervisor: supervisor && supervisor.trim(),
      finishDate: finishDate && finishDate.format('YYYY/MM/DD HH:mm:00'),
      hazardIdentification: hazardIdentification && hazardIdentification.trim(),
      safetyMeasures: safetyMeasures && JSON.stringify(safetyMeasures),
      mapAddress: mapAddress && JSON.stringify(mapAddress),
    };
  },
  [typeList[6].key]: ({
    company,
    applyUser,
    applyCompanyName,
    applyDepartment,
    applyDate,
    range,
    billCode,
    equipmentPipelineName,
    agent,
    supervisor,
    supervisorPosition,
    mainMedium,
    temperature,
    pressure,
    material,
    specs,
    location,
    blindPlateCode,
    constructionManager,
    recoveryDate,
    workingProject,
    compilingPerson,
    safetyEducator,
    finishDate,
    hazardIdentification,
    safetyMeasures,
    approveStatus,
    signature,
    mapAddress,
    ...rest
  }) => {
    const [workingStartDate, workingEndDate] = range || [];
    return {
      ...rest,
      companyId: company && company.key,
      applyUserId: applyUser && applyUser.key,
      applyCompanyName: applyCompanyName && applyCompanyName.trim(),
      applyDepartmentId: applyDepartment && applyDepartment.key,
      applyDate: applyDate && applyDate.format('YYYY/MM/DD'),
      workingStartDate: workingStartDate && workingStartDate.format('YYYY/MM/DD HH:mm:00'),
      workingEndDate: workingEndDate && workingEndDate.format('YYYY/MM/DD HH:mm:00'),
      billCode: billCode && billCode.trim(),
      equipmentPipelineName: equipmentPipelineName && equipmentPipelineName.trim(),
      agent: agent && agent.trim(),
      supervisor: supervisor && supervisor.trim(),
      supervisorPosition: supervisorPosition && supervisorPosition.trim(),
      mainMedium: mainMedium && mainMedium.trim(),
      temperature: temperature && temperature.trim(),
      pressure: pressure && pressure.trim(),
      material: material && material.trim(),
      specs: specs && specs.trim(),
      location: location && location.trim(),
      blindPlateCode: blindPlateCode && blindPlateCode.trim(),
      constructionManager: constructionManager && constructionManager.trim(),
      recoveryDate: recoveryDate && recoveryDate.format('YYYY/MM/DD HH:mm:00'),
      workingProject: workingProject && workingProject.trim(),
      compilingPerson: compilingPerson && compilingPerson.trim(),
      safetyEducator: safetyEducator && safetyEducator.trim(),
      finishDate: finishDate && finishDate.format('YYYY/MM/DD HH:mm:00'),
      hazardIdentification: hazardIdentification && hazardIdentification.trim(),
      safetyMeasures: safetyMeasures && JSON.stringify(safetyMeasures),
      mapAddress: mapAddress && JSON.stringify(mapAddress),
    };
  },
  [typeList[7].key]: ({
    company,
    applyUser,
    applyCompanyName,
    applyDepartment,
    applyDate,
    billCode,
    location,
    address,
    workingContent,
    agent,
    workingProject,
    range,
    workingCompanyName,
    compilingPerson,
    supervisor,
    supervisorPosition,
    safetyEducator,
    recoveryDate,
    finishDate,
    hazardIdentification,
    safetyMeasures,
    approveStatus,
    signature,
    mapAddress,
    ...rest
  }) => {
    const [workingStartDate, workingEndDate] = range || [];
    return {
      ...rest,
      companyId: company && company.key,
      applyUserId: applyUser && applyUser.key,
      applyCompanyName: applyCompanyName && applyCompanyName.trim(),
      applyDepartmentId: applyDepartment && applyDepartment.key,
      applyDate: applyDate && applyDate.format('YYYY/MM/DD'),
      billCode: billCode && billCode.trim(),
      location: location && location.trim(),
      address: address && address.trim(),
      workingContent: workingContent && workingContent.trim(),
      agent: agent && agent.trim(),
      workingProject: workingProject && workingProject.trim(),
      workingStartDate: workingStartDate && workingStartDate.format('YYYY/MM/DD HH:mm:00'),
      workingEndDate: workingEndDate && workingEndDate.format('YYYY/MM/DD HH:mm:00'),
      workingCompanyName: workingCompanyName && workingCompanyName.trim(),
      compilingPerson: compilingPerson && compilingPerson.trim(),
      supervisor: supervisor && supervisor.trim(),
      supervisorPosition: supervisorPosition && supervisorPosition.trim(),
      safetyEducator: safetyEducator && safetyEducator.trim(),
      recoveryDate: recoveryDate && recoveryDate.format('YYYY/MM/DD HH:mm:00'),
      finishDate: finishDate && finishDate.format('YYYY/MM/DD HH:mm:00'),
      hazardIdentification: hazardIdentification && hazardIdentification.trim(),
      safetyMeasures: safetyMeasures && JSON.stringify(safetyMeasures),
      mapAddress: mapAddress && JSON.stringify(mapAddress),
    };
  },
  [typeList[8].key]: ({
    company,
    applyUser,
    applyCompanyName,
    applyDepartment,
    applyDate,
    billCode,
    address,
    agent,
    workingProject,
    range,
    workingCompanyName,
    workingManager,
    workingPersonnel,
    compilingPerson,
    location,
    workingWay,
    workingContent,
    powerAccessPoint,
    voltage,
    supervisor,
    supervisorPosition,
    safetyEducator,
    finishDate,
    hazardIdentification,
    safetyMeasures,
    approveStatus,
    signature,
    mapAddress,
    ...rest
  }) => {
    const [workingStartDate, workingEndDate] = range || [];
    return {
      ...rest,
      companyId: company && company.key,
      applyUserId: applyUser && applyUser.key,
      applyCompanyName: applyCompanyName && applyCompanyName.trim(),
      applyDepartmentId: applyDepartment && applyDepartment.key,
      applyDate: applyDate && applyDate.format('YYYY/MM/DD'),
      billCode: billCode && billCode.trim(),
      address: address && address.trim(),
      agent: agent && agent.trim(),
      workingProject: workingProject && workingProject.trim(),
      workingStartDate: workingStartDate && workingStartDate.format('YYYY/MM/DD HH:mm:00'),
      workingEndDate: workingEndDate && workingEndDate.format('YYYY/MM/DD HH:mm:00'),
      workingCompanyName: workingCompanyName && workingCompanyName.trim(),
      workingManager: workingManager && workingManager.trim(),
      workingPersonnel: workingPersonnel && workingPersonnel.trim(),
      compilingPerson: compilingPerson && compilingPerson.trim(),
      location: location && location.trim(),
      workingWay: workingWay && workingWay.trim(),
      workingContent: workingContent && workingContent.trim(),
      powerAccessPoint: powerAccessPoint && powerAccessPoint.trim(),
      voltage: voltage && voltage.trim(),
      supervisor: supervisor && supervisor.trim(),
      supervisorPosition: supervisorPosition && supervisorPosition.trim(),
      safetyEducator: safetyEducator && safetyEducator.trim(),
      finishDate: finishDate && finishDate.format('YYYY/MM/DD HH:mm:00'),
      hazardIdentification: hazardIdentification && hazardIdentification.trim(),
      safetyMeasures: safetyMeasures && JSON.stringify(safetyMeasures),
      mapAddress: mapAddress && JSON.stringify(mapAddress),
    };
  },
};
const validateSafetyMeasures = (_, value, callback) => {
  if (value && value.length) {
    if (value.every(item => item.disabled)) {
      callback('请选择安全措施');
    } else if (value.some(item => !item.disabled && !item.confirmer)) {
      callback('请输入安全措施确认人');
    }
    callback();
  } else {
    callback('请输入安全措施确认人');
  }
};
const getTagsSelectValueFromEvent = value => value && value.filter(item => item.trim());
export const Signature = ({ value, loading }) =>
  loading ? (
    <Spin />
  ) : value ? (
    <img className={styles.signature} src={value} alt="" />
  ) : (
    <EmptyText />
  );
export const getFormFieldsMap = {
  [typeList[0].key]: ({
    isUnit,
    values,
    name,
    companyList,
    loadingCompanyList,
    setCompanyPayload,
    onCompanySelectChange,
    personList,
    loadingPersonList,
    setPersonPayload,
    onPersonSelectChange,
    departmentTree,
    loadingDepartmentTree,
    contractorList,
    loadingContractorList,
    setContractorPayload,
    onContractorSelectChange,
    specialOperatorList,
    loadingSpecialOperatorList,
    setSpecialOperatorPayload,
    contractorPersonnelQualificationList,
    loadingContractorPersonnelQualificationList,
    setContractorPersonnelQualificationPayload,
    ranges,
  }) => {
    const isQCG = ['确成硅', '东沃化能'].some(
      item => values.company && values.company.label.includes(item)
    ); // 是否是确成硅或东沃化能
    return [
      {
        name: 'company',
        label: '单位名称',
        children:
          name !== 'detail' ? (
            <PagingSelect
              options={companyList.list}
              loading={loadingCompanyList}
              disabled={name !== 'add'}
              hasMore={
                companyList.pagination &&
                companyList.pagination.total >
                  companyList.pagination.pageNum * companyList.pagination.pageSize
              }
              onSearch={name => setCompanyPayload(payload => ({ ...payload, pageNum: 1, name }))}
              loadMore={() =>
                setCompanyPayload(payload => ({ ...payload, pageNum: payload.pageNum + 1 }))
              }
              onChange={onCompanySelectChange}
            />
          ) : (
            <Text type="Select" labelInValue />
          ),
        getValueFromEvent: getSelectValueFromEvent,
        rules: name !== 'detail' ? [{ required: true, message: '请选择单位名称' }] : undefined,
        hidden: isUnit,
        col: !isUnit ? formCol : hiddenCol,
      },
      {
        name: 'billType',
        label: '作业证名称',
        children:
          name !== 'detail' ? (
            <Select placeholder="请选择" options={typeList} disabled={name !== 'add'} />
          ) : (
            <Text type="Select" options={typeList} />
          ),
        rules: name !== 'detail' ? [{ required: true, message: '请选择作业证名称' }] : undefined,
        col: formCol,
      },
      {
        name: 'applyUser',
        label: '申请人',
        children:
          name !== 'detail' ? (
            <PagingSelect
              options={values.company ? personList.list : []}
              loading={loadingPersonList}
              hasMore={
                personList.pagination &&
                personList.pagination.total >
                  personList.pagination.pageNum * personList.pagination.pageSize
              }
              onSearch={name => setPersonPayload(payload => ({ ...payload, pageNum: 1, name }))}
              loadMore={() =>
                setPersonPayload(payload => ({ ...payload, pageNum: payload.pageNum + 1 }))
              }
              onChange={onPersonSelectChange}
            />
          ) : (
            <Text type="Select" labelInValue />
          ),
        getValueFromEvent: getSelectValueFromEvent,
        rules: name !== 'detail' ? [{ required: true, message: '请选择申请人' }] : undefined,
        col: formCol,
      },
      {
        name: 'applyDepartment',
        label: '申请部门',
        children:
          name !== 'detail' ? (
            <TreeSelect
              placeholder="请选择"
              treeData={values.company ? departmentTree : []}
              labelInValue
              notFoundContent={loadingDepartmentTree ? <Spin size="small" /> : undefined}
              showSearch
              treeNodeFilterProp="title"
            />
          ) : (
            <Text type="TreeSelect" labelInValue />
          ),
        getValueFromEvent: getSelectValueFromEvent,
        rules: name !== 'detail' ? [{ required: true, message: '请选择申请部门' }] : undefined,
        col: formCol,
      },
      {
        name: 'applyDate',
        label: '申请日期',
        children:
          name !== 'detail' ? (
            <DatePicker
              className={styles.datePicker}
              placeholder="请选择"
              format={dateFormat}
              allowClear={false}
            />
          ) : (
            <Text type="DatePicker" format={dateFormat} />
          ),
        rules: name !== 'detail' ? [{ required: true, message: '请选择申请日期' }] : undefined,
        col: formCol,
      },
      {
        name: 'billCode',
        label: '作业证编号',
        children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
        rules:
          name !== 'detail'
            ? [
                { required: true, message: '请输入作业证编号' },
                { whitespace: true, message: '作业证编号不能只为空格' },
              ]
            : undefined,
        col: formCol,
      },
      {
        name: 'billLevel',
        label: '动火作业级别（动火证类型）',
        children:
          name !== 'detail' ? (
            <Select placeholder="请选择" options={hotWorkLevelList} />
          ) : (
            <Text type="Select" options={hotWorkLevelList} />
          ),
        rules:
          name !== 'detail'
            ? [{ required: true, message: '请选择动火作业级别（动火证类型）' }]
            : undefined,
        col: formCol,
      },
      {
        name: 'supervisor',
        label: '监火人',
        children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
        rules:
          name !== 'detail'
            ? [
                { required: true, message: '请输入监火人' },
                { whitespace: true, message: '监火人不能只为空格' },
              ]
            : undefined,
        col: formCol,
      },
      {
        name: 'supervisorPosition',
        label: '监火人岗位',
        children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
        rules:
          name !== 'detail'
            ? [
                { required: true, message: '请输入监火人岗位' },
                { whitespace: true, message: '监火人岗位不能只为空格' },
              ]
            : undefined,
        col: formCol,
      },
      {
        name: 'manager',
        label: `${isQCG ? '属地' : ''}负责人`,
        children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
        rules:
          name !== 'detail'
            ? [
                { required: true, message: `请输入${isQCG ? '属地' : ''}负责人` },
                { whitespace: true, message: `${isQCG ? '属地' : ''}负责人不能只为空格` },
              ]
            : undefined,
        col: formCol,
      },
      {
        name: 'range',
        label: '动火时间',
        children:
          name !== 'detail' ? (
            <RangePicker
              className={styles.rangePicker}
              placeholder={timeRangePickerPlaceholder}
              format={minuteFormat}
              showTime
              separator="~"
              ranges={ranges}
              allowClear={false}
            />
          ) : (
            <Text type="RangePicker" format={minuteFormat} />
          ),
        rules: name !== 'detail' ? [{ required: true, message: '请选择动火时间' }] : undefined,
        col: formCol,
      },
      {
        name: 'workingContent',
        label: '动火内容',
        children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
        rules:
          name !== 'detail'
            ? [
                { required: true, message: '请输入动火内容' },
                { whitespace: true, message: '动火内容不能只为空格' },
              ]
            : undefined,
        col: formCol,
      },
      {
        name: 'workingWay',
        label: '动火方式',
        children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
        rules:
          name !== 'detail'
            ? [
                { required: true, message: '请输入动火方式' },
                { whitespace: true, message: '动火方式不能只为空格' },
              ]
            : undefined,
        col: formCol,
      },
      {
        name: 'workingProject',
        label: '施工项目',
        children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
        rules:
          name !== 'detail'
            ? [
                { required: true, message: '请输入施工项目' },
                { whitespace: true, message: '施工项目不能只为空格' },
              ]
            : undefined,
        col: formCol,
      },
      {
        name: 'workingCompanyType',
        label: '作业单位类型',
        children:
          name !== 'detail' ? (
            <Select placeholder="请选择" options={companyTypeList} />
          ) : (
            <Text type="Select" options={companyTypeList} />
          ),
        rules: name !== 'detail' ? [{ required: true, message: '请选择作业单位类型' }] : undefined,
        col: formCol,
      },
      ...(values.workingCompanyType === companyTypeList[1].key
        ? [
            {
              name: 'workingCompany',
              label: '作业单位名称',
              children:
                name !== 'detail' ? (
                  <PagingSelect
                    options={values.company ? contractorList.list : []}
                    loading={loadingContractorList}
                    hasMore={
                      contractorList.pagination &&
                      contractorList.pagination.total >
                        contractorList.pagination.pageNum * contractorList.pagination.pageSize
                    }
                    onSearch={name =>
                      setContractorPayload(payload => ({ ...payload, pageNum: 1, name }))
                    }
                    loadMore={() =>
                      setContractorPayload(payload => ({
                        ...payload,
                        pageNum: payload.pageNum + 1,
                      }))
                    }
                    onChange={onContractorSelectChange}
                  />
                ) : (
                  <Text type="Select" labelInValue />
                ),
              getValueFromEvent: getSelectValueFromEvent,
              rules:
                name !== 'detail' ? [{ required: true, message: '请选择作业单位名称' }] : undefined,
              col: formCol,
            },
          ]
        : []),
      {
        name: 'workingManager',
        label: `${isQCG ? '作业单位' : '动火'}负责人`,
        children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
        rules:
          name !== 'detail'
            ? [
                { required: true, message: `请输入${isQCG ? '作业单位' : '动火'}负责人` },
                { whitespace: true, message: `${isQCG ? '作业单位' : '动火'}负责人不能只为空格` },
              ]
            : undefined,
        col: formCol,
      },
      ...(values.workingCompanyType === companyTypeList[0].key
        ? [
            {
              name: 'workingPersonnel',
              label: '动火人',
              children:
                name !== 'detail' ? (
                  <PagingSelect
                    options={values.company ? specialOperatorList.list : []}
                    loading={loadingSpecialOperatorList}
                    hasMore={
                      specialOperatorList.pagination &&
                      specialOperatorList.pagination.total >
                        specialOperatorList.pagination.pageNum *
                          specialOperatorList.pagination.pageSize
                    }
                    onSearch={name =>
                      setSpecialOperatorPayload(payload => ({ ...payload, pageNum: 1, name }))
                    }
                    loadMore={() =>
                      setSpecialOperatorPayload(payload => ({
                        ...payload,
                        pageNum: payload.pageNum + 1,
                      }))
                    }
                    mode="multiple"
                  />
                ) : (
                  <Text type="Select" labelInValue mode="multiple" />
                ),
              getValueFromEvent: getMultipleSelectValueFromEvent,
              rules: name !== 'detail' ? [{ required: true, message: '请选择动火人' }] : undefined,
              col: formCol,
            },
          ]
        : [
            {
              name: 'workingPersonnel',
              label: '动火人',
              children:
                name !== 'detail' ? (
                  <PagingSelect
                    options={values.workingCompany ? contractorPersonnelQualificationList.list : []}
                    loading={loadingContractorPersonnelQualificationList}
                    hasMore={
                      contractorPersonnelQualificationList.pagination &&
                      contractorPersonnelQualificationList.pagination.total >
                        contractorPersonnelQualificationList.pagination.pageNum *
                          contractorPersonnelQualificationList.pagination.pageSize
                    }
                    onSearch={name =>
                      setContractorPersonnelQualificationPayload(payload => ({
                        ...payload,
                        pageNum: 1,
                        name,
                      }))
                    }
                    loadMore={() =>
                      setContractorPersonnelQualificationPayload(payload => ({
                        ...payload,
                        pageNum: payload.pageNum + 1,
                      }))
                    }
                    mode="multiple"
                  />
                ) : (
                  <Text type="Select" labelInValue mode="multiple" />
                ),
              getValueFromEvent: getMultipleSelectValueFromEvent,
              rules: name !== 'detail' ? [{ required: true, message: '请选择动火人' }] : undefined,
              col: formCol,
            },
          ]),
      {
        name: 'safetyEducator',
        label: '实施安全教育人',
        children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
        rules:
          name !== 'detail'
            ? [
                { required: true, message: '请输入实施安全教育人' },
                { whitespace: true, message: '实施安全教育人不能只为空格' },
              ]
            : undefined,
        col: formCol,
      },
      {
        name: 'constructionManager',
        label: '施工负责人',
        children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
        rules:
          name !== 'detail'
            ? [
                { required: true, message: '请输入施工负责人' },
                { whitespace: true, message: '施工负责人不能只为空格' },
              ]
            : undefined,
        col: formCol,
      },
      {
        name: 'planType',
        label: '计划性',
        children:
          name !== 'detail' ? (
            <Select placeholder="请选择" options={planTypeList} />
          ) : (
            <Text type="Select" options={planTypeList} />
          ),
        rules: name !== 'detail' ? [{ required: true, message: '请选择计划性' }] : undefined,
        col: formCol,
      },
      {
        name: 'approveStatus',
        label: '审批状态',
        children:
          name !== 'detail' ? (
            <Select placeholder="请选择" options={approveStatusList} />
          ) : (
            <Text type="Select" options={approveStatusList} />
          ),
        hidden: name !== 'detail',
        col: name !== 'detail' ? hiddenCol : formCol,
      },
      ...(values.approveStatus === approveStatusList[1].key ||
      values.approveStatus === approveStatusList[2].key
        ? [
            {
              name: 'signature',
              label: '手写签名',
              children: <Signature />,
              hidden: name !== 'detail',
              col: name !== 'detail' ? hiddenCol : formCol,
            },
          ]
        : []),
      ...(values.approveStatus === approveStatusList[1].key
        ? [
            {
              name: 'workingStatus',
              label: '作业状态',
              children:
                name !== 'detail' ? (
                  <Select placeholder="请选择" options={workingStatusList} />
                ) : (
                  <Text type="Select" options={workingStatusList} />
                ),
              rules:
                name !== 'detail' ? [{ required: true, message: '请选择作业状态' }] : undefined,
              col: formCol,
            },
          ]
        : []),
      ...(values.workingStatus === workingStatusList[2].key
        ? [
            {
              name: 'finishDate',
              label: '完工时间',
              children:
                name !== 'detail' ? (
                  <DatePicker
                    className={styles.datePicker}
                    placeholder="请选择"
                    format={minuteFormat}
                    showTime
                    allowClear={false}
                  />
                ) : (
                  <Text type="DatePicker" format={dateFormat} />
                ),
              rules:
                name !== 'detail' ? [{ required: true, message: '请选择完工时间' }] : undefined,
              col: formCol,
            },
          ]
        : []),
      {
        name: 'riskFactors',
        label: '危险因素',
        children:
          name !== 'detail' ? (
            <TextArea
              placeholder="请输入"
              maxLength={200}
              autoSize={{
                minRows: 3,
              }}
            />
          ) : (
            <Text type="TextArea" />
          ),
        rules:
          name !== 'detail'
            ? [
                { required: true, message: '请输入危险因素' },
                { whitespace: true, message: '危险因素不能只为空格' },
              ]
            : undefined,
        wrapperCol: halfCol,
        col,
      },
      {
        name: 'safetyMeasures',
        label: '安全措施',
        children: (
          <SafetyMeasures
            list={safetyMeasuresMap[values.billType]}
            name={name}
            approved={values.approveStatus === approveStatusList[1].key}
          />
        ),
        rules:
          name !== 'detail'
            ? [{ type: 'array', required: true, validator: validateSafetyMeasures }]
            : undefined,
        col,
      },
      {
        name: 'certificatesFileList',
        label: '特殊作业操作证附件',
        children: name !== 'detail' ? <Upload /> : <Text type="Upload" />,
        wrapperCol: halfCol,
        col,
      },
      {
        name: 'applyFileList',
        label: '审批附件',
        children: name !== 'detail' ? <Upload /> : <Text type="Upload" />,
        wrapperCol: halfCol,
        col,
      },
      {
        name: 'isSetWarn',
        label: '是否设置作业区域',
        children:
          name !== 'detail' ? (
            <Radio.Group options={yesOrNo} />
          ) : (
            <Text type="Radio" options={yesOrNo} />
          ),
        col,
      },
    ];
  },
  [typeList[1].key]: ({
    isUnit,
    values,
    name,
    companyList,
    loadingCompanyList,
    setCompanyPayload,
    onCompanySelectChange,
    personList,
    loadingPersonList,
    setPersonPayload,
    onPersonSelectChange,
    departmentTree,
    loadingDepartmentTree,
    departmentTree2,
    loadingDepartmentTree2,
    ranges,
  }) => [
    {
      name: 'company',
      label: '单位名称',
      children:
        name !== 'detail' ? (
          <PagingSelect
            options={companyList.list}
            loading={loadingCompanyList}
            disabled={name !== 'add'}
            hasMore={
              companyList.pagination &&
              companyList.pagination.total >
                companyList.pagination.pageNum * companyList.pagination.pageSize
            }
            onSearch={name => setCompanyPayload(payload => ({ ...payload, pageNum: 1, name }))}
            loadMore={() =>
              setCompanyPayload(payload => ({ ...payload, pageNum: payload.pageNum + 1 }))
            }
            onChange={onCompanySelectChange}
          />
        ) : (
          <Text type="Select" labelInValue />
        ),
      getValueFromEvent: getSelectValueFromEvent,
      rules: name !== 'detail' ? [{ required: true, message: '请选择单位名称' }] : undefined,
      hidden: isUnit,
      col: !isUnit ? formCol : hiddenCol,
    },
    {
      name: 'billType',
      label: '作业证名称',
      children:
        name !== 'detail' ? (
          <Select placeholder="请选择" options={typeList} disabled={name !== 'add'} />
        ) : (
          <Text type="Select" options={typeList} />
        ),
      rules: name !== 'detail' ? [{ required: true, message: '请选择作业证名称' }] : undefined,
      col: formCol,
    },
    {
      name: 'applyUser',
      label: '申请人',
      children:
        name !== 'detail' ? (
          <PagingSelect
            options={values.company ? personList.list : []}
            loading={loadingPersonList}
            hasMore={
              personList.pagination &&
              personList.pagination.total >
                personList.pagination.pageNum * personList.pagination.pageSize
            }
            onSearch={name => setPersonPayload(payload => ({ ...payload, pageNum: 1, name }))}
            loadMore={() =>
              setPersonPayload(payload => ({ ...payload, pageNum: payload.pageNum + 1 }))
            }
            onChange={onPersonSelectChange}
          />
        ) : (
          <Text type="Select" labelInValue />
        ),
      getValueFromEvent: getSelectValueFromEvent,
      rules: name !== 'detail' ? [{ required: true, message: '请选择申请人' }] : undefined,
      col: formCol,
    },
    {
      name: 'applyDepartment',
      label: '申请部门',
      children:
        name !== 'detail' ? (
          <TreeSelect
            placeholder="请选择"
            treeData={values.company ? departmentTree : []}
            labelInValue
            notFoundContent={loadingDepartmentTree ? <Spin size="small" /> : undefined}
            showSearch
            treeNodeFilterProp="title"
          />
        ) : (
          <Text type="TreeSelect" labelInValue />
        ),
      getValueFromEvent: getSelectValueFromEvent,
      rules: name !== 'detail' ? [{ required: true, message: '请选择申请部门' }] : undefined,
      col: formCol,
    },
    {
      name: 'applyDate',
      label: '申请日期',
      children:
        name !== 'detail' ? (
          <DatePicker
            className={styles.datePicker}
            placeholder="请选择"
            format={dateFormat}
            allowClear={false}
          />
        ) : (
          <Text type="DatePicker" format={dateFormat} />
        ),
      rules: name !== 'detail' ? [{ required: true, message: '请选择申请日期' }] : undefined,
      col: formCol,
    },
    {
      name: 'billCode',
      label: '作业证编号',
      children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入作业证编号' },
              { whitespace: true, message: '作业证编号不能只为空格' },
            ]
          : undefined,
      col: formCol,
    },
    {
      name: 'workingProject',
      label: '受限空间（设备）名称',
      children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入受限空间（设备）名称' },
              { whitespace: true, message: '受限空间（设备）名称不能只为空格' },
            ]
          : undefined,
      col: formCol,
    },
    {
      name: 'workingCompanyType',
      label: '作业单位类型',
      children:
        name !== 'detail' ? (
          <Select placeholder="请选择" options={companyTypeList} />
        ) : (
          <Text type="Select" options={companyTypeList} />
        ),
      rules: name !== 'detail' ? [{ required: true, message: '请选择作业单位类型' }] : undefined,
      col: formCol,
    },
    ...(values.workingCompanyType === companyTypeList[1].key
      ? [
          {
            name: 'workingCompanyName',
            label: '作业单位名称',
            children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
            rules:
              name !== 'detail'
                ? [
                    { required: true, message: '请输入作业单位名称' },
                    { whitespace: true, message: '作业单位名称不能只为空格' },
                  ]
                : undefined,
            col: formCol,
          },
        ]
      : []),
    ...(values.workingCompanyType === companyTypeList[0].key
      ? [
          {
            name: 'workingDepartment',
            label: '作业部门',
            children:
              name !== 'detail' ? (
                <TreeSelect
                  placeholder="请选择"
                  treeData={values.company ? departmentTree2 : []}
                  labelInValue
                  notFoundContent={loadingDepartmentTree2 ? <Spin size="small" /> : undefined}
                  showSearch
                  treeNodeFilterProp="title"
                />
              ) : (
                <Text type="TreeSelect" labelInValue />
              ),
            getValueFromEvent: getSelectValueFromEvent,
            rules: name !== 'detail' ? [{ required: true, message: '请选择作业部门' }] : undefined,
            col: formCol,
          },
        ]
      : [
          {
            name: 'workingDepartment',
            label: '作业部门',
            children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
            rules:
              name !== 'detail'
                ? [
                    { required: true, message: '请输入作业部门' },
                    { whitespace: true, message: '作业部门不能只为空格' },
                  ]
                : undefined,
            col: formCol,
          },
        ]),
    {
      name: 'constructionManager',
      label: '施工负责人',
      children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入施工负责人' },
              { whitespace: true, message: '施工负责人不能只为空格' },
            ]
          : undefined,
      col: formCol,
    },
    {
      name: 'agent',
      label: '待办人',
      children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入待办人' },
              { whitespace: true, message: '待办人不能只为空格' },
            ]
          : undefined,
      col: formCol,
    },
    {
      name: 'workingPersonnel',
      label: '作业人',
      children:
        name !== 'detail' ? (
          <Select placeholder="请输入" notFoundContent={null} showArrow={false} mode="tags" />
        ) : (
          <Text type="Select" mode="tags" />
        ),
      getValueFromEvent: getTagsSelectValueFromEvent,
      rules:
        name !== 'detail'
          ? [{ type: 'array', min: 1, required: true, message: '请输入作业人' }]
          : undefined,
      col: formCol,
    },
    {
      name: 'range',
      label: '作业期限',
      children:
        name !== 'detail' ? (
          <RangePicker
            className={styles.rangePicker}
            placeholder={timeRangePickerPlaceholder}
            format={minuteFormat}
            showTime
            separator="~"
            ranges={ranges}
            allowClear={false}
          />
        ) : (
          <Text type="RangePicker" format={minuteFormat} />
        ),
      rules: name !== 'detail' ? [{ required: true, message: '请选择作业期限' }] : undefined,
      col: formCol,
    },
    {
      name: 'planType',
      label: '计划性',
      children:
        name !== 'detail' ? (
          <Select placeholder="请选择" options={planTypeList} />
        ) : (
          <Text type="Select" options={planTypeList} />
        ),
      rules: name !== 'detail' ? [{ required: true, message: '请选择计划性' }] : undefined,
      col: formCol,
    },
    {
      name: 'approveStatus',
      label: '审批状态',
      children:
        name !== 'detail' ? (
          <Select placeholder="请选择" options={approveStatusList} />
        ) : (
          <Text type="Select" options={approveStatusList} />
        ),
      hidden: name !== 'detail',
      col: name !== 'detail' ? hiddenCol : formCol,
    },
    ...(values.approveStatus === approveStatusList[1].key ||
    values.approveStatus === approveStatusList[2].key
      ? [
          {
            name: 'signature',
            label: '手写签名',
            children: <Signature />,
            hidden: name !== 'detail',
            col: name !== 'detail' ? hiddenCol : formCol,
          },
        ]
      : []),
    ...(values.approveStatus === approveStatusList[1].key
      ? [
          {
            name: 'workingStatus',
            label: '作业状态',
            children:
              name !== 'detail' ? (
                <Select placeholder="请选择" options={workingStatusList} />
              ) : (
                <Text type="Select" options={workingStatusList} />
              ),
            rules: name !== 'detail' ? [{ required: true, message: '请选择作业状态' }] : undefined,
            col: formCol,
          },
        ]
      : []),
    ...(values.workingStatus === workingStatusList[2].key
      ? [
          {
            name: 'finishDate',
            label: '完工时间',
            children:
              name !== 'detail' ? (
                <DatePicker
                  className={styles.datePicker}
                  placeholder="请选择"
                  format={minuteFormat}
                  showTime
                  allowClear={false}
                />
              ) : (
                <Text type="DatePicker" format={dateFormat} />
              ),
            rules: name !== 'detail' ? [{ required: true, message: '请选择完工时间' }] : undefined,
            col: formCol,
          },
        ]
      : []),
    {
      name: 'riskFactors',
      label: '危险因素',
      children:
        name !== 'detail' ? (
          <TextArea
            placeholder="请输入"
            maxLength={200}
            autoSize={{
              minRows: 3,
            }}
          />
        ) : (
          <Text type="TextArea" />
        ),
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入危险因素' },
              { whitespace: true, message: '危险因素不能只为空格' },
            ]
          : undefined,
      wrapperCol: halfCol,
      col,
    },
    {
      name: 'safetyMeasures',
      label: '安全措施',
      children: (
        <SafetyMeasures
          list={safetyMeasuresMap[values.billType]}
          name={name}
          approved={values.approveStatus === approveStatusList[1].key}
        />
      ),
      rules:
        name !== 'detail'
          ? [{ type: 'array', required: true, validator: validateSafetyMeasures }]
          : undefined,
      col,
    },
    {
      name: 'certificatesFileList',
      label: '特殊作业操作证附件',
      children: name !== 'detail' ? <Upload /> : <Text type="Upload" />,
      wrapperCol: halfCol,
      col,
    },
    {
      name: 'applyFileList',
      label: '审批附件',
      children: name !== 'detail' ? <Upload /> : <Text type="Upload" />,
      wrapperCol: halfCol,
      col,
    },
    {
      name: 'isSetWarn',
      label: '是否设置作业区域',
      children:
        name !== 'detail' ? (
          <Radio.Group options={yesOrNo} />
        ) : (
          <Text type="Radio" options={yesOrNo} />
        ),
      col,
    },
  ],
  [typeList[2].key]: ({
    isUnit,
    values,
    name,
    companyList,
    loadingCompanyList,
    setCompanyPayload,
    onCompanySelectChange,
    personList,
    loadingPersonList,
    setPersonPayload,
    onPersonSelectChange,
    departmentTree,
    loadingDepartmentTree,
    contractorList,
    loadingContractorList,
    setContractorPayload,
    onContractorSelectChange,
    specialOperatorList,
    loadingSpecialOperatorList,
    setSpecialOperatorPayload,
    contractorPersonnelQualificationList,
    loadingContractorPersonnelQualificationList,
    setContractorPersonnelQualificationPayload,
    ranges,
  }) => [
    {
      name: 'company',
      label: '单位名称',
      children:
        name !== 'detail' ? (
          <PagingSelect
            options={companyList.list}
            loading={loadingCompanyList}
            disabled={name !== 'add'}
            hasMore={
              companyList.pagination &&
              companyList.pagination.total >
                companyList.pagination.pageNum * companyList.pagination.pageSize
            }
            onSearch={name => setCompanyPayload(payload => ({ ...payload, pageNum: 1, name }))}
            loadMore={() =>
              setCompanyPayload(payload => ({ ...payload, pageNum: payload.pageNum + 1 }))
            }
            onChange={onCompanySelectChange}
          />
        ) : (
          <Text type="Select" labelInValue />
        ),
      getValueFromEvent: getSelectValueFromEvent,
      rules: name !== 'detail' ? [{ required: true, message: '请选择单位名称' }] : undefined,
      hidden: isUnit,
      col: !isUnit ? formCol : hiddenCol,
    },
    {
      name: 'billType',
      label: '作业证名称',
      children:
        name !== 'detail' ? (
          <Select placeholder="请选择" options={typeList} disabled={name !== 'add'} />
        ) : (
          <Text type="Select" options={typeList} />
        ),
      rules: name !== 'detail' ? [{ required: true, message: '请选择作业证名称' }] : undefined,
      col: formCol,
    },
    {
      name: 'applyUser',
      label: '申请人',
      children:
        name !== 'detail' ? (
          <PagingSelect
            options={values.company ? personList.list : []}
            loading={loadingPersonList}
            hasMore={
              personList.pagination &&
              personList.pagination.total >
                personList.pagination.pageNum * personList.pagination.pageSize
            }
            onSearch={name => setPersonPayload(payload => ({ ...payload, pageNum: 1, name }))}
            loadMore={() =>
              setPersonPayload(payload => ({ ...payload, pageNum: payload.pageNum + 1 }))
            }
            onChange={onPersonSelectChange}
          />
        ) : (
          <Text type="Select" labelInValue />
        ),
      getValueFromEvent: getSelectValueFromEvent,
      rules: name !== 'detail' ? [{ required: true, message: '请选择申请人' }] : undefined,
      col: formCol,
    },
    {
      name: 'applyCompanyName',
      label: '申请单位',
      children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入申请单位' },
              { whitespace: true, message: '申请单位不能只为空格' },
            ]
          : undefined,
      col: formCol,
    },
    {
      name: 'applyDepartment',
      label: '申请部门',
      children:
        name !== 'detail' ? (
          <TreeSelect
            placeholder="请选择"
            treeData={values.company ? departmentTree : []}
            labelInValue
            notFoundContent={loadingDepartmentTree ? <Spin size="small" /> : undefined}
            showSearch
            treeNodeFilterProp="title"
          />
        ) : (
          <Text type="TreeSelect" labelInValue />
        ),
      getValueFromEvent: getSelectValueFromEvent,
      rules: name !== 'detail' ? [{ required: true, message: '请选择申请部门' }] : undefined,
      col: formCol,
    },
    {
      name: 'applyDate',
      label: '申请日期',
      children:
        name !== 'detail' ? (
          <DatePicker
            className={styles.datePicker}
            placeholder="请选择"
            format={dateFormat}
            allowClear={false}
          />
        ) : (
          <Text type="DatePicker" format={dateFormat} />
        ),
      rules: name !== 'detail' ? [{ required: true, message: '请选择申请日期' }] : undefined,
      col: formCol,
    },
    {
      name: 'billLevel',
      label: '作业证类型',
      children:
        name !== 'detail' ? (
          <Select placeholder="请选择" options={highWorkLevelList} />
        ) : (
          <Text type="Select" options={highWorkLevelList} />
        ),
      rules: name !== 'detail' ? [{ required: true, message: '请选择作业证类型' }] : undefined,
      col: formCol,
    },
    {
      name: 'billCode',
      label: '作业证编号',
      children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入作业证编号' },
              { whitespace: true, message: '作业证编号不能只为空格' },
            ]
          : undefined,
      col: formCol,
    },
    {
      name: 'height',
      label: '作业高度',
      children:
        name !== 'detail' ? (
          <Input placeholder="请输入" addonAfter="米" maxLength={50} />
        ) : (
          <Text addonAfter="米" />
        ),
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入作业高度' },
              { whitespace: true, message: '作业高度不能只为空格' },
            ]
          : undefined,
      col: formCol,
    },
    {
      name: 'address',
      label: '作业地点',
      children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入作业地点' },
              { whitespace: true, message: '作业地点不能只为空格' },
            ]
          : undefined,
      col: formCol,
    },
    {
      name: 'agent',
      label: '待办人',
      children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入待办人' },
              { whitespace: true, message: '待办人不能只为空格' },
            ]
          : undefined,
      col: formCol,
    },
    {
      name: 'workingCompanyType',
      label: '作业单位类型',
      children:
        name !== 'detail' ? (
          <Select placeholder="请选择" options={companyTypeList} />
        ) : (
          <Text type="Select" options={companyTypeList} />
        ),
      rules: name !== 'detail' ? [{ required: true, message: '请选择作业单位类型' }] : undefined,
      col: formCol,
    },
    ...(values.workingCompanyType === companyTypeList[1].key
      ? [
          {
            name: 'workingCompany',
            label: '作业单位名称',
            children:
              name !== 'detail' ? (
                <PagingSelect
                  options={values.company ? contractorList.list : []}
                  loading={loadingContractorList}
                  hasMore={
                    contractorList.pagination &&
                    contractorList.pagination.total >
                      contractorList.pagination.pageNum * contractorList.pagination.pageSize
                  }
                  onSearch={name =>
                    setContractorPayload(payload => ({ ...payload, pageNum: 1, name }))
                  }
                  loadMore={() =>
                    setContractorPayload(payload => ({ ...payload, pageNum: payload.pageNum + 1 }))
                  }
                  onChange={onContractorSelectChange}
                />
              ) : (
                <Text type="Select" labelInValue />
              ),
            getValueFromEvent: getSelectValueFromEvent,
            rules:
              name !== 'detail' ? [{ required: true, message: '请选择作业单位名称' }] : undefined,
            col: formCol,
          },
        ]
      : []),
    {
      name: 'workingManager',
      label: '作业负责人',
      children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入作业负责人' },
              { whitespace: true, message: '作业负责人不能只为空格' },
            ]
          : undefined,
      col: formCol,
    },
    ...(values.workingCompanyType === companyTypeList[0].key
      ? [
          {
            name: 'workingPersonnel',
            label: '作业人',
            children:
              name !== 'detail' ? (
                <PagingSelect
                  options={values.company ? specialOperatorList.list : []}
                  loading={loadingSpecialOperatorList}
                  hasMore={
                    specialOperatorList.pagination &&
                    specialOperatorList.pagination.total >
                      specialOperatorList.pagination.pageNum *
                        specialOperatorList.pagination.pageSize
                  }
                  onSearch={name =>
                    setSpecialOperatorPayload(payload => ({ ...payload, pageNum: 1, name }))
                  }
                  loadMore={() =>
                    setSpecialOperatorPayload(payload => ({
                      ...payload,
                      pageNum: payload.pageNum + 1,
                    }))
                  }
                  mode="multiple"
                />
              ) : (
                <Text type="Select" labelInValue mode="multiple" />
              ),
            getValueFromEvent: getMultipleSelectValueFromEvent,
            rules: name !== 'detail' ? [{ required: true, message: '请选择作业人' }] : undefined,
            col: formCol,
          },
        ]
      : [
          {
            name: 'workingPersonnel',
            label: '作业人',
            children:
              name !== 'detail' ? (
                <PagingSelect
                  options={values.workingCompany ? contractorPersonnelQualificationList.list : []}
                  loading={loadingContractorPersonnelQualificationList}
                  hasMore={
                    contractorPersonnelQualificationList.pagination &&
                    contractorPersonnelQualificationList.pagination.total >
                      contractorPersonnelQualificationList.pagination.pageNum *
                        contractorPersonnelQualificationList.pagination.pageSize
                  }
                  onSearch={name =>
                    setContractorPersonnelQualificationPayload(payload => ({
                      ...payload,
                      pageNum: 1,
                      name,
                    }))
                  }
                  loadMore={() =>
                    setContractorPersonnelQualificationPayload(payload => ({
                      ...payload,
                      pageNum: payload.pageNum + 1,
                    }))
                  }
                  mode="multiple"
                />
              ) : (
                <Text type="Select" labelInValue mode="multiple" />
              ),
            getValueFromEvent: getMultipleSelectValueFromEvent,
            rules: name !== 'detail' ? [{ required: true, message: '请选择作业人' }] : undefined,
            col: formCol,
          },
        ]),
    {
      name: 'supervisor',
      label: '监护人',
      children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入监护人' },
              { whitespace: true, message: '监护人不能只为空格' },
            ]
          : undefined,
      col: formCol,
    },
    {
      name: 'supervisorPosition',
      label: '监护人岗位',
      children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入监护人岗位' },
              { whitespace: true, message: '监护人岗位不能只为空格' },
            ]
          : undefined,
      col: formCol,
    },
    {
      name: 'range',
      label: '作业期限',
      children:
        name !== 'detail' ? (
          <RangePicker
            className={styles.rangePicker}
            placeholder={timeRangePickerPlaceholder}
            format={minuteFormat}
            showTime
            separator="~"
            ranges={ranges}
            allowClear={false}
          />
        ) : (
          <Text type="RangePicker" format={minuteFormat} />
        ),
      rules: name !== 'detail' ? [{ required: true, message: '请选择作业期限' }] : undefined,
      col: formCol,
    },
    {
      name: 'compilingPerson',
      label: '编制人',
      children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入编制人' },
              { whitespace: true, message: '编制人不能只为空格' },
            ]
          : undefined,
      col: formCol,
    },
    {
      name: 'workingProject',
      label: '施工项目',
      children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入施工项目' },
              { whitespace: true, message: '施工项目不能只为空格' },
            ]
          : undefined,
      col: formCol,
    },
    {
      name: 'safetyEducator',
      label: '实施安全教育人',
      children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入实施安全教育人' },
              { whitespace: true, message: '实施安全教育人不能只为空格' },
            ]
          : undefined,
      col: formCol,
    },
    {
      name: 'approveStatus',
      label: '审批状态',
      children:
        name !== 'detail' ? (
          <Select placeholder="请选择" options={approveStatusList} />
        ) : (
          <Text type="Select" options={approveStatusList} />
        ),
      hidden: name !== 'detail',
      col: name !== 'detail' ? hiddenCol : formCol,
    },
    ...(values.approveStatus === approveStatusList[1].key ||
    values.approveStatus === approveStatusList[2].key
      ? [
          {
            name: 'signature',
            label: '手写签名',
            children: <Signature />,
            hidden: name !== 'detail',
            col: name !== 'detail' ? hiddenCol : formCol,
          },
        ]
      : []),
    ...(values.approveStatus === approveStatusList[1].key
      ? [
          {
            name: 'workingStatus',
            label: '作业状态',
            children:
              name !== 'detail' ? (
                <Select placeholder="请选择" options={workingStatusList} />
              ) : (
                <Text type="Select" options={workingStatusList} />
              ),
            rules: name !== 'detail' ? [{ required: true, message: '请选择作业状态' }] : undefined,
            col: formCol,
          },
        ]
      : []),
    ...(values.workingStatus === workingStatusList[2].key
      ? [
          {
            name: 'finishDate',
            label: '完工时间',
            children:
              name !== 'detail' ? (
                <DatePicker
                  className={styles.datePicker}
                  placeholder="请选择"
                  format={minuteFormat}
                  showTime
                  allowClear={false}
                />
              ) : (
                <Text type="DatePicker" format={dateFormat} />
              ),
            rules: name !== 'detail' ? [{ required: true, message: '请选择完工时间' }] : undefined,
            col: formCol,
          },
        ]
      : []),
    {
      name: 'riskFactors',
      label: '危险因素',
      children:
        name !== 'detail' ? (
          <TextArea
            placeholder="请输入"
            maxLength={200}
            autoSize={{
              minRows: 3,
            }}
          />
        ) : (
          <Text type="TextArea" />
        ),
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入危险因素' },
              { whitespace: true, message: '危险因素不能只为空格' },
            ]
          : undefined,
      wrapperCol: halfCol,
      col,
    },
    {
      name: 'safetyMeasures',
      label: '安全措施',
      children: (
        <SafetyMeasures
          list={safetyMeasuresMap[values.billType]}
          name={name}
          approved={values.approveStatus === approveStatusList[1].key}
        />
      ),
      rules:
        name !== 'detail'
          ? [{ type: 'array', required: true, validator: validateSafetyMeasures }]
          : undefined,
      col,
    },
    {
      name: 'certificatesFileList',
      label: '特殊作业操作证附件',
      children: name !== 'detail' ? <Upload /> : <Text type="Upload" />,
      wrapperCol: halfCol,
      col,
    },
    {
      name: 'applyFileList',
      label: '审批附件',
      children: name !== 'detail' ? <Upload /> : <Text type="Upload" />,
      wrapperCol: halfCol,
      col,
    },
    {
      name: 'isSetWarn',
      label: '是否设置作业区域',
      children:
        name !== 'detail' ? (
          <Radio.Group options={yesOrNo} />
        ) : (
          <Text type="Radio" options={yesOrNo} />
        ),
      col,
    },
  ],
  [typeList[3].key]: ({
    isUnit,
    values,
    name,
    companyList,
    loadingCompanyList,
    setCompanyPayload,
    onCompanySelectChange,
    personList,
    loadingPersonList,
    setPersonPayload,
    onPersonSelectChange,
    departmentTree,
    loadingDepartmentTree,
    contractorList,
    loadingContractorList,
    setContractorPayload,
    onContractorSelectChange,
    specialOperatorList,
    loadingSpecialOperatorList,
    setSpecialOperatorPayload,
    contractorPersonnelQualificationList,
    loadingContractorPersonnelQualificationList,
    setContractorPersonnelQualificationPayload,
    ranges,
  }) => [
    {
      name: 'company',
      label: '单位名称',
      children:
        name !== 'detail' ? (
          <PagingSelect
            options={companyList.list}
            loading={loadingCompanyList}
            disabled={name !== 'add'}
            hasMore={
              companyList.pagination &&
              companyList.pagination.total >
                companyList.pagination.pageNum * companyList.pagination.pageSize
            }
            onSearch={name => setCompanyPayload(payload => ({ ...payload, pageNum: 1, name }))}
            loadMore={() =>
              setCompanyPayload(payload => ({ ...payload, pageNum: payload.pageNum + 1 }))
            }
            onChange={onCompanySelectChange}
          />
        ) : (
          <Text type="Select" labelInValue />
        ),
      getValueFromEvent: getSelectValueFromEvent,
      rules: name !== 'detail' ? [{ required: true, message: '请选择单位名称' }] : undefined,
      hidden: isUnit,
      col: !isUnit ? formCol : hiddenCol,
    },
    {
      name: 'billType',
      label: '作业证名称',
      children:
        name !== 'detail' ? (
          <Select placeholder="请选择" options={typeList} disabled={name !== 'add'} />
        ) : (
          <Text type="Select" options={typeList} />
        ),
      rules: name !== 'detail' ? [{ required: true, message: '请选择作业证名称' }] : undefined,
      col: formCol,
    },
    {
      name: 'applyUser',
      label: '申请人',
      children:
        name !== 'detail' ? (
          <PagingSelect
            options={values.company ? personList.list : []}
            loading={loadingPersonList}
            hasMore={
              personList.pagination &&
              personList.pagination.total >
                personList.pagination.pageNum * personList.pagination.pageSize
            }
            onSearch={name => setPersonPayload(payload => ({ ...payload, pageNum: 1, name }))}
            loadMore={() =>
              setPersonPayload(payload => ({ ...payload, pageNum: payload.pageNum + 1 }))
            }
            onChange={onPersonSelectChange}
          />
        ) : (
          <Text type="Select" labelInValue />
        ),
      getValueFromEvent: getSelectValueFromEvent,
      rules: name !== 'detail' ? [{ required: true, message: '请选择申请人' }] : undefined,
      col: formCol,
    },
    {
      name: 'applyCompanyName',
      label: '申请单位',
      children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入申请单位' },
              { whitespace: true, message: '申请单位不能只为空格' },
            ]
          : undefined,
      col: formCol,
    },
    {
      name: 'applyDepartment',
      label: '申请部门',
      children:
        name !== 'detail' ? (
          <TreeSelect
            placeholder="请选择"
            treeData={values.company ? departmentTree : []}
            labelInValue
            notFoundContent={loadingDepartmentTree ? <Spin size="small" /> : undefined}
            showSearch
            treeNodeFilterProp="title"
          />
        ) : (
          <Text type="TreeSelect" labelInValue />
        ),
      getValueFromEvent: getSelectValueFromEvent,
      rules: name !== 'detail' ? [{ required: true, message: '请选择申请部门' }] : undefined,
      col: formCol,
    },
    {
      name: 'applyDate',
      label: '申请日期',
      children:
        name !== 'detail' ? (
          <DatePicker
            className={styles.datePicker}
            placeholder="请选择"
            format={dateFormat}
            allowClear={false}
          />
        ) : (
          <Text type="DatePicker" format={dateFormat} />
        ),
      rules: name !== 'detail' ? [{ required: true, message: '请选择申请日期' }] : undefined,
      col: formCol,
    },
    {
      name: 'billLevel',
      label: '作业证类型',
      children:
        name !== 'detail' ? (
          <Select placeholder="请选择" options={hoistingWorkLevelList} />
        ) : (
          <Text type="Select" options={hoistingWorkLevelList} />
        ),
      rules: name !== 'detail' ? [{ required: true, message: '请选择作业证类型' }] : undefined,
      col: formCol,
    },
    {
      name: 'billCode',
      label: '作业证编号',
      children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入作业证编号' },
              { whitespace: true, message: '作业证编号不能只为空格' },
            ]
          : undefined,
      col: formCol,
    },
    {
      name: 'workingCompanyType',
      label: '作业单位类型',
      children:
        name !== 'detail' ? (
          <Select placeholder="请选择" options={companyTypeList} />
        ) : (
          <Text type="Select" options={companyTypeList} />
        ),
      rules: name !== 'detail' ? [{ required: true, message: '请选择作业单位类型' }] : undefined,
      col: formCol,
    },
    ...(values.workingCompanyType === companyTypeList[1].key
      ? [
          {
            name: 'workingCompany',
            label: '作业单位名称',
            children:
              name !== 'detail' ? (
                <PagingSelect
                  options={values.company ? contractorList.list : []}
                  loading={loadingContractorList}
                  hasMore={
                    contractorList.pagination &&
                    contractorList.pagination.total >
                      contractorList.pagination.pageNum * contractorList.pagination.pageSize
                  }
                  onSearch={name =>
                    setContractorPayload(payload => ({ ...payload, pageNum: 1, name }))
                  }
                  loadMore={() =>
                    setContractorPayload(payload => ({ ...payload, pageNum: payload.pageNum + 1 }))
                  }
                  onChange={onContractorSelectChange}
                />
              ) : (
                <Text type="Select" labelInValue />
              ),
            getValueFromEvent: getSelectValueFromEvent,
            rules:
              name !== 'detail' ? [{ required: true, message: '请选择作业单位名称' }] : undefined,
            col: formCol,
          },
        ]
      : []),
    {
      name: 'address',
      label: '吊装地点',
      children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入吊装地点' },
              { whitespace: true, message: '吊装地点不能只为空格' },
            ]
          : undefined,
      col: formCol,
    },
    {
      name: 'tool',
      label: '吊装工具',
      children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入吊装工具' },
              { whitespace: true, message: '吊装工具不能只为空格' },
            ]
          : undefined,
      col: formCol,
    },
    {
      name: 'workingContent',
      label: '吊装内容',
      children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入吊装内容' },
              { whitespace: true, message: '吊装内容不能只为空格' },
            ]
          : undefined,
      col: formCol,
    },
    ...(values.workingCompanyType === companyTypeList[0].key
      ? [
          {
            name: 'workingPersonnel',
            label: '吊装人员',
            children:
              name !== 'detail' ? (
                <PagingSelect
                  options={values.company ? specialOperatorList.list : []}
                  loading={loadingSpecialOperatorList}
                  hasMore={
                    specialOperatorList.pagination &&
                    specialOperatorList.pagination.total >
                      specialOperatorList.pagination.pageNum *
                        specialOperatorList.pagination.pageSize
                  }
                  onSearch={name =>
                    setSpecialOperatorPayload(payload => ({ ...payload, pageNum: 1, name }))
                  }
                  loadMore={() =>
                    setSpecialOperatorPayload(payload => ({
                      ...payload,
                      pageNum: payload.pageNum + 1,
                    }))
                  }
                  mode="multiple"
                />
              ) : (
                <Text type="Select" labelInValue mode="multiple" />
              ),
            getValueFromEvent: getMultipleSelectValueFromEvent,
            rules: name !== 'detail' ? [{ required: true, message: '请选择吊装人员' }] : undefined,
            col: formCol,
          },
        ]
      : [
          {
            name: 'workingPersonnel',
            label: '吊装人员',
            children:
              name !== 'detail' ? (
                <PagingSelect
                  options={values.workingCompany ? contractorPersonnelQualificationList.list : []}
                  loading={loadingContractorPersonnelQualificationList}
                  hasMore={
                    contractorPersonnelQualificationList.pagination &&
                    contractorPersonnelQualificationList.pagination.total >
                      contractorPersonnelQualificationList.pagination.pageNum *
                        contractorPersonnelQualificationList.pagination.pageSize
                  }
                  onSearch={name =>
                    setContractorPersonnelQualificationPayload(payload => ({
                      ...payload,
                      pageNum: 1,
                      name,
                    }))
                  }
                  loadMore={() =>
                    setContractorPersonnelQualificationPayload(payload => ({
                      ...payload,
                      pageNum: payload.pageNum + 1,
                    }))
                  }
                  mode="multiple"
                />
              ) : (
                <Text type="Select" labelInValue mode="multiple" />
              ),
            getValueFromEvent: getMultipleSelectValueFromEvent,
            rules: name !== 'detail' ? [{ required: true, message: '请选择吊装人员' }] : undefined,
            col: formCol,
          },
        ]),
    {
      name: 'workingProject',
      label: '施工项目',
      children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入施工项目' },
              { whitespace: true, message: '施工项目不能只为空格' },
            ]
          : undefined,
      col: formCol,
    },
    {
      name: 'supervisor',
      label: '安全监护人',
      children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入安全监护人' },
              { whitespace: true, message: '安全监护人不能只为空格' },
            ]
          : undefined,
      col: formCol,
    },
    {
      name: 'supervisorPosition',
      label: '监护人岗位',
      children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入监护人岗位' },
              { whitespace: true, message: '监护人岗位不能只为空格' },
            ]
          : undefined,
      col: formCol,
    },
    {
      name: 'range',
      label: '作业期限',
      children:
        name !== 'detail' ? (
          <RangePicker
            className={styles.rangePicker}
            placeholder={timeRangePickerPlaceholder}
            format={minuteFormat}
            showTime
            separator="~"
            ranges={ranges}
            allowClear={false}
          />
        ) : (
          <Text type="RangePicker" format={minuteFormat} />
        ),
      rules: name !== 'detail' ? [{ required: true, message: '请选择作业期限' }] : undefined,
      col: formCol,
    },
    {
      name: 'compilingPerson',
      label: '编制人',
      children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入编制人' },
              { whitespace: true, message: '编制人不能只为空格' },
            ]
          : undefined,
      col: formCol,
    },
    {
      name: 'safetyEducator',
      label: '实施安全教育人',
      children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入实施安全教育人' },
              { whitespace: true, message: '实施安全教育人不能只为空格' },
            ]
          : undefined,
      col: formCol,
    },
    {
      name: 'manager',
      label: '负责人',
      children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入负责人' },
              { whitespace: true, message: '负责人不能只为空格' },
            ]
          : undefined,
      col: formCol,
    },
    {
      name: 'agent',
      label: '待办人',
      children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入待办人' },
              { whitespace: true, message: '待办人不能只为空格' },
            ]
          : undefined,
      col: formCol,
    },
    {
      name: 'approveStatus',
      label: '审批状态',
      children:
        name !== 'detail' ? (
          <Select placeholder="请选择" options={approveStatusList} />
        ) : (
          <Text type="Select" options={approveStatusList} />
        ),
      hidden: name !== 'detail',
      col: name !== 'detail' ? hiddenCol : formCol,
    },
    ...(values.approveStatus === approveStatusList[1].key ||
    values.approveStatus === approveStatusList[2].key
      ? [
          {
            name: 'signature',
            label: '手写签名',
            children: <Signature />,
            hidden: name !== 'detail',
            col: name !== 'detail' ? hiddenCol : formCol,
          },
        ]
      : []),
    ...(values.approveStatus === approveStatusList[1].key
      ? [
          {
            name: 'workingStatus',
            label: '作业状态',
            children:
              name !== 'detail' ? (
                <Select placeholder="请选择" options={workingStatusList} />
              ) : (
                <Text type="Select" options={workingStatusList} />
              ),
            rules: name !== 'detail' ? [{ required: true, message: '请选择作业状态' }] : undefined,
            col: formCol,
          },
        ]
      : []),
    ...(values.workingStatus === workingStatusList[2].key
      ? [
          {
            name: 'finishDate',
            label: '完工时间',
            children:
              name !== 'detail' ? (
                <DatePicker
                  className={styles.datePicker}
                  placeholder="请选择"
                  format={minuteFormat}
                  showTime
                  allowClear={false}
                />
              ) : (
                <Text type="DatePicker" format={dateFormat} />
              ),
            rules: name !== 'detail' ? [{ required: true, message: '请选择完工时间' }] : undefined,
            col: formCol,
          },
        ]
      : []),
    {
      name: 'riskFactors',
      label: '危险因素',
      children:
        name !== 'detail' ? (
          <TextArea
            placeholder="请输入"
            maxLength={200}
            autoSize={{
              minRows: 3,
            }}
          />
        ) : (
          <Text type="TextArea" />
        ),
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入危险因素' },
              { whitespace: true, message: '危险因素不能只为空格' },
            ]
          : undefined,
      wrapperCol: halfCol,
      col,
    },
    {
      name: 'safetyMeasures',
      label: '安全措施',
      children: (
        <SafetyMeasures
          list={safetyMeasuresMap[values.billType]}
          name={name}
          approved={values.approveStatus === approveStatusList[1].key}
        />
      ),
      rules:
        name !== 'detail'
          ? [{ type: 'array', required: true, validator: validateSafetyMeasures }]
          : undefined,
      col,
    },
    {
      name: 'certificatesFileList',
      label: '特殊作业操作证附件',
      children: name !== 'detail' ? <Upload /> : <Text type="Upload" />,
      wrapperCol: halfCol,
      col,
    },
    {
      name: 'applyFileList',
      label: '审批附件',
      children: name !== 'detail' ? <Upload /> : <Text type="Upload" />,
      wrapperCol: halfCol,
      col,
    },
    {
      name: 'isSetWarn',
      label: '是否设置作业区域',
      children:
        name !== 'detail' ? (
          <Radio.Group options={yesOrNo} />
        ) : (
          <Text type="Radio" options={yesOrNo} />
        ),
      col,
    },
  ],
  [typeList[4].key]: ({
    isUnit,
    values,
    name,
    companyList,
    loadingCompanyList,
    setCompanyPayload,
    onCompanySelectChange,
    personList,
    loadingPersonList,
    setPersonPayload,
    onPersonSelectChange,
    departmentTree,
    loadingDepartmentTree,
    contractorList,
    loadingContractorList,
    setContractorPayload,
    onContractorSelectChange,
    specialOperatorList,
    loadingSpecialOperatorList,
    setSpecialOperatorPayload,
    contractorPersonnelQualificationList,
    loadingContractorPersonnelQualificationList,
    setContractorPersonnelQualificationPayload,
    ranges,
  }) => [
    {
      name: 'company',
      label: '单位名称',
      children:
        name !== 'detail' ? (
          <PagingSelect
            options={companyList.list}
            loading={loadingCompanyList}
            disabled={name !== 'add'}
            hasMore={
              companyList.pagination &&
              companyList.pagination.total >
                companyList.pagination.pageNum * companyList.pagination.pageSize
            }
            onSearch={name => setCompanyPayload(payload => ({ ...payload, pageNum: 1, name }))}
            loadMore={() =>
              setCompanyPayload(payload => ({ ...payload, pageNum: payload.pageNum + 1 }))
            }
            onChange={onCompanySelectChange}
          />
        ) : (
          <Text type="Select" labelInValue />
        ),
      getValueFromEvent: getSelectValueFromEvent,
      rules: name !== 'detail' ? [{ required: true, message: '请选择单位名称' }] : undefined,
      hidden: isUnit,
      col: !isUnit ? formCol : hiddenCol,
    },
    {
      name: 'billType',
      label: '作业证名称',
      children:
        name !== 'detail' ? (
          <Select placeholder="请选择" options={typeList} disabled={name !== 'add'} />
        ) : (
          <Text type="Select" options={typeList} />
        ),
      rules: name !== 'detail' ? [{ required: true, message: '请选择作业证名称' }] : undefined,
      col: formCol,
    },
    {
      name: 'applyUser',
      label: '申请人',
      children:
        name !== 'detail' ? (
          <PagingSelect
            options={values.company ? personList.list : []}
            loading={loadingPersonList}
            hasMore={
              personList.pagination &&
              personList.pagination.total >
                personList.pagination.pageNum * personList.pagination.pageSize
            }
            onSearch={name => setPersonPayload(payload => ({ ...payload, pageNum: 1, name }))}
            loadMore={() =>
              setPersonPayload(payload => ({ ...payload, pageNum: payload.pageNum + 1 }))
            }
            onChange={onPersonSelectChange}
          />
        ) : (
          <Text type="Select" labelInValue />
        ),
      getValueFromEvent: getSelectValueFromEvent,
      rules: name !== 'detail' ? [{ required: true, message: '请选择申请人' }] : undefined,
      col: formCol,
    },
    {
      name: 'applyCompanyName',
      label: '申请单位',
      children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入申请单位' },
              { whitespace: true, message: '申请单位不能只为空格' },
            ]
          : undefined,
      col: formCol,
    },
    {
      name: 'applyDepartment',
      label: '申请部门',
      children:
        name !== 'detail' ? (
          <TreeSelect
            placeholder="请选择"
            treeData={values.company ? departmentTree : []}
            labelInValue
            notFoundContent={loadingDepartmentTree ? <Spin size="small" /> : undefined}
            showSearch
            treeNodeFilterProp="title"
          />
        ) : (
          <Text type="TreeSelect" labelInValue />
        ),
      getValueFromEvent: getSelectValueFromEvent,
      rules: name !== 'detail' ? [{ required: true, message: '请选择申请部门' }] : undefined,
      col: formCol,
    },
    {
      name: 'applyDate',
      label: '申请日期',
      children:
        name !== 'detail' ? (
          <DatePicker
            className={styles.datePicker}
            placeholder="请选择"
            format={dateFormat}
            allowClear={false}
          />
        ) : (
          <Text type="DatePicker" format={dateFormat} />
        ),
      rules: name !== 'detail' ? [{ required: true, message: '请选择申请日期' }] : undefined,
      col: formCol,
    },
    {
      name: 'billCode',
      label: '作业证编号',
      children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入作业证编号' },
              { whitespace: true, message: '作业证编号不能只为空格' },
            ]
          : undefined,
      col: formCol,
    },
    {
      name: 'address',
      label: '用电区域',
      children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入用电区域' },
              { whitespace: true, message: '用电区域不能只为空格' },
            ]
          : undefined,
      col: formCol,
    },
    {
      name: 'workingContent',
      label: '临时用电原因',
      children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入临时用电原因' },
              { whitespace: true, message: '临时用电原因不能只为空格' },
            ]
          : undefined,
      col: formCol,
    },
    {
      name: 'workingProject',
      label: '施工项目',
      children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入施工项目' },
              { whitespace: true, message: '施工项目不能只为空格' },
            ]
          : undefined,
      col: formCol,
    },
    {
      name: 'range',
      label: '作业期限',
      children:
        name !== 'detail' ? (
          <RangePicker
            className={styles.rangePicker}
            placeholder={timeRangePickerPlaceholder}
            format={minuteFormat}
            showTime
            separator="~"
            ranges={ranges}
            allowClear={false}
          />
        ) : (
          <Text type="RangePicker" format={minuteFormat} />
        ),
      rules: name !== 'detail' ? [{ required: true, message: '请选择作业期限' }] : undefined,
      col: formCol,
    },
    {
      name: 'workingCompanyType',
      label: '作业单位类型',
      children:
        name !== 'detail' ? (
          <Select placeholder="请选择" options={companyTypeList} />
        ) : (
          <Text type="Select" options={companyTypeList} />
        ),
      rules: name !== 'detail' ? [{ required: true, message: '请选择作业单位类型' }] : undefined,
      col: formCol,
    },
    ...(values.workingCompanyType === companyTypeList[1].key
      ? [
          {
            name: 'workingCompany',
            label: '作业单位名称',
            children:
              name !== 'detail' ? (
                <PagingSelect
                  options={values.company ? contractorList.list : []}
                  loading={loadingContractorList}
                  hasMore={
                    contractorList.pagination &&
                    contractorList.pagination.total >
                      contractorList.pagination.pageNum * contractorList.pagination.pageSize
                  }
                  onSearch={name =>
                    setContractorPayload(payload => ({ ...payload, pageNum: 1, name }))
                  }
                  loadMore={() =>
                    setContractorPayload(payload => ({ ...payload, pageNum: payload.pageNum + 1 }))
                  }
                  onChange={onContractorSelectChange}
                />
              ) : (
                <Text type="Select" labelInValue />
              ),
            getValueFromEvent: getSelectValueFromEvent,
            rules:
              name !== 'detail' ? [{ required: true, message: '请选择作业单位名称' }] : undefined,
            col: formCol,
          },
        ]
      : []),
    {
      name: 'workingManager',
      label: '作业负责人',
      children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入作业负责人' },
              { whitespace: true, message: '作业负责人不能只为空格' },
            ]
          : undefined,
      col: formCol,
    },
    ...(values.workingCompanyType === companyTypeList[0].key
      ? [
          {
            name: 'workingPersonnel',
            label: '作业人',
            children:
              name !== 'detail' ? (
                <PagingSelect
                  options={values.company ? specialOperatorList.list : []}
                  loading={loadingSpecialOperatorList}
                  hasMore={
                    specialOperatorList.pagination &&
                    specialOperatorList.pagination.total >
                      specialOperatorList.pagination.pageNum *
                        specialOperatorList.pagination.pageSize
                  }
                  onSearch={name =>
                    setSpecialOperatorPayload(payload => ({ ...payload, pageNum: 1, name }))
                  }
                  loadMore={() =>
                    setSpecialOperatorPayload(payload => ({
                      ...payload,
                      pageNum: payload.pageNum + 1,
                    }))
                  }
                  mode="multiple"
                />
              ) : (
                <Text type="Select" labelInValue mode="multiple" />
              ),
            getValueFromEvent: getMultipleSelectValueFromEvent,
            rules: name !== 'detail' ? [{ required: true, message: '请选择作业人' }] : undefined,
            col: formCol,
          },
        ]
      : [
          {
            name: 'workingPersonnel',
            label: '作业人',
            children:
              name !== 'detail' ? (
                <PagingSelect
                  options={values.workingCompany ? contractorPersonnelQualificationList.list : []}
                  loading={loadingContractorPersonnelQualificationList}
                  hasMore={
                    contractorPersonnelQualificationList.pagination &&
                    contractorPersonnelQualificationList.pagination.total >
                      contractorPersonnelQualificationList.pagination.pageNum *
                        contractorPersonnelQualificationList.pagination.pageSize
                  }
                  onSearch={name =>
                    setContractorPersonnelQualificationPayload(payload => ({
                      ...payload,
                      pageNum: 1,
                      name,
                    }))
                  }
                  loadMore={() =>
                    setContractorPersonnelQualificationPayload(payload => ({
                      ...payload,
                      pageNum: payload.pageNum + 1,
                    }))
                  }
                  mode="multiple"
                />
              ) : (
                <Text type="Select" labelInValue mode="multiple" />
              ),
            getValueFromEvent: getMultipleSelectValueFromEvent,
            rules: name !== 'detail' ? [{ required: true, message: '请选择作业人' }] : undefined,
            col: formCol,
          },
        ]),
    {
      name: 'compilingPerson',
      label: '编制人',
      children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入编制人' },
              { whitespace: true, message: '编制人不能只为空格' },
            ]
          : undefined,
      col: formCol,
    },
    {
      name: 'agent',
      label: '待办人',
      children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入待办人' },
              { whitespace: true, message: '待办人不能只为空格' },
            ]
          : undefined,
      col: formCol,
    },
    {
      name: 'supervisor',
      label: '作业监护人',
      children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入作业监护人' },
              { whitespace: true, message: '作业监护人不能只为空格' },
            ]
          : undefined,
      col: formCol,
    },
    {
      name: 'supervisorPosition',
      label: '监护人岗位',
      children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入监护人岗位' },
              { whitespace: true, message: '监护人岗位不能只为空格' },
            ]
          : undefined,
      col: formCol,
    },
    {
      name: 'planType',
      label: '计划性',
      children:
        name !== 'detail' ? (
          <Select placeholder="请选择" options={planTypeList} />
        ) : (
          <Text type="Select" options={planTypeList} />
        ),
      rules: name !== 'detail' ? [{ required: true, message: '请选择计划性' }] : undefined,
      col: formCol,
    },
    {
      name: 'safetyEducator',
      label: '实施安全教育人',
      children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入实施安全教育人' },
              { whitespace: true, message: '实施安全教育人不能只为空格' },
            ]
          : undefined,
      col: formCol,
    },
    {
      name: 'approveStatus',
      label: '审批状态',
      children:
        name !== 'detail' ? (
          <Select placeholder="请选择" options={approveStatusList} />
        ) : (
          <Text type="Select" options={approveStatusList} />
        ),
      hidden: name !== 'detail',
      col: name !== 'detail' ? hiddenCol : formCol,
    },
    ...(values.approveStatus === approveStatusList[1].key ||
    values.approveStatus === approveStatusList[2].key
      ? [
          {
            name: 'signature',
            label: '手写签名',
            children: <Signature />,
            hidden: name !== 'detail',
            col: name !== 'detail' ? hiddenCol : formCol,
          },
        ]
      : []),
    ...(values.approveStatus === approveStatusList[1].key
      ? [
          {
            name: 'workingStatus',
            label: '作业状态',
            children:
              name !== 'detail' ? (
                <Select placeholder="请选择" options={workingStatusList} />
              ) : (
                <Text type="Select" options={workingStatusList} />
              ),
            rules: name !== 'detail' ? [{ required: true, message: '请选择作业状态' }] : undefined,
            col: formCol,
          },
        ]
      : []),
    ...(values.workingStatus === workingStatusList[2].key
      ? [
          {
            name: 'finishDate',
            label: '完工时间',
            children:
              name !== 'detail' ? (
                <DatePicker
                  className={styles.datePicker}
                  placeholder="请选择"
                  format={minuteFormat}
                  showTime
                  allowClear={false}
                />
              ) : (
                <Text type="DatePicker" format={dateFormat} />
              ),
            rules: name !== 'detail' ? [{ required: true, message: '请选择完工时间' }] : undefined,
            col: formCol,
          },
        ]
      : []),
    {
      name: 'riskFactors',
      label: '危险因素',
      children:
        name !== 'detail' ? (
          <TextArea
            placeholder="请输入"
            maxLength={200}
            autoSize={{
              minRows: 3,
            }}
          />
        ) : (
          <Text type="TextArea" />
        ),
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入危险因素' },
              { whitespace: true, message: '危险因素不能只为空格' },
            ]
          : undefined,
      wrapperCol: halfCol,
      col,
    },
    {
      name: 'safetyMeasures',
      label: '安全措施',
      children: (
        <SafetyMeasures
          list={safetyMeasuresMap[values.billType]}
          name={name}
          approved={values.approveStatus === approveStatusList[1].key}
        />
      ),
      rules:
        name !== 'detail'
          ? [{ type: 'array', required: true, validator: validateSafetyMeasures }]
          : undefined,
      col,
    },
    {
      name: 'certificatesFileList',
      label: '特殊作业操作证附件',
      children: name !== 'detail' ? <Upload /> : <Text type="Upload" />,
      wrapperCol: halfCol,
      col,
    },
    {
      name: 'applyFileList',
      label: '审批附件',
      children: name !== 'detail' ? <Upload /> : <Text type="Upload" />,
      wrapperCol: halfCol,
      col,
    },
    {
      name: 'isSetWarn',
      label: '是否设置作业区域',
      children:
        name !== 'detail' ? (
          <Radio.Group options={yesOrNo} />
        ) : (
          <Text type="Radio" options={yesOrNo} />
        ),
      col,
    },
  ],
  [typeList[5].key]: ({
    isUnit,
    values,
    name,
    companyList,
    loadingCompanyList,
    setCompanyPayload,
    onCompanySelectChange,
    personList,
    loadingPersonList,
    setPersonPayload,
    onPersonSelectChange,
    departmentTree,
    loadingDepartmentTree,
    ranges,
  }) => [
    {
      name: 'company',
      label: '单位名称',
      children:
        name !== 'detail' ? (
          <PagingSelect
            options={companyList.list}
            loading={loadingCompanyList}
            disabled={name !== 'add'}
            hasMore={
              companyList.pagination &&
              companyList.pagination.total >
                companyList.pagination.pageNum * companyList.pagination.pageSize
            }
            onSearch={name => setCompanyPayload(payload => ({ ...payload, pageNum: 1, name }))}
            loadMore={() =>
              setCompanyPayload(payload => ({ ...payload, pageNum: payload.pageNum + 1 }))
            }
            onChange={onCompanySelectChange}
          />
        ) : (
          <Text type="Select" labelInValue />
        ),
      getValueFromEvent: getSelectValueFromEvent,
      rules: name !== 'detail' ? [{ required: true, message: '请选择单位名称' }] : undefined,
      hidden: isUnit,
      col: !isUnit ? formCol : hiddenCol,
    },
    {
      name: 'billType',
      label: '作业证名称',
      children:
        name !== 'detail' ? (
          <Select placeholder="请选择" options={typeList} disabled={name !== 'add'} />
        ) : (
          <Text type="Select" options={typeList} />
        ),
      rules: name !== 'detail' ? [{ required: true, message: '请选择作业证名称' }] : undefined,
      col: formCol,
    },
    {
      name: 'applyUser',
      label: '申请人',
      children:
        name !== 'detail' ? (
          <PagingSelect
            options={values.company ? personList.list : []}
            loading={loadingPersonList}
            hasMore={
              personList.pagination &&
              personList.pagination.total >
                personList.pagination.pageNum * personList.pagination.pageSize
            }
            onSearch={name => setPersonPayload(payload => ({ ...payload, pageNum: 1, name }))}
            loadMore={() =>
              setPersonPayload(payload => ({ ...payload, pageNum: payload.pageNum + 1 }))
            }
            onChange={onPersonSelectChange}
          />
        ) : (
          <Text type="Select" labelInValue />
        ),
      getValueFromEvent: getSelectValueFromEvent,
      rules: name !== 'detail' ? [{ required: true, message: '请选择申请人' }] : undefined,
      col: formCol,
    },
    {
      name: 'applyCompanyName',
      label: '申请单位',
      children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入申请单位' },
              { whitespace: true, message: '申请单位不能只为空格' },
            ]
          : undefined,
      col: formCol,
    },
    {
      name: 'applyDepartment',
      label: '申请部门',
      children:
        name !== 'detail' ? (
          <TreeSelect
            placeholder="请选择"
            treeData={values.company ? departmentTree : []}
            labelInValue
            notFoundContent={loadingDepartmentTree ? <Spin size="small" /> : undefined}
            showSearch
            treeNodeFilterProp="title"
          />
        ) : (
          <Text type="TreeSelect" labelInValue />
        ),
      getValueFromEvent: getSelectValueFromEvent,
      rules: name !== 'detail' ? [{ required: true, message: '请选择申请部门' }] : undefined,
      col: formCol,
    },
    {
      name: 'applyDate',
      label: '申请日期',
      children:
        name !== 'detail' ? (
          <DatePicker
            className={styles.datePicker}
            placeholder="请选择"
            format={dateFormat}
            allowClear={false}
          />
        ) : (
          <Text type="DatePicker" format={dateFormat} />
        ),
      rules: name !== 'detail' ? [{ required: true, message: '请选择申请日期' }] : undefined,
      col: formCol,
    },
    {
      name: 'billCode',
      label: '作业证编号',
      children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入作业证编号' },
              { whitespace: true, message: '作业证编号不能只为空格' },
            ]
          : undefined,
      col: formCol,
    },
    {
      name: 'manager',
      label: '检修负责人',
      children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入检修负责人' },
              { whitespace: true, message: '检修负责人不能只为空格' },
            ]
          : undefined,
      col: formCol,
    },
    {
      name: 'range',
      label: '检修期限',
      children:
        name !== 'detail' ? (
          <RangePicker
            className={styles.rangePicker}
            placeholder={timeRangePickerPlaceholder}
            format={minuteFormat}
            showTime
            separator="~"
            ranges={ranges}
            allowClear={false}
          />
        ) : (
          <Text type="RangePicker" format={minuteFormat} />
        ),
      rules: name !== 'detail' ? [{ required: true, message: '请选择检修期限' }] : undefined,
      col: formCol,
    },
    {
      name: 'agent',
      label: '待办人',
      children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入待办人' },
              { whitespace: true, message: '待办人不能只为空格' },
            ]
          : undefined,
      col: formCol,
    },
    {
      name: 'workingCompanyType',
      label: '维修单位类型',
      children:
        name !== 'detail' ? (
          <Select placeholder="请选择" options={companyTypeList} />
        ) : (
          <Text type="Select" options={companyTypeList} />
        ),
      rules: name !== 'detail' ? [{ required: true, message: '请选择维修单位类型' }] : undefined,
      col: formCol,
    },
    ...(values.workingCompanyType === companyTypeList[1].key
      ? [
          {
            name: 'workingCompanyName',
            label: '维修单位名称',
            children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
            rules:
              name !== 'detail'
                ? [
                    { required: true, message: '请输入维修单位名称' },
                    { whitespace: true, message: '维修单位名称不能只为空格' },
                  ]
                : undefined,
            col: formCol,
          },
        ]
      : []),
    {
      name: 'workingProject',
      label: '维修项目名称',
      children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入维修项目名称' },
              { whitespace: true, message: '维修项目名称不能只为空格' },
            ]
          : undefined,
      col: formCol,
    },
    {
      name: 'workingManager',
      label: '维修负责人',
      children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入维修负责人' },
              { whitespace: true, message: '维修负责人不能只为空格' },
            ]
          : undefined,
      col: formCol,
    },
    {
      name: 'address',
      label: '维修地点',
      children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入维修地点' },
              { whitespace: true, message: '维修地点不能只为空格' },
            ]
          : undefined,
      col: formCol,
    },
    {
      name: 'workingContent',
      label: '维修内容',
      children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入维修内容' },
              { whitespace: true, message: '维修内容不能只为空格' },
            ]
          : undefined,
      col: formCol,
    },
    {
      name: 'supervisor',
      label: '监护人',
      children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入监护人' },
              { whitespace: true, message: '监护人不能只为空格' },
            ]
          : undefined,
      col: formCol,
    },
    {
      name: 'planType',
      label: '计划性',
      children:
        name !== 'detail' ? (
          <Select placeholder="请选择" options={planTypeList} />
        ) : (
          <Text type="Select" options={planTypeList} />
        ),
      rules: name !== 'detail' ? [{ required: true, message: '请选择计划性' }] : undefined,
      col: formCol,
    },
    {
      name: 'approveStatus',
      label: '审批状态',
      children:
        name !== 'detail' ? (
          <Select placeholder="请选择" options={approveStatusList} />
        ) : (
          <Text type="Select" options={approveStatusList} />
        ),
      hidden: name !== 'detail',
      col: name !== 'detail' ? hiddenCol : formCol,
    },
    ...(values.approveStatus === approveStatusList[1].key ||
    values.approveStatus === approveStatusList[2].key
      ? [
          {
            name: 'signature',
            label: '手写签名',
            children: <Signature />,
            hidden: name !== 'detail',
            col: name !== 'detail' ? hiddenCol : formCol,
          },
        ]
      : []),
    ...(values.approveStatus === approveStatusList[1].key
      ? [
          {
            name: 'workingStatus',
            label: '作业状态',
            children:
              name !== 'detail' ? (
                <Select placeholder="请选择" options={workingStatusList} />
              ) : (
                <Text type="Select" options={workingStatusList} />
              ),
            rules: name !== 'detail' ? [{ required: true, message: '请选择作业状态' }] : undefined,
            col: formCol,
          },
        ]
      : []),
    ...(values.workingStatus === workingStatusList[2].key
      ? [
          {
            name: 'finishDate',
            label: '完工时间',
            children:
              name !== 'detail' ? (
                <DatePicker
                  className={styles.datePicker}
                  placeholder="请选择"
                  format={minuteFormat}
                  showTime
                  allowClear={false}
                />
              ) : (
                <Text type="DatePicker" format={dateFormat} />
              ),
            rules: name !== 'detail' ? [{ required: true, message: '请选择完工时间' }] : undefined,
            col: formCol,
          },
        ]
      : []),
    {
      name: 'hazardIdentification',
      label: '危害辨识',
      children:
        name !== 'detail' ? (
          <TextArea
            placeholder="请输入"
            maxLength={200}
            autoSize={{
              minRows: 3,
            }}
          />
        ) : (
          <Text type="TextArea" />
        ),
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入危害辨识' },
              { whitespace: true, message: '危害辨识不能只为空格' },
            ]
          : undefined,
      wrapperCol: halfCol,
      col,
    },
    {
      name: 'riskFactors',
      label: '危险因素',
      children:
        name !== 'detail' ? (
          <TextArea
            placeholder="请输入"
            maxLength={200}
            autoSize={{
              minRows: 3,
            }}
          />
        ) : (
          <Text type="TextArea" />
        ),
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入危险因素' },
              { whitespace: true, message: '危险因素不能只为空格' },
            ]
          : undefined,
      wrapperCol: halfCol,
      col,
    },
    {
      name: 'safetyMeasures',
      label: '安全措施',
      children: (
        <SafetyMeasures
          list={safetyMeasuresMap[values.billType]}
          name={name}
          approved={values.approveStatus === approveStatusList[1].key}
        />
      ),
      rules:
        name !== 'detail'
          ? [{ type: 'array', required: true, validator: validateSafetyMeasures }]
          : undefined,
      col,
    },
    {
      name: 'certificatesFileList',
      label: '特殊作业操作证附件',
      children: name !== 'detail' ? <Upload /> : <Text type="Upload" />,
      wrapperCol: halfCol,
      col,
    },
    {
      name: 'applyFileList',
      label: '审批附件',
      children: name !== 'detail' ? <Upload /> : <Text type="Upload" />,
      wrapperCol: halfCol,
      col,
    },
    {
      name: 'isSetWarn',
      label: '是否设置作业区域',
      children:
        name !== 'detail' ? (
          <Radio.Group options={yesOrNo} />
        ) : (
          <Text type="Radio" options={yesOrNo} />
        ),
      col,
    },
  ],
  [typeList[6].key]: ({
    isUnit,
    values,
    name,
    companyList,
    loadingCompanyList,
    setCompanyPayload,
    onCompanySelectChange,
    personList,
    loadingPersonList,
    setPersonPayload,
    onPersonSelectChange,
    departmentTree,
    loadingDepartmentTree,
    ranges,
  }) => [
    {
      name: 'company',
      label: '单位名称',
      children:
        name !== 'detail' ? (
          <PagingSelect
            options={companyList.list}
            loading={loadingCompanyList}
            disabled={name !== 'add'}
            hasMore={
              companyList.pagination &&
              companyList.pagination.total >
                companyList.pagination.pageNum * companyList.pagination.pageSize
            }
            onSearch={name => setCompanyPayload(payload => ({ ...payload, pageNum: 1, name }))}
            loadMore={() =>
              setCompanyPayload(payload => ({ ...payload, pageNum: payload.pageNum + 1 }))
            }
            onChange={onCompanySelectChange}
          />
        ) : (
          <Text type="Select" labelInValue />
        ),
      getValueFromEvent: getSelectValueFromEvent,
      rules: name !== 'detail' ? [{ required: true, message: '请选择单位名称' }] : undefined,
      hidden: isUnit,
      col: !isUnit ? formCol : hiddenCol,
    },
    {
      name: 'billType',
      label: '作业证名称',
      children:
        name !== 'detail' ? (
          <Select placeholder="请选择" options={typeList} disabled={name !== 'add'} />
        ) : (
          <Text type="Select" options={typeList} />
        ),
      rules: name !== 'detail' ? [{ required: true, message: '请选择作业证名称' }] : undefined,
      col: formCol,
    },
    {
      name: 'billLevel',
      label: '盲板作业类型',
      children:
        name !== 'detail' ? (
          <Select placeholder="请选择" options={blindPlateWorkLevelList} />
        ) : (
          <Text type="Select" options={blindPlateWorkLevelList} />
        ),
      rules: name !== 'detail' ? [{ required: true, message: '请选择盲板作业类型' }] : undefined,
      col: formCol,
    },
    {
      name: 'applyUser',
      label: '申请人',
      children:
        name !== 'detail' ? (
          <PagingSelect
            options={values.company ? personList.list : []}
            loading={loadingPersonList}
            hasMore={
              personList.pagination &&
              personList.pagination.total >
                personList.pagination.pageNum * personList.pagination.pageSize
            }
            onSearch={name => setPersonPayload(payload => ({ ...payload, pageNum: 1, name }))}
            loadMore={() =>
              setPersonPayload(payload => ({ ...payload, pageNum: payload.pageNum + 1 }))
            }
            onChange={onPersonSelectChange}
          />
        ) : (
          <Text type="Select" labelInValue />
        ),
      getValueFromEvent: getSelectValueFromEvent,
      rules: name !== 'detail' ? [{ required: true, message: '请选择申请人' }] : undefined,
      col: formCol,
    },
    {
      name: 'applyCompanyName',
      label: '申请单位',
      children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入申请单位' },
              { whitespace: true, message: '申请单位不能只为空格' },
            ]
          : undefined,
      col: formCol,
    },
    {
      name: 'applyDepartment',
      label: '申请部门',
      children:
        name !== 'detail' ? (
          <TreeSelect
            placeholder="请选择"
            treeData={values.company ? departmentTree : []}
            labelInValue
            notFoundContent={loadingDepartmentTree ? <Spin size="small" /> : undefined}
            showSearch
            treeNodeFilterProp="title"
          />
        ) : (
          <Text type="TreeSelect" labelInValue />
        ),
      getValueFromEvent: getSelectValueFromEvent,
      rules: name !== 'detail' ? [{ required: true, message: '请选择申请部门' }] : undefined,
      col: formCol,
    },
    {
      name: 'applyDate',
      label: '申请日期',
      children:
        name !== 'detail' ? (
          <DatePicker
            className={styles.datePicker}
            placeholder="请选择"
            format={dateFormat}
            allowClear={false}
          />
        ) : (
          <Text type="DatePicker" format={dateFormat} />
        ),
      rules: name !== 'detail' ? [{ required: true, message: '请选择申请日期' }] : undefined,
      col: formCol,
    },
    {
      name: 'range',
      label: '作业期限',
      children:
        name !== 'detail' ? (
          <RangePicker
            className={styles.rangePicker}
            placeholder={timeRangePickerPlaceholder}
            format={minuteFormat}
            showTime
            separator="~"
            ranges={ranges}
            allowClear={false}
          />
        ) : (
          <Text type="RangePicker" format={minuteFormat} />
        ),
      rules: name !== 'detail' ? [{ required: true, message: '请选择作业期限' }] : undefined,
      col: formCol,
    },
    {
      name: 'billCode',
      label: '作业证编号',
      children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入作业证编号' },
              { whitespace: true, message: '作业证编号不能只为空格' },
            ]
          : undefined,
      col: formCol,
    },
    {
      name: 'equipmentPipelineName',
      label: '设备管线名称',
      children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入设备管线名称' },
              { whitespace: true, message: '设备管线名称不能只为空格' },
            ]
          : undefined,
      col: formCol,
    },
    {
      name: 'agent',
      label: '待办人',
      children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入待办人' },
              { whitespace: true, message: '待办人不能只为空格' },
            ]
          : undefined,
      col: formCol,
    },
    {
      name: 'supervisor',
      label: '监护人',
      children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入监护人' },
              { whitespace: true, message: '监护人不能只为空格' },
            ]
          : undefined,
      col: formCol,
    },
    {
      name: 'supervisorPosition',
      label: '监护人岗位',
      children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入监护人岗位' },
              { whitespace: true, message: '监护人岗位不能只为空格' },
            ]
          : undefined,
      col: formCol,
    },
    {
      name: 'mainMedium',
      label: '主要介质',
      children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入主要介质' },
              { whitespace: true, message: '主要介质不能只为空格' },
            ]
          : undefined,
      col: formCol,
    },
    {
      name: 'temperature',
      label: '温度',
      children:
        name !== 'detail' ? (
          <Input placeholder="请输入" addonAfter="℃" maxLength={50} />
        ) : (
          <Text addonAfter="℃" />
        ),
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入温度' },
              { whitespace: true, message: '温度不能只为空格' },
            ]
          : undefined,
      col: formCol,
    },
    {
      name: 'pressure',
      label: '压力',
      children:
        name !== 'detail' ? (
          <Input placeholder="请输入" addonAfter="Pa" maxLength={50} />
        ) : (
          <Text addonAfter="Pa" />
        ),
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入压力' },
              { whitespace: true, message: '压力不能只为空格' },
            ]
          : undefined,
      col: formCol,
    },
    {
      name: 'material',
      label: '盲板材质',
      children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入盲板材质' },
              { whitespace: true, message: '盲板材质不能只为空格' },
            ]
          : undefined,
      col: formCol,
    },
    {
      name: 'specs',
      label: '盲板规格',
      children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入盲板规格' },
              { whitespace: true, message: '盲板规格不能只为空格' },
            ]
          : undefined,
      col: formCol,
    },
    {
      name: 'location',
      label: '盲板位置',
      children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入盲板位置' },
              { whitespace: true, message: '盲板位置不能只为空格' },
            ]
          : undefined,
      col: formCol,
    },
    {
      name: 'blindPlateCode',
      label: '盲板编号',
      children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入盲板编号' },
              { whitespace: true, message: '盲板编号不能只为空格' },
            ]
          : undefined,
      col: formCol,
    },
    {
      name: 'constructionManager',
      label: values.billLevel === blindPlateWorkLevelList[0].key ? '装盲板负责人' : '拆盲板负责人',
      children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
      rules:
        name !== 'detail'
          ? [
              {
                required: true,
                message: `请输入${
                  values.billLevel === blindPlateWorkLevelList[0].key
                    ? '装盲板负责人'
                    : '拆盲板负责人'
                }`,
              },
              {
                whitespace: true,
                message: `${
                  values.billLevel === blindPlateWorkLevelList[0].key
                    ? '装盲板负责人'
                    : '拆盲板负责人'
                }不能只为空格`,
              },
            ]
          : undefined,
      col: formCol,
    },
    {
      name: 'recoveryDate',
      label: values.billLevel === blindPlateWorkLevelList[0].key ? '装盲板时间' : '拆盲板时间',
      children:
        name !== 'detail' ? (
          <DatePicker
            className={styles.datePicker}
            placeholder="请选择"
            format={minuteFormat}
            showTime
            allowClear={false}
          />
        ) : (
          <Text type="DatePicker" format={minuteFormat} />
        ),
      rules:
        name !== 'detail'
          ? [
              {
                required: true,
                message: `请选择${
                  values.billLevel === blindPlateWorkLevelList[0].key ? '装盲板时间' : '拆盲板时间'
                }`,
              },
            ]
          : undefined,
      col: formCol,
    },
    {
      name: 'workingProject',
      label: '施工项目',
      children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入施工项目' },
              { whitespace: true, message: '施工项目不能只为空格' },
            ]
          : undefined,
      col: formCol,
    },
    {
      name: 'compilingPerson',
      label: '编制人',
      children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入编制人' },
              { whitespace: true, message: '编制人不能只为空格' },
            ]
          : undefined,
      col: formCol,
    },
    {
      name: 'safetyEducator',
      label: '实施安全教育人',
      children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入实施安全教育人' },
              { whitespace: true, message: '实施安全教育人不能只为空格' },
            ]
          : undefined,
      col: formCol,
    },
    {
      name: 'planType',
      label: '计划性',
      children:
        name !== 'detail' ? (
          <Select placeholder="请选择" options={planTypeList} />
        ) : (
          <Text type="Select" options={planTypeList} />
        ),
      rules: name !== 'detail' ? [{ required: true, message: '请选择计划性' }] : undefined,
      col: formCol,
    },
    {
      name: 'approveStatus',
      label: '审批状态',
      children:
        name !== 'detail' ? (
          <Select placeholder="请选择" options={approveStatusList} />
        ) : (
          <Text type="Select" options={approveStatusList} />
        ),
      hidden: name !== 'detail',
      col: name !== 'detail' ? hiddenCol : formCol,
    },
    ...(values.approveStatus === approveStatusList[1].key ||
    values.approveStatus === approveStatusList[2].key
      ? [
          {
            name: 'signature',
            label: '手写签名',
            children: <Signature />,
            hidden: name !== 'detail',
            col: name !== 'detail' ? hiddenCol : formCol,
          },
        ]
      : []),
    ...(values.approveStatus === approveStatusList[1].key
      ? [
          {
            name: 'workingStatus',
            label: '作业状态',
            children:
              name !== 'detail' ? (
                <Select placeholder="请选择" options={workingStatusList} />
              ) : (
                <Text type="Select" options={workingStatusList} />
              ),
            rules: name !== 'detail' ? [{ required: true, message: '请选择作业状态' }] : undefined,
            col: formCol,
          },
        ]
      : []),
    ...(values.workingStatus === workingStatusList[2].key
      ? [
          {
            name: 'finishDate',
            label: '完工时间',
            children:
              name !== 'detail' ? (
                <DatePicker
                  className={styles.datePicker}
                  placeholder="请选择"
                  format={minuteFormat}
                  showTime
                  allowClear={false}
                />
              ) : (
                <Text type="DatePicker" format={dateFormat} />
              ),
            rules: name !== 'detail' ? [{ required: true, message: '请选择完工时间' }] : undefined,
            col: formCol,
          },
        ]
      : []),
    {
      name: 'hazardIdentification',
      label: '危害辨识',
      children:
        name !== 'detail' ? (
          <TextArea
            placeholder="请输入"
            maxLength={200}
            autoSize={{
              minRows: 3,
            }}
          />
        ) : (
          <Text type="TextArea" />
        ),
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入危害辨识' },
              { whitespace: true, message: '危害辨识不能只为空格' },
            ]
          : undefined,
      wrapperCol: halfCol,
      col,
    },
    {
      name: 'riskFactors',
      label: '危险因素',
      children:
        name !== 'detail' ? (
          <TextArea
            placeholder="请输入"
            maxLength={200}
            autoSize={{
              minRows: 3,
            }}
          />
        ) : (
          <Text type="TextArea" />
        ),
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入危险因素' },
              { whitespace: true, message: '危险因素不能只为空格' },
            ]
          : undefined,
      wrapperCol: halfCol,
      col,
    },
    {
      name: 'safetyMeasures',
      label: '安全措施',
      children: (
        <SafetyMeasures
          list={safetyMeasuresMap[values.billType]}
          name={name}
          approved={values.approveStatus === approveStatusList[1].key}
        />
      ),
      rules:
        name !== 'detail'
          ? [{ type: 'array', required: true, validator: validateSafetyMeasures }]
          : undefined,
      col,
    },
    {
      name: 'certificatesFileList',
      label: '特殊作业操作证附件',
      children: name !== 'detail' ? <Upload /> : <Text type="Upload" />,
      wrapperCol: halfCol,
      col,
    },
    {
      name: 'locationFileList',
      label: '盲板位置图附件',
      children: name !== 'detail' ? <Upload /> : <Text type="Upload" />,
      wrapperCol: halfCol,
      col,
    },
    {
      name: 'applyFileList',
      label: '审批附件',
      children: name !== 'detail' ? <Upload /> : <Text type="Upload" />,
      wrapperCol: halfCol,
      col,
    },
    {
      name: 'isSetWarn',
      label: '是否设置作业区域',
      children:
        name !== 'detail' ? (
          <Radio.Group options={yesOrNo} />
        ) : (
          <Text type="Radio" options={yesOrNo} />
        ),
      col,
    },
  ],
  [typeList[7].key]: ({
    isUnit,
    values,
    name,
    companyList,
    loadingCompanyList,
    setCompanyPayload,
    onCompanySelectChange,
    personList,
    loadingPersonList,
    setPersonPayload,
    onPersonSelectChange,
    departmentTree,
    loadingDepartmentTree,
    ranges,
  }) => [
    {
      name: 'company',
      label: '单位名称',
      children:
        name !== 'detail' ? (
          <PagingSelect
            options={companyList.list}
            loading={loadingCompanyList}
            disabled={name !== 'add'}
            hasMore={
              companyList.pagination &&
              companyList.pagination.total >
                companyList.pagination.pageNum * companyList.pagination.pageSize
            }
            onSearch={name => setCompanyPayload(payload => ({ ...payload, pageNum: 1, name }))}
            loadMore={() =>
              setCompanyPayload(payload => ({ ...payload, pageNum: payload.pageNum + 1 }))
            }
            onChange={onCompanySelectChange}
          />
        ) : (
          <Text type="Select" labelInValue />
        ),
      getValueFromEvent: getSelectValueFromEvent,
      rules: name !== 'detail' ? [{ required: true, message: '请选择单位名称' }] : undefined,
      hidden: isUnit,
      col: !isUnit ? formCol : hiddenCol,
    },
    {
      name: 'billType',
      label: '作业证名称',
      children:
        name !== 'detail' ? (
          <Select placeholder="请选择" options={typeList} disabled={name !== 'add'} />
        ) : (
          <Text type="Select" options={typeList} />
        ),
      rules: name !== 'detail' ? [{ required: true, message: '请选择作业证名称' }] : undefined,
      col: formCol,
    },
    {
      name: 'applyUser',
      label: '申请人',
      children:
        name !== 'detail' ? (
          <PagingSelect
            options={values.company ? personList.list : []}
            loading={loadingPersonList}
            hasMore={
              personList.pagination &&
              personList.pagination.total >
                personList.pagination.pageNum * personList.pagination.pageSize
            }
            onSearch={name => setPersonPayload(payload => ({ ...payload, pageNum: 1, name }))}
            loadMore={() =>
              setPersonPayload(payload => ({ ...payload, pageNum: payload.pageNum + 1 }))
            }
            onChange={onPersonSelectChange}
          />
        ) : (
          <Text type="Select" labelInValue />
        ),
      getValueFromEvent: getSelectValueFromEvent,
      rules: name !== 'detail' ? [{ required: true, message: '请选择申请人' }] : undefined,
      col: formCol,
    },
    {
      name: 'applyCompanyName',
      label: '申请单位',
      children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入申请单位' },
              { whitespace: true, message: '申请单位不能只为空格' },
            ]
          : undefined,
      col: formCol,
    },
    {
      name: 'applyDepartment',
      label: '申请部门',
      children:
        name !== 'detail' ? (
          <TreeSelect
            placeholder="请选择"
            treeData={values.company ? departmentTree : []}
            labelInValue
            notFoundContent={loadingDepartmentTree ? <Spin size="small" /> : undefined}
            showSearch
            treeNodeFilterProp="title"
          />
        ) : (
          <Text type="TreeSelect" labelInValue />
        ),
      getValueFromEvent: getSelectValueFromEvent,
      rules: name !== 'detail' ? [{ required: true, message: '请选择申请部门' }] : undefined,
      col: formCol,
    },
    {
      name: 'applyDate',
      label: '申请日期',
      children:
        name !== 'detail' ? (
          <DatePicker
            className={styles.datePicker}
            placeholder="请选择"
            format={dateFormat}
            allowClear={false}
          />
        ) : (
          <Text type="DatePicker" format={dateFormat} />
        ),
      rules: name !== 'detail' ? [{ required: true, message: '请选择申请日期' }] : undefined,
      col: formCol,
    },
    {
      name: 'billCode',
      label: '作业证编号',
      children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入作业证编号' },
              { whitespace: true, message: '作业证编号不能只为空格' },
            ]
          : undefined,
      col: formCol,
    },
    {
      name: 'location',
      label: '断路作业地段',
      children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入断路作业地段' },
              { whitespace: true, message: '断路作业地段不能只为空格' },
            ]
          : undefined,
      col: formCol,
    },
    {
      name: 'address',
      label: '断路作业地点',
      children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入断路作业地点' },
              { whitespace: true, message: '断路作业地点不能只为空格' },
            ]
          : undefined,
      col: formCol,
    },
    {
      name: 'workingContent',
      label: '断路作业原因',
      children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入断路作业原因' },
              { whitespace: true, message: '断路作业原因不能只为空格' },
            ]
          : undefined,
      col: formCol,
    },
    {
      name: 'agent',
      label: '待办人',
      children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入待办人' },
              { whitespace: true, message: '待办人不能只为空格' },
            ]
          : undefined,
      col: formCol,
    },
    {
      name: 'workingProject',
      label: '施工项目',
      children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入施工项目' },
              { whitespace: true, message: '施工项目不能只为空格' },
            ]
          : undefined,
      col: formCol,
    },
    {
      name: 'range',
      label: '作业期限',
      children:
        name !== 'detail' ? (
          <RangePicker
            className={styles.rangePicker}
            placeholder={timeRangePickerPlaceholder}
            format={minuteFormat}
            showTime
            separator="~"
            ranges={ranges}
            allowClear={false}
          />
        ) : (
          <Text type="RangePicker" format={minuteFormat} />
        ),
      rules: name !== 'detail' ? [{ required: true, message: '请选择作业期限' }] : undefined,
      col: formCol,
    },
    {
      name: 'workingCompanyType',
      label: '作业单位类型',
      children:
        name !== 'detail' ? (
          <Select placeholder="请选择" options={companyTypeList} />
        ) : (
          <Text type="Select" options={companyTypeList} />
        ),
      rules: name !== 'detail' ? [{ required: true, message: '请选择作业单位类型' }] : undefined,
      col: formCol,
    },
    ...(values.workingCompanyType === companyTypeList[1].key
      ? [
          {
            name: 'workingCompanyName',
            label: '作业单位名称',
            children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
            rules:
              name !== 'detail'
                ? [
                    { required: true, message: '请输入作业单位名称' },
                    { whitespace: true, message: '作业单位名称不能只为空格' },
                  ]
                : undefined,
            col: formCol,
          },
        ]
      : []),
    {
      name: 'compilingPerson',
      label: '编制人',
      children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入编制人' },
              { whitespace: true, message: '编制人不能只为空格' },
            ]
          : undefined,
      col: formCol,
    },
    {
      name: 'supervisor',
      label: '监护人',
      children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入监护人' },
              { whitespace: true, message: '监护人不能只为空格' },
            ]
          : undefined,
      col: formCol,
    },
    {
      name: 'supervisorPosition',
      label: '监护人岗位',
      children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入监护人岗位' },
              { whitespace: true, message: '监护人岗位不能只为空格' },
            ]
          : undefined,
      col: formCol,
    },
    {
      name: 'safetyEducator',
      label: '实施安全教育人',
      children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入实施安全教育人' },
              { whitespace: true, message: '实施安全教育人不能只为空格' },
            ]
          : undefined,
      col: formCol,
    },
    {
      name: 'planType',
      label: '计划性',
      children:
        name !== 'detail' ? (
          <Select placeholder="请选择" options={planTypeList} />
        ) : (
          <Text type="Select" options={planTypeList} />
        ),
      rules: name !== 'detail' ? [{ required: true, message: '请选择计划性' }] : undefined,
      col: formCol,
    },
    {
      name: 'recoveryDate',
      label: '恢复日期',
      children:
        name !== 'detail' ? (
          <DatePicker
            className={styles.datePicker}
            placeholder="请选择"
            format={minuteFormat}
            showTime
            allowClear={false}
          />
        ) : (
          <Text type="DatePicker" format={minuteFormat} />
        ),
      rules: name !== 'detail' ? [{ required: true, message: '请选择恢复日期' }] : undefined,
      col: formCol,
    },
    {
      name: 'approveStatus',
      label: '审批状态',
      children:
        name !== 'detail' ? (
          <Select placeholder="请选择" options={approveStatusList} />
        ) : (
          <Text type="Select" options={approveStatusList} />
        ),
      hidden: name !== 'detail',
      col: name !== 'detail' ? hiddenCol : formCol,
    },
    ...(values.approveStatus === approveStatusList[1].key ||
    values.approveStatus === approveStatusList[2].key
      ? [
          {
            name: 'signature',
            label: '手写签名',
            children: <Signature />,
            hidden: name !== 'detail',
            col: name !== 'detail' ? hiddenCol : formCol,
          },
        ]
      : []),
    ...(values.approveStatus === approveStatusList[1].key
      ? [
          {
            name: 'workingStatus',
            label: '作业状态',
            children:
              name !== 'detail' ? (
                <Select placeholder="请选择" options={workingStatusList} />
              ) : (
                <Text type="Select" options={workingStatusList} />
              ),
            rules: name !== 'detail' ? [{ required: true, message: '请选择作业状态' }] : undefined,
            col: formCol,
          },
        ]
      : []),
    ...(values.workingStatus === workingStatusList[2].key
      ? [
          {
            name: 'finishDate',
            label: '完工时间',
            children:
              name !== 'detail' ? (
                <DatePicker
                  className={styles.datePicker}
                  placeholder="请选择"
                  format={minuteFormat}
                  showTime
                  allowClear={false}
                />
              ) : (
                <Text type="DatePicker" format={dateFormat} />
              ),
            rules: name !== 'detail' ? [{ required: true, message: '请选择完工时间' }] : undefined,
            col: formCol,
          },
        ]
      : []),
    {
      name: 'hazardIdentification',
      label: '危害辨识',
      children:
        name !== 'detail' ? (
          <TextArea
            placeholder="请输入"
            maxLength={200}
            autoSize={{
              minRows: 3,
            }}
          />
        ) : (
          <Text type="TextArea" />
        ),
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入危害辨识' },
              { whitespace: true, message: '危害辨识不能只为空格' },
            ]
          : undefined,
      wrapperCol: halfCol,
      col,
    },
    {
      name: 'riskFactors',
      label: '危险因素',
      children:
        name !== 'detail' ? (
          <TextArea
            placeholder="请输入"
            maxLength={200}
            autoSize={{
              minRows: 3,
            }}
          />
        ) : (
          <Text type="TextArea" />
        ),
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入危险因素' },
              { whitespace: true, message: '危险因素不能只为空格' },
            ]
          : undefined,
      wrapperCol: halfCol,
      col,
    },
    {
      name: 'safetyMeasures',
      label: '安全措施',
      children: (
        <SafetyMeasures
          list={safetyMeasuresMap[values.billType]}
          name={name}
          approved={values.approveStatus === approveStatusList[1].key}
        />
      ),
      rules:
        name !== 'detail'
          ? [{ type: 'array', required: true, validator: validateSafetyMeasures }]
          : undefined,
      col,
    },
    {
      name: 'certificatesFileList',
      label: '特殊作业操作证附件',
      children: name !== 'detail' ? <Upload /> : <Text type="Upload" />,
      wrapperCol: halfCol,
      col,
    },
    {
      name: 'locationFileList',
      label: '断路地段示意图附件',
      children: name !== 'detail' ? <Upload /> : <Text type="Upload" />,
      rules: [
        {
          type: 'array',
          min: 1,
          required: true,
          message: '请上传断路地段示意图附件',
        },
      ],
      wrapperCol: halfCol,
      col,
    },
    {
      name: 'applyFileList',
      label: '审批附件',
      children: name !== 'detail' ? <Upload /> : <Text type="Upload" />,
      wrapperCol: halfCol,
      col,
    },
    {
      name: 'isSetWarn',
      label: '是否设置作业区域',
      children:
        name !== 'detail' ? (
          <Radio.Group options={yesOrNo} />
        ) : (
          <Text type="Radio" options={yesOrNo} />
        ),
      col,
    },
  ],
  [typeList[8].key]: ({
    isUnit,
    values,
    name,
    companyList,
    loadingCompanyList,
    setCompanyPayload,
    onCompanySelectChange,
    personList,
    loadingPersonList,
    setPersonPayload,
    onPersonSelectChange,
    departmentTree,
    loadingDepartmentTree,
    ranges,
  }) => [
    {
      name: 'company',
      label: '单位名称',
      children:
        name !== 'detail' ? (
          <PagingSelect
            options={companyList.list}
            loading={loadingCompanyList}
            disabled={name !== 'add'}
            hasMore={
              companyList.pagination &&
              companyList.pagination.total >
                companyList.pagination.pageNum * companyList.pagination.pageSize
            }
            onSearch={name => setCompanyPayload(payload => ({ ...payload, pageNum: 1, name }))}
            loadMore={() =>
              setCompanyPayload(payload => ({ ...payload, pageNum: payload.pageNum + 1 }))
            }
            onChange={onCompanySelectChange}
          />
        ) : (
          <Text type="Select" labelInValue />
        ),
      getValueFromEvent: getSelectValueFromEvent,
      rules: name !== 'detail' ? [{ required: true, message: '请选择单位名称' }] : undefined,
      hidden: isUnit,
      col: !isUnit ? formCol : hiddenCol,
    },
    {
      name: 'billType',
      label: '作业证名称',
      children:
        name !== 'detail' ? (
          <Select placeholder="请选择" options={typeList} disabled={name !== 'add'} />
        ) : (
          <Text type="Select" options={typeList} />
        ),
      rules: name !== 'detail' ? [{ required: true, message: '请选择作业证名称' }] : undefined,
      col: formCol,
    },
    {
      name: 'applyUser',
      label: '申请人',
      children:
        name !== 'detail' ? (
          <PagingSelect
            options={values.company ? personList.list : []}
            loading={loadingPersonList}
            hasMore={
              personList.pagination &&
              personList.pagination.total >
                personList.pagination.pageNum * personList.pagination.pageSize
            }
            onSearch={name => setPersonPayload(payload => ({ ...payload, pageNum: 1, name }))}
            loadMore={() =>
              setPersonPayload(payload => ({ ...payload, pageNum: payload.pageNum + 1 }))
            }
            onChange={onPersonSelectChange}
          />
        ) : (
          <Text type="Select" labelInValue />
        ),
      getValueFromEvent: getSelectValueFromEvent,
      rules: name !== 'detail' ? [{ required: true, message: '请选择申请人' }] : undefined,
      col: formCol,
    },
    {
      name: 'applyCompanyName',
      label: '申请单位',
      children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入申请单位' },
              { whitespace: true, message: '申请单位不能只为空格' },
            ]
          : undefined,
      col: formCol,
    },
    {
      name: 'applyDepartment',
      label: '申请部门',
      children:
        name !== 'detail' ? (
          <TreeSelect
            placeholder="请选择"
            treeData={values.company ? departmentTree : []}
            labelInValue
            notFoundContent={loadingDepartmentTree ? <Spin size="small" /> : undefined}
            showSearch
            treeNodeFilterProp="title"
          />
        ) : (
          <Text type="TreeSelect" labelInValue />
        ),
      getValueFromEvent: getSelectValueFromEvent,
      rules: name !== 'detail' ? [{ required: true, message: '请选择申请部门' }] : undefined,
      col: formCol,
    },
    {
      name: 'applyDate',
      label: '申请日期',
      children:
        name !== 'detail' ? (
          <DatePicker
            className={styles.datePicker}
            placeholder="请选择"
            format={dateFormat}
            allowClear={false}
          />
        ) : (
          <Text type="DatePicker" format={dateFormat} />
        ),
      rules: name !== 'detail' ? [{ required: true, message: '请选择申请日期' }] : undefined,
      col: formCol,
    },
    {
      name: 'billCode',
      label: '作业证编号',
      children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入作业证编号' },
              { whitespace: true, message: '作业证编号不能只为空格' },
            ]
          : undefined,
      col: formCol,
    },
    {
      name: 'address',
      label: '动土地点',
      children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入动土地点' },
              { whitespace: true, message: '动土地点不能只为空格' },
            ]
          : undefined,
      col: formCol,
    },
    {
      name: 'agent',
      label: '待办人',
      children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入待办人' },
              { whitespace: true, message: '待办人不能只为空格' },
            ]
          : undefined,
      col: formCol,
    },
    {
      name: 'workingProject',
      label: '施工项目',
      children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入施工项目' },
              { whitespace: true, message: '施工项目不能只为空格' },
            ]
          : undefined,
      col: formCol,
    },
    {
      name: 'range',
      label: '作业期限',
      children:
        name !== 'detail' ? (
          <RangePicker
            className={styles.rangePicker}
            placeholder={timeRangePickerPlaceholder}
            format={minuteFormat}
            showTime
            separator="~"
            ranges={ranges}
            allowClear={false}
          />
        ) : (
          <Text type="RangePicker" format={minuteFormat} />
        ),
      rules: name !== 'detail' ? [{ required: true, message: '请选择作业期限' }] : undefined,
      col: formCol,
    },
    {
      name: 'workingCompanyType',
      label: '作业单位类型',
      children:
        name !== 'detail' ? (
          <Select placeholder="请选择" options={companyTypeList} />
        ) : (
          <Text type="Select" options={companyTypeList} />
        ),
      rules: name !== 'detail' ? [{ required: true, message: '请选择作业单位类型' }] : undefined,
      col: formCol,
    },
    ...(values.workingCompanyType === companyTypeList[1].key
      ? [
          {
            name: 'workingCompanyName',
            label: '作业单位名称',
            children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
            rules:
              name !== 'detail'
                ? [
                    { required: true, message: '请输入作业单位名称' },
                    { whitespace: true, message: '作业单位名称不能只为空格' },
                  ]
                : undefined,
            col: formCol,
          },
        ]
      : []),
    {
      name: 'workingManager',
      label: '作业负责人',
      children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入作业负责人' },
              { whitespace: true, message: '作业负责人不能只为空格' },
            ]
          : undefined,
      col: formCol,
    },
    {
      name: 'workingPersonnel',
      label: '作业人',
      children:
        name !== 'detail' ? (
          <Select placeholder="请输入" notFoundContent={null} showArrow={false} mode="tags" />
        ) : (
          <Text type="Select" mode="tags" />
        ),
      getValueFromEvent: getTagsSelectValueFromEvent,
      rules:
        name !== 'detail'
          ? [{ type: 'array', min: 1, required: true, message: '请输入作业人' }]
          : undefined,
      col: formCol,
    },
    {
      name: 'compilingPerson',
      label: '编制人',
      children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入编制人' },
              { whitespace: true, message: '编制人不能只为空格' },
            ]
          : undefined,
      col: formCol,
    },
    {
      name: 'location',
      label: '动土范围',
      children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入动土范围' },
              { whitespace: true, message: '动土范围不能只为空格' },
            ]
          : undefined,
      col: formCol,
    },
    {
      name: 'workingWay',
      label: '动土方式',
      children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入动土方式' },
              { whitespace: true, message: '动土方式不能只为空格' },
            ]
          : undefined,
      col: formCol,
    },
    {
      name: 'workingContent',
      label: '动土内容',
      children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入动土内容' },
              { whitespace: true, message: '动土内容不能只为空格' },
            ]
          : undefined,
      col: formCol,
    },
    {
      name: 'powerAccessPoint',
      label: '电源接入点',
      children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入电源接入点' },
              { whitespace: true, message: '电源接入点不能只为空格' },
            ]
          : undefined,
      col: formCol,
    },
    {
      name: 'voltage',
      label: '使用电压',
      children:
        name !== 'detail' ? (
          <Input placeholder="请输入" addonAfter="V" maxLength={50} />
        ) : (
          <Text addonAfter="V" />
        ),
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入使用电压' },
              { whitespace: true, message: '使用电压不能只为空格' },
            ]
          : undefined,
      col: formCol,
    },
    {
      name: 'planType',
      label: '计划性',
      children:
        name !== 'detail' ? (
          <Select placeholder="请选择" options={planTypeList} />
        ) : (
          <Text type="Select" options={planTypeList} />
        ),
      rules: name !== 'detail' ? [{ required: true, message: '请选择计划性' }] : undefined,
      col: formCol,
    },
    {
      name: 'supervisor',
      label: '监护人',
      children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入监护人' },
              { whitespace: true, message: '监护人不能只为空格' },
            ]
          : undefined,
      col: formCol,
    },
    {
      name: 'supervisorPosition',
      label: '监护人岗位',
      children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入监护人岗位' },
              { whitespace: true, message: '监护人岗位不能只为空格' },
            ]
          : undefined,
      col: formCol,
    },
    {
      name: 'safetyEducator',
      label: '实施安全教育人',
      children: name !== 'detail' ? <Input placeholder="请输入" maxLength={50} /> : <Text />,
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入实施安全教育人' },
              { whitespace: true, message: '实施安全教育人不能只为空格' },
            ]
          : undefined,
      col: formCol,
    },
    {
      name: 'approveStatus',
      label: '审批状态',
      children:
        name !== 'detail' ? (
          <Select placeholder="请选择" options={approveStatusList} />
        ) : (
          <Text type="Select" options={approveStatusList} />
        ),
      hidden: name !== 'detail',
      col: name !== 'detail' ? hiddenCol : formCol,
    },
    ...(values.approveStatus === approveStatusList[1].key ||
    values.approveStatus === approveStatusList[2].key
      ? [
          {
            name: 'signature',
            label: '手写签名',
            children: <Signature />,
            hidden: name !== 'detail',
            col: name !== 'detail' ? hiddenCol : formCol,
          },
        ]
      : []),
    ...(values.approveStatus === approveStatusList[1].key
      ? [
          {
            name: 'workingStatus',
            label: '作业状态',
            children:
              name !== 'detail' ? (
                <Select placeholder="请选择" options={workingStatusList} />
              ) : (
                <Text type="Select" options={workingStatusList} />
              ),
            rules: name !== 'detail' ? [{ required: true, message: '请选择作业状态' }] : undefined,
            col: formCol,
          },
        ]
      : []),
    ...(values.workingStatus === workingStatusList[2].key
      ? [
          {
            name: 'finishDate',
            label: '完工时间',
            children:
              name !== 'detail' ? (
                <DatePicker
                  className={styles.datePicker}
                  placeholder="请选择"
                  format={minuteFormat}
                  showTime
                  allowClear={false}
                />
              ) : (
                <Text type="DatePicker" format={dateFormat} />
              ),
            rules: name !== 'detail' ? [{ required: true, message: '请选择完工时间' }] : undefined,
            col: formCol,
          },
        ]
      : []),
    {
      name: 'hazardIdentification',
      label: '危害辨识',
      children:
        name !== 'detail' ? (
          <TextArea
            placeholder="请输入"
            maxLength={200}
            autoSize={{
              minRows: 3,
            }}
          />
        ) : (
          <Text type="TextArea" />
        ),
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入危害辨识' },
              { whitespace: true, message: '危害辨识不能只为空格' },
            ]
          : undefined,
      wrapperCol: halfCol,
      col,
    },
    {
      name: 'riskFactors',
      label: '危险因素',
      children:
        name !== 'detail' ? (
          <TextArea
            placeholder="请输入"
            maxLength={200}
            autoSize={{
              minRows: 3,
            }}
          />
        ) : (
          <Text type="TextArea" />
        ),
      rules:
        name !== 'detail'
          ? [
              { required: true, message: '请输入危险因素' },
              { whitespace: true, message: '危险因素不能只为空格' },
            ]
          : undefined,
      wrapperCol: halfCol,
      col,
    },
    {
      name: 'safetyMeasures',
      label: '安全措施',
      children: (
        <SafetyMeasures
          list={safetyMeasuresMap[values.billType]}
          name={name}
          approved={values.approveStatus === approveStatusList[1].key}
        />
      ),
      rules:
        name !== 'detail'
          ? [{ type: 'array', required: true, validator: validateSafetyMeasures }]
          : undefined,
      col,
    },
    {
      name: 'certificatesFileList',
      label: '特殊作业操作证附件',
      children: name !== 'detail' ? <Upload /> : <Text type="Upload" />,
      wrapperCol: halfCol,
      col,
    },
    {
      name: 'locationFileList',
      label: '动土地段示意图附件',
      children: name !== 'detail' ? <Upload /> : <Text type="Upload" />,
      rules: [
        {
          type: 'array',
          min: 1,
          required: true,
          message: '请上传动土地段示意图附件',
        },
      ],
      wrapperCol: halfCol,
      col,
    },
    {
      name: 'applyFileList',
      label: '审批附件',
      children: name !== 'detail' ? <Upload /> : <Text type="Upload" />,
      wrapperCol: halfCol,
      col,
    },
    {
      name: 'isSetWarn',
      label: '是否设置作业区域',
      children:
        name !== 'detail' ? (
          <Radio.Group options={yesOrNo} />
        ) : (
          <Text type="Radio" options={yesOrNo} />
        ),
      col,
    },
  ],
};
