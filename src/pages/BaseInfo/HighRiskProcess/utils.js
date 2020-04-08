export const CONTROL_OPTIONS = ['报警', '温度压力联锁', '进料紧急切断', '安全阀', '爆破片'].map((t, i) => ({ label: t, value: (i + 1).toString() }));
const CONTROL_MAP = CONTROL_OPTIONS.reduce((prev, next) => {
  prev[next.value] = next.label;
  return prev;
}, {});
export const TECHNICAL_OPTIONS = ['自行研发', '技术转让', '其他'].map((t, i) =>({ label: t, value: i.toString() }) );

export const MOINTOR_TYPES = [
  { label: '储罐', value: '302' },
  { label: '生产装置', value: '311' },
];

export function getTypeLabel(type, list) {
  if (type === null || type === undefined)
    return '-';

  const target = list.find(({ value }) => value === type.toString());
  if (target) return target.label;
}

export function handleDetail(model) {
  const {
    highRiskProcessDetail: detail,
    keySupervisionProcessOptions,
    qualificationLevelDict,
    SILLevelDict,
  } = model;

  const fields = [
    { name: 'companyName', label: '单位名称' },
    { name: 'unifiedCode', label: '工艺编码' },
    { name: 'processName', label: '生产工艺名称' },
    { name: 'iskeySupervisionProcess', label: '是否重点监管危险化工工艺' },
    { name: 'keySupervisionProcess', label: '重点监管危险化工工艺' },
    { name: 'reactionType', label: '反应类型' },
    { name: 'rawList', label: '生产原料' },
    { name: 'middleList', label: '中间产品' },
    { name: 'finalList', label: '最终产品' },
    { name: 'keyMonitoringUnitList', label: '重点监控单元' },
    { name: 'dangerousCharacter', label: '工艺危险特点' },
    { name: 'processBrief', label: '工艺系统简况' },
    { name: 'operationNumber', label: '岗位操作人数' },
    { name: 'certificatesNum', label: '持证人数' },
    { name: 'technicalSource', label: '技术来源' },
    { name: 'designUnit', label: '设计单位' },
    { name: 'qualificationGrade', label: '设计单位资质等级' },
    { name: 'nationalRegulations', label: '是否满足国家规定的要求' },
    { name: 'basicControlRequire', label: '安全控制基本要求' },
    { name: 'controlMode', label: '控制方式' },
    { name: 'autoControl', label: '自动控制措施' },
    { name: 'sis', label: '安全仪表系统' },
    { name: 'sisLevel', label: 'SIL等级' },
    { name: 'flowChartControlPointDetails', label: '带控制点的工艺流程图' },
    { name: 'equipmentListDetails', label: '设备一览表' },
    { name: 'equipmentLayoutDetails', label: '设备布置图' },
  ];

  return fields.map(({ name, label }) => {
    let value = getDetailByName(name, detail);
    let text;

    if (value === null)
      text = '-';
    else
      switch(name) {
        case 'iskeySupervisionProcess':
        case 'nationalRegulations':
          text = ['否', '是'][value];
          break;
        case 'keySupervisionProcess':
          text = getTypeLabel(value, keySupervisionProcessOptions);
          break;
        case 'rawList':
        case 'middleList':
        case 'finalList':
          text = value.map(({ chineName }) => chineName).join('，');
          break;
        case 'keyMonitoringUnitList':
          text = value.map(({ name }) => name).join('，');
          break;
        case 'technicalSource':
          text = getTypeLabel(value, TECHNICAL_OPTIONS);
          break;
        case 'qualificationGrade':
          text = getTypeLabel(value, qualificationLevelDict);
          break;
        case 'controlMode':
          text = value.split(',').filter(s => s).map(s => CONTROL_MAP[s]).join('，');
          break;
        case 'sisLevel':
          text = getTypeLabel(value, SILLevelDict);
          break;
        case 'flowChartControlPointDetails':
        case 'equipmentListDetails':
        case 'equipmentLayoutDetails':
          text = value.map(({ fileName, webUrl }) => <a href={webUrl} target="_blank" rel="noopener noreferrer" style={{ marginRight: 10 }}>{fileName}</a>);
          break;
        default:
          text = value;
      }

    return { name, label, type: 'component', component: text };
  });
}

function getDetailByName(name, detail) {
  const value = detail[name];
  if (value === undefined || value === null)
    return null;
  return value;
}
