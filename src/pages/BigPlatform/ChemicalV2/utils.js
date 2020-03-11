import Wave from '@/jingan-components/Wave';
import Ellipsis from '@/components/Ellipsis';
import moment from 'moment';
import styles from './sections/MonitorDrawer.less';

const storageAreaImg = 'http://data.jingan-china.cn/v2/chem/screen/storage.png';
const storageImg = 'http://data.jingan-china.cn/v2/chem/chemScreen/icon-tank-empty.png';
const reservoirImg = 'http://data.jingan-china.cn/v2/chem/screen/reservoir.png';
const warehouseImg = 'http://data.jingan-china.cn/v2/chem/screen/warehouse.png';
const gasometerImg = 'http://data.jingan-china.cn/v2/chem/screen/gasometer.png';
const productDeviceImg = 'http://data.jingan-china.cn/v2/chem/screen/productDevice.png';
const pipelineImg = 'http://data.jingan-china.cn/v2/chem/screen/pipeline.png';
// 可燃气体图片
const iconFlamGas = 'http://data.jingan-china.cn/v2/chem/chemScreen/gas.png';
// 有毒气体图片
const iconToxicGas = 'http://data.jingan-china.cn/v2/chem/chemScreen/poison.png';

const transformCondition = condition => {
  if (condition === '>=') return '≥';
  else if (condition === '<=') return '≤';
  return condition;
};

const renderEllipsis = val => (
  <Ellipsis tooltip length={40} style={{ overflow: 'visible' }}>
    {val}
  </Ellipsis>
);

export const MsgShowTypes = [
  1, // 发生监管
  2, // 联动
  3, // 反馈
  4, // 屏蔽
  7, // 主机报警
  9, // 主机报障
  11, // 一键报修
  13, // 安全巡查
  14, // 上报隐患
  15, // 整改隐患
  16, // 重新整改隐患
  17, // 复查隐患
  18, // 维保巡检
  32, // 电气火灾报警
  36, // 水系统报警
  37, // 水系统恢复
  38, // 独立烟感报警
  39, // 可燃气体报警
  40, // 独立烟感故障
  42, // 电气火灾失联
  43, // 电气火灾失联恢复
  44, // 电气火灾报警恢复
  45, // 燃气报警恢复
  46, // 独立烟感失联
  47, // 独立烟感失联恢复
  48, // 水系统失联
  49, // 水系统失联恢复
  50, // 独立烟感报警恢复
  51, // 独立烟感故障恢复
  54, // 可燃气体失联
  55, // 可燃气体失联恢复
  56, // 机械臂故障
  57, // 机械臂故障恢复
  58, // 人脸识别报警
  100, // 监测设备
];

// export const TypeClickList = [100, 14, 15, 16, 17];
export const TypeClickList = [100];

export const MonitorConfig = {
  '301': {
    // 储罐区
    title: '罐区监测',
    icon: (
      <div
        className={styles.iconWrapper}
        style={{ background: `url(${storageAreaImg}) center center / 100% auto no-repeat` }}
      />
    ),
    fields: [
      {
        value: 'areaName',
        render: val => {
          return <span style={{ fontSize: 16 }}>{val}</span>;
        },
      },
      { label: '在厂区的位置', value: 'location' },
      {
        label: '所处环境功能区',
        value: 'environmentArea',
        render: val => {
          const envirTypeList = [
            { key: '1', value: '一类区' },
            { key: '2', value: '二类区' },
            { key: '3', value: '三类区' },
          ];
          return <span>{envirTypeList[val - 1] ? envirTypeList[val - 1].value : ''}</span>;
        },
      },
      { label: '储罐区面积（㎡）', value: 'spaceArea' },
      {
        label: '有无围堰',
        value: 'hasCoffer',
        render: val => (+val === 0 ? '无' : '有'),
      },
      { label: '罐区总容积（m³）', value: 'areaVolume' },
      { label: '常规储量（t）', value: 'commonStore' },
    ],
  },
  '302': {
    // 储罐
    title: '储罐监测',
    icon: ({ tankName }) => (
      <div
        className={styles.iconWrapper}
        style={{
          background: `url(${storageImg}) center center / 100% auto no-repeat`,
        }}
      >
        <Wave
          frontStyle={{ height: '30%', color: 'rgba(178, 237, 255, 0.8)' }}
          backStyle={{ height: '30%', color: 'rgba(178, 237, 255, 0.3)' }}
        />
        <div className={styles.tankName}>{tankName}</div>
      </div>
    ),
    fields: [
      {
        value: 'tankName',
        render: val => {
          return <span style={{ fontSize: 16 }}>{val}</span>;
        },
      },
      { label: '位号', value: 'number' },
      { label: '存储物质', value: 'chineName' },
      {
        label: '区域位置',
        value: 'buildingName',
        render: (val, row) => {
          const { buildingName, floorName, area, location } = row;
          return (
            <span>
              {`${buildingName || ''}${floorName || ''}${area || ''}${location || ''}` ||
                '暂无数据'}
            </span>
          );
        },
      },
    ],
  },
  '303': {
    // 库区
    title: '库区监测',
    icon: (
      <div
        className={styles.iconWrapper}
        style={{ background: `url(${reservoirImg}) center center / 100% auto no-repeat` }}
      />
    ),
    fields: [
      {
        value: 'name',
        render: val => {
          return <span style={{ fontSize: 16 }}>{val}</span>;
        },
      },
      { label: '区域位置', value: 'position' },
      {
        label: '所处环境功能区',
        value: 'environment',
        render: val => {
          const envirTypeList = [
            { key: '1', value: '一类区' },
            { key: '2', value: '二类区' },
            { key: '3', value: '三类区' },
          ];
          return <span>{envirTypeList[val - 1] ? envirTypeList[val - 1].value : ''}</span>;
        },
      },
      { label: '库区面积（㎡）', value: 'area' },
    ],
  },
  '304': {
    // 库房
    title: '库房监测',
    icon: (
      <div
        className={styles.iconWrapper}
        style={{ background: `url(${warehouseImg}) center center / 100% auto no-repeat` }}
      />
    ),
    fields: [
      {
        value: 'name',
        render: val => {
          return <span style={{ fontSize: 16 }}>{val}</span>;
        },
      },
      { label: '区域位置', value: 'position' },
      { label: '所属库区', value: 'aname' },
      { label: '库房面积（㎡）', value: 'area' },
    ],
  },
  '311': {
    // 生产装置
    title: '生产装置监测',
    icon: (
      <div
        className={styles.iconWrapper}
        style={{ background: `url(${productDeviceImg}) center center / 100% auto no-repeat` }}
      />
    ),
    fields: [
      {
        value: 'name',
        render: val => {
          return <span style={{ fontSize: 16 }}>{val}</span>;
        },
      },
      { label: '区域位置', value: 'location' },
      { label: '是否关键装置', value: 'keyDevice', render: val => (+val === 1 ? '是' : '否') },
      { label: '设计压力（KPa）', value: 'pressure' },
    ],
  },
  '312': {
    // 气柜
    title: '气柜监测',
    icon: (
      <div
        className={styles.iconWrapper}
        style={{ background: `url(${gasometerImg}) center center / 100% auto no-repeat` }}
      />
    ),
    fields: [
      {
        value: 'gasholderName',
        render: val => {
          return <span style={{ fontSize: 16 }}>{val}</span>;
        },
      },
      { label: '区域位置', value: 'regionalLocation' },
      { label: '设计柜容（m³）', value: 'designCapacity' },
      { label: '设计压力（KPa）', value: 'designKpa' },
    ],
  },
  '314': {
    // 工业管道
    title: '工业管道监测',
    icon: (
      <div
        className={styles.iconWrapper}
        style={{ background: `url(${pipelineImg}) center center / 100% auto no-repeat` }}
      />
    ),
    fields: [
      {
        value: 'name',
        render: val => {
          return <span style={{ fontSize: 16 }}>{val}</span>;
        },
      },
      {
        label: '是否危化品管道',
        value: 'dangerPipeline',
        render: val => (+val === 1 ? '是' : '否'),
      },
      { label: '是否压力管道', value: 'pressure', render: val => (+val === 1 ? '是' : '否') },
      { label: '设计压力（KPa）', value: 'designPressure' },
    ],
  },
  '405': {
    // 可燃气体监测
    title: '可燃气体监测',
    icon: ({ allMonitorParam }) => {
      const { realValueStr } = allMonitorParam[0] || {};
      return (
        <div
          className={styles.iconWrapper}
          style={{
            background: `url(${iconFlamGas}) center center / 100% auto no-repeat`,
            flexDirection: 'column',
            lineHeight: '1em',
            color: '#fff',
          }}
        >
          <div style={{ marginTop: '-1em' }}>LEL</div>
          <div>{realValueStr || '--'}%</div>
        </div>
      );
    },
    fields: [
      {
        value: 'name',
        render: val => {
          return <span style={{ fontSize: 16 }}>{val}</span>;
        },
      },
      {
        label: '编号',
        value: 'code',
      },
      {
        label: '浓度（%LEL）',
        value: 'allMonitorParam',
        render: (val = []) => {
          const { realValueStr, status, condition, limitValueStr, fixType } = val[0] || {};
          return (
            <span>
              <span style={{ color: +status !== 0 ? 'rgb(255, 72, 72)' : '#fff' }}>
                {realValueStr || '--'}
              </span>
              {condition &&
                limitValueStr &&
                +fixType !== 5 && (
                  <span style={{ display: 'inline-block', marginLeft: '20px' }}>
                    (
                    {condition && limitValueStr && +fixType !== 5
                      ? transformCondition(condition) + limitValueStr
                      : ''}
                    )
                  </span>
                )}
            </span>
          );
        },
      },
      {
        label: '更新时间',
        value: 'allMonitorParam',
        render: (val = []) => {
          const { dataUpdateTime } = val[0] || {};
          return dataUpdateTime ? moment(dataUpdateTime).format('YYYY-MM-DD HH:mm:ss') : '暂无数据';
        },
      },
    ],
  },
  '406': {
    // 可燃气体监测
    title: '有毒气体监测',
    icon: ({ allMonitorParam }) => {
      const { realValueStr } = allMonitorParam[0] || {};
      return (
        <div
          className={styles.iconWrapper}
          style={{
            background: `url(${iconToxicGas}) center center / 100% auto no-repeat`,
            flexDirection: 'column',
            lineHeight: '1em',
            color: '#fff',
          }}
        >
          <div style={{ marginTop: '-1em' }}>LEL</div>
          <div>{realValueStr || '--'}%</div>
        </div>
      );
    },
    fields: [
      {
        value: 'name',
        render: val => {
          return <span style={{ fontSize: 16 }}>{val}</span>;
        },
      },
      {
        label: '编号',
        value: 'code',
      },
      {
        label: '浓度（%LEL）',
        value: 'allMonitorParam',
        render: (val = []) => {
          const { realValueStr, status, condition, limitValueStr, fixType } = val[0] || {};
          return (
            <span>
              <span style={{ color: +status !== 0 ? 'rgb(255, 72, 72)' : '#fff' }}>
                {realValueStr || '--'}
              </span>
              {condition &&
                limitValueStr &&
                +fixType !== 5 && (
                  <span style={{ display: 'inline-block', marginLeft: '20px' }}>
                    (
                    {condition && limitValueStr && +fixType !== 5
                      ? transformCondition(condition) + limitValueStr
                      : ''}
                    )
                  </span>
                )}
            </span>
          );
        },
      },
      {
        label: '更新时间',
        value: 'allMonitorParam',
        render: (val = []) => {
          const { dataUpdateTime } = val[0] || {};
          return dataUpdateTime ? moment(dataUpdateTime).format('YYYY-MM-DD HH:mm:ss') : '暂无数据';
        },
      },
    ],
  },
};

export const DangerFactorsColumns = [
  {
    title: '序号',
    key: 'index',
    dataIndex: 'index',
    align: 'center',
    width: 60,
  },
  {
    title: '风险点名称',
    dataIndex: 'name',
    key: 'name',
    align: 'center',
    width: 160,
  },
  {
    title: '所在位置',
    dataIndex: 'space',
    key: 'space',
    align: 'center',
    width: 160,
  },
  {
    title: '存在的主要危险（有害）因素',
    dataIndex: 'dangerFactor',
    key: 'dangerFactor',
    align: 'center',
    width: 300,
    render: renderEllipsis,
  },
  {
    title: '易发生的事故类型',
    dataIndex: 'consequence',
    key: 'consequence',
    align: 'center',
    width: 340,
    render: renderEllipsis,
  },
  {
    title: '排查人员',
    dataIndex: 'checkPerson',
    key: 'checkPerson',
    align: 'center',
    width: 340,
  },
  {
    title: '负责人',
    dataIndex: 'principal',
    key: 'principal ',
    align: 'center',
    width: 340,
    render: renderEllipsis,
  },
  {
    title: '时间',
    dataIndex: 'checkDate',
    key: 'checkDate',
    align: 'center',
    width: 340,
    render: val => <span>{val === null ? '' : moment(+val).format('YYYY年MM月DD日')}</span>,
  },
];
export const SafetyRiskColumns = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    align: 'center',
    width: 60,
  },
  {
    title: '风险点',
    dataIndex: 'name',
    key: 'name',
    align: 'center',
    width: 160,
  },
  {
    title: '所在位置',
    dataIndex: 'space',
    key: 'space',
    align: 'center',
    width: 160,
  },
  {
    title: '存在的主要危险（有害）因素',
    dataIndex: 'dangerFactor',
    key: 'dangerFactor',
    align: 'center',
    width: 340,
    render: renderEllipsis,
  },
  {
    title: '可能导致事故类别',
    dataIndex: 'consequenceMeasure',
    key: 'consequenceMeasure',
    align: 'center',
    width: 340,
    render: renderEllipsis,
  },
  {
    title: 'L',
    dataIndex: 'l',
    key: 'l',
    align: 'center',
  },
  {
    title: 'E',
    dataIndex: 'e',
    key: 'e',
    align: 'center',
  },
  {
    title: 'C',
    dataIndex: 'c',
    key: 'c',
    align: 'center',
  },
  {
    title: 'D',
    dataIndex: 'd',
    key: 'd',
    align: 'center',
  },
  {
    title: '风险等级/风险色度',
    dataIndex: 'dangerLevel',
    key: 'dangerLevel',
    align: 'center',
    width: 100,
  },
  {
    title: '辨识分级时间',
    dataIndex: 'checkDate',
    key: 'checkDate',
    align: 'center',
    width: 150,
    render: val => <span>{val === null ? '' : moment(+val).format('YYYY年MM月DD日')}</span>,
  },
  {
    title: '采取的主要管控措施',
    dataIndex: 'dangerMeasure',
    key: 'dangerMeasure',
    align: 'center',
    width: 340,
    render: renderEllipsis,
  },
  {
    title: '责任部门',
    dataIndex: 'department',
    key: 'department',
    align: 'center',
    width: 160,
  },
  {
    title: '责任人',
    dataIndex: 'principal',
    key: 'principal ',
    align: 'center',
    width: 160,
    render: renderEllipsis,
  },
];
export const AcceptCardFields = [
  {
    label: '承诺卡名称',
    value: 'name',
  },
  {
    label: '承诺卡内容',
    value: 'content',
  },
  {
    label: '承诺人',
    value: 'acceptor',
  },
  {
    label: '时间',
    value: 'time',
    render: val => (val ? moment(val).format('YYYY-MM-DD') : ''),
  },
];
export const EmergencyCardFields = [
  {
    label: '应急卡名称',
    value: 'name',
  },
  {
    label: '作业/设备名称',
    value: 'equipmentName',
  },
  {
    label: '风险提示',
    value: 'riskWarning',
  },
  {
    label: '应急处置方法',
    value: 'emergency',
  },
  {
    label: '注意事项',
    value: 'needAttention',
  },
];
