import { Icon as LegacyIcon } from '@ant-design/compatible';
import { Tooltip } from 'antd';
// import Wave from '@/jingan-components/Wave';
import Ellipsis from '@/components/Ellipsis';
import { toFixed } from '@/utils/utils';
import moment from 'moment';
import { ParamList } from './components/Components';
import styles from './sections/Drawers/MonitorDrawer.less';
import icon1 from './imgs/icon-1.png';
import icon401 from './imgs/icon-401.png';
import icon402 from './imgs/icon-402.png';
import icon403 from './imgs/icon-403.png';
import icon404 from './imgs/icon-404.png';
import icon405 from './imgs/icon-405.png';
import icon406 from './imgs/icon-406.png';
import icon407 from './imgs/icon-407.png';
import icon408 from './imgs/icon-408.png';
import icon409 from './imgs/icon-409.png';
import icon410 from './imgs/icon-410.png';
import icon411 from './imgs/icon-411.png';
import icon412 from './imgs/icon-412.png';
import icon413 from './imgs/icon-413.png';
import icon414 from './imgs/icon-414.png';
import icon415 from './imgs/icon-415.png';
import icon416 from './imgs/icon-416.png';
import warehouse from './imgs/warehouse.png';

import drawer1 from './imgs/drawer/drawer-1.png';
import drawer401 from './imgs/drawer/drawer-401.png';
import drawer402 from './imgs/drawer/drawer-402.png';
import drawer403 from './imgs/drawer/drawer-403.png';
import drawer404 from './imgs/drawer/drawer-404.png';
import drawer405 from './imgs/drawer/drawer-405.png';
import drawer406 from './imgs/drawer/drawer-406.png';
import drawer407 from './imgs/drawer/drawer-407.png';
import drawer408 from './imgs/drawer/drawer-408.png';
import drawer409 from './imgs/drawer/drawer-409.png';
import drawer410 from './imgs/drawer/drawer-410.png';
import drawer411 from './imgs/drawer/drawer-411.png';
import drawer412 from './imgs/drawer/drawer-412.png';
import drawer413 from './imgs/drawer/drawer-413.png';
import drawer414 from './imgs/drawer/drawer-414.png';
import drawer415 from './imgs/drawer/drawer-415.png';
import drawer416 from './imgs/drawer/drawer-416.png';
import drawer301 from './imgs/drawer/drawer-301.png';
// import drawer302 from './imgs/drawer/drawer-302.png';
import drawer302 from './imgs/drawer-302.png';
import drawer303 from './imgs/drawer/drawer-303.png';
import drawer304 from './imgs/drawer/drawer-304.png';

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

const TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';

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
    detailUrl: 'major-hazard-info/storage-area-management/detail',
    drawerIcon: drawer301,
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
    iconStyle: {
      width: '10em',
      height: '11.8315em',
    },
    drawerIcon: drawer302,
    labelStyle: { width: '7em' },
    btnStyles: { top: 30 },
    moreStyle: { bottom: 25 },
    detailUrl: 'major-hazard-info/storage-management/detail',
    filters: ({ tankName, areaLocation, number }, inputValue) =>
      tankName.includes(inputValue) ||
      areaLocation.includes(inputValue) ||
      number.includes(inputValue),
    filtersPlaceholder: '请输入储罐编号/名称/区域位置',
    icon: ({ warnStatus, monitorParams, allMonitorParam }) => {
      const isAlarm = +warnStatus === -1;
      const paramList = allMonitorParam || monitorParams || [];
      return (
        <div
          className={styles.iconWrapper}
          style={{
            background: `url(${
              isAlarm
                ? 'http://data.jingan-china.cn/v2/icons/icon-tank-alarm.png'
                : 'http://data.jingan-china.cn/v2/icons/icon-tank-normal.png'
            }) center center / auto 100% no-repeat`,
          }}
        >
          <ParamList params={paramList} />
        </div>
      );
    },
    fields: [
      {
        value: 'tankName',
        render: val => {
          return <span style={{ fontSize: 16 }}>{val}</span>;
        },
      },
      {
        label: '存储物质',
        value: 'chineName',
        // extra: ({ id }) => (
        //   <div className={styles.detail} style={{ right: 0, top: 0 }} onClick={() => {}}>
        //     安防措施>>
        //   </div>
        // ),
      },
      { label: '设计储量', value: 'designReserves', render: val => val + 't' },
      { label: '是否高危储罐', value: 'highRiskTank', render: val => (+val === 1 ? '是' : '否') },
      {
        // label: '区域位置',
        value: 'buildingName',
        render: (val, row) => {
          const { buildingName, floorName, area, location } = row;
          return (
            <span style={{ color: '#8198b4' }}>
              <LegacyIcon type="environment" style={{ color: '#8198b4', marginRight: 5 }} />
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
    detailUrl: 'major-hazard-info/reservoir-region-management/detail',
    drawerIcon: drawer303,
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
    detailUrl: 'major-hazard-info/storehouse/detail',
    iconStyle: {
      width: '12em',
      height: '9.8315em',
    },
    drawerIcon: drawer304,
    // icon: (
    //   <div
    //     className={styles.iconWrapper}
    //     style={{ background: `url(${warehouseImg}) center center / 100% auto no-repeat` }}
    //   />
    // ),
    icon: ({ monitorParams, allMonitorParam }) => {
      const paramList = allMonitorParam || monitorParams || [];
      return (
        <div
          className={styles.iconWrapper}
          style={{
            background: `url(${warehouse}) center center / 100% 100% no-repeat`,
          }}
        >
          <ParamList params={paramList} style={{ marginTop: 20, marginLeft: 10 }} />
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
      { label: '区域位置', value: 'position' },
      { label: '所属库区', value: 'aname' },
      { label: '库房面积（㎡）', value: 'area' },
    ],
  },
  '311': {
    // 生产装置
    title: '生产装置监测',
    detailUrl: 'major-hazard-info/production-equipments/detail',
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
    detailUrl: 'major-hazard-info/gasometer/detail',
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
    detailUrl: 'major-hazard-info/pipeline/detail',
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
    iconStyle: {
      width: '7em',
      height: '7.8315em',
    },
    // drawerIcon: drawerFlame,
    filters: ({ name, areaLocation }, inputValue) =>
      name.includes(inputValue) || areaLocation.includes(inputValue),
    filtersPlaceholder: '输入监测设备名称 / 区域位置',
    icon: ({ allMonitorParam }) => {
      const {
        paramUnit,
        realValue,
        status,
        linkStatus,
        linkStatusUpdateTime,
        dataUpdateTime,
        condition,
        limitValue,
      } = allMonitorParam[0] || {};
      return (
        <div
          className={styles.iconWrapper}
          style={{
            background: `url(${iconFlamGas}) center center / auto 100% no-repeat`,
          }}
        >
          <Tooltip
            overlayStyle={{ zIndex: 9999 }}
            title={
              +linkStatus !== -1 ? (
                status > 0 ? (
                  <div>
                    <div>
                      {`${condition === '>=' ? '超过' : '低于'}${
                        +status === 1 ? '预' : '告'
                      }警阈值 `}
                      <span style={{ color: '#ff1325' }}>
                        {toFixed(Math.abs(realValue - limitValue))}
                      </span>
                      {` ${paramUnit || ''}`}
                    </div>
                    <div>{`最近更新时间：${moment(dataUpdateTime).format(TIME_FORMAT)}`}</div>
                  </div>
                ) : (
                  `最近更新时间：${moment(dataUpdateTime).format(TIME_FORMAT)}`
                )
              ) : (
                `失联时间：${moment(linkStatusUpdateTime).format(TIME_FORMAT)}`
              )
            }
          >
            <div
              style={{
                color: status > 0 ? '#ff1225' : '#fff',
                flex: 'none',
                marginTop: '-16%',
                fontSize: '18px',
                fontWeight: 'bold',
              }}
            >
              {+linkStatus !== -1 ? realValue : '--'}
            </div>
          </Tooltip>
        </div>
      );
    },
    fields: [
      {
        value: 'allMonitorParam',
        render: (val = []) => {
          const { paramDesc, paramUnit } = val[0] || {};
          return <span style={{ color: '#8198b4' }}>{`${paramDesc}(${paramUnit})`}</span>;
        },
      },
      {
        value: 'allMonitorParam',
        render: (val = []) => {
          const {
            paramUnit,
            realValue,
            status,
            linkStatus,
            linkStatusUpdateTime,
            dataUpdateTime,
            condition,
            limitValue,
          } = val[0] || {};
          return (
            <Tooltip
              overlayStyle={{ zIndex: 9999 }}
              title={
                +linkStatus !== -1 ? (
                  status > 0 ? (
                    <div>
                      <div>
                        {`${condition === '>=' ? '超过' : '低于'}${
                          +status === 1 ? '预' : '告'
                        }警阈值 `}
                        <span style={{ color: '#ff1325' }}>
                          {toFixed(Math.abs(realValue - limitValue))}
                        </span>
                        {` ${paramUnit || ''}`}
                      </div>
                      <div>{`最近更新时间：${moment(dataUpdateTime).format(TIME_FORMAT)}`}</div>
                    </div>
                  ) : (
                    `最近更新时间：${moment(dataUpdateTime).format(TIME_FORMAT)}`
                  )
                ) : (
                  `失联时间：${moment(linkStatusUpdateTime).format(TIME_FORMAT)}`
                )
              }
            >
              <span
                style={{
                  color: +status > 0 && +linkStatus !== -1 ? '#ff1225' : '#fff',
                  fontSize: '18px',
                  fontWeight: 'bold',
                }}
              >
                {+linkStatus !== -1 ? realValue : '--'}
              </span>
            </Tooltip>
          );
        },
      },
      {
        value: 'name',
        render: val => {
          return <span>{val}</span>;
        },
      },
      {
        value: 'areaLocation',
        render: val => {
          return (
            <span>
              <LegacyIcon type="environment" style={{ color: '#8198b4', marginRight: 5 }} />
              {val}
            </span>
          );
        },
      },
    ],
  },
  '406': {
    // 可燃气体监测
    title: '有毒气体监测',
    iconStyle: {
      width: '7em',
      height: '7.8315em',
    },
    // drawerIcon: drawerToxic,
    filters: ({ name, areaLocation }, inputValue) =>
      name.includes(inputValue) || areaLocation.includes(inputValue),
    filtersPlaceholder: '输入监测设备名称 / 区域位置',
    icon: ({ allMonitorParam }) => {
      const {
        paramUnit,
        realValue,
        status,
        linkStatus,
        linkStatusUpdateTime,
        dataUpdateTime,
        condition,
        limitValue,
      } = allMonitorParam[0] || {};
      return (
        <div
          className={styles.iconWrapper}
          style={{
            background: `url(${iconToxicGas}) center center / auto 100% no-repeat`,
          }}
        >
          <Tooltip
            overlayStyle={{ zIndex: 9999 }}
            title={
              +linkStatus !== -1 ? (
                status > 0 ? (
                  <div>
                    <div>
                      {`${condition === '>=' ? '超过' : '低于'}${
                        +status === 1 ? '预' : '告'
                      }警阈值 `}
                      <span style={{ color: '#ff1325' }}>
                        {toFixed(Math.abs(realValue - limitValue))}
                      </span>
                      {` ${paramUnit || ''}`}
                    </div>
                    <div>{`最近更新时间：${moment(dataUpdateTime).format(TIME_FORMAT)}`}</div>
                  </div>
                ) : (
                  `最近更新时间：${moment(dataUpdateTime).format(TIME_FORMAT)}`
                )
              ) : (
                `失联时间：${moment(linkStatusUpdateTime).format(TIME_FORMAT)}`
              )
            }
          >
            <div
              style={{
                color: status > 0 ? '#ff1225' : '#fff',
                flex: 'none',
                marginTop: '-16%',
                fontSize: '18px',
                fontWeight: 'bold',
              }}
            >
              {+linkStatus !== -1 ? realValue : '--'}
            </div>
          </Tooltip>
        </div>
      );
    },
    fields: [
      {
        value: 'allMonitorParam',
        render: (val = []) => {
          const { paramDesc, paramUnit } = val[0] || {};
          return <span style={{ color: '#8198b4' }}>{`${paramDesc}(${paramUnit})`}</span>;
        },
      },
      {
        value: 'allMonitorParam',
        render: (val = []) => {
          const {
            paramUnit,
            realValue,
            status,
            linkStatus,
            linkStatusUpdateTime,
            dataUpdateTime,
            condition,
            limitValue,
          } = val[0] || {};
          return (
            <Tooltip
              overlayStyle={{ zIndex: 9999 }}
              title={
                +linkStatus !== -1 ? (
                  status > 0 ? (
                    <div>
                      <div>
                        {`${condition === '>=' ? '超过' : '低于'}${
                          +status === 1 ? '预' : '告'
                        }警阈值 `}
                        <span style={{ color: '#ff1325' }}>
                          {toFixed(Math.abs(realValue - limitValue))}
                        </span>
                        {` ${paramUnit || ''}`}
                      </div>
                      <div>{`最近更新时间：${moment(dataUpdateTime).format(TIME_FORMAT)}`}</div>
                    </div>
                  ) : (
                    `最近更新时间：${moment(dataUpdateTime).format(TIME_FORMAT)}`
                  )
                ) : (
                  `失联时间：${moment(linkStatusUpdateTime).format(TIME_FORMAT)}`
                )
              }
            >
              <span
                style={{
                  color: +status > 0 && +linkStatus !== -1 ? '#ff1225' : '#fff',
                  fontSize: '18px',
                  fontWeight: 'bold',
                }}
              >
                {+linkStatus !== -1 ? realValue : '--'}
              </span>
            </Tooltip>
          );
        },
      },
      {
        value: 'name',
        render: val => {
          return <span>{val}</span>;
        },
      },
      {
        value: 'areaLocation',
        render: val => {
          return (
            <span>
              <LegacyIcon type="environment" style={{ color: '#8198b4', marginRight: 5 }} />
              {val || '暂无位置'}
            </span>
          );
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

export const MonitorEquipmentIcons = {
  '1': icon1,
  '401': icon401,
  '402': icon402,
  '403': icon403,
  '404': icon404,
  '405': icon405,
  '406': icon406,
  '407': icon407,
  '408': icon408,
  '409': icon409,
  '410': icon410,
  '411': icon411,
  '412': icon412,
  '413': icon413,
  '414': icon414,
  '415': icon415,
  '416': icon416,
};

export const DrawerIcons = {
  '1': drawer1,
  '401': drawer401,
  '402': drawer402,
  '403': drawer403,
  '404': drawer404,
  '405': drawer405,
  '406': drawer406,
  '407': drawer407,
  '408': drawer408,
  '409': drawer409,
  '410': drawer410,
  '411': drawer411,
  '412': drawer412,
  '413': drawer413,
  '414': drawer414,
  '415': drawer415,
  '416': drawer416,
};
