import React, { PureComponent } from 'react';
import { connect } from 'dva';
import CustomDrawer from '@/jingan-components/CustomDrawer';
import CustomTabs from '@/jingan-components/CustomTabs';
import CustomSelect from '@/jingan-components/CustomSelect';
import TaskCard from '@/jingan-components/TaskCard';
import LoadMore from '@/jingan-components/LoadMore';
// 引入图片文件
import emptyDataBackground from '@/assets/noTask.png';
// 引入样式文件
import styles from './index.less';

const typeDict = {
  消防主机: 1,
  独立烟感: 4,
  报修: 2,
};
const processDict = {
  待处理: 2,
  处理中: 0,
  已处理: 1,
};
const statusDict = {
  火警: 1,
  故障: 2,
};
const statusList = [
  {
    key: '火警',
    value: '火警',
  },
  {
    key: '故障',
    value: '故障',
  },
];
const DEFAULT_PAGE_SIZE = 20;
const EmptyData = ({ msg, ...props }) => <div className={styles.emptyData} {...props}><img src={emptyDataBackground} alt="空数据"/><div>{msg}</div></div>;

@connect(({ operation, loading }) => ({
  operation,
  loading: loading.effects['operation/fetchTaskList'],
}))
export default class TaskDrawer extends PureComponent {
  state = {
    activeType: '消防主机',
    activeStatus: '火警',
  }

  scroll = null;

  lastActiveStatus = '火警';

  componentDidUpdate({ visible: prevVisible }) {
    const { visible } = this.props;
    if (!prevVisible && visible) {
      this.getTaskList({
        activeType: '消防主机',
        activeStatus: '火警',
      }, () => {
        this.setState({
          activeType: '消防主机',
          activeStatus: '火警',
        });
      });
    }
  }

  setScrollReference = (scroll) => {
    this.scroll = scroll && scroll.dom;
  }

  getTaskList = ({
    activeType=this.state.activeType,
    activeStatus=this.state.activeStatus,
    pageNum=1,
  }, callback) => {
    const {
      dispatch,
      process,
    } = this.props;
    dispatch({
      type: 'operation/fetchTaskList',
      payload: {
        pageNum,
        pageSize: DEFAULT_PAGE_SIZE,
        status: processDict[process],
        reportType: typeDict[activeType],
        type: statusDict[activeStatus],
      },
      callback: () => {
        callback && callback();
        pageNum === 1 && this.scroll && this.scroll.scrollTop();
      },
    });
  }

  handleTabClick = (activeType) => {
    const { activeStatus: prevActiveStatus, activeType: prevActiveType } = this.state;
    let activeStatus = prevActiveStatus;
    if (prevActiveType === '报修') {
      if (activeType !== '报修') {
        activeStatus = this.lastActiveStatus;
      }
    } else if (activeType === '报修') {
      this.lastActiveStatus = prevActiveStatus;
      activeStatus = '故障';
    }
    const payload = { activeType, activeStatus };
    this.getTaskList(payload, () => {
      this.setState(payload);
    });
  }

  handleSelect = (activeStatus) => {
    this.getTaskList({ activeStatus }, () => {
      this.setState({ activeStatus });
    });
  }

  handleCardClick = (id) => {
    const { onJump } = this.props;
    onJump && onJump(id);
  }

  handleLoadMore = () => {
    const {
      operation: {
        taskList: {
          pagination: {
            pageNum=1,
          }={},
        }={},
      },
    } = this.props;
    this.getTaskList({ pageNum: pageNum + 1 });
  }

  render() {
    const {
      operation: {
        taskList: {
          list=[],
          pagination: {
            pageNum=1,
            pageSize=DEFAULT_PAGE_SIZE,
            total=0,
          }={},
          count: {
            消防主机: fire=0,
            独立烟感: gas=0,
            报修: repair=0,
          }={},
        }={},
      }={},
      loading,
      visible,
      onClose,
      process,
    } = this.props;
    const { activeType, activeStatus } = this.state;
    const tabs = [
      {
        key: '消防主机',
        value: `消防主机 (${fire})`,
      },
      {
        key: '独立烟感',
        value: `独立烟感 (${gas})`,
      },
      {
        key: '报修',
        value: `报修 (${repair})`,
      },
    ];

    return (
      <CustomDrawer
        title={`${process}任务`}
        visible={visible}
        onClose={onClose}
        sectionProps={{
          fixedContent: (
            <div className={styles.fixedContent}>
              <div>
                <CustomTabs
                  activeKey={activeType}
                  data={tabs}
                  onClick={this.handleTabClick}
                />
              </div>
              <div>
                {activeType !== tabs[2].key && (
                  <CustomSelect
                    data={statusList}
                    value={activeStatus}
                    onSelect={this.handleSelect}
                  />
                )}
              </div>
            </div>
          ),
          scrollProps: {
            ref: this.setScrollReference,
          },
          spinProps: {
            loading,
            wrapperClassName: styles.spin,
          },
        }}
      >
        <div className={styles.container}>
          {Array.isArray(list) && list.length > 0 ? list.map((item) => (
            <TaskCard
              className={styles.card}
              key={item.id || item.proceId}
              data={item}
              fieldNames={{
                id: ({ id, proceId }) => activeType !== '报修' ? id : proceId,
                type: () => activeType, // 类型
                companyName: ({ companyName, rcompanyName }) => activeType !== '报修' ? companyName : rcompanyName, // 企业名称
                partType: 'componentName', // 设施部件类型
                loopNumber: 'componentRegion', // 回路号
                partNumber: 'componentNo', // 故障号
                area: ({ area }) => activeType === '消防主机' ? undefined : area, // 区域
                location: ({ installAddress, location }) => activeType === '消防主机' ? installAddress : location, // 位置
                startTime: ({ createTime, realtime, createDate }) => ({ 消防主机: createTime, 独立烟感: realtime, 报修: createDate })[activeType], // 报警/报修时间
                endTime: 'endDate', // 结束时间
                status: () => activeStatus, // 状态
                wordOrderNumber: 'workOrder', // 工单编号
                repairPersonName: 'createByName', // 报修人员名称
                repairPersonPhone: ({ createByPhone }) => createByPhone && `${createByPhone}`.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2'), // 报修人员手机号
                process: () => process, // 处理状态
              }}
              onClick={this.handleCardClick}
            />
          )) : <EmptyData msg={`暂无${activeType !== '报修' ? '火警' : ''}${activeType}${process}任务`} />}
          {total > pageNum * pageSize && <LoadMore className={styles.loadMore} onClick={this.handleLoadMore} />}
        </div>
      </CustomDrawer>
    );
  }
}
