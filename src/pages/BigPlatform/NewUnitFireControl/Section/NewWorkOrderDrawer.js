import React, { PureComponent } from 'react';
import moment from 'moment';
import { Spin, Tooltip, Select } from 'antd';
import TotalInfo from '../components/TotalInfo';
import { vaguePhone } from '../utils';
// import LoadMoreButton from '../../Safety/Company3/components/LoadMoreButton';
import LoadMore from '@/components/LoadMore'; // 加载更多按钮
import styles from './NewWorkOrderDrawer.less';
import DrawerContainer from '../components/DrawerContainer';
import numberBg from '../imgs/number-bg.png';
import noData from '../imgs/noData.png';
import bakFlag from '@/assets/bac-flag.png';

const { Option } = Select;
const NO_DATA = '暂无信息';
const TYPES = ['报警', '故障'];
const STATUS_MAP = ['待处理', '处理中', '已处理'];
const LABELS = [['报警', '故障'], ['报警', '故障'], ['报警', '故障'], []];
const statusSelector = [
  { value: 'all', name: '类型' },
  { value: 'warning', name: '报警' },
  { value: 'fault', name: '故障' },
];

function formatTime(time) {
  return moment(time).format('YYYY-MM-DD HH:mm:ss');
}

function OrderCard(props) {
  const {
    type, // 0报警 1故障
    data,
    workOrderType = 0,
    workOrderStatus,
    // onClick,
    phoneVisible,
    showWorkOrderDetail,
    hover,
    index,
    handleMouseEnter,
    handleMouseLeave,
    // ...restProps
  } = props;
  // const timeStr = workOrderType === 3 && type === 1 ? '报修' : TYPES[type];
  const timeStr = workOrderType === 3 && type === 1 ? '报修' : '发生';

  const {
    componentName, // 消防主机名称
    area, // 烟感/气体区域
    location, // 烟感/气体位置
    realTimeData, // 气体值
    componentRegion,
    componentNo,
    createTime, // 消防主机时间
    realtime, // 可燃气体/烟感时间
    createDate, // 一键报修时间
    installAddress, // 主机位置
    proceType,
    workOrder, // 工单编号
    systemTypeValue, // 一键报修名称
    fireChildren,
    // sdeviceName,
    createByName,
    createByPhone,
    executorName,
    phone,
    id,
    gasId,
    firstTime,
    lastTime,
    faultName,
    proceId,
    proceStatus,
    endDate,
    cameraMessage,
    ndeviceName,
  } = data;
  const titles = [componentName, area + location, area + location, systemTypeValue];
  const listItems = [
    [
      {
        name: '回路号',
        value:
          componentRegion || componentRegion === 0
            ? `${componentRegion}回路${componentNo}号`
            : componentNo,
      },
      { name: '详细位置', value: installAddress },
      { name: `${timeStr}时间`, value: formatTime(firstTime) },
    ],
    [
      // { name: '安装位置', value: [area, location].join('') },
      // { name: '所在位置', value: location },
      { name: `${timeStr}时间`, value: formatTime(firstTime) },
    ],
    [
      { name: '报警值', value: `LEL(${realTimeData}%)` },
      { name: '所在区域', value: area },
      { name: '所在位置', value: location },
      { name: `${timeStr}时间`, value: formatTime(firstTime) },
    ],
    [
      // { name: '工单编号', value: workOrder },
      { name: '设备名称', value: ndeviceName },
      { name: '报修人员', value: `${createByName} ${vaguePhone(createByPhone, phoneVisible)}` },
      { name: `${timeStr}时间`, value: formatTime(createDate) },
    ],
  ];
  let statusStr;
  if (workOrderType === 0) {
    if (workOrderStatus === 0) statusStr = type === 1 ? '故障发生' : '待确认';
    else if (workOrderStatus === 1)
      statusStr = type === 1 ? '正在处理中' : `已确认为 ${+proceType === 1 ? '误报' : '真实'}报警`;
    else if (workOrderStatus === 2) {
      statusStr = type === 1 ? '故障已处理完毕' : `火警处理完毕`;
    }
  } else if (workOrderType === 1) {
    if (workOrderStatus === 0) statusStr = type === 1 ? '待处理' : '待确认';
    else if (workOrderStatus === 1)
      statusStr = type === 1 ? '正在处理中' : `已确认为 ${+proceType === 1 ? '误报' : '真实'}报警`;
    else if (workOrderStatus === 2) {
      statusStr = `${type === 0 ? '报警' : '故障'}已处理完毕`;
    }
  } else if (workOrderType === 2) {
    if (workOrderStatus === 0) statusStr = '待确认';
    else if (workOrderStatus === 1) statusStr = '正在处理中';
    else if (workOrderStatus === 2) statusStr = `报警已处理完毕`;
  } else if (workOrderType === 3) {
    if (workOrderStatus === 0) statusStr = '等待维修';
    else if (workOrderStatus === 1) statusStr = '正在维修中';
    else if (workOrderStatus === 2) {
      statusStr = `已维修完毕`;
      // listItems[workOrderType].push({
      //   name: '维修人员',
      //   value: `${executorName} ${vaguePhone(phone, phoneVisible)}`,
      // });
    }
  }
  const repeat = (
    <div className={styles.repeatTimes}>
      <div className={styles.times}>
        <span className={styles.label}>首次发生：</span>
        {moment(firstTime).format('YYYY-MM-DD HH:mm:ss')}
      </div>
      <div className={styles.times}>
        <span className={styles.label}>最近发生：</span>
        {moment(lastTime).format('YYYY-MM-DD HH:mm:ss')}
      </div>
    </div>
  );

  return (
    <div className={styles.outer}>
      <div className={styles.card}>
        {/* <div className={styles.card} {...restProps}> */}
        {/* {workOrderType !== 3 &&
          fireChildren &&
          fireChildren.length > 1 && (
            <div className={styles.repeat}>
              <div
                className={styles.number}
                style={{
                  background: `url(${
                    hover ? numberBg : bakFlag
                  }) center center / 100% 100% no-repeat`,
                  // backgroundSize: '100% 100%',
                }}
                // onMouseEnter={() => handleMouseEnter(index)}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {fireChildren.length}
              </div>
              重复上报次数
            </div>
          )} */}
        {workOrderType !== 3 &&
          fireChildren &&
          fireChildren.length > 1 && (
            <Tooltip placement={'bottomRight'} title={repeat}>
              <div className={styles.repeat}>
                重复上报 <span style={{ fontSize: '20px' }}>{fireChildren.length}</span> 次
              </div>
            </Tooltip>
          )}
        <p className={styles.name}>
          {workOrderType !== 3 && (
            <span className={type === 0 ? styles.warning : styles.fault}>
              {type === 0 ? LABELS[workOrderType][type] : LABELS[workOrderType][type]}
            </span>
          )}
          <Tooltip placement={'bottomLeft'} title={titles[workOrderType]}>
            <span className={styles.cardName}>{titles[workOrderType] || ''}</span>
          </Tooltip>
        </p>
        {listItems[workOrderType].map((item, index) => {
          const { name, value } = item;
          return (
            <p key={index}>
              <span className={styles.left}>{name}：</span>
              {value || NO_DATA}
            </p>
          );
        })}
        {proceStatus === '1' && (
          <p>
            <span className={styles.left}>完成时间：</span>
            {formatTime(endDate)}
          </p>
        )}
        <div
          className={styles.moreDetail}
          onClick={() => {
            const param = {
              id: workOrderType === 3 ? proceId : undefined,
              dataId:
                workOrderType !== 3
                  ? workOrderType === 2 || workOrderType === 1
                    ? gasId
                    : id
                  : undefined,
            };
            // const repeat = {
            //   times: fireChildren && fireChildren.length,
            //   lastreportTime: lastTime,
            // };
            const occurData = [
              {
                create_time: createTime,
                create_date: createDate,
                firstTime,
                lastTime,
                area,
                location,
                install_address: installAddress,
                label: componentName || systemTypeValue,
                work_order: workOrder,
                systemTypeValue,
                createByName,
                createByPhone,
                faultName,
                realtime,
                num: fireChildren && fireChildren.length,
                component_region: componentRegion,
                component_no: componentNo,
              },
            ];

            showWorkOrderDetail(
              param,
              workOrderType,
              type < 0 ? 1 : type,
              workOrderStatus === 0 ? occurData : undefined,
              cameraMessage || []
            );
          }}
        >
          处理动态>>
        </div>
        {/* <p>
          <span className={styles.left}>当前状态：</span>
          <span style={{ color: '#00ffff' }}>{statusStr}</span>
          <span
            className={styles.moreDetail}
            onClick={() => {
              const param = {
                id: workOrderType === 3 ? proceId : undefined,
                dataId:
                  workOrderType !== 3
                    ? workOrderType === 2 || workOrderType === 1
                      ? gasId
                      : id
                    : undefined,
              };
              const repeat = {
                times: fireChildren && fireChildren.length,
                lastreportTime: lastTime,
              };
              const occurData = [
                {
                  create_time: createTime,
                  create_date: createDate,
                  firstTime,
                  lastTime,
                  area,
                  location,
                  install_address: installAddress,
                  label: componentName || systemTypeValue,
                  work_order: workOrder,
                  systemTypeValue,
                  createByName,
                  createByPhone,
                  faultName,
                  realtime,
                  num: fireChildren && fireChildren.length,
                },
              ];

              showWorkOrderDetail(
                param,
                workOrderType,
                type,
                workOrderStatus === 0 ? occurData : undefined
              );
            }}
          >
            处理动态>>
          </span>
        </p> */}
      </div>
    </div>
  );
}

export default class NewWorkOrderDrawer extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      hover: undefined,
    };
  }

  handleSelectType = val => {
    const { handleSelectWorkOrderType } = this.props;
    handleSelectWorkOrderType(val);
  };

  handleMouseEnter = index => {
    this.setState({ hover: index });
  };

  handleMouseLeave = () => {
    this.setState({ hover: undefined });
  };

  render() {
    const {
      warnDetail: {
        pagination: { listSize: warnTotal, pageNum: warnPageNum, pageSize: warnPageSize },
        list: warnDetailList,
      },
      faultDetail: {
        pagination: { listSize: faultTotal, pageNum: faultPageNum, pageSize: faultPageSize },
        list: faultDetailList,
      },
      countFinishByUserId,
      data,
      onClose,
      handleClickTab,
      workOrderType,
      workOrderStatus,
      handleParentChange,
      warnDetailLoading,
      faultDetailLoading,
      getWarnDetail,
      getFaultDetail,
      showWorkOrderDetail,
      phoneVisible,
      allDetailLoading,
      allDetail: {
        pagination: { listSize: allTotal, pageNum: allPageNum, pageSize: allPageSize },
        list: allDetailList,
      },
      getAllDetail,
      workOrderSelectType,
      ...restProps
    } = this.props;

    const { hover } = this.state;

    const val = 0;

    const topData = [
      { name: '消防主机', value: val, list: [] },
      {
        name: '独立烟感',
        value: val,
        list: [],
      },
      // {
      //   name: '可燃气体',
      //   value: val,
      //   list: [],
      // },
      { name: '报修', value: val, list: [] },
    ].map((item, index) => {
      // 去掉了可燃气体
      // 0,1,2,3  ====>  0,1,3
      const indexs = [0, 1, 3];
      const num = indexs[index];
      return {
        ...item,
        color: '#fff',
        value: countFinishByUserId[num][workOrderSelectType] || 0,
        onClick: () => {
          if (document.getElementById(`workOrderScroll`))
            document.getElementById(`workOrderScroll`).scrollTop = 0;
          handleClickTab(num);
        },
        // warnDetailLoading || faultDetailLoading
        //   ? undefined
        //   : () => {
        //       [0, 1].forEach(item => {
        //         if (document.getElementById(`workOrderScroll${item}`))
        //           document.getElementById(`workOrderScroll${item}`).scrollTop = 0;
        //       });
        //       handleClickTab(index);
        //     },
      };
    });

    let detailList = [],
      pageNum = 1,
      pageSize = 10,
      total = 0;
    switch (workOrderSelectType) {
      case 'all':
        detailList = allDetailList;
        pageNum = allPageNum;
        pageSize = allPageSize;
        total = allTotal;
        break;
      case 'warning':
        detailList = warnDetailList;
        pageNum = warnPageNum;
        pageSize = warnPageSize;
        total = warnTotal;
        break;
      default:
        detailList = faultDetailList;
        pageNum = faultPageNum;
        pageSize = faultPageSize;
        total = faultTotal;
        break;
    }
    if (workOrderType === 3) {
      // 一键报修
      detailList = allDetailList;
      pageNum = allPageNum;
      pageSize = allPageSize;
      total = allTotal;
    }
    const isLoadMore = pageNum * pageSize < total;
    const left = (
      <div className={styles.container}>
        <div className={styles.topWrapper}>
          <TotalInfo
            data={topData}
            active={workOrderType}
            loading={!!(allDetailLoading || warnDetailLoading || faultDetailLoading)}
            style={{ flex: 1 }}
          />
          <Select
            value={workOrderSelectType}
            onSelect={this.handleSelectType}
            className={styles.select}
            dropdownClassName={styles.dropDown}
            style={{ opacity: workOrderType !== 3 ? 1 : 0 }}
          >
            {statusSelector.map(item => {
              const { value, name } = item;
              return (
                <Option
                  key={value}
                  value={value}
                  data={item}
                  style={{
                    color: workOrderSelectType === value && '#00ffff',
                  }}
                >
                  {name}
                </Option>
              );
            })}
          </Select>
        </div>

        <div className={styles.cards}>
          <Spin
            spinning={!!(allDetailLoading || warnDetailLoading || faultDetailLoading)}
            wrapperClassName={styles.spin}
          >
            <div className={styles.scrollContainer} id={`workOrderScroll`}>
              {detailList.length > 0 ? (
                <div style={{ height: '100%' }}>
                  {detailList.map((item, index) => {
                    const { fireType } = item;
                    return (
                      <OrderCard
                        key={index}
                        type={+fireType - 1}
                        data={item}
                        hover={hover === index}
                        workOrderType={workOrderType}
                        workOrderStatus={workOrderStatus}
                        showWorkOrderDetail={showWorkOrderDetail}
                        phoneVisible={phoneVisible}
                        index={index}
                        handleMouseEnter={() => this.handleMouseEnter(index)}
                        handleMouseLeave={this.handleMouseLeave}
                      />
                    );
                  })}
                  {isLoadMore && (
                    <div className={styles.loadMoreWrapper}>
                      <LoadMore
                        onClick={() => {
                          const fetchDetail =
                            workOrderSelectType === 'all'
                              ? getAllDetail
                              : workOrderSelectType === 'warning'
                                ? getWarnDetail
                                : getFaultDetail;
                          fetchDetail(workOrderStatus, workOrderType, pageNum + 1);
                        }}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div
                  style={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    textAlign: 'center',
                    color: '#4f6793',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <img
                    src={noData}
                    style={{ width: '36%', height: 'auto', marginTop: '-150px' }}
                    alt="noData"
                  />
                  <div style={{ marginTop: '15px' }}>暂无工单</div>
                </div>
              )}
            </div>
          </Spin>
        </div>
      </div>
    );

    return (
      <DrawerContainer
        title={`${STATUS_MAP[workOrderStatus]}工单`}
        width={535}
        left={left}
        destroyOnClose={true}
        zIndex={1040}
        onClose={() => {
          onClose();
          setTimeout(() => {
            handleParentChange({ workOrderType: 0, workOrderSelectType: 'all' });
          }, 200);
        }}
        {...restProps}
      />
    );
  }
}
