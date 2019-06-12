import React, { PureComponent } from 'react';
import moment from 'moment';
import { Spin } from 'antd';
import TotalInfo from '../components/TotalInfo';
// import LoadMoreButton from '../../Safety/Company3/components/LoadMoreButton';
import LoadMore from '@/components/LoadMore'; // 加载更多按钮
import styles from './NewWorkOrderDrawer.less';
import DrawerContainer from '../components/DrawerContainer';
import numberBg from '../imgs/number-bg.png';
import noData from '../imgs/noData.png';

const NO_DATA = '暂无信息';
const TYPES = ['报警', '故障'];
const STATUS_MAP = ['待处理', '处理中', '已处理'];
const LABELS = [['主机报警', '主机报障'], ['独立烟感报警', '独立烟感故障'], ['可燃气体报警'], []];

function formatTime(time) {
  return moment(time).format('YYYY-MM-DD HH:mm:ss');
}

function OrderCard(props) {
  const {
    type, // 0报警 1故障
    data,
    workOrderType = 0,
    workOrderStatus,
    ...restProps
  } = props;
  const timeStr = workOrderType === 3 && type === 1 ? '报修' : TYPES[type];

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
    sdeviceName,
    createByName,
    createByPhone,
    executorName,
    phone,
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
      { name: `${timeStr}时间`, value: formatTime(createTime) },
    ],
    [
      { name: '所在区域', value: area },
      { name: '所在位置', value: location },
      { name: `${timeStr}时间`, value: formatTime(realtime) },
    ],
    [
      { name: '报警值', value: `LEL(${realTimeData}%)` },
      { name: '所在区域', value: area },
      { name: '所在位置', value: location },
      { name: `${timeStr}时间`, value: formatTime(realtime) },
    ],
    [
      { name: '工单编号', value: workOrder },
      { name: `${timeStr}时间`, value: formatTime(createDate) },
      { name: '报修人员', value: `${createByName} ${createByPhone}` },
    ],
  ];
  let statusStr;
  if (workOrderType === 0) {
    if (workOrderStatus === 0) statusStr = type === 1 ? '故障发生' : '待确认';
    else if (workOrderStatus === 1)
      statusStr = type === 1 ? '正在处理中' : `已确认为 ${+proceType === 1 ? '误报' : '真实'}火警`;
    else if (workOrderStatus === 2) {
      statusStr = type === 1 ? '故障已处理完毕' : `火警处理完毕`;
    }
  } else if (workOrderType === 1) {
    if (workOrderStatus === 0) statusStr = type === 1 ? '待处理' : '待确认';
    else if (workOrderStatus === 1)
      statusStr = type === 1 ? '正在处理中' : `已确认为 ${+proceType === 1 ? '误报' : '真实'}火警`;
    else if (workOrderStatus === 2) {
      statusStr = `${type === 0 ? '火警' : '故障'}已处理完毕`;
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
      listItems[workOrderType].push({
        name: '维修人员',
        value: `${executorName} ${phone}`,
      });
    }
  }

  return (
    <div className={styles.outer}>
      <div className={styles.card}>
        {/* <div className={styles.card} {...restProps}> */}
        {workOrderType !== 3 &&
          fireChildren &&
          fireChildren.length > 1 && (
            <div
              className={styles.number}
              style={{
                background: `url(${numberBg})`,
                backgroundSize: '100% 100%',
              }}
            >
              {fireChildren.length}
            </div>
          )}
        <p className={styles.name}>
          {titles[workOrderType] || ''}
          {workOrderType !== 3 && (
            <span className={styles.info}>
              {type === 0 ? LABELS[workOrderType][type] : LABELS[workOrderType][type]}
            </span>
          )}
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
        <p>
          <span className={styles.left}>当前状态：</span>
          <span style={{ color: '#00ffff' }}>{statusStr}</span>
          <span className={styles.moreDetail}>处理动态>></span>
        </p>
      </div>
    </div>
  );
}

export default class NewWorkOrderDrawer extends PureComponent {
  state = { isWarned: false };

  render() {
    const {
      warnDetail: {
        pagination: { listSize: total, pageNum, pageSize },
        list: warnDetailList,
      },
      faultDetail: {
        pagination: { listSize: totalFault, pageNum: pageNumFault, pageSize: pageSizeFault },
        list: faultDetailList,
      },
      countFinishByUserId,
      handleCardClick,
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
      ...restProps
    } = this.props;

    const val = 0;

    const topData = [
      { name: '消防主机', value: val, list: [] },
      {
        name: '独立烟感',
        value: val,
        list: [],
      },
      {
        name: '可燃气体',
        value: val,
        list: [],
      },
      { name: '一键报修', value: val, list: [] },
    ].map((item, index) => {
      return {
        ...item,
        color: '#fff',
        value: countFinishByUserId[index],
        onClick: () => {
          [0, 1].forEach(item => {
            if (document.getElementById(`workOrderScroll${item}`))
              document.getElementById(`workOrderScroll${item}`).scrollTop = 0;
          });
          handleClickTab(index);
        },
      };
    });

    const left = (
      <div className={styles.container}>
        <TotalInfo data={topData} active={workOrderType} />
        {[0, 1].map(type => {
          if (type === 0 && workOrderType === 3) return null;
          if (type === 1 && workOrderType === 2) return null;
          const newList = type === 0 ? warnDetailList : faultDetailList;
          const isLoadMore =
            type === 0 ? pageNum * pageSize < total : pageNumFault * pageSizeFault < totalFault;
          return (
            <div className={styles.cards} key={type}>
              <Spin
                spinning={type === 0 ? warnDetailLoading : faultDetailLoading}
                wrapperClassName={styles.spin}
              >
                <div className={styles.scrollContainer} id={`workOrderScroll${type}`}>
                  {newList.length > 0 ? (
                    <div style={{ height: '100%' }}>
                      {newList.map((item, index) => (
                        <OrderCard
                          key={index}
                          type={type}
                          data={item}
                          workOrderType={workOrderType}
                          workOrderStatus={workOrderStatus}
                          onClick={e => handleCardClick(item)}
                        />
                      ))}
                      {isLoadMore && (
                        <div className={styles.loadMoreWrapper}>
                          <LoadMore
                            onClick={() => {
                              type === 0
                                ? getWarnDetail(workOrderStatus, workOrderType, pageNum + 1)
                                : getFaultDetail(workOrderStatus, workOrderType, pageNumFault + 1);
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
          );
        })}
      </div>
    );

    return (
      <DrawerContainer
        title={`${STATUS_MAP[workOrderStatus]}工单`}
        width={535}
        left={left}
        destroyOnClose={true}
        onClose={() => {
          onClose();
          setTimeout(() => {
            handleParentChange({ workOrderType: 0 });
          }, 200);
        }}
        {...restProps}
      />
    );
  }
}
