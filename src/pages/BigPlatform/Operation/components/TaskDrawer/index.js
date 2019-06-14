import React, { PureComponent } from 'react';
import { connect } from 'dva';
import CustomDrawer from '@/jingan-components/CustomDrawer';
import CustomTabs from '@/jingan-components/CustomTabs';
import CustomSelect from '@/jingan-components/CustomSelect';
import TaskCard from '@/jingan-components/TaskCard';
// 引入样式文件
import styles from './index.less';

const typeDict = {
  消防主机: 1,
  独立烟感: 2,
  报修: 3,
};
const processDict = {
  待处理: 1,
  处理中: 2,
  已处理: 3,
};
// 状态
const statusDict = {
  1: '火警',
  2: '故障',
};

@connect(({ operation, loading }) => ({
  operation,
  loading: loading.effects['operation/fetchTaskList'],
}))
export default class TaskDrawer extends PureComponent {
  state = {
    activeType: '消防主机',
    activeStatus: '0',
  }

  scroll = null;

  componentDidUpdate({ visible: prevVisible }) {
    const { visible } = this.props;
    if (!prevVisible && visible) {
      this.handleTabClick('消防主机');
    }
  }

  setScrollReference = (scroll) => {
    this.scroll = scroll && scroll.dom;
  }

  getTaskList = ({
    activeType=this.state.activeType,
    activeStatus=this.state.activeStatus,
  }) => {
    const {
      dispatch,
      process,
    } = this.props;
    dispatch({
      type: 'operation/fetchTaskList',
      payload: {
        process: processDict[process],
        type: typeDict[activeType],
        status: activeStatus !== 0 && activeStatus,
      },
    });
  }

  handleTabClick = (activeType) => {
    this.setState({ activeType, status: activeType !== '报修' ? '0' : undefined });
    this.getTaskList({ activeType });
    this.scroll && this.scroll.scrollTop();
  }

  handleSelect = (activeStatus) => {
    this.setState({ activeStatus });
    this.getTaskList({ activeStatus });
    this.scroll && this.scroll.scrollTop();
  }

  handleCardClick = (id) => {
    const { onJump } = this.props;
    onJump && onJump(id);
  }

  render() {
    const {
      operation: {
        taskList=[],
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
        value: `消防主机 (${2})`,
      },
      {
        key: '独立烟感',
        value: `独立烟感 (${1})`,
      },
      {
        key: '报修',
        value: `报修 (${2})`,
      },
    ];
    const options = [
      {
        key: '0',
        value: '全部状态',
      },
      {
        key: '1',
        value: '报警',
      },
      {
        key: '2',
        value: '故障',
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
                    data={options}
                    value={activeStatus}
                    onSelect={this.handleSelect}
                  />
                )}
              </div>
            </div>
          ),
          scrollProps: {
            ref: this.setScrollReference,
            className: styles.scroll,
          },
          spinProps: {
            loading,
          },
        }}
      >
        <div className={styles.container}>
          {Array.isArray(taskList) && taskList.map(item => (
            <TaskCard
              className={styles.card}
              key={item.id}
              data={item}
              fieldNames={{
                type: () => activeType, // 类型
                companyName: 'companyName', // 企业名称
                partType: 'partType', // 设施部件类型
                loopNumber: 'loopNumber', // 回路号
                partNumber: 'partNumber', // 故障号
                area: 'area', // 区域
                location: 'location', // 位置
                startTime: 'startTime', // 报警/报修时间
                endTime: 'endTime', // 结束时间
                status: ({ status }) => statusDict[status], // 状态
                wordOrderNumber: 'wordOrderNumber', // 工单编号
                repairPersonName: 'repairPersonName', // 报修人员名称
                repairPersonPhone: 'repairPersonPhone', // 报修人员手机号
                process: () => process, // 处理状态
              }}
              onClick={this.handleCardClick}
            />
          ))}
        </div>
      </CustomDrawer>
    );
  }
}
